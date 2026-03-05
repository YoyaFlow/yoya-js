/**
 * Yoya.Basic V1 - Button Demo Page
 * Button 按钮演示页面 - 演示 setup 三种方式
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
      ]));
      sidebar.child(sidebarGroup('基础组件', [
        sidebarItem('Button 按钮', 'button.html', true),
        sidebarItem('Form 表单', 'form.html'),
        sidebarItem('Card 卡片', 'card.html'),
      ]));
      sidebar.child(sidebarGroup('导航组件', [
        sidebarItem('Menu 菜单', 'menu.html'),
      ]));
    },

    // 中间内容
    content: (content) => {
      // 页面标题
      content.child(vstack(header => {
        header.gap('8px');
        header.child(vMenuItem('Button 按钮'));
        header.child(vMenuItem('按钮用于触发一个操作。支持多种类型、尺寸、状态，以及加载效果。'));
      }));

      // setup 三种方式
      content.child(docSection('setup', 'setup 三种方式', [
        codeDemo('setupString - 简洁文本',
          flex(row => {
            row.gap('12px');
            row.child(vButton('默认'));
            row.child(vButton('主要').type('primary'));
            row.child(vButton('成功').type('success'));
          }),
          `// ✅ 推荐：文本直接用字符串
vButton('默认')
vButton('主要').type('primary')`
        ),

        codeDemo('setupObject - 对象配置',
          flex(row => {
            row.gap('12px');
            row.child(vButton({
              class: 'btn-custom',
              onclick: () => toast.info('对象方式'),
            }, '对象配置'));
            row.child(vButton({
              style: { padding: '12px 24px' },
              onclick: () => toast.success('大按钮'),
            }, '大按钮'));
          }),
          `// ✅ 推荐：简单配置用对象
vButton({
  class: 'btn-custom',
  onclick: () => toast('点击')
}, '按钮')`
        ),

        codeDemo('setupFunction + 链式调用（最常用）',
          flex(row => {
            row.gap('12px');
            row.child(vButton(b => {
              b.text('链式 1');
              b.type('primary');
              b.size('large');
              b.onClick(() => toast('点击 1'));
            }));
            row.child(vButton('链式 2')
              .type('success')
              .ghost()
              .onClick(() => toast('点击 2')));
          }),
          `// ✅ 推荐：复杂逻辑用函数 + 链式
vButton(b => {
  b.text('按钮')
  b.type('primary')
  b.onClick(() => toast('点击'))
})

// 或更简洁的链式
vButton('按钮')
  .type('primary')
  .onClick(() => toast('点击'))`
        ),
      ]));

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

vButton(b => {
  b.text('点击加载')
  b.type('primary')
  b.on('click', () => { ... })
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
                { name: 'type', desc: '按钮类型', type: 'primary | success | warning | danger | default' },
                { name: 'size', desc: '按钮尺寸', type: 'large | default | small' },
                { name: 'disabled', desc: '是否禁用', type: 'boolean' },
                { name: 'loading', desc: '是否加载中', type: 'boolean' },
                { name: 'ghost', desc: '是否幽灵按钮', type: 'boolean' },
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
        links.child(tocItem('setup 三种方式', '#setup'));
        links.child(tocItem('基础用法', '#basic'));
        links.child(tocItem('按钮尺寸', '#size'));
        links.child(tocItem('按钮状态', '#state'));
        links.child(tocItem('API', '#api'));
      }));
    },
  });
}
