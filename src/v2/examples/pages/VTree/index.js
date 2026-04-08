/**
 * Yoya.Basic V2 - VTree Demo Page
 */

import { vTree, vstack, hstack, flex, div, span, button, vCode } from '../../../../yoya/index.js';
import { toast } from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

/**
 * 创建 VTree 演示页面
 */
export function createVTreePage() {
  const tocItems = [
    { text: '基础树形', href: '#basic', level: 1 },
    { text: '展开/收起控制', href: '#control', level: 1 },
    { text: '复选框模式', href: '#checkable', level: 1 },
    { text: '单选模式', href: '#single', level: 1 },
    { text: '自定义节点', href: '#custom', level: 1 },
    { text: '禁用状态', href: '#disabled', level: 1 },
    { text: '事件处理', href: '#events', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'vtree.html',
    tocItems,
    content: (content) => {
      content.child(PageHeader({
        title: 'VTree 树形控件',
        description: '树形控件用于展示具有层级结构的数据，支持节点展开/收起、选中、复选框级联勾选等功能。',
      }));

      // ==================== 基础树形 ====================
      const basicTreeData = [
        {
          key: '0',
          title: '根节点',
          children: [
            {
              key: '1',
              title: '节点 1',
              children: [
                { key: '1-1', title: '节点 1-1' },
                { key: '1-2', title: '节点 1-2', children: [
                  { key: '1-2-1', title: '节点 1-2-1' },
                  { key: '1-2-2', title: '节点 1-2-2' }
                ]}
              ]
            },
            {
              key: '2',
              title: '节点 2',
              children: [
                { key: '2-1', title: '节点 2-1' },
                { key: '2-2', title: '节点 2-2' }
              ]
            },
            {
              key: '3',
              title: '节点 3',
              children: [
                { key: '3-1', title: '节点 3-1' },
                { key: '3-2', title: '节点 3-2' }
              ]
            }
          ]
        }
      ];

      content.child(DocSection('basic', '基础树形', [
        CodeDemo('基础树形结构',
          vTree(t => {
            t.data(basicTreeData);
            t.expandedKeys(['0', '1']);
          }),
          `const treeData = [
  {
    key: '0',
    title: '根节点',
    children: [
      {
        key: '1',
        title: '节点 1',
        children: [
          { key: '1-1', title: '节点 1-1' },
          { key: '1-2', title: '节点 1-2' }
        ]
      }
    ]
  }
];

vTree(t => {
  t.data(treeData);
  t.expandedKeys(['0', '1']);  // 默认展开的节点
})`
        ),
      ]));

      // ==================== 展开/收起控制 ====================
      let controlTreeInstance = null;
      const controlTreeData = [
        {
          key: 'a',
          title: '分类 A',
          children: [
            { key: 'a-1', title: '选项 A-1' },
            { key: 'a-2', title: '选项 A-2' },
            { key: 'a-3', title: '选项 A-3' }
          ]
        },
        {
          key: 'b',
          title: '分类 B',
          children: [
            { key: 'b-1', title: '选项 B-1' },
            { key: 'b-2', title: '选项 B-2' }
          ]
        },
        {
          key: 'c',
          title: '分类 C',
          children: [
            { key: 'c-1', title: '选项 C-1' },
            { key: 'c-2', title: '选项 C-2' }
          ]
        }
      ];

      const controlButtons = hstack(h => {
        h.gap('12px');
        h.child(button(b => {
          b.text('展开全部');
          b.type('primary');
          b.onClick(() => {
            if (controlTreeInstance) {
              controlTreeInstance.expandAll();
              toast.success('已展开全部节点');
            }
          });
        }));
        h.child(button(b => {
          b.text('收起全部');
          b.type('default');
          b.onClick(() => {
            if (controlTreeInstance) {
              controlTreeInstance.collapseAll();
              toast.info('已收起全部节点');
            }
          });
        }));
      });

      content.child(DocSection('control', '展开/收起控制', [
        CodeDemo('控制按钮',
          vstack(v => {
            v.gap('16px');
            v.child(controlButtons);
            v.child(vTree(t => {
              t.data(controlTreeData);
              t.expandedKeys(['a']);
              // 保存实例引用
              setTimeout(() => {
                controlTreeInstance = t;
              }, 0);
            }));
          }),
          `// 操作方法
tree.expandAll();    // 展开全部节点
tree.collapseAll();  // 收起全部节点

// 示例按钮
button(b => {
  b.text('展开全部');
  b.onClick(() => tree.expandAll());
});`
        ),
      ]));

      // ==================== 复选框模式 ====================
      const checkableTreeData = [
        {
          key: '0',
          title: '根节点',
          children: [
            {
              key: '1',
              title: '节点 1',
              children: [
                { key: '1-1', title: '节点 1-1' },
                { key: '1-2', title: '节点 1-2' },
                { key: '1-3', title: '节点 1-3' }
              ]
            },
            {
              key: '2',
              title: '节点 2',
              children: [
                { key: '2-1', title: '节点 2-1' },
                { key: '2-2', title: '节点 2-2' }
              ]
            }
          ]
        }
      ];

      content.child(DocSection('checkable', '复选框模式', [
        CodeDemo('支持级联勾选',
          vTree(t => {
            t.data(checkableTreeData);
            t.checkable(true);
            t.expandedKeys(['0', '1', '2']);
            t.onCheck((e) => {
              toast.success(`勾选：${e.node.title}`);
            });
          }),
          `vTree(t => {
  t.data(treeData);
  t.checkable(true);  // 启用复选框

  // 勾选事件
  t.onCheck((e) => {
    console.log('勾选的节点：', e.node);
    console.log('所有勾选的 keys:', e.checkedKeys);
  });
})`
        ),

        CodeDemo('获取勾选状态',
          (() => {
            let stateTree = null;
            let stateDisplayRef = null;
            let treeRef = null;

            const stateDisplay = div(d => {
              d.id('checkStateDisplay');
              d.styles({
                padding: '12px',
                background: '#f6ffed',
                borderRadius: '6px',
                fontSize: '0.9rem',
                marginBottom: '12px'
              });
              d.text('当前勾选节点：无');
              stateDisplayRef = d;
            });

            setTimeout(() => {
              const updateDisplay = () => {
                if (stateTree && stateDisplayRef) {
                  const keys = stateTree.checkedKeys();
                  stateDisplayRef.text('当前勾选节点：' + (keys.length > 0 ? keys.join(', ') : '无'));
                }
              };

              // 从组件引用获取树实例
              if (treeRef && treeRef._yoyaInstance) {
                stateTree = treeRef._yoyaInstance;
              }
              setTimeout(updateDisplay, 200);
            }, 300);

            return vstack(v => {
              v.id('checkableDemo');
              v.gap('12px');
              v.child(stateDisplay);
              v.child(vTree(t => {
                t.data(checkableTreeData);
                t.checkable(true);
                t.expandedKeys(['0']);
                // 保存树组件引用
                treeRef = t;
                t.onCheck(() => {
                  setTimeout(() => {
                    if (stateTree && stateDisplayRef) {
                      const keys = stateTree.checkedKeys();
                      stateDisplayRef.text('当前勾选节点：' + (keys.length > 0 ? keys.join(', ') : '无'));
                    }
                  }, 50);
                });
              }));
            });
          })(),
          `// 获取勾选的节点 keys
const checkedKeys = tree.checkedKeys();
console.log('已勾选：', checkedKeys);

// 设置勾选节点
tree.checkedKeys(['1-1', '1-2']);`
        ),
      ]));

      // ==================== 单选模式 ====================
      const singleTreeData = [
        {
          key: 'cat1',
          title: '分类一',
          children: [
            { key: 'opt1', title: '选项 A' },
            { key: 'opt2', title: '选项 B' },
            { key: 'opt3', title: '选项 C' }
          ]
        },
        {
          key: 'cat2',
          title: '分类二',
          children: [
            { key: 'opt4', title: '选项 D' },
            { key: 'opt5', title: '选项 E' }
          ]
        }
      ];

      content.child(DocSection('single', '单选模式', [
        CodeDemo('只能选中一个节点',
          vTree(t => {
            t.data(singleTreeData);
            t.singleSelectMode(true);
            t.onSelect((e) => {
              toast.info(`选中：${e.node.title}`);
            });
          }),
          `vTree(t => {
  t.data(treeData);
  t.singleSelectMode(true);  // 单选模式

  // 选中事件
  t.onSelect((e) => {
    console.log('选中的节点：', e.node);
  });
})`
        ),

        CodeDemo('获取选中状态',
          (() => {
            let selectTree = null;
            let selectDisplayRef = null;
            const selectDisplay = div(d => {
              d.id('selectStateDisplay');
              d.styles({
                padding: '12px',
                background: '#e6f7ff',
                borderRadius: '6px',
                fontSize: '0.9rem',
                marginBottom: '12px'
              });
              d.text('当前选中节点：无');
              selectDisplayRef = d;
            });

            return vstack(v => {
              v.gap('12px');
              v.child(selectDisplay);
              v.child(vTree(t => {
                t.data(singleTreeData);
                t.singleSelectMode(true);
                t.onSelect(() => {
                  setTimeout(() => {
                    const treeEl = v._el?.querySelector('.yoya-tree');
                    if (treeEl && treeEl._yoyaInstance) {
                      selectTree = treeEl._yoyaInstance;
                      const keys = selectTree.selectedKeys();
                      if (selectDisplayRef) {
                        selectDisplayRef.text('当前选中节点：' + (keys.length > 0 ? keys.join(', ') : '无'));
                      }
                    }
                  }, 50);
                });
              }));
            });
          })(),
          `// 获取选中的节点 keys
const selectedKeys = tree.selectedKeys();
console.log('已选中：', selectedKeys);

// 设置选中节点
tree.selectedKeys(['opt1']);`
        ),
      ]));

      // ==================== 自定义节点内容 ====================
      const customTreeData = [
        {
          key: 'custom-1',
          title: span(s => {
            s.styles({ display: 'inline-flex', alignItems: 'center', gap: '6px' });
            s.html('📁 文档库');
          })
        },
        {
          key: 'custom-2',
          title: span(s => {
            s.styles({ display: 'inline-flex', alignItems: 'center', gap: '6px' });
            s.html('🖼️ 图片集');
          }),
          children: [
            {
              key: 'custom-2-1',
              title: span(s => {
                s.styles({ display: 'inline-flex', alignItems: 'center', gap: '6px' });
                s.html('📷 照片');
              })
            },
            {
              key: 'custom-2-2',
              title: span(s => {
                s.styles({ display: 'inline-flex', alignItems: 'center', gap: '6px' });
                s.html('🎨 设计稿');
              })
            }
          ]
        },
        {
          key: 'custom-3',
          title: span(s => {
            s.styles({ display: 'inline-flex', alignItems: 'center', gap: '6px' });
            s.html('🎵 音频文件');
          })
        },
        {
          key: 'custom-4',
          title: span(s => {
            s.styles({ display: 'inline-flex', alignItems: 'center', gap: '6px' });
            s.html('🎬 视频文件');
          })
        }
      ];

      content.child(DocSection('custom', '自定义节点内容', [
        CodeDemo('带图标的节点',
          vTree(t => {
            t.data(customTreeData);
            t.expandedKeys(['custom-2']);
          }),
          `// 节点标题可以是任意 HTML 元素
const treeData = [
  {
    key: '1',
    title: span(s => {
      s.styles({ display: 'inline-flex', gap: '6px' });
      s.html('📁 文档库');
    })
  }
];

vTree(t => {
  t.data(treeData);
})`
        ),
      ]));

      // ==================== 禁用状态 ====================
      const disabledTreeData = [
        {
          key: 'normal',
          title: '正常节点',
          children: [
            { key: 'normal-1', title: '子节点 1' },
            { key: 'normal-2', title: '子节点 2' }
          ]
        },
        {
          key: 'disabled',
          title: '禁用节点',
          disabled: true,
          children: [
            { key: 'disabled-1', title: '禁用的子节点 1', disabled: true },
            { key: 'disabled-2', title: '禁用的子节点 2', disabled: true }
          ]
        },
        {
          key: 'partial',
          title: '部分禁用',
          children: [
            { key: 'partial-1', title: '正常' },
            { key: 'partial-2', title: '禁用', disabled: true }
          ]
        }
      ];

      content.child(DocSection('disabled', '禁用状态', [
        CodeDemo('节点禁用',
          vTree(t => {
            t.data(disabledTreeData);
            t.checkable(true);
            t.expandedKeys(['normal', 'disabled', 'partial']);
          }),
          `// 在节点数据中设置 disabled
const treeData = [
  {
    key: '1',
    title: '禁用节点',
    disabled: true  // 禁用此节点
  },
  {
    key: '2',
    title: '正常节点',
    children: [
      { key: '2-1', title: '禁用的子节点', disabled: true }
    ]
  }
];

// 禁用的节点无法点击或勾选`
        ),
      ]));

      // ==================== 事件处理 ====================
      const eventsTreeData = [
        {
          key: 'e1',
          title: '节点 1',
          children: [
            { key: 'e1-1', title: '节点 1-1' },
            { key: 'e1-2', title: '节点 1-2' }
          ]
        },
        {
          key: 'e2',
          title: '节点 2',
          children: [
            { key: 'e2-1', title: '节点 2-1' }
          ]
        }
      ];

      const eventLog = div(e => {
        e.id('eventLog');
        e.styles({
          padding: '12px',
          background: '#f5f5f5',
          borderRadius: '6px',
          fontSize: '0.85rem',
          fontFamily: 'Monaco, Consolas, monospace',
          maxHeight: '150px',
          overflowY: 'auto',
          marginBottom: '12px'
        });
        e.text('事件日志：');
      });

      content.child(DocSection('events', '事件处理', [
        CodeDemo('事件回调',
          (() => {
            // 使用组件方法更新日志，而不是直接操作 DOM
            const logEvent = (msg) => {
              if (eventLog) {
                const time = new Date().toLocaleTimeString();
                // 获取当前 HTML 内容并追加新日志
                const currentHtml = eventLog._el?.innerHTML || '事件日志：';
                eventLog.html(`${currentHtml}<div>[${time}] ${msg}</div>`);
                // 滚动到底部
                if (eventLog._el) {
                  eventLog._el.scrollTop = eventLog._el.scrollHeight;
                }
              }
            };

            return vstack(v => {
              v.gap('12px');
              v.child(eventLog);
              v.child(button(b => {
                b.text('清空日志');
                b.type('default');
                b.onClick(() => {
                  // 使用组件方法清空日志
                  if (eventLog) {
                    eventLog.html('事件日志：');
                  }
                });
              }));
              v.child(vTree(t => {
                t.data(eventsTreeData);
                t.checkable(true);
                t.expandedKeys(['e1', 'e2']);
                t.onSelect((e) => {
                  logEvent(` onSelect: ${e.node.title}`);
                });
                t.onCheck((e) => {
                  logEvent(` onCheck: ${e.node.title} (${e.checked ? '勾选' : '取消'})`);
                });
                t.onExpand((e) => {
                  logEvent(` onExpand: ${e.node.title} (${e.expandedKeys.includes(e.node.key) ? '展开' : '收起'})`);
                });
              }));
            });
          })(),
          `// 事件处理
vTree(t => {
  // 节点选中事件
  t.onSelect((e) => {
    console.log('选中节点:', e.node);
    console.log('所有选中的 keys:', e.selectedKeys);
  });

  // 节点勾选事件
  t.onCheck((e) => {
    console.log('勾选状态变化:', e.node);
    console.log('是否勾选:', e.checked);
    console.log('所有勾选的 keys:', e.checkedKeys);
  });

  // 节点展开/收起事件
  t.onExpand((e) => {
    console.log('展开状态变化:', e.node);
    console.log('所有展开的 keys:', e.expandedKeys);
  });
})`
        ),
      ]));

      // ==================== API ====================
      content.child(DocSection('api', 'API', [
        ApiTable([
          { name: 'data()', desc: '树形数据', type: 'Array' },
          { name: 'checkable()', desc: '是否显示复选框', type: 'boolean' },
          { name: 'singleSelectMode()', desc: '单选/多选模式', type: 'boolean' },
          { name: 'expandedKeys()', desc: '展开的节点 keys', type: 'Array' },
          { name: 'checkedKeys()', desc: '勾选的节点 keys', type: 'Array' },
          { name: 'selectedKeys()', desc: '选中的节点 keys', type: 'Array' },
          { name: 'indeterminateKeys()', desc: '半选的节点 keys', type: 'Array' },
          { name: 'expandAll()', desc: '展开全部节点', type: 'Function' },
          { name: 'collapseAll()', desc: '收起全部节点', type: 'Function' },
          { name: 'findNode(key)', desc: '查找节点', type: 'Function' },
          { name: 'getNodeState(key)', desc: '获取节点状态', type: 'Function' },
          { name: 'onSelect(fn)', desc: '节点选中事件', type: 'Function' },
          { name: 'onCheck(fn)', desc: '节点勾选事件', type: 'Function' },
          { name: 'onExpand(fn)', desc: '节点展开事件', type: 'Function' },
        ]),
      ]));

      // 事件对象格式说明
      content.child(DocSection('event-format', '事件对象格式', [
        vstack(v => {
          v.gap('16px');
          v.child(div(d => {
            d.styles({ marginBottom: '8px', fontWeight: '600' });
            d.text('onSelect 事件对象：');
          }));
          v.child(vCode(c => {
            c.content(`{
  event: Event,        // 原始事件对象
  node: Object,        // 节点数据
  selectedKeys: Array, // 所有选中的节点 keys
  target: VTree        // VTree 实例
}`);
            c.showLineNumbers(true);
          }));
          v.child(div(d => {
            d.styles({ marginBottom: '8px', marginTop: '16px', fontWeight: '600' });
            d.text('onCheck 事件对象：');
          }));
          v.child(vCode(c => {
            c.content(`{
  event: Event,        // 原始事件对象
  node: Object,        // 节点数据
  checked: boolean,    // 是否勾选
  checkedKeys: Array,  // 所有勾选的节点 keys
  target: VTree        // VTree 实例
}`);
            c.showLineNumbers(true);
          }));
          v.child(div(d => {
            d.styles({ marginBottom: '8px', marginTop: '16px', fontWeight: '600' });
            d.text('onExpand 事件对象：');
          }));
          v.child(vCode(c => {
            c.content(`{
  event: Event,         // 原始事件对象
  node: Object,         // 节点数据
  expandedKeys: Array,  // 所有展开的节点 keys
  target: VTree         // VTree 实例
}`);
            c.showLineNumbers(true);
          }));
        })
      ]));
    },
  });
}
