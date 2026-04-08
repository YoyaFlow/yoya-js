/**
 * Yoya.Basic - Dashboard Components Examples
 * 大屏看板组件演示
 */

import { 
  vstack, hstack, div, span,
  vNumberScroll, vTrend, vGauge, vCircularProgress,
  vIndicator, vTimeSeries, vRankList, vDashboardGrid,
  toast
} from '../index.js';

console.log('Dashboard 组件演示页面脚本加载');

// 使用 setTimeout 确保 DOM 已经加载
setTimeout(() => {
  console.log('执行初始化代码，readyState:', document.readyState);
  initDashboard();
}, 100);

function initDashboard() {
  // ==================== 演示 1: 指标卡组件 ====================
  const indicatorsContainer = document.getElementById('indicators');
  if (indicatorsContainer) {
    const indicators = hstack(h => {
      h.gap('20px');
      h.styles({ flexWrap: 'wrap' });

      // 指标卡 1 - 总销售额
      h.child(vIndicator(i => {
        i.icon('💰');
        i.title('总销售额');
        i.value(1234567);
        i.trend(12.5);
        i.prefix('¥');
        i.separator(',');
      }));

      // 指标卡 2 - 访问量
      h.child(vIndicator(i => {
        i.icon('👥');
        i.title('访问量');
        i.value(88456);
        i.trend(8.2);
        i.separator(',');
      }));

      // 指标卡 3 - 订单数
      h.child(vIndicator(i => {
        i.icon('📦');
        i.title('订单数');
        i.value(12345);
        i.trend(-3.1);
        i.separator(',');
      }));

      // 指标卡 4 - 转化率
      h.child(vIndicator(i => {
        i.icon('📈');
        i.title('转化率');
        i.value(68.5);
        i.trend(2.4);
        i.suffix('%');
        i.precision(1);
      }));
    });
    indicatorsContainer.appendChild(indicators.renderDom());
  }

  // ==================== 演示 2: 数字滚动动画 ====================
  const numberScrollContainer = document.getElementById('numberScroll');
  if (numberScrollContainer) {
    const scroll = vNumberScroll(n => {
      n.value(987654);
      n.prefix('¥');
      n.separator(',');
      n.fontSize('56px');
      n.color('var(--yoya-primary)');
      n.duration(2000);
      n.easing('easeOutExpo');
    });
    numberScrollContainer.appendChild(scroll.renderDom());

    // 趋势
    const trend = vTrend(t => {
      t.value(15.8);
      t.precision(1);
    });
    numberScrollContainer.appendChild(trend.renderDom());
  }

  // ==================== 演示 3: 仪表盘 ====================
  const gaugeContainer = document.getElementById('gauge');
  if (gaugeContainer) {
    // 半圆仪表盘
    const gauge1 = vGauge(g => {
      g.value(75);
      g.max(100);
      g.size(180);
      g.type('semicircle');
      g.label('完成率');
      g.valueSuffix('%');
    });
    gaugeContainer.appendChild(gauge1.renderDom());

    // 全圆仪表盘
    const gauge2 = vGauge(g => {
      g.value(65);
      g.max(100);
      g.size(180);
      g.type('circle');
      g.label('CPU');
      g.valueSuffix('%');
    });
    gaugeContainer.appendChild(gauge2.renderDom());
  }

  // ==================== 演示 4: 环形进度条 ====================
  const circularContainer = document.getElementById('circularProgress');
  if (circularContainer) {
    const circularRow = hstack(h => {
      h.gap('30px');

      h.child(vstack(v => {
        v.gap('8px');
        v.child(span(s => {
          s.textContent('进度 1');
          s.styles({ fontSize: '12px', color: 'var(--yoya-text-secondary)' });
        }));
        v.child(vCircularProgress(c => {
          c.value(75);
          c.size(100);
          c.showPercent(true);
        }));
      }));

      h.child(vstack(v => {
        v.gap('8px');
        v.child(span(s => {
          s.textContent('进度 2');
          s.styles({ fontSize: '12px', color: 'var(--yoya-text-secondary)' });
        }));
        v.child(vCircularProgress(c => {
          c.value(45);
          c.size(100);
          c.showPercent(true);
        }));
      }));

      h.child(vstack(v => {
        v.gap('8px');
        v.child(span(s => {
          s.textContent('进度 3');
          s.styles({ fontSize: '12px', color: 'var(--yoya-text-secondary)' });
        }));
        v.child(vCircularProgress(c => {
          c.value(90);
          c.size(100);
          c.showPercent(true);
        }));
      }));
    });
    circularContainer.appendChild(circularRow.renderDom());
  }

  // ==================== 演示 5: 时间序列 ====================
  const timeSeriesContainer = document.getElementById('timeSeries');
  if (timeSeriesContainer) {
    const now = Date.now();
    const data = [];
    for (let i = 9; i >= 0; i--) {
      data.push({
        time: new Date(now - i * 60000),
        value: Math.floor(1000 + i * 200 + Math.random() * 100)
      });
    }

    const timeSeries = vTimeSeries(t => {
      t.title('🕐 近 10 分钟访问量');
      t.timeFormat('HH:mm:ss');
      t.valuePrecision(0);
      t.maxItems(10);
      t.data(data);
    });
    timeSeriesContainer.appendChild(timeSeries.renderDom());
  }

  // ==================== 演示 6: 排行榜 ====================
  const rankListContainer = document.getElementById('rankList');
  if (rankListContainer) {
    const rankList = vRankList(r => {
      r.title('🏆 销售排行榜');
      r.maxItems(8);
      r.data([
        { name: '华东大区', value: 2345678 },
        { name: '华南大区', value: 1987654 },
        { name: '华北大区', value: 1765432 },
        { name: '西南大区', value: 1543210 },
        { name: '华中大区', value: 1321098 },
        { name: '东北大区', value: 1098765 },
        { name: '西北大区', value: 876543 },
        { name: '东南大区', value: 654321 },
      ]);
      r.valuePrefix('¥');
      r.valuePrecision(0);
    });
    rankListContainer.appendChild(rankList.renderDom());
  }

  // ==================== 演示 7: 栅格布局 ====================
  const gridContainer = document.getElementById('dashboardGrid');
  if (gridContainer) {
    const grid = vDashboardGrid(g => {
      g.columns(12);
      g.gap(16);

      // 添加子卡片
      g.addChild(div(c => {
        c.textContent('卡片 1 (占 4 列)');
        c.styles({ padding: '40px', textAlign: 'center', fontSize: '16px', background: 'var(--yoya-bg)', borderRadius: '8px' });
      }), 4);

      g.addChild(div(c => {
        c.textContent('卡片 2 (占 4 列)');
        c.styles({ padding: '40px', textAlign: 'center', fontSize: '16px', background: 'var(--yoya-bg)', borderRadius: '8px' });
      }), 4);

      g.addChild(div(c => {
        c.textContent('卡片 3 (占 4 列)');
        c.styles({ padding: '40px', textAlign: 'center', fontSize: '16px', background: 'var(--yoya-bg)', borderRadius: '8px' });
      }), 4);

      g.addChild(div(c => {
        c.textContent('卡片 4 (占 6 列)');
        c.styles({ padding: '40px', textAlign: 'center', fontSize: '16px', background: 'var(--yoya-bg)', borderRadius: '8px' });
      }), 6);

      g.addChild(div(c => {
        c.textContent('卡片 5 (占 6 列)');
        c.styles({ padding: '40px', textAlign: 'center', fontSize: '16px', background: 'var(--yoya-bg)', borderRadius: '8px' });
      }), 6);
    });
    gridContainer.appendChild(grid.renderDom());
  }

  // ==================== 控制按钮 ====================
  const actionBar = document.getElementById('actionBar');
  if (actionBar) {
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '🔄 刷新数据';
    refreshBtn.style.cssText = `
      padding: 10px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    `;
    refreshBtn.onclick = () => {
      // 刷新数字滚动
      const scrollEl = document.querySelector('.yoya-number-scroll');
      if (scrollEl && scrollEl._yoyaInstance) {
        const newValue = Math.floor(Math.random() * 500000) + 500000;
        scrollEl._yoyaInstance.value(newValue);
      }

      // 刷新仪表盘
      const gaugeEls = document.querySelectorAll('.yoya-gauge');
      gaugeEls.forEach((el, index) => {
        if (el._yoyaInstance) {
          const newValue = Math.floor(Math.random() * 40) + 60;
          el._yoyaInstance.value(newValue);
        }
      });

      // 刷新环形进度条
      const circularEls = document.querySelectorAll('.yoya-circular-progress');
      circularEls.forEach((el, index) => {
        if (el._yoyaInstance) {
          const newValue = [75, 45, 90][index] + Math.floor(Math.random() * 20) - 10;
          el._yoyaInstance.value(Math.max(0, Math.min(100, newValue)));
        }
      });

      toast.success('数据已刷新');
    };
    actionBar.appendChild(refreshBtn);
  }

  console.log('Dashboard 演示页面初始化完成');
}
