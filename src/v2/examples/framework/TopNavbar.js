/**
 * TopNavbar 组件
 * 顶部导航栏 - 使用 VTopNavbar
 */

import { vTopNavbar, toast, setThemeMode, getThemeMode } from '../../../yoya/index.js';

// 主题图标映射
const icons = { auto: '🔄', light: '☀️', dark: '🌙' };

// 主题切换按钮引用
let themeButtonRef = null;

// 初始化主题事件监听器（只执行一次）
function initThemeChangeListener() {
  if (typeof window === 'undefined') return;

  window.addEventListener('theme-changed', (e) => {
    const mode = e.detail?.mode || getThemeMode();
    if (themeButtonRef) {
      // 更新按钮内容
      themeButtonRef.textContent(icons[mode]);
    }
  });
}

// 立即初始化监听器
initThemeChangeListener();

export function TopNavbar() {
  return vTopNavbar(navbar => {
    navbar.height('56px');

    // 左侧：品牌 Logo
    navbar.logo('🏝️ Yoya.Basic V2', () => {
      window.location.href = 'index.html';
    });

    // 中间：主导航
    navbar.item('首页', () => {
      window.location.href = 'index.html';
    });

    navbar.item('文档 1', () => {
      window.location.href = 'button.html';
    });

    // 右侧：主题切换
    navbar.right(right => {
      const mode = getThemeMode();

      const btn = right.button(icons[mode], () => {
        const current = getThemeMode();
        const next = current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto';
        setThemeMode(next);
        toast.info(`主题模式：${next === 'auto' ? '跟随系统' : next === 'light' ? '浅色' : '深色'}`);
      });

      btn.ghost();
      btn.size('small');

      // 保存按钮引用用于更新图标（使用按钮实例而非 _boundElement）
      themeButtonRef = btn;
    });
  });
}
