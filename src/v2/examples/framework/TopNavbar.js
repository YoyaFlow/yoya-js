/**
 * TopNavbar 组件
 * 顶部导航栏 - 使用 VTopNavbar
 */

import { vTopNavbar, themeSwitch, loadCssFile, getComponentCssPath } from '../../../yoya/index.js';

// 标记 CSS 是否已加载
let themeSwitchCssLoaded = false;

// 加载 ThemeSwitch CSS 文件
function loadThemeSwitchCss() {
  if (themeSwitchCssLoaded || typeof window === 'undefined') return;
  themeSwitchCssLoaded = true;
  loadCssFile(getComponentCssPath('theme-switch'), { replaceExisting: false });
}

export function TopNavbar() {
  // 加载 ThemeSwitch CSS
  loadThemeSwitchCss();

  return vTopNavbar(navbar => {
    navbar.height('56px');

    // 左侧：品牌 Logo
    navbar.logo('🏝️ YoyaFlow', () => {
      window.location.href = 'index.html';
    });

    // 中间：主导航
    navbar.item('首页', () => {
      window.location.href = 'index.html';
    });

    navbar.item('文档', () => {
      window.location.href = 'button.html';
    });

    // 右侧：主题切换
    navbar.right(right => {
      right.themeSwitch(ts => {
        ts.size('small');
      });
    });
  });
}
