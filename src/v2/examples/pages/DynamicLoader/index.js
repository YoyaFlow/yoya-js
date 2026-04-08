/**
 * Yoya.Basic V2 - DynamicLoader Demo Page
 */

import { vstack, flex, vButton, vDynamicLoader, toast, LoadStatus, div } from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

// 使用 v2 的 form 组件作为演示
import { createFormPage } from '../Form/index.js';

/**
 * 创建 DynamicLoader 演示页面
 */
export function createDynamicLoaderPage() {
  const tocItems = [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '加载状态', href: '#status', level: 1 },
    { text: '手动控制', href: '#manual', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'dynamic-loader.html',
    tocItems,
    content: (content) => {
      content.child(PageHeader({
        title: 'DynamicLoader 动态加载',
        description: '动态加载组件用于懒加载远程组件或模块。',
      }));

      content.child(DocSection('basic', '基础用法', [
        CodeDemo('懒加载组件',
          vDynamicLoader(
            () => import('./form-loader-demo.js'),
            {
              onLoad: (api, loader) => {
                if (api && api.render) {
                  loader._children = [];
                  loader.child(api.render());
                }
              },
            }
          ),
          `vDynamicLoader(
  () => import('./path/to/module.js'),
  {
    onLoad: (api, loader) => {
      if (api.render) {
        loader.child(api.render())
      }
    }
  }
)`
        ),
      ]));

      content.child(DocSection('status', '加载状态', [
        CodeDemo('加载状态展示',
          vstack(s => {
            s.gap('16px');
            s.child(vDynamicLoader(
              () => import('./form-loader-demo.js'),
              {
                loadingContent: div('加载中...'),
                errorContent: div(c => {
                  c.styles({ color: 'red' });
                  c.text('加载失败，请重试');
                }),
                onLoad: (api, loader) => {
                  if (api && api.render) {
                    loader._children = [];
                    loader.child(api.render());
                  }
                },
              }
            ));
          }),
          `vDynamicLoader(
  () => import('./path/to/module.js'),
  {
    loadingContent: div('加载中...'),
    errorContent: div('加载失败'),
    onLoad: (api, loader) => {
      loader.child(api.render())
    }
  }
)`
        ),
      ]));

      content.child(DocSection('manual', '手动控制', [
        CodeDemo('手动控制加载',
          vstack(s => {
            s.gap('16px');
            // 保存容器组件引用
            let loaderContainer = null;
            s.div(s => {
              s.id('loader-container');
              loaderContainer = s;
            });
            s.child(flex(btns => {
              btns.gap('12px');
              btns.child(vButton('加载组件').type('primary')
                .on('click', async () => {
                  // 使用组件方法清空容器
                  if (loaderContainer) {
                    loaderContainer._children = [];
                  }

                  const loader = vDynamicLoader(
                    () => import('./form-loader-demo.js'),
                    {
                      loadingContent: div('正在加载表单组件...'),
                      errorContent: div(c => {
                        c.styles({ color: 'red' });
                        c.text('加载失败，请重试');
                      }),
                      onLoad: (api, loader) => {
                        if (api && api.render) {
                          loader._children = [];
                          loader.child(api.render());
                        }
                      },
                    }
                  );

                  loader.bindTo('#loader-container');
                }));
              btns.child(vButton('清除').ghost()
                .on('click', () => {
                  // 使用组件方法清空容器
                  if (loaderContainer) {
                    loaderContainer._children = [];
                  }
                }));
            }));
          }),
          `const loader = vDynamicLoader(
  () => import('./path/to/module.js'),
  {
    loadingContent: div('加载中...'),
    onLoad: (api, loader) => {
      loader.child(api.render())
    }
  }
);

loader.bindTo('#container')`
        ),
      ]));

      content.child(DocSection('api', 'API', [
        ApiTable([
          { name: 'getStatus()', desc: '获取加载状态', type: 'pending|loading|loaded|error' },
          { name: 'isLoaded()', desc: '是否已加载', type: 'boolean' },
          { name: 'isError()', desc: '是否加载失败', type: 'boolean' },
          { name: 'getApi()', desc: '获取模块 API', type: 'any' },
          { name: 'getError()', desc: '获取错误信息', type: 'Error|null' },
          { name: 'retry()', desc: '手动重试加载', type: 'Promise' },
          { name: 'onLoad(fn)', desc: '设置加载回调', type: '(api, loader) => void' },
          { name: 'onError(fn)', desc: '设置错误回调', type: '(error, loader) => void' },
          { name: 'onStatusChange(fn)', desc: '设置状态变化回调', type: '(status, loader) => void' },
        ]),

        vstack(info => {
          info.gap('8px');
          info.div('加载状态：');
          info.ul(u => {
            u.li(`🟡 ${LoadStatus.LOADING} - 加载中`);
            u.li(`🟢 ${LoadStatus.LOADED} - 加载成功`);
            u.li(`🔴 ${LoadStatus.ERROR} - 加载失败`);
          });
        }),
      ]));
    },
  });
}
