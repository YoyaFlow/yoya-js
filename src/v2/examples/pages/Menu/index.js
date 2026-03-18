/**
 * Yoya.Basic V2 - Menu Demo Page
 */

import { flex, vstack, hstack } from '../../../../yoya/index.js';
import { vMenu, vMenuItem, vMenuDivider, vMenuGroup, vSubMenu, vDropdownMenu, vButton, toast, vSidebar } from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

/**
 * 创建 Menu 演示页面
 */
export function createMenuPage() {
  const tocItems = [
    { text: 'setup 三种方式', href: '#setup', level: 1 },
    { text: '基础菜单', href: '#basic', level: 1 },
    { text: '分割线', href: '#divider', level: 1 },
    { text: '菜单分组', href: '#group', level: 1 },
    { text: '子菜单', href: '#submenu', level: 1 },
    { text: '项状态', href: '#state', level: 1 },
    { text: '下拉菜单', href: '#dropdown', level: 1 },
    { text: '侧边栏菜单', href: '#sidebar', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'menu.html',
    tocItems,
    content: (content) => {
      content.child(PageHeader({
        title: 'Menu 菜单',
        description: '菜单组件用于展示操作列表，支持垂直/水平布局、分组、下拉和右键菜单等功能。',
      }));

      content.child(DocSection('setup', 'setup 三种方式', [
        CodeDemo('setupString - 简单菜单项',
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

        CodeDemo('setupFunction + 链式调用',
          vMenu(m => {
            m.item(it => {
              it.text('📋 菜单项 1');
              it.active();
              it.onClick(() => toast.info('菜单项 1'));
            });
            m.item(it => {
              it.text('⚙️ 设置1')
              it.shortcut('Ctrl+S')
              it.onClick(() => toast.info('设置'));
            });
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

      content.child(DocSection('basic', '基础菜单', [
        CodeDemo('垂直菜单（默认）',
          vMenu(m => {
            m.item('📋 菜单项 1').onClick(() => toast.info('点击了菜单项 1'));
            m.item('📁 菜单项 2').onClick(() => toast.info('点击了菜单项 2'));
            m.item('⚙️ 设置').onClick(() => toast.info('点击了设置'));
          }),
          `vMenu(m => {
  m.item('菜单项 1').onClick(() => toast('点击'))
  m.item('菜单项 2').onClick(() => toast('点击'))
})`
        ),

        CodeDemo('水平菜单',
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

      content.child(DocSection('divider', '分割线', [
        CodeDemo('菜单分割线',
          vMenu(m => {
            m.item('📄 新建').onClick(() => toast.info('新建'));
            m.item('📂 打开').onClick(() => toast.info('打开'));
            m.divider();
            m.item('💾 保存').onClick(() => toast.info('保存'));
            m.item('🗑️ 删除').onClick(() => toast.info('删除'));
          }),
          `vMenu(m => {
  m.item('新建')
  m.item('打开')
  m.divider()
  m.item('保存')
})`
        ),
      ]));

      content.child(DocSection('group', '菜单分组', [
        CodeDemo('带分组的菜单',
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

      content.child(DocSection('submenu', '子菜单', [
        CodeDemo('可折叠子菜单',
          vMenu(m => {
            m.item('🏠 首页').active();
            m.submenu('📦 产品管理', sm => {
              sm.item('产品列表');
              sm.item('添加产品');
              sm.item('产品分类');
            });
            m.submenu('👥 用户管理', sm => {
              sm.item('用户列表');
              sm.item('添加用户');
              sm.item('角色权限');
            });
            m.item('⚙️ 系统设置');
          }),
          `vMenu(m => {
  m.item('首页').active()

  m.submenu('产品管理', sm => {
    sm.item('产品列表')
    sm.item('添加产品')
  })

  m.item('系统设置')
})`
        ),
      ]));

      content.child(DocSection('state', '菜单项状态', [
        CodeDemo('激活、禁用、危险状态',
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

      content.child(DocSection('dropdown', '下拉菜单', [
        CodeDemo('基础下拉菜单',
          vDropdownMenu(d => {
            d.trigger('下拉菜单');
            d.menuContent(vMenu(m => {
              m.item('📋 选项 1').onClick(() => toast.info('选项 1'));
              m.item('📁 选项 2').onClick(() => toast.info('选项 2'));
              m.divider();
              m.item('⚙️ 设置').onClick(() => toast.info('设置'));
            }));
            d.closeOnClickOutside();
          }),
          `vDropdownMenu(d => {
  d.trigger('下拉菜单')
  d.menuContent(vMenu(m => {
    m.item('选项 1')
    m.item('选项 2')
    m.divider()
    m.item('设置')
  }))
  d.closeOnClickOutside()
})`
        ),
      ]));

      content.child(DocSection('sidebar', '侧边栏菜单', [
        CodeDemo('基础侧边栏',
          vSidebar(sidebar => {
            sidebar.width('220px');
            sidebar.collapsedWidth('60px');
            sidebar.header(h => {
              h.styles({ fontWeight: '600', fontSize: '16px', color: 'var(--yoya-text-primary, #333)' });
              h.text('🏝️ Yoya.Basic');
            });
            sidebar.content(content => {
              content.item('🏠 首页', item => {
                item.active();
                item.onClick(() => toast.info('首页'));
              });
              content.item('📦 产品管理', item => {
                item.onClick(() => toast.info('产品管理'));
              });
              content.divider();
              content.item('👤 用户管理', item => {
                item.onClick(() => toast.info('用户管理'));
              });
              content.item('📊 数据统计', item => {
                item.onClick(() => toast.info('数据统计'));
              });
              content.divider();
              content.item('⚙️ 系统设置', item => {
                item.onClick(() => toast.info('系统设置'));
              });
            });
            sidebar.footer(footer => {
              footer.styles({ fontSize: '12px', color: 'var(--islands-text-secondary, #666)' });
              footer.text('© 2024 Yoya.Basic');
            });
          }),
          `vSidebar(sidebar => {
  sidebar.width('220px')
  sidebar.collapsedWidth('60px')

  sidebar.header(h => {
    h.text('🏝️ Yoya.Basic')
  })

  sidebar.content(content => {
    content.item('🏠 首页', item => {
      item.active()
      item.onClick(() => toast('首页'))
    })
    content.item('产品管理')
    content.divider()
    content.item('用户管理')
    content.item('系统设置')
  })

  sidebar.footer(f => {
    f.text('© 2024 Yoya.Basic')
  })
})`
        ),

        CodeDemo('带切换按钮的侧边栏',
          (() => {
            const sidebarEl = vSidebar(sidebar => {
              sidebar.width('220px');
              sidebar.collapsedWidth('60px');
              sidebar.header(h => {
                h.styles({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', color: 'var(--yoya-text-primary, #333)' });
                h.span('🏝️ Yoya');
                sidebar.showToggleBtn();
              });
              sidebar.content(content => {
                content.item('🏠 首页').active();
                content.item('📦 产品');
                content.item('⚙️ 设置');
              });
            });
            return vstack(s => {
              s.gap('16px');
              s.child(sidebarEl);
              s.child(vButton(btn => {
                btn.text('切换折叠');
                btn.type('primary');
                btn.onClick(() => sidebarEl.toggle());
              }));
            });
          })(),
          `vSidebar(sidebar => {
  sidebar.width('220px')
  sidebar.collapsedWidth('60px')

  sidebar.header(h => {
    h.span('🏝️ Yoya')
    sidebar.showToggleBtn() // 添加切换按钮
  })

  sidebar.content(c => {
    c.item('🏠 首页').active()
    c.item('📦 产品')
    c.item('⚙️ 设置')
  })
})

// 切换折叠状态
sidebar.toggle()`
        ),

        CodeDemo('深色模式侧边栏',
          vSidebar(sidebar => {
            sidebar.dark();
            sidebar.width('220px');
            sidebar.collapsedWidth('60px');
            sidebar.header(h => {
              h.styles({ fontWeight: '600', color: 'var(--yoya-text-primary, #333)' });
              h.text('🏝️ Yoya.Basic');
            });
            sidebar.content(content => {
              content.item('🏠 首页', item => {
                item.active();
                item.onClick(() => toast.info('首页'));
              });
              content.item('📦 产品管理');
              content.item('⚙️ 系统设置');
            });
          }),
          `vSidebar(sidebar => {
  sidebar.dark() // 深色模式
  sidebar.width('220px')
  sidebar.collapsedWidth('60px')

  sidebar.header(h => {
    h.text('🏝️ Yoya.Basic')
  })

  sidebar.content(c => {
    c.item('🏠 首页').active()
    c.item('产品管理')
    c.item('系统设置')
  })
})`
        ),
      ]));

      content.child(DocSection('api', 'API', [
        ApiTable([
          { name: 'vMenu', desc: '菜单容器', type: 'vertical() / horizontal()' },
          { name: 'vMenuItem', desc: '菜单项', type: 'text, shortcut, onClick, active, disabled, danger' },
          { name: 'vMenuDivider', desc: '分割线', type: '-' },
          { name: 'vMenuGroup', desc: '菜单分组', type: 'label(分组标题)' },
          { name: 'vSubMenu', desc: '子菜单', type: 'text, content' },
          { name: 'vDropdownMenu', desc: '下拉菜单', type: 'trigger, menuContent, closeOnClickOutside' },
          { name: 'vSidebar', desc: '侧边栏菜单', type: 'width, collapsedWidth, header, content, footer, toggle, collapse, expand, dark' },
        ]),
      ]));
    },
  });
}
