/**
 * Interaction 页面入口
 */

import { getPageComponent } from '../../config/routes.js';
import { preloadAllPages } from '../../config/routes.js';

// 预加载所有页面
await preloadAllPages();

// 获取当前页面组件并渲染
const fileName = 'interaction.html';
const pageLoader = await getPageComponent(fileName);
const createPage = await pageLoader();
const page = createPage();
page.bindTo('#app');
