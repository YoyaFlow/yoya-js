/**
 * VRouterViews 组件测试
 */

import { JSDOM } from 'jsdom';

// 设置 JSDOM 环境
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.MouseEvent = dom.window.MouseEvent;
global.Event = dom.window.Event;
global.FocusEvent = dom.window.FocusEvent;
global.KeyboardEvent = dom.window.KeyboardEvent;
global.ClipboardEvent = dom.window.ClipboardEvent;

// 导入库
import { VRouter, VRouterViews, vRouterViews } from '../../src/yoya/index.js';

// ============================================
// 测试工具函数
// ============================================

let testId = 0;
function createContainer() {
  const id = `test-${testId++}`;
  const container = dom.window.document.createElement('div');
  container.id = id;
  dom.window.document.body.appendChild(container);
  return `#${id}`;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ ${message}`);
  }
}

function cleanup() {
  dom.window.document.body.innerHTML = '';
  testId = 0;
}

// ============================================
// 开始测试
// ============================================

console.log('\n🧪 开始运行 VRouterViews 组件测试...\n');

let passed = 0;
let failed = 0;

try {
  // 测试 1: 创建 VRouterViews 实例
  {
    cleanup();
    const router = new VRouter(r => {
      r.default('/');
      r.route('/', { component: () => document.createElement('div') });
    });
    const routerViews = new VRouterViews(router);
    assert(routerViews, '应该创建 VRouterViews 实例');
    assert(routerViews._router === router, 'router 引用应该正确');
    assert(routerViews._views instanceof Map, '_views 应该是 Map 实例');
    passed++;
  }
  console.log('✅ VRouterViews 应该能创建实例');

  // 测试 2: 添加视图
  {
    cleanup();
    const router = new VRouter(r => {
      r.default('/');
      r.route('/', { component: () => document.createElement('div') });
    });
    const routerViews = new VRouterViews(router);
    routerViews.addView('home', {
      title: '首页',
      icon: '🏠',
      closable: false,
      defaultRoute: '/'
    });
    assert(routerViews._views.has('home'), '应该添加 home 视图');
    const view = routerViews._views.get('home');
    assert(view.title === '首页', '视图标题应该正确');
    assert(view.icon === '🏠', '视图图标应该正确');
    assert(view.closable === false, 'closable 应该正确');
    passed++;
  }
  console.log('✅ VRouterViews 应该能添加视图');

  // 测试 3: 设置激活视图
  {
    cleanup();
    const router = new VRouter(r => {
      r.default('/');
      r.route('/', { component: () => document.createElement('div') });
    });
    const routerViews = new VRouterViews(router);
    routerViews.addView('home', { title: '首页', defaultRoute: '/' });
    routerViews.addView('settings', { title: '设置', defaultRoute: '/settings' });

    routerViews.setActiveView('home');
    assert(routerViews._activeView?.name === 'home', '应该激活 home 视图');

    routerViews.setActiveView('settings');
    assert(routerViews._activeView?.name === 'settings', '应该激活 settings 视图');
    passed++;
  }
  console.log('✅ VRouterViews 应该能设置激活视图');

  // 测试 4: 获取激活视图名称
  {
    cleanup();
    const router = new VRouter(r => {
      r.default('/');
      r.route('/', { component: () => document.createElement('div') });
    });
    const routerViews = new VRouterViews(router);
    routerViews.addView('home', { title: '首页' });
    routerViews.setActiveView('home');

    assert(routerViews.getActiveViewName() === 'home', '应该获取正确的激活视图名称');
    passed++;
  }
  console.log('✅ VRouterViews 应该能获取激活视图名称');

  // 测试 5: 获取所有视图
  {
    cleanup();
    const router = new VRouter(r => {
      r.default('/');
      r.route('/', { component: () => document.createElement('div') });
    });
    const routerViews = new VRouterViews(router);
    routerViews.addView('home', { title: '首页' });
    routerViews.addView('settings', { title: '设置' });
    routerViews.addView('analytics', { title: '数据分析' });

    const views = routerViews.getViews();
    assert(views.length === 3, '应该返回所有视图');
    assert(views.map(v => v.name).join(',') === 'home,settings,analytics', '视图名称列表应该正确');
    passed++;
  }
  console.log('✅ VRouterViews 应该能获取所有视图');

  // 测试 6: 移除视图
  {
    cleanup();
    const router = new VRouter(r => {
      r.default('/');
      r.route('/', { component: () => document.createElement('div') });
    });
    const routerViews = new VRouterViews(router);
    routerViews.addView('home', { title: '首页' });
    routerViews.addView('settings', { title: '设置' });

    assert(routerViews._views.size === 2, '初始应该有 2 个视图');

    routerViews.removeView('settings');
    assert(routerViews._views.size === 1, '移除后应该有 1 个视图');
    assert(!routerViews._views.has('settings'), 'settings 视图应该被移除');
    passed++;
  }
  console.log('✅ VRouterViews 应该能移除视图');

  // 测试 7: 更新视图标题
  {
    cleanup();
    const router = new VRouter(r => {
      r.default('/');
      r.route('/', { component: () => document.createElement('div') });
    });
    const routerViews = new VRouterViews(router);
    routerViews.addView('home', { title: '首页' });

    routerViews.updateViewTitle('home', '更新后的首页');
    const view = routerViews._views.get('home');
    assert(view.title === '更新后的首页', '视图标题应该更新');
    passed++;
  }
  console.log('✅ VRouterViews 应该能更新视图标题');

  // 测试 8: onChange 回调
  {
    cleanup();
    const router = new VRouter(r => {
      r.default('/');
      r.route('/', { component: () => document.createElement('div') });
    });
    const routerViews = new VRouterViews(router);
    routerViews.addView('home', { title: '首页' });
    routerViews.addView('settings', { title: '设置' });

    let changedViewName = null;
    routerViews.onChange((viewName) => {
      changedViewName = viewName;
    });

    routerViews.setActiveView('settings');
    assert(changedViewName === 'settings', '应该触发 onChange 回调');
    passed++;
  }
  console.log('✅ VRouterViews onChange 回调应该正常工作');

  // 测试 9: 渲染 DOM
  {
    cleanup();
    const router = new VRouter(r => {
      r.default('/');
      r.route('/', { component: () => document.createElement('div') });
    });
    const routerViews = new VRouterViews(router);
    routerViews.addView('home', { title: '首页', closable: false });
    routerViews.addView('settings', { title: '设置', closable: true });

    const viewEl = routerViews.renderDom();
    assert(viewEl, '应该渲染 DOM');
    assert(viewEl.classList.contains('yoya-router-views'), '应该包含正确的类名');

    const header = viewEl.querySelector('.yoya-router-views__header');
    assert(header, '应该包含视图栏');

    const contentContainer = viewEl.querySelector('.yoya-router-views__content-container');
    assert(contentContainer, '应该包含内容容器');
    passed++;
  }
  console.log('✅ VRouterViews 应该能正确渲染 DOM');

  // 测试 10: closable 按钮
  {
    cleanup();
    const router = new VRouter(r => {
      r.default('/');
      r.route('/', { component: () => document.createElement('div') });
    });
    const routerViews = new VRouterViews(router);
    routerViews.addView('home', { title: '首页', closable: true });
    routerViews.renderDom();
    const viewEl = routerViews._boundElement;

    const closeBtn = viewEl.querySelector('.yoya-router-views__tab-close');
    assert(closeBtn, 'closable=true 时应该有关闭按钮');
    passed++;
  }
  console.log('✅ VRouterViews closable=true 时应该显示关闭按钮');

  // 测试 11: 工厂函数
  {
    cleanup();
    const router = new VRouter(r => {
      r.default('/');
      r.route('/', { component: () => document.createElement('div') });
    });
    const container = createContainer();

    const routerViews = vRouterViews(router, rv => {
      rv.addView('home', { title: '首页' });
    });
    routerViews.bindTo(container);

    const el = document.querySelector(container);
    assert(el.children.length > 0, '应该绑定到 DOM');
    passed++;
  }
  console.log('✅ vRouterViews 工厂函数应该正常工作');

  // 测试 12: 链式调用
  {
    cleanup();
    const router = new VRouter(r => {
      r.default('/');
      r.route('/', { component: () => document.createElement('div') });
    });
    const routerViews = new VRouterViews(router);

    const result = routerViews
      .addView('home', { title: '首页' })
      .addView('settings', { title: '设置' })
      .setActiveView('home');

    assert(result === routerViews, '应该支持链式调用');
    passed++;
  }
  console.log('✅ VRouterViews 应该支持链式调用');

} catch (error) {
  console.error(error.message);
  failed++;
}

console.log('\n' + '─'.repeat(50));
console.log(`测试完成：${passed + failed} 个测试，${passed} 通过，${failed} 失败`);
console.log('─'.repeat(50) + '\n');

if (failed > 0) {
  process.exit(1);
}
