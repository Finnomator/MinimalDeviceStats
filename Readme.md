# Minimal Device Stats

This simple API allows you to monitor the health and status of your Linux system by providing essential metrics such as CPU temperature, usage, memory, and disk utilization.  
This API can be used in combination with the [Device Stats Webinterface](https://github.com/Finnomator/DeviceStats).

## Installation

1. Clone this repo
    ```sh
    git clone https://github.com/Finnomator/MinimalDeviceStats.git
    cd MinimalDeviceStats
    ```
2. Install the required python modules in `requirements.txt`
   ```sh
   pip install -r requirements.txt
   ```
3. Run `start_server.sh`
   ```sh
   ./start_server.sh
   ```

## Usage

Make a GET request to `http://[device ip]:[port]/sysinfo`.
The default port is `8923` if run with `start_server.sh`.

### Example Request

```sh
curl http://localhost:8923/sysinfo
```

## API Responses

### /sysinfo

Format: JSON

| Key          | Unit     | Type  | Description                                                                                                                                                                                                                                                                      |
|--------------|----------|-------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| cpu_temp     | °C       | float | Cpu temperature.                                                                                                                                                                                                                                                                 |
| cpu_usage    | %        | float | Represents the current system-wide CPU utilization as a percentage.                                                                                                                                                                                                              |
| total_memory | Megabyte | int   | Total physical memory available.                                                                                                                                                                                                                                                 |
| used_memory  | Megabyte | int   | Memory used, calculated differently depending on the platform and designed for informational purposes only: <br/>- macOS: active + wired <br/>- BSD: active + wired + cached <br/>- Linux: total - free (free = memory not being used at all (zeroed) that is readily available) |
| total_disk   | Gigabyte | int   | Total disk size of `/`.                                                                                                                                                                                                                                                          |
| used_disk    | Gigabyte | int   | Used disk size.                                                                                                                                                                                                                                                                  |

Example Response:

```json
{
  "cpu_temp": 39.0,
  "cpu_usage": 28.6,
  "total_memory": 429,
  "used_memory": 63,
  "total_disk": 15,
  "used_disk": 2
}
```

## Notes

- Ensure the server is running and accessible from your network.
- Modify the start_server.sh script if you need to change the default port or other configurations.