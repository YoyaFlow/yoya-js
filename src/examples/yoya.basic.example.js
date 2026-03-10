/**
 * Yoya.Basic - 演示界面
 * 展示 Yoya.Basic HTML DSL 库的功能
 */

import {
  div, span, p, h1, h2, h3, section, article, header, footer, nav, main,
  button, input, textarea, select, option, label, form,
  ul, ol, li, dl, dt, dd,
  table, tr, td, th, thead, tbody,
  a, strong, em, code, pre, blockquote, br, hr,
  img
} from '../yoya/index.js';

// ============================================
// 演示页面样式
// ============================================

const pageStyles = {
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh'
  },
  container: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  header: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px'
  },
  sectionTitle: {
    color: '#667eea',
    borderBottom: '2px solid #667eea',
    paddingBottom: '10px',
    marginBottom: '20px'
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  btnSecondary: {
    background: '#f0f0f0',
    color: '#333',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '500',
    color: '#555'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  dataTable: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  card: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    background: '#fafafa'
  },
  codeBlock: {
    background: '#2d2d2d',
    color: '#f8f8f2',
    padding: '16px',
    borderRadius: '6px',
    overflow: 'auto',
    fontSize: '13px'
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    marginRight: '8px'
  }
};

// ============================================
// 演示模块 1: 基础用法
// ============================================

function createBasicDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('1. 基础用法 - Setup 函数');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(box => {
      box.className('demo-box');
      box.styles({
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '8px'
      });

      box.h1('🎉 Yoya.Basic');
      box.p(p => {
        p.text('这是一个基于 ');
        p.strong(str => {
          str.text('HTML DSL');
          str.styles({ color: '#667eea' });
        });
        p.text(' 的声明式库，提供类似 Kotlin HTML DSL 的语法。');
      });

      box.div(badges => {
        badges.styles({
          'margin-top': '12px'
        });

        const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];
        const texts = ['零配置', 'TypeScript', '流式 API', '虚拟 DOM'];

        texts.forEach((text, i) => {
          badges.span(s => {
            s.className('badge');
            s.text(text);
            s.styles({
              background: colors[i],
              color: 'white'
            });
          });
          if (i < texts.length - 1) {
            badges.text(' ');
          }
        });
      });
    });
  });
}

// ============================================
// 演示模块 2: 表单元素
// ============================================

function createFormDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('2. 表单元素');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(container => {
      container.styles({
        display: 'flex',
        gap: '30px',
        flexWrap: 'wrap'
      });

      // 左侧：表单
      container.div(formContainer => {
        formContainer.styles({
          flex: '1',
          minWidth: '300px'
        });

        formContainer.form(f => {
          f.styles({
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px'
          });

          f.h3('用户反馈');

          f.div(group => {
            group.styles(pageStyles.formGroup);
            group.label(l => {
              l.for('name');
              l.text('姓名');
              l.styles(pageStyles.label);
            });
            group.input(i => {
              i.type('text');
              i.id('name');
              i.placeholder('请输入您的姓名');
              i.styles(pageStyles.input);
            });
          });

          f.div(group => {
            group.styles(pageStyles.formGroup);
            group.label(l => {
              l.for('email');
              l.text('邮箱');
              l.styles(pageStyles.label);
            });
            group.input(i => {
              i.type('email');
              i.id('email');
              i.placeholder('example@email.com');
              i.styles(pageStyles.input);
            });
          });

          f.div(group => {
            group.styles(pageStyles.formGroup);
            group.label(l => {
              l.for('message');
              l.text('留言');
              l.styles(pageStyles.label);
            });
            group.textarea(t => {
              t.id('message');
              t.rows(4);
              t.placeholder('请输入您的留言...');
              t.styles({ ...pageStyles.input, resize: 'vertical' });
            });
          });

          f.div(actions => {
            actions.styles({
              display: 'flex',
              gap: '10px',
              marginTop: '20px'
            });

            actions.button(btn => {
              btn.className('btn-primary');
              btn.type('submit');
              btn.text('提交');
              btn.styles(pageStyles.btnPrimary);
              btn.on('click', (e) => {
                e.preventDefault();
                alert('表单已提交！');
              });
            });

            actions.button(btn => {
              btn.type('reset');
              btn.text('重置');
              btn.styles(pageStyles.btnSecondary);
            });
          });
        });
      });

      // 右侧：代码示例
      container.div(codeContainer => {
        codeContainer.styles({
          flex: '1',
          minWidth: '300px'
        });

        codeContainer.h3('代码示例');

        codeContainer.pre(pre => {
          pre.styles(pageStyles.codeBlock);
          pre.code(c => {
            c.text(`form(f => {
  f.style('background', '#f8f9fa');

  f.div(group => {
    group.label('姓名');
    group.input(i => {
      i.type('text');
      i.placeholder('请输入姓名');
    });
  });

  f.button('提交');
}).bindTo('#app');`);
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 3: 表格（使用扩展方法）
// ============================================

function createTableDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('3. 表格 - 扩展方法');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(tableContainer => {
      tableContainer.styles({
        overflowX: 'auto'
      });

      tableContainer.table(t => {
        t.className('data-table');
        t.styles(pageStyles.dataTable);
        t.styles({ background: 'white' });

        t.thead(head => {
          head.styles({
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          });

          head.tr(row => {
            row.th(th => {
              th.text('姓名');
              th.styles({
                padding: '12px',
                textAlign: 'left'
              });
            });
            row.th(th => {
              th.text('年龄');
              th.styles({
                padding: '12px',
                textAlign: 'left'
              });
            });
            row.th(th => {
              th.text('城市');
              th.styles({
                padding: '12px',
                textAlign: 'left'
              });
            });
            row.th(th => {
              th.text('职位');
              th.styles({
                padding: '12px',
                textAlign: 'left'
              });
            });
          });
        });

        t.tbody(body => {
          const data = [
            { name: '张三', age: '25', city: '北京', role: '前端工程师' },
            { name: '李四', age: '30', city: '上海', role: '后端工程师' },
            { name: '王五', age: '28', city: '广州', role: '全栈工程师' },
            { name: '赵六', age: '35', city: '深圳', role: '技术总监' }
          ];

          data.forEach((item, index) => {
            body.tr(row => {
              row.styles({
                background: index % 2 === 0 ? '#f8f9fa' : 'white',
                padding: '12px',
                borderBottom: '1px solid #eee'
              });
              row.td(td => {
                td.strong(item.name);
                td.styles({
                  padding: '12px',
                  borderBottom: '1px solid #eee'
                });
              });
              row.td(td => {
                td.text(item.age);
                td.styles({
                  padding: '12px',
                  borderBottom: '1px solid #eee'
                });
              });
              row.td(td => {
                td.text(item.city);
                td.styles({
                  padding: '12px',
                  borderBottom: '1px solid #eee'
                });
              });
              row.td(td => {
                td.span(s => {
                  s.text(item.role);
                  s.styles({
                    background: '#667eea',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px'
                  });
                });
                td.styles({
                  padding: '12px',
                  borderBottom: '1px solid #eee'
                });
              });
            });
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 4: 列表
// ============================================

function createListDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('4. 列表组件');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(lists => {
      lists.styles({
        display: 'flex',
        gap: '30px',
        flexWrap: 'wrap'
      });

      // 无序列表
      lists.div(ulContainer => {
        ulContainer.styles({
          flex: '1',
          minWidth: '250px'
        });

        ulContainer.h3('无序列表');

        ulContainer.ul(list => {
          list.styles({
            background: '#f8f9fa',
            padding: '20px 20px 20px 40px',
            borderRadius: '8px',
            listStyleType: 'circle'
          });

          const items = ['零配置使用', 'TypeScript 支持', '流式 API 设计', '虚拟 DOM 优化'];
          items.forEach(item => {
            list.li(li => {
              li.text(item);
              li.styles({
                marginBottom: '10px',
                color: '#555'
              });
            });
          });
        });
      });

      // 有序列表
      lists.div(olContainer => {
        olContainer.styles({
          flex: '1',
          minWidth: '250px'
        });

        olContainer.h3('有序列表');

        olContainer.ol(list => {
          list.styles({
            background: '#f8f9fa',
            padding: '20px 20px 20px 40px',
            borderRadius: '8px'
          });

          const items = ['创建元素', '配置属性', '绑定事件', '渲染到 DOM'];
          items.forEach(item => {
            list.li(li => {
              li.text(item);
              li.styles({
                marginBottom: '10px',
                color: '#555'
              });
            });
          });
        });
      });

      // 定义列表
      lists.div(dlContainer => {
        dlContainer.styles({
          flex: '1',
          minWidth: '250px'
        });

        dlContainer.h3('定义列表');

        dlContainer.dl(list => {
          list.styles({
            background: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px'
          });

          const defs = [
            { term: 'DSL', desc: '领域特定语言' },
            { term: 'ESM', desc: 'ECMAScript 模块' },
            { term: 'DOM', desc: '文档对象模型' }
          ];

          defs.forEach(item => {
            list.dt(dt => {
              dt.strong(item.term);
              dt.styles({ color: '#667eea' });
            });
            list.dd(dd => {
              dd.text(item.desc);
              dd.styles({
                marginBottom: '12px',
                color: '#555'
              });
            });
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 5: 卡片布局
// ============================================

function createCardDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('5. 卡片组件');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(cards => {
      cards.styles({
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap'
      });

      const cardData = [
        {
          title: '🚀 高性能',
          desc: '虚拟 DOM 优化，二次渲染只更新属性',
          color: '#667eea'
        },
        {
          title: '📦 零依赖',
          desc: '纯浏览器环境，无需任何构建工具',
          color: '#764ba2'
        },
        {
          title: '🔒 类型安全',
          desc: '完整的 TypeScript 类型声明支持',
          color: '#f093fb'
        },
        {
          title: '🎨 流式 API',
          desc: '链式调用，代码更简洁优雅',
          color: '#4facfe'
        }
      ];

      cardData.forEach(card => {
        cards.article(c => {
          c.styles({
            flex: '1',
            minWidth: '200px',
            maxWidth: '250px',
            ...pageStyles.card,
            borderTop: `4px solid ${card.color}`
          });

          c.h3(h => {
            h.text(card.title);
            h.styles({
              marginTop: '0',
              color: '#333'
            });
          });

          c.p(p => {
            p.text(card.desc);
            p.styles({
              color: '#666',
              fontSize: '14px',
              lineHeight: '1.6'
            });
          });

          c.hr();

          c.footer(f => {
            f.styles({ textAlign: 'right' });
            f.button(btn => {
              btn.text('了解更多');
              btn.styles({
                background: card.color,
                color: 'white',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              });
            });
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 6: 代码展示
// ============================================

function createCodeDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('6. 代码展示');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(codeBox => {
      codeBox.h3('setup 函数的三种用法');

      section.div(examples => {
        examples.styles({
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap'
        });

        // Setup 函数
        examples.div(example => {
          example.styles({
            flex: '1',
            minWidth: '280px'
          });

          example.h4('1. Setup 函数');

          example.pre(pre => {
            pre.styles(pageStyles.codeBlock);
            pre.code(c => {
              c.text(`div(box => {
  box.className('container');
  box.h1('标题');
  box.button('点击');
}).bindTo('#app');`);
            });
          });
        });

        // Setup 对象
        examples.div(example => {
          example.styles({
            flex: '1',
            minWidth: '280px'
          });

          example.h4('2. Setup 对象');

          example.pre(pre => {
            pre.styles(pageStyles.codeBlock);
            pre.code(c => {
              c.text(`div({
  class: 'container',
  style: { color: 'red' },
  children: [
    h1('标题'),
    button('点击')
  ]
}).bindTo('#app');`);
            });
          });
        });

        // Setup 字符串
        examples.div(example => {
          example.styles({
            flex: '1',
            minWidth: '280px'
          });

          example.h4('3. Setup 字符串');

          example.pre(pre => {
            pre.styles(pageStyles.codeBlock);
            pre.code(c => {
              c.text(`// 直接传入字符串
h1('Hello World')
  .bindTo('#app');

// 或作为子元素
div([
  '文本 1',
  button('按钮'),
  '文本 2'
]);`);
            });
          });
        });
      });
    });
  });
}

// ============================================
// 演示模块 7: 链式调用
// ============================================

function createChainDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('7. 链式调用演示');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(chainContainer => {
      chainContainer.styles({
        textAlign: 'center',
        padding: '30px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: '12px'
      });

      chainContainer.p(intro => {
        intro.text('点击下方按钮，体验流式 API 的魅力');
        intro.styles({
          marginBottom: '20px',
          color: '#555'
        });
      });

      const chainBtn = button(btn => {
        btn.text('✨ 点击我');
        btn.styles({
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          padding: '15px 40px',
          borderRadius: '30px',
          fontSize: '16px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          transition: 'transform 0.2s'
        });
        btn.on('mouseenter', () => {
          chainBtn.styles({ transform: 'scale(1.05)' });
        });
        btn.on('mouseleave', () => {
          chainBtn.styles({ transform: 'scale(1)' });
        });
        btn.on('click', () => {
          alert('🎉 链式调用成功！\n\nYoya.Basic 让 HTML 编写如此优雅！');
        });
      });

      chainContainer.child(chainBtn);

      chainContainer.pre(pre => {
        pre.styles({
          ...pageStyles.codeBlock,
          marginTop: '20px',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto'
        });
        pre.code(c => {
          c.text(`button(btn => {
  btn.text('✨ 点击我');
  btn.style('background', gradient);
  btn.style('border-radius', '30px');
  btn.on('click', () => alert('成功!'));
  btn.on('mouseenter', () => scale(1.05));
  btn.on('mouseleave', () => scale(1));
}).bindTo('#app');`);
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
      color: 'white',
      background: 'rgba(0,0,0,0.2)',
      borderRadius: '12px',
      marginTop: '20px'
    });

    f.p(p => {
      f.text('Yoya.Basic - Browser-native HTML DSL Library');
      f.styles({ marginBottom: '10px' });
    });

    f.p(p => {
      f.text('基于 DESIGN.md 设计规范实现 | ');
      f.a(a => {
        a.href('#');
        a.text('查看文档');
        a.styles({ color: 'white' });
      });
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
        title.text('🎨 Yoya.Basic 演示');
        title.styles({
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        });
      });
      h.p(subtitle => {
        subtitle.text('浏览器原生的 HTML DSL 库');
        subtitle.styles({
          color: '#666',
          marginTop: '10px'
        });
      });
    });

    // 内容区域
    app.main(main => {
      main.styles({
        background: 'white',
        borderRadius: '12px',
        padding: '30px'
      });

      main.child(createBasicDemo());
      main.child(createFormDemo());
      main.child(createTableDemo());
      main.child(createListDemo());
      main.child(createCardDemo());
      main.child(createCodeDemo());
      main.child(createChainDemo());
      main.child(createFooter());
    });
  });
}

// ============================================
// 渲染应用
// ============================================

console.log('🚀 Yoya.Basic 演示页面加载开始...');

// 等待 DOM 加载完成
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('📦 开始渲染演示页面...');

  const app = createApp();
  app.bindTo('#app');

  console.log('✅ 演示页面渲染完成！');
}
