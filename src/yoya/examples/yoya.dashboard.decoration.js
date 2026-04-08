/**
 * Yoya.Basic - Dashboard Decoration Components Demo
 * 大屏装饰组件演示页面脚本
 */

import {
  vBorder, vDivider, vCorner, vTitleBar, vPanel, vGlowBox, vTechBorder,
  vIndicator, vNumberScroll, vstack, div, span
} from '../../yoya/index.js';

// 1. VBorder 装饰边框
vBorder(b => {
  b.type('normal');
  b.borderWidth(2);
  b.borderRadius(8);
  b.padding(20);
  b.content(div(c => {
    c.textContent('普通边框');
    c.styles({ fontSize: '14px' });
  }));
}).bindTo('#border1');

vBorder(b => {
  b.type('gradient');
  b.color('#667eea', '#764ba2');
  b.borderWidth(3);
  b.borderRadius(8);
  b.padding(20);
  b.content(div(c => {
    c.textContent('渐变边框');
    c.styles({ fontSize: '14px' });
  }));
}).bindTo('#border2');

vBorder(b => {
  b.type('glow');
  b.color('#00f5ff');
  b.borderWidth(2);
  b.borderRadius(8);
  b.padding(20);
  b.glowIntensity(0.8);
  b.animated(true);
  b.content(div(c => {
    c.textContent('发光边框');
    c.styles({ fontSize: '14px' });
  }));
}).bindTo('#border3');

vBorder(b => {
  b.type('corner');
  b.color('#ff6b6b');
  b.borderWidth(3);
  b.borderRadius(8);
  b.padding(20);
  b.content(div(c => {
    c.textContent('角标边框');
    c.styles({ fontSize: '14px' });
  }));
}).bindTo('#border4');

// 2. VDivider 分割线
vDivider(d => {
  d.type('normal');
  d.color('var(--yoya-border)');
}).bindTo('#divider1');

vDivider(d => {
  d.type('gradient');
  d.color('#667eea', '#764ba2');
}).bindTo('#divider2');

vDivider(d => {
  d.type('dashed');
  d.color('var(--yoya-border)');
  d.thickness(2);
}).bindTo('#divider3');

vDivider(d => {
  d.type('normal');
  d.color('var(--yoya-border)');
  d.text('分割线');
}).bindTo('#divider4');

vDivider(d => {
  d.type('gradient');
  d.color('#667eea', '#764ba2');
  d.text('重要分隔');
  d.textColor('#667eea');
}).bindTo('#divider5');

// 3. VCorner 角标装饰
vCorner(c => {
  c.size(30);
  c.color('#667eea');
  c.borderWidth(3);
  c.shape('L');
  c.content(div(d => {
    d.textContent('L 型角标');
    d.styles({ fontSize: '14px', padding: '30px' });
  }));
}).bindTo('#corner1');

vCorner(c => {
  c.size(20);
  c.color('#00f5ff');
  c.borderWidth(4);
  c.shape('square');
  c.animated(true);
  c.content(div(d => {
    d.textContent('方块角标（动画）');
    d.styles({ fontSize: '14px', padding: '20px' });
  }));
}).bindTo('#corner2');

vCorner(c => {
  c.size(25);
  c.color('#ff6b6b');
  c.borderWidth(2);
  c.shape('triangle');
  c.positions(['tl', 'tr']);
  c.content(div(d => {
    d.textContent('三角角标（仅上方）');
    d.styles({ fontSize: '14px', padding: '25px' });
  }));
}).bindTo('#corner3');

// 4. VTitleBar 标题栏
vTitleBar(t => {
  t.title('普通标题');
  t.type('normal');
}).bindTo('#titlebar1');

vTitleBar(t => {
  t.title('渐变装饰标题');
  t.icon('📊');
  t.type('gradient');
  t.color('#667eea', '#764ba2');
  t.decorationWidth(80);
}).bindTo('#titlebar2');

vTitleBar(t => {
  t.title('括号装饰标题');
  t.type('bracket');
  t.color('#00f5ff');
  t.height(50);
}).bindTo('#titlebar3');

vTitleBar(t => {
  t.title('带副标题');
  t.subtitle('Sub Title');
  t.icon('📈');
  t.type('gradient');
  t.color('#ff6b6b', '#ffa502');
  t.align('center');
}).bindTo('#titlebar4');

// 5. VPanel 装饰面板
vPanel(p => {
  p.title('普通面板');
  p.type('normal');
  p.content(div(c => {
    c.textContent('这是普通面板的内容区域');
    c.styles({ padding: '20px 0' });
  }));
}).bindTo('#panel1');

vPanel(p => {
  p.title('渐变边框面板');
  p.type('gradient');
  p.color('#667eea', '#764ba2');
  p.content(div(c => {
    c.textContent('这是渐变边框面板的内容区域');
    c.styles({ padding: '20px 0' });
  }));
}).bindTo('#panel2');

vPanel(p => {
  p.title('科技风面板');
  p.type('tech');
  p.color('#00f5ff');
  p.content(div(c => {
    c.textContent('这是科技风面板的内容区域');
    c.styles({ padding: '20px 0' });
  }));
}).bindTo('#panel3');

// 6. VGlowBox 发光盒子
vGlowBox(g => {
  g.color('#667eea');
  g.glowSize(20);
  g.glowIntensity(0.5);
  g.animated(true);
  g.content(div(c => {
    c.textContent('蓝色发光盒子');
    c.styles({ padding: '20px', fontSize: '14px' });
  }));
}).bindTo('#glowbox1');

vGlowBox(g => {
  g.color('#00f5ff');
  g.glowSize(25);
  g.glowIntensity(0.7);
  g.animated(true);
  g.content(div(c => {
    c.textContent('青色发光盒子');
    c.styles({ padding: '20px', fontSize: '14px' });
  }));
}).bindTo('#glowbox2');

vGlowBox(g => {
  g.color('#ff6b6b');
  g.glowSize(15);
  g.glowIntensity(0.4);
  g.animated(false);
  g.content(div(c => {
    c.textContent('红色发光盒子（无动画）');
    c.styles({ padding: '20px', fontSize: '14px' });
  }));
}).bindTo('#glowbox3');

// 7. VTechBorder 科技风边框 - 实际使用场景

// 场景 1: 服务器状态监控卡片
vTechBorder(t => {
  t.color('#00f5ff', '#667eea');
  t.borderWidth(2);
  t.animated(true);
  t.content(div(c => {
    c.styles({ padding: '0' });
    
    // 卡片标题
    c.child(div(title => {
      title.styles({ 
        padding: '12px 16px', 
        borderBottom: '1px solid rgba(0, 245, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      });
      title.child(span(s => {
        s.textContent('🖥️');
        s.styles({ fontSize: '18px' });
      }));
      title.child(span(s => {
        s.textContent('服务器状态监控');
        s.styles({ fontSize: '14px', fontWeight: '600', color: '#00f5ff' });
      }));
    }));
    
    // 监控指标
    c.child(div(metrics => {
      metrics.styles({ padding: '16px' });
      metrics.child(div(row => {
        row.styles({ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' });
        row.child(span(s => { s.textContent('CPU 使用率'); s.styles({ color: '#aaa' }); }));
        row.child(span(s => { s.textContent('45%'); s.styles({ color: '#00f5ff', fontWeight: '600' }); }));
      }));
      metrics.child(div(row => {
        row.styles({ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' });
        row.child(span(s => { s.textContent('内存使用'); s.styles({ color: '#aaa' }); }));
        row.child(span(s => { s.textContent('6.2GB / 16GB'); s.styles({ color: '#00f5ff', fontWeight: '600' }); }));
      }));
      metrics.child(div(row => {
        row.styles({ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' });
        row.child(span(s => { s.textContent('磁盘空间'); s.styles({ color: '#aaa' }); }));
        row.child(span(s => { s.textContent('78%'); s.styles({ color: '#ffa502', fontWeight: '600' }); }));
      }));
      metrics.child(div(row => {
        row.styles({ display: 'flex', justifyContent: 'space-between' });
        row.child(span(s => { s.textContent('网络流量'); s.styles({ color: '#aaa' }); }));
        row.child(span(s => { s.textContent('↑125 ↓89 MB/s'); s.styles({ color: '#00f5ff', fontWeight: '600' }); }));
      }));
    }));
    
    // 状态指示器
    c.child(div(status => {
      status.styles({ 
        padding: '10px 16px', 
        borderTop: '1px solid rgba(0, 245, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      });
      status.child(span(dot => {
        dot.styles({
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#52c41a',
          boxShadow: '0 0 8px #52c41a'
        });
      }));
      status.child(span(text => {
        text.textContent('运行正常');
        text.styles({ fontSize: '12px', color: '#52c41a' });
      }));
    }));
  }));
}).bindTo('#techborder1');

// 场景 2: 实时告警信息面板
vTechBorder(t => {
  t.color('#ff6b6b', '#ffa502');
  t.borderWidth(2);
  t.animated(false);
  t.content(div(c => {
    c.styles({ padding: '0' });
    
    // 面板标题
    c.child(div(header => {
      header.styles({ 
        padding: '12px 16px', 
        borderBottom: '1px solid rgba(255, 107, 107, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      });
      header.child(div(title => {
        title.styles({ display: 'flex', alignItems: 'center', gap: '8px' });
        title.child(span(s => { s.textContent('⚠️'); s.styles({ fontSize: '18px' }); }));
        title.child(span(s => { 
          s.textContent('实时告警'); 
          s.styles({ fontSize: '14px', fontWeight: '600', color: '#ff6b6b' }); 
        }));
      }));
      header.child(span(badge => {
        badge.textContent('3 条未处理');
        badge.styles({ 
          fontSize: '11px', 
          padding: '2px 8px', 
          background: 'rgba(255, 107, 107, 0.2)',
          color: '#ff6b6b',
          borderRadius: '10px'
        });
      }));
    }));
    
    // 告警列表
    c.child(div(alerts => {
      alerts.styles({ padding: '12px 16px' });
      
      // 告警项 1
      alerts.child(div(alert => {
        alert.styles({ 
          padding: '10px', 
          marginBottom: '8px',
          background: 'rgba(255, 107, 107, 0.1)',
          borderRadius: '4px',
          borderLeft: '3px solid #ff6b6b'
        });
        alert.child(div(line1 => {
          line1.styles({ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' });
          line1.child(span(s => { 
            s.textContent('🔴 严重'); 
            s.styles({ fontSize: '12px', color: '#ff6b6b', fontWeight: '600' }); 
          }));
          line1.child(span(s => { 
            s.textContent('10:23:45'); 
            s.styles({ fontSize: '11px', color: '#888' }); 
          }));
        }));
        alert.child(div(msg => {
          msg.textContent('服务器 CPU 使用率超过 90%');
          msg.styles({ fontSize: '13px', color: '#fff' });
        }));
      }));
      
      // 告警项 2
      alerts.child(div(alert => {
        alert.styles({ 
          padding: '10px', 
          marginBottom: '8px',
          background: 'rgba(255, 165, 2, 0.1)',
          borderRadius: '4px',
          borderLeft: '3px solid #ffa502'
        });
        alert.child(div(line1 => {
          line1.styles({ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' });
          line1.child(span(s => { 
            s.textContent('🟡 警告'); 
            s.styles({ fontSize: '12px', color: '#ffa502', fontWeight: '600' }); 
          }));
          line1.child(span(s => { 
            s.textContent('09:15:30'); 
            s.styles({ fontSize: '11px', color: '#888' }); 
          }));
        }));
        alert.child(div(msg => {
          msg.textContent('数据库连接池使用率超过 80%');
          msg.styles({ fontSize: '13px', color: '#fff' });
        }));
      }));
      
      // 告警项 3
      alerts.child(div(alert => {
        alert.styles({ 
          padding: '10px',
          background: 'rgba(255, 193, 7, 0.1)',
          borderRadius: '4px',
          borderLeft: '3px solid #ffc107'
        });
        alert.child(div(line1 => {
          line1.styles({ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' });
          line1.child(span(s => { 
            s.textContent('🟢 提示'); 
            s.styles({ fontSize: '12px', color: '#ffc107', fontWeight: '600' }); 
          }));
          line1.child(span(s => { 
            s.textContent('08:00:00'); 
            s.styles({ fontSize: '11px', color: '#888' }); 
          }));
        }));
        alert.child(div(msg => {
          msg.textContent('系统自动备份完成');
          msg.styles({ fontSize: '13px', color: '#fff' });
        }));
      }));
    }));
  }));
}).bindTo('#techborder2');

// 8. 综合示例 - 数据看板卡片
vPanel(p => {
  p.title('数据看板');
  p.type('gradient');
  p.color('#667eea', '#764ba2');
  p.content(div(c => {
    c.styles({ padding: '0' });

    // 数据概览
    c.child(div(header => {
      header.styles({
        padding: '16px',
        borderBottom: '1px solid var(--yoya-border-light)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      });
      header.child(span(icon => {
        icon.textContent('📊');
        icon.styles({ fontSize: '20px' });
      }));
      header.child(div(info => {
        info.child(span(title => {
          title.textContent('今日数据');
          title.styles({ fontSize: '14px', fontWeight: '600', color: 'var(--yoya-text-primary)' });
        }));
        info.child(span(subtitle => {
          subtitle.textContent('实时更新中');
          subtitle.styles({ fontSize: '12px', color: 'var(--yoya-text-secondary)' });
        }));
      }));
    }));

    // 数据网格
    c.child(div(grid => {
      grid.styles({
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px'
      });

      // 数据项 1
      grid.child(vGlowBox(g => {
        g.color('#667eea');
        g.glowSize(15);
        g.content(div(item => {
          item.styles({ textAlign: 'center' });
          item.child(span(icon => {
            icon.textContent('👥');
            icon.styles({ fontSize: '24px' });
          }));
          item.child(span(label => {
            label.textContent('用户数');
            label.styles({ display: 'block', fontSize: '12px', color: 'var(--yoya-text-secondary)', marginTop: '8px' });
          }));
          item.child(span(value => {
            value.textContent('12,345');
            value.styles({ display: 'block', fontSize: '24px', fontWeight: 'bold', color: '#667eea', marginTop: '4px' });
          }));
        }));
      }));

      // 数据项 2
      grid.child(vGlowBox(g => {
        g.color('#00f5ff');
        g.glowSize(15);
        g.content(div(item => {
          item.styles({ textAlign: 'center' });
          item.child(span(icon => {
            icon.textContent('💰');
            icon.styles({ fontSize: '24px' });
          }));
          item.child(span(label => {
            label.textContent('销售额');
            label.styles({ display: 'block', fontSize: '12px', color: 'var(--yoya-text-secondary)', marginTop: '8px' });
          }));
          item.child(span(value => {
            value.textContent('¥89,234');
            value.styles({ display: 'block', fontSize: '20px', fontWeight: 'bold', color: '#00f5ff', marginTop: '4px' });
          }));
        }));
      }));

      // 数据项 3
      grid.child(vGlowBox(g => {
        g.color('#ff6b6b');
        g.glowSize(15);
        g.content(div(item => {
          item.styles({ textAlign: 'center' });
          item.child(span(icon => {
            icon.textContent('📦');
            icon.styles({ fontSize: '24px' });
          }));
          item.child(span(label => {
            label.textContent('订单数');
            label.styles({ display: 'block', fontSize: '12px', color: 'var(--yoya-text-secondary)', marginTop: '8px' });
          }));
          item.child(span(value => {
            value.textContent('1,567');
            value.styles({ display: 'block', fontSize: '24px', fontWeight: 'bold', color: '#ff6b6b', marginTop: '4px' });
          }));
        }));
      }));
    }));

    // 底部统计
    c.child(div(footer => {
      footer.styles({
        padding: '16px 20px',
        borderTop: '1px solid var(--yoya-border-light)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      });
      footer.child(span(stat => {
        stat.textContent('📈 较昨日 +15%');
        stat.styles({ fontSize: '13px', color: '#52c41a' });
      }));
      footer.child(span(time => {
        time.textContent('最后更新：' + new Date().toLocaleTimeString('zh-CN'));
        time.styles({ fontSize: '12px', color: 'var(--yoya-text-secondary)' });
      }));
    }));
  }));
}).bindTo('#dashboard-card');

console.log('Dashboard 装饰组件演示页面脚本加载完成');
