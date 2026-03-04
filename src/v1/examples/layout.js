/**
 * Yoya.Basic V1 - 统一布局组件
 * 提供标准的演示界面布局结构
 */

import {
  // 布局组件
  flex, grid, vstack, hstack, spacer, container, divider,
  // UI 组件
  card, cardBody,
  menu, menuItem, menuDivider,
  vButton,
  vCode,
  toast,
  // 主题
  themeManager, switchTheme, getCurrentThemeId,
} from '../../yoya/index.js';

/**
 * 统一布局 - 顶部导航 + 左侧菜单 + 内容区 + 右侧导航
 */
export function appLayout(setup) {
  return vstack(layout => {
    layout.styles({ minHeight: '100vh', background: 'var(--islands-bg, #f8f9fa)' });

    // ========== 顶部导航栏 ==========
    layout.child(flex(navbar => {
      navbar.alignItems('center');
      navbar.justifyBetween();
      navbar.styles({
        height: '56px',
        padding: '0 20px',
        background: 'var(--islands-card-bg, white)',
        borderBottom: '1px solid var(--islands-border, #e0e0e0)',
        position: 'sticky',
        top: '0',
        zIndex: '1000',
      });

      // 左侧：品牌 + 主导航
      navbar.child(flex(left => {
        left.alignItems('center');
        left.gap('24px');

        // 品牌
        left.child(menuItem('🏝️ Yoya.Basic', brand => {
          brand.styles({
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--islands-primary, #667eea)',
          });
          brand.on('click', () => {
            window.location.href = 'index.html';
          });
        }));

        // 主导航：首页 | 文档
        left.child(flex(nav => {
          nav.alignItems('center');
          nav.gap('4px');
          nav.child(menuItem('首页', link => {
            link.styles({ fontSize: '14px', color: 'var(--islands-text-secondary, #666)' });
            link.on('click', () => window.location.href = 'index.html');
          }));
          nav.child(menuItem('|', sep => {
            sep.styles({ fontSize: '12px', color: '#ddd' });
          }));
          nav.child(menuItem('文档', link => {
            link.styles({ fontSize: '14px', color: 'var(--islands-text-secondary, #666)' });
            link.on('click', () => window.location.href = 'button.html');
          }));
        }));
      }));

      // 右侧：主题切换
      navbar.child(flex(right => {
        right.alignItems('center');
        right.gap('12px');
        right.child(vButton(btn => {
          btn.ghost();
          btn.size('small');
          btn.text('🌙');
          btn.on('click', () => {
            const current = getCurrentThemeId();
            const next = current === 'islands:light' ? 'islands:dark' : 'islands:light';
            switchTheme(next);
          });
        }));
      }));
    }));

    // ========== 主体区域（左侧菜单 + 内容 + 右侧导航）==========
    layout.child(flex(main => {
      main.styles({ flex: 1, display: 'flex' });

      // 左侧功能菜单
      main.child(flex(sidebar => {
        sidebar.styles({
          width: '220px',
          background: 'var(--islands-card-bg, white)',
          borderRight: '1px solid var(--islands-border, #e0e0e0)',
          overflowY: 'auto',
          padding: '16px 0',
        });
        sidebar.column();

        setup.sidebar?.(sidebar);
      }));

      // 中间内容区
      main.child(container(content => {
        content.styles({
          flex: 1,
          maxWidth: '960px',
          padding: '32px 24px',
          overflowY: 'auto',
        });

        setup.content?.(content);
      }));

      // 右侧页面导航（目录）
      main.child(flex(toc => {
        toc.styles({
          width: '200px',
          padding: '32px 16px',
          overflowY: 'auto',
        });

        setup.toc?.(toc);
      }));
    }));
  });
}

/**
 * 侧边栏菜单项
 */
export function sidebarItem(text, href, active = false, onclick = null) {
  return menuItem(text, item => {
    item.styles({
      fontSize: '14px',
      padding: '8px 16px',
      color: active
        ? 'var(--islands-primary, #667eea)'
        : 'var(--islands-text, #333)',
      background: active
        ? 'var(--islands-primary-alpha, rgba(102, 126, 234, 0.1))'
        : 'transparent',
      borderRight: active
        ? '2px solid var(--islands-primary, #667eea)'
        : '2px solid transparent',
    });
    item.on('click', (e) => {
      e.preventDefault();
      if (onclick) onclick();
      else if (href) window.location.href = href;
    });
  });
}

/**
 * 侧边栏分组
 */
export function sidebarGroup(title, items = []) {
  return vstack(group => {
    group.gap('4px');
    group.child(menuItem(title, h => {
      h.styles({
        fontSize: '12px',
        fontWeight: '600',
        color: 'var(--islands-text-secondary, #999)',
        padding: '8px 16px 4px',
        textTransform: 'uppercase',
      });
    }));
    items.forEach(item => group.child(item));
  });
}

/**
 * 目录项
 */
export function tocItem(text, href, level = 1) {
  return menuItem(text, item => {
    item.styles({
      fontSize: level === 1 ? '14px' : '13px',
      padding: '6px 12px',
      color: 'var(--islands-text-secondary, #666)',
      marginLeft: level === 1 ? '0' : '12px',
    });
    item.on('click', (e) => {
      e.preventDefault();
      if (href) {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * 文档章节
 */
export function docSection(id, title, children) {
  return vstack(section => {
    section.gap('16px');
    section.styles({ marginBottom: '40px', scrollMarginTop: '80px' });
    if (id) section.id(id);

    // 章节标题
    section.child(flex(titleRow => {
      titleRow.alignItems('center');
      titleRow.child(menuItem(title, h2 => {
        h2.styles({
          fontSize: '24px',
          fontWeight: '600',
          color: 'var(--islands-text, #333)',
        });
      }));
    }));

    // 章节内容
    if (children) {
      children.forEach(child => section.child(child));
    }
  });
}

/**
 * 代码演示块
 */
export function codeDemo(title, demoContent, codeString) {
  return card(c => {
    c.styles({ marginBottom: '24px' });

    c.cardHeader(h => {
      h.styles({ fontSize: '14px', fontWeight: '600' });
      h.text(title || '示例');
    });

    c.cardBody(content => {
      content.gap('16px');

      // 演示区域
      content.child(flex(demo => {
        demo.styles({
          padding: '20px',
          background: 'var(--islands-doc-example-demo-bg, #f8f9fa)',
          borderRadius: 'var(--islands-radius-md, 6px)',
        });
        demo.child(demoContent);
      }));

      // 代码区域
      if (codeString) {
        content.child(vCode(c => {
          c.content(codeString);
          c.showLineNumbers(true);
        }));
      }
    });
  });
}
