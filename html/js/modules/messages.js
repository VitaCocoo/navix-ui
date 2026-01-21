/**
 * 消息推送模块
 * 负责AI消息的渲染、筛选、交互逻辑
 */

// 全局变量：当前正在从哪个消息创建任务
let currentCreatingTaskFromMessage = null;

/**
 * 检查是否首次使用
 */
function isFirstTimeUser() {
    return !localStorage.getItem('has_used_app');
}

/**
 * 标记用户已使用
 */
function markAsUsed() {
    localStorage.setItem('has_used_app', 'true');
}

/**
 * 渲染AI问候语
 */
function renderAIGreeting() {
    const container = document.getElementById('ai-greeting-section');
    if (!container) return;
    
    const currentHour = new Date().getHours();
    let greetingText = '早上好';
    if (currentHour >= 12 && currentHour < 18) {
        greetingText = '下午好';
    } else if (currentHour >= 18) {
        greetingText = '晚上好';
    }
    
    container.innerHTML = `
        <div class="ai-greeting-card animate-fade-in">
            <div class="flex items-start space-x-3">
                <div class="ai-avatar">
                    <div class="ai-avatar-inner">
                        <i class="fa-solid fa-robot text-xl text-primary"></i>
                    </div>
                </div>
                <div class="flex-1">
                    <div class="greeting-title">${greetingText}！</div>
                    <div class="greeting-text">为您播报昨日重要情况</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染首次使用欢迎消息
 */
function renderWelcomeMessage() {
    const container = document.getElementById('today-messages-list');
    if (!container) return;
    
    container.innerHTML = `
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
 * 关闭欢迎消息并标记已使用
 */
function dismissWelcomeMessage() {
    markAsUsed();
    renderTodayMessages(); // 渲染正常的今日消息
}

/**
 * 渲染今日推送消息（3条最重要的消息）
 */
function renderTodayMessages() {
    const container = document.getElementById('today-messages-list');
    if (!container) return;
    
    // 检查是否首次使用
    if (isFirstTimeUser()) {
        renderWelcomeMessage();
        return;
    }
    
    // 获取今日消息（已按优先级排序）
    const todayMessages = aiMessages.slice(0, 3);
    
    if (todayMessages.length === 0) {
        container.innerHTML = `
            <div class="empty-messages">
                <i class="fa-regular fa-comments"></i>
                <p>暂无新消息</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = todayMessages.map((msg, index) => `
        <div class="message-bubble animate-slide-up" style="animation-delay: ${index * 0.1}s">
            <!-- 消息类型标签 -->
            <div class="message-type-badge type-${msg.type}">
                ${msg.typeLabel}
            </div>
            
            <!-- 消息标题 -->
            <div class="message-title">${msg.title}</div>
            
            <!-- 消息总结 -->
            <div class="message-summary">${msg.summary}</div>
            
            <!-- 图表（如果有） -->
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
                
                ${msg.hasCreateTask ? `
                    <button class="message-action-btn secondary" onclick="handleCreateTaskFromMessage('${msg.id}')">
                        <i class="fa-solid fa-plus-circle"></i>
                        创建监督任务
                    </button>
                ` : ''}
            </div>
            
            <!-- 消息时间 -->
            <div class="message-time">
                <i class="fa-regular fa-clock"></i>
                ${msg.time}
            </div>
        </div>
    `).join('');
    
    // 渲染图表
    todayMessages.forEach(msg => {
        if (msg.hasChart && msg.chartData) {
            renderMessageChart(msg);
        }
    });
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
                borderColor: getComputedStyle(document.documentElement).getPropertyValue('--chart-blue').trim(),
                backgroundColor: 'rgba(66, 153, 225, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
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
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim(),
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
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-split').trim()
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim(),
                        font: { size: 10 }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim(),
                        font: { size: 10 }
                    }
                }
            }
        }
    });
}

/**
 * 渲染历史消息列表
 */
function renderHistoricalMessages() {
    const container = document.getElementById('historical-messages');
    if (!container) return;
    
    container.innerHTML = historicalMessages.map(dateGroup => `
        <!-- 日期分隔符 -->
        <div class="message-date-divider">${dateGroup.dateLabel}</div>
        
        <!-- 该日期的消息列表 -->
        ${dateGroup.messages.map(msg => `
            <div class="message-bubble">
                <div class="message-type-badge type-${msg.type}">
                    ${msg.typeLabel}
                </div>
                <div class="message-title">${msg.title}</div>
                <div class="message-summary line-clamp-2">${msg.summary}</div>
                <div class="message-actions">
                    <button class="message-action-btn primary" onclick="handleMessageDetailClick('${msg.id}')">
                        查看详情
                    </button>
                </div>
                <div class="message-time">
                    <i class="fa-regular fa-clock"></i>
                    ${msg.time}
                </div>
            </div>
        `).join('')}
    `).join('');
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
                // 如果有多个会话，跳转到第一个会话详情（实际场景可能需要跳转到会话列表）
                openSessionDetailView(message.relatedData.sessionIds[0]);
            }
            break;
            
        case 'metric':
            // 跳转到指标详情 - 需要将指标名称转换为索引
            const metricName = message.relatedData.metricName;
            const metricIndex = metricsData.findIndex(m => m.title === metricName);
            if (metricIndex !== -1) {
                // 从消息进入，传递消息数据以显示AI分析和建议
                openMetricDetailView(metricIndex, { messageData: message });
            } else {
                console.error('未找到指标:', metricName);
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
 * 从消息创建监督任务（带AI预填充）
 */
function handleCreateTaskFromMessage(messageId) {
    const message = aiMessages.find(m => m.id === messageId);
    if (!message) return;
    
    // 记录当前正在从哪个消息创建任务
    currentCreatingTaskFromMessage = messageId;
    
    // 打开创建任务页面
    openCreateTaskView();
    
    // AI预填充任务配置
    setTimeout(() => {
        prefillTaskFromMessage(message);
    }, 100);
}

/**
 * AI预填充任务配置
 * 根据消息类型生成监督任务配置，直接填充到已生成的字段中
 */
function prefillTaskFromMessage(message) {
    // 根据消息类型生成任务配置
    let taskConfig = {
        name: '',
        intro: '',
        action: ''
    };
    
    if (message.type === 'risk' && message.relatedData.riskLevel === 'high') {
        // 高风险消息 - 生成禁忌症询问任务
        taskConfig = {
            name: '阿司匹林禁忌症询问',
            intro: '顾客购买阿司匹林等非甾体抗炎药时，店员需主动询问禁忌症',
            action: '店员必须询问顾客是否有胃溃疡、出血倾向、过敏史等禁忌症，并根据回答给出专业建议。'
        };
    } else if (message.type === 'excellent') {
        // 优秀案例 - 生成推荐类任务
        taskConfig = {
            name: '专业服务与关联推荐',
            intro: '顾客购买药品时，店员应主动询问症状并推荐相关产品',
            action: '店员应询问顾客具体症状，推荐合适药品，并主动推荐关联产品（如维生素、益生菌等）。'
        };
    }
    
    // 触发AI生成，自动进入生成后状态
    const aiInputDesc = document.getElementById('ai-input-desc');
    const generatedResultArea = document.getElementById('generated-result-area');
    const btnInitialGenerate = document.getElementById('btn-initial-generate');
    const btnGroupGenerated = document.getElementById('btn-group-generated');
    
    if (!aiInputDesc || !generatedResultArea) return;
    
    // 填充AI输入描述（基于消息摘要）
    aiInputDesc.value = message.summary.replace(/•/g, '').replace(/\n/g, ' ');
    
    // 显示生成结果区域
    generatedResultArea.classList.remove('hidden');
    btnInitialGenerate.classList.add('hidden');
    btnGroupGenerated.classList.remove('hidden');
    btnGroupGenerated.classList.add('flex');
    
    // 填充已生成的字段（字段ID需要与tasks.js中的一致）
    const nameInput = document.getElementById('task-name');
    const introInput = document.getElementById('task-intro');
    const actionInput = document.getElementById('task-action');
    
    if (nameInput) nameInput.value = taskConfig.name;
    if (introInput) introInput.value = taskConfig.intro;
    if (actionInput) actionInput.value = taskConfig.action;
    
    // 更新字符计数（使用helpers.js中的updateCharCount函数）
    if (typeof updateCharCount === 'function') {
        updateCharCount('task-name', 20);
        updateCharCount('task-intro', 100);
        updateCharCount('task-action', 200);
    }
    
    // 平滑滚动到生成结果区域
    setTimeout(() => {
        const modal = document.getElementById('create-task-modal');
        if (modal) {
            const scrollContainer = modal.querySelector('.overflow-y-auto');
            if (scrollContainer) {
                scrollContainer.scrollTo({ 
                    top: scrollContainer.scrollHeight, 
                    behavior: 'smooth' 
                });
            }
        }
    }, 100);
}

/**
 * 初始化消息模块
 */
function initMessagesModule() {
    renderAIGreeting();
    renderTodayMessages();
}
