from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from starlette.status import HTTP_302_FOUND
from app.config import settings
import logging
import os

router = APIRouter()
templates = Jinja2Templates(directory=os.path.join(os.path.dirname(__file__), "..", "..", "static", "templates"))

def require_login(request: Request):
    print("🧠 AUTH CHECK: Running require_login")
    logging.info(f"Full session content: {dict(request.session)}")
    
    user = request.session.get("user")
    access_token = request.session.get("access_token")
    
    if not user or not access_token:
        logging.warning("No user or access token found in session")
        # raise HTTPException(
        #     status_code=HTTP_302_FOUND,
        #     detail="Authentication required",
        #     headers={"Location": f"{settings.LOGIN_REDIRECT}?next={request.url.path}"}
        # )
        login_url = f"{settings.LOGIN_REDIRECT}?next={request.url.path}"
        return RedirectResponse(url=login_url, status_code=302)
    
    print("✅ Logged in as:", user.get("name"))
    return user

@router.get("/admin_dashboard", response_class=HTMLResponse)
async def admin_dashboard(request: Request):
    user = request.session.get("user")
    access_token = request.session.get("access_token")

    if not user or not access_token:
        login_url = f"{settings.LOGIN_REDIRECT}?next={request.url.path}"
        return RedirectResponse(url=login_url, status_code=302)

    return templates.TemplateResponse("admin_dashboard.html", {
        "request": request,
        "user": user
    })