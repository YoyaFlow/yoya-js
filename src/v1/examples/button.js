/**
 * Yoya.Basic V1 - Button Demo Page
 * Button 按钮演示页面 - 使用统一布局
 */

import {
  flex, vstack, card, cardHeader, cardBody,
  menu, menuItem, vButton, vCode, toast,
} from '../../yoya/index.js';

import { appLayout, sidebarGroup, sidebarItem, tocItem, docSection, codeDemo } from './layout.js';

/**
 * 创建 Button 演示页面
 */
export function createButtonPage() {
  return appLayout({
    // 左侧菜单
    sidebar: (sidebar) => {
      sidebar.child(sidebarGroup('开始', [
        sidebarItem('介绍', 'index.html'),
        sidebarItem('快速开始', 'quickstart.html'),
      ]));
      sidebar.child(sidebarGroup('基础组件', [
        sidebarItem('Button 按钮', 'button.html', true),
        sidebarItem('Form 表单', 'form.html'),
        sidebarItem('Card 卡片', 'card.html'),
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

        header.child(menuItem('Button 按钮', h1 => {
          h1.styles({ fontSize: '28px', fontWeight: '700', color: 'var(--islands-text, #333)' });
        }));

        header.child(menuItem('按钮用于触发一个操作。支持多种类型、尺寸、状态，以及加载效果。', desc => {
          desc.styles({ fontSize: '15px', lineHeight: '1.7', color: 'var(--islands-text-secondary, #666)' });
        }));
      }));

      // 基础用法
      content.child(docSection('basic', '基础用法', [
        codeDemo('基础按钮',
          flex(row => {
            row.gap('12px');
            row.child(vButton(b => b.text('默认')));
            row.child(vButton(b => { b.text('主要'); b.type('primary'); }));
            row.child(vButton(b => { b.text('成功'); b.type('success'); }));
            row.child(vButton(b => { b.text('警告'); b.type('warning'); }));
            row.child(vButton(b => { b.text('危险'); b.type('danger'); }));
          }),
          `vButton(btn => btn.text('默认'))
vButton(btn => { btn.text('主要'); btn.type('primary') })
vButton(btn => { btn.text('成功'); btn.type('success') })`
        ),

        codeDemo('Ghost 幽灵按钮',
          flex(row => {
            row.gap('12px');
            row.child(vButton(b => { b.text('默认'); b.ghost(); }));
            row.child(vButton(b => { b.text('主要'); b.type('primary'); b.ghost(); }));
            row.child(vButton(b => { b.text('成功'); b.type('success'); b.ghost(); }));
            row.child(vButton(b => { b.text('警告'); b.type('warning'); b.ghost(); }));
            row.child(vButton(b => { b.text('危险'); b.type('danger'); b.ghost(); }));
          }),
          `vButton(btn => { btn.text('默认'); btn.ghost() })
vButton(btn => { btn.text('主要'); btn.type('primary'); btn.ghost() })`
        ),
      ]));

      // 尺寸
      content.child(docSection('size', '按钮尺寸', [
        codeDemo('不同尺寸',
          flex(row => {
            row.gap('12px');
            row.child(vButton(b => { b.text('Large'); b.type('primary'); b.size('large'); }));
            row.child(vButton(b => { b.text('Default'); b.type('primary'); }));
            row.child(vButton(b => { b.text('Small'); b.type('primary'); b.size('small'); }));
          }),
          `vButton(btn => { btn.text('Large'); btn.size('large') })
vButton(btn => btn.text('Default'))
vButton(btn => { btn.text('Small'); btn.size('small') })`
        ),
      ]));

      // 状态
      content.child(docSection('state', '按钮状态', [
        codeDemo('加载状态',
          flex(row => {
            row.gap('12px');
            row.child(vButton(b => { b.text('加载中...'); b.loading(); }));
            row.child(vButton(b => {
              b.text('点击加载');
              b.type('primary');
              b.on('click', function() {
                const btn = this;
                btn.loading(true);
                setTimeout(() => {
                  btn.loading(false);
                  toast.success('操作成功！');
                }, 2000);
              });
            }));
          }),
          `vButton(btn => { btn.text('加载中...'); btn.loading() })

vButton(btn => {
  btn.text('点击加载')
  btn.type('primary')
  btn.onclick(() => {
    btn.loading(true)
    setTimeout(() => {
      btn.loading(false)
      toast.success('操作成功！')
    }, 2000)
  })
})`
        ),

        codeDemo('禁用状态',
          flex(row => {
            row.gap('12px');
            row.child(vButton(b => { b.text('默认禁用'); b.disabled(); }));
            row.child(vButton(b => { b.text('主要禁用'); b.type('primary'); b.disabled(); }));
            row.child(vButton(b => { b.text('幽灵禁用'); b.ghost(); b.disabled(); }));
          }),
          `vButton(btn => { btn.text('禁用'); btn.disabled() })
vButton(btn => { btn.text('主要禁用'); btn.type('primary'); btn.disabled() })`
        ),
      ]));

      // API
      content.child(docSection('api', 'API', [
        card(c => {
          c.cardBody(api => {
            api.child(menu(apiMenu => {
              apiMenu.vertical();

              const apiItems = [
                { name: 'type', desc: '按钮类型', type: 'primary | success | warning | danger | default', default: 'default' },
                { name: 'size', desc: '按钮尺寸', type: 'large | default | small', default: 'default' },
                { name: 'disabled', desc: '是否禁用', type: 'boolean', default: 'false' },
                { name: 'loading', desc: '是否加载中', type: 'boolean', default: 'false' },
                { name: 'ghost', desc: '是否幽灵按钮', type: 'boolean', default: 'false' },
                { name: 'block', desc: '是否块级按钮', type: 'boolean', default: 'false' },
              ];

              apiItems.forEach(item => {
                apiMenu.item(it => {
                  it.child(flex(apiRow => {
                    apiRow.justifyBetween();
                    apiRow.styles({ width: '100%', padding: '8px 0' });
                    apiRow.child(menuItem(item.name, name => {
                      name.styles({ fontFamily: 'monospace', fontSize: '13px', color: 'var(--islands-primary, #667eea)', fontWeight: '500', width: '100px' });
                    }));
                    apiRow.child(menuItem(item.desc, desc => {
                      desc.styles({ color: 'var(--islands-text-secondary, #666)', flex: 1 });
                    }));
                    apiRow.child(menuItem(item.type, type => {
                      type.styles({ fontFamily: 'monospace', fontSize: '12px', color: '#999' });
                    }));
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
      toc.child(menuItem('本页目录', title => {
        title.styles({ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--islands-text, #333)' });
      }));
      toc.child(vstack(links => {
        links.gap('4px');
        links.child(tocItem('基础用法', '#basic'));
        links.child(tocItem('按钮尺寸', '#size'));
        links.child(tocItem('按钮状态', '#state'));
        links.child(tocItem('API', '#api'));
      }));
    },
  });
}
