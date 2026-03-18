/**
 * Yoya.Components - Pager 分页导航
 * 用于处理分页导航，支持页码显示、上一页/下一页、跳转等功能
 * @module Yoya.Pager
 * @example
 * // 基础用法
 * import { vPager } from '../yoya/index.js';
 *
 * vPager(p => {
 *   p.total(100);        // 总记录数
 *   p.pageSize(10);      // 每页显示数量
 *   p.current(1);        // 当前页码
 *   p.onChange((page) => {
 *     console.log('切换到第', page, '页');
 *   });
 * });
 *
 * // 简洁模式（只显示必要按钮）
 * vPager(p => {
 *   p.total(100);
 *   p.simple(true);
 *   p.onChange((page) => {});
 * });
 *
 * // 显示完整页码
 * vPager(p => {
 *   p.total(200);
 *   p.pageSize(20);
 *   p.showQuickJumper(true);  // 显示跳转输入框
 *   p.showTotal(true);        // 显示总记录数
 *   p.onChange((page) => {});
 * });
 */

import { Tag, div, span } from '../core/basic.js';

// ============================================
// VPager 分页导航组件
// ============================================

class VPager extends Tag {
  static _stateAttrs = ['disabled', 'current', 'pageSize', 'total', 'totalPage', 'showQuickJumper', 'showTotal', 'simple'];

  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      current: 1,
      pageSize: 10,
      total: 0,
      totalPage: 0,
      showQuickJumper: false,
      showTotal: false,
      simple: false,
    });

    // 3. 内部状态
    this._total = 0;
    this._pageSize = 10;
    this._current = 1;
    this._totalPage = 0;
    this._showQuickJumper = false;
    this._showTotal = false;
    this._simple = false;
    this._onChange = null;

    // 4. 设置基础 CSS 类
    this.addClass('yoya-pager');

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 构建内容
    this._buildContent();

    // 7. 执行 setup
    if (setup) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.styles({
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      fontSize: '11px',
      color: 'var(--yoya-pager-color, var(--yoya-text, #333))',
      userSelect: 'none',
    });
  }

  _registerStateHandlers() {
    // disabled 状态处理器
    this.registerStateHandler('disabled', (disabled, host) => {
      if (disabled) {
        host.addClass('yoya-pager--disabled');
      } else {
        host.removeClass('yoya-pager--disabled');
      }
    });

    // current 状态处理器 - 更新页码显示
    this.registerStateHandler('current', (current, host) => {
      // 检查是否超出范围
      let newCurrent = current;
      if (host._totalPage > 0 && current > host._totalPage) {
        newCurrent = host._totalPage;
      }
      if (newCurrent < 1) newCurrent = 1;

      host._current = newCurrent;
      host._renderPageNumbers();
      // 触发变化事件
      host._triggerChange(newCurrent);
    });

    // total 状态处理器 - 重新计算总页数
    this.registerStateHandler('total', (total, host) => {
      host._total = total;
      host._totalPage = Math.ceil(total / host._pageSize);
      if (host._current > host._totalPage && host._totalPage > 0) {
        host.setState('current', host._totalPage);
      }
      host._renderPageNumbers();
    });

    // pageSize 状态处理器 - 重新计算总页数
    this.registerStateHandler('pageSize', (pageSize, host) => {
      host._pageSize = pageSize;
      host._totalPage = Math.ceil(host._total / pageSize);
      host._renderPageNumbers();
    });

    // simple 状态处理器 - 重新渲染页码
    this.registerStateHandler('simple', (simple, host) => {
      host._simple = simple;
      host._renderPageNumbers();
    });
  }

  /**
   * 创建导航按钮（上一页/下一页）
   * @private
   */
  _createNavButton(direction) {
    const self = this;
    const isPrev = direction === 'prev';

    const btn = div((b) => {
      b.addClass('yoya-pager__nav');

      b.html(isPrev ? '‹' : '›');

      b.on('mouseenter', () => {
        if (!self.hasState('disabled') && !self._isNavDisabled(isPrev)) {
          b.styles({
            borderColor: 'var(--yoya-primary)',
            color: 'var(--yoya-primary)',
          });
        }
      });

      b.on('mouseleave', () => {
        if (!self.hasState('disabled') && !self._isNavDisabled(isPrev)) {
          b.styles({
            borderColor: 'var(--yoya-border)',
            color: 'var(--yoya-text-primary)',
          });
        }
      });

      b.on('click', (e) => {
        e.stopPropagation();
        if (self.hasState('disabled') || self._isNavDisabled(isPrev)) return;

        const newPage = isPrev ? self._current - 1 : self._current + 1;
        self.setState('current', newPage);
      });

      // 初始禁用状态
      if (self._isNavDisabled(isPrev)) {
        b.addClass('yoya-pager__nav--disabled');
      }
    });

    return btn;
  }

  /**
   * 创建页码按钮
   * @private
   */
  _createPageButton(pageNum) {
    const self = this;
    const isCurrent = pageNum === self._current;

    const btn = div((b) => {
      b.addClass('yoya-pager__number');
      if (isCurrent) {
        b.addClass('yoya-pager__number--active');
      }

      b.text(String(pageNum));

      if (!isCurrent) {
        b.on('mouseenter', () => {
          if (!self.hasState('disabled')) {
            b.styles({
              borderColor: 'var(--yoya-primary)',
              color: 'var(--yoya-primary)',
            });
          }
        });

        b.on('mouseleave', () => {
          if (!self.hasState('disabled')) {
            b.styles({
              borderColor: 'var(--yoya-border)',
              color: 'var(--yoya-text-primary)',
            });
          }
        });
      }

      b.on('click', (e) => {
        e.stopPropagation();
        if (self.hasState('disabled') || isCurrent) return;

        self.setState('current', pageNum);
      });
    });

    return btn;
  }

  /**
   * 创建省略号
   * @private
   */
  _createMoreButton() {
    const more = div((m) => {
      m.addClass('yoya-pager__more');
      m.text('···');
    });
    return more;
  }

  /**
   * 创建总记录数显示
   * @private
   */
  _createTotalText() {
    const total = div((t) => {
      t.addClass('yoya-pager__total');
      t.text(`共 ${this._total} 条`);
    });
    return total;
  }

  /**
   * 创建快速跳转输入框
   * @private
   */
  _createJumperInput() {
    const self = this;

    const wrapper = div((w) => {
      w.addClass('yoya-pager__jumper');

      const label = span((s) => {
        s.addClass('yoya-pager__jumper-label');
        s.text('跳至');
      });

      const input = div((i) => {
        i.addClass('yoya-pager__jumper-input');

        const inputEl = document.createElement('input');
        inputEl.type = 'number';
        inputEl.min = '1';
        inputEl.max = String(self._totalPage);
        inputEl.value = String(self._current);
        inputEl.style.cssText = `
          width: 100%;
          border: none;
          outline: none;
          text-align: center;
          font-size: 11px;
          color: var(--yoya-text, #333);
          background: transparent;
          -moz-appearance: textfield;
        `;
        inputEl.style.webkitAppearance = 'none';

        // 移除数字输入框的上下箭头
        const style = document.createElement('style');
        style.textContent = `
          input[type=number]::-webkit-inner-spin-button,
          input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
        `;
        inputEl.appendChild(style);

        inputEl.onkeydown = (e) => {
          if (e.key === 'Enter') {
            const page = parseInt(inputEl.value, 10);
            if (page >= 1 && page <= self._totalPage) {
              self.setState('current', page);
              self._triggerChange(page);
            }
          }
        };

        inputEl.onblur = () => {
          const page = parseInt(inputEl.value, 10);
          if (page >= 1 && page <= self._totalPage) {
            self.setState('current', page);
            self._triggerChange(page);
          } else {
            inputEl.value = String(self._current);
          }
        };

        i._el.appendChild(inputEl);
        self._jumperInput = inputEl;
      });

      const unit = span((s) => {
        s.addClass('yoya-pager__jumper-unit');
        s.text('页');
      });

      w.child(label).child(input).child(unit);
    });

    return wrapper;
  }

  /**
   * 判断导航按钮是否应该禁用
   * @private
   */
  _isNavDisabled(isPrev) {
    if (this.hasState('disabled')) return true;
    if (isPrev) return this._current <= 1;
    return this._current >= this._totalPage;
  }

  /**
   * 渲染页码数字
   * @private
   */
  _renderPageNumbers() {
    if (!this._pageContainer) return;

    // 清空现有内容
    this._pageContainer._children = [];
    if (this._pageContainer._el) {
      this._pageContainer._el.innerHTML = '';
    }

    if (this._simple) {
      // 简洁模式：只显示当前页/总页数
      const simpleText = span((s) => {
        s.addClass('yoya-pager__simple');
        s.text(`${this._current} / ${this._totalPage || 1}`);
      });
      this._pageContainer.child(simpleText);
    } else {
      // 完整模式
      const pages = this._calculateVisiblePages();

      pages.forEach((page) => {
        if (page === 'more') {
          this._pageContainer.child(this._createMoreButton());
        } else {
          this._pageContainer.child(this._createPageButton(page));
        }
      });
    }

    // 更新导航按钮状态
    this._updateNavButtons();
  }

  /**
   * 计算可见的页码
   * @private
   */
  _calculateVisiblePages() {
    const pages = [];
    const totalPage = this._totalPage || 1;
    const current = this._current;

    if (totalPage <= 7) {
      // 总页数较少，显示所有
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
    } else {
      // 总页数较多，智能显示
      if (current <= 4) {
        // 当前页靠近开始
        pages.push(1, 2, 3, 4, 5, 'more', totalPage);
      } else if (current >= totalPage - 3) {
        // 当前页靠近结束
        pages.push(1, 'more', totalPage - 4, totalPage - 3, totalPage - 2, totalPage - 1, totalPage);
      } else {
        // 当前页在中间
        pages.push(1, 'more', current - 1, current, current + 1, 'more', totalPage);
      }
    }

    return pages;
  }

  /**
   * 更新导航按钮状态
   * @private
   */
  _updateNavButtons() {
    const prevDisabled = this._isNavDisabled(true);
    const nextDisabled = this._isNavDisabled(false);

    if (this._prevBtn) {
      if (prevDisabled) {
        this._prevBtn.addClass('yoya-pager__nav--disabled');
      } else {
        this._prevBtn.removeClass('yoya-pager__nav--disabled');
      }
    }
    if (this._nextBtn) {
      if (nextDisabled) {
        this._nextBtn.addClass('yoya-pager__nav--disabled');
      } else {
        this._nextBtn.removeClass('yoya-pager__nav--disabled');
      }
    }
  }

  /**
   * 触发变化事件
   * @private
   */
  _triggerChange(page) {
    if (this._onChange) {
      this._onChange(page, {
        current: page,
        pageSize: this._pageSize,
        total: this._total,
        totalPage: this._totalPage,
      });
    }

    // 更新跳转输入框的值
    if (this._jumperInput) {
      this._jumperInput.value = String(page);
    }
  }

  /**
   * 构建组件内容
   * @private
   */
  _buildContent() {
    // 显示总记录数
    if (this._showTotal) {
      this.child(this._createTotalText());
    }

    // 上一页按钮
    this._prevBtn = this._createNavButton('prev');
    this.child(this._prevBtn);

    // 页码数字容器
    this._pageContainer = div((c) => {
      c.addClass('yoya-pager__pages');
    });
    this.child(this._pageContainer);

    // 下一页按钮
    this._nextBtn = this._createNavButton('next');
    this.child(this._nextBtn);

    // 快速跳转
    if (this._showQuickJumper) {
      this.child(this._createJumperInput());
    }

    // 初始渲染页码
    this._renderPageNumbers();
  }

  /**
   * 设置总记录数
   * @param {number} total - 总记录数
   * @returns {VPager} this
   */
  total(total) {
    this.setState('total', total);
    return this;
  }

  /**
   * 设置每页显示数量
   * @param {number} size - 每页显示数量
   * @returns {VPager} this
   */
  pageSize(size) {
    this.setState('pageSize', size);
    return this;
  }

  /**
   * 设置当前页码
   * @param {number} page - 当前页码
   * @returns {VPager} this
   */
  current(page) {
    this.setState('current', page);
    return this;
  }

  /**
   * 设置是否显示快速跳转
   * @param {boolean} show - 是否显示
   * @returns {VPager} this
   */
  showQuickJumper(show) {
    this._showQuickJumper = show;
    this.setState('showQuickJumper', show);
    return this;
  }

  /**
   * 设置是否显示总记录数
   * @param {boolean} show - 是否显示
   * @returns {VPager} this
   */
  showTotal(show) {
    this._showTotal = show;
    this.setState('showTotal', show);
    return this;
  }

  /**
   * 设置是否为简洁模式
   * @param {boolean} simple - 是否简洁模式
   * @returns {VPager} this
   */
  simple(simple) {
    this._simple = simple;
    this.setState('simple', simple);
    return this;
  }

  /**
   * 设置禁用状态
   * @param {boolean} disabled - 是否禁用
   * @returns {VPager} this
   */
  disabled(disabled) {
    this.setState('disabled', disabled);
    return this;
  }

  /**
   * 设置变化事件回调
   * @param {Function} fn - 回调函数
   * @returns {VPager} this
   */
  onChange(fn) {
    this._onChange = fn;
    return this;
  }

  /**
   * 获取当前页码
   * @returns {number}
   */
  getCurrent() {
    return this._current;
  }

  /**
   * 获取每页显示数量
   * @returns {number}
   */
  getPageSize() {
    return this._pageSize;
  }

  /**
   * 获取总记录数
   * @returns {number}
   */
  getTotal() {
    return this._total;
  }

  /**
   * 获取总页数
   * @returns {number}
   */
  getTotalPage() {
    return this._totalPage;
  }
}

/**
 * 创建 VPager 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VPager}
 */
function vPager(setup = null) {
  return new VPager(setup);
}

// ============================================
// Tag 原型扩展
// ============================================

Tag.prototype.vPager = function (setup = null) {
  const pager = vPager(setup);
  this.child(pager);
  return this;
};

// ============================================
// 导出
// ============================================

export { VPager, vPager };
