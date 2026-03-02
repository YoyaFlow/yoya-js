/**
 * Yoya.Basic - SVG 演示界面
 * 展示 Yoya.Basic SVG 组件的功能
 */

import {
  div, span, p, h1, h2, h3, h4, section, br, footer,
  svg, circle, rect, ellipse, line, polyline, polygon, path, svgText, tspan, g, defs,
  linearGradient, radialGradient, stop, pattern, filter, svgImage
} from '../yoya/index.js';

// ============================================
// 演示页面样式
// ============================================

const pageStyles = {
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '40px'
  },
  sectionTitle: {
    color: '#4facfe',
    borderBottom: '2px solid #4facfe',
    paddingBottom: '10px',
    marginBottom: '20px'
  },
  demoBox: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px'
  },
  codeBlock: {
    background: '#2d2d2d',
    color: '#f8f8f2',
    padding: '16px',
    borderRadius: '6px',
    overflow: 'auto',
    fontSize: '13px',
    marginTop: '10px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  }
};

// ============================================
// 演示模块 1: 基础形状
// ============================================

function createBasicShapesDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('1. 基础形状');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 圆形和椭圆
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('圆形与椭圆');

        card.svg(s => {
          s.viewBox(0, 0, 200, 100);
          s.width(200);
          s.height(100);

          // 圆形
          s.circle(c => {
            c.cx(50).cy(50).r(40);
            c.styles({ fill: '#667eea' });
          });

          // 椭圆
          s.ellipse(e => {
            e.cx(150).cy(50).rx(40).ry(25);
            e.styles({ fill: '#764ba2' });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 圆形
svg(s => {
  s.circle(c => {
    c.cx(50).cy(50).r(40);
    c.style('fill', '#667eea');
  });

  // 椭圆
  s.ellipse(e => {
    e.cx(150).cy(50).rx(40).ry(25);
  });
});`);
          });
        });
      });

      // 矩形
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('矩形');

        card.svg(s => {
          s.viewBox(0, 0, 200, 100);
          s.width(200);
          s.height(100);

          // 普通矩形
          s.rect(r => {
            r.x(10).y(10).width(80).height(60);
            r.styles({ fill: '#f093fb' });
          });

          // 圆角矩形
          s.rect(r => {
            r.x(110).y(10).width(80).height(60).rx(15).ry(15);
            r.styles({ fill: '#4facfe' });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 矩形
s.rect(r => {
  r.x(10).y(10).width(80).height(60);
  r.style('fill', '#f093fb');
});

// 圆角矩形
s.rect(r => {
  r.x(110).y(10).width(80).height(60);
  r.rx(15).ry(15);
});`);
          });
        });
      });

      // 线条
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('线条');

        card.svg(s => {
          s.viewBox(0, 0, 200, 100);
          s.width(200);
          s.height(100);

          // 直线
          s.line(l => {
            l.x1(10).y1(50).x2(190).y2(50);
            l.styles({ stroke: '#667eea', strokeWidth: 4 });
          });

          // 折线
          s.polyline(p => {
            p.points([[10, 20], [50, 80], [90, 20], [130, 80], [170, 20]]);
            p.styles({ fill: 'none', stroke: '#764ba2', strokeWidth: 3 });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 直线
s.line(l => {
  l.x1(10).y1(50).x2(190).y2(50);
  l.style('stroke', '#667eea');
});

// 折线
s.polyline(p => {
  p.points([[10,20], [50,80], [90,20]]);
  p.style('stroke', '#764ba2');
});`);
          });
        });
      });

      // 多边形
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('多边形');

        card.svg(s => {
          s.viewBox(0, 0, 200, 100);
          s.width(200);
          s.height(100);

          // 三角形
          s.polygon(p => {
            p.points([[50, 10], [90, 90], [10, 90]]);
            p.styles({ fill: '#f093fb' });
          });

          // 五边形
          s.polygon(p => {
            p.points([[150, 10], [170, 40], [160, 80], [140, 80], [130, 40]]);
            p.styles({ fill: '#4facfe' });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 三角形
s.polygon(p => {
  p.points([[50,10], [90,90], [10,90]]);
  p.style('fill', '#f093fb');
});`);
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 2: 路径
// ============================================

function createPathDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('2. 路径 Path');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 链式路径
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('链式路径方法');

        card.svg(s => {
          s.viewBox(0, 0, 200, 120);
          s.width(200);
          s.height(120);

          // 三角形路径
          s.path(p => {
            p.moveTo(100, 10);
            p.lineTo(190, 110);
            p.lineTo(10, 110);
            p.closePath();
            p.styles({ fill: '#667eea', opacity: 0.8 });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 链式方法绘制三角形
s.path(p => {
  p.moveTo(100, 10);
  p.lineTo(190, 110);
  p.lineTo(10, 110);
  p.closePath();
  p.style('fill', '#667eea');
});`);
          });
        });
      });

      // 曲线路径
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('曲线');

        card.svg(s => {
          s.viewBox(0, 0, 200, 100);
          s.width(200);
          s.height(100);

          // 二次贝塞尔曲线
          s.path(p => {
            p.d('M 10 50 Q 100 10 190 50');
            p.styles({ fill: 'none', stroke: '#764ba2', strokeWidth: 2 });
          });

          // 三次贝塞尔曲线
          s.path(p => {
            p.d('M 10 80 C 60 20, 140 20, 190 80');
            p.styles({ fill: 'none', stroke: '#f093fb', strokeWidth: 2 });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 二次贝塞尔曲线
s.path(p => {
  p.d('M 10 50 Q 100 10 190 50');
  p.style('stroke', '#764ba2');
});

// 三次贝塞尔曲线
s.path(p => {
  p.d('M 10 80 C 60 20, 140 20, 190 80');
  p.style('stroke', '#f093fb');
});`);
          });
        });
      });

      // 复杂路径
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('星形路径');

        card.svg(s => {
          s.viewBox(0, 0, 200, 200);
          s.width(200);
          s.height(200);

          // 五角星
          s.path(p => {
            p.d(starPath);
            p.styles({ fill: '#f093fb', stroke: '#4facfe', strokeWidth: 2 });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 五角星路径
const starPath = 'M 100 10 L 120 70 L 190 70 L 135 110 L 155 180 L 100 140 L 45 180 L 65 110 L 10 70 L 80 70 Z';

s.path(p => {
  p.d(starPath);
  p.style('fill', '#f093fb');
  p.style('stroke', '#4facfe');
});`);
          });
        });
      });
    });
  });
}

const starPath = 'M 100 10 L 120 70 L 190 70 L 135 110 L 155 180 L 100 140 L 45 180 L 65 110 L 10 70 L 80 70 Z';

// ============================================
// 演示模块 3: 渐变
// ============================================

function createGradientDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('3. 渐变 Gradient');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 线性渐变
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('线性渐变');

        card.svg(s => {
          s.viewBox(0, 0, 200, 150);
          s.width(200);
          s.height(150);

          s.defs(d => {
            d.linearGradient(g => {
              g.id('linearGrad');
              g.x1(0).y1(0).x2(1).y2(1);
              g.stop(0, '#667eea', 1);
              g.stop(100, '#764ba2', 1);
            });
          });

          s.rect(r => {
            r.x(20).y(20).width(160).height(100).rx(10);
            r.styles({ fill: 'url(#linearGrad)' });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 线性渐变
svg(s => {
  s.defs(d => {
    d.linearGradient(g => {
      g.id('grad');
      g.x1(0).y1(0).x2(1).y2(1);
      g.stop(0, '#667eea');
      g.stop(100, '#764ba2');
    });
  });

  s.rect(r => {
    r.style('fill', 'url(#grad)');
  });
});`);
          });
        });
      });

      // 径向渐变
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('径向渐变');

        card.svg(s => {
          s.viewBox(0, 0, 200, 150);
          s.width(200);
          s.height(150);

          s.defs(d => {
            d.radialGradient(g => {
              g.id('radialGrad');
              g.cx(0.5).cy(0.5).r(0.5);
              g.stop(0, '#f093fb', 1);
              g.stop(100, '#4facfe', 1);
            });
          });

          s.circle(c => {
            c.cx(100).cy(75).r(60);
            c.styles({ fill: 'url(#radialGrad)' });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 径向渐变
svg(s => {
  s.defs(d => {
    d.radialGradient(g => {
      g.id('grad');
      g.cx(0.5).cy(0.5).r(0.5);
      g.stop(0, '#f093fb');
      g.stop(100, '#4facfe');
    });
  });

  s.circle(c => {
    c.cx(100).cy(75).r(60);
    c.style('fill', 'url(#grad)');
  });
});`);
          });
        });
      });

      // 渐变应用
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('渐变组合');

        card.svg(s => {
          s.viewBox(0, 0, 200, 150);
          s.width(200);
          s.height(150);

          s.defs(d => {
            d.linearGradient(g => {
              g.id('bgGrad');
              g.x1(0).y1(0).x2(0).y2(1);
              g.stop(0, '#667eea');
              g.stop(100, '#764ba2');
            });
          });

          // 背景
          s.rect(r => {
            r.x(10).y(10).width(180).height(130).rx(15);
            r.styles({ fill: 'url(#bgGrad)' });
          });

          // 装饰圆
          s.circle(c => {
            c.cx(50).cy(50).r(20);
            c.styles({ fill: 'rgba(255,255,255,0.3)' });
          });

          s.circle(c => {
            c.cx(150).cy(100).r(30);
            c.styles({ fill: 'rgba(255,255,255,0.2)' });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 组合使用渐变
s.defs(d => {
  d.linearGradient(g => {
    g.id('bgGrad');
    g.stop(0, '#667eea');
    g.stop(100, '#764ba2');
  });
});

s.rect(r => {
  r.style('fill', 'url(#bgGrad)');
});`);
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 4: 文本
// ============================================

function createTextDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('4. 文本');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 基础文本
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('基础文本');

        card.svg(s => {
          s.viewBox(0, 0, 250, 100);
          s.width(250);
          s.height(100);

          s.text(t => {
            t.x(125).y(40).text('Hello SVG');
            t.styles({
              fill: '#667eea',
              fontSize: '24px',
              fontWeight: 'bold',
              textAnchor: 'middle'
            });
          });

          s.text(t => {
            t.x(125).y(70).text('矢量图形库');
            t.styles({
              fill: '#764ba2',
              fontSize: '18px',
              textAnchor: 'middle'
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// SVG 文本
svg(s => {
  s.text(t => {
    t.x(125).y(40);
    t.text('Hello SVG');
    t.style('fill', '#667eea');
    t.style('font-size', '24px');
    t.style('text-anchor', 'middle');
  });
});`);
          });
        });
      });

      // Tspan 多行文本
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('Tspan 多行文本');

        card.svg(s => {
          s.viewBox(0, 0, 200, 120);
          s.width(200);
          s.height(120);

          s.text(t => {
            t.x(100).y(30).text('多行文本');
            t.styles({
              fill: '#4facfe',
              fontSize: '18px',
              fontWeight: 'bold',
              textAnchor: 'middle'
            });

            t.tspan(ts => {
              ts.x(100).dy(25).text('第一行内容');
              ts.styles({ fill: '#667eea', fontSize: '14px' });
            });

            t.tspan(ts => {
              ts.x(100).dy(25).text('第二行内容');
              ts.styles({ fill: '#764ba2', fontSize: '14px' });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// Tspan 多行文本
s.text(t => {
  t.x(100).y(30).text('标题');

  t.tspan(ts => {
    ts.x(100).dy(25);
    ts.text('第一行');
    ts.style('fill', '#667eea');
  });

  t.tspan(ts => {
    ts.x(100).dy(25);
    ts.text('第二行');
  });
});`);
          });
        });
      });

      // 文本变换
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('文本变换');

        card.svg(s => {
          s.viewBox(0, 0, 200, 100);
          s.width(200);
          s.height(100);

          s.g(grp => {
            grp.translate(100, 50);
            grp.rotate(-10);

            grp.rect(r => {
              r.x(-60).y(-20).width(120).height(40).rx(8);
              r.styles({ fill: '#f093fb', opacity: 0.8 });
            });

            grp.text(t => {
              t.x(0).y(5).text('旋转文本');
              t.styles({
                fill: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                textAnchor: 'middle'
              });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 组变换
s.g(g => {
  g.translate(100, 50);
  g.rotate(-10);

  g.rect(r => {
    r.x(-60).y(-20).width(120).height(40);
  });

  g.text(t => {
    t.x(0).y(5).text('旋转文本');
  });
});`);
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 5: 滤镜效果
// ============================================

function createFilterDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('5. 滤镜效果');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 模糊滤镜
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('模糊滤镜');

        card.svg(s => {
          s.viewBox(0, 0, 200, 100);
          s.width(200);
          s.height(100);

          s.defs(d => {
            d.filter('blur', f => {
              f.gaussianBlur(3);
            });
          });

          s.rect(r => {
            r.x(20).y(20).width(60).height(60).rx(8);
            r.styles({ fill: '#667eea' });
          });

          s.rect(r => {
            r.x(120).y(20).width(60).height(60).rx(8);
            r.styles({ fill: '#667eea', filter: 'url(#blur)' });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 高斯模糊滤镜
s.defs(d => {
  d.filter('blur', f => {
    f.gaussianBlur(3);
  });
});

// 正常
s.rect(r => {
  r.style('fill', '#667eea');
});

// 模糊效果
s.rect(r => {
  r.style('filter', 'url(#blur)');
});`);
          });
        });
      });

      // 阴影滤镜
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('阴影滤镜');

        card.svg(s => {
          s.viewBox(0, 0, 200, 100);
          s.width(200);
          s.height(100);

          s.defs(d => {
            d.filter('shadow', f => {
              f.dropShadow(2, 2, 3, '#000', 0.5);
            });
          });

          s.circle(c => {
            c.cx(50).cy(50).r(35);
            c.styles({ fill: '#764ba2', filter: 'url(#shadow)' });
          });

          s.rect(r => {
            r.x(120).y(15).width(60).height(70).rx(8);
            r.styles({ fill: '#f093fb', filter: 'url(#shadow)' });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 投影滤镜
s.defs(d => {
  d.filter('shadow', f => {
    f.dropShadow(2, 2, 3, '#000', 0.5);
  });
});

s.circle(c => {
  c.cx(50).cy(50).r(35);
  c.style('filter', 'url(#shadow)');
});`);
          });
        });
      });

      // 组合效果
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('组合效果');

        card.svg(s => {
          s.viewBox(0, 0, 200, 100);
          s.width(200);
          s.height(100);

          s.defs(d => {
            d.linearGradient(g => {
              g.id('cardGrad');
              g.x1(0).y1(0).x2(1).y2(1);
              g.stop(0, '#667eea');
              g.stop(100, '#764ba2');
            });

            d.filter('cardShadow', f => {
              f.dropShadow(2, 4, 6, '#000', 0.4);
            });
          });

          s.rect(r => {
            r.x(20).y(10).width(160).height(80).rx(12);
            r.styles({
              fill: 'url(#cardGrad)',
              filter: 'url(#cardShadow)'
            });
          });

          s.text(t => {
            t.x(100).y(60).text('卡片效果');
            t.styles({
              fill: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              textAnchor: 'middle'
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 渐变 + 阴影组合
s.defs(d => {
  d.linearGradient(g => {
    g.id('cardGrad');
    g.stop(0, '#667eea');
    g.stop(100, '#764ba2');
  });

  d.filter('cardShadow', f => {
    f.dropShadow(2, 4, 6, '#000', 0.4);
  });
});

s.rect(r => {
  r.style('fill', 'url(#cardGrad)');
  r.style('filter', 'url(#cardShadow)');
});`);
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 6: 组与变换
// ============================================

function createTransformDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('6. 组与变换');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 平移
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('平移 Translate');

        card.svg(s => {
          s.viewBox(0, 0, 200, 100);
          s.width(200);
          s.height(100);

          // 原始位置
          s.rect(r => {
            r.x(10).y(10).width(40).height(40).rx(4);
            r.styles({ fill: '#667eea', opacity: 0.5 });
          });

          // 平移后
          s.g(grp => {
            grp.translate(60, 30);
            grp.rect(r => {
              r.x(10).y(10).width(40).height(40).rx(4);
              r.styles({ fill: '#764ba2' });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 平移变换
s.g(g => {
  g.translate(60, 30);
  g.rect(r => {
    r.x(10).y(10).width(40).height(40);
  });
});`);
          });
        });
      });

      // 旋转
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('旋转 Rotate');

        card.svg(s => {
          s.viewBox(0, 0, 100, 100);
          s.width(100);
          s.height(100);

          // 中心点
          s.circle(c => {
            c.cx(50).cy(50).r(3);
            c.styles({ fill: '#666' });
          });

          // 旋转的矩形
          s.g(grp => {
            grp.translate(50, 50);
            grp.rotate(45);
            grp.rect(r => {
              r.x(-30).y(-10).width(60).height(20).rx(4);
              r.styles({ fill: '#f093fb' });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 旋转变换
s.g(g => {
  g.translate(50, 50);  // 移到中心
  g.rotate(45);         // 旋转 45 度
  g.rect(r => {
    r.x(-30).y(-10).width(60).height(20);
  });
});`);
          });
        });
      });

      // 缩放
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('缩放 Scale');

        card.svg(s => {
          s.viewBox(0, 0, 200, 100);
          s.width(200);
          s.height(100);

          // 原始大小
          s.circle(c => {
            c.cx(50).cy(50).r(25);
            c.styles({ fill: '#667eea', opacity: 0.5 });
          });

          // 放大
          s.g(grp => {
            grp.translate(150, 50);
            grp.scale(1.5);
            grp.circle(c => {
              c.cx(0).cy(0).r(25);
              c.styles({ fill: '#764ba2' });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 缩放变换
s.g(g => {
  g.translate(150, 50);
  g.scale(1.5);
  g.circle(c => {
    c.cx(0).cy(0).r(25);
  });
});`);
          });
        });
      });
    });
  });
}

// ============================================
// 页脚
// ============================================

function createFooter() {
  return footer(f => {
    f.styles({
      textAlign: 'center',
      padding: '30px',
      color: 'rgba(255,255,255,0.7)',
      marginTop: '40px'
    });

    f.p(p => {
      f.text('Yoya.Basic SVG - 矢量图形组件库');
      f.styles({ marginBottom: '10px' });
    });
  });
}

// ============================================
// 主应用
// ============================================

function createApp() {
  return div(app => {
    app.styles(pageStyles.body);

    // 页面标题
    app.header(h => {
      h.styles(pageStyles.header);
      h.h1(title => {
        title.text('🎨 Yoya.Basic SVG 演示');
        title.styles({
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        });
      });
      h.p(subtitle => {
        subtitle.text('浏览器原生的 SVG 图形库');
        subtitle.styles({
          color: 'rgba(255,255,255,0.8)',
          marginTop: '10px'
        });
      });
    });

    // 内容区域
    app.main(main => {
      main.child(createBasicShapesDemo());
      main.child(createPathDemo());
      main.child(createGradientDemo());
      main.child(createTextDemo());
      main.child(createFilterDemo());
      main.child(createTransformDemo());
      main.child(createFooter());
    });
  });
}

// ============================================
// 渲染应用
// ============================================

console.log('🚀 Yoya.Basic SVG 演示页面加载开始...');

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('📦 开始渲染 SVG 演示页面...');
  let appEl = document.getElementById("app")
  const app = createApp();
  app.bindTo(appEl);

  console.log('✅ SVG 演示页面渲染完成！');
}
