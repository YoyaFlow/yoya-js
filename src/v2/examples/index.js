/**
 * Yoya.Basic V2 - Main Entry Point
 * 应用入口文件
 */

import { initTheme } from '../../yoya/index.js';
import { getPageComponent, preloadAllPages } from './config/routes.js';

// 初始化主题（使用 CSS 主题系统）
initTheme({
  defaultTheme: 'islands',
  defaultMode: 'auto',
});

// 预加载所有页面（可选，提升后续访问速度）
// preloadAllPages();

/**
 * 根据当前页面加载对应的页面组件
 */
async function bootstrap() {
  // 获取当前页面文件名
  const fileName = window.location.pathname.split('/').pop() || 'index.html';

  try {
    // 获取页面 loader 函数（需要 await 因为 getPageComponent 是 async）
    const pageLoader = await getPageComponent(fileName);

    if (!pageLoader) {
      console.error(`Page not found: ${fileName}`);
      return;
    }

    // 调用 loader 获取真正的创建函数
    const createPage = await pageLoader();

    if (!createPage) {
      console.error(`Page creator not found: ${fileName}`);
      return;
    }

    // 创建并渲染页面
    const page = createPage();
    page.bindTo('#app');

  } catch (error) {
    console.error('Failed to load page:', error);
    document.getElementById('app').innerHTML = `
      <div style="padding: 40px; text-align: center;">
        <h1>页面加载失败</h1>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// 启动应用
bootstrap();
