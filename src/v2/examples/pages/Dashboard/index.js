/**
 * Yoya.Basic V2 - Dashboard Components Demo Page
 * Dashboard 大屏看板组件演示
 */

import {
  flex,
  vstack,
  hstack,
  grid,
  vCard,
  vCardHeader,
  vCardBody,
  vButton,
  toast,
  div,
  span,
} from '../../../../yoya/index.js';
import {
  vNumberScroll,
  vTrend,
  vGauge,
  vCircularProgress,
  vIndicator,
  vTimeSeries,
  vRankList,
  vDashboardGrid,
} from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

/**
 * 创建 Dashboard 演示页面
 */
export function createDashboardPage() {
  const tocItems = [
    { text: '数字滚动动画', href: '#number-scroll', level: 1 },
    { text: '趋势指示器', href: '#trend', level: 1 },
    { text: '仪表盘', href: '#gauge', level: 1 },
    { text: '环形进度条', href: '#circular-progress', level: 1 },
    { text: '指标卡', href: '#indicator', level: 1 },
    { text: '时间序列', href: '#time-series', level: 1 },
    { text: '排行榜', href: '#rank-list', level: 1 },
    { text: '看板栅格', href: '#dashboard-grid', level: 1 },
    { text: '综合示例', href: '#dashboard-demo', level: 1 },
    { text: 'API 参考', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'dashboard.html',
    tocItems,
    content: (content) => {
      // 页面标题
      content.child(PageHeader({
        title: 'Dashboard 大屏看板组件',
        description: '提供数据可视化大屏常用的展示组件，包括数字滚动、趋势指示器、仪表盘、指标卡等。',
      }));

      // ========== 数字滚动动画 ==========
      content.child(DocSection('number-scroll', '数字滚动动画', [
        CodeDemo('基础数字滚动',
          vNumberScroll(ns => {
            ns.value(12345);
            ns.fontSize('48px');
          }),
          `vNumberScroll(ns => {
  ns.value(12345)
  ns.fontSize('48px')
})`
        ),

        CodeDemo('带前缀和后缀',
          flex(row => {
            row.gap('32px');
            row.child(vNumberScroll(ns => {
              ns.prefix('¥');
              ns.value(88888);
              ns.fontSize('36px');
              ns.separator(',');
            }));
            row.child(vNumberScroll(ns => {
              ns.value(98.5);
              ns.suffix('%');
              ns.precision(1);
              ns.fontSize('36px');
            }));
          }),
          `// 带货币符号
vNumberScroll(ns => {
  ns.prefix('¥')
  ns.value(88888)
  ns.fontSize('36px')
  ns.separator(',')
})

// 带百分比
vNumberScroll(ns => {
  ns.value(98.5)
  ns.suffix('%')
  ns.precision(1)
  ns.fontSize('36px')
})`
        ),

        CodeDemo('触发动画',
          vstack(col => {
            col.gap('16px');
            // 保存数字滚动组件的引用
            const ns_component = vNumberScroll(ns => {
              ns.prefix('👥 ');
              ns.value(0);
              ns.fontSize('48px');
              ns.separator(',');
              ns.duration(2000);
            });
            col.child(ns_component);
            col.child(flex(actions => {
              actions.gap('12px');
              actions.child(vButton('滚动到 1000', btn => {
                btn.type('primary');
                btn.on('click', () => {
                  if (ns_component) ns_component.value(1000);
                });
              }));
              actions.child(vButton('滚动到 9999', btn => {
                btn.on('click', () => {
                  if (ns_component) ns_component.value(9999);
                });
              }));
            }));
          }),
          `const ns = vNumberScroll(ns => {
  ns.prefix('👥 ')
  ns.value(0)
  ns.fontSize('48px')
  ns.separator(',')
  ns.duration(2000)  // 动画时长 2 秒
})

// 触发动画
ns.value(1000)`
        ),
      ]));

      // ========== 趋势指示器 ==========
      content.child(DocSection('trend', '趋势指示器', [
        CodeDemo('基础趋势',
          flex(row => {
            row.gap('24px');
            row.child(vTrend(t => {
              t.value(15.5);
            }));
            row.child(vTrend(t => {
              t.value(-8.2);
            }));
            row.child(vTrend(t => {
              t.value(0);
            }));
          }),
          `// 上升趋势
vTrend(t => {
  t.value(15.5)  // 正数表示上升
})

// 下降趋势
vTrend(t => {
  t.value(-8.2)  // 负数表示下降
})

// 持平
vTrend(t => {
  t.value(0)
})`
        ),

        CodeDemo('趋势样式',
          flex(row => {
            row.gap('24px');
            row.child(vTrend(t => {
              t.value(25.8);
              t.precision(2);
              t.iconSize('20px');
              t.fontSize('16px');
            }));
            row.child(vTrend(t => {
              t.value(-12.3);
              t.showIcon(false);
              t.showValue(true);
            }));
          }),
          `vTrend(t => {
  t.value(25.8)
  t.precision(2)      // 保留 2 位小数
  t.iconSize('20px')  // 图标大小
  t.fontSize('16px')  // 字体大小
})

// 不显示图标
vTrend(t => {
  t.value(-12.3)
  t.showIcon(false)
})`
        ),
      ]));

      // ========== 仪表盘 ==========
      content.child(DocSection('gauge', '仪表盘', [
        CodeDemo('半圆仪表盘',
          flex(row => {
            row.gap('24px');
            row.child(vGauge(g => {
              g.value(75);
              g.size(150);
              g.label('完成率');
            }));
            row.child(vGauge(g => {
              g.value(45);
              g.size(150);
              g.label('进度');
            }));
          }),
          `vGauge(g => {
  g.value(75)
  g.size(150)
  g.label('完成率')
})`
        ),

        CodeDemo('全圆仪表盘',
          flex(row => {
            row.gap('24px');
            row.child(vGauge(g => {
              g.value(60);
              g.size(150);
              g.type('circle');
              g.label('CPU 使用率');
            }));
            row.child(vGauge(g => {
              g.value(80);
              g.size(150);
              g.type('circle');
              g.label('内存使用');
            }));
          }),
          `// 全圆仪表盘
vGauge(g => {
  g.value(60)
  g.size(150)
  g.type('circle')    // 全圆类型
  g.label('CPU 使用率')
})`
        ),
      ]));

      // ========== 环形进度条 ==========
      content.child(DocSection('circular-progress', '环形进度条', [
        CodeDemo('基础环形进度',
          flex(row => {
            row.gap('24px');
            row.child(vCircularProgress(cp => {
              cp.value(75);
              cp.size(120);
            }));
            row.child(vCircularProgress(cp => {
              cp.value(45);
              cp.size(120);
            }));
            row.child(vCircularProgress(cp => {
              cp.value(90);
              cp.size(120);
            }));
          }),
          `vCircularProgress(cp => {
  cp.value(75)
  cp.size(120)
})`
        ),

        CodeDemo('自定义样式',
          flex(row => {
            row.gap('24px');
            row.child(vCircularProgress(cp => {
              cp.value(65);
              cp.size(100);
              cp.strokeWidth(12);
              cp.showPercent(true);
            }));
            row.child(vCircularProgress(cp => {
              cp.value(85);
              cp.size(100);
              cp.strokeWidth(6);
              cp.valueSuffix('分');
              cp.showPercent(false);
            }));
          }),
          `// 粗进度条
vCircularProgress(cp => {
  cp.value(65)
  cp.size(100)
  cp.strokeWidth(12)   // 进度条更粗
  cp.showPercent(true) // 显示百分比
})

// 细进度条 + 自定义单位
vCircularProgress(cp => {
  cp.value(85)
  cp.size(100)
  cp.strokeWidth(6)    // 进度条更细
  cp.valueSuffix('分')  // 自定义后缀
  cp.showPercent(false)// 显示实际值
})`
        ),
      ]));

      // ========== 指标卡 ==========
      content.child(DocSection('indicator', '指标卡', [
        CodeDemo('基础指标卡',
          flex(row => {
            row.gap('24px');
            row.child(vIndicator(ind => {
              ind.icon('📊');
              ind.title('总访问量');
              ind.value(1234567);
              ind.separator(',');
              ind.trend(12.5);
            }));
            row.child(vIndicator(ind => {
              ind.icon('💰');
              ind.title('销售额');
              ind.value(987654);
              ind.prefix('¥');
              ind.separator(',');
              ind.trend(-5.3);
            }));
          }),
          `vIndicator(ind => {
  ind.icon('📊')
  ind.title('总访问量')
  ind.value(1234567)
  ind.separator(',')
  ind.trend(12.5)  // 趋势 +12.5%
})`
        ),

        CodeDemo('指标卡组合',
          grid(g => {
            g.columns(2);
            g.gap('16px');
            g.child(vIndicator(ind => {
              ind.icon('👥');
              ind.title('新增用户');
              ind.value(2850);
              ind.suffix('人');
              ind.trend(8.2);
            }));
            g.child(vIndicator(ind => {
              ind.icon('📦');
              ind.title('订单数');
              ind.value(15678);
              ind.separator(',');
              ind.trend(15.3);
            }));
            g.child(vIndicator(ind => {
              ind.icon('⭐');
              ind.title('好评率');
              ind.value(98.5);
              ind.suffix('%');
              ind.precision(1);
              ind.trend(0.5);
            }));
            g.child(vIndicator(ind => {
              ind.icon('🚚');
              ind.title('发货数');
              ind.value(14520);
              ind.separator(',');
              ind.trend(-2.1);
            }));
          }),
          `grid(g => {
  g.columns(2)
  g.gap('16px')

  g.child(vIndicator(ind => {
    ind.icon('👥')
    ind.title('新增用户')
    ind.value(2850)
    ind.suffix('人')
    ind.trend(8.2)
  }))

  // ... 其他指标卡
})`
        ),
      ]));

      // ========== 时间序列 ==========
      content.child(DocSection('time-series', '时间序列', [
        CodeDemo('基础时间序列',
          vTimeSeries(ts => {
            ts.title('近 10 小时访问量');
            ts.data([
              { time: '2024-01-01 10:00', value: 1234 },
              { time: '2024-01-01 11:00', value: 1567 },
              { time: '2024-01-01 12:00', value: 2345 },
              { time: '2024-01-01 13:00', value: 1890 },
              { time: '2024-01-01 14:00', value: 2100 },
            ]);
          }),
          `vTimeSeries(ts => {
  ts.title('近 10 小时访问量')
  ts.data([
    { time: '2024-01-01 10:00', value: 1234 },
    { time: '2024-01-01 11:00', value: 1567 },
    { time: '2024-01-01 12:00', value: 2345 },
    { time: '2024-01-01 13:00', value: 1890 },
    { time: '2024-01-01 14:00', value: 2100 },
  ])
})`
        ),

        CodeDemo('实时数据更新',
          vstack(col => {
            col.gap('16px');
            col.child(vTimeSeries(ts => {
              ts.title('实时温度监控');
              ts.timeFormat('HH:mm:ss');
              ts.valuePrecision(1);
              ts.valueSuffix('°C');
              ts.data([
                { time: new Date(), value: 25.5 },
              ]);
            }));
            col.child(flex(actions => {
              actions.gap('12px');
              actions.child(vButton('添加数据', btn => {
                btn.type('primary');
                btn.on('click', () => {
                  const ts_el = col._children.find(c => c.hasClass('yoya-time-series'));
                  if (ts_el) {
                    const newValue = 20 + Math.random() * 15;
                    ts_el.addItem({ time: new Date(), value: newValue });
                  }
                });
              }));
            }));
          }),
          `const ts = vTimeSeries(ts => {
  ts.title('实时温度监控')
  ts.timeFormat('HH:mm:ss')
  ts.valuePrecision(1)
  ts.valueSuffix('°C')
  ts.data([{ time: new Date(), value: 25.5 }])
})

// 添加新数据
ts.addItem({ time: new Date(), value: 28.5 })`
        ),
      ]));

      // ========== 排行榜 ==========
      content.child(DocSection('rank-list', '排行榜', [
        CodeDemo('基础排行榜',
          vRankList(rl => {
            rl.title('销售排行榜');
            rl.data([
              { name: '张三', value: 125000 },
              { name: '李四', value: 98000 },
              { name: '王五', value: 87500 },
              { name: '赵六', value: 76000 },
              { name: '孙七', value: 65000 },
            ]);
            rl.valuePrefix('¥');
            rl.separator(',');
          }),
          `vRankList(rl => {
  rl.title('销售排行榜')
  rl.data([
    { name: '张三', value: 125000 },
    { name: '李四', value: 98000 },
    { name: '王五', value: 87500 },
    { name: '赵六', value: 76000 },
    { name: '孙七', value: 65000 },
  ])
  rl.valuePrefix('¥')
  rl.separator(',')
})`
        ),

        CodeDemo('自定义排行榜',
          vRankList(rl => {
            rl.title('热门商品 TOP5');
            rl.data([
              { name: 'iPhone 15 Pro', value: 9850 },
              { name: 'MacBook Pro 14"', value: 7620 },
              { name: 'AirPods Pro 2', value: 6540 },
              { name: 'iPad Air 5', value: 5230 },
              { name: 'Apple Watch S9', value: 4180 },
            ]);
            rl.suffix('件');
            rl.separator(',');
          }),
          `vRankList(rl => {
  rl.title('热门商品 TOP5')
  rl.data([
    { name: 'iPhone 15 Pro', value: 9850 },
    { name: 'MacBook Pro 14"', value: 7620 },
    { name: 'AirPods Pro 2', value: 6540 },
    { name: 'iPad Air 5', value: 5230 },
    { name: 'Apple Watch S9', value: 4180 },
  ])
  rl.suffix('件')
  rl.separator(',')
})`
        ),
      ]));

      // ========== 看板栅格 ==========
      content.child(DocSection('dashboard-grid', '看板栅格', [
        CodeDemo('12 列栅格布局',
          vDashboardGrid(dg => {
            dg.columns(12);
            dg.gap(16);
            dg.addChild(div(d => {
              d.textContent('占据 4 列');
              d.styles({ padding: '20px', textAlign: 'center', background: '#e6f7ff', borderRadius: '8px' });
            }), 4);
            dg.addChild(div(d => {
              d.textContent('占据 8 列');
              d.styles({ padding: '20px', textAlign: 'center', background: '#f6ffed', borderRadius: '8px' });
            }), 8);
            dg.addChild(div(d => {
              d.textContent('占据 6 列');
              d.styles({ padding: '20px', textAlign: 'center', background: '#fff7e6', borderRadius: '8px' });
            }), 6);
            dg.addChild(div(d => {
              d.textContent('占据 6 列');
              d.styles({ padding: '20px', textAlign: 'center', background: '#f9f0ff', borderRadius: '8px' });
            }), 6);
          }),
          `vDashboardGrid(dg => {
  dg.columns(12)
  dg.gap(16)

  // 添加子元素，指定占据的列数
  dg.addChild(div(d => {
    d.textContent('占据 4 列')
    d.styles({ padding: '20px' })
  }), 4)

  dg.addChild(div(d => {
    d.textContent('占据 8 列')
    d.styles({ padding: '20px' })
  }), 8)
})`
        ),
      ]));

      // ========== 综合示例 ==========
      content.child(DocSection('dashboard-demo', '综合示例 - 数据看板', [
        CodeDemo('销售数据看板',
          vstack(col => {
            col.gap('16px');

            // 第一行 - 指标卡
            col.child(vDashboardGrid(row1 => {
              row1.columns(12);
              row1.gap(16);

              row1.addChild(vIndicator(ind => {
                ind.icon('💰');
                ind.title('今日销售额');
                ind.value(125680);
                ind.prefix('¥');
                ind.separator(',');
                ind.trend(15.8);
              }), 3);

              row1.addChild(vIndicator(ind => {
                ind.icon('📦');
                ind.title('订单数量');
                ind.value(2850);
                ind.separator(',');
                ind.trend(8.2);
              }), 3);

              row1.addChild(vIndicator(ind => {
                ind.icon('👥');
                ind.title('新增客户');
                ind.value(186);
                ind.separator(',');
                ind.trend(-3.5);
              }), 3);

              row1.addChild(vIndicator(ind => {
                ind.icon('⭐');
                ind.title('客户满意度');
                ind.value(96.8);
                ind.suffix('%');
                ind.precision(1);
                ind.trend(1.2);
              }), 3);
            }));

            // 第二行 - 数字滚动 + 环形进度
            col.child(vDashboardGrid(row2 => {
              row2.columns(12);
              row2.gap(16);

              row2.addChild(vstack(inner => {
                inner.gap('12px');
                inner.child(div(d => {
                  d.styles({ fontSize: '14px', color: '#666', marginBottom: '8px' });
                  d.textContent('实时访问');
                }));
                inner.child(vNumberScroll(ns => {
                  ns.value(8520);
                  ns.fontSize('36px');
                  ns.separator(',');
                  ns.suffix('人');
                }));
                inner.child(hstack(h => {
                  h.gap('16px');
                  h.child(vTrend(t => {
                    t.value(12.5);
                    t.precision(1);
                  }));
                  h.child(span('较昨日'));
                }));
              }), 4);

              row2.addChild(vstack(inner => {
                inner.gap('12px');
                inner.child(div(d => {
                  d.styles({ fontSize: '14px', color: '#666', marginBottom: '8px', textAlign: 'center' });
                  d.textContent('目标完成率');
                }));
                inner.child(vCircularProgress(cp => {
                  cp.value(78);
                  cp.size(120);
                  cp.strokeWidth(10);
                }));
              }), 4);

              row2.addChild(vRankList(rl => {
                rl.title('商品热销榜');
                rl.data([
                  { name: '商品 A', value: 1250 },
                  { name: '商品 B', value: 980 },
                  { name: '商品 C', value: 760 },
                ]);
                rl.suffix('件');
                rl.maxItems(3);
              }), 4);
            }));
          }),
          `// 销售数据看板
vstack(layout => {
  layout.gap('16px')

  // 第一行 - 4 个指标卡
  layout.child(vDashboardGrid(row1 => {
    row1.columns(12)
    row1.gap(16)

    row1.addChild(vIndicator(ind => {
      ind.icon('💰')
      ind.title('今日销售额')
      ind.value(125680)
      ind.prefix('¥')
      ind.trend(15.8)
    }), 3)

    // ... 其他指标卡
  }))

  // 第二行 - 数字滚动 + 环形进度 + 排行榜
  layout.child(vDashboardGrid(row2 => {
    row2.columns(12)
    row2.gap(16)

    row2.addChild(vNumberScroll(...), 4)
    row2.addChild(vCircularProgress(...), 4)
    row2.addChild(vRankList(...), 4)
  }))
})`
        ),
      ]));

      // ========== API 参考 ==========
      content.child(DocSection('api', 'API 参考', [
        ApiTable([
          { name: 'vNumberScroll', desc: '数字滚动动画组件', type: '-' },
          { name: 'vTrend', desc: '趋势指示器组件', type: '-' },
          { name: 'vGauge', desc: '仪表盘组件（半圆/全圆）', type: '-' },
          { name: 'vCircularProgress', desc: '环形进度条组件', type: '-' },
          { name: 'vIndicator', desc: '指标卡组件', type: '-' },
          { name: 'vTimeSeries', desc: '时间序列卡片组件', type: '-' },
          { name: 'vRankList', desc: '排行榜组件', type: '-' },
          { name: 'vDashboardGrid', desc: '看板栅格布局组件', type: '-' },
        ]),
      ]));
    },
  });
}
