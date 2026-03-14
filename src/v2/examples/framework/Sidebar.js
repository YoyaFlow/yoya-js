/**
 * Sidebar 组件
 * 左侧菜单栏，使用统一菜单配置和 vSidebar 组件
 */

import { vSidebar, vMenuItem, toast } from '../../../yoya/index.js';
import { menuConfig } from '../config/menuConfig.js';

/**
 * Sidebar 主组件
 * @param {string} currentPage - 当前页面文件名（如 'button.html'）
 * @param {boolean} collapsible - 是否可折叠
 * @param {boolean} dark - 是否深色模式
 */
export function Sidebar({ currentPage = '', collapsible = true, dark = false }) {
  return vSidebar(sidebar => {
    sidebar.width('220px');
    sidebar.collapsedWidth('64px');

    if (dark) sidebar.dark();

    // 头部
    sidebar.header(h => {
      h.styles({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
      });
      h.span(span => {
        span.styles({
          fontSize: '16px',
          fontWeight: '600',
          color: 'var(--islands-primary, #667eea)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        });
        span.text('🏝️ Yoya.Basic');
      });
      if (collapsible) {
        sidebar.showToggleBtn();
      }
    });

    // 内容区
    sidebar.content(content => {
      menuConfig.forEach(group => {
        // 分组标题
        content.item(group.group, item => {
          item.styles({
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--yoya-text-secondary, #666)',
            padding: '8px 16px 4px',
            textTransform: 'uppercase',
            pointerEvents: 'none',
          });
        });

        // 分组菜单项
        group.items.forEach(menuItem => {
          const isActive = menuItem.file === currentPage;
          content.item(menuItem.label, item => {
            item.styles({
              fontSize: '14px',
              padding: '8px 16px',
              color: isActive
                ? 'var(--yoya-primary, #2563EB)'
                : 'var(--yoya-text, #333)',
              background: isActive
                ? 'var(--yoya-primary-alpha, rgba(37, 99, 235, 0.1))'
                : 'transparent',
              borderRight: isActive
                ? '3px solid var(--yoya-primary, #2563EB)'
                : '3px solid transparent',
              cursor: 'pointer',
            });
            if (isActive) item.active();
            item.onClick(() => {
              window.location.href = menuItem.file;
            });
          });
        });

        // 分组分割线
        content.divider();
      });
    });

    // 底部
    sidebar.footer(footer => {
      footer.styles({
        fontSize: '12px',
        color: 'var(--yoya-text-secondary, #666)',
        textAlign: 'center',
      });
      footer.text('© 2024 Yoya.Basic');
    });
  });
}
