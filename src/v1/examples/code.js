/**
 * Yoya.Basic V1 - Code Demo Page
 * Code 代码展示演示页面
 */

import {
  flex, vstack, vCard, vCardHeader, vCardBody,
  vMenu, vMenuItem, vButton, vCode, codeBlock, toast,
} from '../../yoya/index.js';

import { appLayout, sidebarGroup, sidebarItem, tocItem, docSection, codeDemo } from './layout.js';

/**
 * 创建 Code 演示页面
 */
export function createCodePage() {
  return appLayout({
    // 左侧菜单
    sidebar: (sidebar) => {
      sidebar.child(sidebarGroup('开始', [
        sidebarItem('介绍', 'index.html'),
      ]));
      sidebar.child(sidebarGroup('基础组件', [
        sidebarItem('Button 按钮', 'button.html'),
        sidebarItem('Form 表单', 'form.html'),
        sidebarItem('Card 卡片', 'card.html'),
      ]));
      sidebar.child(sidebarGroup('导航组件', [
        sidebarItem('Menu 菜单', 'menu.html'),
      ]));
      sidebar.child(sidebarGroup('反馈组件', [
        sidebarItem('Message 消息', 'message.html'),
        sidebarItem('Code 代码', 'code.html', true),
      ]));
      sidebar.child(sidebarGroup('数据展示', [
        sidebarItem('Detail 详情', 'detail.html'),
        sidebarItem('Field 字段', 'field.html'),
      ]));
    },

    // 中间内容
    content: (content) => {
      // 页面标题
      content.child(vstack(header => {
        header.gap('8px');
        header.child(vMenuItem('Code 代码展示'));
        header.child(vMenuItem('代码展示组件，支持语法高亮和一键复制功能。'));
      }));

      // 基础用法
      content.child(docSection('basic', '基础用法', [
        codeDemo('基础代码展示',
          vCode(c => {
            c.content(`const hello = (name) => {
  console.log('Hello, ' + name);
};
hello('World');`);
          }),
          `vCode(c => {
  c.content(\`const hello = (name) => {
  console.log('Hello, ' + name);
};
hello('World');\`);
})`
        ),
      ]));

      // 带标题的代码块
      content.child(docSection('title', '带标题的代码块', [
        codeDemo('自定义标题',
          vCode(c => {
            c.title('JavaScript 示例');
            c.content(`// 箭头函数示例
const add = (a, b) => a + b;
console.log(add(1, 2)); // 3`);
            c.onCopy(() => {
              toast.success('代码已复制');
            });
          }),
          `vCode(c => {
  c.title('JavaScript 示例');
  c.content(code);
  c.onCopy(() => {
    toast.success('代码已复制');
  });
})`
        ),
      ]));

      // 简化组件
      content.child(docSection('codeblock', 'CodeBlock 简化组件', [
        codeDemo('快速创建代码块',
          codeBlock('TypeScript 示例', `// 类型定义
interface User {
  id: number;
  name: string;
  email: string;
}

// 使用示例
const user: User = {
  id: 1,
  name: '张三',
  email: 'zhangsan@example.com'
};`),
          `// 快速创建带标题的代码块
codeBlock('标题', \`代码内容\`)`
        ),
      ]));

      // 配置选项
      content.child(docSection('options', '配置选项', [
        codeDemo('隐藏行号和复制按钮',
          vstack(s => {
            s.gap('16px');
            s.child(vCode(c => {
              c.title('无行号');
              c.content('console.log("Hello World");');
              c.showLineNumbers(false);
            }));
            s.child(vCode(c => {
              c.title('无复制按钮');
              c.content('const x = 1;');
              c.showCopyButton(false);
            }));
            s.child(vCode(c => {
              c.title('简洁模式');
              c.content('debugger;');
              c.showLineNumbers(false);
              c.showCopyButton(false);
            }));
          }),
          `vCode(c => {
  c.content(code);
  c.showLineNumbers(false);  // 隐藏行号
  c.showCopyButton(false);   // 隐藏复制按钮
})`
        ),
      ]));

      // 多语言支持
      content.child(docSection('language', '多语言支持', [
        vCard(c => {
          c.vCardHeader('不同语言的语法高亮');
          c.vCardBody(langs => {
            langs.child(vstack(s => {
              s.gap('16px');

              // HTML
              s.child(vCode(c => {
                c.title('HTML');
                c.language('html');
                c.content(`<!DOCTYPE html>
<html>
<head>
  <title>示例</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>`);
              }));

              // CSS
              s.child(vCode(c => {
                c.title('CSS');
                c.language('css');
                c.content(`.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
}`);
              }));

              // JSON
              s.child(vCode(c => {
                c.title('JSON');
                c.language('json');
                c.content(`{
  "name": "yoya-basic",
  "version": "1.0.0",
  "description": "HTML DSL Library",
  "main": "src/yoya/index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  }
}`);
              }));

              // SQL
              s.child(vCode(c => {
                c.title('SQL');
                c.language('sql');
                c.content(`SELECT u.id, u.name, COUNT(o.id) as orderCount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY orderCount DESC
LIMIT 10;`);
              }));
            }));
          });
        }),
      ]));

      // 复制回调
      content.child(docSection('oncopy', '复制回调', [
        codeDemo('复制完成事件',
          vCode(c => {
            c.title('带复制回调的代码块');
            c.content(`// 点击复制按钮后会触发回调
const data = { key: 'value' };`);
            c.onCopy(({ value }) => {
              toast.success(`已复制：${value.substring(0, 20)}...`);
            });
          }),
          `vCode(c => {
  c.content(code);
  c.onCopy(({ value }) => {
    toast.success('代码已复制：' + value);
  });
})`
        ),
      ]));

      // API
      content.child(docSection('api', 'API', [
        vCard(c => {
          c.vCardBody(api => {
            api.child(vMenu(apiMenu => {
              apiMenu.vertical();

              const apiItems = [
                { name: 'content()', desc: '代码内容', props: 'string' },
                { name: 'language()', desc: '语言类型', props: 'html, css, js, json, sql...' },
                { name: 'title()', desc: '标题', props: 'string' },
                { name: 'showLineNumbers()', desc: '显示行号', props: 'boolean' },
                { name: 'showCopyButton()', desc: '显示复制按钮', props: 'boolean' },
                { name: 'onCopy()', desc: '复制回调', props: 'function' },
                { name: 'codeBlock()', desc: '简化组件', props: 'title, content' },
              ];

              apiItems.forEach(item => {
                apiMenu.item(it => {
                  it.child(flex(apiRow => {
                    apiRow.justifyBetween();
                    apiRow.child(vMenuItem(item.name));
                    apiRow.child(vMenuItem(item.desc));
                    apiRow.child(vMenuItem(item.props));
                  }));
                });
              });
            }));
          });
        }),
      ]));
    },

    // 右侧目录
    toc: (toc) => {
      toc.child(vMenuItem('本页目录'));
      toc.child(vstack(links => {
        links.gap('4px');
        links.child(tocItem('基础用法', '#basic'));
        links.child(tocItem('带标题', '#title'));
        links.child(tocItem('CodeBlock', '#codeblock'));
        links.child(tocItem('配置选项', '#options'));
        links.child(tocItem('多语言', '#language'));
        links.child(tocItem('复制回调', '#oncopy'));
        links.child(tocItem('API', '#api'));
      }));
    },
  });
}
