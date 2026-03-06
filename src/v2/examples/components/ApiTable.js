/**
 * ApiTable 组件
 * API 属性表格
 */

import { vCard, vCardBody, vMenu, flex, vMenuItem } from '../../../yoya/index.js';

/**
 * API 表格
 * @param {Array} items - API 项数组 [{ name, desc, type }]
 */
export function ApiTable(items = []) {
  return vCard(c => {
    c.vCardBody(api => {
      api.child(vMenu(apiMenu => {
        apiMenu.vertical();

        items.forEach(item => {
          apiMenu.item(it => {
            it.child(flex(apiRow => {
              apiRow.justifyBetween();
              apiRow.child(vMenuItem(item.name));
              apiRow.child(vMenuItem(item.desc));
              apiRow.child(vMenuItem(item.type || ''));
            }));
          });
        });
      }));
    });
  });
}
