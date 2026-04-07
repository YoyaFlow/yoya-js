/**
 * V2 VRouterViews 演示入口
 * 使用 VRouterViews 实现多视图容器路由
 *
 * 布局结构：
 * - AppShell 提供：TopNavbar（顶部）+ Sidebar（左侧）+ Content（内容区）+ TOC（右侧）
 * - Content 区域内使用 VRouterViews 管理多个可切换的视图
 */

import { vRouter, vRouterViews, div, flex, container } from '../../yoya/index.js';
import { demoRoutes } from './config/routes.v2.js';
import { AppShell } from './framework/AppShell.js';

// 初始化主题系统
import '../../yoya/core/theme.js';

// 页面组件加载器缓存
const pageLoaders = {};

/**
 * 从 AppShell 包装的页面中提取纯内容
 * @param {Function} pageCreator - 页面创建函数（返回 AppShell）
 * @returns {div} 内容容器
 */
function extractContentFromAppShell(pageCreator) {
  const contentContainer = div(c => {
    c.styles({
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      padding: '32px 24px',
      maxWidth: '960px',
    });
  });

  // 创建页面（返回 AppShell/vBody）
  const page = pageCreator();

  if (page && page._children) {
    // vBody 的第一个子元素是 TopNavbar，第二个是 flex 容器
    const flexContainer = page._children[1];
    if (flexContainer && flexContainer._children) {
      // flex 容器：[0]Sidebar, [1]Content, [2]TOC
      const contentWrapper = flexContainer._children[1];
      if (contentWrapper) {
        // 复制内容容器的子元素
        if (contentWrapper._children) {
          contentWrapper._children.forEach(child => {
            contentContainer.child(child);
          });
        }
      }
    }
  }

  return contentContainer;
}

/**
 * 创建 VRouterViews 内容
 */
function createVRouterViewsContent() {
  // 创建主容器
  const container = div(c => {
    c.styles({ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' });
  });

  // 先创建 vRouter 实例（不绑定到 DOM）
  const router = vRouter(r => {
    r.default('/home');

    // 根据 demoRoutes 注册路由
    demoRoutes.forEach(category => {
      category.items.forEach(item => {
        const routePath = item.route;
        r.route(routePath, {
          component: () => {
            // 返回一个容器，异步加载页面组件
            const compContainer = div(d => {
              d.styles({ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' });
              d.text(`加载中...`);
            });

            // 缓存 loader，避免重复加载
            if (!pageLoaders[item.name]) {
              pageLoaders[item.name] = item.loader();
            }

            // 异步加载组件
            pageLoaders[item.name].then(createFn => {
              if (typeof createFn === 'function') {
                // 使用 extractContentFromAppShell 提取纯内容
                const content = extractContentFromAppShell(createFn);
                if (content && compContainer._el) {
                  // 清空容器并添加新组件
                  while (compContainer._el.firstChild) {
                    compContainer._el.removeChild(compContainer._el.firstChild);
                  }
                  compContainer._el.appendChild(content.renderDom());
                }
              }
            }).catch(err => {
              console.error(`加载页面失败 [${item.name}]:`, err);
              if (compContainer._el) {
                compContainer._el.innerHTML = `<div style="color: red; padding: 20px;">加载失败：${item.name}</div>`;
              }
            });

            return compContainer;
          }
        });
      });
    });
  });

  // 创建 VRouterViews 实例并添加到容器
  const routerViews = vRouterViews(router, views => {
    // 设置最大视图数量为 12
    views.setMaxViews(12);

    // 根据 demoRoutes 配置添加视图（仅添加部分常用视图）
    const limitedRoutes = ['home', 'button', 'form', 'table', 'card', 'menu', 'tabs', 'theme', 'i18n', 'echart', 'dashboard', 'vtree'];

    demoRoutes.forEach(category => {
      category.items.forEach(item => {
        if (limitedRoutes.includes(item.name)) {
          views.addView(item.name, {
            title: item.title,
            icon: item.icon,
            closable: item.closable !== false,
            defaultRoute: item.route,
          });
        }
      });
    });

    views.onChange((viewName) => {
      console.log('[VRouterViews] 切换到视图:', viewName);
    });
  });

  container.child(routerViews);

  // 导航到首页
  setTimeout(() => {
    router.navigate('/home');
  }, 0);

  return container;
}

// 使用 AppShell 布局，内容区使用 VRouterViews
const app = AppShell({
  currentPage: 'home.html',
  tocItems: [
    { text: 'VRouterViews 演示', href: '#', level: 1 },
  ],
  content: (content) => {
    content.child(createVRouterViewsContent());
  },
});

app.bindTo('#app');
