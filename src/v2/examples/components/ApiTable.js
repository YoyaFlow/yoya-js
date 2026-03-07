/**
 * ApiTable 组件
 * API 属性表格
 */

import { vCard, vCardBody, div, span, table, tr, th, td } from '../../../yoya/index.js';

/**
 * API 表格
 * @param {Array} items - API 项数组 [{ name, desc, type }]
 */
export function ApiTable(items = []) {
  return vCard(c => {
    c.styles({
      overflow: 'hidden',
    });
    c.vCardBody(api => {
      api.styles({ padding: 0 });

      api.child(table(tbl => {
        tbl.styles({
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
        });

        // 表头
        tbl.child(tr(header => {
          header.child(th(h => {
            h.styles({
              padding: '12px 16px',
              textAlign: 'left',
              fontWeight: '600',
              color: 'var(--islands-text, #333)',
              background: 'var(--islands-bg-secondary, #f7f8fa)',
              borderBottom: '2px solid var(--islands-border, #e0e0e0)',
              width: '25%',
            });
            h.text('属性');
          }));
          header.child(th(h => {
            h.styles({
              padding: '12px 16px',
              textAlign: 'left',
              fontWeight: '600',
              color: 'var(--islands-text, #333)',
              background: 'var(--islands-bg-secondary, #f7f8fa)',
              borderBottom: '2px solid var(--islands-border, #e0e0e0)',
              width: '45%',
            });
            h.text('说明');
          }));
          header.child(th(h => {
            h.styles({
              padding: '12px 16px',
              textAlign: 'left',
              fontWeight: '600',
              color: 'var(--islands-text, #333)',
              background: 'var(--islands-bg-secondary, #f7f8fa)',
              borderBottom: '2px solid var(--islands-border, #e0e0e0)',
              width: '30%',
            });
            h.text('类型');
          }));
        }));

        // 表体
        items.forEach((item, index) => {
          tbl.child(tr(row => {
            row.child(td(c => {
              c.styles({
                padding: '12px 16px',
                borderBottom: index < items.length - 1 ? '1px solid var(--islands-border, #e0e0e0)' : 'none',
                color: 'var(--islands-primary, #667eea)',
                fontWeight: '500',
                fontFamily: 'monospace',
                fontSize: '13px',
                verticalAlign: 'top',
              });
              c.text(item.name);
            }));
            row.child(td(c => {
              c.styles({
                padding: '12px 16px',
                borderBottom: index < items.length - 1 ? '1px solid var(--islands-border, #e0e0e0)' : 'none',
                color: 'var(--islands-text, #333)',
                verticalAlign: 'top',
              });
              c.text(item.desc);
            }));
            row.child(td(c => {
              c.styles({
                padding: '12px 16px',
                borderBottom: index < items.length - 1 ? '1px solid var(--islands-border, #e0e0e0)' : 'none',
                color: 'var(--islands-text-secondary, #666)',
                fontFamily: 'monospace',
                fontSize: '13px',
                verticalAlign: 'top',
              });
              c.text(item.type || '');
            }));
          }));
        });
      }));
    });
  });
}
