/**
 * Yoya.Basic - 布局组件演示界面
 * 展示 Yoya.Basic 布局组件的功能
 */

import {
  div, span, p, h1, h2, h3, h4, section, br, footer,
  flex, grid, responsiveGrid, stack, hstack, vstack,
  center, spacer, container, divider
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
  },
  // 演示用色块
  box1: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  box2: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  box3: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold'
  }
};

// ============================================
// 演示模块 1: Flex 布局
// ============================================

function createFlexDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('1. Flex 弹性布局');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 主轴方向
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('主轴方向');

        card.div(demo => {
          demo.styles({
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          });
          demo.p(p => {
            p.text('row (默认)');
            p.styles({ fontSize: '12px', color: '#666', marginBottom: '8px' });
          });
          demo.flex(f => {
            f.row();
            f.gap('8px');
            f.div(box => { box.styles(pageStyles.box1); box.text('1'); });
            f.div(box => { box.styles(pageStyles.box2); box.text('2'); });
            f.div(box => { box.styles(pageStyles.box3); box.text('3'); });
          });
        });

        card.div(demo => {
          demo.styles({
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px'
          });
          demo.p(p => {
            p.text('column');
            p.styles({ fontSize: '12px', color: '#666', marginBottom: '8px' });
          });
          demo.flex(f => {
            f.column();
            f.gap('8px');
            f.div(box => { box.styles({ ...pageStyles.box1, width: '60px', height: '40px' }); box.text('1'); });
            f.div(box => { box.styles({ ...pageStyles.box2, width: '60px', height: '40px' }); box.text('2'); });
            f.div(box => { box.styles({ ...pageStyles.box3, width: '60px', height: '40px' }); box.text('3'); });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 水平方向
flex(f => {
  f.row();
  f.gap('8px');
  f.div('1');
  f.div('2');
  f.div('3');
});

// 垂直方向
flex(f => {
  f.column();
  f.gap('8px');
  f.div('1');
  f.div('2');
  f.div('3');
});`);
          });
        });
      });

      // 主轴对齐
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('主轴对齐 (justifyContent)');

        card.div(demo => {
          demo.styles({
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          });
          demo.p(p => {
            p.text('justify-start');
            p.styles({ fontSize: '12px', color: '#666', marginBottom: '8px' });
          });
          demo.flex(f => {
            f.justifyStart();
            f.gap('8px');
            f.div(box => { box.styles(pageStyles.box1); box.text('1'); });
            f.div(box => { box.styles(pageStyles.box2); box.text('2'); });
            f.div(box => { box.styles(pageStyles.box3); box.text('3'); });
          });
        });

        card.div(demo => {
          demo.styles({
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          });
          demo.p(p => {
            p.text('justify-center');
            p.styles({ fontSize: '12px', color: '#666', marginBottom: '8px' });
          });
          demo.flex(f => {
            f.justifyCenter();
            f.gap('8px');
            f.div(box => { box.styles(pageStyles.box1); box.text('1'); });
            f.div(box => { box.styles(pageStyles.box2); box.text('2'); });
            f.div(box => { box.styles(pageStyles.box3); box.text('3'); });
          });
        });

        card.div(demo => {
          demo.styles({
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px'
          });
          demo.p(p => {
            p.text('justify-space-between');
            p.styles({ fontSize: '12px', color: '#666', marginBottom: '8px' });
          });
          demo.flex(f => {
            f.justifyBetween();
            f.gap('8px');
            f.div(box => { box.styles(pageStyles.box1); box.text('1'); });
            f.div(box => { box.styles(pageStyles.box2); box.text('2'); });
            f.div(box => { box.styles(pageStyles.box3); box.text('3'); });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 起始对齐
flex(f => {
  f.justifyStart();
  f.gap('8px');
  f.div('1'); f.div('2'); f.div('3');
});

// 居中对齐
flex(f => {
  f.justifyCenter();
  f.gap('8px');
  f.div('1'); f.div('2'); f.div('3');
});

// 两端对齐
flex(f => {
  f.justifyBetween();
  f.gap('8px');
  f.div('1'); f.div('2'); f.div('3');
});`);
          });
        });
      });

      // 交叉轴对齐
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('交叉轴对齐 (alignItems)');

        card.div(demo => {
          demo.styles({
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            height: '120px'
          });
          demo.p(p => {
            p.text('align-items: center');
            p.styles({ fontSize: '12px', color: '#666', marginBottom: '8px' });
          });
          demo.flex(f => {
            f.alignCenter();
            f.gap('8px');
            f.div(box => {
              box.styles({ ...pageStyles.box1, height: '60px' });
              box.text('高');
            });
            f.div(box => {
              box.styles({ ...pageStyles.box2, height: '40px' });
              box.text('中');
            });
            f.div(box => {
              box.styles({ ...pageStyles.box3, height: '80px' });
              box.text('更高');
            });
          });
        });

        card.div(demo => {
          demo.styles({
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px',
            height: '120px'
          });
          demo.p(p => {
            p.text('align-items: stretch');
            p.styles({ fontSize: '12px', color: '#666', marginBottom: '8px' });
          });
          demo.flex(f => {
            f.alignStretch();
            f.gap('8px');
            f.div(box => {
              box.styles({ ...pageStyles.box1, height: 'auto' });
              box.text('1');
            });
            f.div(box => {
              box.styles({ ...pageStyles.box2, height: 'auto' });
              box.text('2');
            });
            f.div(box => {
              box.styles({ ...pageStyles.box3, height: 'auto' });
              box.text('3');
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 交叉轴居中对齐
flex(f => {
  f.alignCenter();
  f.gap('8px');
  f.div('高');
  f.div('中');
  f.div('更高');
});`);
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 2: Grid 布局
// ============================================

function createGridDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('2. Grid 网格布局');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 基础网格
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('基础网格');

        card.div(demo => {
          demo.styles({
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          });
          demo.p(p => {
            p.text('3 列网格');
            p.styles({ fontSize: '12px', color: '#666', marginBottom: '8px' });
          });
          demo.grid(g => {
            g.columns(3, '1fr');
            g.gap('10px');
            for (let i = 1; i <= 6; i++) {
              g.div(box => {
                box.styles({
                  background: `linear-gradient(135deg, ${i % 2 === 0 ? '#667eea' : '#f093fb'} 0%, ${i % 2 === 0 ? '#764ba2' : '#f5576c'} 100%)`,
                  borderRadius: '8px',
                  padding: '20px',
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold'
                });
                box.text(`项目${i}`);
              });
            }
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 3 列等宽网格
grid(g => {
  g.columns(3, '1fr');
  g.gap('10px');
  g.div('项目 1');
  g.div('项目 2');
  // ...
});`);
          });
        });
      });

      // 响应式网格
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('响应式网格');

        card.div(demo => {
          demo.styles({
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px'
          });
          demo.p(p => {
            p.text('auto-fit (自动适应)');
            p.styles({ fontSize: '12px', color: '#666', marginBottom: '8px' });
          });
          demo.responsiveGrid(g => {
            g.minSize('150px');
            g.gap('10px');
            for (let i = 1; i <= 8; i++) {
              g.div(box => {
                box.styles({
                  background: `linear-gradient(135deg, ${i % 2 === 0 ? '#4facfe' : '#667eea'} 0%, ${i % 2 === 0 ? '#00f2fe' : '#764ba2'} 100%)`,
                  borderRadius: '8px',
                  padding: '20px',
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold'
                });
                box.text(`项目${i}`);
              });
            }
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 响应式网格
responsiveGrid(g => {
  g.minSize('150px');
  g.gap('10px');
  g.div('项目 1');
  // ...
});`);
          });
        });
      });

      // 网格对齐
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('网格间距');

        card.div(demo => {
          demo.styles({
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          });
          demo.p(p => {
            p.text('gap: 10px');
            p.styles({ fontSize: '12px', color: '#666', marginBottom: '8px' });
          });
          demo.grid(g => {
            g.columns(3, '1fr');
            g.gap('10px');
            for (let i = 1; i <= 6; i++) {
              g.div(box => {
                box.styles({
                  background: '#667eea',
                  borderRadius: '8px',
                  padding: '15px',
                  color: 'white',
                  textAlign: 'center'
                });
                box.text(i);
              });
            }
          });
        });

        card.div(demo => {
          demo.styles({
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px'
          });
          demo.p(p => {
            p.text('columnGap / rowGap');
            p.styles({ fontSize: '12px', color: '#666', marginBottom: '8px' });
          });
          demo.grid(g => {
            g.columns(3, '1fr');
            g.columnGap('20px');
            g.rowGap('10px');
            for (let i = 1; i <= 6; i++) {
              g.div(box => {
                box.styles({
                  background: '#f093fb',
                  borderRadius: '8px',
                  padding: '15px',
                  color: 'white',
                  textAlign: 'center'
                });
                box.text(i);
              });
            }
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 统一间距
grid(g => {
  g.columns(3);
  g.gap('10px');
});

// 分别设置
grid(g => {
  g.columns(3);
  g.columnGap('20px');
  g.rowGap('10px');
});`);
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 3: Stack 布局
// ============================================

function createStackDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('3. Stack 堆叠布局');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // VStack
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('VStack 垂直堆叠');

        card.div(demo => {
          demo.styles({
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px'
          });
          demo.vstack(s => {
            s.gap('12px');
            s.div(box => {
              box.styles({ ...pageStyles.box1, width: '100%' });
              box.text('顶部内容');
            });
            s.div(box => {
              box.styles({ ...pageStyles.box2, width: '100%' });
              box.text('中间内容');
            });
            s.div(box => {
              box.styles({ ...pageStyles.box3, width: '100%' });
              box.text('底部内容');
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 垂直堆叠
vstack(s => {
  s.gap('12px');
  s.div('顶部内容');
  s.div('中间内容');
  s.div('底部内容');
});`);
          });
        });
      });

      // HStack
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('HStack 水平堆叠');

        card.div(demo => {
          demo.styles({
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px'
          });
          demo.hstack(s => {
            s.gap('12px');
            s.div(box => {
              box.styles(pageStyles.box1);
              box.text('1');
            });
            s.div(box => {
              box.styles(pageStyles.box2);
              box.text('2');
            });
            s.div(box => {
              box.styles(pageStyles.box3);
              box.text('3');
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 水平堆叠
hstack(s => {
  s.gap('12px');
  s.div('1');
  s.div('2');
  s.div('3');
});`);
          });
        });
      });

      // Stack 带 Spacer
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('Stack + Spacer');

        card.div(demo => {
          demo.styles({
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px'
          });
          demo.hstack(s => {
            s.gap('8px');
            s.div(box => {
              box.styles({ ...pageStyles.box1, width: '60px' });
              box.text('左');
            });
            s.spacer();
            s.div(box => {
              box.styles({ ...pageStyles.box2, width: '60px' });
              box.text('右');
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 两端布局
hstack(s => {
  s.gap('8px');
  s.div('左');
  s.spacer(); // 弹性占位
  s.div('右');
});`);
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 4: Center 布局
// ============================================

function createCenterDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('4. Center 居中布局');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 基础居中
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('完全居中');

        card.div(demo => {
          demo.styles({
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px',
            height: '150px'
          });
          demo.center(c => {
            c.div(box => {
              box.styles(pageStyles.box1);
              box.text('居中');
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 完全居中
center(c => {
  c.div('居中内容');
});`);
          });
        });
      });

      // Container
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('Container 响应式容器');

        card.div(demo => {
          demo.styles({
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px'
          });
          demo.container(c => {
            c.styles({
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              padding: '20px',
              color: 'white'
            });
            c.div('这是一个响应式容器，最大宽度为 1200px，自动居中。');
            c.p(p => {
              p.styles({ marginTop: '10px', opacity: 0.8 });
              p.text('调整浏览器宽度查看效果。');
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 响应式容器
container(c => {
  c.style('background', '#667eea');
  c.style('color', 'white');
  c.div('内容...');
});`);
          });
        });
      });

      // Divider
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('Divider 分割线');

        card.div(demo => {
          demo.styles({
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px'
          });
          demo.div(d => {
            d.text('上方内容');
            d.divider(div => {
              div.styles({ margin: '16px 0' });
            });
            d.text('下方内容');
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 分割线
div(d => {
  d.text('上方内容');
  d.divider();
  d.text('下方内容');
});`);
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 5: 综合示例
// ============================================

function createComplexDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('5. 综合示例');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 卡片布局
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('卡片布局');

        card.responsiveGrid(g => {
          g.minSize('200px');
          g.gap('16px');

          for (let i = 1; i <= 4; i++) {
            g.div(item => {
              item.styles({
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              });
              item.vstack(v => {
                v.gap('12px');
                v.div(title => {
                  title.styles({
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: '#333'
                  });
                  title.text(`卡片标题 ${i}`);
                });
                v.div(content => {
                  content.styles({ color: '#666', fontSize: '14px' });
                  content.text('这是卡片的正文内容，可以放置描述文字、图片等。');
                });
                v.hstack(h => {
                  h.gap('8px');
                  h.button(btn => {
                    btn.styles({
                      padding: '8px 16px',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    });
                    btn.text('操作');
                  });
                  h.spacer();
                  span(s => {
                    s.styles({ color: '#999', fontSize: '12px' });
                    s.text(`发布于 2024-01-${i}`);
                  });
                });
              });
            });
          }
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 响应式卡片布局
responsiveGrid(g => {
  g.minSize('200px');
  g.gap('16px');

  g.div(card => {
    card.vstack(v => {
      v.gap('12px');
      v.div('标题');
      v.div('内容');
      v.hstack(h => {
        h.button('操作');
        h.spacer();
        h.span('日期');
      });
    });
  });
});`);
          });
        });
      });

      // 导航栏示例
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('导航栏布局');

        card.div(nav => {
          nav.styles({
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            padding: '16px 20px'
          });
          nav.hstack(h => {
            h.gap('16px');
            h.div(logo => {
              logo.styles({
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px'
              });
              logo.text('🎨 Yoya');
            });
            h.spacer();
            h.hstack(links => {
              links.gap('20px');
              ['首页', '产品', '关于', '联系'].forEach(text => {
                links.span(link => {
                  link.styles({
                    color: 'rgba(255,255,255,0.8)',
                    cursor: 'pointer',
                    fontSize: '14px'
                  });
                  link.text(text);
                });
              });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 导航栏布局
div(nav => {
  nav.style('background', gradient);
  nav.hstack(h => {
    h.gap('16px');
    h.div('Logo');
    h.spacer(); // 弹性占位
    h.hstack(links => {
      links.gap('20px');
      links.span('首页');
      links.span('产品');
      // ...
    });
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
      f.text('Yoya.Basic Layout - 布局组件库');
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
        title.text('📐 Yoya.Basic Layout 演示');
        title.styles({
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        });
      });
      h.p(subtitle => {
        subtitle.text('Flex / Grid / Stack 布局组件');
        subtitle.styles({
          color: 'rgba(255,255,255,0.8)',
          marginTop: '10px'
        });
      });
    });

    // 内容区域
    app.main(main => {
      main.child(createFlexDemo());
      main.child(createGridDemo());
      main.child(createStackDemo());
      main.child(createCenterDemo());
      main.child(createComplexDemo());
      main.child(createFooter());
    });
  });
}

// ============================================
// 渲染应用
// ============================================

console.log('🚀 Yoya.Basic Layout 演示页面加载开始...');

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('📦 开始渲染 Layout 演示页面...');
  let appEl = document.getElementById("app")
  const app = createApp();
  app.bindTo(appEl);

  console.log('✅ Layout 演示页面渲染完成！');
}
