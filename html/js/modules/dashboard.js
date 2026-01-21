/**
 * 驾驶舱模块
 * 负责驾驶舱页面的渲染（指标卡片、任务列表、热词、案例）
 */

/**
 * 渲染指标卡片
 */
function renderMetrics() {
    const container = document.getElementById('metrics-scroll-container');
    container.innerHTML = metricsData.map((m, idx) => {
        // 客流量卡片(idx === 0)不使用任何动画特效,保持简洁静态展示
        const activeClass = idx === 0 ? '' : 'active:scale-95';
        const hoverClass = idx === 0 ? '' : 'hover:shadow-hover';
        const transitionClass = idx === 0 ? '' : 'transition-transform';
        return `
        <div onclick="openMetricDetailView(${idx})" class="inline-block w-40 glass-panel p-3 rounded-xl ${activeClass} ${transitionClass} cursor-pointer shadow-card ${hoverClass}">
            <div class="text-[10px] text-text-tertiary mb-1">${m.title}</div>
            <div class="text-xl font-bold text-text-primary mb-2 font-mono">${m.value}</div>
            <div class="flex items-center text-[10px] ${m.isUp ? 'text-success' : 'text-error'}">
                <i class="fa-solid fa-arrow-trend-${m.isUp ? 'up' : 'down'} mr-1"></i>
                <span>${m.changeAbs}</span>
                <span class="ml-1 opacity-70">(${m.changeRel})</span>
            </div>
        </div>
    `}).join('');
    // 添加右侧内边距提示
    container.insertAdjacentHTML('beforeend', '<div class="inline-block w-2"></div>');
}

/**
 * 渲染任务列表
 */
function renderSupervisionTasks() {
    const container = document.getElementById('supervision-task-list');
    container.innerHTML = supervisionTasks.map(t => `
        <div class="glass-panel p-3 rounded-lg relative group cursor-pointer active:scale-95 transition-transform hover:shadow-hover" onclick="openTaskDetailView(${t.id})">
            <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                    <h3 class="text-sm font-bold text-text-primary mb-1">${t.title}</h3>
                    <div class="flex items-center space-x-2">
                        <span class="text-[10px] text-text-tertiary"><i class="fa-regular fa-clock mr-1"></i>${t.createTime}</span>
                    </div>
                </div>
                <div class="flex space-x-3">
                    <button class="text-text-tertiary hover:text-primary" onclick="event.stopPropagation(); openTaskShareModal(${t.id})">
                        <i class="fa-solid fa-share-nodes text-xs"></i>
                    </button>
                    <button class="text-text-tertiary hover:text-primary" onclick="event.stopPropagation(); openEditTaskView(event, ${t.id})">
                        <i class="fa-solid fa-pen text-xs"></i>
                    </button>
                </div>
            </div>
            <div class="flex items-end justify-between">
                <div>
                    <div class="text-[10px] text-text-tertiary mb-0.5">昨日执行率</div>
                    <div class="text-lg font-bold text-text-primary font-mono">${t.value}</div>
                </div>
                <div class="text-[10px] ${t.isUp ? 'text-success' : 'text-error'}">
                    ${t.changeRel}
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * 渲染热词列表
 */
function renderHotWords() {
    const container = document.getElementById('insights-keywords');
    container.innerHTML = hotWords.map((w, idx) => {
        return `
        <div class="glass-panel rounded-lg overflow-hidden shadow-card hover:shadow-hover transition-shadow">
            <!-- Head -->
            <div class="flex items-center justify-between p-3">
                <div class="flex items-center space-x-3">
                    <span class="font-mono text-sm font-bold w-4 text-center ${idx < 3 ? 'text-primary' : 'text-text-tertiary'}">${w.rank}</span>
                    <div>
                        <div class="text-sm text-text-primary font-medium flex items-center">
                            ${w.text}
                            <span class="ml-2 text-[10px] bg-bg-container text-text-secondary px-1.5 rounded">${w.type}</span>
                        </div>
                    </div>
                </div>
                <div class="text-xs text-text-primary font-bold font-mono">${w.count}</div>
            </div>
        </div>
    `}).join('');
}

/**
 * 渲染案例列表
 */
function renderCases() {
    const container = document.getElementById('cases-list');
    container.innerHTML = casesData.map(c => `
        <div onclick="openCaseDetailView('${c.id}')" class="glass-panel rounded-xl p-4 relative group cursor-pointer active:scale-95 transition-transform hover:shadow-hover">
            <div class="flex justify-between items-start mb-3">
                 <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-bg-container overflow-hidden border border-border-base">
                        <img src="https://i.pravatar.cc/150?u=${c.id}" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <div class="text-sm font-bold text-text-primary">${c.name}</div>
                        <div class="text-[10px] text-text-tertiary">${c.store}</div>
                    </div>
                </div>
            </div>
            
            <div class="bg-primary-1 rounded-lg p-3 mb-3 border-l-2 border-primary">
                <div class="flex items-center space-x-2 mb-1">
                     <span class="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">${c.tag}</span>
                     <span class="text-[10px] text-text-tertiary">亮点点评</span>
                </div>
                <div class="text-xs text-text-primary leading-relaxed font-medium line-clamp-2">
                    ${c.reason}
                </div>
            </div>

            <div class="flex justify-between items-center pt-2 border-t border-border-light">
                <div class="text-[10px] text-text-tertiary">
                    会话时间 <span class="text-text-primary font-mono ml-1">${c.startTime}</span>
                </div>
                 <div class="text-[10px] text-text-tertiary">
                    时长 <span class="text-text-primary font-mono ml-1">${c.duration}</span>
                </div>
            </div>
        </div>
    `).join('');
}
