/**
 * PageHeader 组件
 * 页面标题头
 *
 * 注意：不需要手动导入 CSS，主题 CSS 已通过 yoya.theme.min.css 统一引入
 */

import { vstack, vMenuItem } from '../../../yoya/index.js';

/**
 * 页面标题头
 * @param {string} title - 页面标题
 * @param {string} description - 页面描述
 */
export function PageHeader({ title, description = '' }) {
  return vstack(header => {
    header.gap('8px');
    header.child(vMenuItem(title));
    if (description) {
      header.child(vMenuItem(description));
    }
  });
}
