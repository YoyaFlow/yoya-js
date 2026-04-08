/**
 * Yoya.Basic V2 - VStatistic Demo Page
 * VStatistic 统计数值组件演示
 */

import {
  flex,
  vstack,
  vCard,
  vCardHeader,
  vCardBody,
  vStatistic,
  vBox,
  vButton,
  toast,
} from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

/**
 * 创建 VStatistic 演示页面
 */
export function createStatisticPage() {
  const tocItems = [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '格式化数字', href: '#format', level: 1 },
    { text: '前缀和后缀', href: '#prefix-suffix', level: 1 },
    { text: '数值动画', href: '#animation', level: 1 },
    { text: '数据看板', href: '#dashboard', level: 1 },
    { text: 'API 参考', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'statistic.html',
    tocItems,
    content: (content) => {
      // 页面标题
      content.child(PageHeader({
        title: 'VStatistic 统计数值组件',
        description: '用于展示统计数值，支持数字格式化、前缀后缀、数值动画等功能。常用于数据看板、仪表盘等场景。',
      }));

      // ========== 基础用法 ==========
      content.child(DocSection('basic', '基础用法', [
        CodeDemo('基础统计',
          vStatistic(s => {
            s.title('总访问量');
            s.value(12345);
          }),
          `vStatistic(s => {
  s.title('总访问量')
  s.value(12345)
})`
        ),

        CodeDemo('多个统计项',
          flex(row => {
            row.gap('24px');
            row.child(vStatistic(s => {
              s.title('访问量');
              s.value(12345);
            }));
            row.child(vStatistic(s => {
              s.title('销售额');
              s.value(98765);
            }));
            row.child(vStatistic(s => {
              s.title('订单量');
              s.value(1234);
            }));
          }),
          `flex(row => {
  row.gap('24px')

  row.child(vStatistic(s => {
    s.title('访问量')
    s.value(12345)
  }))

  row.child(vStatistic(s => {
    s.title('销售额')
    s.value(98765)
  }))

  row.child(vStatistic(s => {
    s.title('订单量')
    s.value(1234)
  }))
})`
        ),
      ]));

      // ========== 格式化数字 ==========
      content.child(DocSection('format', '格式化数字', [
        CodeDemo('千分位分隔符',
          flex(row => {
            row.gap('24px');
            row.child(vStatistic(s => {
              s.title('人口数量');
              s.value(1412000000);
              s.separator(',');
            }));
            row.child(vStatistic(s => {
              s.title('GDP 总量');
              s.value(121000000000000);
              s.separator(',');
            }));
          }),
          `vStatistic(s => {
  s.title('人口数量')
  s.value(1412000000)
  s.separator(',')  // 千分位分隔符
})`
        ),

        CodeDemo('精度控制',
          flex(row => {
            row.gap('24px');
            row.child(vStatistic(s => {
              s.title('增长率');
              s.value(5.234567);
              s.precision(2);
              s.separator(',');
            }));
            row.child(vStatistic(s => {
              s.title('完成率');
              s.value(87.5678);
              s.precision(1);
            }));
          }),
          `// 保留 2 位小数
vStatistic(s => {
  s.title('增长率')
  s.value(5.234567)
  s.precision(2)
  s.separator(',')
})

// 保留 1 位小数
vStatistic(s => {
  s.title('完成率')
  s.value(87.5678)
  s.precision(1)
})`
        ),

        CodeDemo('自定义分隔符',
          flex(row => {
            row.gap('24px');
            row.child(vStatistic(s => {
              s.title('距离（米）');
              s.value(1234567);
              s.separator(' ');
            }));
            row.child(vStatistic(s => {
              s.title('积分');
              s.value(9876543);
              s.separator(',');
            }));
          }),
          `// 空格分隔
vStatistic(s => {
  s.title('距离（米）')
  s.value(1234567)
  s.separator(' ')
})`
        ),
      ]));

      // ========== 前缀和后缀 ==========
      content.child(DocSection('prefix-suffix', '前缀和后缀', [
        CodeDemo('货币符号',
          flex(row => {
            row.gap('24px');
            row.child(vStatistic(s => {
              s.title('月收入');
              s.value(125000);
              s.prefix('¥');
              s.separator(',');
            }));
            row.child(vStatistic(s => {
              s.title('美元收入');
              s.value(8500);
              s.prefix('$');
              s.separator(',');
            }));
          }),
          `vStatistic(s => {
  s.title('月收入')
  s.value(125000)
  s.prefix('¥')
  s.separator(',')
})`
        ),

        CodeDemo('单位后缀',
          flex(row => {
            row.gap('24px');
            row.child(vStatistic(s => {
              s.title('文件数量');
              s.value(1234);
              s.suffix('个');
              s.separator(',');
            }));
            row.child(vStatistic(s => {
              s.title('今日新增');
              s.value(567);
              s.suffix('条');
              s.separator(',');
            }));
          }),
          `vStatistic(s => {
  s.title('文件数量')
  s.value(1234)
  s.suffix('个')
  s.separator(',')
})`
        ),

        CodeDemo('百分比',
          flex(row => {
            row.gap('24px');
            row.child(vStatistic(s => {
              s.title('完成率');
              s.value(87.5);
              s.suffix('%');
              s.precision(1);
            }));
            row.child(vStatistic(s => {
              s.title('毛利率');
              s.value(42.3);
              s.suffix('%');
              s.precision(1);
            }));
          }),
          `vStatistic(s => {
  s.title('完成率')
  s.value(87.5)
  s.suffix('%')
  s.precision(1)
})`
        ),

        CodeDemo('前缀 + 后缀',
          vStatistic(s => {
            s.title('商品单价');
            s.value(199);
            s.prefix('¥');
            s.suffix('/件');
          }),
          `vStatistic(s => {
  s.title('商品单价')
  s.value(199)
  s.prefix('¥')
  s.suffix('/件')
})`
        ),
      ]));

      // ========== 数值动画 ==========
      content.child(DocSection('animation', '数值动画', [
        CodeDemo('数字滚动动画',
          vstack(col => {
            col.gap('16px');
            col.child(vStatistic(stat => {
              stat.title('实时在线');
              stat.value(0);
              stat.animated(true);
              stat.duration(2000);
              stat.suffix('人');
            }));
            col.child(flex(actions => {
              actions.gap('12px');
              actions.child(vButton('触发动画', btn => {
                btn.type('primary');
                btn.on('click', () => {
                  const stat = col._children.find(c => c.hasClass('yoya-statistic'));
                  if (stat) {
                    stat.value(Math.floor(Math.random() * 10000) + 1000);
                  }
                });
              }));
            }));
          }),
          `const stat = vStatistic(s => {
  s.title('实时在线')
  s.value(0)
  s.animated(true)     // 启用动画
  s.duration(2000)     // 动画时长 2s
  s.suffix('人')
})

// 触发动画
stat.value(5000)`
        ),

        CodeDemo('慢速动画',
          vstack(col => {
            col.gap('16px');
            col.child(vStatistic(stat => {
              stat.title('累计访问');
              stat.value(0);
              stat.animated(true);
              stat.duration(3000);
              stat.separator(',');
            }));
            col.child(flex(actions => {
              actions.gap('12px');
              actions.child(vButton('触发动画', btn => {
                btn.type('primary');
                btn.on('click', () => {
                  const stat = col._children.find(c => c.hasClass('yoya-statistic'));
                  if (stat) {
                    stat.value(1234567);
                  }
                });
              }));
            }));
          }),
          `// 慢速动画（3 秒）
vStatistic(s => {
  s.title('累计访问')
  s.value(0)
  s.animated(true)
  s.duration(3000)
  s.separator(',')
})`
        ),
      ]));

      // ========== 数据看板示例 ==========
      content.child(DocSection('dashboard', '数据看板示例', [
        CodeDemo('数据卡片',
          flex(f => {
            f.gap('24px');
            f.wrap('wrap');

            // 卡片 1
            f.child(vBox(b => {
              b.style('flex', '1');
              b.style('minWidth', '200px');
              b.style('padding', '20px');
              b.child(vStatistic(s => {
                s.title('📊 总销售额');
                s.value(1234567.89);
                s.prefix('¥');
                s.precision(2);
                s.separator(',');
              }));
            }));

            // 卡片 2
            f.child(vBox(b => {
              b.style('flex', '1');
              b.style('minWidth', '200px');
              b.style('padding', '20px');
              b.child(vStatistic(s => {
                s.title('👥 新增用户');
                s.value(2850);
                s.suffix('人');
                s.separator(',');
              }));
            }));

            // 卡片 3
            f.child(vBox(b => {
              b.style('flex', '1');
              b.style('minWidth', '200px');
              b.style('padding', '20px');
              b.child(vStatistic(s => {
                s.title('📦 订单总数');
                s.value(15678);
                s.suffix('单');
                s.separator(',');
              }));
            }));

            // 卡片 4
            f.child(vBox(b => {
              b.style('flex', '1');
              b.style('minWidth', '200px');
              b.style('padding', '20px');
              b.child(vStatistic(s => {
                s.title('⭐ 好评率');
                s.value(98.5);
                s.suffix('%');
                s.precision(1);
              }));
            }));
          }),
          `flex(f => {
  f.gap('24px')
  f.flexWrap('wrap')

  // 卡片 1 - 销售额
  f.child(vBox(b => {
    b.style('flex', '1')
    b.style('minWidth', '200px')
    b.style('padding', '20px')
    b.child(vStatistic(s => {
      s.title('📊 总销售额')
      s.value(1234567.89)
      s.prefix('¥')
      s.precision(2)
      s.separator(',')
    }))
  }))

  // 卡片 2 - 用户
  f.child(vBox(b => {
    b.style('flex', '1')
    b.style('minWidth', '200px')
    b.style('padding', '20px')
    b.child(vStatistic(s => {
      s.title('👥 新增用户')
      s.value(2850)
      s.suffix('人')
      s.separator(',')
    }))
  }))

  // 卡片 3 - 订单
  f.child(vBox(b => {
    b.style('flex', '1')
    b.style('minWidth', '200px')
    b.style('padding', '20px')
    b.child(vStatistic(s => {
      s.title('📦 订单总数')
      s.value(15678)
      s.suffix('单')
      s.separator(',')
    }))
  }))

  // 卡片 4 - 好评率
  f.child(vBox(b => {
    b.style('flex', '1')
    b.style('minWidth', '200px')
    b.style('padding', '20px')
    b.child(vStatistic(s => {
      s.title('⭐ 好评率')
      s.value(98.5)
      s.suffix('%')
      s.precision(1)
    }))
  }))
})`
        ),
      ]));

      // ========== API 参考 ==========
      content.child(DocSection('api', 'API 参考', [
        ApiTable([
          {
            name: 'title(str)',
            desc: '设置统计项标题',
            type: 'string'
          },
          {
            name: 'value(num)',
            desc: '设置统计数值',
            type: 'number'
          },
          {
            name: 'prefix(str)',
            desc: '设置前缀（如货币符号）',
            type: 'string'
          },
          {
            name: 'suffix(str)',
            desc: '设置后缀（如单位、百分比）',
            type: 'string'
          },
          {
            name: 'separator(str)',
            desc: '设置数字分隔符',
            type: 'string, default: ","'
          },
          {
            name: 'precision(n)',
            desc: '设置小数位数',
            type: 'number'
          },
          {
            name: 'animated(bool)',
            desc: '是否启用数值动画',
            type: 'boolean'
          },
          {
            name: 'duration(ms)',
            desc: '动画时长（毫秒）',
            type: 'number, default: 2000'
          },
        ]),
      ]));
    },
  });
}
