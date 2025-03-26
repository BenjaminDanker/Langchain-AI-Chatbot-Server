from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import os
from app.config import settings

router = APIRouter()

templates = Jinja2Templates(directory=os.path.join(os.path.dirname(__file__), "..", "..", "static", "templates"))

@router.get("/wsu", response_class=HTMLResponse)
async def serve_index(request: Request):
    request.app.state.provider = request.app.state.zilliz_provider
    template = {**settings.WSU_TEMPLATE, "request": request}

    return templates.TemplateResponse("index.html", template)
