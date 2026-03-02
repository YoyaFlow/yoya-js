/**
 * Yoya.Basic - Card 组件演示界面
 * 展示 Card 卡片组件的功能
 */

import {
  div, span, p, h1, h2, h3, h4, section, br, footer, button, img,
  flex, hstack, vstack, spacer,
  card, cardHeader, cardBody, cardFooter
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  }
};

// ============================================
// 演示模块 1: 基础卡片
// ============================================

function createBasicCardDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('1. 基础卡片');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 标准卡片
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('标准卡片');

        card.card(c => {
          c.cardHeader(h => {
            h.text('卡片标题');
          });
          c.cardBody(b => {
            b.p(p => {
              p.text('这是卡片的正文内容。卡片组件提供了一致的视觉风格和布局结构。');
              p.styles({ margin: 0, color: '#666', lineHeight: 1.6 });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 标准卡片
card(c => {
  c.cardHeader(h => {
    h.text('卡片标题');
  });
  c.cardBody(b => {
    b.p('正文内容...');
  });
});`);
          });
        });
      });

      // 无边框卡片
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('无边框卡片');

        card.card(c => {
          c.noShadow();
          c.noBorder();
          c.cardBody(b => {
            b.div(d => {
              d.styles({
                padding: '16px'
              });
              d.h3(h => {
                h.text('简洁卡片');
                h.styles({ margin: '0 0 8px 0', fontSize: '18px' });
              });
              d.p(p => {
                p.text('去除了边框和阴影，适合嵌入式内容。');
                p.styles({ margin: 0, color: '#666' });
              });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 无边框无阴影
card(c => {
  c.noShadow();
  c.noBorder();
  c.cardBody(b => {
    b.h3('简洁卡片');
    b.p('内容...');
  });
});`);
          });
        });
      });

      // 边框卡片
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('边框卡片');

        card.card(c => {
          c.bordered();
          c.cardHeader(h => {
            h.text('带边框的卡片');
            h.styles({ color: '#667eea' });
          });
          c.cardBody(b => {
            b.p(p => {
              p.text('使用边框代替阴影，适合扁平化设计风格。');
              p.styles({ margin: 0, color: '#666' });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 边框卡片
card(c => {
  c.bordered();
  c.cardHeader(h => {
    h.text('带边框的卡片');
  });
  c.cardBody(b => {
    b.p('内容...');
  });
});`);
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 2: 可交互卡片
// ============================================

function createInteractiveCardDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('2. 可交互卡片');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 悬浮卡片
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('悬浮效果卡片');

        card.card(c => {
          c.hoverable();
          c.cardHeader(h => {
            h.text('可点击的卡片');
          });
          c.cardBody(b => {
            b.p(p => {
              p.text('鼠标悬停时会有阴影加深的效果，提示用户可以点击。');
              p.styles({ margin: 0, color: '#666' });
            });
          });
          c.cardFooter(f => {
            f.button(btn => {
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
            f.spacer();
            f.span(s => {
              s.styles({ color: '#999', fontSize: '12px' });
              s.text('了解更多 →');
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 悬浮卡片
card(c => {
  c.hoverable();
  c.cardHeader(h => h.text('标题'));
  c.cardBody(b => b.p('内容...'));
  c.cardFooter(f => {
    f.button('操作');
    f.spacer();
    f.span('了解更多');
  });
});`);
          });
        });
      });

      // 图片卡片
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('图片卡片');

        card.card(c => {
          c.styles({ overflow: 'hidden' });
          c.hoverable();

          // 使用 div 模拟图片区域
          c.div(Img => {
            Img.styles({
              width: '100%',
              height: '160px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '48px'
            });
            Img.text('🖼️');
          });

          c.cardBody(b => {
            b.h3(h => {
              h.text('精美图片卡片');
              h.styles({ margin: '12px 0 8px 0', fontSize: '16px' });
            });
            b.p(p => {
              p.text('顶部可以放置图片或封面。');
              p.styles({ margin: 0, color: '#666' });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 图片卡片
card(c => {
  c.hoverable();
  c.div(img => {
    img.style('background', gradient);
    img.text('🖼️');
  });
  c.cardBody(b => {
    b.h3('标题');
    b.p('描述...');
  });
});`);
          });
        });
      });

      // 标签卡片
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('标签卡片');

        card.card(c => {
          c.cardBody(b => {
            b.hstack(h => {
              h.gap('8px');
              ['设计', 'UI', '组件'].forEach(tag => {
                h.span(s => {
                  s.styles({
                    padding: '4px 12px',
                    background: '#f0f0f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#666'
                  });
                  s.text(tag);
                });
              });
            });

            b.h3(h => {
              h.text('带标签的卡片');
              h.styles({ margin: '12px 0 8px 0', fontSize: '16px' });
            });
            b.p(p => {
              p.text('使用 HStack 水平排列标签。');
              p.styles({ margin: 0, color: '#666' });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 标签卡片
card(c => {
  c.cardBody(b => {
    b.hstack(h => {
      h.gap('8px');
      ['设计', 'UI', '组件'].forEach(tag => {
        h.span(s => {
          s.style('background', '#f0f0f0');
          s.text(tag);
        });
      });
    });
    b.h3('标题');
    b.p('描述...');
  });
});`);
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 3: 内容卡片
// ============================================

function createContentCardDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('3. 内容卡片');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 文章卡片
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('文章卡片');

        card.card(c => {
          c.div(Img => {
            Img.styles({
              width: '100%',
              height: '180px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            });
          });

          c.cardHeader(h => {
            h.hstack(header => {
              header.gap('8px');
              header.h3(title => {
                title.text('文章标题');
                title.styles({ margin: 0, fontSize: '16px' });
              });
              header.spacer();
              header.span(date => {
                date.styles({ color: '#999', fontSize: '12px' });
                date.text('2024-01-15');
              });
            });
          });

          c.cardBody(b => {
            b.p(p => {
              p.styles({
                margin: '0 0 12px 0',
                color: '#666',
                lineHeight: 1.6,
                fontSize: '14px'
              });
              p.text('这里是文章的摘要内容，介绍文章的主要观点和核心内容...');
            });
            b.hstack(tags => {
              tags.gap('6px');
              ['#前端', '#技术', '#分享'].forEach(tag => {
                tags.span(t => {
                  t.styles({ fontSize: '12px', color: '#667eea' });
                  t.text(tag);
                });
              });
            });
          });

          c.cardFooter(f => {
            f.hstack(actions => {
              actions.gap('16px');
              ['👍 点赞', '💬 评论', '🔗 分享'].forEach(action => {
                actions.span(a => {
                  a.styles({
                    fontSize: '13px',
                    color: '#666',
                    cursor: 'pointer'
                  });
                  a.text(action);
                });
              });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 文章卡片
card(c => {
  c.div('图片区域');
  c.cardHeader(h => {
    h.hstack(header => {
      header.h3('标题');
      header.spacer();
      header.span('日期');
    });
  });
  c.cardBody(b => {
    b.p('摘要...');
    b.hstack('#标签');
  });
  c.cardFooter(f => {
    f.hstack('操作');
  });
});`);
          });
        });
      });

      // 用户资料卡片
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('用户资料卡片');

        card.card(c => {
          c.styles({ textAlign: 'center' });

          c.cardBody(b => {
            // 头像
            b.div(avatar => {
              avatar.styles({
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '32px'
              });
              avatar.text('👤');
            });

            b.h3(name => {
              name.text('张三');
              name.styles({ margin: '0 0 4px 0', fontSize: '18px' });
            });

            b.p(role => {
              role.text('前端工程师');
              role.styles({ margin: '0 0 16px 0', color: '#999', fontSize: '14px' });
            });

            b.p(bio => {
              bio.text('热爱编程，专注前端开发 5 年。喜欢分享技术心得。');
              bio.styles({ margin: '0 0 20px 0', color: '#666', lineHeight: 1.6 });
            });
          });

          c.cardFooter(f => {
            f.hstack(btns => {
              btns.gap('8px');

              btns.button(follow => {
                follow.styles({
                  flex: 1,
                  padding: '10px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                });
                follow.text('关注');
              });

              btns.button(message => {
                message.styles({
                  flex: 1,
                  padding: '10px',
                  background: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                });
                message.text('私信');
              });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 用户资料卡片
card(c => {
  c.cardBody(b => {
    b.div('头像');
    b.h3('用户名');
    b.p('职位');
    b.p('个人简介...');
  });
  c.cardFooter(f => {
    f.hstack(btns => {
      btns.button('关注');
      btns.button('私信');
    });
  });
});`);
          });
        });
      });

      // 统计数据卡片
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('统计数据卡片');

        card.card(c => {
          c.cardBody(b => {
            b.hstack(row => {
              row.gap('16px');
              row.alignItems('center');

              // 图标
              row.div(icon => {
                icon.styles({
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px'
                });
                icon.text('📊');
              });

              // 数据
              row.div(data => {
                data.vstack(col => {
                  col.gap('4px');

                  col.span(label => {
                    label.styles({ fontSize: '13px', color: '#999' });
                    label.text('总访问量');
                  });

                  col.span(value => {
                    value.styles({ fontSize: '28px', fontWeight: 'bold', color: '#333' });
                    value.text('123,456');
                  });
                });
              });

              row.spacer();

              // 增长率
              row.div(growth => {
                growth.styles({
                  padding: '6px 12px',
                  background: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: '20px',
                  color: '#667eea',
                  fontWeight: '600',
                  fontSize: '14px'
                });
                growth.text('+23.5% 📈');
              });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 统计数据卡片
card(c => {
  c.cardBody(b => {
    b.hstack(row => {
      row.div('图标');
      row.div(data => {
        data.vstack(col => {
          col.span('标签');
          col.span('123,456');
        });
      });
      row.spacer();
      row.div('+23.5%');
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
// 演示模块 4: 特殊卡片
// ============================================

function createSpecialCardDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('4. 特殊卡片');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles(pageStyles.grid);

      // 警告卡片
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('警告卡片');

        card.card(c => {
          c.styles({
            borderLeft: '4px solid #f5576c',
            background: '#fff5f5'
          });
          c.noShadow();
          c.noBorder();

          c.cardBody(b => {
            b.hstack(row => {
              row.gap('12px');
              row.alignItems('center');

              row.div(icon => {
                icon.styles({ fontSize: '24px' });
                icon.text('⚠️');
              });

              row.div(content => {
                content.vstack(col => {
                  col.gap('4px');

                  col.span(title => {
                    title.styles({ fontWeight: '600', color: '#c53030' });
                    title.text('警告信息');
                  });

                  col.span(desc => {
                    desc.styles({ fontSize: '13px', color: '#777' });
                    desc.text('这是一个警告类型的提示卡片。');
                  });
                });
              });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 警告卡片
card(c => {
  c.style('borderLeft', '4px solid #f5576c');
  c.style('background', '#fff5f5');
  c.noShadow();
  c.noBorder();
  c.cardBody(b => {
    b.hstack(row => {
      row.div('⚠️');
      row.div('内容...');
    });
  });
});`);
          });
        });
      });

      // 成功卡片
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('成功卡片');

        card.card(c => {
          c.styles({
            borderLeft: '4px solid #48c774',
            background: '#f0fff4'
          });
          c.noShadow();
          c.noBorder();

          c.cardBody(b => {
            b.hstack(row => {
              row.gap('12px');
              row.alignItems('center');

              row.div(icon => {
                icon.styles({ fontSize: '24px' });
                icon.text('✅');
              });

              row.div(content => {
                content.vstack(col => {
                  col.gap('4px');

                  col.span(title => {
                    title.styles({ fontWeight: '600', color: '#2f855a' });
                    title.text('操作成功');
                  });

                  col.span(desc => {
                    desc.styles({ fontSize: '13px', color: '#777' });
                    desc.text('您的操作已成功完成！');
                  });
                });
              });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 成功卡片
card(c => {
  c.style('borderLeft', '4px solid #48c774');
  c.style('background', '#f0fff4');
  c.noShadow();
  c.noBorder();
  c.cardBody(b => {
    b.hstack(row => {
      row.div('✅');
      row.div('内容...');
    });
  });
});`);
          });
        });
      });

      // 渐变卡片
      container.div(card => {
        card.styles(pageStyles.demoBox);
        card.h4('渐变卡片');

        card.card(c => {
          c.styles({
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          });
          c.noShadow();
          c.noBorder();

          c.cardBody(b => {
            b.h3(title => {
              title.text('✨ 精美渐变');
              title.styles({ margin: '0 0 8px 0', fontSize: '18px' });
            });
            b.p(desc => {
              desc.text('使用渐变色背景打造视觉冲击力强的卡片效果。');
              desc.styles({ margin: 0, opacity: 0.9 });
            });
          });
        });

        card.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`// 渐变卡片
card(c => {
  c.style('background',
    'linear-gradient(135deg, #667eea, #764ba2)');
  c.style('color', 'white');
  c.noShadow();
  c.noBorder();
  c.cardBody(b => {
    b.h3('标题');
    b.p('描述...');
  });
});`);
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 5: 卡片网格
// ============================================

function createCardGridDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('5. 卡片网格布局');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.responsiveGrid(grid => {
        grid.minSize('250px');
        grid.gap('20px');

        const cards = [
          { icon: '🎨', title: '设计', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
          { icon: '🚀', title: '性能', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
          { icon: '🔒', title: '安全', color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
          { icon: '📱', title: '移动端', color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
        ];

        cards.forEach(item => {
          grid.card(c => {
            c.hoverable();
            c.styles({ textAlign: 'center' });

            c.cardBody(b => {
              b.div(icon => {
                icon.styles({
                  width: '70px',
                  height: '70px',
                  borderRadius: '16px',
                  background: item.color,
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px'
                });
                icon.text(item.icon);
              });

              b.h3(title => {
                title.text(item.title);
                title.styles({ margin: '0 0 8px 0', fontSize: '16px', color: '#333' });
              });

              b.p(desc => {
                desc.text(`这是${item.title}相关的描述内容，介绍该功能的特点和优势。`);
                desc.styles({ margin: 0, color: '#666', fontSize: '13px', lineHeight: 1.5 });
              });
            });
          });
        });
      });

      container.pre(pre => {
        pre.styles(pageStyles.codeBlock);
        pre.code(c => {
          c.text(`// 响应式卡片网格
section.responsiveGrid(grid => {
  grid.minSize('250px');
  grid.gap('20px');

  cards.forEach(item => {
    grid.card(c => {
      c.hoverable();
      c.cardBody(b => {
        b.div('图标');
        b.h3(item.title);
        b.p('描述...');
      });
    });
  });
});`);
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
      f.text('Yoya.Basic Card - 卡片组件库');
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
        title.text('📦 Yoya.Basic Card 演示');
        title.styles({
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        });
      });
      h.p(subtitle => {
        subtitle.text('灵活多样的卡片组件');
        subtitle.styles({
          color: 'rgba(255,255,255,0.8)',
          marginTop: '10px'
        });
      });
    });

    // 内容区域
    app.main(main => {
      main.child(createBasicCardDemo());
      main.child(createInteractiveCardDemo());
      main.child(createContentCardDemo());
      main.child(createSpecialCardDemo());
      main.child(createCardGridDemo());
      main.child(createFooter());
    });
  });
}

// ============================================
// 渲染应用
// ============================================

console.log('🚀 Yoya.Basic Card 演示页面加载开始...');

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('📦 开始渲染 Card 演示页面...');
  let appEl = document.getElementById("app");
  const app = createApp();
  app.bindTo(appEl);

  console.log('✅ Card 演示页面渲染完成！');
}
