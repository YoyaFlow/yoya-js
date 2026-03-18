/**
 * Yoya.Basic V2 - Tabs 标签页演示页面
 */

import {
  flex, vstack, div, pre, code, button,
  vTabs, toast
} from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

/**
 * 创建示例代码内容
 */
function createCodeContent(codeText) {
  return (c) => {
    c.styles({
      padding: '16px',
      height: '100%',
      overflow: 'auto',
    });
    c.child(
      pre(p => {
        // p.styles({
        //   margin: 0,
        //   fontFamily: 'var(--yoya-font-mono, ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace)',
        //   fontSize: '13px',
        //   lineHeight: '1.6',
        //   color: '#d4d4d4',
        // });
        p.child(
          code(cc => {
            cc.text(codeText);
          })
        );
      })
    );
  };
}

// 示例代码
const jsCode = `// JavaScript 示例
function greet(name) {
  console.log('Hello, ' + name + '!');
  return {
    message: 'Welcome to Yoya Tabs',
    timestamp: new Date()
  };
}

const result = greet('Developer');
console.log(result);`;

const tsCode = `// TypeScript 示例
interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  getUser(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }
}`;

const cssCode = `/* CSS 示例 */
.editor-tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
}

.tab-header {
  display: flex;
  align-items: center;
  gap: 1px;
  padding-top: 8px;
  background: #252526;
}`;

const htmlCode = `<!-- HTML 示例 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Yoya Tabs Demo</title>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import { vTabs } from './yoya/index.js';

    vTabs(tabs => {
      tabs.addTab('file1', 'index.html', content);
    });
  <\/script>
</body>
</html>`;

const readmeCode = `# Yoya Tabs 组件

IDEA 风格的标签页组件

## 特性

- 紧凑的标签设计
- 流畅的切换动画
- 支持关闭按钮
- 支持图标
- 标签与内容完美结合

## 使用示例

\`\`\`javascript
import { vTabs } from '@yoya/tabs';

vTabs(tabs => {
  tabs.addTab('file1', 'index.html', content);
  tabs.addTab('file2', 'style.css', content);
  tabs.onChange((id, data) => {
    console.log('切换:', id);
  });
});
\`\`\``;

/**
 * 创建基础演示标签页
 */
function createBasicTabs() {
  return vTabs((t) => {
    t.addTab('readme', 'README.md', createCodeContent(readmeCode), { icon: '📄' });
    t.addTab('index.html', 'index.html', createCodeContent(htmlCode), { icon: '🌐' });
    t.addTab('app.js', 'app.js', createCodeContent(jsCode), { icon: '📜' });
    t.addTab('utils.ts', 'utils.ts', createCodeContent(tsCode), { icon: '📘' });
    t.addTab('styles.css', 'styles.css', createCodeContent(cssCode), { icon: '🎨' });

    t.onChange((id, data) => {
      toast.info(`切换到：${data.title}`);
    });
  });
}

/**
 * 创建 Tabs 演示页面
 */
export function createTabsPage() {
  const tocItems = [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '带图标的标签页', href: '#icon', level: 1 },
    { text: '不可关闭的标签页', href: '#closable', level: 1 },
    { text: '动态添加删除', href: '#dynamic', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'tabs.html',
    tocItems,
    content: (content) => {
      // 页面标题
      content.child(PageHeader({
        title: 'Tabs 标签页',
        description: 'IDEA 风格的标签页组件，紧凑设计，优秀的标题与内容结合。适合用于编辑器、控制台等场景。',
      }));

      // 基础用法
      content.child(DocSection('basic', '基础用法', [
        CodeDemo('基础标签页',
          div(d => {
            d.styles({ height: '300px' });
            d.child(createBasicTabs());
          }),
          `const tabs = vTabs((t) => {
  t.addTab('readme', 'README.md', content);
  t.addTab('index.html', 'index.html', content);
  t.addTab('app.js', 'app.js', content);

  t.onChange((id, data) => {
    console.log('切换:', id);
  });
});`
        ),
      ]));

      // 带图标的标签页
      content.child(DocSection('icon', '带图标的标签页', [
        CodeDemo('图标标签页',
          div(d => {
            d.styles({ height: '250px' });
            d.child(
              vTabs((t) => {
                t.addTab('file1', '文件 1', (c) => {
                  c.styles({ padding: '20px' });
                  c.text('这是文件 1 的内容');
                }, { icon: '📄' });
                t.addTab('file2', '文件 2', (c) => {
                  c.styles({ padding: '20px' });
                  c.text('这是文件 2 的内容');
                }, { icon: '📁' });
                t.addTab('file3', '文件 3', (c) => {
                  c.styles({ padding: '20px' });
                  c.text('这是文件 3 的内容');
                }, { icon: '📊' });
              })
            );
          }),
          `vTabs((t) => {
  t.addTab('file1', '文件 1', content, {
    icon: '📄'
  });
  t.addTab('file2', '文件 2', content, {
    icon: '📁'
  });
});`
        ),
      ]));

      // 不可关闭的标签页
      content.child(DocSection('closable', '不可关闭的标签页', [
        CodeDemo('closable=false',
          div(d => {
            d.styles({ height: '250px' });
            d.child(
              vTabs((t) => {
                t.setState('closable', false);
                t.addTab('tab1', '标签 1', (c) => {
                  c.styles({ padding: '20px' });
                  c.text('标签 1 内容 - 不可关闭');
                });
                t.addTab('tab2', '标签 2', (c) => {
                  c.styles({ padding: '20px' });
                  c.text('标签 2 内容 - 不可关闭');
                });
                t.addTab('tab3', '标签 3', (c) => {
                  c.styles({ padding: '20px' });
                  c.text('标签 3 内容 - 不可关闭');
                });
              })
            );
          }),
          `vTabs((t) => {
  // 禁用所有标签的关闭按钮
  t.setState('closable', false);

  t.addTab('tab1', '标签 1', content);
  t.addTab('tab2', '标签 2', content);
});`
        ),
      ]));

      // 动态添加删除
      content.child(DocSection('dynamic', '动态添加删除', [
        CodeDemo('动态操作',
          div(d => {
            d.styles({ height: '300px' });
            d.child(
              vTabs((t) => {
                t.addTab('tab1', '标签 1', (c) => {
                  c.styles({ padding: '20px' });
                  c.text('标签 1 内容');
                });
                t.addTab('tab2', '标签 2', (c) => {
                  c.styles({ padding: '20px' });
                  c.text('标签 2 内容');
                });

                // 动态添加按钮
                setTimeout(() => {
                  const container = d._el?.parentElement;
                  if (container) {
                    // 使用 yoya button 组件
                    const addBtn = button(b => {
                      b.text('添加标签');
                      b.styles({ marginTop: '10px' });
                      b.onclick(() => {
                        const count = t.getTabs().length + 1;
                        t.addTab(`tab${count}`, `标签${count}`, (c) => {
                          c.styles({ padding: '20px' });
                          c.text(`标签${count} 内容`);
                        });
                        toast.success(`添加标签${count}`);
                      });
                    });

                    const removeBtn = button(b => {
                      b.text('移除最后标签');
                      b.styles({ marginLeft: '10px' });
                      b.onclick(() => {
                        const tabs = t.getTabs();
                        if (tabs.length > 1) {
                          const lastTab = tabs[tabs.length - 1];
                          t.removeTab(lastTab.id);
                          toast.info('移除最后一个标签');
                        }
                      });
                    });

                    container.appendChild(addBtn.renderDom());
                    container.appendChild(removeBtn.renderDom());
                  }
                }, 100);
              })
            );
          }),
          `// 动态添加标签页
const count = tabs.getTabs().length + 1;
tabs.addTab('tab' + count, '标签' + count, content);

// 动态删除标签页
const lastTab = tabs.getTabs()[tabs.length - 1];
tabs.removeTab(lastTab.id);`
        ),
      ]));

      // API
      content.child(DocSection('api', 'API', [
        div(d => {
          d.styles({ marginBottom: '24px' });
          d.child(pre(p => {
            p.styles({
              margin: 0,
              padding: '16px',
              background: 'var(--yoya-code-bg, #1e1e1e)',
              borderRadius: '8px',
              fontFamily: 'var(--yoya-font-mono)',
              fontSize: '13px',
              overflow: 'auto',
            });
            p.text(`// 方法
tabs.addTab(id, title, content, options)  // 添加标签页
tabs.removeTab(id)                        // 移除标签页
tabs.setActiveTab(id)                     // 激活标签页
tabs.getActiveTabId()                     // 获取激活标签页 ID
tabs.getActiveTab()                       // 获取激活标签页数据
tabs.updateTabTitle(id, title)            // 更新标签页标题
tabs.getTabs()                            // 获取所有标签页
tabs.onChange(fn)                         // 设置变化回调

// 状态
tabs.setState('closable', false)          // 禁用关闭按钮
tabs.setState('closable', true)           // 启用关闭按钮

// 标签页选项
addTab('id', 'title', content, {
  icon: '📄',      // 图标
  closable: true,  // 是否可关闭
  data: {}         // 自定义数据
})`);
          }));
        }),

        ApiTable([
          { name: 'addTab', desc: '添加标签页', type: '(id, title, content, options) => this' },
          { name: 'removeTab', desc: '移除标签页', type: '(id) => this' },
          { name: 'setActiveTab', desc: '激活标签页', type: '(id) => this' },
          { name: 'getActiveTabId', desc: '获取激活标签页 ID', type: '() => string' },
          { name: 'getActiveTab', desc: '获取激活标签页数据', type: '() => object' },
          { name: 'updateTabTitle', desc: '更新标签页标题', type: '(id, title) => this' },
          { name: 'getTabs', desc: '获取所有标签页', type: '() => array' },
          { name: 'onChange', desc: '设置变化回调', type: '(fn) => this' },
        ]),
      ]));
    },
  });
}
