/**
 * 会话管理模块
 * 负责会话列表、会话详情的渲染和交互
 */

// 当前筛选条件
let sessionFilters = {
    dateRange: 'yesterday', // today/yesterday/7days/30days/custom
    tags: 'all', // all/high-risk/excellent/compliance-issue
    staff: 'all', // all/staff_001/staff_002...
    sortBy: 'time' // time/duration/risk
};

/**
 * 渲染会话视图
 */
function renderSessionsView() {
    const container = document.getElementById('app-container');
    if (!container) return;
    
    container.innerHTML = `
        <main id="sessions-view" class="h-screen flex flex-col bg-bg-light">
            <!-- 顶部标题栏 -->
            <div class="flex-shrink-0 sticky top-0 bg-white z-20 px-4 py-3 border-b border-border-split">
                <div class="flex items-center justify-between">
                    <button onclick="backToHome()" class="text-text-secondary hover:text-text-primary">
                        <i class="fa-solid fa-arrow-left mr-2"></i>返回
                    </button>
                    <h3 class="text-base font-bold text-text-primary flex-1 text-center">会话记录</h3>
                    <div style="width: 60px;"></div>
                </div>
            </div>
            
            <!-- 筛选栏 -->
            <div class="flex-shrink-0 px-4 py-3 bg-white border-b border-border-split">
                <div class="flex gap-2 overflow-x-auto scrollbar-hide">
                    <button onclick="updateSessionFilter('tags', 'all')" 
                            class="px-3 py-1.5 text-xs rounded-full whitespace-nowrap ${sessionFilters.tags === 'all' ? 'bg-primary text-white' : 'bg-bg-container text-text-secondary'}">
                        全部
                    </button>
                    <button onclick="updateSessionFilter('tags', 'high-risk')" 
                            class="px-3 py-1.5 text-xs rounded-full whitespace-nowrap ${sessionFilters.tags === 'high-risk' ? 'bg-error text-white' : 'bg-bg-container text-text-secondary'}">
                        高风险
                    </button>
                    <button onclick="updateSessionFilter('tags', 'excellent')" 
                            class="px-3 py-1.5 text-xs rounded-full whitespace-nowrap ${sessionFilters.tags === 'excellent' ? 'bg-success text-white' : 'bg-bg-container text-text-secondary'}">
                        优秀案例
                    </button>
                    <button onclick="updateSessionFilter('tags', 'compliance-issue')" 
                            class="px-3 py-1.5 text-xs rounded-full whitespace-nowrap ${sessionFilters.tags === 'compliance-issue' ? 'bg-warning text-white' : 'bg-bg-container text-text-secondary'}">
                        合规问题
                    </button>
                </div>
            </div>
            
            <!-- 会话列表 -->
            <div class="flex-1 overflow-y-auto p-4" id="sessions-list-container"></div>
        </main>
        
        <!-- 会话详情页（隐藏） -->
        <div id="session-detail-view" class="hidden h-screen flex flex-col bg-bg-light">
            <div id="session-detail-content"></div>
        </div>
    `;
    
    // 渲染会话列表
    renderSessionsList();
}

/**
 * 渲染会话列表页面
 */
function renderSessionsList() {
    const container = document.getElementById('sessions-list-container');
    if (!container) return;
    
    // 应用筛选和排序
    let filteredSessions = filterAndSortSessions();
    
    if (filteredSessions.length === 0) {
        container.innerHTML = `
            <div class="empty-messages">
                <i class="fa-regular fa-comments"></i>
                <p>暂无会话记录</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredSessions.map(session => `
        <div class="glass-panel p-4 rounded-xl mb-3 cursor-pointer hover:shadow-hover transition-shadow" 
             onclick="openSessionDetailView('${session.id}')">
            <!-- 会话头部 -->
            <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                    <h4 class="text-sm font-bold text-text-primary mb-1">${session.title}</h4>
                    <div class="flex items-center space-x-2 text-xs text-text-tertiary">
                        <span><i class="fa-regular fa-clock mr-1"></i>${session.time}</span>
                        <span>•</span>
                        <span><i class="fa-regular fa-hourglass mr-1"></i>${session.duration}</span>
                    </div>
                </div>
                <div class="risk-badge risk-${session.riskLevel}">
                    ${session.riskLabel}
                </div>
            </div>
            
            <!-- 店员和门店信息 -->
            <div class="flex items-center space-x-2 mb-2">
                <img src="${session.staff.avatar}" alt="${session.staff.name}" 
                     class="w-6 h-6 rounded-full">
                <span class="text-xs text-text-secondary">${session.staff.name}</span>
                <span class="text-xs text-text-tertiary">•</span>
                <span class="text-xs text-text-tertiary">${session.store}</span>
            </div>
            
            <!-- 标签 -->
            <div class="flex flex-wrap gap-1 mb-2">
                ${session.tags.map(tag => `
                    <span class="px-2 py-1 bg-bg-container text-text-tertiary text-xs rounded">${tag}</span>
                `).join('')}
            </div>
            
            <!-- 会话总结 -->
            <p class="text-xs text-text-secondary line-clamp-2">${session.summary}</p>
            
            <!-- 监督任务判断结果（如果有） -->
            ${session.taskResults && session.taskResults.length > 0 ? `
                <div class="mt-2 pt-2 border-t border-border-split">
                    ${session.taskResults.map(result => `
                        <div class="flex items-center justify-between text-xs">
                            <span class="text-text-tertiary">${result.taskName}</span>
                            <span class="${result.achieved ? 'text-success' : 'text-error'}">
                                ${result.achieved ? '✓ 已达成' : '✕ 未达成'}
                            </span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

/**
 * 筛选和排序会话
 */
function filterAndSortSessions() {
    let sessions = [...sessionsData];
    
    // 按日期范围筛选
    // 这里简化处理，实际应该根据dateRange筛选
    
    // 按标签筛选
    if (sessionFilters.tags !== 'all') {
        sessions = sessions.filter(s => {
            switch(sessionFilters.tags) {
                case 'high-risk':
                    return s.riskLevel === 'high';
                case 'excellent':
                    return s.tags.includes('优秀案例');
                case 'compliance-issue':
                    return s.tags.includes('合规问题');
                default:
                    return true;
            }
        });
    }
    
    // 按店员筛选
    if (sessionFilters.staff !== 'all') {
        sessions = sessions.filter(s => s.staff.id === sessionFilters.staff);
    }
    
    // 排序
    switch(sessionFilters.sortBy) {
        case 'time':
            sessions.sort((a, b) => new Date(b.time) - new Date(a.time));
            break;
        case 'duration':
            // 简化处理，实际应该解析duration字符串
            break;
        case 'risk':
            const riskOrder = { 'high': 3, 'medium': 2, 'low': 1 };
            sessions.sort((a, b) => (riskOrder[b.riskLevel] || 0) - (riskOrder[a.riskLevel] || 0));
            break;
    }
    
    return sessions;
}

/**
 * 更新会话筛选条件
 */
function updateSessionFilter(filterType, value) {
    sessionFilters[filterType] = value;
    renderSessionsList();
}

/**
 * 打开会话详情页（支持从任意页面调用）
 * @param {string} sessionId - 会话ID
 */
function openSessionDetailView(sessionId) {
    const session = sessionsData.find(s => s.id === sessionId);
    if (!session) {
        console.error('会话不存在:', sessionId);
        return;
    }
    
    // 检测是否在会话列表页面
    const sessionsView = document.getElementById('sessions-view');
    const sessionDetailView = document.getElementById('session-detail-view');
    
    if (sessionsView && sessionDetailView) {
        // 从会话列表页打开详情：显示详情视图，隐藏列表
        sessionsView.classList.add('hidden');
        sessionDetailView.classList.remove('hidden');
        renderSessionDetail(session);
    } else {
        // 从首页等其他页面打开：直接渲染独立详情页面
        renderSessionDetailViewStandalone(session);
    }
}

/**
 * 渲染会话详情
 */
function renderSessionDetail(session) {
    const container = document.getElementById('session-detail-content');
    if (!container) return;
    
    container.innerHTML = `
        <!-- 顶部标题栏 -->
        <div class="sticky top-0 bg-white z-20 px-4 py-3 border-b border-border-split">
            <div class="flex items-center justify-between">
                <button onclick="hideSessionDetailView()" class="text-text-secondary hover:text-text-primary">
                    <i class="fa-solid fa-arrow-left mr-2"></i>返回
                </button>
                <h3 class="text-base font-bold text-text-primary flex-1 text-center">${session.title}</h3>
                <div style="width: 60px;"></div>
            </div>
        </div>
        
        <!-- 会话概览卡片 -->
        <div class="p-4 bg-bg-light">
            <div class="glass-panel p-4 rounded-xl">
                <!-- 标题和时间信息 -->
                <div class="flex items-start justify-between mb-3">
                    <h3 class="text-base font-bold text-text-primary flex-1 pr-4">${session.title}</h3>
                    <div class="flex flex-col items-end text-xs text-text-tertiary space-y-1">
                        <div><i class="fa-regular fa-clock mr-1"></i>${session.time.split(' ')[1] || session.time}</div>
                        <div><i class="fa-regular fa-hourglass mr-1"></i>${session.duration}</div>
                    </div>
                </div>
                
                <!-- 店员和门店信息 -->
                <div class="flex items-center space-x-4 text-xs text-text-tertiary">
                    <span><i class="fa-solid fa-user mr-1"></i>店员：${session.staff.name}</span>
                    <span><i class="fa-solid fa-store mr-1"></i>门店：${session.store}</span>
                </div>
            </div>
        </div>
        
        <!-- 会话总结 -->
        <div class="px-4 py-3">
            <h4 class="text-sm font-bold text-text-primary mb-2">
                <i class="fa-solid fa-lightbulb text-warning mr-2"></i>AI总结
            </h4>
            <div class="glass-panel p-3 rounded-lg">
                <p class="text-sm text-text-secondary leading-relaxed">${session.summary}</p>
            </div>
        </div>
        
        <!-- AI建议 -->
        ${session.suggestions && session.suggestions.length > 0 ? `
        <div class="px-4 py-3">
            <h4 class="text-sm font-bold text-text-primary mb-2">
                <i class="fa-solid fa-wand-magic-sparkles text-primary mr-2"></i>AI建议
            </h4>
            <div class="glass-panel p-3 rounded-lg">
                <div class="space-y-2">
                    ${session.suggestions.map(suggestion => `
                        <div class="flex items-start space-x-2">
                            <span class="text-primary mt-0.5">•</span>
                            <p class="text-sm text-text-secondary leading-relaxed flex-1">${suggestion}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        ` : ''}
        
        <!-- 对话内容 -->
        <div class="px-4 py-3">
            <h4 class="text-sm font-bold text-text-primary mb-2">
                <i class="fa-solid fa-comments text-primary mr-2"></i>对话记录
            </h4>
            <div class="space-y-3">
                ${session.transcript.map(msg => `
                    <div class="flex ${msg.role === 'staff' ? 'justify-end' : 'justify-start'}">
                        <div class="${msg.role === 'staff' ? 'bg-primary-1 text-primary-8' : 'bg-gray-100 text-text-primary'} 
                                    rounded-lg px-3 py-2 max-w-[80%]">
                            <div class="text-xs text-text-tertiary mb-1">
                                ${msg.role === 'staff' ? '店员' : '顾客'} • ${msg.time}
                            </div>
                            <div class="text-sm leading-relaxed">${msg.text}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- 底部操作按钮（固定） -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-border-split p-4 z-20">
            ${session.hasCreateTask ? `
                <!-- 创建监督任务按钮区域 -->
                <div class="mb-3">
                    ${session.createdTaskId ? `
                        <button onclick="openTaskDetailView(${session.createdTaskId})" 
                                class="w-full py-3 bg-success text-white rounded-lg hover:bg-success transition-all shadow-md flex items-center justify-center">
                            <i class="fa-solid fa-check-circle mr-2"></i>已创建监督任务
                        </button>
                    ` : `
                        <button onclick="handleCreateTaskFromSession('${session.id}')" 
                                class="w-full py-3 bg-secondary-orange text-white rounded-lg hover:opacity-90 transition-all shadow-md flex items-center justify-center">
                            <i class="fa-solid fa-plus-circle mr-2"></i>创建监督任务
                        </button>
                    `}
                </div>
            ` : ''}
            
            <!-- 分享按钮 -->
            <div>
                <button onclick="handleShare('session', '${session.id}')" 
                        class="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all shadow-md">
                    <i class="fa-solid fa-share-nodes mr-2"></i>分享
                </button>
            </div>
        </div>
    `;
}

/**
 * 渲染独立的会话详情页面（从首页等其他页面打开时使用）
 * @param {Object} session - 会话对象
 */
function renderSessionDetailViewStandalone(session) {
    const container = document.getElementById('app-container');
    if (!container) return;
    
    // 隐藏底部工具栏
    hideToolbar();
    
    container.innerHTML = `
        <main id="session-detail-view-standalone" class="h-screen flex flex-col bg-bg-light">
            <!-- 顶部标题栏 -->
            <div class="flex-shrink-0 sticky top-0 bg-white z-20 px-4 py-3 border-b border-border-split">
                <div class="flex items-center justify-between">
                    <button onclick="backToHomeFromSessionDetail()" class="text-text-secondary hover:text-text-primary">
                        <i class="fa-solid fa-arrow-left mr-2"></i>返回
                    </button>
                    <h3 class="text-base font-bold text-text-primary flex-1 text-center">${session.title}</h3>
                    <div style="width: 60px;"></div>
                </div>
            </div>
            
            <!-- 滚动内容区 -->
            <div class="flex-1 overflow-y-auto pb-24">
                <!-- 会话概览卡片 -->
                <div class="p-4">
                    <div class="glass-panel p-4 rounded-xl">
                        <!-- 标题和时间信息 -->
                        <div class="flex items-start justify-between mb-3">
                            <h3 class="text-base font-bold text-text-primary flex-1 pr-4">${session.title}</h3>
                            <div class="flex flex-col items-end text-xs text-text-tertiary space-y-1">
                                <div><i class="fa-regular fa-clock mr-1"></i>${session.time.split(' ')[1] || session.time}</div>
                                <div><i class="fa-regular fa-hourglass mr-1"></i>${session.duration}</div>
                            </div>
                        </div>
                        
                        <!-- 店员和门店信息 -->
                        <div class="flex items-center space-x-4 text-xs text-text-tertiary">
                            <span><i class="fa-solid fa-user mr-1"></i>店员：${session.staff.name}</span>
                            <span><i class="fa-solid fa-store mr-1"></i>门店：${session.store}</span>
                        </div>
                    </div>
                </div>
                
                <!-- 会话总结 -->
                <div class="px-4 py-3">
                    <h4 class="text-sm font-bold text-text-primary mb-2">
                        <i class="fa-solid fa-lightbulb text-warning mr-2"></i>AI总结
                    </h4>
                    <div class="glass-panel p-3 rounded-lg">
                        <p class="text-sm text-text-secondary leading-relaxed">${session.summary}</p>
                    </div>
                </div>
                
                <!-- AI建议 -->
                ${session.suggestions && session.suggestions.length > 0 ? `
                <div class="px-4 py-3">
                    <h4 class="text-sm font-bold text-text-primary mb-2">
                        <i class="fa-solid fa-wand-magic-sparkles text-primary mr-2"></i>AI建议
                    </h4>
                    <div class="glass-panel p-3 rounded-lg">
                        <div class="space-y-2">
                            ${session.suggestions.map(suggestion => `
                                <div class="flex items-start space-x-2">
                                    <span class="text-primary mt-0.5">•</span>
                                    <p class="text-sm text-text-secondary leading-relaxed flex-1">${suggestion}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <!-- 对话记录 -->
                <div class="px-4 py-3">
                    <h4 class="text-sm font-bold text-text-primary mb-2">
                        <i class="fa-solid fa-comments text-secondary-teal mr-2"></i>对话记录
                    </h4>
                    <div class="glass-panel p-3 rounded-lg space-y-3">
                        ${session.transcript.map(msg => `
                            <div class="flex items-start space-x-2">
                                <div class="flex-shrink-0 w-8 h-8 rounded-full ${msg.role === 'customer' ? 'bg-bg-container' : 'bg-primary-1'} 
                                           flex items-center justify-center text-xs">
                                    ${msg.role === 'customer' 
                                        ? '<i class="fa-solid fa-user text-text-tertiary"></i>' 
                                        : '<i class="fa-solid fa-user-tie text-primary"></i>'}
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center space-x-2 mb-1">
                                        <span class="text-xs font-medium ${msg.role === 'customer' ? 'text-text-secondary' : 'text-primary'}">
                                            ${msg.role === 'customer' ? '顾客' : session.staff.name}
                                        </span>
                                        <span class="text-xs text-text-tertiary">${msg.time}</span>
                                    </div>
                                    <p class="text-sm text-text-primary leading-relaxed">${msg.text}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- 底部操作按钮 -->
            <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-border-split p-4 z-20">
                ${session.hasCreateTask ? `
                    <!-- 创建监督任务按钮区域 -->
                    <div class="mb-3">
                        ${session.createdTaskId ? `
                            <button onclick="openTaskDetailView(${session.createdTaskId})" 
                                    class="w-full py-3 bg-success text-white rounded-lg hover:bg-success transition-all shadow-md flex items-center justify-center">
                                <i class="fa-solid fa-check-circle mr-2"></i>已创建监督任务
                            </button>
                        ` : `
                            <button onclick="handleCreateTaskFromSession('${session.id}')" 
                                    class="w-full py-3 bg-secondary-orange text-white rounded-lg hover:opacity-90 transition-all shadow-md flex items-center justify-center">
                                <i class="fa-solid fa-plus-circle mr-2"></i>创建监督任务
                            </button>
                        `}
                    </div>
                ` : ''}
                
                <!-- 反馈和分享按钮 -->
                <div class="flex space-x-3">
                    <button onclick="handleFeedback('like', '${session.id}')" 
                            class="flex-1 py-3 border border-border-base rounded-lg text-text-secondary hover:bg-bg-hover transition-colors">
                        <i class="fa-regular fa-thumbs-up mr-2"></i>有帮助
                    </button>
                    <button onclick="handleFeedback('dislike', '${session.id}')" 
                            class="flex-1 py-3 border border-border-base rounded-lg text-text-secondary hover:bg-bg-hover transition-colors">
                        <i class="fa-regular fa-thumbs-down mr-2"></i>没帮助
                    </button>
                    <button onclick="handleShare('session', '${session.id}')" 
                            class="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all shadow-md">
                        <i class="fa-solid fa-share-nodes mr-2"></i>分享
                    </button>
                </div>
            </div>
        </main>
    `;
}

/**
 * 从会话详情返回首页
 */
function backToHomeFromSessionDetail() {
    showToolbar();
    if (typeof renderHomeView === 'function') {
        // 保留原有聊天消息
        renderHomeView({ preserveMessages: true });
    }
}

/**
 * 关闭会话详情页（在会话列表页中使用）
 */
function hideSessionDetailView() {
    const sessionDetailView = document.getElementById('session-detail-view');
    const sessionsView = document.getElementById('sessions-view');
    
    if (sessionDetailView && sessionsView) {
        sessionDetailView.classList.add('hidden');
        sessionsView.classList.remove('hidden');
    }
}

/**
 * 返回首页
 */
function backToHome() {
    if (typeof renderHomeView === 'function') {
        renderHomeView();
    }
}

/**
 * 从会话创建监督任务
 * @param {string} sessionId - 会话ID
 */
function handleCreateTaskFromSession(sessionId) {
    const session = sessionsData.find(s => s.id === sessionId);
    if (!session) return;
    
    // 打开创建任务页面
    if (typeof openCreateTaskView === 'function') {
        openCreateTaskView();
    }
    
    // AI预填充任务配置
    setTimeout(() => {
        if (typeof prefillTaskFromSession === 'function') {
            prefillTaskFromSession(session);
        }
    }, 100);
}

/**
 * AI预填充任务配置(从会话)
 * @param {Object} session - 会话对象
 */
function prefillTaskFromSession(session) {
    // 根据会话类型生成任务配置
    let taskConfig = {
        name: '',
        intro: '',
        action: ''
    };
    
    if (session.riskLevel === 'high' && session.tags.includes('禁忌症未询问')) {
        // 高风险会话 - 生成禁忌症询问任务
        const drugName = session.tags.find(tag => tag.includes('销售'))?.replace('销售', '') || '药品';
        taskConfig = {
            name: `${drugName}禁忌症询问`,
            intro: `顾客购买${drugName}等非甾体抗炎药时，店员需主动询问禁忌症`,
            action: '店员必须询问顾客是否有胃溃疡、出血倾向、过敏史等禁忌症，并根据回答给出专业建议。'
        };
    } else {
        // 其他类型会话，使用默认配置
        taskConfig = {
            name: '会话监督任务',
            intro: session.summary.substring(0, 100),
            action: '店员应按照标准流程提供专业服务'
        };
    }
    
    // 直接填充到输入框（新版本无需生成步骤）
    const nameInput = document.getElementById('task-name');
    const introInput = document.getElementById('task-intro');
    const actionInput = document.getElementById('task-action');
    
    if (nameInput) {
        nameInput.value = taskConfig.name;
        if (typeof updateCharCount === 'function') {
            updateCharCount('task-name', 20);
        }
    }
    if (introInput) {
        introInput.value = taskConfig.intro;
        if (typeof updateCharCount === 'function') {
            updateCharCount('task-intro', 100);
        }
    }
    if (actionInput) {
        actionInput.value = taskConfig.action;
        if (typeof updateCharCount === 'function') {
            updateCharCount('task-action', 200);
        }
    }
}

/**
 * 初始化会话模块
 */
function initSessionsModule() {
    if (document.getElementById('sessions-list-container')) {
        renderSessionsList();
    }
}
