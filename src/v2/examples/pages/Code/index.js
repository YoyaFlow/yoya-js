/**
 * Yoya.Basic V2 - Code Demo Page
 */

import { vstack } from '../../../../yoya/index.js';
import { vCode, toast } from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

/**
 * 创建 Code 演示页面
 */
export function createCodePage() {
  const tocItems = [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '带标题栏', href: '#with-header', level: 1 },
    { text: '不显示行号', href: '#no-line-numbers', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'code.html',
    tocItems,
    content: (content) => {
      content.child(PageHeader({
        title: 'Code 代码展示',
        description: '代码展示组件用于展示代码片段，支持语法高亮和一键复制功能。',
      }));

      content.child(DocSection('basic', '基础用法', [
        CodeDemo('基础代码展示',
          vstack(s => {
            s.gap('16px');
            s.child(vCode(c => {
              c.content(`function hello(name) {
  console.log('Hello, ' + name + '!');
}

hello('World');`);
              c.showLineNumbers(true);
            }));
          }),
          `vCode(c => {
  c.content(\`function hello(name) {
  console.log('Hello, ' + name + '!');
}\`)
  c.showLineNumbers(true)
})`
        ),
      ]));

      content.child(DocSection('with-header', '带标题栏', [
        CodeDemo('带标题的代码块',
          vCode(c => {
            c.content(`const config = {
  name: 'Yoya.Basic',
  version: '2.0.0',
  description: 'HTML DSL Library'
};`);
            c.title('💻 JavaScript 配置');
            c.onCopy(() => {
              toast.success('代码已复制到剪贴板');
            });
          }),
          `vCode(c => {
  c.content(\`const config = {...}\`)
  c.title('💻 JavaScript 配置')
  c.onCopy(() => {
    toast.success('代码已复制')
  })
})`
        ),
      ]));

      content.child(DocSection('no-line-numbers', '不显示行号', [
        CodeDemo('隐藏行号',
          vCode(c => {
            c.content('console.log("Hello World");');
            c.showLineNumbers(false);
            c.showCopyButton(true);
          }),
          `vCode(c => {
  c.content('console.log("Hello World");')
  c.showLineNumbers(false)
  c.showCopyButton(true)
})`
        ),
      ]));

      content.child(DocSection('api', 'API', [
        ApiTable([
          { name: 'content', desc: '代码内容', type: 'string' },
          { name: 'title', desc: '标题', type: 'string' },
          { name: 'language', desc: '语言类型', type: 'javascript | typescript | css | html | ...' },
          { name: 'showLineNumbers', desc: '显示行号', type: 'boolean' },
          { name: 'showCopyButton', desc: '显示复制按钮', type: 'boolean' },
          { name: 'onCopy', desc: '复制完成回调', type: '() => void' },
        ]),
      ]));
    },
  });
}
