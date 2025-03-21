import os
import uvicorn
import logging
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from app import *

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Startup: initializing chains...")
    #vector_store, cached_embeddings = await initialize_vector_store_azure()
    # Store the vector store for later use
    #app.state.vector_store = vector_store
    app.state.retrieval_chain_wrapper = await initialize_retrieval_chain_zilliz()
    app.state.translation_chain = await initialize_translation_chain()
    logger.info("Chains stored in app state.")
    yield
    logger.info("Shutdown: cleaning up resources...")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def frame_control(request: Request, call_next):
    response: Response = await call_next(request)
    # If the request is for the base domain, disallow framing.
    if request.url.path == "/":
        response.headers["Content-Security-Policy"] = "frame-ancestors 'none'"
    else:
        response.headers["Content-Security-Policy"] = "frame-ancestors http://localhost:3000"
    return response

# Mount static files
static_folder = os.path.join(os.path.dirname(__file__), "..", "static")
app.mount("/static", StaticFiles(directory=static_folder), name="static")

# Include endpoints
app.include_router(base_router)
app.include_router(chatbot_router)
app.include_router(ingest_router, prefix="/api")
app.include_router(data_delete_router, prefix="/api")
app.include_router(qa_router, prefix="/api")
app.include_router(data_search_router, prefix="/api")
app.include_router(faq_router, prefix="/api")
app.include_router(transcribe_router, prefix="/api")

if __name__ == '__main__':
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=False)
