/**
 * 任务管理模块（重构版 - 模块化渲染）
 * 负责任务列表渲染、创建、编辑、详情展示和分享功能
 */

let currentDetailTaskId = null;

/**
 * 渲染监督任务视图的完整HTML结构
 */
function renderTasksView() {
    const container = document.getElementById('app-container');
    if (!container) return;
    
    container.innerHTML = `
        <main id="tasks-view" class="pt-4 px-4 space-y-5 pb-28">
            <h2 class="text-xl font-bold text-text-primary mb-4">监督任务</h2>
            <div class="flex justify-between items-center mb-3">
                <span class="text-sm text-text-tertiary">当前任务 (${supervisionTasks.length}/${supervisionTasks.length})</span>
                <button onclick="openCreateTaskView()" class="btn-primary text-xs px-3 py-1.5 rounded-full">
                    <i class="fa-solid fa-plus mr-1"></i> 新增任务
                </button>
            </div>
            <div id="supervision-task-list" class="space-y-3"></div>
        </main>
    `;
    
    // 渲染任务列表
    renderSupervisionTaskList();
}

/**
 * 渲染监督任务列表
 */
function renderSupervisionTaskList() {
    const container = document.getElementById('supervision-task-list');
    if (!container) return;
    
    container.innerHTML = supervisionTasks.map(task => `
        <div onclick="openTaskDetailView(${task.id})" class="glass-panel rounded-lg p-4 cursor-pointer hover:shadow-hover transition-shadow active:scale-95">
            <div class="flex items-start justify-between mb-2">
                <h4 class="text-sm font-bold text-text-primary flex-1">${task.title}</h4>
                <button onclick="openEditTaskView(event, ${task.id})" class="text-xs text-primary hover:text-primary-hover ml-2">
                    <i class="fa-solid fa-edit"></i>
                </button>
            </div>
            <p class="text-xs text-text-secondary mb-2">${task.desc}</p>
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold ${task.change.startsWith('+') ? 'text-success' : 'text-error'} font-mono">
                    ${task.value} ${task.change}
                </span>
                <span class="text-[10px] text-text-tertiary">
                    <i class="fa-regular fa-calendar mr-1"></i>${task.createTime || '2026-01-13'}
                </span>
            </div>
        </div>
    `).join('');
}

/**
 * 打开AI预填充的任务创建页面
 * @param {object} prefillData - 预填充数据 { name: '', intro: '', action: '' }
 */
function openCreateTaskViewWithAI(prefillData = {}) {
    openCreateTaskView();
    
    // 如果有预填充数据，直接填充到输入框
    setTimeout(() => {
        if (prefillData.name) {
            const nameInput = document.getElementById('task-name');
            if (nameInput) {
                nameInput.value = prefillData.name;
                updateCharCount('task-name', 20);
            }
        }
        if (prefillData.intro) {
            const introInput = document.getElementById('task-intro');
            if (introInput) {
                introInput.value = prefillData.intro;
                updateCharCount('task-intro', 100);
            }
        }
        if (prefillData.action) {
            const actionInput = document.getElementById('task-action');
            if (actionInput) {
                actionInput.value = prefillData.action;
                updateCharCount('task-action', 200);
            }
        }
    }, 100);
}

/**
 * 打开任务创建页面
 */
function openCreateTaskView() {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;
    
    // 渲染创建任务弹窗
    modalContainer.innerHTML = `
        <div id="create-task-modal" class="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center animate-fade-in">
            <div class="bg-white w-full md:w-[600px] md:rounded-t-2xl rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
                <!-- 顶部标题栏 -->
                <div class="flex items-center justify-between px-4 py-3 border-b border-border-split">
                    <button onclick="hideCreateTaskView()" class="text-text-secondary hover:text-text-primary">
                        <i class="fa-solid fa-xmark text-xl"></i>
                    </button>
                    <h3 id="create-task-title" class="text-base font-bold text-text-primary">新建任务</h3>
                    <div style="width: 24px;"></div>
                </div>
                
                <!-- 滚动内容区 -->
                <div id="create-task-body" class="flex-1 overflow-y-auto p-4 space-y-4">
                    <!-- 任务名称 -->
                    <div>
                        <label class="block text-sm font-semibold text-text-primary mb-2">任务名称</label>
                        <input 
                            type="text" 
                            id="task-name" 
                            maxlength="20"
                            placeholder="请输入任务名称（最多20字）"
                            class="w-full px-3 py-2 border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            oninput="updateCharCount('task-name', 20)">
                    </div>
                    
                    <!-- 场景描述 -->
                    <div>
                        <label class="block text-sm font-semibold text-text-primary mb-2">场景描述</label>
                        <textarea 
                            id="task-intro" 
                            maxlength="100"
                            placeholder="请描述需要监督的场景（最多100字）"
                            class="w-full px-3 py-2 border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            rows="3"
                            oninput="updateCharCount('task-intro', 100)"></textarea>
                    </div>
                    
                    <!-- 达成标准 -->
                    <div>
                        <label class="block text-sm font-semibold text-text-primary mb-2">达成标准</label>
                        <textarea 
                            id="task-action" 
                            maxlength="200"
                            placeholder="请描述期望店员达到的标准（最多200字）"
                            class="w-full px-3 py-2 border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            rows="4"
                            oninput="updateCharCount('task-action', 200)"></textarea>
                    </div>
                </div>
                
                <!-- 底部按钮区 -->
                <div class="flex-shrink-0 px-4 py-3 border-t border-border-split bg-bg-light flex space-x-3">
                    <button 
                        onclick="hideCreateTaskView()" 
                        class="flex-1 py-3 border border-border-base rounded-lg font-semibold text-text-secondary hover:bg-bg-hover transition-colors">
                        取消
                    </button>
                    <button 
                        onclick="saveNewTask()" 
                        class="flex-1 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:brightness-110 transition-all">
                        <i class="fa-solid fa-check mr-1"></i>
                        创建
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * 打开任务编辑页面
 * @param {Event} event - 事件对象
 * @param {number} taskId - 任务ID
 */
function openEditTaskView(event, taskId) {
    event.stopPropagation(); // 阻止卡片点击
    const task = supervisionTasks.find(t => t.id === taskId);
    if (!task) return;

    // 注意：旧版编辑逻辑已废弃，新版本统一使用创建弹窗

    // 填充数据
    document.getElementById('task-name').value = task.title;
    document.getElementById('task-intro').value = task.desc + " (此处为详细描述...)";
    document.getElementById('task-action').value = "话术建议：请根据实际情况进行推荐...";

    // 更新字符计数
    updateCharCount('task-name', 20);
    updateCharCount('task-intro', 100);
    updateCharCount('task-action', 200);

    document.getElementById('create-task-view').classList.remove('translate-x-full');
}

/**
 * 隐藏任务创建页面
 */
function hideCreateTaskView() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
        modalContainer.innerHTML = '';
    }
}

// 注意：已删除 triggerGenerate、regenerateField、resetGenerate 函数
// 新版本直接显示输入字段，无需生成步骤

/**
 * 保存新任务
 */
function saveNewTask() {
    // 如果是从消息创建的任务,更新消息的createdTaskId
    if (typeof currentCreatingTaskFromMessage !== 'undefined' && currentCreatingTaskFromMessage) {
        // 查找对应的消息
        const message = aiMessages.find(m => m.id === currentCreatingTaskFromMessage);
        if (message) {
            // 实际项目中应该从API返回新创建的任务ID
            // 这里模拟使用supervisionTasks的第一个任务ID
            const newTaskId = supervisionTasks.length > 0 ? supervisionTasks[0].id : 1;
            message.createdTaskId = newTaskId;
        }
        // 重置全局变量
        currentCreatingTaskFromMessage = null;
    }
    
    hideCreateTaskView();
    
    // 显示成功提示
    setTimeout(() => {
        const toast = document.createElement('div');
        toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-success-bg border border-success-border text-success px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-up';
        toast.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fa-solid fa-check-circle"></i>
                <span class="text-sm font-medium">任务已创建并生效</span>
            </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
        
        // 刷新首页以显示按钮状态变化
        if (typeof renderHomeView === 'function') {
            renderHomeView();
        }
    }, 300);
}

/**
 * 打开任务详情页
 * @param {number} taskId - 任务ID
 */
function openTaskDetailView(taskId) {
    const task = supervisionTasks.find(t => t.id === taskId);
    if (!task) {
        console.error('[Tasks] 未找到任务, taskId:', taskId);
        return;
    }
    
    currentDetailTaskId = taskId;
    
    // 隐藏底部工具栏
    hideToolbar();
    
    const container = document.getElementById('app-container');
    if (!container) return;
    
    container.innerHTML = `
        <main id="task-detail-view" class="h-screen flex flex-col bg-bg-light">
            <!-- 顶部标题栏 -->
            <div class="flex-shrink-0 sticky top-0 bg-white z-20 px-4 py-3 border-b border-border-split">
                <div class="flex items-center justify-between">
                    <button onclick="hideTaskDetailView()" class="text-text-secondary hover:text-text-primary">
                        <i class="fa-solid fa-arrow-left mr-2"></i>返回
                    </button>
                    <h3 class="text-base font-bold text-text-primary flex-1 text-center">${task.title}</h3>
                    <div style="width: 60px;"></div>
                </div>
            </div>
            
            <!-- 滚动内容区 -->
            <div class="flex-1 overflow-y-auto pb-24">
                <!-- 任务概览卡片 -->
                <div class="p-4">
                    <div class="glass-panel p-4 rounded-xl">
                        <div class="text-center mb-4">
                            <div class="text-3xl font-bold text-primary mb-1">${task.value}</div>
                            <div class="text-sm text-text-tertiary">当前达成率</div>
                            <div class="text-sm font-semibold ${task.isUp ? 'text-success' : 'text-error'} mt-1">
                                <i class="fa-solid fa-arrow-${task.isUp ? 'up' : 'down'} mr-1"></i>
                                ${task.changeRel}
                            </div>
                        </div>
                        
                        <div class="space-y-3 text-sm">
                            <div>
                                <div class="text-text-tertiary mb-1">场景描述</div>
                                <div class="text-text-primary">${task.desc}</div>
                            </div>
                            <div>
                                <div class="text-text-tertiary mb-1">达成标准</div>
                                <div class="text-text-primary">店员必须主动询问并推荐相关产品,帮助顾客提升治疗效果</div>
                            </div>
                            <div>
                                <div class="text-text-tertiary mb-1">创建时间</div>
                                <div class="text-text-primary">${task.createTime || '2026-01-10'}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- AI总结 -->
                <div class="px-4 pb-4">
                    <h4 class="text-sm font-bold text-text-primary mb-2">
                        <i class="fa-solid fa-lightbulb text-warning mr-2"></i>AI执行总结
                    </h4>
                    <div class="glass-panel p-3 rounded-lg">
                        <p class="text-sm text-text-secondary leading-relaxed">
                            近7天该任务达成率${task.isUp ? '稳步提升' : '有所下降'},整体表现${task.isUp ? '良好' : '需要改进'}。
                            ${task.isUp ? '店员服务意识增强,主动推荐意识提高。建议继续保持并分享优秀案例。' : '部分店员对关联销售重视不足,建议加强培训和激励。'}
                        </p>
                    </div>
                </div>
                
                <!-- 达成率趋势图 -->
                <div class="px-4 pb-4">
                    <h4 class="text-sm font-bold text-text-primary mb-2">
                        <i class="fa-solid fa-chart-line text-primary mr-2"></i>近7日达成率趋势
                    </h4>
                    <div class="glass-panel p-4 rounded-lg" style="height: 240px;">
                        <canvas id="task-detail-chart"></canvas>
                    </div>
                </div>
                
                <!-- 门店排行榜 -->
                <div class="px-4 pb-4">
                    <h4 class="text-sm font-bold text-text-primary mb-2">
                        <i class="fa-solid fa-ranking-star text-secondary-teal mr-2"></i>门店执行排名
                    </h4>
                    <div id="task-store-list" class="space-y-2"></div>
                </div>
            </div>
            
            <!-- 底部操作按钮（固定） -->
            <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-border-split p-4 z-20">
                <div class="flex space-x-3 mb-3">
                    <button onclick="handleEditTaskFromDetail(${taskId})" 
                            class="flex-1 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary-1 transition-all font-semibold">
                        <i class="fa-solid fa-edit mr-2"></i>编辑
                    </button>
                    <button onclick="handleDeleteTask(${taskId})" 
                            class="flex-1 py-3 border-2 border-error text-error rounded-lg hover:bg-error-bg transition-all font-semibold">
                        <i class="fa-solid fa-trash-alt mr-2"></i>删除
                    </button>
                </div>
                <div>
                    <button onclick="handleShare('task', '${taskId}')" 
                            class="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all shadow-md">
                        <i class="fa-solid fa-share-nodes mr-2"></i>分享
                    </button>
                </div>
            </div>
        </main>
    `;
    
    // 渲染图表
    setTimeout(() => {
        renderTaskDetailChart(taskId);
        renderTaskStoreList(taskId);
    }, 100);
}

/**
 * 隐藏任务详情页
 */
function hideTaskDetailView() {
    // 显示底部工具栏
    showToolbar();
    
    // 返回首页，保留原有聊天消息
    if (typeof renderHomeView === 'function') {
        renderHomeView({ preserveMessages: true });
    }
}

// ========== 显式暴露函数到全局作用域 ==========
// 确保这些函数可以从其他模块访问
window.openCreateTaskView = openCreateTaskView;
window.openTaskDetailView = openTaskDetailView;
window.hideTaskDetailView = hideTaskDetailView;

/**
 * 渲染任务详情页图表
 * @param {number} taskId - 任务ID
 */
function renderTaskDetailChart(taskId) {
    const canvas = document.getElementById('task-detail-chart');
    if (!canvas) return;
    
    // 模拟7日达成率数据
    const chartData = {
        labels: ['01-08', '01-09', '01-10', '01-11', '01-12', '01-13', '01-14'],
        data: [62, 65, 63, 66, 68, 66, 68]
    };
    
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: '达成率',
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
                            return '达成率: ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: '#EDF2F7'
                    },
                    ticks: {
                        color: '#718096',
                        font: { size: 10 },
                        callback: function(value) {
                            return value + '%';
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
 * 渲染任务详情页门店列表
 * @param {number} taskId - 任务ID
 */
function renderTaskStoreList(taskId) {
    const list = document.getElementById('task-store-list');
    if (!list) return;
    
    // 模拟门店数据
    const stores = [
        { name: '中心广场店', rate: '92%', status: 'high' },
        { name: '滨江路分店', rate: '88%', status: 'high' },
        { name: '体育馆店', rate: '76%', status: 'mid' },
        { name: '大学城店', rate: '65%', status: 'low' },
        { name: '老城区店', rate: '58%', status: 'low' },
    ];

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
                <span class="text-sm font-bold font-mono ${colorClass}">${s.rate}</span>
            </div>
        `;
    }).join('');
}

/**
 * 打开任务分享弹窗
 * @param {number} taskId - 任务ID
 */
function openTaskShareModal(taskId) {
    const task = supervisionTasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById('poster-task-title').innerText = task.title;
    // 模拟动态SOP
    document.getElementById('poster-task-desc').innerText = "1. 询问顾客需求。\n2. 针对性推荐相关产品。\n3. 提醒用法用量。\n(话术示例：搭配这个效果更好...)"; 
    document.getElementById('poster-create-time').innerText = task.createTime || '2026-01-13';
    
    document.getElementById('share-task-modal').classList.remove('hidden');
}

/**
 * 关闭任务分享弹窗
 */
function closeTaskShareModal() {
    document.getElementById('share-task-modal').classList.add('hidden');
}

/**
 * 从详情页编辑任务
 * @param {number} taskId - 任务ID
 */
function handleEditTaskFromDetail(taskId) {
    const task = supervisionTasks.find(t => t.id === taskId);
    if (!task) return;
    
    // 打开编辑弹窗
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;
    
    // 渲染编辑任务弹窗（复用创建任务的弹窗结构）
    modalContainer.innerHTML = `
        <div id="edit-task-modal" class="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center animate-fade-in">
            <div class="bg-white w-full md:w-[600px] md:rounded-t-2xl rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
                <!-- 顶部标题栏 -->
                <div class="flex items-center justify-between px-4 py-3 border-b border-border-split">
                    <button onclick="hideEditTaskModal()" class="text-text-secondary hover:text-text-primary">
                        <i class="fa-solid fa-xmark text-xl"></i>
                    </button>
                    <h3 class="text-base font-bold text-text-primary">编辑任务</h3>
                    <div style="width: 24px;"></div>
                </div>
                
                <!-- 滚动内容区 -->
                <div class="flex-1 overflow-y-auto p-4 space-y-4">
                    <!-- 任务名称 -->
                    <div>
                        <label class="block text-sm font-semibold text-text-primary mb-2">任务名称</label>
                        <input 
                            type="text" 
                            id="edit-task-name" 
                            value="${task.title}"
                            maxlength="20"
                            placeholder="简短描述任务主题"
                            class="w-full px-3 py-2 border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            oninput="updateCharCount('edit-task-name', 20)">
                        <div class="text-xs text-text-tertiary mt-1 text-right">
                            <span id="edit-task-name-count">${task.title.length}</span>/20
                        </div>
                    </div>
                    
                    <!-- 场景描述 -->
                    <div>
                        <label class="block text-sm font-semibold text-text-primary mb-2">场景描述</label>
                        <textarea 
                            id="edit-task-intro" 
                            maxlength="100"
                            placeholder="描述需要监督的场景"
                            class="w-full px-3 py-2 border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            rows="3"
                            oninput="updateCharCount('edit-task-intro', 100)">${task.desc}</textarea>
                        <div class="text-xs text-text-tertiary mt-1 text-right">
                            <span id="edit-task-intro-count">${task.desc.length}</span>/100
                        </div>
                    </div>
                    
                    <!-- 达成标准 -->
                    <div>
                        <label class="block text-sm font-semibold text-text-primary mb-2">达成标准</label>
                        <textarea 
                            id="edit-task-action" 
                            maxlength="200"
                            placeholder="描述期望店员达到的标准"
                            class="w-full px-3 py-2 border border-border-base rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            rows="4"
                            oninput="updateCharCount('edit-task-action', 200)">店员必须主动询问并推荐相关产品，帮助顾客提升治疗效果</textarea>
                        <div class="text-xs text-text-tertiary mt-1 text-right">
                            <span id="edit-task-action-count">34</span>/200
                        </div>
                    </div>
                </div>
                
                <!-- 底部按钮区 -->
                <div class="flex-shrink-0 px-4 py-3 border-t border-border-split bg-bg-light">
                    <button 
                        onclick="saveTaskEdit(${taskId})" 
                        class="w-full py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:brightness-110 transition-all">
                        <i class="fa-solid fa-check mr-1"></i>
                        保存修改
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * 关闭编辑任务弹窗
 */
function hideEditTaskModal() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
        modalContainer.innerHTML = '';
    }
}

/**
 * 保存任务编辑
 * @param {number} taskId - 任务ID
 */
function saveTaskEdit(taskId) {
    const nameInput = document.getElementById('edit-task-name');
    const introInput = document.getElementById('edit-task-intro');
    const actionInput = document.getElementById('edit-task-action');
    
    if (!nameInput || !introInput || !actionInput) return;
    
    const name = nameInput.value.trim();
    const intro = introInput.value.trim();
    const action = actionInput.value.trim();
    
    if (!name || !intro || !action) {
        alert('请填写完整的任务信息');
        return;
    }
    
    // 更新任务数据（实际项目中应调用API）
    const task = supervisionTasks.find(t => t.id === taskId);
    if (task) {
        task.title = name;
        task.desc = intro;
        // 达成标准也应该更新，但在当前mock数据中没有单独存储
    }
    
    // 关闭弹窗
    hideEditTaskModal();
    
    // 显示成功提示
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-success-bg border border-success-border text-success px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-up';
    toast.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fa-solid fa-check-circle"></i>
            <span class="text-sm font-medium">任务已更新</span>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
    
    // 刷新任务详情页
    openTaskDetailView(taskId);
}

/**
 * 删除任务
 * @param {number} taskId - 任务ID
 */
function handleDeleteTask(taskId) {
    const task = supervisionTasks.find(t => t.id === taskId);
    if (!task) return;
    
    // 显示确认对话框
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;
    
    modalContainer.innerHTML = `
        <div id="delete-confirm-modal" class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center animate-fade-in">
            <div class="bg-white w-[90%] max-w-[400px] rounded-2xl p-6 animate-slide-up">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 rounded-full bg-error-bg flex items-center justify-center mx-auto mb-4">
                        <i class="fa-solid fa-exclamation-triangle text-error text-2xl"></i>
                    </div>
                    <h3 class="text-lg font-bold text-text-primary mb-2">确定删除该监督任务吗？</h3>
                    <p class="text-sm text-text-secondary">
                        删除后不再对新会话进行判断，但保留历史数据。
                    </p>
                </div>
                
                <div class="flex space-x-3">
                    <button 
                        onclick="cancelDeleteTask()" 
                        class="flex-1 py-3 border border-border-base rounded-lg text-text-secondary hover:bg-bg-hover transition-colors font-semibold">
                        取消
                    </button>
                    <button 
                        onclick="confirmDeleteTask(${taskId})" 
                        class="flex-1 py-3 bg-error text-white rounded-lg hover:brightness-110 transition-all font-semibold">
                        确认删除
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * 取消删除任务
 */
function cancelDeleteTask() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
        modalContainer.innerHTML = '';
    }
}

/**
 * 确认删除任务
 * @param {number} taskId - 任务ID
 */
function confirmDeleteTask(taskId) {
    // 更新任务状态为"已删除"（实际项目中应调用API）
    const task = supervisionTasks.find(t => t.id === taskId);
    if (task) {
        task.status = 'deleted';  // 假设有status字段
        task.isDeleted = true;     // 标记为已删除
    }
    
    // 关闭确认对话框
    cancelDeleteTask();
    
    // 显示成功提示
    const toast = document.createElement('div');
    toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-info-bg border border-info-border text-info px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-up';
    toast.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fa-solid fa-info-circle"></i>
            <span class="text-sm font-medium">任务已删除</span>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
    
    // 返回首页
    setTimeout(() => {
        hideTaskDetailView();
    }, 500);
}
