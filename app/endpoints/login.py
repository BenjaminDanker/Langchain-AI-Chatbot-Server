from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from pydantic import BaseModel
import msal
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# FastAPI app
app = FastAPI(title="Admin Dashboard with Azure AD Auth")

# Add session middleware
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SESSION_SECRET_KEY"))

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Azure AD Config
AZURE_CLIENT_ID = os.getenv("AZURE_CLIENT_ID")
AZURE_CLIENT_SECRET = os.getenv("AZURE_CLIENT_SECRET")
AZURE_TENANT_ID = os.getenv("AZURE_TENANT_ID")
AUTHORITY = f"https://login.microsoftonline.com/{AZURE_TENANT_ID}"
SCOPES = ["User.Read"]
REDIRECT_URIS = {
    "backend": "http://localhost:5000/auth/callback",
    "frontend": "http://localhost:3000/auth/callback"
}

# MSAL client
msal_app = msal.ConfidentialClientApplication(
    AZURE_CLIENT_ID,
    authority=AUTHORITY,
    client_credential=AZURE_CLIENT_SECRET
)

# Models
class Token(BaseModel):
    access_token: str
    token_type: str

class ErrorResponse(BaseModel):
    error: str

# Login Route
@app.get("/auth/login")
def login():
    auth_url = msal_app.get_authorization_request_url(
        scopes=SCOPES,
        redirect_uri=REDIRECT_URIS["backend"]
    )
    return RedirectResponse(auth_url)

# Callback Route
@app.get("/auth/callback")
async def auth_callback(request: Request):
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Missing authorization code.")

    result = msal_app.acquire_token_by_authorization_code(
        code,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URIS["backend"]
    )

    if "access_token" in result:
        request.session["user"] = result.get("id_token_claims")
        request.session["access_token"] = result["access_token"]
        return RedirectResponse(REDIRECT_URIS["frontend"])
    else:
        return JSONResponse(status_code=400, content={"error": result.get("error_description")})

# Protected Route to get user info
@app.get("/me")
async def get_me(request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    return {"user": user}

# Logout
@app.get("/auth/logout")
def logout(request: Request):
    request.session.clear()
    logout_url = f"{AUTHORITY}/oauth2/v2.0/logout?post_logout_redirect_uri={REDIRECT_URIS['frontend']}"
    return RedirectResponse(logout_url)
