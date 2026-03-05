/**
 * Yoya.Basic V1 - Button Demo Page
 * Button 按钮演示页面 - 使用统一布局
 */

import {
  flex, vstack, vCard, vCardBody,
  vMenu, vMenuItem, vButton, vCode, toast,
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

        // 页面标题 - 使用 layout.js 中的默认样式
        header.child(vMenuItem('Button 按钮'));
        header.child(vMenuItem('按钮用于触发一个操作。支持多种类型、尺寸、状态，以及加载效果。'));
      }));

      // 基础用法
      content.child(docSection('basic', '基础用法', [
        codeDemo('基础按钮',
          flex(row => {
            row.gap('12px');
            row.child(vButton('默认'));
            row.child(vButton('主要').type('primary'));
            row.child(vButton('成功').type('success'));
            row.child(vButton('警告').type('warning'));
            row.child(vButton('危险').type('danger'));
          }),
          `vButton('默认')
vButton('主要').type('primary')
vButton('成功').type('success')`
        ),

        codeDemo('Ghost 幽灵按钮',
          flex(row => {
            row.gap('12px');
            row.child(vButton('默认').ghost());
            row.child(vButton('主要').type('primary').ghost());
            row.child(vButton('成功').type('success').ghost());
            row.child(vButton('警告').type('warning').ghost());
            row.child(vButton('危险').type('danger').ghost());
          }),
          `vButton('默认').ghost()
vButton('主要').type('primary').ghost()`
        ),
      ]));

      // 尺寸
      content.child(docSection('size', '按钮尺寸', [
        codeDemo('不同尺寸',
          flex(row => {
            row.gap('12px');
            row.child(vButton('Large').type('primary').size('large'));
            row.child(vButton('Default').type('primary'));
            row.child(vButton('Small').type('primary').size('small'));
          }),
          `vButton('Large').type('primary').size('large')
vButton('Default').type('primary')
vButton('Small').type('primary').size('small')`
        ),
      ]));

      // 状态
      content.child(docSection('state', '按钮状态', [
        codeDemo('加载状态',
          flex(row => {
            row.gap('12px');
            row.child(vButton('加载中...').loading());
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
          `vButton('加载中...').loading()

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
            row.child(vButton('默认禁用').disabled());
            row.child(vButton('主要禁用').type('primary').disabled());
            row.child(vButton('幽灵禁用').ghost().disabled());
          }),
          `vButton('禁用').disabled()
vButton('主要禁用').type('primary').disabled()`
        ),
      ]));

      // API
      content.child(docSection('api', 'API', [
        vCard(c => {
          c.vCardBody(api => {
            api.child(vMenu(apiMenu => {
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
                    apiRow.child(vMenuItem(item.name));
                    apiRow.child(vMenuItem(item.desc));
                    apiRow.child(vMenuItem(item.type));
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
        links.child(tocItem('按钮尺寸', '#size'));
        links.child(tocItem('按钮状态', '#state'));
        links.child(tocItem('API', '#api'));
      }));
    },
  });
}
