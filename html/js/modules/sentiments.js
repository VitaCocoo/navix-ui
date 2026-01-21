/**
 * 舆情管理模块
 * 负责舆情列表渲染、筛选、详情展示和分享功能
 */

let currentSentimentId = null;

/**
 * 渲染舆情列表
 * @param {string} filterType - 筛选类型 ('all' 或具体类型)
 */
function renderSentiments(filterType = 'all') {
    const container = document.getElementById('sentiment-cards-container');
    
    // 根据选定类型筛选数据
    const filteredData = filterType === 'all' ? sentimentData : sentimentData.filter(s => s.type === filterType);
    
    container.innerHTML = filteredData.map(s => {
        // 类型颜色映射（仅用于标签）
        let typeColorClass = '';
        switch(s.type) {
            case 'complaint':
                typeColorClass = 'text-error bg-error-bg border-error/30';
                break;
            case 'dispute':
                typeColorClass = 'text-error bg-error-bg border-error/30';
                break;
            case 'stock-out':
                typeColorClass = 'text-warning-text bg-warning-bg border-warning/30';
                break;
            case 'quality-issue':
                typeColorClass = 'text-error bg-error-bg border-error/30';
                break;
            case 'price-dispute':
                typeColorClass = 'text-warning-text bg-warning-bg border-warning/30';
                break;
            case 'service-risk':
                typeColorClass = 'text-error bg-error-bg border-error/30';
                break;
            case 'store-anomaly':
                typeColorClass = 'text-warning-text bg-warning-bg border-warning/30';
                break;
            case 'praise':
                typeColorClass = 'text-success bg-success-bg border-success/30';
                break;
        }

        return `
        <div onclick="openSentimentDetailView('${s.id}')" class="glass-panel rounded-xl p-4 relative cursor-pointer active:scale-95 transition-transform hover:shadow-hover">
            <!-- Type & Priority -->
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center space-x-2">
                    <span class="text-xs font-bold px-2.5 py-1 rounded-full border ${typeColorClass}">${s.typeText}</span>
                </div>
                <span class="text-[10px] text-text-tertiary">${s.time.split(' ')[1]}</span>
            </div>

            <!-- Title -->
            <h3 class="text-sm font-bold text-text-primary mb-2">${s.title}</h3>

            <!-- Summary -->
            <p class="text-xs text-text-secondary leading-relaxed mb-3 line-clamp-2">${s.summary}</p>

            <!-- Meta Info -->
            <div class="flex items-center justify-between pt-2 border-t border-border-light">
                <div class="flex items-center space-x-3 text-[10px] text-text-tertiary">
                    <span><i class="fa-solid fa-store mr-1"></i>${s.store}</span>
                    <span><i class="fa-solid fa-user mr-1"></i>${s.staff.name}</span>
                </div>
                <i class="fa-solid fa-chevron-right text-xs text-text-tertiary"></i>
            </div>
        </div>
        `;
    }).join('');
}

/**
 * 舆情筛选
 * @param {string} type - 筛选类型
 */
function filterSentiments(type) {
    // 更新活动按钮状态
    const filterButtons = {
        'all': 'filter-all',
        'complaint': 'filter-complaint',
        'dispute': 'filter-dispute',
        'stock-out': 'filter-stock-out',
        'quality-issue': 'filter-quality-issue',
        'price-dispute': 'filter-price-dispute',
        'service-risk': 'filter-service-risk',
        'store-anomaly': 'filter-store-anomaly',
        'praise': 'filter-praise'
    };
    
    // 活动状态颜色映射
    const activeColors = {
        'all': { bg: 'bg-primary-1', text: 'text-primary', border: 'border-primary/30' },
        'complaint': { bg: 'bg-error-bg', text: 'text-error', border: 'border-error/30' },
        'dispute': { bg: 'bg-error-bg', text: 'text-error', border: 'border-error/30' },
        'stock-out': { bg: 'bg-warning-bg', text: 'text-warning-text', border: 'border-warning/30' },
        'quality-issue': { bg: 'bg-error-bg', text: 'text-error', border: 'border-error/30' },
        'price-dispute': { bg: 'bg-warning-bg', text: 'text-warning-text', border: 'border-warning/30' },
        'service-risk': { bg: 'bg-error-bg', text: 'text-error', border: 'border-error/30' },
        'store-anomaly': { bg: 'bg-warning-bg', text: 'text-warning-text', border: 'border-warning/30' },
        'praise': { bg: 'bg-success-bg', text: 'text-success', border: 'border-success/30' }
    };

    // 重置所有按钮为非活动状态
    Object.values(filterButtons).forEach(btnId => {
        const btn = document.getElementById(btnId);
        btn.className = 'px-3 py-1.5 text-xs font-medium rounded-full bg-transparent text-text-tertiary border border-border-base transition-all';
    });

    // 设置活动按钮
    const activeBtn = document.getElementById(filterButtons[type]);
    const colors = activeColors[type];
    activeBtn.className = `px-3 py-1.5 text-xs font-medium rounded-full ${colors.bg} ${colors.text} border ${colors.border} transition-all`;

    // 重新渲染舆情列表（带筛选）
    renderSentiments(type);
}

/**
 * 打开舆情详情页
 * @param {string} sentimentId - 舆情ID
 */
function openSentimentDetailView(sentimentId) {
    const s = sentimentData.find(x => x.id === sentimentId);
    if (!s) return;
    currentSentimentId = sentimentId;

    // 类型颜色映射
    let typeColorClass = '';
    switch(s.type) {
        case 'complaint':
            typeColorClass = 'bg-error-bg text-error border-error/30';
            break;
        case 'dispute':
            typeColorClass = 'bg-error-bg text-error border-error/30';
            break;
        case 'stock-out':
            typeColorClass = 'bg-warning-bg text-warning-text border-warning/30';
            break;
        case 'quality-issue':
            typeColorClass = 'bg-error-bg text-error border-error/30';
            break;
        case 'price-dispute':
            typeColorClass = 'bg-warning-bg text-warning-text border-warning/30';
            break;
        case 'service-risk':
            typeColorClass = 'bg-error-bg text-error border-error/30';
            break;
        case 'store-anomaly':
            typeColorClass = 'bg-warning-bg text-warning-text border-warning/30';
            break;
        case 'praise':
            typeColorClass = 'bg-success-bg text-success border-success/30';
            break;
    }

    // 填充数据
    document.getElementById('sentiment-type-tag').className = `text-xs font-bold px-3 py-1 rounded-full border ${typeColorClass}`;
    document.getElementById('sentiment-type-tag').innerText = s.typeText;
    document.getElementById('sentiment-priority').innerText = s.priority === 'high' ? s.priorityIcon : '';
    document.getElementById('sentiment-title').innerText = s.title;
    document.getElementById('sentiment-time').innerText = s.time;
    document.getElementById('sentiment-store').innerText = s.store;
    document.getElementById('sentiment-staff-avatar').src = s.staff.avatar;
    document.getElementById('sentiment-staff-name').innerText = s.staff.name;
    document.getElementById('sentiment-summary').innerText = s.summary;

    // 对话记录
    const transcriptContainer = document.getElementById('sentiment-transcript');
    transcriptContainer.innerHTML = s.transcript.map(msg => {
        const isStaff = msg.role === 'staff';
        const alignClass = isStaff ? 'justify-end' : 'justify-start';
        const bubbleClass = isStaff ? 'bg-primary-1 text-text-primary rounded-tr-none border border-primary/20' : 'bg-bg-container text-text-secondary rounded-tl-none border border-border-base';

        return `
            <div class="flex ${alignClass}">
                <div class="max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${bubbleClass}">
                    <div class="text-[9px] text-text-tertiary mb-1">${isStaff ? '店员' : '顾客'} ${msg.time}</div>
                    ${msg.text}
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('sentiment-detail-view').classList.remove('translate-x-full');
}

/**
 * 隐藏舆情详情页
 */
function hideSentimentDetailView() {
    document.getElementById('sentiment-detail-view').classList.add('translate-x-full');
}

/**
 * 打开舆情分享弹窗
 */
function openSentimentShareModal() {
    const s = sentimentData.find(x => x.id === currentSentimentId);
    if (!s) return;

    // 类型颜色映射
    let typeColorClass = '';
    switch(s.type) {
        case 'complaint':
            typeColorClass = 'bg-error-bg text-error border-error/30 border';
            break;
        case 'dispute':
            typeColorClass = 'bg-error-bg text-error border-error/30 border';
            break;
        case 'stock-out':
            typeColorClass = 'bg-warning-bg text-warning-text border-warning/30 border';
            break;
        case 'quality-issue':
            typeColorClass = 'bg-error-bg text-error border-error/30 border';
            break;
        case 'price-dispute':
            typeColorClass = 'bg-warning-bg text-warning-text border-warning/30 border';
            break;
        case 'service-risk':
            typeColorClass = 'bg-error-bg text-error border-error/30 border';
            break;
        case 'store-anomaly':
            typeColorClass = 'bg-warning-bg text-warning-text border-warning/30 border';
            break;
        case 'praise':
            typeColorClass = 'bg-success-bg text-success border-success/30 border';
            break;
    }

    document.getElementById('poster-sentiment-type').className = `inline-block px-3 py-1 rounded-full text-xs font-bold ${typeColorClass}`;
    document.getElementById('poster-sentiment-type').innerText = s.typeText;
    document.getElementById('poster-sentiment-priority').innerText = s.priority === 'high' ? s.priorityIcon : '';
    document.getElementById('poster-sentiment-time').innerText = s.time;
    document.getElementById('poster-sentiment-title').innerText = s.title;
    document.getElementById('poster-sentiment-avatar').src = s.staff.avatar;
    document.getElementById('poster-sentiment-staff').innerText = s.staff.name;
    document.getElementById('poster-sentiment-store').innerText = s.store;
    document.getElementById('poster-sentiment-summary').innerText = s.summary;

    // 选择关键对话（前3条消息）
    const keyTranscript = s.transcript.slice(0, 3);
    const transcriptContainer = document.getElementById('poster-sentiment-transcript');
    transcriptContainer.innerHTML = keyTranscript.map(t => `
        <div class="flex items-start space-x-2">
            <div class="font-bold text-text-tertiary flex-shrink-0">${t.role === 'staff' ? '店员' : '顾客'}:</div>
            <div>${t.text}</div>
        </div>
    `).join('');

    document.getElementById('share-sentiment-modal').classList.remove('hidden');
}

/**
 * 关闭舆情分享弹窗
 */
function closeSentimentShareModal() {
    document.getElementById('share-sentiment-modal').classList.add('hidden');
}
