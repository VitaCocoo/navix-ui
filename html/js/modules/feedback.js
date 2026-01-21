/**
 * 用户反馈模块
 * 负责点赞、点踩、分享功能的统一实现
 */

/**
 * 处理用户反馈（点赞/点踩）
 * @param {string} type - 'like' 或 'dislike'
 * @param {string} itemId - 对象ID（会话/任务/指标等）
 * @param {string} itemType - 对象类型（可选）
 */
function handleFeedback(type, itemId, itemType = 'unknown') {
    if (type === 'like') {
        handleLike(itemId, itemType);
    } else if (type === 'dislike') {
        handleDislike(itemId, itemType);
    }
}

/**
 * 处理点赞
 */
function handleLike(itemId, itemType) {
    // 显示感谢提示
    showToast('感谢反馈！', 'success');
    
    // 记录反馈数据（实际应该发送到后端）
    console.log('点赞反馈:', { itemId, itemType, type: 'like', timestamp: new Date() });
    
    // 按钮状态变化
    const likeBtn = event.target.closest('button');
    if (likeBtn) {
        likeBtn.classList.add('text-success', 'border-success');
        likeBtn.disabled = true;
    }
}

/**
 * 处理点踩 - 弹出反馈表单
 */
function handleDislike(itemId, itemType) {
    // 显示反馈表单弹窗
    showDislikeFeedbackModal(itemId, itemType);
}

/**
 * 显示点踩反馈表单
 */
function showDislikeFeedbackModal(itemId, itemType) {
    // 创建弹窗
    const modal = document.createElement('div');
    modal.id = 'dislike-feedback-modal';
    modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-auto animate-slide-up">
            <!-- 标题 -->
            <div class="sticky top-0 bg-white border-b border-border-split p-4 z-10">
                <h3 class="text-lg font-bold text-text-primary text-center">请告诉我们哪里不够好</h3>
            </div>
            
            <!-- 表单内容 -->
            <div class="p-4">
                <!-- 问题类型（多选） -->
                <div class="mb-4">
                    <label class="text-sm font-semibold text-text-primary mb-2 block">问题类型（可多选）</label>
                    <div class="space-y-2">
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" name="issue-type" value="summary-incorrect" 
                                   class="w-4 h-4 text-primary border-border-base rounded">
                            <span class="text-sm text-text-secondary">会话总结不准确</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" name="issue-type" value="transcript-error" 
                                   class="w-4 h-4 text-primary border-border-base rounded">
                            <span class="text-sm text-text-secondary">对话内容识别有误</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" name="issue-type" value="risk-misjudged" 
                                   class="w-4 h-4 text-primary border-border-base rounded">
                            <span class="text-sm text-text-secondary">风险等级判断不当</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" name="issue-type" value="tag-error" 
                                   class="w-4 h-4 text-primary border-border-base rounded">
                            <span class="text-sm text-text-secondary">标签标注错误</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" name="issue-type" value="task-misjudged" 
                                   class="w-4 h-4 text-primary border-border-base rounded">
                            <span class="text-sm text-text-secondary">监督任务判断有误</span>
                        </label>
                        <label class="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" name="issue-type" value="other" 
                                   class="w-4 h-4 text-primary border-border-base rounded">
                            <span class="text-sm text-text-secondary">其他问题</span>
                        </label>
                    </div>
                </div>
                
                <!-- 详细说明 -->
                <div class="mb-4">
                    <label class="text-sm font-semibold text-text-primary mb-2 block">详细说明（选填）</label>
                    <textarea id="feedback-detail-input" 
                              class="w-full px-3 py-2 border border-border-base rounded-lg resize-none text-sm text-text-primary"
                              rows="4"
                              placeholder="请详细描述您遇到的问题..."></textarea>
                </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="sticky bottom-0 bg-white border-t border-border-split p-4 flex space-x-3">
                <button onclick="closeDislikeFeedbackModal()" 
                        class="flex-1 py-3 border border-border-base rounded-lg text-text-secondary hover:bg-bg-hover transition-colors">
                    取消
                </button>
                <button onclick="submitDislikeFeedback('${itemId}', '${itemType}')" 
                        class="flex-1 py-3 bg-gradient-primary text-white rounded-lg hover:brightness-110 transition-all">
                    提交反馈
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDislikeFeedbackModal();
        }
    });
}

/**
 * 关闭点踩反馈弹窗
 */
function closeDislikeFeedbackModal() {
    const modal = document.getElementById('dislike-feedback-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * 提交点踩反馈
 */
function submitDislikeFeedback(itemId, itemType) {
    // 收集选中的问题类型
    const issueTypes = Array.from(document.querySelectorAll('input[name="issue-type"]:checked'))
        .map(input => input.value);
    
    // 获取详细说明
    const detailInput = document.getElementById('feedback-detail-input');
    const detail = detailInput ? detailInput.value : '';
    
    // 验证：至少选择一个问题类型
    if (issueTypes.length === 0) {
        showToast('请至少选择一个问题类型', 'error');
        return;
    }
    
    // 记录反馈数据（实际应该发送到后端）
    console.log('点踩反馈:', {
        itemId,
        itemType,
        type: 'dislike',
        issueTypes,
        detail,
        timestamp: new Date()
    });
    
    // 关闭弹窗
    closeDislikeFeedbackModal();
    
    // 显示感谢提示
    showToast('感谢反馈，我们会持续改进！', 'success');
}

/**
 * 处理分享功能
 * @param {string} contentType - 'session'/'task'/'metric'等
 * @param {string} contentId - 内容ID
 */
function handleShare(contentType, contentId) {
    showShareModal(contentType, contentId);
}

/**
 * 显示分享弹窗
 */
function showShareModal(contentType, contentId) {
    const modal = document.createElement('div');
    modal.id = 'share-modal';
    modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-end justify-center';
    modal.innerHTML = `
        <div class="bg-white rounded-t-2xl w-full max-w-md animate-slide-up pb-safe">
            <!-- 标题 -->
            <div class="border-b border-border-split p-4 flex items-center justify-between">
                <h3 class="text-base font-bold text-text-primary">分享</h3>
                <button onclick="closeShareModal()" class="text-text-tertiary hover:text-text-primary">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            
            <!-- 分享预览 -->
            <div class="p-4">
                <div class="bg-bg-light rounded-lg p-4 mb-4">
                    <div class="text-center text-text-tertiary text-sm">
                        <i class="fa-regular fa-image text-4xl mb-2"></i>
                        <p>正在生成分享图片...</p>
                    </div>
                </div>
            </div>
            
            <!-- 分享选项 -->
            <div class="px-4 pb-4 grid grid-cols-2 gap-3">
                <button onclick="shareToFriend('${contentType}', '${contentId}')" 
                        class="flex flex-col items-center justify-center py-4 rounded-lg hover:bg-bg-hover transition-colors">
                    <i class="fa-solid fa-user text-2xl text-primary mb-2"></i>
                    <span class="text-xs text-text-secondary">发送给好友</span>
                </button>
                <button onclick="saveToPhone('${contentType}', '${contentId}')" 
                        class="flex flex-col items-center justify-center py-4 rounded-lg hover:bg-bg-hover transition-colors">
                    <i class="fa-solid fa-download text-2xl text-secondary-orange mb-2"></i>
                    <span class="text-xs text-text-secondary">保存到手机</span>
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeShareModal();
        }
    });
    
    // 生成分享图片
    generateShareImage(contentType, contentId);
}

/**
 * 关闭分享弹窗
 */
function closeShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * 生成分享图片
 */
function generateShareImage(contentType, contentId) {
    // 这里应该使用html2canvas等库生成图片
    // 暂时使用模拟实现
    setTimeout(() => {
        const preview = document.querySelector('#share-modal .bg-bg-light');
        if (!preview) return;
        
        let content = '';
        
        // 根据内容类型生成不同的预览
        if (contentType === 'session') {
            content = generateSessionSharePreview(contentId);
        } else if (contentType === 'task') {
            content = generateTaskSharePreview(contentId);
        } else if (contentType === 'metric') {
            content = generateMetricSharePreview(contentId);
        } else {
            content = generateDefaultSharePreview();
        }
        
        preview.innerHTML = content;
    }, 500);
}

/**
 * 生成会话分享内容预览
 */
function generateSessionSharePreview(sessionId) {
    // 查找会话数据
    const session = sessionsData.find(s => s.id === sessionId);
    if (!session) return generateDefaultSharePreview();
    
    // AI总结精简至80字
    const shortSummary = session.summary.length > 80 
        ? session.summary.substring(0, 80) + '...' 
        : session.summary;
    
    // 最多显示2条AI建议
    const suggestions = session.suggestions ? session.suggestions.slice(0, 2) : [];
    
    // 选择2-3条关键对话
    const keyTranscript = session.transcript ? session.transcript.slice(0, 3) : [];
    
    return `
        <div class="bg-white rounded-lg border border-border-base overflow-hidden">
            <div class="p-4">
                <!-- 标题 -->
                <div class="text-center mb-4">
                    <div class="inline-block px-3 py-1 bg-primary-1 text-primary rounded-full text-xs font-semibold mb-2">
                        📋 会话分享
                    </div>
                    <h3 class="text-base font-bold text-text-primary">${session.title}</h3>
                </div>
                
                <!-- 分隔线 -->
                <div class="border-t border-border-split my-3"></div>
                
                <!-- 基本信息 -->
                <div class="space-y-2 text-xs text-text-secondary mb-3">
                    <div class="flex items-center">
                        <i class="fa-solid fa-user mr-2 text-primary"></i>
                        <span>店员：${session.staff.name}</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fa-regular fa-clock mr-2 text-primary"></i>
                        <span>时间：${session.time}</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fa-regular fa-hourglass mr-2 text-primary"></i>
                        <span>时长：${session.duration}</span>
                    </div>
                </div>
                
                <!-- AI总结 -->
                <div class="mb-3">
                    <div class="text-xs font-semibold text-text-primary mb-1 flex items-center">
                        <i class="fa-solid fa-lightbulb text-warning mr-1"></i>
                        AI总结
                    </div>
                    <div class="text-xs text-text-secondary leading-relaxed bg-bg-light p-2 rounded">
                        ${shortSummary}
                    </div>
                </div>
                
                <!-- AI建议 -->
                ${suggestions.length > 0 ? `
                <div class="mb-3">
                    <div class="text-xs font-semibold text-text-primary mb-1 flex items-center">
                        <i class="fa-solid fa-wand-magic-sparkles text-primary mr-1"></i>
                        AI建议
                    </div>
                    <div class="text-xs text-text-secondary leading-relaxed bg-bg-light p-2 rounded space-y-1">
                        ${suggestions.map(s => `
                            <div class="flex items-start">
                                <span class="text-primary mr-1">•</span>
                                <span>${s}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                <!-- 关键对话 -->
                ${keyTranscript.length > 0 ? `
                <div>
                    <div class="text-xs font-semibold text-text-primary mb-1 flex items-center">
                        <i class="fa-solid fa-comments text-secondary-teal mr-1"></i>
                        关键对话
                    </div>
                    <div class="text-xs text-text-secondary bg-bg-light p-2 rounded space-y-2">
                        ${keyTranscript.map(msg => `
                            <div>
                                <span class="font-semibold">${msg.role === 'customer' ? '顾客' : session.staff.name}：</span>
                                <span>${msg.text}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * 生成监督任务分享内容预览
 */
function generateTaskSharePreview(taskId) {
    const task = supervisionTasks.find(t => t.id === taskId);
    if (!task) return generateDefaultSharePreview();
    
    return `
        <div class="bg-white rounded-lg border border-border-base overflow-hidden">
            <div class="p-4">
                <!-- 标题 -->
                <div class="text-center mb-4">
                    <div class="inline-block px-3 py-1 bg-primary-1 text-primary rounded-full text-xs font-semibold mb-2">
                        🎯 监督任务分享
                    </div>
                    <h3 class="text-base font-bold text-text-primary">${task.title}</h3>
                </div>
                
                <!-- 分隔线 -->
                <div class="border-t border-border-split my-3"></div>
                
                <!-- 达成率 -->
                <div class="text-center mb-4">
                    <div class="text-3xl font-bold text-primary mb-1">${task.value}</div>
                    <div class="text-xs text-text-tertiary">当前达成率</div>
                    <div class="text-sm font-semibold ${task.isUp ? 'text-success' : 'text-error'} mt-1">
                        <i class="fa-solid fa-arrow-${task.isUp ? 'up' : 'down'} mr-1"></i>
                        ${task.changeRel}
                    </div>
                </div>
                
                <!-- 任务描述 -->
                <div class="mb-3">
                    <div class="text-xs font-semibold text-text-primary mb-1">任务说明</div>
                    <div class="text-xs text-text-secondary leading-relaxed bg-bg-light p-2 rounded">
                        ${task.desc}
                    </div>
                </div>
                
                <!-- AI执行总结 -->
                <div>
                    <div class="text-xs font-semibold text-text-primary mb-1 flex items-center">
                        <i class="fa-solid fa-lightbulb text-warning mr-1"></i>
                        AI执行总结
                    </div>
                    <div class="text-xs text-text-secondary leading-relaxed bg-bg-light p-2 rounded">
                        近7天该任务达成率${task.isUp ? '稳步提升' : '有所下降'}，整体表现${task.isUp ? '良好' : '需要改进'}。
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 生成指标分享内容预览
 */
function generateMetricSharePreview(metricIndex) {
    const metric = metricsData[metricIndex];
    if (!metric) return generateDefaultSharePreview();
    
    return `
        <div class="bg-white rounded-lg border border-border-base overflow-hidden">
            <div class="p-4">
                <!-- 标题 -->
                <div class="text-center mb-4">
                    <div class="inline-block px-3 py-1 bg-primary-1 text-primary rounded-full text-xs font-semibold mb-2">
                        📊 数据分享
                    </div>
                    <h3 class="text-base font-bold text-text-primary">${metric.title}</h3>
                </div>
                
                <!-- 分隔线 -->
                <div class="border-t border-border-split my-3"></div>
                
                <!-- 数值展示 -->
                <div class="text-center mb-4">
                    <div class="text-3xl font-bold text-primary mb-1">${metric.value}</div>
                    <div class="text-xs text-text-tertiary mb-2">昨日数据</div>
                    <div class="text-sm font-semibold ${metric.isUp ? 'text-success' : 'text-error'}">
                        <i class="fa-solid fa-arrow-${metric.isUp ? 'up' : 'down'} mr-1"></i>
                        较前日 ${metric.changeAbs} (${metric.changeRel})
                    </div>
                </div>
                
                <!-- 趋势说明 -->
                <div class="text-center">
                    <div class="text-xs text-text-secondary bg-bg-light p-3 rounded">
                        ${metric.isUp ? '📈 数据呈上升趋势' : '📉 数据有所下降'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 生成默认分享内容预览
 */
function generateDefaultSharePreview() {
    return `
        <div class="bg-white rounded-lg border border-border-base overflow-hidden">
            <div class="p-4">
                <div class="text-center">
                    <i class="fa-solid fa-share-nodes text-4xl text-primary mb-3"></i>
                    <div class="text-base font-bold text-text-primary mb-2">分享内容</div>
                    <div class="text-xs text-text-tertiary">药店智能决策 · 工牌模块</div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 分享到好友
 */
function shareToFriend(contentType, contentId) {
    showToast('分享功能仅在微信小程序中可用', 'info');
    closeShareModal();
}

/**
 * 保存到手机
 */
function saveToPhone(contentType, contentId) {
    showToast('图片已保存到相册', 'success');
    closeShareModal();
}

/**
 * 显示提示信息
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-20 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-up`;
    
    switch(type) {
        case 'success':
            toast.className += ' bg-success-bg border border-success-border text-success';
            break;
        case 'error':
            toast.className += ' bg-error-bg border border-error-border text-error';
            break;
        case 'warning':
            toast.className += ' bg-warning-bg border border-warning-border text-warning-text';
            break;
        default:
            toast.className += ' bg-info-bg border border-info-border text-info';
    }
    
    toast.innerHTML = `
        <div class="flex items-center space-x-2">
            ${type === 'success' ? '<i class="fa-solid fa-check-circle"></i>' : ''}
            ${type === 'error' ? '<i class="fa-solid fa-exclamation-circle"></i>' : ''}
            ${type === 'warning' ? '<i class="fa-solid fa-exclamation-triangle"></i>' : ''}
            ${type === 'info' ? '<i class="fa-solid fa-info-circle"></i>' : ''}
            <span class="text-sm font-medium">${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
