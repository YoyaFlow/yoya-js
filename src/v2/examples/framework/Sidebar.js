/**
 * Sidebar 组件
 * 左侧菜单栏，使用统一菜单配置
 */

import { vstack } from '../../../yoya/index.js';
import { vMenuItem } from '../../../yoya/index.js';
import { menuConfig } from '../config/menuConfig.js';

/**
 * 侧边栏菜单项
 */
export function sidebarItem(text, href, active = false) {
  return vMenuItem(text, item => {
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
      cursor: 'pointer',
    });
    item.on('click', (e) => {
      e.preventDefault();
      if (href) {
        window.location.href = href;
      }
    });
  });
}

/**
 * 侧边栏分组
 */
export function sidebarGroup(title, items = []) {
  return vstack(group => {
    group.gap('4px');
    group.child(vMenuItem(title, h => {
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
 * Sidebar 主组件
 * @param {string} currentPage - 当前页面文件名（如 'button.html'）
 */
export function Sidebar({ currentPage = '' }) {
  return vstack(sidebar => {
    sidebar.styles({
      width: '220px',
      background: 'var(--islands-card-bg, white)',
      borderRight: '1px solid var(--islands-border, #e0e0e0)',
      overflowY: 'auto',
      padding: '16px 0',
    });

    // 根据菜单配置生成 sidebar 内容
    menuConfig.forEach(group => {
      const items = group.items.map(item => {
        const isActive = item.file === currentPage;
        return sidebarItem(item.label, item.file, isActive);
      });
      sidebar.child(sidebarGroup(group.group, items));
    });
  });
}
