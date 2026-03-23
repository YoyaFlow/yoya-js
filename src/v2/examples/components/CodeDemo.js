/**
 * CodeDemo 组件
 * 代码演示块（演示区域 + 代码块）
 */

import { vCard, vCardHeader, vCardBody, vstack, div, vCode } from '../../../yoya/index.js';

/**
 * 代码演示块
 * @param {string} title - 演示标题
 * @param {Tag} demoContent - 演示内容组件
 * @param {string} codeString - 代码字符串
 */
export function CodeDemo(title, demoContent, codeString = '') {
  return vCard(c => {
    c.styles({ marginBottom: '24px', width: '100%' });
    c.vCardHeader(title || '示例');

    c.vCardBody(content => {
      content.styles({ width: '100%' });
      content.child(vstack(inner => {
        inner.gap('16px');
        inner.styles({ width: '100%', minWidth: '100%' });

        // 演示区域 - 使用一个额外的 div 容器来确保内容正确拉伸
        inner.child(div(demo => {
          demo.styles({
            width: '100%',
            minWidth: '100%',
          });
          demo.child(demoContent);
        }));

        // 代码区域
        if (codeString) {
          inner.child(vCode(c => {
            c.content(codeString);
            c.showLineNumbers(true);
          }));
        }
      }));
    });
  });
}
