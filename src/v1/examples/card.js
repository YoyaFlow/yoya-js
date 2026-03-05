/**
 * Yoya.Basic V1 - Card Demo Page
 * Card 卡片演示页面
 */

import {
  flex, grid, responsiveGrid, vstack, hstack,
  vCard, vCardHeader, vCardBody, vCardFooter,
  vMenu, vMenuItem, vButton, vCode, toast,
} from '../../yoya/index.js';

import { appLayout, sidebarGroup, sidebarItem, tocItem, docSection, codeDemo } from './layout.js';

/**
 * 创建 Card 演示页面
 */
export function createCardPage() {
  return appLayout({
    // 左侧菜单
    sidebar: (sidebar) => {
      sidebar.child(sidebarGroup('开始', [
        sidebarItem('介绍', 'index.html'),
        sidebarItem('快速开始', 'quickstart.html'),
      ]));
      sidebar.child(sidebarGroup('基础组件', [
        sidebarItem('Button 按钮', 'button.html'),
        sidebarItem('Form 表单', 'form.html'),
        sidebarItem('Card 卡片', 'card.html', true),
      ]));
      sidebar.child(sidebarGroup('导航组件', [
        sidebarItem('Menu 菜单', 'menu.html'),
        sidebarItem('Tabs 标签页', 'tabs.html'),
      ]));
      sidebar.child(sidebarGroup('反馈组件', [
        sidebarItem('Message 消息', 'message.html'),
        sidebarItem('Toast 提示', 'toast.html'),
      ]));
    },

    // 中间内容
    content: (content) => {
      // 页面标题
      content.child(vstack(header => {
        header.gap('8px');
        header.styles({ marginBottom: '24px' });

        header.child(vMenuItem('Card 卡片'));
        header.child(vMenuItem('卡片容器用于分组和展示相关内容，支持头部、内容区和底部的组合。'));
      }));

      // 基础卡片
      content.child(docSection('basic', '基础卡片', [
        codeDemo('简单卡片',
          vCard(c => {
            c.vCardBody('这是一个简单的卡片，只包含内容区域。');
          }),
          `vCard(c => {
  c.vCardBody('这是一个简单的卡片')
})`
        ),

        codeDemo('带边框卡片',
          vCard(c => {
            c.styles({ border: '1px solid var(--islands-border, #e0e0e0)', boxShadow: 'none' });
            c.vCardBody('带边框的卡片，去除了阴影效果。');
          }),
          `vCard(c => {
  c.styles({
    border: '1px solid var(--islands-border, #e0e0e0)',
    boxShadow: 'none'
  })
  c.vCardBody('带边框的卡片')
})`
        ),
      ]));

      // 完整卡片
      content.child(docSection('complete', '完整卡片', [
        codeDemo('标准卡片（头部 + 内容 + 底部）',
          vCard(c => {
            c.vCardHeader('卡片标题');
            c.vCardBody('这是卡片的内容区域，可以放置文本、图片、表格等各种内容。卡片组件支持灵活的内容组织方式。');
            c.vCardFooter(f => {
              f.child(flex(btns => {
                btns.gap('8px');
                btns.child(vButton('取消').ghost().size('small'));
                btns.child(vButton('确定').type('primary').size('small').onClick(() => toast.success('确定')));
              }));
            });
          }),
          `vCard(c => {
  c.vCardHeader('卡片标题')
  c.vCardBody('这是卡片的内容区域')
  c.vCardFooter(f => {
    f.child(vButton('取消').ghost())
    f.child(vButton('确定').type('primary'))
  })
})`
        ),
      ]));

      // 只有头部的卡片
      content.child(docSection('header-only', '带头部的卡片', [
        codeDemo('仅头部 + 内容',
          vCard(c => {
            c.vCardHeader('通知消息');
            c.vCardBody(b => {
              b.child(vstack(stack => {
                stack.gap('8px');
                stack.child(vMenuItem('📢 系统将于今晚 22:00 进行维护升级。'));
                stack.child(vMenuItem('预计维护时间 2 小时，请提前保存数据。'));
              }));
            });
          }),
          `vCard(c => {
  c.vCardHeader('通知消息')
  c.vCardBody(b => {
    b.text('系统将于今晚 22:00 进行维护升级')
  })
})`
        ),
      ]));

      // 只有底部的卡片
      content.child(docSection('footer-only', '带底部的卡片', [
        codeDemo('内容 + 底部操作',
          vCard(c => {
            c.vCardBody(b => {
              b.child(vstack(stack => {
                stack.gap('12px');
                stack.child(vMenuItem('确认删除此项目吗？'));
                stack.child(vMenuItem('此操作不可撤销，请谨慎操作。'));
              }));
            });
            c.vCardFooter(f => {
              f.child(flex(btns => {
                btns.gap('8px');
                btns.child(vButton('取消').ghost().size('small'));
                btns.child(vButton('删除').type('danger').size('small').onClick(() => toast.error('已删除')));
              }));
            });
          }),
          `vCard(c => {
  c.vCardBody(b => {
    b.text('确认删除此项目吗？')
  })
  c.vCardFooter(f => {
    f.child(vButton('取消').ghost())
    f.child(vButton('删除').type('danger'))
  })
})`
        ),
      ]));

      // 卡片网格
      content.child(docSection('grid', '卡片网格布局', [
        vCard(c => {
          c.vCardBody(b => {
            b.child(responsiveGrid(g => {
              g.minSize('200px');
              g.gap('16px');

              // 卡片 1
              g.child(vCard(c1 => {
                c1.vCardHeader('📊 数据统计');
                c1.vCardBody('1,234');
                c1.vCardFooter(f => { f.child(vMenuItem('较昨日 +12%')); });
              }));

              // 卡片 2
              g.child(vCard(c2 => {
                c2.vCardHeader('👥 用户数');
                c2.vCardBody('8,567');
                c2.vCardFooter(f => { f.child(vMenuItem('较昨日 +5%')); });
              }));

              // 卡片 3
              g.child(vCard(c3 => {
                c3.vCardHeader('💰 收入');
                c3.vCardBody('¥45,678');
                c3.vCardFooter(f => { f.child(vMenuItem('较昨日 -3%')); });
              }));

              // 卡片 4
              g.child(vCard(c4 => {
                c4.vCardHeader('📝 订单');
                c4.vCardBody('342');
                c4.vCardFooter(f => { f.child(vMenuItem('较昨日 +8%')); });
              }));
            }));
          });
        }),
      ]));

      // 嵌套卡片
      content.child(docSection('nested', '嵌套卡片', [
        vCard(c => {
          c.vCardHeader('外层卡片');
          c.vCardBody(b => {
            b.child(vstack(stack => {
              stack.gap('16px');
              stack.child(vMenuItem('这是外层卡片的内容'));

              // 内层卡片
              stack.child(vCard(inner => {
                inner.vCardHeader('内层卡片');
                inner.vCardBody('这是内嵌的卡片内容');
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
                { name: 'vCard', desc: '卡片容器', props: 'setup(回调函数)' },
                { name: 'vCardHeader', desc: '卡片头部', props: 'setup(回调函数) / text(文本)' },
                { name: 'vCardBody', desc: '卡片内容', props: 'setup(回调函数) / text(文本)' },
                { name: 'vCardFooter', desc: '卡片底部', props: 'setup(回调函数) / child(子元素)' },
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
        links.child(tocItem('基础卡片', '#basic'));
        links.child(tocItem('完整卡片', '#complete'));
        links.child(tocItem('带头部', '#header-only'));
        links.child(tocItem('带底部', '#footer-only'));
        links.child(tocItem('网格布局', '#grid'));
        links.child(tocItem('嵌套卡片', '#nested'));
        links.child(tocItem('API', '#api'));
      }));
    },
  });
}
