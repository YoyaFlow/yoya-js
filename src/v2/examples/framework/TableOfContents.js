/**
 * TableOfContents 组件
 * 右侧页面目录导航
 */

import { vstack } from '../../../yoya/index.js';
import { vMenuItem } from '../../../yoya/index.js';

/**
 * 目录项
 */
export function tocItem(text, href, level = 1) {
  return vMenuItem(text, item => {
    item.styles({
      fontSize: level === 1 ? '14px' : '13px',
      padding: '6px 12px',
      color: 'var(--islands-text-secondary, #666)',
      marginLeft: level === 1 ? '0' : '12px',
      cursor: 'pointer',
    });
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
 * TableOfContents 主组件
 * @param {Array} items - 目录项数组 [{ text, href, level }]
 */
export function TableOfContents({ items = [], title = '本页目录' }) {
  return vstack(toc => {
    toc.styles({
      width: '200px',
      padding: '32px 16px',
      overflowY: 'auto',
    });

    toc.child(vMenuItem(title));
    toc.child(vstack(links => {
      links.gap('4px');
      items.forEach(item => {
        links.child(tocItem(item.text, item.href, item.level));
      });
    }));
  });
}
