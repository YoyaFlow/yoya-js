/**
 * Yoya.Basic V1 - Body Demo Page
 * Body 页面容器演示页面
 */

import {
  flex, vstack, hstack, vCard, vCardHeader, vCardBody,
  vMenu, vMenuItem, vButton, vBody, toast,
  div, span,
} from '../../yoya/index.js';

import { appLayout, sidebarGroup, sidebarItem, tocItem, docSection, codeDemo } from './layout.js';

/**
 * 创建 Body 演示页面
 */
export function createBodyPage() {
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
      sidebar.child(sidebarGroup('布局组件', [
        sidebarItem('Body 容器', 'body.html', true),
      ]));
    },

    // 中间内容
    content: (content) => {
      // 页面标题
      content.child(vstack(header => {
        header.gap('8px');
        header.child(vMenuItem('Body 页面容器'));
        header.child(vMenuItem('页面整体背景容器，支持全屏模式和主题集成。'));
      }));

      // 基础用法
      content.child(docSection('basic', '基础用法', [
        codeDemo('基础 Body 容器',
          vCard(c => {
            c.vCardHeader('默认 Body');
            c.vCardBody(body => {
              body.child(div(d => {
                d.styles({
                  padding: '20px',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  borderRadius: '8px',
                });
                d.child(h2('欢迎使用 Yoya.Basic'));
                d.child(p('这是一个页面容器示例'));
              }));
            });
          }),
          `// Body 作为页面容器
vBody(b => {
  b.child(
    div(d => {
      d.child(h1('页面标题'));
      d.child(p('页面内容'));
    })
  );
})`
        ),
      ]));

      // 全屏模式
      content.child(docSection('fullscreen', '全屏模式', [
        codeDemo('全屏背景容器',
          vstack(s => {
            s.gap('16px');
            s.child(vCard(c => {
              c.vCardBody(box => {
                box.child(div(d => {
                  d.styles({
                    padding: '20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '8px',
                    color: 'white',
                    minHeight: '200px',
                  });
                  d.child(h2('全屏模式'));
                  d.child(p('minHeight: 100vh'));
                }));
              });
            }));
          }),
          `// 全屏模式（默认）
vBody(b => {
  b.fullscreen(true);  // 启用全屏
})`
        ),
      ]));

      // 对齐方式
      content.child(docSection('align', '对齐方式', [
        codeDemo('内容对齐',
          vstack(s => {
            s.gap('16px');

            // 居中对齐
            s.child(vCard(c => {
              c.vCardHeader('居中对齐');
              c.vCardBody(center => {
                center.child(div(d => {
                  d.styles({
                    padding: '40px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    borderRadius: '8px',
                    textAlign: 'center',
                  });
                  d.child(h3('水平垂直居中'));
                  d.child(p('alignItems: center, justifyContent: center'));
                }));
              });
            }));

            // 左对齐
            s.child(vCard(c => {
              c.vCardHeader('左对齐（默认）');
              c.vCardBody(left => {
                left.child(div(d => {
                  d.styles({
                    padding: '20px',
                    background: 'rgba(102, 126, 234, 0.05)',
                    borderRadius: '8px',
                  });
                  d.child(h3('左对齐'));
                  d.child(p('alignItems: stretch'));
                }));
              });
            }));
          }),
          `// 居中对齐
vBody(b => {
  b.center();  // 水平垂直居中
})

// 自定义对齐
vBody(b => {
  b.align('center');        // 水平居中
  b.align('flex-start');    // 左对齐
  b.align('flex-end');      // 右对齐
})`
        ),
      ]));

      // 背景色
      content.child(docSection('background', '背景色', [
        codeDemo('自定义背景',
          vstack(s => {
            s.gap('16px');

            s.child(div(gradient => {
              gradient.styles({
                padding: '30px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '8px',
                color: 'white',
              });
              gradient.child(h3('渐变背景'));
              gradient.child(p('linear-gradient(135deg, #667eea, #764ba2)'));
            }));

            s.child(div(dark => {
              dark.styles({
                padding: '30px',
                background: '#1a1a2e',
                borderRadius: '8px',
                color: 'white',
              });
              dark.child(h3('深色背景'));
              dark.child(p('background: #1a1a2e'));
            }));

            s.child(div(light => {
              light.styles({
                padding: '30px',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                borderRadius: '8px',
                color: '#333',
              });
              light.child(h3('浅色背景'));
              light.child(p('linear-gradient(135deg, #f5f7fa, #c3cfe2)'));
            }));
          }),
          `// 自定义背景色
vBody(b => {
  b.background('linear-gradient(135deg, #667eea, #764ba2)');
})`
        ),
      ]));

      // 内边距
      content.child(docSection('padding', '内边距', [
        codeDemo('自定义内边距',
          vstack(s => {
            s.gap('16px');
            s.child(vCard(c => {
              c.vCardBody(p => {
                p.child(div(d => {
                  d.styles({
                    padding: '40px',
                    background: 'rgba(102, 126, 234, 0.05)',
                    borderRadius: '8px',
                    border: '2px dashed #667eea',
                  });
                  d.child(h3('大内边距'));
                  d.child(p('padding: 40px'));
                }));
              });
            }));
          }),
          `// 自定义内边距
vBody(b => {
  b.padding('20px');
  b.padding('20px 40px');  // 上下 20px，左右 40px
})`
        ),
      ]));

      // 完整页面布局
      content.child(docSection('layout', '完整页面布局', [
        vCard(c => {
          c.vCardHeader('完整页面示例');
          c.vCardBody(page => {
            page.child(vstack(layout => {
              layout.gap('20px');

              // 头部
              layout.child(div(header => {
                header.styles({
                  padding: '20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '8px',
                  color: 'white',
                });
                header.child(h2('页面头部'));
                header.child(p('Header Component'));
              }));

              // 内容区
              layout.child(div(main => {
                main.styles({
                  padding: '20px',
                  background: 'rgba(0,0,0,0.02)',
                  borderRadius: '8px',
                  minHeight: '200px',
                });
                main.child(h3('主要内容区'));
                main.child(p('这里放置页面的主要内容...'));
              }));

              // 底部
              layout.child(div(footer => {
                footer.styles({
                  padding: '15px',
                  background: 'rgba(0,0,0,0.05)',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: '#666',
                });
                footer.child(p('© 2024 Yoya.Basic - 页面底部'));
              }));
            }));
          });
        }),
      ]));

      // API
      content.child(docSection('api', 'API', [
        vCard(c => {
          c.vCardBody(api => {
            api.child(vMenu(apiMenu => {
              apiMenu.vertical();

              const apiItems = [
                { name: 'background()', desc: '背景色', props: 'string' },
                { name: 'minHeight()', desc: '最小高度', props: 'string' },
                { name: 'fullscreen()', desc: '全屏模式', props: 'boolean' },
                { name: 'align()', desc: '对齐方式', props: 'center | flex-start | flex-end' },
                { name: 'center()', desc: '居中', props: '-' },
                { name: 'padding()', desc: '内边距', props: 'string' },
                { name: 'content()', desc: '添加内容', props: 'Tag | string' },
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
        links.child(tocItem('全屏模式', '#fullscreen'));
        links.child(tocItem('对齐方式', '#align'));
        links.child(tocItem('背景色', '#background'));
        links.child(tocItem('内边距', '#padding'));
        links.child(tocItem('完整布局', '#layout'));
        links.child(tocItem('API', '#api'));
      }));
    },
  });
}
