/**
 * Yoya.Basic V2 - Interaction Components Demo Page
 * 交互组件演示页面
 */

import {
  flex,
  vstack,
  vCard,
  vCardHeader,
  vCardBody,
  vButton,
  vMenu,
  vTree,
  vTooltip,
  vPopover,
  vDropdown,
  vCollapse,
  vTreeSelect,
  span,
  div,
} from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

/**
 * 创建交互组件演示页面
 */
export function createInteractionPage() {
  const tocItems = [
    { text: 'VTooltip 文字提示', href: '#tooltip', level: 1 },
    { text: 'VPopover 弹出气泡', href: '#popover', level: 1 },
    { text: 'VDropdown 下拉菜单', href: '#dropdown', level: 1 },
    { text: 'VCollapse 折叠面板', href: '#collapse', level: 1 },
    { text: 'VTree 树形控件', href: '#tree', level: 1 },
    { text: 'VTreeSelect 树形选择', href: '#treeselect', level: 1 },
    { text: 'API 参考', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'interaction.html',
    tocItems,
    content: (content) => {
      // 页面标题
      content.child(PageHeader({
        title: '交互组件',
        description: '提供 Tooltip、Popover、Dropdown、Collapse、Tree、TreeSelect 等常用交互组件。',
      }));

      // ========== VTooltip ==========
      content.child(DocSection('tooltip', 'VTooltip 文字提示', [
        CodeDemo('基础用法',
          vTooltip(t => {
            t.title('这是一个文字提示');
            t.target(span(s => {
              s.text('悬停查看提示');
              s.style('padding', '8px 16px');
              s.style('background', 'var(--yoya-primary)');
              s.style('color', '#fff');
              s.style('borderRadius', '4px');
              s.style('cursor', 'pointer');
            }));
          }),
          `vTooltip(t => {
  t.title('这是一个文字提示')
  t.target(span(s => {
    s.text('悬停查看提示')
    s.style('padding', '8px 16px')
    s.style('background', 'var(--yoya-primary)')
    s.style('color', '#fff')
    s.style('borderRadius', '4px')
    s.style('cursor', 'pointer')
  }))
})`
        ),

        CodeDemo('不同方向',
          flex(f => {
            f.gap('12px');
            f.wrap('wrap');

            const placements = ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight', 'left', 'right'];
            placements.forEach(p => {
              f.child(vTooltip(t => {
                t.title(`${p} 方向`);
                t.placement(p);
                t.target(vButton(p, btn => {
                  btn.size('small');
                }));
              }));
            });
          }),
          `const placements = ['top', 'topLeft', 'topRight', 'bottom', 'bottomLeft', 'bottomRight', 'left', 'right']

flex(f => {
  f.gap('12px')
  f.flexWrap('wrap')

  placements.forEach(p => {
    f.child(vTooltip(t => {
      t.title(p + ' 方向')
      t.placement(p)
      t.target(vButton(p, btn => btn.size('small')))
    }))
  })
})`
        ),

        CodeDemo('Click 触发',
          vTooltip(t => {
            t.title('点击触发提示');
            t.trigger('click');
            t.target(span(s => {
              s.text('点击我');
              s.style('padding', '8px 16px');
              s.style('background', 'var(--yoya-primary)');
              s.style('color', '#fff');
              s.style('borderRadius', '4px');
              s.style('cursor', 'pointer');
            }));
          }),
          `vTooltip(t => {
  t.title('点击触发提示')
  t.trigger('click')  // hover | click | focus
  t.target(span(s => {
    s.text('点击我')
    s.style('padding', '8px 16px')
    s.style('background', 'var(--yoya-primary)')
    s.style('color', '#fff')
    s.style('borderRadius', '4px')
    s.style('cursor', 'pointer')
  }))
})`
        ),
      ]));

      // ========== VPopover ==========
      content.child(DocSection('popover', 'VPopover 弹出气泡', [
        CodeDemo('基础用法',
          vPopover(p => {
            p.title('提示标题');
            p.content(div(c => {
              c.text('这是弹出的内容，可以包含任意 HTML。');
            }));
            p.target(vButton('点击弹出', btn => {
              btn.type('primary');
            }));
          }),
          `vPopover(p => {
  p.title('提示标题')
  p.content(div(c => {
    c.text('这是弹出的内容')
  }))
  p.target(vButton('点击弹出', btn => btn.type('primary')))
})`
        ),

        CodeDemo('不同方向',
          flex(f => {
            f.gap('12px');
            f.wrap('wrap');

            const placements = ['top', 'bottom', 'left', 'right'];
            placements.forEach(p => {
              f.child(vPopover(pop => {
                pop.title(p + ' 方向');
                pop.content('这是内容');
                pop.placement(p);
                pop.target(vButton(p, btn => btn.size('small')));
              }));
            });
          }),
          `vPopover(pop => {
  pop.title('提示标题')
  pop.content('这是内容')
  pop.placement('top')  // top | bottom | left | right
  pop.target(vButton('点击弹出'))
})`
        ),
      ]));

      // ========== VDropdown ==========
      content.child(DocSection('dropdown', 'VDropdown 下拉菜单', [
        CodeDemo('基础下拉菜单',
          vDropdown(d => {
            d.trigger(vButton('下拉菜单', btn => {
              btn.type('primary');
            }));
            d.menu(vMenu(m => {
              m.item(it => {
                it.text('📋 选项 1');
                it.onclick(() => console.log('选项 1'));
              });
              m.item(it => {
                it.text('📁 选项 2');
                it.onclick(() => console.log('选项 2'));
              });
              m.divider();
              m.item(it => {
                it.text('⚙️ 设置');
                it.onclick(() => console.log('设置'));
              });
            }));
          }),
          `vDropdown(d => {
  d.trigger(vButton('下拉菜单', btn => btn.type('primary')))
  d.menu(vMenu(m => {
    m.item(it => {
      it.text('📋 选项 1')
      it.onclick(() => console.log('选项 1'))
    })
    m.item(it => {
      it.text('📁 选项 2')
      it.onclick(() => console.log('选项 2'))
    })
    m.divider()
    m.item(it => {
      it.text('⚙️ 设置')
      it.onclick(() => console.log('设置'))
    })
  }))
})`
        ),

        CodeDemo('可搜索下拉',
          vDropdown(d => {
            d.trigger(vButton('可搜索', btn => {
              btn.type('outline');
            }));
            d.searchable(true);
            d.menu(vMenu(m => {
              m.item(it => {
                it.text('北京');
              });
              m.item(it => {
                it.text('上海');
              });
              m.item(it => {
                it.text('广州');
              });
              m.item(it => {
                it.text('深圳');
              });
              m.item(it => {
                it.text('杭州');
              });
            }));
          }),
          `vDropdown(d => {
  d.trigger(vButton('可搜索'))
  d.searchable(true)  // 启用搜索
  d.menu(vMenu(m => {
    m.item(it => it.text('北京'))
    m.item(it => it.text('上海'))
    // ...
  }))
})`
        ),
      ]));

      // ========== VCollapse ==========
      content.child(DocSection('collapse', 'VCollapse 折叠面板', [
        CodeDemo('基础用法',
          vCollapse(c => {
            c.panel(p => {
              p.key = '1';
              p.header = '面板 1';
              p.content = div(content => {
                content.text('这是面板 1 的内容');
              });
            });
            c.panel(p => {
              p.key = '2';
              p.header = '面板 2';
              p.content = div(content => {
                content.text('这是面板 2 的内容');
              });
            });
            c.panel(p => {
              p.key = '3';
              p.header = '面板 3';
              p.content = div(content => {
                content.text('这是面板 3 的内容');
              });
            });
          }),
          `vCollapse(c => {
  c.panel(p => {
    p.key = '1'
    p.header = '面板 1'
    p.content = div(content => {
      content.text('这是面板 1 的内容')
    })
  })
  c.panel(p => {
    p.key = '2'
    p.header = '面板 2'
    p.content = div(content => {
      content.text('这是面板 2 的内容')
    })
  })
  c.panel(p => {
    p.key = '3'
    p.header = '面板 3'
    p.content = div(content => {
      content.text('这是面板 3 的内容')
    })
  })
})`
        ),

        CodeDemo('手风琴模式',
          vCollapse(c => {
            c.accordion(true);
            c.activeKey(['1']);
            c.panel(p => {
              p.key = '1';
              p.header = '面板 1';
              p.content = div(content => {
                content.text('手风琴模式：同时只能展开一个面板');
              });
            });
            c.panel(p => {
              p.key = '2';
              p.header = '面板 2';
              p.content = div(content => {
                content.text('点击其他面板会自动收起当前面板');
              });
            });
            c.panel(p => {
              p.key = '3';
              p.header = '面板 3';
              p.content = div(content => {
                content.text('这是面板 3 的内容');
              });
            });
          }),
          `vCollapse(c => {
  c.accordion(true)  // 手风琴模式
  c.activeKey(['1'])
  c.panel(p => {
    p.key = '1'
    p.header = '面板 1'
    p.content = '内容...'
  })
  // ...
})`
        ),
      ]));

      // ========== VTree ==========
      content.child(DocSection('tree', 'VTree 树形控件', [
        CodeDemo('基础用法',
          vTree(t => {
            t.data([
              {
                key: '1',
                title: '节点 1',
                children: [
                  { key: '1-1', title: '子节点 1-1' },
                  { key: '1-2', title: '子节点 1-2' },
                ],
              },
              {
                key: '2',
                title: '节点 2',
                children: [
                  { key: '2-1', title: '子节点 2-1' },
                  {
                    key: '2-2',
                    title: '子节点 2-2',
                    children: [
                      { key: '2-2-1', title: '子节点 2-2-1' },
                      { key: '2-2-2', title: '子节点 2-2-2' },
                    ],
                  },
                ],
              },
              {
                key: '3',
                title: '节点 3',
              },
            ]);
            t.checkable(false);
            t.expandedKeys(['1', '2']);
          }),
          `vTree(t => {
  t.data([
    {
      key: '1',
      title: '节点 1',
      children: [
        { key: '1-1', title: '子节点 1-1' },
        { key: '1-2', title: '子节点 1-2' },
      ],
    },
    // ...
  ])
  t.checkable(false)
  t.expandedKeys(['1', '2'])
})`
        ),

        CodeDemo('带复选框',
          vTree(t => {
            t.data([
              {
                key: '1',
                title: '节点 1',
                children: [
                  { key: '1-1', title: '子节点 1-1' },
                  { key: '1-2', title: '子节点 1-2' },
                ],
              },
              {
                key: '2',
                title: '节点 2',
                children: [
                  { key: '2-1', title: '子节点 2-1' },
                  { key: '2-2', title: '子节点 2-2' },
                ],
              },
            ]);
            t.checkable(true);
            t.multiple(true);
            t.checkedKeys(['1-1']);
            t.expandedKeys(['1', '2']);
          }),
          `vTree(t => {
  t.data([...])
  t.checkable(true)  // 显示复选框
  t.multiple(true)   // 多选模式
  t.checkedKeys(['1-1'])
})`
        ),
      ]));

      // ========== VTreeSelect ==========
      content.child(DocSection('treeselect', 'VTreeSelect 树形选择器', [
        CodeDemo('基础用法',
          vTreeSelect(ts => {
            ts.data([
              {
                key: '1',
                title: '节点 1',
                children: [
                  { key: '1-1', title: '子节点 1-1' },
                  { key: '1-2', title: '子节点 1-2' },
                ],
              },
              {
                key: '2',
                title: '节点 2',
                children: [
                  { key: '2-1', title: '子节点 2-1' },
                  { key: '2-2', title: '子节点 2-2' },
                ],
              },
              {
                key: '3',
                title: '节点 3',
              },
            ]);
            ts.placeholder('请选择节点');
            ts.width(250);
            ts.trigger(span(trigger => {
              trigger.text('请选择');
              trigger.style('padding', '8px 16px');
              trigger.style('border', '1px solid var(--yoya-border)');
              trigger.style('borderRadius', '4px');
              trigger.style('cursor', 'pointer');
              trigger.style('display', 'inline-block');
              trigger.style('minWidth', '200px');
            }));
          }),
          `vTreeSelect(ts => {
  ts.data([
    {
      key: '1',
      title: '节点 1',
      children: [...]
    },
    // ...
  ])
  ts.placeholder('请选择节点')
  ts.width(250)
  ts.trigger(span(trigger => {
    trigger.text('请选择')
    trigger.style('padding', '8px 16px')
    trigger.style('border', '1px solid var(--yoya-border)')
    trigger.style('borderRadius', '4px')
    trigger.style('cursor', 'pointer')
  }))
})`
        ),
      ]));

      // ========== API 参考 ==========
      content.child(DocSection('api', 'API 参考', [
        vCard(card => {
          card.vCardHeader('VTooltip API');
          card.vCardBody(div(body => {
            body.child(ApiTable([
              { name: 'title(str)', desc: '设置提示文字', type: 'string' },
              { name: 'target(el)', desc: '设置目标元素', type: 'element' },
              { name: 'placement(str)', desc: '提示位置', type: 'top|topLeft|topRight|bottom|bottomLeft|bottomRight|left|leftTop|leftBottom|right|rightTop|rightBottom' },
              { name: 'trigger(str)', desc: '触发方式', type: 'hover|click|focus' },
              { name: 'color(str)', desc: '自定义背景色', type: 'string' },
              { name: 'visible(bool)', desc: '控制显示/隐藏', type: 'boolean' },
              { name: 'onVisibleChange(fn)', desc: '显示状态变化回调', type: 'function' },
            ]));
          }));
        }),

        vCard(card => {
          card.vCardHeader('VPopover API');
          card.vCardBody(div(body => {
            body.child(ApiTable([
              { name: 'title(str)', desc: '设置标题', type: 'string' },
              { name: 'content(el)', desc: '设置内容', type: 'element' },
              { name: 'target(el)', desc: '设置目标元素', type: 'element' },
              { name: 'placement(str)', desc: '弹出位置', type: 'top|topLeft|topRight|bottom|bottomLeft|bottomRight|left|right' },
              { name: 'trigger(str)', desc: '触发方式', type: 'hover|click|focus|contextMenu' },
              { name: 'width(num)', desc: '弹窗宽度', type: 'number' },
              { name: 'overlayClassName(str)', desc: '弹窗类名', type: 'string' },
            ]));
          }));
        }),

        vCard(card => {
          card.vCardHeader('VDropdown API');
          card.vCardBody(div(body => {
            body.child(ApiTable([
              { name: 'trigger(el)', desc: '设置触发元素', type: 'element' },
              { name: 'menu(el)', desc: '设置菜单内容', type: 'element' },
              { name: 'placement(str)', desc: '下拉位置', type: 'bottomLeft|bottomRight|topLeft|topRight' },
              { name: 'triggerType(str)', desc: '触发方式', type: 'hover|click' },
              { name: 'multiple(bool)', desc: '是否多选', type: 'boolean' },
              { name: 'searchable(bool)', desc: '是否可搜索', type: 'boolean' },
              { name: 'onSelect(fn)', desc: '选择回调', type: 'function' },
            ]));
          }));
        }),

        vCard(card => {
          card.vCardHeader('VCollapse API');
          card.vCardBody(div(body => {
            body.child(ApiTable([
              { name: 'panel(obj)', desc: '添加面板', type: 'object' },
              { name: 'accordion(bool)', desc: '手风琴模式', type: 'boolean' },
              { name: 'activeKey(array)', desc: '当前激活的面板', type: 'array' },
              { name: 'onChange(fn)', desc: '面板切换回调', type: 'function' },
            ]));
          }));
        }),

        vCard(card => {
          card.vCardHeader('VTree API');
          card.vCardBody(div(body => {
            body.child(ApiTable([
              { name: 'data(array)', desc: '树形数据', type: 'array' },
              { name: 'checkable(bool)', desc: '显示复选框', type: 'boolean' },
              { name: 'multiple(bool)', desc: '多选模式', type: 'boolean' },
              { name: 'expandedKeys(array)', desc: '展开的节点', type: 'array' },
              { name: 'checkedKeys(array)', desc: '选中的节点', type: 'array' },
              { name: 'selectedKeys(array)', desc: '当前选中的节点', type: 'array' },
              { name: 'onExpand(fn)', desc: '展开回调', type: 'function' },
              { name: 'onCheck(fn)', desc: '复选回调', type: 'function' },
              { name: 'onSelect(fn)', desc: '选择回调', type: 'function' },
            ]));
          }));
        }),

        vCard(card => {
          card.vCardHeader('VTreeSelect API');
          card.vCardBody(div(body => {
            body.child(ApiTable([
              { name: 'data(array)', desc: '树形数据', type: 'array' },
              { name: 'trigger(el)', desc: '设置触发元素', type: 'element' },
              { name: 'placeholder(str)', desc: '占位文字', type: 'string' },
              { name: 'placement(str)', desc: '下拉位置', type: 'bottomLeft|bottomRight|topLeft|topRight' },
              { name: 'width(num)', desc: '下拉框宽度', type: 'number' },
              { name: 'onSelect(fn)', desc: '选择回调', type: 'function' },
              { name: 'onVisibleChange(fn)', desc: '显示状态变化回调', type: 'function' },
            ]));
          }));
        }),
      ]));
    },
  });
}
