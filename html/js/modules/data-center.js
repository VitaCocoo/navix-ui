/**
 * 数据中心模块
 * 负责数据中心页面的渲染，包括核心指标、监督任务概览、标签分布、店员排名等
 * 注意：根据需求文档，数据中心只展示【昨日】数据，不提供时间范围切换
 */

/**
 * 渲染数据中心视图（主入口）
 */
function renderDataCenterView() {
    const container = document.getElementById('app-container');
    if (!container) return;
    
    // 隐藏底部工具栏
    hideToolbar();
    
    container.innerHTML = `
        <main id="data-center-view" class="h-screen flex flex-col bg-bg-light">
            <!-- 顶部标题栏（含返回按钮） -->
            <div class="flex-shrink-0 sticky top-0 bg-white z-20 px-4 py-3 border-b border-border-split">
                <div class="flex items-center justify-between">
                    <button onclick="backToHomeFromDataCenter()" class="text-text-secondary hover:text-text-primary transition-colors">
                        <i class="fa-solid fa-arrow-left mr-2"></i>返回
                    </button>
                    <h2 class="text-base font-bold text-text-primary flex-1 text-center">数据中心</h2>
                    <div class="text-xs text-text-tertiary">
                        昨日数据
                    </div>
                </div>
            </div>
            
            <!-- 滚动内容区 -->
            <div class="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                <!-- 核心指标卡片组 -->
                <div id="metrics-cards-container"></div>
                
                <!-- 监督任务概览 -->
                <div id="tasks-overview-container"></div>
            </div>
        </main>
    `;
    
    // 渲染各个子模块
    renderMetricsCards();
    renderTasksOverview();
}

/**
 * 从数据中心返回首页
 */
function backToHomeFromDataCenter() {
    showToolbar();
    if (typeof renderHomeView === 'function') {
        // 保留原有聊天消息
        renderHomeView({ preserveMessages: true });
    }
}

/**
 * 渲染核心指标卡片组
 * UI规范：
 * - 右上角不展示图标
 * - 不展示"较前日"文本
 * - 纯文本展示，保持界面简洁
 */
function renderMetricsCards() {
    const container = document.getElementById('metrics-cards-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
            ${metricsData.map((metric, index) => `
                <div class="metric-card-gradient flex-shrink-0 w-40 p-4 rounded-xl cursor-pointer hover:shadow-hover transition-shadow"
                     onclick="openMetricDetailView(${index})">
                    <div class="text-xs text-text-tertiary mb-2">${metric.title}</div>
                    <div class="text-2xl font-bold text-text-primary mb-2">${metric.value}</div>
                    <div class="flex items-center text-xs ${metric.isUp ? 'text-success' : 'text-error'}">
                        <span>${metric.changeAbs} (${metric.changeRel})</span>
                        <i class="fa-solid fa-arrow-${metric.isUp ? 'up' : 'down'} ml-1"></i>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// 保存事件处理器引用，避免重复绑定
let dataCenterTasksClickHandler = null;

/**
 * 渲染监督任务概览
 * 展示该用户当前所有的监督任务，支持点击跳转到任务详情
 */
function renderTasksOverview() {
    const container = document.getElementById('tasks-overview-container');
    if (!container) return;
    
    // 按达成率排序，达成率低的在前（提醒管理者关注）
    const sortedTasks = [...supervisionTasks].sort((a, b) => {
        const rateA = parseInt(a.value);
        const rateB = parseInt(b.value);
        return rateA - rateB;
    });
    
    container.innerHTML = `
        <div class="glass-panel p-4 rounded-xl">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-sm font-bold text-text-primary">监督任务概览</h3>
                <span class="text-xs text-text-tertiary">共${sortedTasks.length}个任务</span>
            </div>
            
            <div class="space-y-3" id="data-center-tasks-list">
                ${sortedTasks.map(task => `
                    <div class="flex items-center justify-between p-3 bg-bg-light rounded-lg cursor-pointer hover:bg-bg-hover transition-colors task-card-item"
                         data-task-id="${task.id}">
                        <div class="flex-1">
                            <div class="text-sm font-semibold text-text-primary mb-1">${task.title}</div>
                            <div class="text-xs text-text-tertiary">${task.desc}</div>
                        </div>
                        <div class="text-right">
                            <div class="text-lg font-bold ${task.isUp ? 'text-success' : 'text-error'}">${task.value}</div>
                            <div class="text-xs ${task.isUp ? 'text-success' : 'text-error'}">
                                ${task.changeRel}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // 使用事件委托绑定点击事件
    setTimeout(() => {
        const tasksList = document.getElementById('data-center-tasks-list');
        if (tasksList) {
            // 如果之前有绑定过，先移除
            if (dataCenterTasksClickHandler) {
                tasksList.removeEventListener('click', dataCenterTasksClickHandler);
            }
            
            // 创建新的事件处理器
            dataCenterTasksClickHandler = function(e) {
                const taskCard = e.target.closest('.task-card-item');
                if (taskCard) {
                    const taskId = parseInt(taskCard.getAttribute('data-task-id'));
                    // 使用window对象访问全局函数
                    if (taskId && typeof window.openTaskDetailView === 'function') {
                        window.openTaskDetailView(taskId);
                    }
                }
            };
            
            // 绑定事件
            tasksList.addEventListener('click', dataCenterTasksClickHandler);
            console.log('[DataCenter] 事件监听器已绑定到 data-center-tasks-list');
        } else {
            console.error('[DataCenter] data-center-tasks-list 未找到');
        }
    }, 100);
}

/**
 * 导出报告
 */
function exportReport(type) {
    showToast('报告导出功能开发中...', 'info');
}

/**
 * 初始化数据中心模块
 */
function initDataCenterModule() {
    renderDataCenter();
}
