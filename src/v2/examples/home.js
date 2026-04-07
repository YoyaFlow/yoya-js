/**
 * V2 VRouterViews 演示入口
 * 使用 VRouterViews 实现多视图容器路由
 */

import { vRouter, vRouterViews, toast, div } from '../../yoya/index.js';
import { demoRoutes } from './config/routes.v2.js';

// 初始化主题系统
import '../../yoya/core/theme.js';

// 页面组件加载器缓存
const pageLoaders = {};

// 创建 vRouter 实例
vRouter(r => {
  r.default('/home');

  // 根据 demoRoutes 注册路由
  demoRoutes.forEach(category => {
    category.items.forEach(item => {
      const routePath = item.route;
      r.route(routePath, {
        component: () => {
          // 返回一个容器，异步加载页面组件
          const container = div(d => {
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
              const component = createFn();
              if (component && container._el && component._el) {
                // 清空容器并添加新组件
                while (container._el.firstChild) {
                  container._el.removeChild(container._el.firstChild);
                }
                container._el.appendChild(component._el);
              }
            }
          }).catch(err => {
            console.error(`加载页面失败 [${item.name}]:`, err);
            if (container._el) {
              container._el.innerHTML = `<div style="color: red; padding: 20px;">加载失败：${item.name}</div>`;
            }
          });

          return container;
        }
      });
    });
  });

  r.div(content => {
    content.styles({ height: '100%', overflow: 'hidden' });

    // 创建 VRouterViews 实例
    content.vRouterViews(r, views => {
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
  });

  // 绑定到 DOM
  r.bindTo('#app');

  // 初始化：打开首页
  r.navigate('/home');
});
