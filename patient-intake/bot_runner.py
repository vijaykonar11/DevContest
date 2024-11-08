# import datetime
import os
import argparse
import subprocess
# from model import *
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pipecat.transports.services.helpers.daily_rest import DailyRESTHelper, \
    DailyRoomObject, DailyRoomProperties, DailyRoomParams

from dotenv import load_dotenv

load_dotenv(override=True)


# ------------ Fast API Config ------------ #

MAX_SESSION_TIME = 15 * 60  # 15 minutes

DAILY_API_URL = os.getenv("DAILY_API_URL", "https://api.daily.co/v1")
DAILY_API_KEY = os.getenv("DAILY_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def escape_bash_arg(s):
    return "'" + s.replace("'", "'\\''") + "'"

def check_host_whitelist(request: Request):
    host_whitelist = os.getenv("HOST_WHITELIST", "")
    request_host_url = request.headers.get("host")

    if not host_whitelist:
        return True

    # Split host whitelist by comma
    allowed_hosts = host_whitelist.split(",")

    # Return True if no whitelist exists are specified
    if len(allowed_hosts) < 1:
        return True

    # Check for apex and www variants
    if any(domain in allowed_hosts for domain in [request_host_url, f"www.{request_host_url}"]):
        return True

    return False


# ------------ Fast API Routes ------------ #

@app.middleware("http")
async def allowed_hosts_middleware(request: Request, call_next):
    # Middle that optionally checks for hosts in a whitelist
    if not check_host_whitelist(request):
        raise HTTPException(status_code=403, detail="Host access denied")
    response = await call_next(request)
    print(response, "response")
    return response


@app.post("/")
async def index(request: Request) -> JSONResponse:
    # user_id = None
    try:
        data = await request.json()
        config_dict = data.get("config")
        # user_id = config_dict.get('user_id')

        # Is this a webhook creation request?
        if "test" in data:
            return JSONResponse({"test": True})

    except Exception as e:

        raise HTTPException(
            status_code=500, detail="Missing configuration or malformed configuration object")

    daily_rest_helper = DailyRESTHelper(DAILY_API_KEY, DAILY_API_URL)

    # debug_room = os.getenv("USE_DEBUG_ROOM", None)
    debug_room = None
    try:
        if debug_room:
            room: DailyRoomObject = daily_rest_helper.get_room_from_url(debug_room)
        else:
            params = DailyRoomParams(
                properties=DailyRoomProperties()
            )
            room: DailyRoomObject = daily_rest_helper.create_room(params=params)
    except Exception as e:

        raise HTTPException(
            status_code=500, detail=f"Failed to get or create room: {e}")

    token = daily_rest_helper.get_token(room.url, MAX_SESSION_TIME)
    if not room or not token:

        raise HTTPException(
            status_code=500, detail=f"Failed to get token for room: {room.name}")

    try:
        subprocess.Popen(
            [f"python3 -m bot -u {room.url} -t {token}"],
            shell=True,
            bufsize=1
        )
    except Exception as e:

        raise HTTPException(
            status_code=500, detail=f"Failed to start subprocess: {e}")

    try:
        user_token = daily_rest_helper.get_token(room.url, MAX_SESSION_TIME)
    except Exception as e:

        raise HTTPException(
            status_code=500, detail="Failed to get user token")

    return JSONResponse({
        "room_name": room.name,
        "room_url": room.url,
        "token": user_token
    })

# ------------ Main ------------ #

if __name__ == "__main__":
    # Check environment variables
    required_env_vars = ['DAILY_API_KEY']
    for env_var in required_env_vars:
        if env_var not in os.environ:
            raise Exception(f"Missing environment variable: {env_var}.")

    import uvicorn

    default_host = '0.0.0.0'
    default_port = '8078'

    parser = argparse.ArgumentParser(
        description="RTVI Bot Runner")
    parser.add_argument("--host", type=str,
                        default=default_host, help="Host address")
    parser.add_argument("--port", type=int,
                        default=default_port, help="Port number")
    parser.add_argument("--reload", action="store_true",
                        help="Reload code on change")

    config = parser.parse_args()

    uvicorn.run(
        "bot_runner:app",
        host=config.host,
        port=config.port,
        reload=config.reload,
    )
