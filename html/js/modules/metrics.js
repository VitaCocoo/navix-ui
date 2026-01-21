/**
 * 指标详情模块
 * 负责指标详情页面的显示和交互
 */

let currentMetricIndex = null;
let currentTrendType = '7days'; // '7days' 或 'hourly'

/**
 * 打开指标详情页
 * @param {number|string} metricIndexOrTitle - 指标索引或指标名称
 * @param {Object} options - 可选参数
 * @param {Object} options.messageData - 从消息进入时的消息数据（包含AI分析和建议）
 */
function openMetricDetailView(metricIndexOrTitle, options = {}) {
    // 支持传入索引或标题字符串
    let metricIndex = metricIndexOrTitle;
    if (typeof metricIndexOrTitle === 'string') {
        metricIndex = metricsData.findIndex(m => m.title === metricIndexOrTitle);
        if (metricIndex === -1) {
            console.error('未找到指标:', metricIndexOrTitle);
            return;
        }
    }
    
    const metric = metricsData[metricIndex];
    if (!metric) {
        console.error('指标不存在:', metricIndex);
        return;
    }
    
    currentMetricIndex = metricIndex;
    currentTrendType = '7days'; // 重置为默认值
    
    // 隐藏底部工具栏
    hideToolbar();
    
    const container = document.getElementById('app-container');
    if (!container) return;
    
    // 判断是否从消息进入（有messageData则为消息关联指标详情页）
    const isFromMessage = options.messageData && options.messageData.relatedData;
    const aiAnalysis = isFromMessage ? options.messageData.relatedData.aiAnalysis : null;
    const aiSuggestions = isFromMessage ? options.messageData.relatedData.aiSuggestions : null;
    
    // 渲染指标详情页面完整结构
    container.innerHTML = `
        <main id="metric-detail-view" class="h-screen flex flex-col bg-bg-light">
            <!-- 顶部标题栏 -->
            <div class="flex-shrink-0 sticky top-0 bg-white z-20 px-4 py-3 border-b border-border-split">
                <div class="flex items-center justify-between">
                    <button onclick="hideMetricDetailView()" class="text-text-secondary hover:text-text-primary">
                        <i class="fa-solid fa-arrow-left mr-2"></i>返回
                    </button>
                    <h3 class="text-base font-bold text-text-primary flex-1 text-center">${metric.title}</h3>
                    <div style="width: 60px;"></div>
                </div>
            </div>
            
            <!-- 滚动内容区 -->
            <div class="flex-1 overflow-y-auto pb-24">
                <!-- 指标概览卡片 -->
                <div class="p-4">
                    <div class="glass-panel p-4 rounded-xl">
                        <div class="text-center mb-4">
                            <div class="text-3xl font-bold text-primary mb-1">${metric.value}</div>
                            <div class="text-sm text-text-tertiary">昨日数据</div>
                            <div class="flex items-center justify-center text-sm ${metric.isUp ? 'text-success' : 'text-error'} mt-2">
                                <i class="fa-solid fa-arrow-trend-${metric.isUp ? 'up' : 'down'} mr-2"></i>
                                <span>${metric.changeAbs}</span>
                                <span class="ml-2 opacity-70">(${metric.changeRel})</span>
                            </div>
                        </div>
                        
                        ${metricIndex === 0 ? `
                            <div class="mt-3 p-3 bg-info-bg border border-info-border rounded-lg">
                                <div class="flex items-start space-x-2">
                                    <i class="fa-solid fa-circle-info text-info text-sm mt-0.5"></i>
                                    <p class="text-xs text-text-secondary">
                                        客流量数据通过语音数据获取，存在一定误差
                                    </p>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                ${isFromMessage && aiAnalysis ? `
                    <!-- AI分析（仅消息关联指标详情页显示） -->
                    <div class="px-4 pb-4">
                        <div class="glass-panel p-4 rounded-xl bg-gradient-to-br from-primary-1 to-white">
                            <div class="flex items-center mb-3">
                                <i class="fa-solid fa-robot text-primary text-lg mr-2"></i>
                                <h4 class="text-sm font-bold text-text-primary">AI分析</h4>
                            </div>
                            <p class="text-sm text-text-secondary leading-relaxed whitespace-pre-line">${aiAnalysis}</p>
                        </div>
                    </div>
                ` : ''}
                
                ${isFromMessage && aiSuggestions && aiSuggestions.length > 0 ? `
                    <!-- AI建议（仅消息关联指标详情页显示） -->
                    <div class="px-4 pb-4">
                        <div class="glass-panel p-4 rounded-xl bg-gradient-to-br from-success-bg to-white">
                            <div class="flex items-center mb-3">
                                <i class="fa-solid fa-lightbulb text-success text-lg mr-2"></i>
                                <h4 class="text-sm font-bold text-text-primary">AI建议</h4>
                            </div>
                            <div class="space-y-2">
                                ${aiSuggestions.map(suggestion => `
                                    <div class="flex items-start space-x-2">
                                        <i class="fa-solid fa-circle-check text-success text-xs mt-1"></i>
                                        <p class="text-sm text-text-secondary flex-1">${suggestion}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <!-- 趋势分析 -->
                <div class="px-4 pb-4">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="text-sm font-bold text-text-primary">
                            <i class="fa-solid fa-chart-line text-primary mr-2"></i>趋势分析
                        </h4>
                        
                        ${metricIndex === 0 ? `
                            <!-- 趋势切换按钮（仅客流量显示） -->
                            <div class="flex gap-2">
                                <button onclick="switchMetricTrend('7days')" 
                                        id="btn-trend-7days"
                                        class="px-3 py-1 text-xs rounded-full text-primary bg-primary-1 border border-primary/30 transition-colors">
                                    7日趋势
                                </button>
                                <button onclick="switchMetricTrend('hourly')" 
                                        id="btn-trend-hourly"
                                        class="px-3 py-1 text-xs rounded-full text-text-tertiary bg-transparent transition-colors">
                                    昨日分时
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="glass-panel p-4 rounded-lg" style="height: 240px;">
                        <canvas id="metric-chart"></canvas>
                    </div>
                </div>
                
                <!-- 门店排行榜 -->
                <div class="px-4 pb-4">
                    <h4 class="text-sm font-bold text-text-primary mb-2">
                        <i class="fa-solid fa-ranking-star text-secondary-teal mr-2"></i>门店排名
                    </h4>
                    <div id="metric-store-list" class="space-y-2"></div>
                </div>
            </div>
            
            <!-- 底部操作按钮（固定） -->
            <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-border-split p-4 z-20">
                <button onclick="handleShare('metric', '${metricIndex}')" 
                        class="w-full py-3 bg-gradient-primary text-white rounded-lg hover:brightness-110 transition-all">
                    <i class="fa-solid fa-share-nodes mr-2"></i>分享
                </button>
            </div>
        </main>
    `;
    
    // 渲染图表和门店列表
    setTimeout(() => {
        renderMetricChart(metricIndex, currentTrendType);
        renderMetricStoreList(metricIndex);
    }, 100);
}

/**
 * 隐藏指标详情页，返回首页
 */
function hideMetricDetailView() {
    // 显示底部工具栏
    showToolbar();
    
    if (typeof renderHomeView === 'function') {
        // 保留原有聊天消息
        renderHomeView({ preserveMessages: true });
    }
}

/**
 * 切换指标趋势类型（7日/分时）
 * @param {string} trendType - 趋势类型 ('7days' 或 'hourly')
 */
function switchMetricTrend(trendType) {
    // 仅允许客流量指标（index 0）切换
    if (currentMetricIndex !== 0) return;
    
    // 更新按钮状态
    const btn7days = document.getElementById('btn-trend-7days');
    const btnHourly = document.getElementById('btn-trend-hourly');
    
    if (trendType === '7days') {
        btn7days.classList.add('text-primary', 'bg-primary-1', 'border', 'border-primary/30');
        btn7days.classList.remove('text-text-tertiary', 'bg-transparent');
        btnHourly.classList.remove('text-primary', 'bg-primary-1', 'border', 'border-primary/30');
        btnHourly.classList.add('text-text-tertiary', 'bg-transparent');
    } else {
        btnHourly.classList.add('text-primary', 'bg-primary-1', 'border', 'border-primary/30');
        btnHourly.classList.remove('text-text-tertiary', 'bg-transparent');
        btn7days.classList.remove('text-primary', 'bg-primary-1', 'border', 'border-primary/30');
        btn7days.classList.add('text-text-tertiary', 'bg-transparent');
    }
    
    // 更新当前趋势类型并重新渲染图表
    currentTrendType = trendType;
    renderMetricChart(currentMetricIndex, currentTrendType);
}

/**
 * 渲染指标图表
 * @param {number} metricIndex - 指标索引
 * @param {string} trendType - 趋势类型 ('7days' 或 'hourly')
 */
function renderMetricChart(metricIndex, trendType) {
    const canvas = document.getElementById('metric-chart');
    if (!canvas) return;
    
    // 销毁旧图表
    if (window.metricChartInstance) {
        window.metricChartInstance.destroy();
    }
    
    // 获取趋势数据
    let chartData;
    if (trendType === 'hourly' && metricIndex === 0) {
        chartData = metricHourlyData[metricIndex];
    } else {
        chartData = metricTrendData[metricIndex];
    }
    
    if (!chartData) return;
    
    window.metricChartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: metricsData[metricIndex].title,
                data: chartData.data,
                borderColor: '#4299E1',
                backgroundColor: 'rgba(66, 153, 225, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#4299E1',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#2D3748',
                    titleColor: '#FFFFFF',
                    bodyColor: '#FFFFFF',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + chartData.unit;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: '#EDF2F7'
                    },
                    ticks: {
                        color: '#718096',
                        font: { size: 10 },
                        callback: function(value) {
                            return value + chartData.unit;
                        }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#718096',
                        font: { size: 10 }
                    }
                }
            }
        }
    });
}

/**
 * 渲染门店排行榜
 * @param {number} metricIndex - 指标索引
 */
function renderMetricStoreList(metricIndex) {
    const list = document.getElementById('metric-store-list');
    const stores = metricStoreData[metricIndex];
    if (!stores) return;

    list.innerHTML = stores.map((s, idx) => {
        let colorClass = 'text-text-primary';
        if (idx < 3) {
            colorClass = 'text-success'; // 前3名
        } else if (idx >= stores.length - 2) {
            colorClass = 'text-error'; // 后2名
        } else {
            colorClass = 'text-primary'; // 其他
        }
        
        return `
            <div class="glass-panel flex items-center justify-between p-3 rounded-lg">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        idx === 0 ? 'bg-yellow-100 text-yellow-600' : 
                        idx === 1 ? 'bg-gray-100 text-gray-600' : 
                        idx === 2 ? 'bg-orange-100 text-orange-600' : 
                        'bg-gray-50 text-gray-500'
                    }">
                        ${idx + 1}
                    </div>
                    <span class="text-sm text-text-primary">${s.name}</span>
                </div>
                <span class="text-sm font-bold font-mono ${colorClass}">${s.value}</span>
            </div>
        `;
    }).join('');
}
