/**
 * Yoya.Basic - Dynamic Loader Example
 * 动态加载组件使用示例
 */

import {
  div, vstack, vCard, vCardHeader, vCardBody,
  vButton, vDynamicLoader, loadModules, preloadModules,
  toast,
  flex, vMenuItem, vMenu,
} from '../../yoya/index.js';

import { appLayout, sidebarGroup, sidebarItem, tocItem, docSection, codeDemo } from './layout.js';

/**
 * 创建 Dynamic Loader 演示页面
 */
export function createDynamicLoaderPage() {
  return appLayout({
    // 左侧菜单
    sidebar: (sidebar) => {
      sidebar.child(sidebarGroup('开始', [
        sidebarItem('介绍', 'index.html'),
      ]));
      sidebar.child(sidebarGroup('基础组件', [
        sidebarItem('Button 按钮', 'button.html'),
        sidebarItem('Form 表单', 'form.html'),
        sidebarItem('Card 卡片', 'card.html'),
      ]));
      sidebar.child(sidebarGroup('导航组件', [
        sidebarItem('Menu 菜单', 'menu.html'),
      ]));
      sidebar.child(sidebarGroup('反馈组件', [
        sidebarItem('Message 消息', 'message.html'),
        sidebarItem('Code 代码', 'code.html'),
      ]));
      sidebar.child(sidebarGroup('数据展示', [
        sidebarItem('Detail 详情', 'detail.html'),
        sidebarItem('Field 字段', 'field.html'),
      ]));
      sidebar.child(sidebarGroup('工具', [
        sidebarItem('动态加载', 'dynamic-loader.html', true),
      ]));
    },

    // 中间内容
    content: (content) => {
      // 页面标题
      content.child(vstack(header => {
        header.gap('8px');
        header.child(vMenuItem('动态加载组件'));
        header.child(vMenuItem('安全的按需加载组件，支持错误处理和状态管理。'));
      }));

      // 基础用法
      content.child(docSection('basic', '基础用法', [
        codeDemo('加载远程组件',
          vstack(s => {
            s.gap('16px');
            s.child(vDynamicLoader(
              () => import('../widgets/chart.js'),
              {
                placeholder: div('点击按钮加载组件'),
                loadingContent: div('加载中...'),
                errorContent: div('加载失败，请重试'),
                onLoad: (api, loader) => {
                  toast.success('组件加载成功');
                  api?.render?.();
                },
                onError: (error) => {
                  console.warn('加载失败:', error);
                },
              }
            ));
            s.child(vButton('重新加载', {
              onclick: () => {
                const loader = vDynamicLoader(
                  () => import('../widgets/chart.js'),
                  { onLoad: () => toast.success('重新加载成功') }
                );
                s.child(loader);
              },
            }));
          }),
          `// 基础用法
vDynamicLoader(
  () => import('./chart.js'),
  {
    placeholder: div('点击按钮加载组件'),
    loadingContent: div('加载中...'),
    errorContent: div('加载失败'),
    onLoad: (api, loader) => {
      api.render();
    },
    onError: (error) => {
      console.warn('加载失败:', error);
    }
  }
)`
        ),
      ]));

      // 链式调用
      content.child(docSection('chain', '链式调用', [
        codeDemo('链式 API',
          vstack(s => {
            s.gap('16px');
            s.child(vDynamicLoader(
              () => import('../widgets/table.js'),
              {
                loadingContent: div('正在加载表格组件...'),
              }
            )
              .onLoad((api) => {
                toast.success('表格加载成功');
                api?.init?.();
              })
              .onError((error) => {
                toast.error('加载失败：' + error.message);
              })
              .onStatusChange((status) => {
                console.log('状态变化:', status);
              }));
          }),
          `// 链式调用
vDynamicLoader(
  () => import('./table.js'),
  { loadingContent: div('加载中...') }
)
  .onLoad((api) => { api.init(); })
  .onError((error) => { console.error(error); })
  .onStatusChange((status) => { console.log(status); })`
        ),
      ]));

      // 重试机制
      content.child(docSection('retry', '重试机制', [
        codeDemo('自动重试',
          vstack(s => {
            s.gap('16px');
            s.child(vDynamicLoader(
              () => import('../widgets/unstable.js'),
              {
                retryCount: 3,
                retryDelay: 2000,
                loadingContent: div('首次加载...'),
                onError: (error, loader) => {
                  console.log('加载失败，将自动重试');
                },
              }
            ));
          }),
          `// 配置重试
vDynamicLoader(
  () => import('./unstable.js'),
  {
    retryCount: 3,       // 重试 3 次
    retryDelay: 2000,    // 间隔 2 秒
  }
)`
        ),
      ]));

      // 批量加载
      content.child(docSection('batch', '批量加载', [
        codeDemo('批量加载模块',
          vstack(s => {
            s.gap('12px');
            s.child(vButton('并行加载所有组件', {
              onclick: async () => {
                const results = await loadModules([
                  { name: 'chart', loader: () => import('../widgets/chart.js') },
                  { name: 'table', loader: () => import('../widgets/table.js') },
                  { name: 'form', loader: () => import('../widgets/form.js') },
                ], {
                  parallel: true,
                  onProgress: (loaded, total) => {
                    console.log(`进度：${loaded}/${total}`);
                  },
                  onComplete: (results) => {
                    console.log('全部加载完成:', results);
                  },
                });
              },
            }));
            s.child(vButton('串行加载组件', {
              onclick: async () => {
                await loadModules([
                  { name: 'chart', loader: () => import('../widgets/chart.js') },
                  { name: 'table', loader: () => import('../widgets/table.js') },
                ], { parallel: false });
              },
            }));
          }),
          `// 批量加载
await loadModules([
  { name: 'chart', loader: () => import('./chart.js') },
  { name: 'table', loader: () => import('./table.js') },
  { name: 'form', loader: () => import('./form.js') },
], {
  parallel: true,  // 并行加载
  onProgress: (loaded, total) => {...},
  onComplete: (results) => {...},
});`
        ),
      ]));

      // 预加载
      content.child(docSection('preload', '预加载', [
        codeDemo('预加载到缓存',
          vstack(s => {
            s.gap('12px');
            s.child(vButton('预加载图表组件', {
              onclick: async () => {
                await preloadModules([
                  () => import('../widgets/chart.js'),
                  () => import('../widgets/table.js'),
                ]);
                toast.success('预加载完成');
              },
            }));
            s.child(vButton('从缓存创建组件', {
              onclick: () => {
                // 如果已预加载，会立即使用缓存
                s.child(vDynamicLoader(
                  () => import('../widgets/chart.js'),
                  { onLoad: () => toast.success('从缓存加载') }
                ));
              },
            }));
          }),
          `// 预加载
await preloadModules([
  () => import('./chart.js'),
  () => import('./table.js'),
]);

// 之后创建组件时会直接使用缓存
vDynamicLoader(() => import('./chart.js'))`
        ),
      ]));

      // API
      content.child(docSection('api', 'API', [
        vCard(c => {
          c.vCardBody(api => {
            api.child(vMenu(apiMenu => {
              apiMenu.vertical();

              const apiItems = [
                { name: 'getStatus()', desc: '获取加载状态', props: 'pending|loading|loaded|error' },
                { name: 'isLoaded()', desc: '是否已加载', props: 'boolean' },
                { name: 'isError()', desc: '是否加载失败', props: 'boolean' },
                { name: 'isLoading()', desc: '是否正在加载', props: 'boolean' },
                { name: 'getApi()', desc: '获取模块 API', props: 'any' },
                { name: 'getError()', desc: '获取错误信息', props: 'Error|null' },
                { name: 'retry()', desc: '手动重试', props: 'Promise<this>' },
                { name: 'onLoad()', desc: '设置加载回调', props: 'chainable' },
                { name: 'onError()', desc: '设置错误回调', props: 'chainable' },
                { name: 'onStatusChange()', desc: '设置状态回调', props: 'chainable' },
              ];

              apiItems.forEach(item => {
                apiMenu.item(it => {
                  it.child(flex(apiRow => {
                    apiRow.justifyBetween();
                    apiRow.child(vMenuItem(item.name));
                    apiRow.child(vMenuItem(item.desc));
                    apiRow.child(vMenuItem(item.props));
                  }));
                });
              });
            }));
          });
        }),
      ]));
    },

    // 右侧目录
    toc: (toc) => {
      toc.child(vMenuItem('本页目录'));
      toc.child(vstack(links => {
        links.gap('4px');
        links.child(tocItem('基础用法', '#basic'));
        links.child(tocItem('链式调用', '#chain'));
        links.child(tocItem('重试机制', '#retry'));
        links.child(tocItem('批量加载', '#batch'));
        links.child(tocItem('预加载', '#preload'));
        links.child(tocItem('API', '#api'));
      }));
    },
  });
}
