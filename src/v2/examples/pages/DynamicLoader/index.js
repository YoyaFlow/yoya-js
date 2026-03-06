/**
 * Yoya.Basic V2 - DynamicLoader Demo Page
 */

import { vstack, flex, vButton, vDynamicLoader, toast, LoadStatus } from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

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
          vDynamicLoader(loader => {
            loader.src('../../../v1/widgets/form.js');
            loader.render((module) => {
              if (module.render) {
                return module.render();
              }
              return vStack(s => s.text('组件无 render 函数'));
            });
          }),
          `vDynamicLoader(loader => {
  loader.src('./path/to/module.js')
  loader.render((module) => {
    return module.render()
  })
})`
        ),
      ]));

      content.child(DocSection('status', '加载状态', [
        CodeDemo('加载状态展示',
          vstack(s => {
            s.gap('16px');
            s.child(vDynamicLoader(loader => {
              loader.src('../../../v1/widgets/form.js');
              loader.loading('加载中...');
              loader.error('加载失败，请重试');
              loader.render((module) => {
                if (module.render) {
                  return module.render();
                }
                return vStack(s => s.text('组件无 render 函数'));
              });
            }));
          }),
          `vDynamicLoader(loader => {
  loader.src('./path/to/module.js')
  loader.loading('加载中...')
  loader.error('加载失败')
  loader.render((module) => {
    return module.render()
  })
})`
        ),
      ]));

      content.child(DocSection('manual', '手动控制', [
        CodeDemo('手动控制加载',
          vstack(s => {
            s.gap('16px');
            s.div(s => {
              s.id('loader-container');
            });
            s.child(flex(btns => {
              btns.gap('12px');
              btns.child(vButton('加载组件').type('primary')
                .on('click', async () => {
                  const container = document.getElementById('loader-container');
                  container.innerHTML = '';

                  const loader = vDynamicLoader(l => {
                    l.src('../../../v1/widgets/form.js');
                    l.loading('正在加载表单组件...');
                    l.error('加载失败，请重试');
                    l.render((module) => {
                      if (module.render) {
                        return module.render();
                      }
                      return vstack(v => v.text('无 render 函数'));
                    });
                  });

                  loader.bindTo('#loader-container');
                }));
              btns.child(vButton('清除').ghost()
                .on('click', () => {
                  document.getElementById('loader-container').innerHTML = '';
                }));
            }));
          }),
          `const loader = vDynamicLoader(l => {
  l.src('./path/to/module.js')
  l.loading('加载中...')
  l.error('加载失败')
  l.render((module) => {
    return module.render()
  })
})

loader.bindTo('#container')`
        ),
      ]));

      content.child(DocSection('api', 'API', [
        ApiTable([
          { name: 'src', desc: '模块路径', type: 'string' },
          { name: 'loading', desc: '加载中文本', type: 'string | Tag' },
          { name: 'error', desc: '错误提示', type: 'string | Tag' },
          { name: 'render', desc: '渲染函数', type: '(module) => Tag' },
          { name: 'onStatusChange', desc: '状态变化回调', type: '(status) => void' },
        ]),

        vstack(info => {
          info.gap('8px');
          info.div('加载状态：');
          info.ul(u => {
            u.li(`🟡 ${LoadStatus.LOADING} - 加载中`);
            u.li(`🟢 ${LoadStatus.SUCCESS} - 加载成功`);
            u.li(`🔴 ${LoadStatus.ERROR} - 加载失败`);
          });
        }),
      ]));
    },
  });
}
