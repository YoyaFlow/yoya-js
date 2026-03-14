/**
 * TopNavbar 组件
 * 顶部导航栏 - 使用 VTopNavbar
 */

import { vTopNavbar, toast, setThemeMode, getThemeMode, vButton } from '../../../yoya/index.js';

export function TopNavbar() {
  let themeButton = null;

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
      const icons = { auto: '🔄', light: '☀️', dark: '🌙' };
      const mode = getThemeMode();

      themeButton = right.button(icons[mode], () => {
        const current = getThemeMode();
        const next = current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto';
        setThemeMode(next);
        themeButton.text(icons[next]);
        toast.info(`主题模式：${next === 'auto' ? '跟随系统' : next === 'light' ? '浅色' : '深色'}`);
      });

      themeButton.ghost();
      themeButton.size('small');
    });
  });
}
