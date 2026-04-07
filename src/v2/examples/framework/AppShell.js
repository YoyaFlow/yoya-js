/**
 * AppShell 组件
 * 应用主布局：顶部导航 + 左侧菜单 + 内容区 + 右侧目录
 */

import { vBody, vstack, flex, container } from '../../../yoya/index.js';
import { TopNavbar } from './TopNavbar.js';
import { Sidebar } from './Sidebar.js';
import { TableOfContents } from './TableOfContents.js';

/**
 * AppShell 主组件
 * @param {object} options
 * @param {string} options.currentPage - 当前页面文件名（如 'button.html'）
 * @param {function} options.content - 内容区渲染函数
 * @param {Array} options.tocItems - 右侧目录项
 * @param {boolean} options.useVRouterViews - 是否使用 VRouterViews 模式
 * @param {Object} options.vRouterInstance - VRouter 实例（VRouterViews 模式下使用）
 */
export function AppShell({ currentPage = '', content, tocItems = [], useVRouterViews = false, vRouterInstance = null }) {
  return vBody(layout => {
    // ========== 顶部导航栏 ==========
    layout.child(TopNavbar());

    // ========== 主体区域 ==========
    layout.child(flex(main => {
      main.styles({ flex: 1, display: 'flex' });

      // 左侧菜单
      main.child(Sidebar({ currentPage, useVRouterViews, vRouterInstance }));

      // 中间内容区
      main.child(container(contentWrapper => {
        contentWrapper.styles({
          flex: 1,
          maxWidth: '960px',
          padding: '32px 24px',
          overflowY: 'auto',
        });

        if (content) {
          content(contentWrapper);
        }
      }));

      // 右侧目录
      main.child(TableOfContents({ items: tocItems }));
    }));
  });
}
