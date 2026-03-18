/**
 * 路由配置
 * 定义页面路径与组件的映射关系
 */

// 页面组件懒加载映射
export const routes = {
  'Home': () => import('../pages/Home/index.js').then(m => m.createHomePage),
  'Button': () => import('../pages/Button/index.js').then(m => m.createButtonPage),
  'Buttons': () => import('../pages/Buttons/index.js').then(m => m.createButtonsPage),
  'Form': () => import('../pages/Form/index.js').then(m => m.createFormPage),
  'Menu': () => import('../pages/Menu/index.js').then(m => m.createMenuPage),
  'Card': () => import('../pages/Card/index.js').then(m => m.createCardPage),
  'Message': () => import('../pages/Message/index.js').then(m => m.createMessagePage),
  'Code': () => import('../pages/Code/index.js').then(m => m.createCodePage),
  'Detail': () => import('../pages/Detail/index.js').then(m => m.createDetailPage),
  'Field': () => import('../pages/Field/index.js').then(m => m.createFieldPage),
  'Body': () => import('../pages/Body/index.js').then(m => m.createBodyPage),
  'Table': () => import('../pages/Table/index.js').then(m => m.createTablePage),
  'DynamicLoader': () => import('../pages/DynamicLoader/index.js').then(m => m.createDynamicLoaderPage),
  'I18n': () => import('../pages/I18n/index.js').then(m => m.createI18nPage),
  'VTimer': () => import('../pages/VTimer/index.js').then(m => m.createVTimerPage),
  'Echart': () => import('../pages/Echart/index.js').then(m => m.createEchartPage),
  'Router': () => import('../pages/Router/index.js').then(m => m.createRouterPage),
  'Theme': () => import('../pages/Theme/index.js').then(m => m.createThemePage),
  'Tabs': () => import('../pages/Tabs/index.js').then(m => m.createTabsPage),
  'VPager': () => import('../pages/Pager/index.js').then(m => m.createVPagerPage),
  'Icons': () => import('../pages/Icons/index.js').then(m => m.createIconsPage),
  'Modal': () => import('../pages/Modal/index.js').then(m => m.createModalPage),
};

/**
 * 根据文件名获取页面组件
 */
export async function getPageComponent(fileName) {
  const pageMap = {
    'index.html': 'Home',
    'button.html': 'Button',
    'buttons.html': 'Buttons',
    'form.html': 'Form',
    'menu.html': 'Menu',
    'card.html': 'Card',
    'message.html': 'Message',
    'modal.html': 'Modal',
    'code.html': 'Code',
    'detail.html': 'Detail',
    'field.html': 'Field',
    'body.html': 'Body',
    'table.html': 'Table',
    'dynamic-loader.html': 'DynamicLoader',
    'i18n.html': 'I18n',
    'vtimer.html': 'VTimer',
    'echart.html': 'Echart',
    'router.html': 'Router',
    'theme.html': 'Theme',
    'tabs.html': 'Tabs',
    'pager.html': 'VPager',
    'icons.html': 'Icons',
  };

  const pageName = pageMap[fileName];
  if (!pageName) {
    console.warn(`Unknown page: ${fileName}`);
    return routes['Home'];
  }

  return routes[pageName];
}

/**
 * 预加载所有页面
 */
export async function preloadAllPages() {
  return Promise.allSettled(
    Object.values(routes).map(loader => loader())
  );
}
