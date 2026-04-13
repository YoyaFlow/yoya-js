/**
 * Yoya.Basic V2 - Button Demo Page
 */

import { flex, vstack, vCard, vCardBody, vButton, vMenu, vMenuItem, toast } from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

/**
 * 创建 Button 演示页面
 */
export function createButtonPage() {
  const tocItems = [
    { text: 'setup 三种方式', href: '#setup', level: 1 },
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '按钮尺寸', href: '#size', level: 1 },
    { text: '按钮状态', href: '#state', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'button.html',
    tocItems,
    content: (content) => {
      // 页面标题
      content.child(PageHeader({
        title: 'Button 按钮',
        description: '按钮用于触发一个操作。支持多种类型、尺寸、状态，以及加载效果。',
      }));

      // setup 三种方式
      content.child(DocSection('setup', 'setup 三种方式', [
        CodeDemo('setupString - 简洁文本',
          flex(row => {
            row.gap('12px');
            row.child(vButton('默认'));
            row.child(vButton('主要').type('primary'));
            row.child(vButton('成功').type('success'));
          }),
          `// ✅ 推荐：文本直接用字符串
vButton('默认')
vButton('主要').type('primary')
vButton('成功').type('success')`
        ),

        CodeDemo('setupObject - 对象配置',
          flex(row => {
            row.gap('12px');
            row.child(vButton('对象配置', {
              onClick: () => toast('对象方式'),
            }));
            row.child(vButton('点击按钮', {
              onClick: () => toast('点击按钮'),
            }));
          }),
          `// ✅ 推荐：简单配置用对象
vButton('对象配置', {
  onClick: () => toast('点击')
})`
        ),

        CodeDemo('setupFunction + 链式调用（最常用）',
          flex(row => {
            row.gap('12px');
            row.child(vButton(b => {
              b.text('链式 1');
              b.type('primary');
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
      content.child(DocSection('basic', '基础用法', [
        CodeDemo('基础按钮',
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

        CodeDemo('Ghost 幽灵按钮',
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
      content.child(DocSection('size', '按钮尺寸', [
        CodeDemo('不同尺寸',
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
      content.child(DocSection('state', '按钮状态', [
        CodeDemo('加载状态',
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

        CodeDemo('禁用状态',
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
      content.child(DocSection('api', 'API', [
        ApiTable([
          { name: 'type', desc: '按钮类型', type: 'primary | success | warning | danger | default' },
          { name: 'size', desc: '按钮尺寸', type: 'large | default | small' },
          { name: 'disabled', desc: '是否禁用', type: 'boolean' },
          { name: 'loading', desc: '是否加载中', type: 'boolean' },
          { name: 'ghost', desc: '是否幽灵按钮', type: 'boolean' },
        ]),
      ]));
    },
  });
}
