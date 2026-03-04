/**
 * Home Page Entry Point
 */
import { createHomePage } from './index.js';
import { initTheme, switchTheme, getThemeMode, setThemeMode, getEffectiveThemeMode } from '../../yoya/index.js';
import { createLightTheme, createDarkTheme } from '../../yoya/theme/islands/index.js';

// 初始化主题（默认 islands:auto）
initTheme({
  defaultTheme: 'islands',
  defaultMode: 'auto',
  themes: new Map([
    ['islands', {
      factory: createLightTheme,
      lightFactory: createLightTheme,
      darkFactory: createDarkTheme,
    }],
  ]),
});

// 暴露全局函数供页面使用
window.switchTheme = switchTheme;
window.getThemeMode = getThemeMode;
window.setThemeMode = setThemeMode;
window.getEffectiveThemeMode = getEffectiveThemeMode;

// 创建并渲染页面
const homePage = createHomePage();
homePage.bindTo('#app');
