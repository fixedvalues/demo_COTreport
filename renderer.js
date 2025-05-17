// COT Report Dashboard Demo - Renderer
// This is a standalone demo version with embedded data

// Initialize data store
let allData = {
    leveraged_funds: [],
    asset_manager: [],
    dealer: []
};
let chart1 = null;
let chart2 = null;

// Parse date string (DD/MM/YYYY) to Date object
function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
}

// Calculate signal based on zero crossing
function calculateSignal(data, index) {
    if (index === 0) return '';
    
    const currentNet = data[index].netPercent;
    const prevNet = data[index - 1].netPercent;
    
    // Buy signal: crossing from negative to positive
    if (prevNet < 0 && currentNet >= 0) {
        return 'Buy';
    }
    // Sell signal: crossing from positive to negative
    else if (prevNet > 0 && currentNet <= 0) {
        return 'Sell';
    }
    
    return '';
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Load embedded data
    await loadData();
    
    // Initialize dashboards
    initDashboard(1);
    initDashboard(2);
    
    // Initial update
    updateDashboard(1);
    updateDashboard(2);
});

// Initialize dashboard controls
function initDashboard(dashboardNum) {
    // Set up event listeners
    document.getElementById(`category${dashboardNum}`).addEventListener('change', () => updateDashboard(dashboardNum));
    document.getElementById(`currency${dashboardNum}`).addEventListener('change', () => updateDashboard(dashboardNum));
    document.getElementById(`year${dashboardNum}`).addEventListener('change', () => updateDashboard(dashboardNum));
    document.getElementById(`toggleChart${dashboardNum}`).addEventListener('click', () => toggleChart(dashboardNum));
}

// Toggle chart visibility
function toggleChart(dashboardNum) {
    const chartSection = document.getElementById(`chartSection${dashboardNum}`);
    const button = document.getElementById(`toggleChart${dashboardNum}`);
    
    if (chartSection.style.display === 'none') {
        chartSection.style.display = 'block';
        button.textContent = 'Hide Chart';
        button.classList.add('primary');
        updateChart(dashboardNum);
    } else {
        chartSection.style.display = 'none';
        button.textContent = 'Show Chart';
        button.classList.remove('primary');
    }
}

// Update dashboard with selected filters
function updateDashboard(dashboardNum) {
    const category = document.getElementById(`category${dashboardNum}`).value;
    const currency = document.getElementById(`currency${dashboardNum}`).value;
    const year = document.getElementById(`year${dashboardNum}`).value;
    
    // Get data for selected category
    let filteredData = allData[category].filter(d => d.currency === currency && d.year === parseInt(year));
    
    // Sort by date (newest first)
    filteredData.sort((a, b) => parseDate(b.date) - parseDate(a.date));
    
    // Update table (limit to 15 rows)
    updateTable(filteredData.slice(0, 15), dashboardNum);
    
    // Update chart if visible
    if (document.getElementById(`chartSection${dashboardNum}`).style.display !== 'none') {
        updateChart(dashboardNum);
    }
}

// Update the data table
function updateTable(data, dashboardNum) {
    const tableBody = document.getElementById(`dataTable${dashboardNum}`);
    
    // Sort data by date ascending for signal calculation
    const sortedData = [...data].sort((a, b) => parseDate(a.date) - parseDate(b.date));
    
    const rows = data.map((d, displayIndex) => {
        // Find the actual index in sorted data for signal calculation
        const actualIndex = sortedData.findIndex(item => item.date === d.date);
        const signal = calculateSignal(sortedData, actualIndex);
        
        const signalHtml = signal === 'Buy' 
            ? '<span class="signal-button signal-buy">↑ Net Change</span>'
            : signal === 'Sell'
            ? '<span class="signal-button signal-sell">↓ Net Change</span>'
            : '';
        
        return `
            <tr>
                <td class="table-cell">${d.date}</td>
                <td class="table-cell text-right hidden-mobile">${Math.round(d.positionsLong).toLocaleString()}</td>
                <td class="table-cell text-right hidden-mobile">${Math.round(d.positionsShort).toLocaleString()}</td>
                <td class="table-cell text-right">${d.longPercent.toFixed(1)}</td>
                <td class="table-cell text-right">${d.shortPercent.toFixed(1)}</td>
                <td class="table-cell text-right">
                    <span class="text-accent">${d.netPercent.toFixed(1)}</span>
                </td>
                <td class="table-cell text-center">${signalHtml}</td>
            </tr>
        `;
    }).join('');
    
    tableBody.innerHTML = rows || '<tr><td colspan="7" class="table-cell text-center">No data available</td></tr>';
}

// Update the chart (Net Position only)
function updateChart(dashboardNum) {
    const category = document.getElementById(`category${dashboardNum}`).value;
    const currency = document.getElementById(`currency${dashboardNum}`).value;
    const year = document.getElementById(`year${dashboardNum}`).value;
    
    let filteredData = allData[category].filter(d => d.currency === currency && d.year === parseInt(year));
    
    // Sort by date (oldest first for chart)
    filteredData.sort((a, b) => parseDate(a.date) - parseDate(b.date));
    
    const ctx = document.getElementById(`netChart${dashboardNum}`).getContext('2d');
    
    // Destroy existing chart
    if (dashboardNum === 1 && chart1) {
        chart1.destroy();
    } else if (dashboardNum === 2 && chart2) {
        chart2.destroy();
    }
    
    const chartConfig = {
        type: 'line',
        data: {
            labels: filteredData.map(d => {
                const [day, month] = d.date.split('/');
                return `${day}/${month}`;
            }),
            datasets: [{
                label: 'Net %',
                data: filteredData.map(d => d.netPercent),
                borderColor: '#EAB308',
                backgroundColor: 'transparent',
                tension: 0.2,  // Smoother curve like Recharts
                fill: false,
                borderWidth: 2,
                pointRadius: 0,  // No dots by default like Recharts
                pointHoverRadius: 6,  // Dots appear on hover
                pointBackgroundColor: '#EAB308',
                pointBorderColor: '#EAB308',
                pointHoverBackgroundColor: '#EAB308',
                pointHoverBorderColor: '#FFFFFF',
                pointHoverBorderWidth: 2
            }, {
                label: 'Long %',
                data: filteredData.map(d => d.longPercent),
                borderColor: '#00FF00',
                backgroundColor: 'transparent',
                tension: 0.2,
                fill: false,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#00FF00',
                pointBorderColor: '#00FF00',
                pointHoverBackgroundColor: '#00FF00',
                pointHoverBorderColor: '#FFFFFF',
                pointHoverBorderWidth: 2
            }, {
                label: 'Short %',
                data: filteredData.map(d => d.shortPercent),
                borderColor: '#FF0000',
                backgroundColor: 'transparent',
                tension: 0.2,
                fill: false,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointBackgroundColor: '#FF0000',
                pointBorderColor: '#FF0000',
                pointHoverBackgroundColor: '#FF0000',
                pointHoverBorderColor: '#FFFFFF',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#888888',
                        padding: 20,
                        font: {
                            size: 12,
                            family: 'Inter, sans-serif'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#222222',
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                    borderColor: '#333333',
                    borderWidth: 1,
                    padding: 10,
                    titleFont: {
                        size: 13,
                        family: 'Inter, sans-serif'
                    },
                    bodyFont: {
                        size: 13,
                        family: 'Inter, sans-serif'
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(1);
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false  // Remove grid lines
                    },
                    ticks: {
                        color: '#888888',
                        padding: 10,
                        maxRotation: 0,
                        font: {
                            size: 11,
                            family: 'Inter, sans-serif'
                        }
                    }
                },
                y: {
                    grid: {
                        display: false  // Remove grid lines
                    },
                    ticks: {
                        color: '#888888',
                        padding: 10,
                        font: {
                            size: 11,
                            family: 'Inter, sans-serif'
                        },
                        callback: function(value) {
                            return value.toFixed(0);  // Remove decimals like Recharts
                        }
                    }
                }
            }
        }
    };
    
    // Chart.js 4 doesn't have built-in annotation plugin, so we'll use a custom plugin
    // to draw the dashed line at y=0
    const zeroLinePlugin = {
        id: 'zeroLine',
        afterDraw: (chart) => {
            const ctx = chart.ctx;
            const yAxis = chart.scales.y;
            const xAxis = chart.scales.x;
            
            const yPos = yAxis.getPixelForValue(0);
            
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(xAxis.left, yPos);
            ctx.lineTo(xAxis.right, yPos);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#666666';
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.restore();
        }
    };
    
    chartConfig.plugins = [zeroLinePlugin];
    
    if (dashboardNum === 1) {
        chart1 = new Chart(ctx, chartConfig);
    } else {
        chart2 = new Chart(ctx, chartConfig);
    }
}

// Load embedded data
async function loadData() {
    // Parse each category's data
    for (const category of ['leveraged_funds', 'asset_manager', 'dealer']) {
        const csvData = demoData[category];
        
        // Parse CSV data
        const lines = csvData.trim().split('\n');
        const data = [];
        
        for (const line of lines) {
            const [currency, description, date, positionsLong, positionsShort, longPercent, shortPercent, netPercent, year] = line.split(',');
            data.push({
                currency,
                description,
                date,
                positionsLong: parseInt(positionsLong),
                positionsShort: parseInt(positionsShort),
                longPercent: parseFloat(longPercent),
                shortPercent: parseFloat(shortPercent),
                netPercent: parseFloat(netPercent),
                year: parseInt(year)
            });
        }
        
        allData[category] = data;
    }
}