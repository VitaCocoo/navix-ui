/**
 * 个人中心/更多模块（重构版 - 模块化渲染）
 * 负责渲染用户资料、统计信息和功能入口
 */

/**
 * 渲染更多视图的完整HTML结构
 */
function renderMoreView() {
    const container = document.getElementById('app-container');
    if (!container) return;
    
    container.innerHTML = `
        <main id="more-view" class="pt-4 px-4 space-y-5 pb-28">
            <h2 class="text-xl font-bold text-text-primary mb-4">更多</h2>
            
            <!-- 用户资料卡片 -->
            <div class="glass-panel rounded-xl p-5 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-20 h-20 bg-primary-1 rounded-full -mr-10 -mt-10"></div>
                <div class="relative z-10 flex items-center space-x-4">
                    <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary-purple p-0.5">
                        <div class="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <i class="fa-solid fa-user text-2xl text-primary"></i>
                        </div>
                    </div>
                    <div class="flex-1">
                        <h2 class="text-lg font-bold text-text-primary mb-1">张总</h2>
                        <div class="flex items-center space-x-2">
                            <span class="text-[10px] bg-primary-1 text-primary px-2 py-0.5 rounded-full border border-primary/30">运营管理者</span>
                            <span class="text-xs text-text-tertiary">大参林连锁药店</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 统计概览 -->
            <section class="glass-panel rounded-xl p-4 grid grid-cols-2 gap-4 text-center">
                <div>
                    <div class="text-2xl font-bold text-primary mb-1">12</div>
                    <div class="text-xs text-text-secondary">门店数量</div>
                </div>
                <div>
                    <div class="text-2xl font-bold text-secondary-teal mb-1">35</div>
                    <div class="text-xs text-text-secondary">工牌设备</div>
                </div>
            </section>
            
            <!-- 菜单列表 -->
            <section class="glass-panel rounded-xl py-2">
                <a href="#" class="flex items-center justify-between p-3 hover:bg-bg-hover transition-colors rounded-lg">
                    <div class="flex items-center space-x-3">
                        <i class="fa-solid fa-cog text-primary"></i>
                        <span class="text-sm text-text-primary">设置</span>
                    </div>
                    <i class="fa-solid fa-chevron-right text-text-tertiary text-xs"></i>
                </a>
                <a href="#" class="flex items-center justify-between p-3 hover:bg-bg-hover transition-colors rounded-lg">
                    <div class="flex items-center space-x-3">
                        <i class="fa-solid fa-circle-question text-secondary-orange"></i>
                        <span class="text-sm text-text-primary">帮助与反馈</span>
                    </div>
                    <i class="fa-solid fa-chevron-right text-text-tertiary text-xs"></i>
                </a>
                <a href="#" class="flex items-center justify-between p-3 hover:bg-bg-hover transition-colors rounded-lg">
                    <div class="flex items-center space-x-3">
                        <i class="fa-solid fa-circle-info text-info"></i>
                        <span class="text-sm text-text-primary">关于我们</span>
                    </div>
                    <i class="fa-solid fa-chevron-right text-text-tertiary text-xs"></i>
                </a>
            </section>
            
            <!-- 退出登录 -->
            <button onclick="handleLogout()" class="w-full bg-error-bg text-error py-3 rounded-xl text-sm font-medium hover:bg-error-border transition-colors active:scale-95">
                退出登录
            </button>
            
            <!-- 版本信息 -->
            <div class="text-center text-[10px] text-text-disabled pt-4 pb-2">
                药店智能决策系统 v1.2.0
            </div>
        </main>
    `;
}

/**
 * 处理退出登录
 */
function handleLogout() {
    if (confirm('确定要退出登录吗？')) {
        alert('已退出登录（演示模式）');
        // TODO: 实际项目中应调用logout API并跳转到登录页
    }
}
