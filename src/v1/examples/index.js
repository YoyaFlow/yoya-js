/**
 * Yoya.Basic V1 - Home Page
 * 首页 - 演示 setupString、setupObject、setupFunction 三种用法
 */

import {
  flex, grid, responsiveGrid, vstack, hstack, vCard, vCardHeader, vCardBody,
  vMenu, vMenuItem, vButton, toast,
} from '../../yoya/index.js';

import { appLayout, sidebarGroup, sidebarItem, tocItem, docSection, codeDemo } from './layout.js';

/**
 * 创建首页内容
 */
export function createHomePage() {
  return appLayout({
    // 左侧菜单
    sidebar: (sidebar) => {
      sidebar.child(sidebarGroup('开始', [
        sidebarItem('介绍', 'index.html', true),
      ]));
      sidebar.child(sidebarGroup('基础组件', [
        sidebarItem('Button 按钮', 'button.html'),
        sidebarItem('Form 表单', 'form.html'),
        sidebarItem('Card 卡片', 'card.html'),
      ]));
      sidebar.child(sidebarGroup('导航组件', [
        sidebarItem('Menu 菜单', 'menu.html'),
      ]));
    },

    // 中间内容
    content: (content) => {
      // 欢迎区域
      content.child(vCard(welcome => {
        welcome.styles({
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        });
        welcome.vCardHeader('Yoya.Basic V1');
        welcome.vCardBody(p => {
          p.div('一个浏览器原生的 HTML DSL 库，提供声明式语法。支持 setupString、setupObject、setupFunction 三种初始化方式。');
          p.child(flex(actions => {
            actions.gap('12px');
            actions.child(vButton('快速开始')
              .type('primary')
              .on('click', () => window.location.href = 'quickstart.html'));
            actions.child(vButton('查看示例').ghost());
          }));
        });
      }));

      // 三种 setup 方式演示
      content.child(docSection('setup', 'setup 三种初始化方式', [
        codeDemo('setupString - 字符串方式（最简洁）',
          vstack(s => {
            s.gap('12px');
            // 字符串直接作为文本内容
            s.div('这是 div 的文本内容');
            s.span('这是 span 的内容');
            s.p('这是段落内容');
          }),
          `// ✅ 推荐：简单文本直接用字符串
div('这是 div 的文本内容')
span('这是 span 的内容')
p('这是段落内容')`
        ),

        codeDemo('setupObject - 对象配置方式（适合简单配置）',
          vstack(s => {
            s.gap('12px');
            // 对象配置属性和事件
            s.div({
              onclick: () => toast.info('点击了 div'),
            }, '点击我');
            s.button({
              onclick: () => toast.success('提交'),
            }, '提交');
          }),
          `// ✅ 推荐：简单属性和事件用对象配置
div({
  onclick: () => toast('点击')
}, '点击我')

button({
  onclick: () => toast('提交')
}, '提交')`
        ),

        codeDemo('setupFunction - 函数回调方式（适合复杂内容）',
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

        codeDemo('链式调用（最常用）',
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
      content.child(docSection('features', '核心特性', [
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
      content.child(docSection('quickstart', '快速上手', [
        codeDemo('创建卡片',
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

    // 右侧目录
    toc: (toc) => {
      toc.vMenuItem('本页目录');
      toc.child(vstack(links => {
        links.gap('4px');
        links.child(tocItem('setup 三种方式', '#setup'));
        links.child(tocItem('核心特性', '#features'));
        links.child(tocItem('快速上手', '#quickstart'));
      }));
    },
  });
}
