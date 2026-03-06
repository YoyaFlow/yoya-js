/**
 * Unstable Widget - Demo Component
 * 用于演示动态加载重试机制的不稳定组件
 * 此组件会随机失败 50% 的概率
 */
import { div, h3, p } from '../../yoya/index.js';

// 模拟加载失败计数器
let loadCount = 0;

/**
 * 渲染一个不稳定的组件示例
 */
export function render() {
  loadCount++;

  // 50% 概率失败
  if (Math.random() < 0.5 && loadCount < 3) {
    throw new Error('模拟加载失败：网络错误');
  }

  return div(c => {
    c.styles({
      padding: '20px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '8px',
      color: 'white',
    });

    c.h3('🎲 不稳定组件');
    c.p(`尝试加载次数：${loadCount}`);
    c.p('此组件有 50% 的概率会加载失败');
    c.p('如果设置了重试，会自动重新尝试加载');
  });
}

/**
 * 初始化（可选）
 */
export function init() {
  console.log('Unstable component initialized');
}
