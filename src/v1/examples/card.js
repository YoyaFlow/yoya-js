/**
 * Yoya.Basic V1 - Card Demo Page
 * Card 卡片演示页面 - 演示 setup 三种方式
 */

import {
  flex, grid, responsiveGrid, vstack, hstack, div,
  vCard, vCardHeader, vCardBody, vCardFooter,
  vMenu, vMenuItem, vButton, toast,
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
      ]));
      sidebar.child(sidebarGroup('基础组件', [
        sidebarItem('Button 按钮', 'button.html'),
        sidebarItem('Form 表单', 'form.html'),
        sidebarItem('Card 卡片', 'card.html', true),
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
        sidebarItem('Body 容器', 'body.html'),
      ]));
    },

    // 中间内容
    content: (content) => {
      // 页面标题
      content.child(vstack(header => {
        header.gap('8px');
        header.child(vMenuItem('Card 卡片'));
        header.child(vMenuItem('卡片容器用于分组和展示相关内容，支持头部、内容区和底部的组合。'));
      }));

      // setup 三种方式
      content.child(docSection('setup', 'setup 三种方式', [
        codeDemo('setupString - 简单卡片',
          vCard('这是一个只包含文本内容的简单卡片'),
          `// ✅ 推荐：简单文本直接用字符串
vCard('卡片内容')`
        ),

        codeDemo('setupObject - 配置卡片',
          vstack(s => {
            s.gap('16px');
            // 方式 1：对象配置 header/body/footer（推荐）
            s.child(vCard({
              header: '快捷配置',
              body: '使用 header/body/footer 属性',
              footer: div('底部内容'),
            }));
            // 方式 2：对象 + 函数回调（适合复杂内容）
            s.child(vCard({
              header: '配置卡片',
            }, c => {
              c.vCardBody('使用函数回调添加更多内容');
            }));
          }),
          `// ✅ 推荐：简单配置用对象

// 方式 1：对象配置 header/body/footer（推荐）
vCard({
  header: '卡片标题',
  body: '卡片内容',
  footer: div('底部')
})

// 方式 2：对象 + 函数回调（适合复杂内容）
vCard({
  header: '标题'
}, c => {
  c.vCardBody('内容')
})`
        ),

        codeDemo('setupFunction - 完整卡片',
          vCard(c => {
            c.vCardHeader('卡片标题');
            c.vCardBody(b => {
              b.div('这是卡片的内容区域，可以放置文本、图片、表格等各种内容。');
            });
            c.vCardFooter(f => {
              f.child(flex(btns => {
                btns.gap('8px');
                btns.child(vButton('取消').ghost().size('small'));
                btns.child(vButton('确定').type('primary').size('small'));
              }));
            });
          }),
          `// ✅ 推荐：复杂结构用函数回调
vCard(c => {
  c.vCardHeader('标题')
  c.vCardBody(b => {
    b.div('内容')
  })
  c.vCardFooter(f => {
    f.child(vButton('取消').ghost())
    f.child(vButton('确定').type('primary'))
  })
})`
        ),
      ]));

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
    border: '1px solid var(--islands-border)',
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
            c.vCardBody('这是卡片的内容区域，可以放置文本、图片、表格等各种内容。');
            c.vCardFooter(f => {
              f.child(flex(btns => {
                btns.gap('8px');
                btns.child(vButton('取消').ghost().size('small'));
                btns.child(vButton('确定').type('primary').size('small'));
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
    b.child(vMenuItem('系统维护通知'))
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
                btns.child(vButton('删除').type('danger').size('small'));
              }));
            });
          }),
          `vCard(c => {
  c.vCardBody(b => {
    b.child(vMenuItem('确认删除？'))
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

              g.child(vCard(c1 => {
                c1.vCardHeader('📊 数据统计');
                c1.vCardBody('1,234');
                c1.vCardFooter(f => { f.child(vMenuItem('较昨日 +12%')); });
              }));

              g.child(vCard(c2 => {
                c2.vCardHeader('👥 用户数');
                c2.vCardBody('8,567');
                c2.vCardFooter(f => { f.child(vMenuItem('较昨日 +5%')); });
              }));

              g.child(vCard(c3 => {
                c3.vCardHeader('💰 收入');
                c3.vCardBody('¥45,678');
                c3.vCardFooter(f => { f.child(vMenuItem('较昨日 -3%')); });
              }));

              g.child(vCard(c4 => {
                c4.vCardHeader('📝 订单');
                c4.vCardBody('342');
                c4.vCardFooter(f => { f.child(vMenuItem('较昨日 +8%')); });
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
                { name: 'vCard', desc: '卡片容器', props: 'setup(字符串/对象/函数)' },
                { name: 'vCardHeader', desc: '卡片头部', props: 'setup(字符串/函数)' },
                { name: 'vCardBody', desc: '卡片内容', props: 'setup(字符串/函数)' },
                { name: 'vCardFooter', desc: '卡片底部', props: 'setup(函数)' },
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
        links.child(tocItem('setup 三种方式', '#setup'));
        links.child(tocItem('基础卡片', '#basic'));
        links.child(tocItem('完整卡片', '#complete'));
        links.child(tocItem('带头部', '#header-only'));
        links.child(tocItem('带底部', '#footer-only'));
        links.child(tocItem('网格布局', '#grid'));
        links.child(tocItem('API', '#api'));
      }));
    },
  });
}
