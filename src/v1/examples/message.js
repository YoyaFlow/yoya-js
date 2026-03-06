/**
 * Yoya.Basic V1 - Message Demo Page
 * Message 消息提示演示页面
 */

import {
  flex, vstack, vCard, vCardHeader, vCardBody,
  vMenu, vMenuItem, vButton, toast, vMessageContainer,
} from '../../yoya/index.js';

import { appLayout, sidebarGroup, sidebarItem, tocItem, docSection, codeDemo } from './layout.js';

/**
 * 创建 Message 演示页面
 */
export function createMessagePage() {
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
        sidebarItem('Message 消息', 'message.html', true),
        sidebarItem('Code 代码', 'code.html'),
      ]));
      sidebar.child(sidebarGroup('数据展示', [
        sidebarItem('Detail 详情', 'detail.html'),
        sidebarItem('Field 字段', 'field.html'),
      ]));
    },

    // 中间内容
    content: (content) => {
      // 页面标题
      content.child(vstack(header => {
        header.gap('8px');
        header.child(vMenuItem('Message 消息'));
        header.child(vMenuItem('全局消息提示组件，支持成功、错误、警告、信息四种类型。'));
      }));

      // 基础用法
      content.child(docSection('basic', '基础用法', [
        codeDemo('基本消息提示',
          flex(row => {
            row.gap('12px');
            row.child(vButton('成功消息', {
              onclick: () => toast.success('操作成功！'),
            }).type('success'));
            row.child(vButton('错误消息', {
              onclick: () => toast.error('操作失败，请重试！'),
            }).type('danger'));
            row.child(vButton('警告消息', {
              onclick: () => toast.warning('请注意此操作的影响！'),
            }).type('warning'));
            row.child(vButton('信息消息', {
              onclick: () => toast.info('这是一个普通信息提示'),
            }).type('primary'));
          }),
          `// 使用 toast 便捷方法
toast.success('操作成功！')
toast.error('操作失败，请重试！')
toast.warning('请注意此操作的影响！')
toast.info('这是一个普通信息提示')`
        ),
      ]));

      // 自定义时长
      content.child(docSection('duration', '自定义时长', [
        codeDemo('控制消息显示时间',
          flex(row => {
            row.gap('12px');
            row.child(vButton('2 秒关闭', {
              onclick: () => toast.info('2 秒后关闭', 2000),
            }));
            row.child(vButton('5 秒关闭', {
              onclick: () => toast.info('5 秒后关闭', 5000),
            }));
            row.child(vButton('不自动关闭', {
              onclick: () => toast.info('点击右上角关闭', 0),
            }));
          }),
          `// 第二个参数控制时长（毫秒）
toast.info('2 秒后关闭', 2000)
toast.info('5 秒后关闭', 5000)
toast.info('不自动关闭', 0)  // 0 表示不自动关闭

// 或使用配置对象
toast('消息内容', { duration: 5000 })`
        ),
      ]));

      // 消息位置
      content.child(docSection('position', '消息位置', [
        codeDemo('不同的消息位置',
          vstack(s => {
            s.gap('12px');
            s.child(flex(row => {
              row.gap('12px');
              row.child(vButton('左上角', {
                onclick: () => {
                  toast.setPosition('top-left');
                  toast.info('左上角消息');
                },
              }));
              row.child(vButton('顶部居中', {
                onclick: () => {
                  toast.setPosition('top-center');
                  toast.info('顶部居中消息');
                },
              }));
              row.child(vButton('右上角', {
                onclick: () => {
                  toast.setPosition('top-right');
                  toast.info('右上角消息（默认）');
                },
              }));
            }));
            s.child(flex(row => {
              row.gap('12px');
              row.child(vButton('左下角', {
                onclick: () => {
                  toast.setPosition('bottom-left');
                  toast.info('左下角消息');
                },
              }));
              row.child(vButton('底部居中', {
                onclick: () => {
                  toast.setPosition('bottom-center');
                  toast.info('底部居中消息');
                },
              }));
              row.child(vButton('右下角', {
                onclick: () => {
                  toast.setPosition('bottom-right');
                  toast.info('右下角消息');
                },
              }));
            }));
          }),
          `// 设置消息位置
toast.setPosition('top-left')     // 左上角
toast.setPosition('top-center')   // 顶部居中
toast.setPosition('top-right')    // 右上角（默认）
toast.setPosition('bottom-left')  // 左下角
toast.setPosition('bottom-center')// 底部居中
toast.setPosition('bottom-right') // 右下角

// 或在调用时直接指定位置
toast('消息内容', { position: 'top-center' })
toast.success('成功！', { position: 'bottom-right' })`
        ),
      ]));

      // 配置对象
      content.child(docSection('config', '配置对象', [
        codeDemo('使用配置对象',
          vstack(s => {
            s.gap('12px');
            s.child(vButton('完整配置', {
              onclick: () => {
                toast('这是一条消息', {
                  type: 'success',
                  duration: 5000,
                  position: 'top-center'
                });
              },
            }).type('primary'));
            s.child(vButton('仅类型和时长', {
              onclick: () => {
                toast('操作成功', { type: 'success', duration: 2000 });
              },
            }));
          }),
          `// 使用配置对象（推荐）
toast('消息内容', {
  type: 'success',    // 消息类型：success, error, warning, info
  duration: 5000,     // 显示时长（毫秒），0 表示不自动关闭
  position: 'top-center'  // 显示位置
})

// 便捷方法也支持配置对象
toast.success('成功！', { duration: 5000, position: 'bottom-right' })`
        ),
      ]));

      // 连续消息
      content.child(docSection('continuous', '连续消息', [
        codeDemo('连续发送多条消息',
          flex(row => {
            row.gap('12px');
            row.child(vButton('发送一组消息', {
              onclick: () => {
                toast.info('正在处理...', 1000);
                setTimeout(() => {
                  toast.success('处理完成！', 2000);
                }, 1200);
                setTimeout(() => {
                  toast.info('数据已同步', 2000);
                }, 1500);
              },
            }).type('primary'));
            row.child(vButton('清除所有', {
              onclick: () => toast.clear(),
            }).ghost());
          }),
          `// 连续发送消息
toast.info('正在处理...');
setTimeout(() => {
  toast.success('处理完成！');
}, 1000);

// 清除所有消息
toast.clear();`
        ),
      ]));

      // API
      content.child(docSection('api', 'API', [
        vCard(c => {
          c.vCardBody(api => {
            api.child(vMenu(apiMenu => {
              apiMenu.vertical();

              const apiItems = [
                { name: 'toast.success()', desc: '成功消息', props: 'content, duration' },
                { name: 'toast.error()', desc: '错误消息', props: 'content, duration' },
                { name: 'toast.warning()', desc: '警告消息', props: 'content, duration' },
                { name: 'toast.info()', desc: '信息消息', props: 'content, duration' },
                { name: 'toast()', desc: '统一入口', props: 'content, options' },
                { name: 'toast.clear()', desc: '清除所有', props: '-' },
                { name: 'toast.setPosition()', desc: '设置位置', props: 'position' },
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
        links.child(tocItem('自定义时长', '#duration'));
        links.child(tocItem('消息位置', '#position'));
        links.child(tocItem('配置对象', '#config'));
        links.child(tocItem('连续消息', '#continuous'));
        links.child(tocItem('API', '#api'));
      }));
    },
  });
}
