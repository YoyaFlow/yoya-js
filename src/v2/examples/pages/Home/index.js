/**
 * Yoya.Basic V2 - Home Page
 * 首页 - 演示 setupString、setupObject、setupFunction 三种用法
 */

import { flex, grid, responsiveGrid, vstack, vCard, vCardHeader, vCardBody, vButton, toast } from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';

/**
 * 创建首页内容
 */
export function createHomePage() {
  // 右侧目录项
  const tocItems = [
    { text: 'setup 三种方式', href: '#setup', level: 1 },
    { text: '核心特性', href: '#features', level: 1 },
    { text: '快速上手', href: '#quickstart', level: 1 },
  ];

  return AppShell({
    currentPage: 'index.html',
    tocItems,
    content: (content) => {
      // 页面标题
      content.child(PageHeader({
        title: 'Yoya.Basic V2',
        description: '一个浏览器原生的 HTML DSL 库，提供声明式语法。支持 setupString、setupObject、setupFunction 三种初始化方式。',
      }));

      // 欢迎卡片
      content.child(vCard(welcome => {
        // welcome.styles({
        //   background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        //   marginBottom: '24px',
        // });
        welcome.vCardHeader('欢迎使用 Yoya.Basic V2');
        welcome.vCardBody(p => {
          p.div('Yoya.Basic V2 重构版，采用标准项目结构，提供更好的可维护性和扩展性。');
          p.child(flex(actions => {
            actions.gap('12px');
            actions.child(vButton('查看组件')
              .type('primary')
              .on('click', () => window.location.href = 'button.html'));
            actions.child(vButton('了解差异').ghost());
          }));
        });
      }));

      // 三种 setup 方式
      content.child(DocSection('setup', 'setup 三种初始化方式', [
        CodeDemo('setupString - 字符串方式（最简洁）',
          vstack(s => {
            s.gap('12px');
            s.div('这是 div 的文本内容');
            s.span('这是 span 的内容');
            s.p('这是段落内容');
          }),
          `// ✅ 推荐：简单文本直接用字符串
div('这是 div 的文本内容')
span('这是 span 的内容')
p('这是段落内容')`
        ),

        CodeDemo('setupObject - 对象配置方式（适合简单配置）',
          vstack(s => {
            s.gap('12px');
            s.div({
              onClick: () => {
                s.style('background', '#e8eaed');
                setTimeout(() => s.style('background', ''), 500);
              },
              style: { padding: '8px', cursor: 'pointer' }
            }).text('点击我有背景变化');
            s.button({
              onClick: () => {
                alert('按钮被点击了');
              }
            }).text('点击弹出');
          }),
          `// ✅ 推荐：简单属性和事件用对象配置
div({
  onClick: () => {
    this.style('background', '#e8eaed');
  }
}).text('点击我')

button({
  onClick: () => {
    alert('按钮被点击了');
  }
}).text('点击弹出')`
        ),

        CodeDemo('setupFunction - 函数回调方式（适合复杂内容）',
          vCard(c => {
            c.vCardHeader('卡片标题');
            c.vCardBody(b => {
              b.div('内容区 1');
              b.div('内容区 2');
              b.child(flex(row => {
                row.gap('8px');
                row.child(vButton('按钮 1'));
                row.child(vButton('按钮 2').type('primary'));
              }));
            });
          }),
          `// ✅ 推荐：复杂子元素用函数回调
vCard(c => {
  c.vCardHeader('标题')
  c.vCardBody(b => {
    b.div('内容 1')
    b.div('内容 2')
  })
})`
        ),

        CodeDemo('链式调用（最常用）',
          vstack(s => {
            s.gap('12px');
            s.div('链式调用示例')
              .styles({ padding: '12px' })
              .class('box');
            s.child(vButton('按钮 1')
              .type('primary')
              .size('large')
              .onClick(() => toast('点击 1')));
            s.child(vButton('按钮 2')
              .ghost()
              .onClick(() => toast('点击 2')));
          }),
          `// ✅ 推荐：链式调用设置属性和事件
vButton('按钮')
  .type('primary')
  .size('large')
  .onClick(() => toast('点击'))`
        ),
      ]));

      // 核心特性
      content.child(DocSection('features', '核心特性', [
        responsiveGrid(g => {
          g.minSize('240px');
          g.gap('16px');

          g.child(vCard(c => {
            c.vCardHeader('📦 开箱即用');
            c.vCardBody('纯 ES 模块实现，无需构建工具');
          }));

          g.child(vCard(c => {
            c.vCardHeader('🎨 主题系统');
            c.vCardBody('支持浅色/深色模式切换');
          }));

          g.child(vCard(c => {
            c.vCardHeader('⚡️ 流式 API');
            c.vCardBody('链式调用设计，开发体验流畅');
          }));

          g.child(vCard(c => {
            c.vCardHeader('🔧 状态机');
            c.vCardBody('内置状态机机制，管理复杂交互');
          }));
        }),
      ]));

      // 快速示例
      content.child(DocSection('quickstart', '快速上手', [
        CodeDemo('创建卡片',
          vCard(c => {
            c.vCardHeader('卡片标题');
            c.vCardBody('这是卡片内容区域');
          }),
          `vCard(c => {
  c.vCardHeader('卡片标题');
  c.vCardBody('这是卡片内容区域');
})`
        ),
      ]));
    },
  });
}
