/**
 * Yoya.Basic V2 - VPager 分页导航演示页面
 * 展示分页导航组件的各种用法和主题适配
 */

import {
  div, span, vstack, hstack, grid, responsiveGrid,
  vCard, vCardHeader, vCardBody, toast,
  vPager, vButton, h3
} from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';

/**
 * 创建基础分页演示
 */
function createBasicPager() {
  return vCard(card => {
    card.vCardHeader('📄 基础分页');
    card.vCardBody(content => {
      content.styles({ display: 'flex', flexDirection: 'column', gap: '16px' });

      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '100px', fontSize: '14px', color: 'var(--yoya-text-secondary)' });
          label.text('基础用法：');
        });
        row.child(vPager(p => {
          p.total(125);
          p.pageSize(10);
          p.current(1);
          p.onChange((page, info) => {
            toast.info(`第 ${page} 页 / 共 ${info.totalPage} 页`);
          });
        }));
      });
    });
  });
}

/**
 * 创建带总记录数的分页
 */
function createPagerWithTotal() {
  return vCard(card => {
    card.vCardHeader('📊 显示总记录数');
    card.vCardBody(content => {
      content.styles({ display: 'flex', flexDirection: 'column', gap: '16px' });

      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '100px', fontSize: '14px', color: 'var(--yoya-text-secondary)' });
          label.text('带总数：');
        });
        row.child(vPager(p => {
          p.total(256);
          p.pageSize(20);
          p.current(3);
          p.showTotal(true);
          p.onChange((page) => {
            toast.info(`切换到第 ${page} 页`);
          });
        }));
      });
    });
  });
}

/**
 * 创建带快速跳转的分页
 */
function createPagerWithJumper() {
  return vCard(card => {
    card.vCardHeader('⚡ 快速跳转');
    card.vCardBody(content => {
      content.styles({ display: 'flex', flexDirection: 'column', gap: '16px' });

      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '100px', fontSize: '14px', color: 'var(--yoya-text-secondary)' });
          label.text('带跳转：');
        });
        row.child(vPager(p => {
          p.total(500);
          p.pageSize(50);
          p.current(1);
          p.showTotal(true);
          p.showQuickJumper(true);
          p.onChange((page) => {
            toast.info(`切换到第 ${page} 页`);
          });
        }));
      });
    });
  });
}

/**
 * 创建简洁模式分页
 */
function createSimplePager() {
  return vCard(card => {
    card.vCardHeader(' 简洁模式');
    card.vCardBody(content => {
      content.styles({ display: 'flex', flexDirection: 'column', gap: '16px' });

      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '100px', fontSize: '14px', color: 'var(--yoya-text-secondary)' });
          label.text('简洁模式：');
        });
        row.child(vPager(p => {
          p.total(1000);
          p.pageSize(10);
          p.current(5);
          p.simple(true);
          p.onChange((page) => {
            toast.info(`切换到第 ${page} 页`);
          });
        }));
      });
    });
  });
}

/**
 * 创建小数据量分页
 */
function createSmallDataPager() {
  return vCard(card => {
    card.vCardHeader('📝 小数据量');
    card.vCardBody(content => {
      content.styles({ display: 'flex', flexDirection: 'column', gap: '16px' });

      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '100px', fontSize: '14px', color: 'var(--yoya-text-secondary)' });
          label.text('少于 7 页：');
        });
        row.child(vPager(p => {
          p.total(45);
          p.pageSize(10);
          p.current(2);
          p.onChange((page) => {
            toast.info(`切换到第 ${page} 页`);
          });
        }));
      });
    });
  });
}

/**
 * 创建禁用状态分页
 */
function createDisabledPager() {
  return vCard(card => {
    card.vCardHeader('🚫 禁用状态');
    card.vCardBody(content => {
      content.styles({ display: 'flex', flexDirection: 'column', gap: '16px' });

      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        row.span(label => {
          label.styles({ width: '100px', fontSize: '14px', color: 'var(--yoya-text-secondary)' });
          label.text('禁用状态：');
        });
        row.child(vPager(p => {
          p.total(100);
          p.current(5);
          p.disabled(true);
        }));
      });
    });
  });
}

/**
 * 创建主题切换演示
 */
function createThemeDemo() {
  return vCard(card => {
    card.vCardHeader('🎨 主题适配');
    card.vCardBody(content => {
      content.styles({ display: 'flex', flexDirection: 'column', gap: '16px' });

      content.div(info => {
        info.styles({
          padding: '12px',
          background: 'var(--yoya-bg-secondary)',
          borderRadius: '4px',
          marginBottom: '16px',
        });
        info.child(div(msg => {
          msg.styles({ fontSize: '13px', color: 'var(--yoya-text-secondary)', marginBottom: '8px' });
          msg.text('VPager 组件使用 CSS 变量实现主题适配：');
        }));
        info.child(div(code => {
          code.styles({ fontSize: '11px', fontFamily: 'monospace', color: 'var(--yoya-text)' });
          code.text('--yoya-pager-bg: 背景色\n--yoya-pager-border: 边框色\n--yoya-pager-color: 文字色');
        }));
      });

      content.div(row => {
        row.styles({ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' });
        row.span(label => {
          label.styles({ fontSize: '14px', color: 'var(--yoya-text-secondary)' });
          label.text('当前主题下的分页效果：');
        });
        row.child(vPager(p => {
          p.total(158);
          p.pageSize(10);
          p.current(4);
          p.showTotal(true);
          p.onChange((page) => {
            toast.info(`第 ${page} 页`);
          });
        }));
      });
    });
  });
}

/**
 * 创建实际应用场景演示
 */
function createScenarios() {
  return vCard(card => {
    card.vCardHeader('💼 实际应用场景');
    card.vCardBody(content => {
      content.styles({ display: 'flex', flexDirection: 'column', gap: '20px' });

      // 表格分页
      content.div(form => {
        form.styles({
          border: '1px solid var(--yoya-border)',
          borderRadius: '8px',
          padding: '16px',
          background: 'var(--yoya-bg-secondary)',
        });

        form.div(title => {
          title.styles({ fontSize: '14px', fontWeight: '600', marginBottom: '12px' });
          title.text('📋 用户列表');
        });

        // 模拟表格内容
        form.div(table => {
          table.styles({
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '16px',
          });

          const headers = ['ID', '用户名', '邮箱', '状态'];
          table.child(thead => {
            thead.styles({ background: 'var(--yoya-bg)' });
            headers.forEach(header => {
              thead.child(th => {
                th.styles({
                  padding: '8px 12px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'var(--yoya-text-secondary)',
                  borderBottom: '1px solid var(--yoya-border)',
                });
                th.text(header);
              });
            });
          });

          // 模拟数据行
          for (let i = 31; i <= 40; i++) {
            table.child(tr => {
              tr.child(td => {
                td.styles({ padding: '8px 12px', fontSize: '13px', borderBottom: '1px solid var(--yoya-border)' });
                td.text(String(i));
              });
              tr.child(td => {
                td.styles({ padding: '8px 12px', fontSize: '13px', borderBottom: '1px solid var(--yoya-border)' });
                td.text(`user${i}`);
              });
              tr.child(td => {
                td.styles({ padding: '8px 12px', fontSize: '13px', borderBottom: '1px solid var(--yoya-border)' });
                td.text(`user${i}@example.com`);
              });
              tr.child(td => {
                td.styles({ padding: '8px 12px', fontSize: '13px', borderBottom: '1px solid var(--yoya-border)' });
                td.child(span(s => {
                  s.styles({
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    background: 'var(--yoya-success)',
                    color: '#fff',
                  });
                  s.text('活跃');
                }));
              });
            });
          }
        });

        // 分页
        form.child(vPager(p => {
          p.total(158);
          p.pageSize(10);
          p.current(4);
          p.showTotal(true);
          p.onChange((page) => {
            toast.info(`加载第 ${page} 页数据...`);
          });
        }));
      });
    });
  });
}

/**
 * 创建代码示例部分
 */
function createCodeExamples() {
  return DocSection('pager-usage', '代码示例', [
    CodeDemo('基础分页',
      div(example => {
        example.child(vPager(p => {
          p.total(100);
          p.onChange((page) => {
            console.log('切换到第', page, '页');
          });
        }));
      }),
      `// 基础分页
import { vPager } from 'yoya-basic';

vPager(p => {
  p.total(100);        // 总记录数
  p.pageSize(10);      // 每页显示数量
  p.current(1);        // 当前页码
  p.onChange((page, info) => {
    console.log('切换到第', page, '页');
    console.log('分页信息:', info);
    // info: { current, pageSize, total, totalPage }
  });
});`
    ),

    CodeDemo('显示总记录数',
      div(example => {
        example.child(vPager(p => {
          p.total(256);
          p.showTotal(true);
        }));
      }),
      `// 显示总记录数
vPager(p => {
  p.total(256);
  p.pageSize(20);
  p.showTotal(true);   // 显示"共 xxx 条"
  p.onChange((page) => {
    console.log('切换到第', page, '页');
  });
});`
    ),

    CodeDemo('带快速跳转',
      div(example => {
        example.child(vPager(p => {
          p.total(500);
          p.showTotal(true);
          p.showQuickJumper(true);
        }));
      }),
      `// 带快速跳转
vPager(p => {
  p.total(500);
  p.pageSize(50);
  p.showTotal(true);        // 显示总记录数
  p.showQuickJumper(true);  // 显示跳转输入框
  p.onChange((page) => {
    console.log('切换到第', page, '页');
  });
});`
    ),

    CodeDemo('简洁模式',
      div(example => {
        example.child(vPager(p => {
          p.total(1000);
          p.simple(true);
        }));
      }),
      `// 简洁模式（只显示当前页/总页数）
vPager(p => {
  p.total(1000);
  p.simple(true);   // 简洁模式，显示"5 / 100"
  p.onChange((page) => {
    console.log('切换到第', page, '页');
  });
});`
    ),

    CodeDemo('链式调用',
      div(example => {
        example.child(vPager(p => {
          p.total(100)
            .pageSize(20)
            .current(3)
            .showTotal(true)
            .showQuickJumper(true)
            .onChange((page) => {
              console.log('切换到第', page, '页');
            });
        }));
      }),
      `// 链式调用
vPager(p => {
  p.total(100)
    .pageSize(20)
    .current(3)
    .showTotal(true)
    .showQuickJumper(true)
    .onChange((page, info) => {
      console.log('当前页:', page);
      console.log('分页信息:', info);
    });
});`
    ),

    CodeDemo('API 方法',
      div(example => {
        example.styles({ fontSize: '12px', color: 'var(--yoya-text-secondary)' });
        example.text('完整 API 请参考源码');
      }),
      `// VPager API 方法
const pager = vPager();

// 设置方法
pager.total(100);       // 设置总记录数
pager.pageSize(10);     // 设置每页数量
pager.current(5);       // 设置当前页
pager.showTotal(true);  // 显示总记录数
pager.showQuickJumper(true); // 显示快速跳转
pager.simple(true);     // 简洁模式
pager.disabled(true);   // 禁用状态

// 获取方法
const total = pager.getTotal();      // 获取总记录数
const pageSize = pager.getPageSize(); // 获取每页数量
const current = pager.getCurrent();   // 获取当前页
const totalPage = pager.getTotalPage();// 获取总页数

// 事件
pager.onChange((page, info) => {
  // page: 当前页码
  // info: { current, pageSize, total, totalPage }
});`
    ),
  ]);
}

/**
 * 创建 VPager 页面
 */
export function createVPagerPage() {
  const tocItems = [
    { text: '基础分页', href: '#basic', level: 1 },
    { text: '显示总数', href: '#with-total', level: 1 },
    { text: '快速跳转', href: '#with-jumper', level: 1 },
    { text: '简洁模式', href: '#simple', level: 1 },
    { text: '禁用状态', href: '#disabled', level: 1 },
    { text: '主题适配', href: '#theme', level: 1 },
    { text: '应用场景', href: '#scenarios', level: 1 },
    { text: '代码示例', href: '#pager-usage', level: 1 },
  ];

  return AppShell({
    currentPage: 'pager.html',
    tocItems,
    content: (content) => {
      content.child(PageHeader({
        title: 'VPager 分页导航',
        description: '支持页码显示、上一页/下一页、快速跳转等功能，适配浅色/深色主题',
      }));

      // 基础分页
      content.div(section => {
        section.id('basic');
        section.styles({ marginBottom: '24px' });
        section.h2(h2 => {
          h2.styles({ fontSize: '18px', fontWeight: '600', marginBottom: '16px' });
          h2.text('📄 基础分页');
        });
        section.child(createBasicPager());
      });

      // 显示总记录数
      content.div(section => {
        section.id('with-total');
        section.styles({ marginBottom: '24px' });
        section.h2(h2 => {
          h2.styles({ fontSize: '18px', fontWeight: '600', marginBottom: '16px' });
          h2.text('📊 显示总记录数');
        });
        section.child(createPagerWithTotal());
      });

      // 快速跳转
      content.div(section => {
        section.id('with-jumper');
        section.styles({ marginBottom: '24px' });
        section.h2(h2 => {
          h2.styles({ fontSize: '18px', fontWeight: '600', marginBottom: '16px' });
          h2.text('⚡ 快速跳转');
        });
        section.child(createPagerWithJumper());
      });

      // 简洁模式和小数据量
      content.div(section => {
        section.id('simple');
        section.styles({ marginBottom: '24px' });
        section.h2(h2 => {
          h2.styles({ fontSize: '18px', fontWeight: '600', marginBottom: '16px' });
          h2.text('🎯 简洁模式与小数据');
        });
        section.child(responsiveGrid(grid => {
          grid.minSize('300px');
          grid.gap('16px');
          grid.child(createSimplePager());
          grid.child(createSmallDataPager());
        }));
      });

      // 禁用状态
      content.div(section => {
        section.id('disabled');
        section.styles({ marginBottom: '24px' });
        section.h2(h2 => {
          h2.styles({ fontSize: '18px', fontWeight: '600', marginBottom: '16px' });
          h2.text('🚫 禁用状态');
        });
        section.child(createDisabledPager());
      });

      // 主题适配
      content.div(section => {
        section.id('theme');
        section.styles({ marginBottom: '24px' });
        section.h2(h2 => {
          h2.styles({ fontSize: '18px', fontWeight: '600', marginBottom: '16px' });
          h2.text('🎨 主题适配');
        });
        section.child(createThemeDemo());
      });

      // 应用场景
      content.div(section => {
        section.id('scenarios');
        section.styles({ marginBottom: '24px' });
        section.h2(h2 => {
          h2.styles({ fontSize: '18px', fontWeight: '600', marginBottom: '16px' });
          h2.text('💼 应用场景');
        });
        section.child(createScenarios());
      });

      // 代码示例
      content.child(createCodeExamples());
    },
  });
}
