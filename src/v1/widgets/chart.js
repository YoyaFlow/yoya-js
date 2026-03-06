/**
 * Chart Widget - Demo Component
 * 用于演示动态加载的图表组件
 */
import { div, svg, circle, rect, g, h3, p } from '../../yoya/index.js';

/**
 * 渲染一个简单的饼图示例
 */
export function render() {
  return div(c => {
    c.styles({
      padding: '20px',
      textAlign: 'center',
    });

    c.h3('📊 图表组件');

    // 简单的饼图 SVG
    c.svg(s => {
      s.viewBox(0, 0, 200, 200);
      s.width(200).height(200);

      // 红色扇形
      s.circle(c => {
        c.cx(100).cy(100).r(80);
        c.style('fill', '#ff6b6b');
      });

      // 绿色扇形（用 clip-path 模拟）
      s.g(g => {
        g.rect(r => {
          r.x(100).y(20).width(80).height(160);
          r.style('fill', '#51cf66');
        });
      });

      // 蓝色扇形
      s.g(g => {
        g.rect(r => {
          r.x(20).y(100).width(80).height(80);
          r.style('fill', '#339af0');
        });
      });
    });

    c.p('这是一个使用 SVG 绘制的简单图表示例');
  });
}

/**
 * 初始化图表（可选）
 */
export function init() {
  console.log('Chart initialized');
}
