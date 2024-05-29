import time
import psutil

from pydantic import BaseModel
from threading import Thread


class SystemInfoReport(BaseModel):
    cpu_temp: float  # °C
    cpu_usage: float  # %
    total_memory: int  # MB
    used_memory: int  # MB
    total_disk: int  # GB
    used_disk: int  # GB


class SystemInfoReporter:

    @staticmethod
    def get_cpu_temperature():
        with open('/sys/class/thermal/thermal_zone0/temp', 'r') as f:
            temp_str = f.read().strip()
        temp = int(temp_str) / 1000
        return temp

    @staticmethod
    def get_memory_usage():
        mem = psutil.virtual_memory()
        return mem.used / (1024 ** 2), mem.total / (1024 ** 2)

    @staticmethod
    def get_disk_usage():
        disk = psutil.disk_usage('/')
        return disk.used / (1024 ** 3), disk.total / (1024 ** 3)

    @staticmethod
    def get_cpu_usage():
        return psutil.cpu_percent(interval=1)

    def __init__(self, update_delay_ms=5000):
        self._current_data = None
        self._run = True
        self._thread = None
        self.update_delay_ms = update_delay_ms

    def start(self):
        self._run = True
        self._thread = Thread(target=self._update_cycle)
        self._thread.start()

    def stop(self):
        self._run = False
        self._thread.join()

    def get_data(self) -> SystemInfoReport:
        return self._current_data

    def _get_data(self):
        cpu_temp = SystemInfoReporter.get_cpu_temperature()
        cpu_usage = SystemInfoReporter.get_cpu_usage()
        mem_usage = SystemInfoReporter.get_memory_usage()
        disk_usage = SystemInfoReporter.get_disk_usage()

        return SystemInfoReport(cpu_temp=cpu_temp, cpu_usage=cpu_usage, used_memory=int(mem_usage[0]),
                                total_memory=int(mem_usage[1]), used_disk=int(disk_usage[0]),
                                total_disk=int(disk_usage[1]))

    def _update_cycle(self):
        while self._run:
            self._current_data = self._get_data()
            time.sleep(self.update_delay_ms / 1000)
