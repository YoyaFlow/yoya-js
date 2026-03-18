/**
 * Yoya.Components - Detail / Descriptions
 * 类似 antd Descriptions 的详情展示组件
 */

import { Tag, div, span, table, tr, td, th } from '../core/basic.js';

// ============================================
// VDetail 详情展示组件
// ============================================

class VDetail extends Tag {
  static _stateAttrs = ['bordered', 'layout', 'column'];

  constructor(setup = null) {
    super('div', null);

    this.registerStateAttrs(...this.constructor._stateAttrs);

    this._items = [];
    this._column = 3;
    this._title = null;
    this._bordered = false;
    this._layout = 'horizontal';
    this._initialized = false;

    this.addClass('yoya-detail');
    this._registerStateHandlers();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _registerStateHandlers() {
    this.registerStateHandler('bordered', (bordered, host) => {
      if (bordered) {
        host.addClass('yoya-detail--bordered');
      } else {
        host.removeClass('yoya-detail--bordered');
      }
    });

    this.registerStateHandler('layout', (layout, host) => {
      host._layout = layout;
    });

    this.registerStateHandler('column', (column, host) => {
      host._column = column;
      if (host._layout === 'vertical' && host._gridContainer) {
        host._gridContainer.style('gridTemplateColumns', `repeat(${column}, 1fr)`);
      }
    });
  }

  // 创建表格结构
  _buildTable() {
    this.clear();

    // 标题
    if (this._title) {
      const titleEl = div(t => {
        t.addClass('yoya-detail__title');
        t.text(this._title);
      });
      this.child(titleEl);
    }

    // 表格容器
    const tableContainer = div(tc => {
      tc.addClass('yoya-detail__table-container');

      if (this._layout === 'vertical') {
        // 纵向布局：使用 flex 布局
        this._buildVerticalLayout(tc);
      } else {
        // 横向布局：使用表格布局
        const tbl = table(t => {
          t.addClass('yoya-detail__table');
          if (this._bordered) {
            t.addClass('yoya-detail__table--bordered');
          }
        });

        // 根据 items 和 column 计算行数
        const rows = this._buildRows();

        rows.forEach(rowItems => {
          const trEl = tr(r => {
            if (this._bordered) {
              r.addClass('yoya-detail__row--bordered');
            }
          });

          rowItems.forEach(item => {
            // 标签单元格
            const labelTd = td(l => {
              l.addClass('yoya-detail__label');
              if (this._bordered) {
                l.addClass('yoya-detail__label--bordered');
              }
              if (item.label) {
                l.text(item.label);
              }
            });

            // 内容单元格
            const contentTd = td(c => {
              c.addClass('yoya-detail__content');
              if (this._bordered) {
                c.addClass('yoya-detail__content--bordered');
              }
              if (item.content) {
                if (typeof item.content === 'string') {
                  c.text(item.content);
                } else if (item.content instanceof Tag) {
                  c.child(item.content);
                }
              }
            });

            trEl.child(labelTd, contentTd);
          });

          tbl.child(trEl);
        });

        tc.child(tbl);
      }
    });

    this.child(tableContainer);
  }

  // 纵向布局实现
  _buildVerticalLayout(container) {
    const grid = div(g => {
      g.addClass('yoya-detail__grid');
      g.style('gridTemplateColumns', `repeat(${this._column}, 1fr)`);
      this._gridContainer = g;

      this._items.forEach(item => {
        const itemEl = div(i => {
          i.addClass('yoya-detail__grid-item');

          // 标签
          const labelEl = span(l => {
            l.addClass('yoya-detail__grid-label');
            if (item.label) l.text(item.label);
          });

          // 内容
          const contentEl = div(c => {
            c.addClass('yoya-detail__grid-content');

            if (item.content) {
              if (typeof item.content === 'string') {
                c.text(item.content);
              } else if (item.content instanceof Tag) {
                c.child(item.content);
              }
            }
          });

          i.child(labelEl, contentEl);
        });

        g.child(itemEl);
      });
    });

    container.child(grid);
  }

  _buildRows() {
    const rows = [];
    let currentRow = [];

    for (const item of this._items) {
      currentRow.push(item);
      if (currentRow.length >= this._column) {
        rows.push(currentRow);
        currentRow = [];
      }
    }

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  }

  // ============================================
  // 链式方法
  // ============================================

  title(value) {
    if (value === undefined) return this._title;
    this._title = value;
    return this;
  }

  column(value) {
    if (value === undefined) return this._column;
    this._column = value;
    return this;
  }

  bordered(value = true) {
    this._bordered = value;
    return this;
  }

  layout(value) {
    if (value === undefined) return this._layout;
    this._layout = value; // 'horizontal' | 'vertical'
    return this;
  }

  item(label, content) {
    this._items.push({ label, content });
    this._buildTable();  // 重新构建表格
    return this;
  }

  items(itemsArray) {
    this._items = [...this._items, ...itemsArray];
    this._buildTable();  // 重新构建表格
    return this;
  }

  // 渲染
  renderDom() {
    if (this._deleted) return null;

    if (!this._initialized) {
      this._buildTable();
      this._initialized = true;
    }

    // 调用父类 renderDom 方法整合子元素
    return super.renderDom();
  }
}

function vDetail(setup = null) {
  return new VDetail(setup);
}

// ============================================
// VDetailItem 详情项（用于组合）
// ============================================

class VDetailItem extends Tag {
  constructor(label = '', content = null, setup = null) {
    if (typeof label === 'object' && label !== null) {
      setup = content;
      content = label.content;
      label = label.label;
    }

    super('div', null);

    this._label = label;
    this._content = content;

    if (setup !== null) {
      this.setup(setup);
    }
  }

  label(value) {
    if (value === undefined) return this._label;
    this._label = value;
    return this;
  }

  content(value) {
    if (value === undefined) return this._content;
    this._content = value;
    return this;
  }
}

function vDetailItem(label = '', content = null, setup = null) {
  return new VDetailItem(label, content, setup);
}

// ============================================
// Tag 原型扩展
// ============================================

Tag.prototype.vDetail = function(setup = null) {
  const detail = vDetail(setup);
  this.child(detail);
  return this;
};

// ============================================
// 导出
// ============================================

export {
  VDetail, vDetail,
  VDetailItem, vDetailItem,
};
