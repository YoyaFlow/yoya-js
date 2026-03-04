/**
 * Button Demo Entry Point
 */
import { createButtonPage } from './button.js';
import { themeManager } from '../../yoya/index.js';

// 初始化主题
themeManager.init('islands:light');

// 创建并渲染页面
const buttonPage = createButtonPage();
buttonPage.bindTo('#app');
