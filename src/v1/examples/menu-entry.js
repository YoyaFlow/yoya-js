/**
 * Menu Demo Entry Point
 */
import { createMenuPage } from './menu.js';
import { getTheme, applyTheme } from '../../yoya/index.js';

// 初始化主题
const theme = getTheme('islands:light');
if (theme) {
  applyTheme(theme, false);
}

// 创建并渲染页面
const menuPage = createMenuPage();
menuPage.bindTo('#app');
