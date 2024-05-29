from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
from fastapi.middleware.cors import CORSMiddleware

import system_info

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
