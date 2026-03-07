/**
 * Yoya.Basic V2 - Table Demo Page
 */

import { vstack } from '../../../../yoya/index.js';
import { vTable, vThead, vTbody, vTr, vTh, vTd, toast } from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

/**
 * 创建 Table 演示页面
 */
export function createTablePage() {
  const tocItems = [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '带表头表尾', href: '#header', level: 1 },
    { text: '表格状态', href: '#state', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'table.html',
    tocItems,
    content: (content) => {
      content.child(PageHeader({
        title: 'Table 表格',
        description: '表格组件用于展示行列数据，支持边框、斑马纹、悬停等样式。',
      }));

      content.child(DocSection('basic', '基础用法', [
        CodeDemo('基础表格',
          vTable(t => {
            t.child(vTbody(tbody => {
              for (let i = 0; i < 3; i++) {
                tbody.child(vTr(tr => {
                  tr.child(vTd('数据' + (i * 3 + 1)));
                  tr.child(vTd('数据' + (i * 3 + 2)));
                  tr.child(vTd('数据' + (i * 3 + 3)));
                }));
              }
            }));
          }),
          `vTable(t => {
  t.child(vTbody(tbody => {
    tbody.child(vTr(tr => {
      tr.child(vTd('数据 1'))
      tr.child(vTd('数据 2'))
      tr.child(vTd('数据 3'))
    }))
  }))
})`
        ),
      ]));

      content.child(DocSection('header', '带表头表尾', [
        CodeDemo('完整表格（表头 + 表体 + 表尾）',
          vTable(t => {
            t.child(vThead(thead => {
              thead.child(vTr(tr => {
                tr.child(vTh('姓名'));
                tr.child(vTh('邮箱'));
                tr.child(vTh('手机'));
              }));
            }));
            t.child(vTbody(tbody => {
              const data = [
                { name: '张三', email: 'zhangsan@example.com', phone: '138****1234' },
                { name: '李四', email: 'lisi@example.com', phone: '139****5678' },
                { name: '王五', email: 'wangwu@example.com', phone: '137****9012' },
              ];
              data.forEach(item => {
                tbody.child(vTr(tr => {
                  tr.child(vTd(item.name));
                  tr.child(vTd(item.email));
                  tr.child(vTd(item.phone));
                }));
              });
            }));
            t.child(vTfoot(tfoot => {
              tfoot.child(vTr(tr => {
                tr.child(vTd('共 3 条'));
                tr.child(vTd(''));
                tr.child(vTd(''));
              }));
            }));
          }),
          `vTable(t => {
  t.child(vThead(thead => {
    thead.child(vTr(tr => {
      tr.child(vTh('姓名'))
      tr.child(vTh('邮箱'))
      tr.child(vTh('手机'))
    }))
  }))
  t.child(vTbody(tbody => {
    // 数据行...
  }))
  t.child(vTfoot(tfoot => {
    tfoot.child(vTr(tr => {
      tr.child(vTd('共 3 条'))
    }))
  }))
})`
        ),
      ]));

      content.child(DocSection('state', '表格状态', [
        CodeDemo('带边框、斑马纹、悬停效果',
          vTable(t => {
            t.bordered();
            t.striped();
            t.hoverable();
            t.child(vThead(thead => {
              thead.child(vTr(tr => {
                tr.child(vTh('产品'));
                tr.child(vTh('价格'));
                tr.child(vTh('库存'));
                tr.child(vTh('状态'));
              }));
            }));
            t.child(vTbody(tbody => {
              const products = [
                { name: 'iPhone 15', price: '¥7999', stock: '有货', status: '在售' },
                { name: 'MacBook Pro', price: '¥12999', stock: '有货', status: '在售' },
                { name: 'AirPods Pro', price: '¥1899', stock: '缺货', status: '停售' },
                { name: 'iPad Air', price: '¥4799', stock: '有货', status: '在售' },
                { name: 'Apple Watch', price: '¥2999', stock: '预售', status: '在售' },
              ];
              products.forEach(p => {
                tbody.child(vTr(tr => {
                  tr.child(vTd(p.name));
                  tr.child(vTd(p.price));
                  tr.child(vTd(p.stock));
                  tr.child(vTd(p.status));
                }));
              });
            }));
          }),
          `vTable(t => {
  t.bordered()    // 边框
  t.striped()     // 斑马纹
  t.hoverable()   // 悬停效果

  t.child(vThead(...))
  t.child(vTbody(...))
})`
        ),

        CodeDemo('紧凑模式',
          vTable(t => {
            t.bordered();
            t.compact();
            t.child(vThead(thead => {
              thead.child(vTr(tr => {
                tr.child(vTh('项目'));
                tr.child(vTh('值'));
              }));
            }));
            t.child(vTbody(tbody => {
              for (let i = 1; i <= 8; i++) {
                tbody.child(vTr(tr => {
                  tr.child(vTd('项目' + i));
                  tr.child(vTd('值' + i));
                }));
              }
            }));
          }),
          `vTable(t => {
  t.bordered()
  t.compact()  // 紧凑模式
  // ...
})`
        ),
      ]));

      content.child(DocSection('api', 'API', [
        ApiTable([
          { name: 'bordered', desc: '显示边框', type: 'boolean' },
          { name: 'striped', desc: '斑马纹（隔行变色）', type: 'boolean' },
          { name: 'hoverable', desc: '悬停高亮', type: 'boolean' },
          { name: 'compact', desc: '紧凑模式（减小间距）', type: 'boolean' },
        ]),
      ]));
    },
  });
}
