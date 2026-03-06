/**
 * Table Widget - Demo Component
 * 用于演示动态加载的表格组件
 */
import { table, tr, td, th, thead, tbody, div, h3, p } from '../../yoya/index.js';

/**
 * 渲染一个简单的表格示例
 */
export function render() {
  return div(t => {
    t.styles({
      padding: '20px',
    });

    t.h3('📋 表格组件');

    t.table(tbl => {
      t.styles({
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
      });

      // 表头
      tbl.thead(th => {
        th.tr(r => {
          r.th(h => {
            h.text('姓名');
            h.style('padding', '12px');
            h.style('borderBottom', '2px solid #ddd');
            h.style('textAlign', 'left');
          });
          r.th(h => {
            h.text('年龄');
            h.style('padding', '12px');
            h.style('borderBottom', '2px solid #ddd');
            h.style('textAlign', 'left');
          });
          r.th(h => {
            h.text('城市');
            h.style('padding', '12px');
            h.style('borderBottom', '2px solid #ddd');
            h.style('textAlign', 'left');
          });
        });
      });

      // 表格内容
      tbl.tbody(tb => {
        const data = [
          { name: '张三', age: 25, city: '北京' },
          { name: '李四', age: 30, city: '上海' },
          { name: '王五', age: 28, city: '广州' },
        ];

        data.forEach(row => {
          tb.tr(r => {
            r.td(d => {
              d.text(row.name);
              d.style('padding', '12px');
              d.style('borderBottom', '1px solid #eee');
            });
            r.td(d => {
              d.text(row.age);
              d.style('padding', '12px');
              d.style('borderBottom', '1px solid #eee');
            });
            r.td(d => {
              d.text(row.city);
              d.style('padding', '12px');
              d.style('borderBottom', '1px solid #eee');
            });
          });
        });
      });
    });

    t.p('这是一个动态加载的表格组件示例');
  });
}

/**
 * 初始化表格（可选）
 */
export function init() {
  console.log('Table initialized');
}
