/**
 * 主入口文件
 * 负责应用初始化和事件监听
 * v1.4 - 单页面对话式交互模式
 */

// DOMContentLoaded事件监听
document.addEventListener('DOMContentLoaded', () => {
    console.log('[App] 应用启动 - 单页面对话模式');
    
    // 初始化主页面(对话界面)
    if (typeof renderHomeView === 'function') {
        renderHomeView();
    } else {
        console.error('[App] renderHomeView 函数未定义');
    }
    
    // 初始化导航模块
    if (typeof initNavigationModule === 'function') {
        initNavigationModule();
    }
    
    console.log('[App] 应用启动完成');
});

// 全局错误处理
window.addEventListener('error', (event) => {
    console.error('[App] 全局错误:', event.error);
});

// 提供全局回退到首页的函数
function backToHome() {
    if (typeof renderHomeView === 'function') {
        renderHomeView();
    }
}

console.log('[App] 主入口文件已加载');
