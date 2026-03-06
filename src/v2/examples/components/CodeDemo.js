/**
 * CodeDemo 组件
 * 代码演示块（演示区域 + 代码块）
 */

import { vCard, vCardHeader, vCardBody, vstack, flex, vCode } from '../../../yoya/index.js';

/**
 * 代码演示块
 * @param {string} title - 演示标题
 * @param {Tag} demoContent - 演示内容组件
 * @param {string} codeString - 代码字符串
 */
export function CodeDemo(title, demoContent, codeString = '') {
  return vCard(c => {
    c.styles({ marginBottom: '24px' });
    c.vCardHeader(title || '示例');

    c.vCardBody(content => {
      content.child(vstack(inner => {
        inner.gap('16px');

        // 演示区域
        inner.child(flex(demo => {
          demo.styles({
            padding: '20px',
            background: 'var(--islands-doc-example-demo-bg, #f8f9fa)',
            borderRadius: 'var(--islands-radius-md, 6px)',
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
