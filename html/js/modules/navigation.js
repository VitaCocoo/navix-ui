/**
 * 对话式交互模块
 * 负责处理工具栏按钮点击,在对话流中动态添加内容
 * 新架构:单页面对话模式,所有功能通过对话展示
 */

/**
 * 在对话流中添加用户消息气泡
 * @param {string} message - 用户消息内容
 */
function addUserMessage(message) {
    const chatList = document.getElementById('chat-messages-list');
    if (!chatList) return;
    
    const bubble = document.createElement('div');
    bubble.className = 'user-bubble animate-slide-up';
    bubble.textContent = message;
    chatList.appendChild(bubble);
    
    // 自动滚动到底部
    scrollToBottom();
}

/**
 * 在对话流中添加AI回复消息
 * @param {HTMLElement|string} content - AI回复内容(DOM元素或HTML字符串)
 */
function addAIMessage(content) {
    const chatList = document.getElementById('chat-messages-list');
    if (!chatList) return;
    
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'ai-response-wrapper animate-slide-up';
    
    if (typeof content === 'string') {
        messageWrapper.innerHTML = content;
    } else {
        messageWrapper.appendChild(content);
    }
    
    chatList.appendChild(messageWrapper);
    
    // 自动滚动到底部
    scrollToBottom();
}

/**
 * 处理工具栏按钮点击
 * @param {string} action - 操作类型 ('refresh', 'tasks', 'data-center')
 */
function handleToolbarAction(action) {
    switch(action) {
        case 'refresh':
            showOneMoreMessage();
            break;
            
        case 'tasks':
            showTasksInChat();
            break;
            
        case 'data-center':
            // 直接跳转到数据中心页面，不在聊天界面发送消息
            if (typeof renderDataCenterView === 'function') {
                renderDataCenterView();
            }
            break;
            
        default:
            console.warn('未知的工具栏操作:', action);
    }
}

/**
 * 推送一条新消息(再来一条)
 */
function showOneMoreMessage() {
    // 添加用户消息
    addUserMessage('再来一条');
    
    // 延迟推送AI消息
    setTimeout(() => {
        // 获取所有可用消息
        const allMessages = [...aiMessages];
        
        // 随机选择一条消息
        const randomIndex = Math.floor(Math.random() * allMessages.length);
        const selectedMessage = allMessages[randomIndex];
        
        // 渲染消息气泡
        if (typeof renderMessageBubble === 'function') {
            renderMessageBubble(selectedMessage);
            
            // 渲染后滚动到底部（显示新消息）
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    }, 300);
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
 * 在对话中展示监督任务
 */
function showTasksInChat() {
    // 添加用户消息
    addUserMessage('查看监督任务');
    
    // 延迟添加AI回复
    setTimeout(() => {
        // 生成唯一ID避免重复
        const timestamp = Date.now();
        const tasksContent = `
            <div class="ai-response-card" id="tasks-response-card-${timestamp}">
                <div class="card-header">
                    <div>
                        <div class="card-title">
                            <i class="fa-solid fa-clipboard-check mr-2 text-primary"></i>
                            监督任务列表
                        </div>
                        <div class="card-subtitle">共${supervisionTasks.length}个任务正在运行</div>
                    </div>
                    <button class="message-action-btn primary" data-action="create-task">
                        <i class="fa-solid fa-plus"></i>
                        创建任务
                    </button>
                </div>
                
                <div class="space-y-2">
                    ${supervisionTasks.map(task => `
                        <div class="task-item" data-task-id="${task.id}" style="cursor: pointer;">
                            <div class="task-title">${task.title}</div>
                            <div class="task-desc">${task.desc}</div>
                            <div class="task-meta">
                                <div class="task-value">${task.value}</div>
                                <div class="task-change ${task.isUp ? 'up' : 'down'}">
                                    <i class="fa-solid fa-arrow-${task.isUp ? 'up' : 'down'}"></i>
                                    <span>${task.changeRel}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        addAIMessage(tasksContent);
        
        // 使用事件委托绑定点击事件 - 绑定到响应卡片上
        setTimeout(() => {
            const responseCard = document.getElementById(`tasks-response-card-${timestamp}`);
            if (responseCard) {
                // 使用单一事件监听器处理所有点击
                responseCard.addEventListener('click', function(e) {
                    // 检查是否点击了创建任务按钮
                    const createBtn = e.target.closest('[data-action="create-task"]');
                    if (createBtn) {
                        e.preventDefault();
                        e.stopPropagation();
                        // 使用window对象访问全局函数
                        if (typeof window.openCreateTaskView === 'function') {
                            window.openCreateTaskView();
                        }
                        return;
                    }
                    
                    // 检查是否点击了任务卡片
                    const taskItem = e.target.closest('.task-item');
                    if (taskItem) {
                        const taskId = parseInt(taskItem.getAttribute('data-task-id'));
                        // 使用window对象访问全局函数
                        if (taskId && typeof window.openTaskDetailView === 'function') {
                            window.openTaskDetailView(taskId);
                        }
                    }
                });
                console.log('[Tasks] 事件监听器已绑定到 tasks-response-card-' + timestamp);
            } else {
                console.error('[Tasks] tasks-response-card 未找到, timestamp:', timestamp);
            }
        }, 100);
    }, 300);
}

/**
 * 在对话中展示数据中心（已废弃，改为直接跳转）
 * @deprecated 使用 renderDataCenterView() 代替
 */
function showDataCenterInChat() {
    console.warn('[Deprecated] showDataCenterInChat() 已废弃，请使用 renderDataCenterView()');
    // 直接跳转到数据中心页面
    if (typeof renderDataCenterView === 'function') {
        renderDataCenterView();
    }
}

/**
 * 以下功能已删除：更多菜单及相关子功能
 * 删除原因：简化工具栏，精简功能入口
 * 删除日期：2026-01-20
 * 影响：showMoreInChat, showProfile, showSessions, showSettings, showStoreRanking, handleLogout 等函数已移除
 */

/**
 * 初始化导航模块
 */
function initNavigationModule() {
    console.log('[Navigation] 对话式交互模块已初始化');
}
