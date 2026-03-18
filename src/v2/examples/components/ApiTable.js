/**
 * ApiTable 组件
 * API 属性表格
 */

import { vCard, vCardHeader, vCardBody, div, span, table, tr, th, td, code } from '../../../yoya/index.js';

/**
 * API 表格
 * @param {Object} options - 配置选项
 * @param {string} options.title - 表格标题
 * @param {Array} options.items - API 项数组 [{ name, description, type, props, returns }]
 */
export function ApiTable(options = {}) {
  // 支持传入 title 和 items，或者直接传入 items 数组
  const title = options.title || '';
  const items = options.items || (Array.isArray(options) ? options : []);

  return vCard(c => {
    c.styles({
      overflow: 'hidden',
      marginBottom: '24px',
    });

    if (title) {
      c.vCardHeader(title);
    }

    c.vCardBody(api => {
      api.styles({ padding: 0 });

      api.child(table(tbl => {
        tbl.className('yoya-api-table');
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
              width: '20%',
            });
            h.text('名称');
          }));
          header.child(th(h => {
            h.styles({
              padding: '12px 16px',
              textAlign: 'left',
              fontWeight: '600',
              width: '40%',
            });
            h.text('说明');
          }));
          header.child(th(h => {
            h.styles({
              padding: '12px 16px',
              textAlign: 'left',
              fontWeight: '600',
              width: '40%',
            });
            h.text('参数');
          }));
        }));

        // 表体
        items.forEach((item, index) => {
          tbl.child(tr(row => {
            // 名称列
            row.child(td(c => {
              c.styles({
                padding: '12px 16px',
                borderBottom: index < items.length - 1 ? '1px solid var(--yoya-border, #e0e0e0)' : 'none',
                color: 'var(--yoya-primary, #667eea)',
                fontWeight: '600',
                fontFamily: 'monospace',
                fontSize: '13px',
                verticalAlign: 'top',
              });
              c.text(item.name);
            }));

            // 说明列
            row.child(td(c => {
              c.styles({
                padding: '12px 16px',
                borderBottom: index < items.length - 1 ? '1px solid var(--yoya-border, #e0e0e0)' : 'none',
                color: 'var(--yoya-text-primary, #333)',
                verticalAlign: 'top',
                fontSize: '13px',
              });
              c.text(item.description || item.desc || '');
            }));

            // 参数/返回值列
            row.child(td(c => {
              c.styles({
                padding: '12px 16px',
                borderBottom: index < items.length - 1 ? '1px solid var(--yoya-border, #e0e0e0)' : 'none',
                color: 'var(--yoya-text-secondary, #666)',
                verticalAlign: 'top',
                fontSize: '13px',
              });

              // 如果有 props 参数
              if (item.props && item.props.length > 0) {
                c.child(div(propsDiv => {
                  propsDiv.styles({ marginBottom: '8px' });
                  propsDiv.child(span(s => {
                    s.styles({ fontWeight: '600', color: 'var(--yoya-text-primary, #555)' });
                    s.text('参数:');
                  }));
                  propsDiv.child(div(propList => {
                    propList.styles({ marginTop: '4px', paddingLeft: '12px' });
                    item.props.forEach(prop => {
                      propList.child(div(p => {
                        p.styles({ marginBottom: '4px' });
                        p.child(code(c => {
                          c.styles({
                            background: 'var(--yoya-bg-tertiary)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            color: 'var(--yoya-text-primary)',
                          });
                          c.text(prop.name);
                        }));
                        p.text(` - ${prop.type || ''}`);
                        if (prop.description) {
                          p.text(` - ${prop.description}`);
                        }
                      }));
                    });
                  }));
                }));
              }

              // 返回值
              if (item.returns) {
                c.child(div(ret => {
                  ret.styles({ fontWeight: '600', color: 'var(--yoya-text-primary, #555)' });
                  ret.text('返回: ' + item.returns);
                }));
              }

              // 简单类型显示
              if (item.type && !item.props) {
                c.child(code(c => {
                  c.styles({
                    background: 'var(--yoya-bg-tertiary)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    color: 'var(--yoya-text-primary)',
                  });
                  c.text(item.type);
                }));
              }
            }));
          }));
        });
      }));
    });
  });
}
