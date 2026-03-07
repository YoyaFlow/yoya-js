/**
 * Yoya.Components - Detail / Descriptions
 * 类似 antd Descriptions 的详情展示组件
 */

import { Tag, div, span, table, tr, td, th } from '../core/basic.js';

// ============================================
// VDetail 详情展示组件
// ============================================

class VDetail extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._items = [];
    this._column = 3;
    this._title = null;
    this._bordered = false;
    this._layout = 'horizontal'; // 'horizontal' | 'vertical'
    this._initialized = false;

    // 1. 设置基础样式
    this._setupBaseStyles();

    // 2. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 3. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.styles({
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      fontSize: 'var(--islands-descriptions-font-size, 14px)',
      color: 'var(--islands-descriptions-text, var(--islands-text, #333))',
      background: 'var(--islands-descriptions-bg, transparent)',
    });
  }

  // 创建表格结构
  _buildTable() {
    this.clear();

    // 标题
    if (this._title) {
      const titleEl = div(t => {
        t.styles({
          padding: 'var(--islands-descriptions-title-padding, 12px 0)',
          fontSize: 'var(--islands-descriptions-title-size, 16px)',
          fontWeight: 'var(--islands-descriptions-title-font-weight, 600)',
          color: 'var(--islands-descriptions-title-color, var(--islands-text, #333))',
          marginBottom: 'var(--islands-descriptions-title-margin, 12px)',
        });
        t.text(this._title);
      });
      this.child(titleEl);
    }

    // 表格容器
    const tableContainer = div(tc => {
      tc.styles({
        width: '100%',
        overflowX: 'auto',
      });

      if (this._layout === 'vertical') {
        // 纵向布局：使用 flex 布局
        this._buildVerticalLayout(tc);
      } else {
        // 横向布局：使用表格布局
        const tbl = table(t => {
          t.styles({
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 'inherit',
          });

          if (this._bordered) {
            t.style('border', '1px solid var(--islands-descriptions-border, var(--islands-border, #e0e0e0))');
          }
        });

        // 根据 items 和 column 计算行数
        const rows = this._buildRows();

        rows.forEach(rowItems => {
          const trEl = tr(r => {
            if (this._bordered) {
              r.style('borderBottom', '1px solid var(--islands-descriptions-border, var(--islands-border, #e0e0e0))');
            }
          });

          rowItems.forEach(item => {
            // 标签单元格
            const labelTd = td(l => {
              l.styles({
                padding: 'var(--islands-descriptions-padding, 12px 16px)',
                background: this._bordered
                  ? 'var(--islands-descriptions-label-bg, var(--islands-bg-secondary, #f7f8fa))'
                  : 'transparent',
                color: 'var(--islands-descriptions-label-color, var(--islands-text-secondary, #666))',
                fontWeight: 'var(--islands-descriptions-label-font-weight, 500)',
                textAlign: 'left',
                width: 'var(--islands-descriptions-label-width, 120px)',
                boxSizing: 'border-box',
              });

              if (this._bordered) {
                l.style('borderRight', '1px solid var(--islands-descriptions-border, var(--islands-border, #e0e0e0))');
              }

              if (item.label) {
                l.text(item.label);
              }
            });

            // 内容单元格
            const contentTd = td(c => {
              c.styles({
                padding: 'var(--islands-descriptions-padding, 12px 16px)',
                color: 'var(--islands-descriptions-content-color, var(--islands-text, #333))',
                boxSizing: 'border-box',
              });

              if (this._bordered) {
                c.style('borderRight', '1px solid var(--islands-descriptions-border, var(--islands-border, #e0e0e0))');
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
      g.styles({
        display: 'grid',
        gridTemplateColumns: `repeat(${this._column}, 1fr)`,
        gap: 'var(--islands-descriptions-vertical-gap, 16px)',
      });

      this._items.forEach(item => {
        const itemEl = div(i => {
          i.styles({
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--islands-descriptions-vertical-item-gap, 6px)',
          });

          // 标签
          const labelEl = span(l => {
            l.styles({
              fontSize: 'var(--islands-descriptions-label-font-size, 12px)',
              color: 'var(--islands-descriptions-label-color, var(--islands-text-secondary, #666))',
              fontWeight: 'var(--islands-descriptions-label-font-weight, 500)',
            });
            if (item.label) l.text(item.label);
          });

          // 内容
          const contentEl = div(c => {
            c.styles({
              fontSize: 'var(--islands-descriptions-content-font-size, 14px)',
              color: 'var(--islands-descriptions-content-color, var(--islands-text, #333))',
              padding: 'var(--islands-descriptions-vertical-content-padding, 8px 0)',
            });

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
