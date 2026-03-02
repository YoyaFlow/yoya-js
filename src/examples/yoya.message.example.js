/**
 * Yoya.Basic - Message 组件演示
 */

import {
  div, button, h1, p, section, pre, code, toast
} from '../yoya/index.js';

// ============================================
// 演示页面样式
// ============================================

const pageStyles = {
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  sectionTitle: {
    color: '#333',
    borderBottom: '2px solid #667eea',
    paddingBottom: '10px',
    marginBottom: '20px'
  },
  demoBox: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  codeBlock: {
    background: '#2d2d2d',
    color: '#f8f8f2',
    padding: '16px',
    borderRadius: '6px',
    overflow: 'auto',
    fontSize: '13px',
    marginTop: '16px'
  }
};

const buttonStyles = {
  success: {
    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    color: 'white'
  },
  error: {
    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
    color: 'white'
  },
  warning: {
    background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
    color: '#333'
  },
  info: {
    background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
    color: 'white'
  },
  clear: {
    background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
    color: 'white'
  }
};

// ============================================
// 演示模块 1: 基础消息
// ============================================

function createBasicDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('1. 基础消息类型');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(card => {
      card.styles(pageStyles.demoBox);

      card.p(p => {
        p.text('点击按钮查看不同类型的消息提示：');
        p.styles({ marginBottom: '16px', color: '#666' });
      });

      card.div(btnGroup => {
        btnGroup.styles(pageStyles.buttonGroup);

        // 成功消息
        btnGroup.button(successBtn => {
          successBtn.styles({
            ...pageStyles.button,
            ...buttonStyles.success
          });
          successBtn.text('✓ 成功消息');
          successBtn.on('click', () => {
            console.log("✓ 成功消息 操作成功完成！")
            toast.success('操作成功完成！');
          });
        });

        // 错误消息
        btnGroup.button(errorBtn => {
          errorBtn.styles({
            ...pageStyles.button,
            ...buttonStyles.error
          });
          errorBtn.text('✕ 错误消息');
          errorBtn.on('click', () => {
            toast.error('操作失败，请重试！');
          });
        });

        // 警告消息
        btnGroup.button(warningBtn => {
          warningBtn.styles({
            ...pageStyles.button,
            ...buttonStyles.warning
          });
          warningBtn.text('⚠ 警告消息');
          warningBtn.on('click', () => {
            toast.warning('请注意此操作的影响！');
          });
        });

        // 信息消息
        btnGroup.button(infoBtn => {
          infoBtn.styles({
            ...pageStyles.button,
            ...buttonStyles.info
          });
          infoBtn.text('ℹ 信息消息');
          infoBtn.on('click', () => {
            toast.info('这是一个普通信息提示！');
          });
        });
      });

      // 源码
      card.pre(pre => {
        pre.styles(pageStyles.codeBlock);
        pre.code(c => {
          c.text(`// 导入
import { toast } from '../yoya/index.js';

// 成功消息
toast.success('操作成功完成！');

// 错误消息
toast.error('操作失败，请重试！');

// 警告消息
toast.warning('请注意此操作的影响！');

// 信息消息
toast.info('这是一个普通信息提示！');`);
        });
      });
    });
  });
}

// ============================================
// 演示模块 2: 消息时长
// ============================================

function createDurationDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('2. 自定义消息时长');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(card => {
      card.styles(pageStyles.demoBox);

      card.p(p => {
        p.text('点击按钮查看不同时长的消息：');
        p.styles({ marginBottom: '16px', color: '#666' });
      });

      card.div(btnGroup => {
        btnGroup.styles(pageStyles.buttonGroup);

        // 3 秒自动关闭
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.info });
          btn.text('3 秒关闭');
          btn.on('click', () => {
            toast.info('3 秒后自动关闭', 'info', 3000);
          });
        });

        // 5 秒自动关闭
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.info });
          btn.text('5 秒关闭');
          btn.on('click', () => {
            toast.info('5 秒后自动关闭', 'info', 5000);
          });
        });

        // 不自动关闭
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.info });
          btn.text('不自动关闭');
          btn.on('click', () => {
            toast.info('请点击 × 关闭', 'info', 0);
          });
        });
      });

      // 源码
      card.pre(pre => {
        pre.styles(pageStyles.codeBlock);
        pre.code(c => {
          c.text(`// 3 秒后自动关闭（默认）
toast.info('消息内容');

// 5 秒后自动关闭
toast.info('消息内容', 'info', 5000);

// 不自动关闭（需要手动点击关闭）
toast.info('消息内容', 'info', 0);`);
        });
      });
    });
  });
}

// ============================================
// 演示模块 3: 大量消息
// ============================================

function createMultipleDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('3. 连续消息演示');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(card => {
      card.styles(pageStyles.demoBox);

      card.p(p => {
        p.text('点击按钮连续发送多条消息：');
        p.styles({ marginBottom: '16px', color: '#666' });
      });

      card.div(btnGroup => {
        btnGroup.styles(pageStyles.buttonGroup);

        // 连续发送
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.success });
          btn.text('连续发送 5 条');
          btn.on('click', () => {
            for (let i = 1; i <= 5; i++) {
              setTimeout(() => {
                toast.success(`这是第 ${i} 条消息`);
              }, (i - 1) * 300);
            }
          });
        });

        // 混合类型
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.warning });
          btn.text('混合类型消息');
          btn.on('click', () => {
            toast.info('第一条：信息');
            setTimeout(() => toast.success('第二条：成功'), 300);
            setTimeout(() => toast.warning('第三条：警告'), 600);
            setTimeout(() => toast.error('第四条：错误'), 900);
          });
        });

        // 清空消息
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.clear });
          btn.text('清空所有消息');
          btn.on('click', () => {
            toast.clear();
          });
        });
      });

      // 源码
      card.pre(pre => {
        pre.styles(pageStyles.codeBlock);
        pre.code(c => {
          c.text(`// 连续发送多条消息
for (let i = 1; i <= 5; i++) {
  setTimeout(() => {
    toast.success(\`这是第 \${i} 条消息\`);
  }, (i - 1) * 300);
}

// 混合不同类型
toast.info('第一条：信息');
setTimeout(() => toast.success('第二条：成功'), 300);
setTimeout(() => toast.warning('第三条：警告'), 600);
setTimeout(() => toast.error('第四条：错误'), 900);

// 清空所有消息
toast.clear();`);
        });
      });
    });
  });
}

// ============================================
// 演示模块 4: 实际场景
// ============================================

function createScenarioDemo() {
  return section(section => {
    section.h2(h2 => {
      h2.text('4. 实际使用场景');
      h2.styles(pageStyles.sectionTitle);
    });

    section.div(card => {
      card.styles(pageStyles.demoBox);

      card.p(p => {
        p.text('模拟实际使用场景：');
        p.styles({ marginBottom: '16px', color: '#666' });
      });

      card.div(btnGroup => {
        btnGroup.styles(pageStyles.buttonGroup);

        // 表单提交成功
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.success });
          btn.text('表单提交成功');
          btn.on('click', () => {
            toast.success('表单提交成功！数据已保存。');
          });
        });

        // 网络错误
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.error });
          btn.text('网络错误');
          btn.on('click', () => {
            toast.error('网络连接失败，请检查网络设置。');
          });
        });

        // 登录过期
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.warning });
          btn.text('登录过期');
          btn.on('click', () => {
            toast.warning('您的登录已过期，请重新登录。');
          });
        });

        // 操作提示
        btnGroup.button(btn => {
          btn.styles({ ...pageStyles.button, ...buttonStyles.info });
          btn.text('操作提示');
          btn.on('click', () => {
            toast.info('正在加载数据，请稍候...');
          });
        });
      });

      // 源码
      card.pre(pre => {
        pre.styles(pageStyles.codeBlock);
        pre.code(c => {
          c.text(`// 表单提交成功
toast.success('表单提交成功！数据已保存。');

// 网络错误
toast.error('网络连接失败，请检查网络设置。');

// 登录过期
toast.warning('您的登录已过期，请重新登录。');

// 操作提示
toast.info('正在加载数据，请稍候...');`);
        });
      });
    });
  });
}

// ============================================
// 页脚
// ============================================

function createFooter() {
  return section(footer => {
    footer.styles({
      textAlign: 'center',
      padding: '30px',
      color: '#666',
      borderTop: '1px solid #e0e0e0',
      marginTop: '40px'
    });

    footer.p(p => {
      p.text('Yoya.Basic Message - 消息提示组件');
      p.styles({ marginBottom: '8px' });
    });

    footer.p(p => {
      p.text('支持 success / error / warning / info 四种类型');
      p.styles({ fontSize: '14px', color: '#999' });
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
        title.text('🔔 Message 消息提示演示');
        title.styles({
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '10px'
        });
      });
      h.p(subtitle => {
        subtitle.text('全局消息提示 / 自动关闭 / 多种类型');
        subtitle.styles({
          color: '#666',
          fontSize: '16px'
        });
      });
    });

    // 内容区域
    app.main(main => {
      main.child(createBasicDemo());
      main.child(createDurationDemo());
      main.child(createMultipleDemo());
      main.child(createScenarioDemo());
      main.child(createFooter());
    });
  });
}

// ============================================
// 渲染应用
// ============================================

console.log('🚀 Yoya.Basic Message 演示页面加载开始...');

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('📦 开始渲染 Message 演示页面...');
  const appEl = document.getElementById('app');
  const app = createApp();
  app.bindTo(appEl);

  console.log('✅ Message 演示页面渲染完成！');
}
