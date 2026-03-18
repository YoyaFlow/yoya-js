/**
 * TopNavbar 组件
 * 顶部导航栏 - 使用 VTopNavbar
 */

import { vTopNavbar, toast, setThemeMode, getThemeMode, vButton } from '../../../yoya/index.js';

export function TopNavbar() {
  let themeButton = null;
  const icons = { auto: '🔄', light: '☀️', dark: '🌙' };

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

    navbar.item('文档1', () => {
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

      // 监听主题变化事件，更新按钮图标
      if (typeof window !== 'undefined') {
        window.addEventListener('theme-changed', (e) => {
          const mode = e.detail?.mode || getThemeMode();
          const rightArea = document.querySelector('.yoya-navbar__right');
          const button = rightArea?.querySelector('button');
          if (button) {
            button.innerHTML = `<span style="display: inline-block;">${icons[mode]}</span>`;
          }
        });
      }
    });
  });
}
