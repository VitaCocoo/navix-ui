/**
 * 案例管理模块
 * 负责优秀案例的详情展示和分享功能
 */

let currentCaseId = null;

/**
 * 打开案例详情页
 * @param {string} caseId - 案例ID
 */
function openCaseDetailView(caseId) {
     const c = casesData.find(x => x.id === caseId);
     if (!c) return;
     currentCaseId = caseId;

     // 填充数据
     document.getElementById('case-detail-name').innerText = c.name;
     document.getElementById('case-detail-store').innerText = c.store;
     document.getElementById('case-detail-avatar').src = `https://i.pravatar.cc/150?u=${c.id}`;
     document.getElementById('case-detail-tag').innerText = '#' + c.tag;
     document.getElementById('case-detail-reason').innerText = c.reason;

     // 对话记录
     const list = document.getElementById('case-transcript-list');
     list.innerHTML = c.transcript.map(msg => {
         const isStaff = msg.role === 'staff';
         const alignClass = isStaff ? 'justify-end' : 'justify-start';
         const bubbleClass = isStaff ? 'bg-primary-1 text-text-primary rounded-tr-none border border-primary/20' : 'bg-bg-container text-text-secondary rounded-tl-none border border-border-base';

         return `
            <div class="flex flex-col ${isStaff ? 'items-end' : 'items-start'} mb-4">
                <div class="flex ${alignClass} mb-1">
                    ${!isStaff ? '<div class="w-6 h-6 rounded-full bg-bg-hover flex-shrink-0 mr-2 flex items-center justify-center text-[10px] text-text-tertiary"><i class="fa-solid fa-user"></i></div>' : ''}
                    <div class="max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${bubbleClass}">
                        ${msg.text}
                    </div>
                    ${isStaff ? `<div class="w-6 h-6 rounded-full bg-bg-container flex-shrink-0 ml-2 overflow-hidden border border-border-base"><img src="https://i.pravatar.cc/150?u=${c.id}" class="w-full h-full"></div>` : ''}
                </div>
                <div class="text-[9px] text-text-disabled px-10 font-mono">${msg.time}</div>
            </div>
         `;
     }).join('');

     document.getElementById('case-detail-view').classList.remove('translate-x-full');
}

/**
 * 隐藏案例详情页
 */
function hideCaseDetailView() {
    document.getElementById('case-detail-view').classList.add('translate-x-full');
}

/**
 * 打开案例分享弹窗
 */
function openCaseShareModal() {
    const c = casesData.find(x => x.id === currentCaseId);
    if (!c) return;

    document.getElementById('poster-case-name').innerText = c.name;
    document.getElementById('poster-case-store').innerText = c.store;
    document.getElementById('poster-case-avatar').src = `https://i.pravatar.cc/150?u=${c.id}`;
    document.getElementById('poster-case-duration').innerText = c.duration;
    document.getElementById('poster-case-reason').innerText = c.reason;
    document.getElementById('poster-case-time').innerText = c.startTime;

    // 显示完整对话记录
    const transcriptContainer = document.getElementById('poster-case-transcript');
    transcriptContainer.innerHTML = c.transcript.map(t => `
        <div class="flex items-start space-x-2 mb-2">
            <div class="font-bold ${t.role === 'staff' ? 'text-primary' : 'text-text-tertiary'} flex-shrink-0">${t.role === 'staff' ? '店员' : '顾客'}:</div>
            <div class="flex-1">${t.text}</div>
        </div>
    `).join('');

    document.getElementById('share-case-modal').classList.remove('hidden');
}

/**
 * 关闭案例分享弹窗
 */
function closeCaseShareModal() {
    document.getElementById('share-case-modal').classList.add('hidden');
}
