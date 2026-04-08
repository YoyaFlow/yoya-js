/**
 * PageTOC 组件
 * 页面目录导航（带滚动监听和激活状态高亮）
 *
 * 使用方式：
 * const toc = pageTOC({
 *   items: [{ text: '标题', href: '#id', level: 1 }],
 *   title: '本页目录',
 *   contentContainer: scrollContainerEl
 * });
 */

import { vstack, div } from '../../../yoya/index.js';
import { vMenuItem } from '../../../yoya/index.js';

/**
 * 目录项组件
 */
export function tocItem(text, href, level = 1, isActive = false) {
  return vMenuItem(text, item => {
    item._tocHref = href;

    const activeStyles = {
      color: 'var(--yoya-primary, #2563EB)',
      fontWeight: '500',
      background: 'var(--yoya-primary-alpha, rgba(37, 99, 235, 0.1))',
      borderRight: '2px solid var(--yoya-primary, #2563EB)',
    };

    const inactiveStyles = {
      fontSize: level === 1 ? '14px' : '13px',
      padding: '6px 12px',
      color: 'var(--yoya-text-secondary, #666)',
      marginLeft: level === 1 ? '0' : '12px',
      cursor: 'pointer',
      borderRight: '2px solid transparent',
    };

    item.styles(isActive ? activeStyles : inactiveStyles);
    item._activeStyles = activeStyles;
    item._inactiveStyles = { ...inactiveStyles, ...(level === 2 ? { marginLeft: '12px' } : {}) };

    item.on('click', (e) => {
      e.preventDefault();
      if (href) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/**
 * PageTOC 主组件
 * @param {Object} options
 * @param {Array} options.items - 目录项数组 [{ text, href, level }]
 * @param {string} options.title - 标题
 * @param {HTMLElement} options.contentContainer - 内容容器（用于监听滚动）
 */
export function pageTOC({ items = [], title = '本页目录', contentContainer = null }) {
  return vstack(toc => {
    toc.styles({
      width: '200px',
      padding: '32px 16px',
      overflowY: 'auto',
    });

    toc._items = [];
    toc._activeItem = null;
    toc._observer = null;
    toc._contentContainer = contentContainer;
    toc._linksContainer = null; // 缓存链接容器引用

    // 标题
    toc.child(vMenuItem(title, t => {
      t.styles({
        fontWeight: '600',
        fontSize: '14px',
        marginBottom: '12px',
        color: 'var(--yoya-text-primary, #333)',
      });
    }));

    // 目录项列表
    toc.child(vstack(links => {
      links.gap('4px');
      links.addClass('toc-links'); // 添加特定类名便于查找
      toc._linksContainer = links; // 缓存引用
      items.forEach(item => {
        const itemEl = tocItem(item.text, item.href, item.level, false);
        links.child(itemEl);
        toc._items.push(itemEl);
      });
    }));

    // 设置滚动监听
    if (contentContainer) {
      setupScrollObserver(toc, contentContainer, items);
    }
  });
}

/**
 * 设置滚动监听
 */
function setupScrollObserver(tocInstance, contentEl, items) {
  // 清理旧的 observer
  if (tocInstance._observer) {
    tocInstance._observer.disconnect();
    tocInstance._observer = null;
  }

  if (!contentEl || items.length === 0) {
    return;
  }

  // 等待 DOM 元素就绪
  waitForSectionsAndSetupToc(tocInstance, contentEl, items);
}

/**
 * 等待 DOM 元素就绪并设置 TOC
 */
function waitForSectionsAndSetupToc(tocInstance, contentContainer, items) {
  const trySetup = () => {
    const sectionElements = items
      .map(item => item.href)
      .filter(href => href && href.startsWith('#'))
      .map(href => document.querySelector(href))
      .filter(el => el);

    if (sectionElements.length > 0) {
      setupIntersectionObserver(tocInstance, contentContainer, sectionElements);
      return true;
    }
    return false;
  };

  // 立即尝试一次
  if (trySetup()) return;

  // 使用 MutationObserver 等待元素出现
  const observer = new MutationObserver(() => {
    if (trySetup()) {
      observer.disconnect();
    }
  });

  observer.observe(contentContainer, {
    childList: true,
    subtree: true
  });

  // 5 秒超时
  setTimeout(() => {
    observer.disconnect();
  }, 5000);
}

/**
 * 设置 IntersectionObserver
 */
function setupIntersectionObserver(tocInstance, contentEl, sectionElements) {
  tocInstance._observer = new IntersectionObserver((entries) => {
    let visibleSection = null;
    let maxRatio = 0;

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const ratio = entry.intersectionRatio;
        if (ratio > maxRatio) {
          maxRatio = ratio;
          visibleSection = entry.target.id;
        }
      }
    });

    if (visibleSection) {
      updateActiveState(tocInstance, '#' + visibleSection);
    }
  }, {
    root: contentEl,
    threshold: [0.1, 0.3, 0.5, 0.7]
  });

  sectionElements.forEach(el => {
    tocInstance._observer.observe(el);
  });
}

/**
 * 更新 TOC 激活状态
 */
function updateActiveState(tocInstance, activeHref) {
  const items = tocInstance._items || [];
  items.forEach(itemEl => {
    if (itemEl._tocHref === activeHref) {
      if (itemEl !== tocInstance._activeItem) {
        // 移除旧激活状态
        if (tocInstance._activeItem && tocInstance._activeItem._inactiveStyles) {
          tocInstance._activeItem.styles(tocInstance._activeItem._inactiveStyles);
        }
        // 设置新激活状态
        itemEl.styles(itemEl._activeStyles);
        tocInstance._activeItem = itemEl;
      }
    } else if (itemEl !== tocInstance._activeItem && itemEl._inactiveStyles) {
      itemEl.styles(itemEl._inactiveStyles);
    }
  });
}

/**
 * 更新 TOC 项目
 * @param {Array} items - 新的目录项数组
 */
export function updateTOCItems(tocInstance, items, contentContainer = null) {
  if (!tocInstance || !tocInstance._el) return;

  // 清理旧的 observer
  if (tocInstance._observer) {
    tocInstance._observer.disconnect();
    tocInstance._observer = null;
  }

  // 清空现有项目
  tocInstance._items = [];

  // 使用缓存的链接容器引用
  const linksContainer = tocInstance._linksContainer?._el || tocInstance._el.querySelector('.toc-links');
  if (linksContainer) {
    while (linksContainer.firstChild) {
      linksContainer.removeChild(linksContainer.firstChild);
    }

    // 重新添加项目到现有容器
    items.forEach(item => {
      const itemEl = tocItem(item.text, item.href, item.level, false);
      linksContainer.appendChild(itemEl.renderDom());
      tocInstance._items.push(itemEl);
    });
  }

  // 更新内容容器并重新设置监听
  if (contentContainer) {
    tocInstance._contentContainer = contentContainer;
    setupScrollObserver(tocInstance, contentContainer, items);
  }
}

/**
 * 清理 TOC 资源
 */
export function cleanupTOC(tocInstance) {
  if (tocInstance && tocInstance._observer) {
    tocInstance._observer.disconnect();
    tocInstance._observer = null;
  }
  if (tocInstance) {
    tocInstance._activeItem = null;
    tocInstance._items = [];
  }
}
