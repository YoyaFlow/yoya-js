/**
 * Home Page Entry Point
 */
import { createHomePage } from './index.js';
import { themeManager } from '../../yoya/index.js';

// 初始化主题
themeManager.init('islands:light');

// 创建并渲染页面
const homePage = createHomePage();
homePage.bindTo('#app');
