/**
 * TopNavbar 组件
 * 顶部导航栏 - 使用 VTopNavbar
 */

import { vTopNavbar, toast, themeSwitch } from '../../../yoya/index.js';

export function TopNavbar() {
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
        ts.onChange((mode) => {
          toast.success(`已切换到${mode === 'light' ? '浅色' : mode === 'dark' ? '深色' : '自动'}模式`);
        });
      });
    });
  });
}
