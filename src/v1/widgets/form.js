/**
 * Form Widget - Demo Component
 * 用于演示动态加载的表单组件
 */
import { form, label, input, button, div, h3, p } from '../../yoya/index.js';

/**
 * 渲染一个简单的表单示例
 */
export function render() {
  return div(f => {
    f.styles({
      padding: '20px',
      maxWidth: '400px',
    });

    f.h3('📝 表单组件');

    f.form(form => {
      form.styles({
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      });

      // 用户名
      form.div(d => {
        d.styles({ display: 'flex', flexDirection: 'column', gap: '4px' });
        d.label(l => l.text('用户名'));
        d.input(i => {
          i.type('text');
          i.placeholder('请输入用户名');
          i.style('padding', '8px 12px');
          i.style('border', '1px solid #ddd');
          i.style('borderRadius', '4px');
        });
      });

      // 邮箱
      form.div(d => {
        d.styles({ display: 'flex', flexDirection: 'column', gap: '4px' });
        d.label(l => l.text('邮箱'));
        d.input(i => {
          i.type('email');
          i.placeholder('请输入邮箱');
          i.style('padding', '8px 12px');
          i.style('border', '1px solid #ddd');
          i.style('borderRadius', '4px');
        });
      });

      // 提交按钮
      form.button(b => {
        b.text('提交');
        b.style('padding', '10px 20px');
        b.style('background', '#339af0');
        b.style('color', 'white');
        b.style('border', 'none');
        b.style('borderRadius', '4px');
        b.style('cursor', 'pointer');
        b.on('click', () => {
          alert('表单提交！');
        });
      });
    });

    f.p('这是一个动态加载的表单组件示例');
  });
}

/**
 * 初始化表单（可选）
 */
export function init() {
  console.log('Form initialized');
}
