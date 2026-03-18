/**
 * vTimer 和 Message 主题测试 - 验证修复
 */

import { div, vstack, hstack, vTimer, vTimer2, toast, vButton, vInput, h2, span } from '../../yoya/index.js';
import { initTheme, setThemeMode, themeManager } from '../../yoya/index.js';

// 初始化主题系统
initTheme();

// 默认使用深色主题
setThemeMode('dark');

// 创建测试页面
function createTestPage() {
  return div(page => {
    page.styles({ padding: '20px', gap: '20px' });

    // 主题切换按钮
    page.child(hstack(h => {
      h.gap('12px');
      h.child(vButton(btn => {
        btn.text('切换到浅色主题');
        btn.type('primary');
        btn.onClick(() => setThemeMode('light'));
      }));
      h.child(vButton(btn => {
        btn.text('切换到深色主题');
        btn.type('primary');
        btn.onClick(() => setThemeMode('dark'));
      }));
    }));

    // vTimer 测试
    page.child(div(section => {
      section.styles({ padding: '20px', borderRadius: '8px', border: '1px solid var(--yoya-border)' });

      section.child(h2(h => {
        h.text('vTimer 测试');
        h.styles({ marginBottom: '16px', color: 'var(--yoya-text-primary)' });
      }));

      section.child(vstack(v => {
        v.gap('16px');

        // 日期选择器
        v.child(vTimer(t => {
          t.type('date');
          t.value('2024-03-15');
          t.placeholder('选择日期');
        }));

        // 日期时间选择器
        v.child(vTimer(t => {
          t.type('datetime-local');
          t.value('2024-03-15T14:30');
        }));

        // 时间选择器
        v.child(vTimer(t => {
          t.type('time');
          t.value('14:30');
        }));

        // 日期范围选择器
        v.child(vTimer2(t2 => {
          t2.type('date');
          t2.value({ start: '2024-03-01', end: '2024-03-31' });
        }));
      }));
    }));

    // vInput 测试
    page.child(div(section => {
      section.styles({ padding: '20px', borderRadius: '8px', border: '1px solid var(--yoya-border)', marginTop: '20px' });

      section.child(h2(h => {
        h.text('vInput 测试');
        h.styles({ marginBottom: '16px', color: 'var(--yoya-text-primary)' });
      }));

      section.child(vstack(v => {
        v.gap('16px');

        v.child(vInput(i => {
          i.placeholder('请输入内容...');
        }));

        v.child(vInput(i => {
          i.value('已填充的输入框');
        }));

        v.child(vInput(i => {
          i.placeholder('错误状态');
          i.error(true);
        }));

        v.child(vInput(i => {
          i.placeholder('禁用状态');
          i.disabled(true);
        }));
      }));
    }));

    // Message/Toast 测试
    page.child(div(section => {
      section.styles({ padding: '20px', borderRadius: '8px', border: '1px solid var(--yoya-border)', marginTop: '20px' });

      section.child(h2(h => {
        h.text('Message/Toast 测试');
        h.styles({ marginBottom: '16px', color: 'var(--yoya-text-primary)' });
      }));

      section.child(hstack(h => {
        h.gap('12px');

        h.child(vButton(btn => {
          btn.text('成功消息');
          btn.type('success');
          btn.onClick(() => toast.success('操作成功！'));
        }));

        h.child(vButton(btn => {
          btn.text('错误消息');
          btn.type('danger');
          btn.onClick(() => toast.error('操作失败，请重试！'));
        }));

        h.child(vButton(btn => {
          btn.text('警告消息');
          btn.type('warning');
          btn.onClick(() => toast.warning('请注意此操作的影响！'));
        }));

        h.child(vButton(btn => {
          btn.text('信息消息');
          btn.type('info');
          btn.onClick(() => toast.info('这是一个普通信息提示！'));
        }));
      }));
    }));
  });
}

// 渲染页面
const app = document.getElementById('app');
if (app) {
  createTestPage().bindTo('#app');
}
