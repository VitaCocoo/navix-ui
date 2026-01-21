/**
 * 主界面模块(单页面对话模式)
 * 负责渲染完整的聊天对话界面
 * 所有功能都在这个对话流中展示
 */

// 历史消息加载状态
let loadedHistoryIndex = 0;  // 已加载到historicalMessages的第几个日期组
let isLoadingHistory = false;  // 是否正在加载历史消息
let hasMoreHistory = true;  // 是否还有更多历史消息

/**
 * 渲染主页面视图
 * @param {Object} options - 可选参数
 * @param {boolean} options.preserveMessages - 是否保留现有消息（默认false）
 */
function renderHomeView(options = {}) {
    const container = document.getElementById('app-container');
    if (!container) return;
    
    // 如果要求保留消息且首页已存在，则只显示现有内容，不重新渲染
    const existingHomeView = document.getElementById('home-view');
    if (options.preserveMessages && existingHomeView) {
        // 首页已存在，直接返回不重新渲染
        console.log('[Home] 保留现有聊天消息，不重新渲染');
        return;
    }
    
    // 重置历史消息加载状态
    loadedHistoryIndex = 0;
    isLoadingHistory = false;
    hasMoreHistory = true;
    
    container.innerHTML = `
        <main id="home-view" class="flex flex-col h-screen">
            <!-- 顶部标题栏 -->
            <header class="flex-shrink-0 px-4 py-4 bg-white border-b border-border-split">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-lg font-bold text-text-primary">药店智能决策</h1>
                        <p class="text-xs text-text-tertiary mt-1">您的智能经营助手</p>
                    </div>
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary-teal flex items-center justify-center">
                        <i class="fa-solid fa-robot text-white text-lg"></i>
                    </div>
                </div>
            </header>
            
            <!-- 对话消息区域 -->
            <div id="chat-messages-container" class="flex-1 overflow-y-auto px-4 py-4" style="padding-bottom: 100px;">
                <!-- 加载提示区域（顶部） -->
                <div id="history-loading-indicator" class="hidden text-center py-3">
                    <i class="fa-solid fa-spinner fa-spin text-primary"></i>
                    <span class="ml-2 text-xs text-text-tertiary">加载历史消息...</span>
                </div>
                
                <!-- 无更多历史消息提示 -->
                <div id="no-more-history-indicator" class="hidden text-center py-3">
                    <span class="text-xs text-text-tertiary">已显示全部历史消息</span>
                </div>
                
                <div id="chat-messages-list" class="space-y-3"></div>
            </div>
        </main>
    `;
    
    // 初始化对话内容
    initChatMessages();
    
    // 初始化滚动监听器
    initScrollListener();
}

/**
 * 初始化对话消息
 */
function initChatMessages() {
    // 检查是否首次使用
    if (isFirstTimeUser()) {
        renderWelcomeMessage();
    } else {
        // 渲染AI问候
        renderAIGreeting();
        
        // 渲染今日消息
        renderTodayMessages();
    }
}

/**
 * 渲染欢迎消息(首次使用)
 */
function renderWelcomeMessage() {
    const chatList = document.getElementById('chat-messages-list');
    if (!chatList) return;
    
    chatList.innerHTML = `
        <div class="welcome-message-bubble animate-slide-up">
            <div class="message-title">${welcomeMessage.title}</div>
            <div class="message-content">${welcomeMessage.content}</div>
            <div class="mt-4 text-center">
                <button onclick="dismissWelcomeMessage()" 
                        class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                    <i class="fa-solid fa-check mr-2"></i>
                    我知道了
                </button>
            </div>
        </div>
    `;
}

/**
 * 关闭欢迎消息
 */
function dismissWelcomeMessage() {
    markAsUsed();
    
    // 清空欢迎消息
    const chatList = document.getElementById('chat-messages-list');
    if (chatList) {
        chatList.innerHTML = '';
    }
    
    // 渲染正常内容
    renderAIGreeting();
    renderTodayMessages();
}

/**
 * 渲染AI问候语
 */
function renderAIGreeting() {
    const chatList = document.getElementById('chat-messages-list');
    if (!chatList) return;
    
    const currentHour = new Date().getHours();
    let greetingText = '早上好';
    if (currentHour >= 12 && currentHour < 18) {
        greetingText = '下午好';
    } else if (currentHour >= 18) {
        greetingText = '晚上好';
    }
    
    const greetingHTML = `
        <div class="ai-greeting-card animate-fade-in">
            <div class="flex items-start space-x-3">
                <div class="ai-avatar">
                    <div class="ai-avatar-inner">
                        <i class="fa-solid fa-robot text-xl text-primary"></i>
                    </div>
                </div>
                <div class="flex-1">
                    <div class="greeting-title">${greetingText}!</div>
                    <div class="greeting-text">为您播报昨日重要情况</div>
                </div>
            </div>
        </div>
    `;
    
    chatList.insertAdjacentHTML('beforeend', greetingHTML);
}

/**
 * 渲染今日消息
 */
function renderTodayMessages() {
    const chatList = document.getElementById('chat-messages-list');
    if (!chatList) return;
    
    // 获取今日消息(前3条最重要的)
    const todayMessages = aiMessages.slice(0, 3);
    
    if (todayMessages.length === 0) {
        chatList.insertAdjacentHTML('beforeend', `
            <div class="empty-messages">
                <i class="fa-regular fa-comments"></i>
                <p>暂无新消息</p>
            </div>
        `);
        return;
    }
    
    // 渲染每条消息，最新的在最下面
    todayMessages.forEach((msg, index) => {
        setTimeout(() => {
            renderMessageBubble(msg);
            
            // 渲染最后一条消息后，滚动到底部
            if (index === todayMessages.length - 1) {
                setTimeout(() => {
                    scrollToBottom();
                }, 100);
            }
        }, index * 100);
    });
}

/**
 * 渲染单条消息气泡
 * @param {Object} msg - 消息对象
 */
function renderMessageBubble(msg) {
    const chatList = document.getElementById('chat-messages-list');
    if (!chatList) return;
    
    const messageHTML = `
        <div class="message-bubble animate-slide-up">
            <!-- 消息类型标签 -->
            <div class="message-type-badge type-${msg.type}">
                ${msg.typeLabel}
            </div>
            
            <!-- 消息标题 -->
            <div class="message-title">${msg.title}</div>
            
            <!-- 消息总结 -->
            <div class="message-summary">${msg.summary}</div>
            
            <!-- 图表(如果有) -->
            ${msg.hasChart ? `
                <div class="message-chart-container">
                    <canvas id="message-chart-${msg.id}" style="height: 180px;"></canvas>
                </div>
            ` : ''}
            
            <!-- 操作按钮 -->
            <div class="message-actions">
                ${msg.hasDetail ? `
                    <button class="message-action-btn primary" onclick="handleMessageDetailClick('${msg.id}')">
                        <i class="fa-solid fa-arrow-right"></i>
                        查看详情
                    </button>
                ` : ''}
                
                ${msg.hasCreateTask ? (
                    msg.createdTaskId ? `
                        <button class="message-action-btn success" onclick="handleViewCreatedTask('${msg.id}', ${msg.createdTaskId})">
                            <i class="fa-solid fa-check-circle"></i>
                            已创建监督任务
                        </button>
                    ` : `
                        <button class="message-action-btn secondary" onclick="handleCreateTaskFromMessage('${msg.id}')">
                            <i class="fa-solid fa-plus-circle"></i>
                            创建监督任务
                        </button>
                    `
                ) : ''}
            </div>
            
            <!-- 消息时间 -->
            <div class="message-time">
                <i class="fa-regular fa-clock"></i>
                ${msg.time}
            </div>
        </div>
    `;
    
    // 新消息添加到底部（最新消息在最下面）
    chatList.insertAdjacentHTML('beforeend', messageHTML);
    
    // 如果有图表,渲染图表
    if (msg.hasChart && msg.chartData) {
        setTimeout(() => {
            renderMessageChart(msg);
        }, 100);
    }
}

/**
 * 滚动聊天框到底部（显示最新消息）
 */
function scrollToBottom() {
    const chatContainer = document.getElementById('chat-messages-container');
    if (chatContainer) {
        setTimeout(() => {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth'
            });
        }, 50);
    }
}

/**
 * 渲染消息内的图表
 */
function renderMessageChart(message) {
    const ctx = document.getElementById(`message-chart-${message.id}`);
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: message.chartData.labels,
            datasets: [{
                label: message.relatedData.metricName || '趋势',
                data: message.chartData.values,
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
                    cornerRadius: 8
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
                        font: { size: 10 }
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
 * 初始化滚动监听器
 * 监听用户向上滑动到顶部时加载历史消息
 */
function initScrollListener() {
    const chatContainer = document.getElementById('chat-messages-container');
    if (!chatContainer) return;
    
    chatContainer.addEventListener('scroll', function() {
        // 如果已经在加载，或者没有更多历史消息，则不处理
        if (isLoadingHistory || !hasMoreHistory) return;
        
        // 检测是否滚动到顶部（允许5px的误差）
        if (chatContainer.scrollTop <= 5) {
            loadMoreHistory();
        }
    });
}

/**
 * 加载更多历史消息
 * 每次加载一天的历史消息记录
 */
function loadMoreHistory() {
    // 检查是否还有更多历史消息
    if (loadedHistoryIndex >= historicalMessages.length) {
        hasMoreHistory = false;
        showNoMoreHistoryIndicator();
        return;
    }
    
    // 设置加载状态
    isLoadingHistory = true;
    showLoadingIndicator();
    
    // 获取当前容器的滚动高度（用于后续恢复滚动位置）
    const chatContainer = document.getElementById('chat-messages-container');
    const chatList = document.getElementById('chat-messages-list');
    const oldScrollHeight = chatList.scrollHeight;
    
    // 模拟网络延迟（实际应用中这里会是API调用）
    setTimeout(() => {
        // 获取下一天的历史消息
        const dateGroup = historicalMessages[loadedHistoryIndex];
        
        // 生成该日期组的HTML
        const historicalHTML = `
            <!-- 日期分隔符 -->
            <div class="message-date-divider animate-fade-in">${dateGroup.dateLabel}</div>
            
            <!-- 该日期的消息列表 -->
            ${dateGroup.messages.map((msg, index) => `
                <div class="message-bubble animate-slide-up" style="animation-delay: ${index * 0.05}s">
                    <!-- 消息类型标签 -->
                    <div class="message-type-badge type-${msg.type}">
                        ${msg.typeLabel}
                    </div>
                    
                    <!-- 消息标题 -->
                    <div class="message-title">${msg.title}</div>
                    
                    <!-- 消息总结 -->
                    <div class="message-summary">${msg.summary}</div>
                    
                    <!-- 操作按钮 -->
                    <div class="message-actions">
                        ${msg.hasDetail ? `
                            <button class="message-action-btn primary" onclick="handleMessageDetailClick('${msg.id}')">
                                <i class="fa-solid fa-arrow-right"></i>
                                查看详情
                            </button>
                        ` : ''}
                        
                        ${msg.hasCreateTask ? (
                            msg.createdTaskId ? `
                                <button class="message-action-btn success" onclick="handleViewCreatedTask('${msg.id}', ${msg.createdTaskId})">
                                    <i class="fa-solid fa-check-circle"></i>
                                    已创建监督任务
                                </button>
                            ` : `
                                <button class="message-action-btn secondary" onclick="handleCreateTaskFromMessage('${msg.id}')">
                                    <i class="fa-solid fa-plus-circle"></i>
                                    创建监督任务
                                </button>
                            `
                        ) : ''}
                    </div>
                    
                    <!-- 消息时间 -->
                    <div class="message-time">
                        <i class="fa-regular fa-clock"></i>
                        ${msg.time}
                    </div>
                </div>
            `).join('')}
        `;
        
        // 将历史消息插入到列表顶部（在加载提示之后）
        chatList.insertAdjacentHTML('afterbegin', historicalHTML);
        
        // 恢复滚动位置（保持用户浏览位置不变）
        const newScrollHeight = chatList.scrollHeight;
        chatContainer.scrollTop = newScrollHeight - oldScrollHeight;
        
        // 更新加载状态
        loadedHistoryIndex++;
        isLoadingHistory = false;
        hideLoadingIndicator();
        
        // 检查是否还有更多历史消息
        if (loadedHistoryIndex >= historicalMessages.length) {
            hasMoreHistory = false;
            showNoMoreHistoryIndicator();
        }
    }, 500);  // 模拟500ms的加载延迟
}

/**
 * 显示加载指示器
 */
function showLoadingIndicator() {
    const indicator = document.getElementById('history-loading-indicator');
    if (indicator) {
        indicator.classList.remove('hidden');
    }
}

/**
 * 隐藏加载指示器
 */
function hideLoadingIndicator() {
    const indicator = document.getElementById('history-loading-indicator');
    if (indicator) {
        indicator.classList.add('hidden');
    }
}

/**
 * 显示"无更多历史消息"提示
 */
function showNoMoreHistoryIndicator() {
    const indicator = document.getElementById('no-more-history-indicator');
    if (indicator) {
        indicator.classList.remove('hidden');
    }
}

/**
 * 隐藏"无更多历史消息"提示
 */
function hideNoMoreHistoryIndicator() {
    const indicator = document.getElementById('no-more-history-indicator');
    if (indicator) {
        indicator.classList.add('hidden');
    }
}

/**
 * 处理消息详情点击
 */
function handleMessageDetailClick(messageId) {
    const message = [...aiMessages, ...historicalMessages.flatMap(d => d.messages)]
        .find(m => m.id === messageId);
    
    if (!message) return;
    
    // 根据消息类型跳转到不同的详情页
    switch (message.detailType) {
        case 'session':
            // 跳转到会话详情
            if (message.relatedData.sessionId) {
                openSessionDetailView(message.relatedData.sessionId);
            } else if (message.relatedData.sessionIds && message.relatedData.sessionIds.length > 0) {
                // 如果有多个会话,显示会话列表
                showSessionsList(message.relatedData.sessionIds);
            }
            break;
            
        case 'metric':
            // 跳转到指标详情
            // 将metricName转换为metricIndex
            const metricIndex = metricsData.findIndex(m => m.title === message.relatedData.metricName);
            if (metricIndex !== -1) {
                // 从消息进入，传递消息数据以显示AI分析和建议
                openMetricDetailView(metricIndex, { messageData: message });
            } else {
                console.error('未找到对应的指标:', message.relatedData.metricName);
            }
            break;
            
        case 'task':
            // 跳转到任务详情
            if (message.relatedData.taskId) {
                openTaskDetailView(message.relatedData.taskId);
            }
            break;
            
        default:
            console.warn('未知的详情类型:', message.detailType);
    }
}

/**
 * 显示会话列表
 * @param {Array} sessionIds - 会话ID数组
 */
function showSessionsList(sessionIds) {
    if (typeof addUserMessage === 'function') {
        addUserMessage('查看相关会话');
    }
    
    setTimeout(() => {
        const sessions = sessionsData.filter(s => sessionIds.includes(s.id));
        
        const sessionsHTML = `
            <div class="ai-response-card">
                <div class="card-header">
                    <div>
                        <div class="card-title">
                            <i class="fa-regular fa-comments mr-2 text-primary"></i>
                            相关会话记录
                        </div>
                        <div class="card-subtitle">共${sessions.length}条相关会话</div>
                    </div>
                </div>
                
                <div class="space-y-2">
                    ${sessions.map(session => `
                        <div class="task-item" onclick="openSessionDetailView('${session.id}')">
                            <div class="flex items-start justify-between mb-2">
                                <div class="task-title">${session.title}</div>
                                <span class="message-type-badge type-${session.riskLevel === 'high' ? 'risk' : 'excellent'}">
                                    ${session.riskLabel}
                                </span>
                            </div>
                            <div class="task-desc">
                                ${session.staff.name} · ${session.store} · ${session.time}
                            </div>
                            <div class="task-desc line-clamp-2 mt-2">
                                ${session.summary}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        if (typeof addAIMessage === 'function') {
            addAIMessage(sessionsHTML);
        }
    }, 300);
}

/**
 * 从消息创建监督任务（直接弹出对话框，不发送聊天气泡）
 */
function handleCreateTaskFromMessage(messageId) {
    const message = aiMessages.find(m => m.id === messageId);
    if (!message) return;
    
    // 直接打开创建任务页面，不添加用户消息气泡
    openCreateTaskView();
    
    // AI预填充任务配置
    setTimeout(() => {
        if (typeof prefillTaskFromMessage === 'function') {
            prefillTaskFromMessage(message);
        }
    }, 100);
}

/**
 * 查看已创建的监督任务
 * @param {string} messageId - 消息ID
 * @param {number} taskId - 任务ID
 */
function handleViewCreatedTask(messageId, taskId) {
    // 跳转到监督任务详情页
    if (typeof openTaskDetailView === 'function') {
        openTaskDetailView(taskId);
    }
}

/**
 * 初始化主页面模块
 */
function initHomeModule() {
    console.log('[Home] 单页面对话模式已初始化');
}
