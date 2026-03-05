/**
 * Yoya.Basic V1 - Home Page
 * 首页 - 使用统一布局
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
        sidebarItem('快速开始', 'quickstart.html'),
      ]));
      sidebar.child(sidebarGroup('基础组件', [
        sidebarItem('Button 按钮', 'button.html'),
        sidebarItem('Form 表单', 'form.html'),
        sidebarItem('Card 卡片', 'card.html'),
      ]));
      sidebar.child(sidebarGroup('导航组件', [
        sidebarItem('Menu 菜单', 'menu.html'),
        sidebarItem('Tabs 标签页', 'tabs.html'),
      ]));
      sidebar.child(sidebarGroup('反馈组件', [
        sidebarItem('Message 消息', 'message.html'),
        sidebarItem('Toast 提示', 'toast.html'),
      ]));
    },

    // 中间内容
    content: (content) => {
      // 欢迎区域
      content.child(vCard(welcome => {
        welcome.styles({
          marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        });

        welcome.vCardHeader(h => {
          h.styles({ borderBottom: 'none', paddingBottom: '0' });
          h.child(vMenuItem('Yoya.Basic V1', h1 => {
            h1.styles({ fontSize: '28px', fontWeight: '700', color: 'var(--islands-text, #333)' });
          }));
        });

        welcome.vCardBody(p => {
          p.child(vMenuItem('一个浏览器原生的 HTML DSL 库，提供类似 Kotlin HTML DSL 的声明式语法。使用纯 ES 模块，无需构建工具，开箱即用。', desc => {
            desc.styles({ fontSize: '15px', lineHeight: '1.7', color: 'var(--islands-text-secondary, #666)' });
          }));
          p.child(flex(actions => {
            actions.gap('12px');
            actions.child(vButton(btn => {
              btn.text('快速开始');
              btn.type('primary');
              btn.on('click', () => window.location.href = 'quickstart.html');
            }));
            actions.child(vButton(btn => {
              btn.text('查看示例');
              btn.ghost();
            }));
          }));
        });
      }));

      // 核心特性
      content.child(docSection('features', '核心特性', [
        responsiveGrid(g => {
          g.minSize('240px');
          g.gap('16px');

          g.child(vCard(c => {
            c.vCardHeader(h => { h.styles({ fontSize: '16px', fontWeight: '600' }); h.text('📦 开箱即用'); });
            c.vCardBody(p => { p.styles({ fontSize: '14px', lineHeight: '1.6', color: 'var(--islands-text-secondary, #666)' }); p.text('纯 ES 模块实现，无需构建工具'); });
          }));

          g.child(vCard(c => {
            c.vCardHeader(h => { h.styles({ fontSize: '16px', fontWeight: '600' }); h.text('🎨 主题系统'); });
            c.vCardBody(p => { p.styles({ fontSize: '14px', lineHeight: '1.6', color: 'var(--islands-text-secondary, #666)' }); p.text('支持浅色/深色模式切换'); });
          }));

          g.child(vCard(c => {
            c.vCardHeader(h => { h.styles({ fontSize: '16px', fontWeight: '600' }); h.text('⚡️ 流式 API'); });
            c.vCardBody(p => { p.styles({ fontSize: '14px', lineHeight: '1.6', color: 'var(--islands-text-secondary, #666)' }); p.text('链式调用设计，开发体验流畅'); });
          }));

          g.child(vCard(c => {
            c.vCardHeader(h => { h.styles({ fontSize: '16px', fontWeight: '600' }); h.text('🔧 状态机'); });
            c.vCardBody(p => { p.styles({ fontSize: '14px', lineHeight: '1.6', color: 'var(--islands-text-secondary, #666)' }); p.text('内置状态机机制，管理复杂交互'); });
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
      toc.child(vMenuItem('本页目录', title => {
        title.styles({ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--islands-text, #333)' });
      }));
      toc.child(vstack(links => {
        links.gap('4px');
        links.child(tocItem('介绍', '#intro'));
        links.child(tocItem('核心特性', '#features'));
        links.child(tocItem('快速上手', '#quickstart'));
      }));
    },
  });
}
