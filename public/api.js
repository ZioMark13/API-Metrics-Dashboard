function parsePrometheusText(data) {
    const metrics = {};
    data.split('\n').forEach(line => {
        if (line !== '') {
            const parts = line.split(' ');
            const name = parts[0];
            const value = parseFloat(parts[1]);
            metrics[name] = value;
        }
    });
    return metrics;
}

function filterMetrics(metrics, ...prefixes) {
    const filteredMetrics = {};
    Object.keys(metrics).forEach(key => {
        prefixes.forEach(prefix => {
            if (key.startsWith(prefix)) {
                const metricName = key.substring(prefix.length + 1);
                filteredMetrics[metricName] = metrics[key];
            }
        });
    });
    return filteredMetrics;
}

function createChart(canvasId, title, labels, data, type = 'bar') {
    try {
        const ctx = document.getElementById(canvasId).getContext('2d');
        new Chart(ctx, {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: title,
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating chart:', error);
    }
}

fetch('http://YOUR_URL/metrics')
    .then(response => response.text())
    .then(data => {
        const metrics = parsePrometheusText(data);
        const cpuMetrics = filterMetrics(metrics, 'process_cpu');
        const cpuLabels = Object.keys(cpuMetrics);
        const cpuData = Object.values(cpuMetrics);
        const memoryMetrics = filterMetrics(metrics, 'process_resident_memory_bytes', 'nodejs_heap_size');
        const memoryLabels = Object.keys(memoryMetrics);
        const memoryData = Object.values(memoryMetrics);
        const diskLabels = ['disk1', 'disk2', 'disk3', 'disk4'];
        const diskData = Array.from({ length: diskLabels.length }, () => Math.random() * 100);
        const networkLabels = ['network1', 'network2', 'network3', 'network4'];
        const networkData = Array.from({ length: networkLabels.length }, () => Math.random() * 100);
createChart('diskMetricsChart', 'Disk Usage', diskLabels, diskData);
createChart('networkMetricsChart', 'Network Traffic', networkLabels, networkData);
        createChart('cpuMetricsChart', 'CPU Usage', cpuLabels, cpuData);
        createChart('memoryMetricsChart', 'Memory Usage', memoryLabels, memoryData);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });