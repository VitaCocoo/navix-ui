/**
 * Chart.js 图表管理器
 * 负责所有图表的初始化、更新和销毁
 */

// 图表实例管理
let metricDetailChart = null;
let detailChart = null;

/**
 * 渲染指标详情图表
 * @param {number} metricIndex - 指标索引
 * @param {string} trendType - 趋势类型 ('7days' 或 'hourly')
 */
function renderMetricChart(metricIndex, trendType = '7days') {
    const ctx = document.getElementById('metric-detail-chart').getContext('2d');
    if (metricDetailChart) metricDetailChart.destroy();

    // 根据趋势类型选择数据源
    const trendData = trendType === '7days' ? metricTrendData[metricIndex] : metricHourlyData[metricIndex];
    if (!trendData) return;

    metricDetailChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: trendData.labels,
            datasets: [{
                label: metricsData[metricIndex].title,
                data: trendData.data,
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--chart-blue').trim(),
                backgroundColor: 'rgba(66, 153, 225, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { 
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim(), 
                        font: { size: 10 } 
                    }
                },
                y: {
                    grid: { 
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-split').trim() 
                    },
                    ticks: { 
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim(), 
                        font: { size: 10 },
                        callback: function(value) {
                            return value + trendData.unit;
                        }
                    }
                }
            }
        }
    });
}

/**
 * 渲染任务详情图表
 */
function renderDetailChart() {
    const ctx = document.getElementById('detail-task-chart').getContext('2d');
    if (detailChart) detailChart.destroy();

    // 模拟数据
    const labels = ['01-07', '01-08', '01-09', '01-10', '01-11', '01-12', '01-13'];
    const data = [65, 68, 62, 70, 72, 69, 75];

    detailChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '执行率',
                data: data,
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--chart-blue').trim(),
                backgroundColor: 'rgba(66, 153, 225, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { 
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim(), 
                        font: { size: 10 } 
                    }
                },
                y: {
                    grid: { 
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-split').trim() 
                    },
                    ticks: { 
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim(), 
                        font: { size: 10 } 
                    },
                    min: 50,
                    max: 100
                }
            }
        }
    });
}
