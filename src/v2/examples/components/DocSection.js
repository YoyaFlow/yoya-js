/**
 * DocSection 组件
 * 文档章节容器
 */

import { vstack, flex } from '../../../yoya/index.js';
import { vMenuItem } from '../../../yoya/index.js';

/**
 * 文档章节
 * @param {string} id - 章节 ID（用于锚点）
 * @param {string} title - 章节标题
 * @param {Array} children - 子元素数组
 */
export function DocSection(id, title, children = []) {
  return vstack(section => {
    section.gap('16px');
    section.styles({ marginBottom: '40px', scrollMarginTop: '80px' });
    if (id) section.id(id);

    // 章节标题
    section.child(flex(titleRow => {
      titleRow.alignItems('center');
      titleRow.child(vMenuItem(title));
    }));

    // 章节内容
    children.forEach(child => section.child(child));
  });
}
