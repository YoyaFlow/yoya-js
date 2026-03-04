/**
 * Button Demo Entry Point
 */
import { createButtonPage } from './button.js';
import { getTheme, applyTheme } from '../../yoya/index.js';

// 初始化主题
const theme = getTheme('islands:light');
if (theme) {
  applyTheme(theme, false);
}

// 创建并渲染页面
const buttonPage = createButtonPage();
buttonPage.bindTo('#app');
