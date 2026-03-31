/**
 * Yoya.Basic - Dashboard Decoration 实际应用场景演示
 */

import {
  vBorder, vDivider, vCorner, vTitleBar, vPanel, vGlowBox, vTechBorder,
  vstack, hstack, flex, div, span
} from '../../yoya/index.js';

// ============================================
// 场景 1: 数据概览卡片 - 使用 VPanel + VGlowBox
// ============================================

// 统计数据
const statsData = [
  { icon: '👥', title: '总用户数', value: '128,456', trend: '+12.5%', color: '#667eea' },
  { icon: '💰', title: '本月收入', value: '¥892,340', trend: '+8.3%', color: '#00f5ff' },
  { icon: '📦', title: '订单数量', value: '45,678', trend: '+15.2%', color: '#ff6b6b' },
  { icon: '📊', title: '转化率', value: '3.24%', trend: '+2.1%', color: '#52c41a' },
];

const statsContainer = div(c => {
  c.styles({ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' });

  statsData.forEach(stat => {
    c.child(vGlowBox(g => {
      g.color(stat.color);
      g.glowSize(20);
      g.glowIntensity(0.6);
      g.borderRadius(12);
      g.padding(24);
      g.content(div(inner => {
        inner.styles({ display: 'flex', flexDirection: 'column', gap: '12px' });

        // 图标和标题
        inner.child(div(header => {
          header.styles({ display: 'flex', alignItems: 'center', gap: '8px' });
          header.child(span(icon => {
            icon.textContent(stat.icon);
            icon.styles({ fontSize: '24px' });
          }));
          header.child(span(title => {
            title.textContent(stat.title);
            title.styles({ fontSize: '14px', color: 'var(--yoya-text-secondary)' });
          }));
        }));

        // 数值
        inner.child(span(value => {
          value.textContent(stat.value);
          value.styles({
            fontSize: '32px',
            fontWeight: '700',
            color: stat.color,
          });
        }));

        // 趋势
        inner.child(span(trend => {
          trend.textContent(stat.trend);
          trend.styles({
            fontSize: '14px',
            color: 'var(--yoya-success)',
            fontWeight: '500',
          });
        }));
      }));
    }));
  });
});

statsContainer.bindTo('#scene1-stats');

// ============================================
// 场景 2: 服务器监控面板 - 使用 VTechBorder
// ============================================

const monitorPanel = vTechBorder(t => {
  t.color('#00f5ff', '#667eea');
  t.borderWidth(2);
  t.animated(true);
  t.content(div(c => {
    c.styles({ padding: '0' });

    // 标题栏
    c.child(div(header => {
      header.styles({
        padding: '16px',
        borderBottom: '1px solid rgba(0, 245, 255, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      });
      header.child(div(title => {
        title.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
        title.child(span(icon => {
          icon.textContent('🖥️');
          icon.styles({ fontSize: '20px' });
        }));
        title.child(span(text => {
          text.textContent('服务器监控');
          text.styles({ fontSize: '16px', fontWeight: '600', color: '#00f5ff' });
        }));
      }));
      header.child(span(status => {
        status.textContent('🟢 运行正常');
        status.styles({
          fontSize: '12px',
          padding: '4px 12px',
          background: 'rgba(82, 196, 26, 0.2)',
          color: 'var(--yoya-success)',
          borderRadius: '12px',
        });
      }));
    }));

    // 监控指标
    c.child(div(metrics => {
      metrics.styles({ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' });

      // CPU
      metrics.child(div(metric => {
        metric.styles({ display: 'flex', flexDirection: 'column', gap: '8px' });
        metric.child(div(row => {
          row.styles({ display: 'flex', justifyContent: 'space-between' });
          row.child(span(label => {
            label.textContent('CPU 使用率');
            label.styles({ fontSize: '13px', color: '#aaa' });
          }));
          row.child(span(value => {
            value.textContent('45%');
            value.styles({ fontSize: '18px', fontWeight: '600', color: '#00f5ff' });
          }));
        }));
        // 进度条
        metric.child(div(bar => {
          bar.styles({
            height: '6px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '3px',
            overflow: 'hidden',
          });
          bar.child(div(fill => {
            fill.styles({
              width: '45%',
              height: '100%',
              background: 'linear-gradient(90deg, #00f5ff, #667eea)',
              borderRadius: '3px',
            });
          }));
        }));
      }));

      // 内存
      metrics.child(div(metric => {
        metric.styles({ display: 'flex', flexDirection: 'column', gap: '8px' });
        metric.child(div(row => {
          row.styles({ display: 'flex', justifyContent: 'space-between' });
          row.child(span(label => {
            label.textContent('内存使用');
            label.styles({ fontSize: '13px', color: '#aaa' });
          }));
          row.child(span(value => {
            value.textContent('6.2GB / 16GB');
            value.styles({ fontSize: '18px', fontWeight: '600', color: '#00f5ff' });
          }));
        }));
        metric.child(div(bar => {
          bar.styles({
            height: '6px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '3px',
            overflow: 'hidden',
          });
          bar.child(div(fill => {
            fill.styles({
              width: '39%',
              height: '100%',
              background: 'linear-gradient(90deg, #00f5ff, #667eea)',
              borderRadius: '3px',
            });
          }));
        }));
      }));

      // 磁盘
      metrics.child(div(metric => {
        metric.styles({ display: 'flex', flexDirection: 'column', gap: '8px' });
        metric.child(div(row => {
          row.styles({ display: 'flex', justifyContent: 'space-between' });
          row.child(span(label => {
            label.textContent('磁盘空间');
            label.styles({ fontSize: '13px', color: '#aaa' });
          }));
          row.child(span(value => {
            value.textContent('78%');
            value.styles({ fontSize: '18px', fontWeight: '600', color: '#ffa502' });
          }));
        }));
        metric.child(div(bar => {
          bar.styles({
            height: '6px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '3px',
            overflow: 'hidden',
          });
          bar.child(div(fill => {
            fill.styles({
              width: '78%',
              height: '100%',
              background: 'linear-gradient(90deg, #ffa502, #ff6b6b)',
              borderRadius: '3px',
            });
          }));
        }));
      }));

      // 网络
      metrics.child(div(metric => {
        metric.styles({ display: 'flex', flexDirection: 'column', gap: '8px' });
        metric.child(div(row => {
          row.styles({ display: 'flex', justifyContent: 'space-between' });
          row.child(span(label => {
            label.textContent('网络流量');
            label.styles({ fontSize: '13px', color: '#aaa' });
          }));
          row.child(span(value => {
            value.textContent('↑125 ↓89 MB/s');
            value.styles({ fontSize: '18px', fontWeight: '600', color: '#00f5ff' });
          }));
        }));
      }));
    }));
  }));
});

monitorPanel.bindTo('#scene2-monitor');

// ============================================
// 场景 3: 销售数据报告 - 使用 VTitleBar + VDivider
// ============================================

const reportPanel = vPanel(p => {
  p.type('gradient');
  p.color('#667eea', '#764ba2');
  p.borderRadius(12);
  p.content(div(c => {
    c.styles({ padding: '0' });

    // 标题栏
    c.child(vTitleBar(t => {
      t.title('月度销售报告');
      t.icon('💰');
      t.subtitle('2024 年 3 月');
      t.type('gradient');
      t.color('#667eea', '#764ba2');
      t.height(50);
    }));

    // 报告内容
    c.child(div(content => {
      content.styles({ padding: '20px' });

      // 数据行
      const dataRows = [
        { label: '销售总额', value: '¥1,234,567', percent: '100%' },
        { label: '线上销售', value: '¥892,340', percent: '72%' },
        { label: '线下销售', value: '¥342,227', percent: '28%' },
        { label: '订单数量', value: '45,678', percent: '+15.2%' },
        { label: '客单价', value: '¥27.03', percent: '+5.8%' },
      ];

      dataRows.forEach((row, index) => {
        content.child(div(item => {
          item.styles({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
          });
          item.child(span(label => {
            label.textContent(row.label);
            label.styles({ fontSize: '14px', color: 'var(--yoya-text-secondary)' });
          }));
          item.child(div(right => {
            right.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
            right.child(span(value => {
              value.textContent(row.value);
              value.styles({ fontSize: '16px', fontWeight: '600', color: 'var(--yoya-text-primary)' });
            }));
            right.child(span(percent => {
              percent.textContent(row.percent);
              percent.styles({
                fontSize: '12px',
                padding: '2px 8px',
                background: row.percent.startsWith('+') ? 'rgba(82, 196, 26, 0.1)' : 'rgba(102, 126, 234, 0.1)',
                color: row.percent.startsWith('+') ? 'var(--yoya-success)' : 'var(--yoya-primary)',
                borderRadius: '8px',
              });
            }));
          }));
        }));

        if (index < dataRows.length - 1) {
          content.child(vDivider(d => {
            d.type('normal');
            d.color('var(--yoya-border-light)');
            d.thickness(1);
          }));
        }
      });
    }));
  }));
});

reportPanel.bindTo('#scene3-report');

// ============================================
// 场景 4: 实时告警列表 - 使用 VCorner + VBorder
// ============================================

const alertsPanel = vCorner(c => {
  c.size(20);
  c.color('#ff6b6b');
  c.borderWidth(3);
  c.shape('L');
  c.animated(true);
  c.content(div(inner => {
    inner.styles({ padding: '20px', background: 'var(--yoya-bg)', borderRadius: '8px' });

    // 标题
    inner.child(div(header => {
      header.styles({ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' });
      header.child(span(icon => {
        icon.textContent('🔔');
        icon.styles({ fontSize: '20px' });
      }));
      header.child(span(title => {
        title.textContent('实时告警');
        title.styles({ fontSize: '16px', fontWeight: '600' });
      }));
      header.child(span(badge => {
        badge.textContent('3');
        badge.styles({
          fontSize: '12px',
          padding: '2px 8px',
          background: '#ff6b6b',
          color: '#fff',
          borderRadius: '10px',
        });
      }));
    }));

    // 告警列表
    const alerts = [
      { level: '🔴', type: '严重', message: '服务器 CPU 使用率超过 90%', time: '10:23:45' },
      { level: '🟡', type: '警告', message: '数据库连接池使用率超过 80%', time: '09:15:30' },
      { level: '🔵', type: '提示', message: '系统自动备份完成', time: '08:00:00' },
    ];

    alerts.forEach(alert => {
      inner.child(vBorder(b => {
        b.type('normal');
        b.borderWidth(1);
        b.borderRadius(6);
        b.padding(12);
        b.background('var(--yoya-bg-secondary)');
        b.content(div(item => {
          item.styles({ display: 'flex', alignItems: 'center', gap: '12px' });
          item.child(span(level => {
            item.textContent(alert.level);
            level.styles({ fontSize: '16px' });
          }));
          item.child(div(info => {
            info.styles({ flex: 1 });
            info.child(span(type => {
              type.textContent(alert.type);
              type.styles({
                fontSize: '12px',
                padding: '2px 6px',
                background: alert.type === '严重' ? 'rgba(255, 77, 79, 0.1)' :
                           alert.type === '警告' ? 'rgba(250, 173, 20, 0.1)' : 'rgba(24, 144, 255, 0.1)',
                color: alert.type === '严重' ? 'var(--yoya-danger)' :
                       alert.type === '警告' ? 'var(--yoya-warning)' : 'var(--yoya-info)',
                borderRadius: '4px',
              });
            }));
            info.child(span(msg => {
              msg.textContent(alert.message);
              msg.styles({ fontSize: '13px', marginLeft: '8px', color: 'var(--yoya-text-primary)' });
            }));
          }));
          item.child(span(time => {
            time.textContent(alert.time);
            time.styles({ fontSize: '12px', color: 'var(--yoya-text-secondary)' });
          }));
        }));
      }));
    });
  }));
});

alertsPanel.bindTo('#scene4-alerts');

// ============================================
// 场景 5: 完整的数据大屏布局 - 综合应用
// ============================================

const dashboard = div(d => {
  d.styles({ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' });

  // 左侧：主面板
  d.child(vPanel(p => {
    p.title('📊 数据中心');
    p.type('tech');
    p.color('#00f5ff');
    p.borderRadius(8);
    p.content(div(content => {
      content.styles({ padding: '20px' });

      // 模拟图表区域
      content.child(div(chart => {
        chart.styles({
          height: '300px',
          background: 'linear-gradient(180deg, rgba(0, 245, 255, 0.1), rgba(102, 126, 234, 0.1))',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        });
        chart.child(span(text => {
          text.textContent('📈 数据可视化区域');
          text.styles({ fontSize: '16px', color: 'var(--yoya-text-secondary)' });
        }));
      }));

      // 底部统计
      content.child(vDivider(d => {
        d.type('gradient');
        d.color('#667eea', '#764ba2');
        d.text('实时统计');
        d.textColor('#667eea');
      }));

      content.child(div(stats => {
        stats.styles({
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginTop: '16px',
        });

        const miniStats = [
          { icon: '👁️', label: '访问量', value: '12,345', color: '#667eea' },
          { icon: '🖱️', label: '点击量', value: '8,976', color: '#00f5ff' },
          { icon: '⏱️', label: '停留时长', value: '4m 32s', color: '#ff6b6b' },
          { icon: '📍', label: '跳出率', value: '32.5%', color: '#52c41a' },
        ];

        miniStats.forEach(stat => {
          stats.child(div(item => {
            item.styles({ textAlign: 'center', padding: '16px', background: 'var(--yoya-bg-secondary)', borderRadius: '8px' });
            item.child(span(icon => {
              icon.textContent(stat.icon);
              icon.styles({ fontSize: '24px' });
            }));
            item.child(span(label => {
              label.textContent(stat.label);
              label.styles({ display: 'block', fontSize: '12px', color: 'var(--yoya-text-secondary)', marginTop: '8px' });
            }));
            item.child(span(value => {
              value.textContent(stat.value);
              value.styles({ display: 'block', fontSize: '20px', fontWeight: '600', color: stat.color, marginTop: '4px' });
            }));
          }));
        });
      }));
    }));
  }));

  // 右侧：侧边栏
  d.child(div(sidebar => {
    sidebar.styles({ display: 'flex', flexDirection: 'column', gap: '20px' });

    // 顶部卡片
    sidebar.child(vGlowBox(g => {
      g.color('#667eea');
      g.glowSize(15);
      g.borderRadius(8);
      g.padding(20);
      g.content(div(content => {
        content.styles({ display: 'flex', flexDirection: 'column', gap: '12px' });
        content.child(div(header => {
          header.styles({ display: 'flex', alignItems: 'center', gap: '8px' });
          header.child(span(icon => {
            icon.textContent('🎯');
            icon.styles({ fontSize: '20px' });
          }));
          header.child(span(title => {
            title.textContent('今日目标');
            title.styles({ fontSize: '14px', fontWeight: '600' });
          }));
        }));
        content.child(div(progress => {
          progress.styles({ display: 'flex', flexDirection: 'column', gap: '8px' });
          progress.child(div(bar => {
            bar.styles({
              height: '8px',
              background: 'rgba(102, 126, 234, 0.2)',
              borderRadius: '4px',
              overflow: 'hidden',
            });
            bar.child(div(fill => {
              fill.styles({
                width: '75%',
                height: '100%',
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                borderRadius: '4px',
              });
            }));
          }));
          progress.child(span(text => {
            text.textContent('已完成 75% - 目标 ¥100,000');
            text.styles({ fontSize: '12px', color: 'var(--yoya-text-secondary)' });
          }));
        }));
      }));
    }));

    // 角标装饰的快捷操作
    sidebar.child(vCorner(c => {
      c.size(15);
      c.color('#00f5ff');
      c.borderWidth(2);
      c.shape('L');
      c.content(div(inner => {
        inner.styles({ padding: '16px', background: 'var(--yoya-bg)' });
        inner.child(vTitleBar(t => {
          t.title('快捷操作');
          t.icon('⚡');
          t.type('bracket');
          t.color('#00f5ff');
          t.height(36);
        }));
        inner.child(div(actions => {
          actions.styles({ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' });

          ['📊 查看报表', '📥 导出数据', '🔔 告警设置', '⚙️ 系统配置'].forEach(action => {
            actions.child(div(btn => {
              btn.styles({
                padding: '10px 12px',
                background: 'var(--yoya-bg-secondary)',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              });
              btn.child(span(icon => {
                icon.textContent(action[0]);
                icon.styles({ fontSize: '16px' });
              }));
              btn.child(span(text => {
                text.textContent(action.slice(1));
                text.styles({ fontSize: '13px' });
              }));
            }));
          });
        }));
      }));
    }));
  }));
});

dashboard.bindTo('#scene5-dashboard');

console.log('Dashboard Decoration 实际应用场景演示页面加载完成');
