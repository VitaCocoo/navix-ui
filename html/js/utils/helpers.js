/**
 * 通用工具函数
 * 包含字符计数、输入处理、弹窗控制等辅助函数
 */

// 字符计数更新
function updateCharCount(fieldId, maxLength) {
    const field = document.getElementById(fieldId);
    const countSpan = document.getElementById(fieldId + '-count');
    if (countSpan) {
        const currentLength = field.value.length;
        const colorClass = currentLength >= maxLength ? 'text-error' : 'text-primary';
        countSpan.innerHTML = `<span class="${colorClass}">${currentLength}</span>/${maxLength}`;
    }
}

// 更新输入字符计数
function updateInputCharCount() {
    const input = document.getElementById('ai-input-desc');
    const countSpan = document.getElementById('ai-input-count');
    const clearBtn = document.getElementById('btn-clear-input');
    const currentLength = input.value.length;
    const maxLength = 200;
    
    // 更新计数显示
    const colorClass = currentLength >= maxLength ? 'text-error' : 'text-primary';
    countSpan.innerHTML = `<span class="${colorClass}">${currentLength}</span>/${maxLength}`;
    
    // 显示/隐藏清空按钮
    if (currentLength > 0) {
        clearBtn.classList.remove('hidden');
    } else {
        clearBtn.classList.add('hidden');
    }
}

// 清空输入
function clearInput() {
    const input = document.getElementById('ai-input-desc');
    const voiceWarning = document.getElementById('voice-warning');
    
    input.value = '';
    updateInputCharCount();
    voiceWarning.classList.add('hidden');
}

// 语音输入功能
let recognition = null;
let isVoiceInputActive = false;

function startVoiceInput() {
    const input = document.getElementById('ai-input-desc');
    const btn = document.getElementById('btn-voice-input');
    const voiceWarning = document.getElementById('voice-warning');
    
    // 检查浏览器支持
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('您的浏览器不支持语音识别功能，请使用Chrome、Edge等现代浏览器。');
        return;
    }
    
    // 停止录音（如果正在录音）
    if (isVoiceInputActive && recognition) {
        recognition.stop();
        return;
    }
    
    // 初始化语音识别
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = true;
    recognition.interimResults = true;
    
    let finalTranscript = input.value; // 从现有文本开始
    
    recognition.onstart = function() {
        isVoiceInputActive = true;
        btn.classList.add('bg-error', 'text-white', 'animate-pulse');
        btn.classList.remove('bg-primary-1', 'text-primary');
        voiceWarning.classList.add('hidden');
    };
    
    recognition.onresult = function(event) {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        
        const combinedText = finalTranscript + interimTranscript;
        
        // 检查字符限制
        if (combinedText.length > 200) {
            // 截断到200个字符
            finalTranscript = combinedText.substring(0, 200);
            input.value = finalTranscript;
            updateInputCharCount();
            
            // 显示警告
            voiceWarning.classList.remove('hidden');
            
            // 停止识别
            recognition.stop();
        } else {
            input.value = combinedText;
            updateInputCharCount();
        }
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        let errorMsg = '语音识别出错，请重试。';
        
        switch(event.error) {
            case 'no-speech':
                errorMsg = '未检测到语音，请重试。';
                break;
            case 'audio-capture':
                errorMsg = '无法访问麦克风，请检查权限设置。';
                break;
            case 'not-allowed':
                errorMsg = '麦克风权限被拒绝，请在浏览器设置中允许访问。';
                break;
        }
        
        alert(errorMsg);
        resetVoiceButton();
    };
    
    recognition.onend = function() {
        resetVoiceButton();
    };
    
    // 开始识别
    try {
        recognition.start();
    } catch (e) {
        console.error('Failed to start speech recognition:', e);
        alert('语音识别启动失败，请重试。');
        resetVoiceButton();
    }
}

function resetVoiceButton() {
    const btn = document.getElementById('btn-voice-input');
    isVoiceInputActive = false;
    btn.classList.remove('bg-error', 'text-white', 'animate-pulse');
    btn.classList.add('bg-primary-1', 'text-primary');
}

// 填充快速案例
function fillInput(text) {
    document.getElementById('ai-input-desc').value = text;
    updateInputCharCount();
}

// 退出登录
function handleLogout() {
    if(confirm('确定要退出登录吗？')) {
        alert('已退出登录');
        // 实际项目中，这里应该清除认证令牌并跳转到登录页
    }
}

// 下载海报
function downloadPoster() {
    alert('正在生成海报图片并保存到本地...');
    // 实际项目中，可使用html2canvas等库实现海报生成
}

// 分享到微信
function shareToWeChat() {
    alert('即将打开微信联系人列表...');
    // 实际项目中，调用微信分享API
}

/**
 * 隐藏底部工具栏
 * 用于独立页面（如数据中心、会话详情等）
 */
function hideToolbar() {
    const toolbar = document.querySelector('nav.fixed.bottom-0');
    if (toolbar) {
        toolbar.style.display = 'none';
    }
}

/**
 * 显示底部工具栏
 * 返回首页时调用
 */
function showToolbar() {
    const toolbar = document.querySelector('nav.fixed.bottom-0');
    if (toolbar) {
        toolbar.style.display = 'block';
    }
}