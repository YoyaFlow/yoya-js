/**
 * Yoya.Basic V1 - Menu Demo Page
 * Menu 菜单演示页面 - 演示 setup 三种方式
 */

import {
  flex, vstack, hstack,
  vCard, vCardHeader, vCardBody,
  vMenu, vMenuItem, vMenuDivider, vMenuGroup, vDropdownMenu, vContextMenu,
  vButton, vCode, toast,
} from '../../yoya/index.js';

import { appLayout, sidebarGroup, sidebarItem, tocItem, docSection, codeDemo } from './layout.js';

/**
 * 创建 Menu 演示页面
 */
export function createMenuPage() {
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
        sidebarItem('Menu 菜单', 'menu.html', true),
      ]));
    },

    // 中间内容
    content: (content) => {
      // 页面标题
      content.child(vstack(header => {
        header.gap('8px');
        header.child(vMenuItem('Menu 菜单'));
        header.child(vMenuItem('菜单组件用于展示操作列表，支持垂直/水平布局、分组、下拉和右键菜单等功能。'));
      }));

      // setup 三种方式
      content.child(docSection('setup', 'setup 三种方式', [
        codeDemo('setupString - 简单菜单项',
          vMenu(m => {
            m.item('📋 菜单项 1');
            m.item('📁 菜单项 2');
            m.item('⚙️ 设置');
          }),
          `// ✅ 推荐：简单文本直接用字符串
vMenu(m => {
  m.item('菜单项 1')
  m.item('菜单项 2')
})`
        ),

        codeDemo('setupObject - 对象配置菜单项',
          vMenu(m => {
            m.item('📋 自定义类', {
              onclick: () => toast.info('自定义类'),
            });
            m.item('🔴 红色菜单', {
              onclick: () => toast.info('点击菜单'),
            });
          }),
          `// ✅ 推荐：配置属性和事件用对象
// 第一个参数为文本，第二个参数为对象配置
vMenu(m => {
  m.item('📋 自定义类', {
    onclick: () => toast('点击')
  })
  m.item('🔴 红色菜单', {
    onclick: () => toast('点击')
  })
})`
        ),

        codeDemo('setupFunction + 链式调用（最常用）',
          vMenu(m => {
            m.item(it => {
              it.text('📋 菜单项 1');
              it.active();
              it.onClick(() => toast.info('菜单项 1'));
            });
            m.item(it => {
              it.text('📁 菜单项 2');
              it.shortcut('Ctrl+O');
              it.onClick(() => toast.info('菜单项 2'));
            });
            m.item('⚙️ 设置')
              .shortcut('Ctrl+S')
              .onClick(() => toast.info('设置'));
          }),
          `// ✅ 推荐：复杂逻辑用函数 + 链式
vMenu(m => {
  m.item(it => {
    it.text('菜单项 1')
    it.active()
    it.onClick(() => toast('点击'))
  })
  
  // 或更简洁的链式
  m.item('设置')
    .shortcut('Ctrl+S')
    .onClick(() => toast('设置'))
})`
        ),
      ]));

      // 基础菜单
      content.child(docSection('basic', '基础菜单', [
        codeDemo('垂直菜单（默认）',
          vMenu(m => {
            m.item('📋 菜单项 1').onClick(() => toast.info('点击了菜单项 1'));
            m.item('📁 菜单项 2').onClick(() => toast.info('点击了菜单项 2'));
            m.item('⚙️ 设置').onClick(() => toast.info('点击了设置'));
          }),
          `vMenu(m => {
  m.item('菜单项 1').onClick(() => toast('点击'))
  m.item('菜单项 2').onClick(() => toast('点击'))
  m.item('设置').onClick(() => toast('点击'))
})`
        ),

        codeDemo('水平菜单',
          vMenu(m => {
            m.horizontal();
            m.item('首页').active();
            m.item('产品').onClick(() => toast.info('产品'));
            m.item('关于').onClick(() => toast.info('关于'));
          }),
          `vMenu(m => {
  m.horizontal()
  m.item('首页').active()
  m.item('产品').onClick(() => toast('产品'))
})`
        ),
      ]));

      // 带分割线的菜单
      content.child(docSection('divider', '带分割线的菜单', [
        codeDemo('菜单分割线',
          vMenu(m => {
            m.item('📄 新建').onClick(() => toast.info('新建'));
            m.item('📂 打开').onClick(() => toast.info('打开'));
            m.divider();
            m.item('💾 保存').onClick(() => toast.info('保存'));
            m.item('🗑️ 删除').onClick(() => toast.info('删除'));
          }),
          `vMenu(m => {
  m.item('新建').onClick(() => toast('新建'))
  m.item('打开').onClick(() => toast('打开'))
  m.divider()
  m.item('保存').onClick(() => toast('保存'))
})`
        ),
      ]));

      // 带分组的菜单
      content.child(docSection('group', '带分组的菜单', [
        codeDemo('菜单分组',
          vMenu(m => {
            m.group(g => {
              g.label('文件操作');
              g.item('📄 新建').onClick(() => toast.info('新建'));
              g.item('📂 打开').onClick(() => toast.info('打开'));
            });
            m.divider();
            m.group(g => {
              g.label('编辑');
              g.item('✂️ 剪切').onClick(() => toast.info('剪切'));
              g.item('📋 复制').onClick(() => toast.info('复制'));
              g.item('📌 粘贴').onClick(() => toast.info('粘贴'));
            });
          }),
          `vMenu(m => {
  m.group(g => {
    g.label('文件操作')
    g.item('新建')
    g.item('打开')
  })
  m.divider()
  m.group(g => {
    g.label('编辑')
    g.item('剪切')
    g.item('复制')
  })
})`
        ),
      ]));

      // 菜单项状态
      content.child(docSection('state', '菜单项状态', [
        codeDemo('激活、禁用、危险状态',
          vMenu(m => {
            m.item('🏠 首页').active();
            m.item('📦 产品').onClick(() => toast.info('产品'));
            m.item('🔒 禁用项').disabled();
            m.divider();
            m.item('🗑️ 删除').danger().onClick(() => toast.error('删除操作'));
          }),
          `vMenu(m => {
  m.item('首页').active()
  m.item('产品').onClick(() => toast('产品'))
  m.item('禁用项').disabled()
  m.divider()
  m.item('删除').danger().onClick(() => toast.error('删除'))
})`
        ),
      ]));

      // 带快捷键的菜单
      content.child(docSection('shortcut', '带快捷键的菜单', [
        codeDemo('菜单项快捷键',
          vMenu(m => {
            m.item('📄 新建').shortcut('Ctrl+N').onClick(() => toast.info('新建'));
            m.item('🔍 查找').shortcut('Ctrl+F').onClick(() => toast.info('查找'));
            m.item('💾 保存').shortcut('Ctrl+S').onClick(() => toast.info('保存'));
          }),
          `vMenu(m => {
  m.item('新建').shortcut('Ctrl+N')
  m.item('查找').shortcut('Ctrl+F')
  m.item('保存').shortcut('Ctrl+S')
})`
        ),
      ]));

      // 下拉菜单
      content.child(docSection('dropdown', '下拉菜单', [
        vCard(c => {
          c.vCardHeader('下拉菜单演示');
          c.vCardBody(demo => {
            demo.child(flex(row => {
              row.gap('16px');

              // 基础下拉菜单
              row.child(vDropdownMenu(d => {
                d.trigger('下拉菜单 ▼');
                d.menuContent(vMenu(m => {
                  m.item('📋 选项 1').onClick(() => toast.info('选项 1'));
                  m.item('📁 选项 2').onClick(() => toast.info('选项 2'));
                  m.divider();
                  m.item('⚙️ 设置').onClick(() => toast.info('设置'));
                }));
                d.closeOnClickOutside();
              }));

              // 带图标的下拉菜单
              row.child(vDropdownMenu(d => {
                d.trigger('更多操作 ▼');
                d.menuContent(vMenu(m => {
                  m.item('✏️ 编辑').onClick(() => toast.info('编辑'));
                  m.item('📤 分享').onClick(() => toast.info('分享'));
                  m.divider();
                  m.item('🗑️ 删除').danger().onClick(() => toast.error('删除'));
                }));
                d.closeOnClickOutside();
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
                { name: 'vMenu', desc: '菜单容器', props: 'vertical() / horizontal()' },
                { name: 'vMenuItem', desc: '菜单项', props: 'text, shortcut, onClick, active, disabled, danger' },
                { name: 'vMenuDivider', desc: '分割线', props: '-' },
                { name: 'vMenuGroup', desc: '菜单分组', props: 'label(分组标题)' },
                { name: 'vDropdownMenu', desc: '下拉菜单', props: 'trigger, menuContent, closeOnClickOutside' },
                { name: 'vContextMenu', desc: '右键菜单', props: 'menuContent, target(绑定元素)' },
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
        links.child(tocItem('基础菜单', '#basic'));
        links.child(tocItem('分割线', '#divider'));
        links.child(tocItem('菜单分组', '#group'));
        links.child(tocItem('项状态', '#state'));
        links.child(tocItem('快捷键', '#shortcut'));
        links.child(tocItem('下拉菜单', '#dropdown'));
        links.child(tocItem('API', '#api'));
      }));
    },
  });
}
