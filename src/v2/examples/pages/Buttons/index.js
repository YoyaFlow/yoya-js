/**
 * Yoya.Basic V2 - VButtons Demo Page
 * VButtons 按钮组演示页面
 */

import { flex, vstack, hstack, vCard, vCardBody, vButton, vButtons, toast, div, span } from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

/**
 * 创建 VButtons 演示页面
 */
export function createButtonsPage() {
  const tocItems = [
    { text: '配置化用法', href: '#config', level: 1 },
    { text: '统一 onClick', href: '#onclick', level: 1 },
    { text: '链式用法', href: '#chain', level: 1 },
    { text: '布局方式', href: '#layout', level: 1 },
    { text: '紧凑模式', href: '#compact', level: 1 },
    { text: '按钮尺寸', href: '#size', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'buttons.html',
    tocItems,
    content: (content) => {
      // 页面标题
      content.child(PageHeader({
        title: 'VButtons 按钮组',
        description: '按钮组组件用于紧凑排列多个按钮，支持配置化和链式两种用法。推荐使用配置化方式，代码更简洁。',
      }));

      // 配置化用法（推荐）
      content.child(DocSection('config', '配置化用法（推荐）', [
        CodeDemo('基础配置化',
          vButtons({
            items: ['取消', '确定'],
            onClick: (e, item) => {
              toast.info(`点击了：${item.name}`);
            }
          }),
          `// ✅ 推荐：配置化方式，代码最简洁
vButtons({
  items: ['取消', '确定'],
  onClick: (e, item) => {
    toast.info(item.name);
  }
});`
        ),

        CodeDemo('带类型的配置化',
          vButtons({
            items: [
              { name: '取消', label: '取消', type: 'default' },
              { name: '确定', label: '确定', type: 'primary' },
              { name: '保存', label: '保存', type: 'success' },
            ],
            onClick: (e, item) => {
              toast.success(`点击了：${item.label}`);
            }
          }),
          `vButtons({
  items: [
    { name: '取消', label: '取消', type: 'default' },
    { name: '确定', label: '确定', type: 'primary' },
    { name: '保存', label: '保存', type: 'success' },
  ],
  onClick: (e, item) => { ... }
});`
        ),
      ]));

      // 统一 onClick
      content.child(DocSection('onclick', '统一 onClick 处理', [
        CodeDemo('统一事件处理',
          vButtons({
            items: [
              { name: 'view', label: '查看', type: 'info' },
              { name: 'edit', label: '编辑', type: 'primary' },
              { name: 'delete', label: '删除', type: 'danger' },
            ],
            onClick: (e, item) => {
              if (item.name === 'delete') {
                toast.error('执行删除操作');
              } else if (item.name === 'edit') {
                toast.info('执行编辑操作');
              } else {
                toast.success(`执行 ${item.name} 操作`);
              }
            }
          }),
          `// 统一的 onClick 处理，根据 item.name 区分逻辑
vButtons({
  items: [
    { name: 'view', label: '查看', type: 'info' },
    { name: 'edit', label: '编辑', type: 'primary' },
    { name: 'delete', label: '删除', type: 'danger' },
  ],
  onClick: (e, item) => {
    switch(item.name) {
      case 'delete': ...
      case 'edit': ...
      default: ...
    }
  }
});`
        ),

        CodeDemo('单项 + 统一事件处理',
          vButtons({
            items: [
              {
                name: 'save',
                label: '保存',
                type: 'success',
                onClick: () => toast.success('单项保存')
              },
              { name: 'cancel', label: '取消', type: 'default' },
            ],
            onClick: (e, item) => {
              toast.info(`统一处理：${item.name}`);
            }
          }),
          `// 单项 onClick 和统一 onClick 都会执行
vButtons({
  items: [
    {
      name: 'save',
      label: '保存',
      onClick: () => {...} // 单项先执行
    },
    { name: 'cancel', label: '取消' },
  ],
  onClick: (e, item) => {...} // 统一后执行
});`
        ),
      ]));

      // 链式用法（兼容旧代码）
      content.child(DocSection('chain', '链式用法（兼容）', [
        CodeDemo('链式添加按钮',
          vButtons(box => {
            box.button('取消', b => b.type('default'));
            box.button('确定', b => b.type('primary'));
          }).onClick(() => toast.info('容器点击')),
          `// 链式用法，适合复杂场景
vButtons(box => {
  box.button('取消', b => b.type('default'));
  box.button('确定', b => b.type('primary'));
});`
        ),

        CodeDemo('竖向布局',
          vButtons(box => {
            box.vertical(true);
            box.button('编辑', b => b.type('primary'));
            box.button('删除', b => b.type('danger'));
            box.button('分享', b => b.type('info'));
          }),
          `vButtons(box => {
  box.vertical(true);
  box.button('编辑', b => b.type('primary'));
  box.button('删除', b => b.type('danger'));
});`
        ),
      ]));

      // 布局方式
      content.child(DocSection('layout', '布局方式', [
        CodeDemo('横向布局（默认）',
          vButtons({
            items: [
              { name: 'btn1', label: '按钮 1', type: 'primary' },
              { name: 'btn2', label: '按钮 2', type: 'success' },
              { name: 'btn3', label: '按钮 3', type: 'warning' },
            ]
          }),
          `// 默认就是横向
vButtons({
  items: [...]
});`
        ),

        CodeDemo('竖向布局',
          vButtons({
            items: [
              { name: 'op1', label: '操作 1', type: 'primary' },
              { name: 'op2', label: '操作 2', type: 'success' },
              { name: 'op3', label: '操作 3', type: 'info' },
              { name: 'op4', label: '操作 4', type: 'warning' },
            ],
            vertical: true
          }),
          `vButtons({
  items: [...],
  vertical: true  // 竖向排列
});`
        ),
      ]));

      // 紧凑模式
      content.child(DocSection('compact', '紧凑模式', [
        CodeDemo('默认间距',
          vButtons({
            items: [
              { name: 'btn1', label: '按钮 1', type: 'primary' },
              { name: 'btn2', label: '按钮 2', type: 'success' },
              { name: 'btn3', label: '按钮 3', type: 'warning' },
            ]
          }),
          `// 默认间距 8px
vButtons({
  items: [...]
});`
        ),

        CodeDemo('紧凑模式',
          vButtons({
            items: [
              { name: 'btn1', label: '按钮 1', type: 'primary' },
              { name: 'btn2', label: '按钮 2', type: 'success' },
              { name: 'btn3', label: '按钮 3', type: 'warning' },
            ],
            compact: true
          }),
          `// compact: true 间距 4px
vButtons({
  items: [...],
  compact: true
});`
        ),

        CodeDemo('自定义间距',
          vButtons({
            items: [
              { name: 'btn1', label: '按钮 1', type: 'primary' },
              { name: 'btn2', label: '按钮 2', type: 'success' },
              { name: 'btn3', label: '按钮 3', type: 'warning' },
            ],
            gap: '16px'
          }),
          `// 自定义间距
vButtons({
  items: [...],
  gap: '16px'  // 或者 '12px', '20px' 等
});`
        ),
      ]));

      // 按钮尺寸
      content.child(DocSection('size', '按钮尺寸', [
        CodeDemo('小尺寸',
          vButtons({
            items: [
              { name: 'btn1', label: '小按钮 1', type: 'primary' },
              { name: 'btn2', label: '小按钮 2', type: 'success' },
              { name: 'btn3', label: '小按钮 3', type: 'warning' },
            ],
            size: 'small'
          }),
          `// 小尺寸按钮组
vButtons({
  items: [...],
  size: 'small'  // 所有按钮都是小尺寸
});`
        ),

        CodeDemo('中尺寸（默认）',
          vButtons({
            items: [
              { name: 'btn1', label: '中按钮 1', type: 'primary' },
              { name: 'btn2', label: '中按钮 2', type: 'success' },
              { name: 'btn3', label: '中按钮 3', type: 'warning' },
            ]
          }),
          `// 默认中尺寸
vButtons({
  items: [...]
});`
        ),

        CodeDemo('大尺寸',
          vButtons({
            items: [
              { name: 'btn1', label: '大按钮 1', type: 'primary' },
              { name: 'btn2', label: '大按钮 2', type: 'success' },
              { name: 'btn3', label: '大按钮 3', type: 'warning' },
            ],
            size: 'large'
          }),
          `// 大尺寸按钮组
vButtons({
  items: [...],
  size: 'large'
});`
        ),

        CodeDemo('单个按钮不同尺寸',
          vButtons({
            items: [
              { name: 'btn1', label: '小按钮', type: 'primary', size: 'small' },
              { name: 'btn2', label: '中按钮', type: 'success', size: 'medium' },
              { name: 'btn3', label: '大按钮', type: 'warning', size: 'large' },
            ]
          }),
          `// 单个按钮可以覆盖统一尺寸
vButtons({
  items: [
    { name: 'btn1', size: 'small' },
    { name: 'btn2', size: 'medium' },
    { name: 'btn3', size: 'large' },
  ]
});`
        ),
      ]));

      // API
      content.child(DocSection('api', 'API', [
        ApiTable([
          { name: 'items', desc: '按钮项数组', type: 'Array<{name, label, type, onClick}>' },
          { name: 'onClick(e, item, index)', desc: '统一点击事件处理', type: 'Function' },
          { name: 'vertical', desc: '是否竖向布局', type: 'boolean' },
          { name: 'horizontal', desc: '是否横向布局（默认）', type: 'boolean' },
          { name: 'compact', desc: '是否紧凑模式', type: 'boolean' },
          { name: 'gap', desc: '自定义间距', type: 'string' },
          { name: 'size', desc: '按钮尺寸：small, medium, large', type: 'string' },
        ]),

        // 提示
        div(tip => {
          tip.styles({
            marginTop: '12px',
            padding: '12px 16px',
            background: 'var(--yoya-info-bg, #e6f7ff)',
            border: '1px solid var(--yoya-info-border, #91d5ff)',
            borderRadius: '8px',
          });
          tip.child(span(icon => {
            icon.styles({ marginRight: '8px' });
            icon.text('💡');
          }));
          tip.child(span(text => {
            text.styles({
              fontSize: '13px',
              color: 'var(--yoya-text-secondary, #666)',
            });
            text.text('提示：推荐使用配置化方式，代码更简洁。链式用法保留用于兼容旧代码。');
          }));
        })
      ]));
    },
  });
}
