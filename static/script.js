const mainDiv = document.getElementById("main");

const colors = ["#31afcb", "#7f55c9", "#758cef", "#218a8a"]
const labels = ["CPU Usage", "Memory Usage", "Disk Usage"]

window.Apex = {
    chart: {
        foreColor: "#fff", toolbar: {
            show: false
        }
    }, colors: colors, stroke: {
        width: 3
    }, dataLabels: {
        enabled: false
    }, grid: {
        borderColor: "#40475D"
    }, xaxis: {
        axisTicks: {
            color: "#333"
        }, axisBorder: {
            color: "#333"
        }
    }, fill: {
        type: "full"
    }, tooltip: {
        theme: "dark"
    }, yaxis: {
        decimalsInFloat: 1, opposite: true, labels: {
            offsetX: -10
        }
    }
};

async function checkOnlineStatus(ip, onlineStatusDiv) {

    let reachableUrl = ip;
    if (ip !== "localhost") reachableUrl = `http://${reachableUrl}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    const reachable = await fetch(reachableUrl, {method: "HEAD", signal: controller.signal})
        .then(() => true)
        .catch(() => false);

    clearTimeout(timeoutId)

    onlineStatusDiv.style.backgroundColor = reachable ? "#07cb07" : "#d20707"
}


async function main() {

    const resp = await fetch("/available-devices").catch()
    const piIps = await resp.json()

    let piData = {}
    Object.entries(piIps).forEach(function ([name, ip], i) {

        const lineChartId = `lineChart${i}`
        const progressChartIds = [`progress${i}0`, `progress${i}1`, `progress${i}2`]
        const tempChartIds = [`temp${i}0`]
        const onlineStatusId = `onlineStatus${i}`

        piData[ip] = {}
        piData[ip]["onlineStatusId"] = onlineStatusId
        piData[ip]["lineChartId"] = lineChartId
        piData[ip]["progressChartIds"] = progressChartIds
        piData[ip]["tempChartsIds"] = tempChartIds

        mainDiv.innerHTML += `<details>
        <summary>
            <img alt="Computer" class="icon" height="55px" src="assets/imgs/computer.svg" style="padding: 10px">
            <div id="${onlineStatusId}" style="width: 20px; height: 20px; background-color: grey; margin: 10px; border-radius: 20px"></div>
            ${name}
            <span style="margin-left: auto; margin-right: 10px">${ip}</span>
        </summary>

        <div class="col">
            <div class="box mt-4">
                <div class="mt-4">
                    <div id="${tempChartIds[0]}"></div>
                </div>
            </div>
            <div class="box mt-4">
                <div class="mt-4">
                    <div id="${progressChartIds[0]}"></div>
                </div>
                <div class="mt-4">
                    <div id="${progressChartIds[1]}"></div>
                </div>
                <div class="mt-4">
                    <div id="${progressChartIds[2]}"></div>
                </div>
            </div>
            <div class="box mt-4">
                <div id="${lineChartId}"></div>
            </div>
        </div>
      </details>`
    })

    for (const ip of Object.keys(piData)) {
        piData[ip]["lineChart"] = createLineChart(piData[ip]["lineChartId"])
        piData[ip]["progressCharts"] = createProgressCharts(piData[ip]["progressChartIds"], labels, colors)
        piData[ip]["tempCharts"] = createProgressCharts(piData[ip]["tempChartsIds"], ["CPU Temperature"], [colors[1]])
        piData[ip]["onlineStatus"] = document.getElementById(piData[ip]["onlineStatusId"])
    }

    for (const ip of Object.keys(piData)) {
        await updateCharts(ip, piData[ip]["progressCharts"], piData[ip]["tempCharts"], piData[ip]["lineChart"])
    }
    window.setInterval(function () {
        for (const ip of Object.keys(piData)) {
            updateCharts(ip, piData[ip]["progressCharts"], piData[ip]["tempCharts"], piData[ip]["lineChart"])
            checkOnlineStatus(ip, piData[ip]["onlineStatus"])
        }
    }, 5000)
}

main()
