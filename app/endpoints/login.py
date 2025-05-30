from fastapi import APIRouter, Request, HTTPException, status
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel
import msal
from app.config import settings
import logging

router = APIRouter()
 
# MSAL client
msal_app = msal.ConfidentialClientApplication(
   client_id=settings.AZURE_CLIENT_ID,
   authority=settings.AZURE_AUTHORITY,
   #settings.AZURE_TENANT_ID,
   client_credential=settings.AZURE_CLIENT_SECRET
)


# Models
class Token(BaseModel):
    access_token: str
    token_type: str

class ErrorResponse(BaseModel):
    error: str

# Login Route
@router.get("/auth/login")
def login(request: Request):
    next_url = request.query_params.get("next", "/dashboard/admin_dashboard")  # default fallback
    request.session["next_url"] = next_url
    # Hardcoded redirect_uri to the callback endpoint
    redirect_uri = settings.REDIRECT_URIS["backend"]
    auth_url = msal_app.get_authorization_request_url(
        scopes=settings.AZURE_SCOPES,
        redirect_uri=redirect_uri,
        prompt="login",
    )
    logging.info(f"Redirect URL (login): {redirect_uri}")
    return RedirectResponse(auth_url)

# Callback Route
@router.get("/auth/callback")
async def auth_callback(request: Request):
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Missing authorization code.")

    try:
        next_url = request.session.get("next_url", "/dashboard/admin_dashboard")
        # Removed session.clear() to preserve stored data
        # request.session.clear()  

        result = msal_app.acquire_token_by_authorization_code(
            code,
            settings.AZURE_SCOPES,
            redirect_uri=settings.REDIRECT_URIS["backend"],
        )
        
        if "access_token" not in result:
            logging.error(f"Auth failed: {result.get('error_description')}")
            return JSONResponse(status_code=400, content={"error": result.get("error_description")})

        # Store access token and user info in session
        request.session["access_token"] = result["access_token"]
        # Extract user info from the token payload (e.g., 'id_token')
        # and store it in the session
        user_info = result.get('id_token_claims', {}) # Assuming id_token_claims has user info
        request.session["user"] = user_info

        # Redirect to the originally requested URL
        return RedirectResponse(url=next_url, status_code=status.HTTP_302_FOUND)

    except Exception as e:
        logging.error(f"Authentication error: {e}")
        raise HTTPException(status_code=500, detail="Authentication failed.")
    
# Protected Route to get user info
@router.get("/me")
async def get_me(request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    return {"user": user}

# Logout
@router.post("/auth/logout")
def logout(request: Request):
    request.session.clear()
    logout_url = f"{settings.AZURE_AUTHORITY}/oauth2/v2.0/logout?post_logout_redirect_uri={settings.DASHBOARD_REDIRECT}"

    return RedirectResponse(logout_url)

@router.get("/session_debug")
def session_debug(request: Request):
    return {"session": dict(request.session)}

