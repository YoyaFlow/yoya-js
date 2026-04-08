/**
 * AppShell 组件
 * 应用主布局：顶部导航 + 左侧菜单 + 内容区
 */

import { vBody, vstack, flex, container, div } from '../../../yoya/index.js';
import { TopNavbar } from './TopNavbar.js';
import { Sidebar } from './Sidebar.js';
import { pageTOC, updateTOCItems, cleanupTOC } from './TOC.js';

// 全局 TOC 实例引用
let globalTocInstance = null;
let globalTocItems = [];
// 滚动容器元素引用（VRouterViews 模式下使用）
let scrollContainerElement = null;

/**
 * 设置滚动容器元素（用于 VRouterViews 模式）
 * @param {HTMLElement|null} el - 滚动容器元素
 */
export function setScrollContainer(el) {
  scrollContainerElement = el;
}

/**
 * 获取当前的滚动容器
 * @returns {HTMLElement|null} 滚动容器元素
 */
function getScrollContainer() {
  return scrollContainerElement;
}

/**
 * 渲染 TOC 到固定容器
 * @param {Array} items - TOC 目录项数组
 * @param {HTMLElement|null} scrollContainer - 滚动容器元素
 */
function renderToc(items, scrollContainer = null) {
  if (!globalTocInstance) return;

  // 延迟渲染，确保 DOM 已经渲染
  setTimeout(() => {
    // 优先使用传入的 scrollContainer，其次使用回调函数获取
    let container = scrollContainer || getScrollContainer();

    updateTOCItems(globalTocInstance, items, container);
  }, 0);
}

/**
 * AppShell 主组件
 * @param {object} options
 * @param {string} options.currentPage - 当前页面文件名（如 'button.html'）
 * @param {function} options.content - 内容区渲染函数
 * @param {Array} options.tocItems - TOC 目录项数组 [{ text, href, level }]
 * @param {boolean} options.useVRouterViews - 是否使用 VRouterViews 模式
 * @param {Object} options.vRouterInstance - VRouter 实例（VRouterViews 模式下使用）
 * @param {Function} options.onNavigate - VRouterViews 模式下的导航回调
 */
export function AppShell({ currentPage = '', content, tocItems = [], useVRouterViews = false, vRouterInstance = null, onNavigate = null }) {
  return vBody(layout => {
    // VRouterViews 模式下，限制高度为 100%，覆盖默认的 100vh
    if (useVRouterViews) {
      layout.styles({ height: '100%', minHeight: '0' });
    }
    // ========== 顶部导航栏 ==========
    layout.child(TopNavbar());

    // ========== 主体区域 ==========
    layout.child(flex(main => {
      main.styles({ flex: 1, display: 'flex', minHeight: 0, overflow: 'auto' });
      main.row(); // 水平布局：侧边栏在左，内容在右

      // 左侧菜单
      main.child(Sidebar({ currentPage, useVRouterViews, vRouterInstance, onNavigate }));

      // 中间内容区（主内容 + 右上角固定 TOC）
      main.child(div(contentArea => {
        contentArea.styles({
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: useVRouterViews ? 'hidden' : 'auto', // VRouterViews 模式下让 VRouterViews 自己管理滚动
          position: 'relative',
          minHeight: 0, // 确保 flex 子项可以正确收缩
        });

        // 内容包装器（右侧为 TOC 留出空间）
        contentArea.child(div(contentWrapper => {
          contentWrapper.styles({
            padding: useVRouterViews ? '0' : '32px 24px',
            paddingRight: '220px', // 为右侧固定 TOC 留出空间
            flex: useVRouterViews ? 1 : 0, // VRouterViews 模式下填充父容器
            minHeight: useVRouterViews ? 0 : 'auto',
            overflow: useVRouterViews ? 'hidden' : 'visible',
          });

          if (content) {
            content(contentWrapper);
          }
        }));

        // 固定 TOC 容器（只创建一次）
        if (!globalTocInstance) {
          // 使用 pageTOC 初始化 TOC 组件
          globalTocInstance = pageTOC({
            items: [],
            title: '本页目录',
            contentContainer: null,
          });
          globalTocInstance.styles({
            position: 'fixed',
            top: '80px',
            right: '24px',
            width: '180px',
            zIndex: 10,
          });
          contentArea.child(globalTocInstance);
        }

        // 更新 TOC 内容
        globalTocItems = tocItems;
        // 无论是哪种模式，都直接渲染 TOC
        renderToc(tocItems);
      }));
    }));
  });
}

/**
 * 更新 TOC（用于 VRouterViews 模式）
 * @param {Array} tocItems - TOC 目录项数组
 * @param {HTMLElement|null} scrollContainer - 滚动容器元素
 */
export function updateToc(tocItems, scrollContainer = null) {
  globalTocItems = tocItems;
  renderToc(tocItems, scrollContainer);
}
