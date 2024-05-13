from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

import system_info
import secrets

app = FastAPI(default_response_class=ORJSONResponse, docs_url=None, redoc_url=None)
sys_reporter = system_info.SystemInfoReporter()
sys_reporter.start()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/sysinfo")
def system_status():
    return sys_reporter.get_data()


@app.get("/available-devices")
def available_pis():
    return secrets.DEVICE_IPS


app.mount("/", StaticFiles(directory="static", html=True), name="static")
