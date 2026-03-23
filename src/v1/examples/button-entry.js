/**
 * Button Demo Entry Point
 */
import { createButtonPage } from './button.js';
import { initTheme, switchTheme, getThemeMode, setThemeMode, getEffectiveThemeMode } from '../../yoya/index.js';

// 初始化主题（CSS 主题系统）
initTheme({
  defaultTheme: 'islands',
  defaultMode: 'auto',
});

// 暴露全局函数供页面使用
window.switchTheme = switchTheme;
window.getThemeMode = getThemeMode;
window.setThemeMode = setThemeMode;
window.getEffectiveThemeMode = getEffectiveThemeMode;

// 创建并渲染页面
const buttonPage = createButtonPage();
buttonPage.bindTo('#app');
