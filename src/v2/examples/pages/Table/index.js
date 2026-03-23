/**
 * Yoya.Basic V2 - Table 表格演示页面
 * 展示表格组件的各种功能和用法
 */

import {
  div, span, vstack, hstack, flex,
  vTable, vThead, vTbody, vTfoot, vTr, vTh, vTd,
  vButton, vInput, vSelect, vOption,
  toast
} from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

// 示例数据
const userData = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', phone: '138****1234', role: '管理员', status: 'active' },
  { id: 2, name: '李四', email: 'lisi@example.com', phone: '139****5678', role: '编辑', status: 'active' },
  { id: 3, name: '王五', email: 'wangwu@example.com', phone: '137****9012', role: '用户', status: 'inactive' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', phone: '136****3456', role: '用户', status: 'active' },
  { id: 5, name: '孙七', email: 'sunqi@example.com', phone: '135****7890', role: '编辑', status: 'banned' },
];

const productData = [
  { id: 101, name: 'iPhone 15 Pro', price: 7999, stock: 120, status: '在售' },
  { id: 102, name: 'MacBook Pro 14', price: 12999, stock: 45, status: '在售' },
  { id: 103, name: 'AirPods Pro 2', price: 1899, stock: 0, status: '缺货' },
  { id: 104, name: 'iPad Air 5', price: 4799, stock: 78, status: '在售' },
  { id: 105, name: 'Apple Watch S9', price: 2999, stock: 12, status: '预售' },
  { id: 106, name: 'HomePod mini', price: 749, stock: 200, status: '在售' },
];

/**
 * 创建状态徽章
 */
function createStatusBadge(status) {
  const config = {
    active: { bg: 'var(--yoya-success-bg)', color: 'var(--yoya-success)', text: '激活' },
    inactive: { bg: 'var(--yoya-warning-bg)', color: 'var(--yoya-warning)', text: '未激活' },
    banned: { bg: 'var(--yoya-error-bg)', color: 'var(--yoya-error)', text: '已禁用' },
    '在售': { bg: 'var(--yoya-success-bg)', color: 'var(--yoya-success)', text: '在售' },
    '缺货': { bg: 'var(--yoya-error-bg)', color: 'var(--yoya-error)', text: '缺货' },
    '预售': { bg: 'var(--yoya-warning-bg)', color: 'var(--yoya-warning)', text: '预售' },
  };
  const c = config[status] || config.active;

  return span(s => {
    s.styles({
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '500',
      background: c.bg,
      color: c.color,
    });
    s.text(c.text);
  });
}

/**
 * 创建操作按钮组
 */
function createActionButtons(rowId) {
  return div(actions => {
    actions.styles({ display: 'flex', gap: '8px' });

    actions.child(vButton(btn => {
      btn.type('default');
      btn.styles({ fontSize: '12px', padding: '4px 8px' });
      btn.text('编辑');
      btn.onClick(() => toast.info(`编辑：${rowId}`));
    }));

    actions.child(vButton(btn => {
      btn.type('danger');
      btn.styles({ fontSize: '12px', padding: '4px 8px' });
      btn.text('删除');
      btn.onClick(() => toast.success(`删除：${rowId}`));
    }));
  });
}

/**
 * 创建基础表格演示
 */
function createBasicTable() {
  return div(section => {
    section.child(vTable(t => {
      t.bordered();
      t.hoverable();

      t.child(vThead(thead => {
        thead.child(vTr(tr => {
          tr.child((() => { const th = vTh(); th.text('姓名'); return th; })());
          tr.child((() => { const th = vTh(); th.text('邮箱'); return th; })());
          tr.child((() => { const th = vTh(); th.text('手机'); return th; })());
          tr.child((() => { const th = vTh(); th.text('角色'); return th; })());
        }));
      }));

      t.child(vTbody(tbody => {
        userData.slice(0, 3).forEach(user => {
          tbody.child(vTr(tr => {
            tr.child((() => { const td = vTd(); td.text(user.name); return td; })());
            tr.child((() => { const td = vTd(); td.text(user.email); return td; })());
            tr.child((() => { const td = vTd(); td.text(user.phone); return td; })());
            tr.child((() => { const td = vTd(); td.text(user.role); return td; })());
          }));
        });
      }));
    }));
  });
}

/**
 * 创建完整功能表格
 */
function createFullFeaturedTable() {
  return div(wrapper => {
    // 工具栏
    wrapper.child(div(toolbar => {
      toolbar.styles({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--yoya-border)',
      });

      toolbar.div(left => {
        left.styles({ display: 'flex', gap: '12px', alignItems: 'center' });

        left.child(vInput(input => {
          input.type('text');
          input.placeholder('搜索用户...');
          input.styles({ width: '200px' });
        }));

        left.child(vSelect(select => {
          select.child(vOption('全部角色'));
          select.child(vOption('管理员'));
          select.child(vOption('编辑'));
          select.child(vOption('用户'));
        }));
      });

      toolbar.child(vButton('+ 添加用户')
        .type('primary')
        .onClick(() => toast.info('添加用户')));
    }));

    // 数据表格
    wrapper.child(vTable(t => {
      t.bordered();
      t.striped();
      t.hoverable();

      t.child(vThead(thead => {
        thead.child(vTr(tr => {
          const th1 = vTh();
          th1.text('ID');
          tr.child(th1);

          const th2 = vTh();
          th2.text('姓名');
          tr.child(th2);

          const th3 = vTh();
          th3.text('邮箱');
          tr.child(th3);

          const th4 = vTh();
          th4.text('角色');
          tr.child(th4);

          const th5 = vTh();
          th5.text('状态');
          tr.child(th5);

          const th6 = vTh();
          th6.text('操作');
          tr.child(th6);
        }));
      }));

      t.child(vTbody(tbody => {
        userData.forEach(user => {
          tbody.child(vTr(tr => {
            const idTd = vTd();
            idTd.text(String(user.id));
            tr.child(idTd);

            const nameTd = vTd();
            nameTd.text(user.name);
            tr.child(nameTd);

            const emailTd = vTd();
            emailTd.text(user.email);
            tr.child(emailTd);

            const roleTd = vTd();
            roleTd.text(user.role);
            tr.child(roleTd);

            const statusTd = vTd();
            statusTd.child(createStatusBadge(user.status));
            tr.child(statusTd);

            const actionTd = vTd();
            actionTd.child(createActionButtons(user.id));
            tr.child(actionTd);
          }));
        });
      }));

      t.child(vTfoot(tfoot => {
        tfoot.child(vTr(tr => {
          tr.child(vTd(td => {
            td.attr('colspan', 5);
            td.text('共 ' + userData.length + ' 条记录');
          }));
          tr.child(vTd(''));
        }));
      }));
    }));

    // 分页
    wrapper.child(div(pagination => {
      pagination.styles({
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: '16px',
        gap: '8px',
      });

      pagination.child(vButton('上一页').type('default').disabled(true));
      pagination.child(vButton('1').type('primary'));
      pagination.child(vButton('2').type('default'));
      pagination.child(vButton('3').type('default'));
      pagination.child(vButton('下一页').type('default'));
    }));
  });
}

/**
 * 创建产品表格（紧凑模式）
 */
function createProductTable() {
  return div(wrapper => {
    wrapper.child(vTable(t => {
      t.bordered();
      t.compact();
      t.hoverable();

      t.child(vThead(thead => {
        thead.child(vTr(tr => {
          tr.child((() => { const th = vTh(); th.text('ID'); return th; })());
          tr.child((() => { const th = vTh(); th.text('产品名称'); return th; })());
          tr.child((() => { const th = vTh(); th.text('价格'); return th; })());
          tr.child((() => { const th = vTh(); th.text('库存'); return th; })());
          tr.child((() => { const th = vTh(); th.text('状态'); return th; })());
        }));
      }));

      t.child(vTbody(tbody => {
        productData.forEach(product => {
          tbody.child(vTr(tr => {
            tr.child((() => { const td = vTd(); td.text(String(product.id)); return td; })());
            tr.child((() => { const td = vTd(); td.text(product.name); return td; })());
            tr.child(vTd('¥' + product.price.toLocaleString()));
            tr.child((() => { const td = vTd(); td.text(String(product.stock)); return td; })());
            tr.child((() => { const td = vTd(); td.child(createStatusBadge(product.status)); return td; })());
          }));
        });
      }));
    }));
  });
}

/**
 * 创建可排序表格
 */
function createSortableTable() {
  return div(wrapper => {
    let sortField = 'name';
    let sortAsc = true;

    // 排序函数
    function sortData(data, field) {
      return [...data].sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if (typeof aVal === 'string') {
          return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        return sortAsc ? aVal - bVal : bVal - aVal;
      });
    }

    // 表头单元格（可点击排序）
    function createSortableTh(label, field) {
      return vTh(th => {
        th.styles({ cursor: 'pointer', userSelect: 'none' });
        th.text(label);
        if (field === sortField) {
          th.child(span(s => {
            s.styles({ marginLeft: '4px', color: 'var(--yoya-primary)' });
            s.text(sortAsc ? '↑' : '↓');
          }));
        }
        th.on('click', () => {
          if (sortField === field) {
            sortAsc = !sortAsc;
          } else {
            sortField = field;
            sortAsc = true;
          }
          renderTable();
        });
      });
    }

    // 渲染表格
    function renderTable() {
      wrapper.innerHTML = '';

      wrapper.child(vTable(t => {
        t.bordered();
        t.hoverable();

        t.child(vThead(thead => {
          thead.child(vTr(tr => {
            tr.child(createSortableTh('ID', 'id'));
            tr.child(createSortableTh('产品名称', 'name'));
            tr.child(createSortableTh('价格', 'price'));
            tr.child(createSortableTh('库存', 'stock'));
            tr.child(createSortableTh('状态', 'status'));
          }));
        }));

        t.child(vTbody(tbody => {
          sortData(productData, sortField).forEach(product => {
            tbody.child(vTr(tr => {
              tr.child((() => { const td = vTd(); td.text(String(product.id)); return td; })());
              tr.child((() => { const td = vTd(); td.text(product.name); return td; })());
              tr.child(vTd('¥' + product.price.toLocaleString()));
              tr.child((() => { const td = vTd(); td.text(String(product.stock)); return td; })());
              tr.child((() => { const td = vTd(); td.child(createStatusBadge(product.status)); return td; })());
            }));
          });
        }));
      }));
    }

    renderTable();
  });
}

/**
 * 创建代码示例部分
 */
function createCodeExamples() {
  return DocSection('examples', '代码示例', [
    CodeDemo('基础表格',
      createBasicTable(),
      `vTable(t => {
  t.bordered()
  t.hoverable()

  t.child(vThead(thead => {
    thead.child(vTr(tr => {
      tr.child((() => { const th = vTh(); th.text('姓名'); return th; })())
      tr.child((() => { const th = vTh(); th.text('邮箱'); return th; })())
    }))
  }))

  t.child(vTbody(tbody => {
    tbody.child(vTr(tr => {
      tr.child((() => { const td = vTd(); td.text('张三'); return td; })())
      tr.child((() => { const td = vTd(); td.text('zhangsan@example.com'); return td; })())
    }))
  }))
})`
    ),

    CodeDemo('完整功能表格（带工具栏和分页）',
      createFullFeaturedTable(),
      `// 带工具栏和分页的完整表格
vTable(t => {
  t.bordered()
  t.striped()
  t.hoverable()

  t.child(vThead(...))   // 表头
  t.child(vTbody(...))   // 表体
  t.child(vTfoot(...))   // 表尾
})

// 分页组件
vButton('上一页').disabled(true)
vButton('1').type('primary')
vButton('2')
vButton('下一页')`
    ),

    CodeDemo('紧凑模式表格',
      createProductTable(),
      `vTable(t => {
  t.bordered()
  t.compact()     // 紧凑模式，减小行高
  t.hoverable()
  // ...
})`
    ),

    CodeDemo('可排序表格',
      div(d => d.text('点击表头进行排序 ↑↓')),
      `// 点击表头排序
const createSortableTh = (label, field) => {
  return vTh(th => {
    th.styles({ cursor: 'pointer' })
    th.text(label)
    th.on('click', () => {
      // 切换排序
    })
  })
}`
    ),
  ]);
}

/**
 * 创建首页内容
 */
export function createTablePage() {
  const tocItems = [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '完整功能', href: '#full', level: 1 },
    { text: '紧凑模式', href: '#compact', level: 1 },
    { text: '可排序', href: '#sortable', level: 1 },
    { text: '代码示例', href: '#examples', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'table.html',
    tocItems,
    content: (content) => {
      content.child(PageHeader({
        title: 'Table 表格',
        description: '表格组件用于展示行列数据，支持边框、斑马纹、悬停、紧凑等样式，可扩展工具栏、分页、排序等功能。',
      }));

      // 基础用法
      content.child(DocSection('basic', '基础用法', [
        CodeDemo('基础表格',
          createBasicTable(),
          `vTable(t => {
  t.child(vThead(thead => {
    thead.child(vTr(tr => {
      tr.child((() => { const th = vTh(); th.text('列 1'); return th; })())
      tr.child((() => { const th = vTh(); th.text('列 2'); return th; })())
    }))
  }))
  t.child(vTbody(tbody => {
    tbody.child(vTr(tr => {
      tr.child((() => { const td = vTd(); td.text('数据 1'); return td; })())
      tr.child((() => { const td = vTd(); td.text('数据 2'); return td; })())
    }))
  }))
})`
        ),
      ]));

      // 完整功能表格
      content.child(DocSection('full', '完整功能表格', [
        createFullFeaturedTable(),
      ]));

      // 紧凑模式
      content.child(DocSection('compact', '紧凑模式', [
        CodeDemo('紧凑模式表格（适合展示大量数据）',
          createProductTable(),
          `vTable(t => {
  t.compact()  // 紧凑模式
  // ...
})`
        ),
      ]));

      // 可排序表格
      content.child(DocSection('sortable', '可排序表格', [
        createSortableTable(),
      ]));

      // 代码示例
      content.child(createCodeExamples());

      // API
      content.child(DocSection('api', 'API', [
        ApiTable([
          { name: 'bordered()', desc: '显示边框', type: 'boolean', default: 'false' },
          { name: 'striped()', desc: '斑马纹（隔行变色）', type: 'boolean', default: 'false' },
          { name: 'hoverable()', desc: '悬停高亮', type: 'boolean', default: 'false' },
          { name: 'compact()', desc: '紧凑模式（减小行高）', type: 'boolean', default: 'false' },
          { name: 'child()', desc: '添加子元素（Thead/Tbody/Tfoot）', type: 'Tag', default: '-' },
        ]),
      ]));

      // 子组件 API
      content.child(DocSection('sub-components', '子组件', [
        ApiTable([
          { name: 'vThead', desc: '表格头部容器', type: 'Component' },
          { name: 'vTbody', desc: '表格主体容器', type: 'Component' },
          { name: 'vTfoot', desc: '表格尾部容器', type: 'Component' },
          { name: 'vTr', desc: '表格行', type: 'Component' },
          { name: 'vTh', desc: '表头单元格', type: 'Component' },
          { name: 'vTd', desc: '数据单元格', type: 'Component' },
        ]),
      ]));
    },
  });
}
