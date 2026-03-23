/**
 * PageHeader 组件
 * 页面标题头
 */

import { vstack, vMenuItem } from '../../../yoya/index.js';
import '../../../yoya/theme/css/index.js'

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
