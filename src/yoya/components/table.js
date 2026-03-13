/**
 * Yoya.Components - Table
 * 表格组件，使用原生 table 元素，自带主题样式
 */

import { Tag } from '../core/basic.js';

// ============================================
// VTable 表格
// ============================================

class VTable extends Tag {
  static _stateAttrs = ['bordered', 'striped', 'hoverable', 'compact'];

  constructor(setup = null) {
    super('table', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      bordered: false,
      striped: false,
      hoverable: false,  // 默认 false，当调用 hoverable() 时才启用
      compact: false,
    });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.styles({
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 'var(--yoya-table-font-size, 14px)',
      color: 'var(--yoya-table-text, var(--yoya-text))',
      background: 'var(--yoya-table-bg, var(--yoya-bg))',
    });
  }

  _registerStateHandlers() {
    // bordered 状态
    this.registerStateHandler('bordered', (enabled, host) => {
      if (enabled) {
        host.styles({
          border: '1px solid var(--yoya-table-border, var(--yoya-border))',
        });
      } else {
        host.style('border', '');
      }
    });

    // striped 状态 - 影响所有子元素 tr
    this.registerStateHandler('striped', (enabled, host) => {
      // 设置 CSS 变量
      const el = host._boundElement || host._el;
      if (el) {
        if (enabled) {
          el.style.setProperty('--yoya-table-striped-bg', 'var(--yoya-bg-secondary)');
        } else {
          el.style.removeProperty('--yoya-table-striped-bg');
        }
      }
      // 通知所有 VTr 子元素更新样式
      host._updateChildrenStyles();
    });

    // hoverable 状态 - 影响所有子元素 tr
    this.registerStateHandler('hoverable', (enabled, host) => {
      // 设置 CSS 变量
      const el = host._boundElement || host._el;
      if (el) {
        if (enabled) {
          el.style.setProperty('--yoya-table-hover-bg', 'var(--yoya-hover-bg)');
        } else {
          el.style.removeProperty('--yoya-table-hover-bg');
        }
      }
      // 通知所有 VTr 子元素更新样式
      host._updateChildrenStyles();
    });

    // compact 状态
    this.registerStateHandler('compact', (enabled, host) => {
      const el = host._boundElement || host._el;
      if (el) {
        if (enabled) {
          el.style.setProperty('--yoya-table-cell-padding', '8px 12px');
        } else {
          el.style.removeProperty('--yoya-table-cell-padding');
        }
      }
    });
  }

  // 通知所有 VTr 子元素更新样式
  _updateChildrenStyles() {
    const striped = this.getState('striped');
    const hoverable = this.getState('hoverable');

    // 只统计 tbody 中的 tr 用于斑马纹
    this._children.forEach(child => {
      if (child instanceof VTbody) {
        // 只统计 tbody 中的 tr
        let trIndex = 0;
        child._children.forEach(innerChild => {
          if (innerChild instanceof VTr) {
            innerChild._syncTableStates(striped, hoverable, trIndex % 2 === 0);
            trIndex++;
          }
        });
      } else if (child instanceof VThead || child instanceof VTfoot) {
        // thead 和 tfoot 中的 tr 不应用斑马纹
        child._children.forEach(innerChild => {
          if (innerChild instanceof VTr) {
            innerChild._syncTableStates(false, hoverable, false);
          }
        });
      } else if (child instanceof VTr) {
        // 直接在 table 下的 tr（不常见）
        child._syncTableStates(striped, hoverable, false);
      }
    });
  }

  // 链式方法
  bordered(value = true) {
    this.setState('bordered', value);
    return this;
  }

  striped(value = true) {
    this.setState('striped', value);
    return this;
  }

  hoverable(value = true) {
    this.setState('hoverable', value);
    return this;
  }

  compact(value = true) {
    this.setState('compact', value);
    return this;
  }

  // 重写 child 方法，添加子元素时同步状态
  child(...children) {
    super.child(...children);
    // 添加子元素后，同步状态
    this._updateChildrenStyles();
    return this;
  }
}

function vTable(setup = null) {
  return new VTable(setup);
}

// ============================================
// VThead 表格头部
// ============================================

class VThead extends Tag {
  constructor(setup = null) {
    super('thead', null);

    this.styles({
      background: 'var(--yoya-table-head-bg, var(--yoya-bg-secondary))',
      borderBottom: '2px solid var(--yoya-table-border, var(--yoya-border))',
    });

    if (setup !== null) {
      this.setup(setup);
    }
  }

  // 重写 child 方法，添加子元素时通知 VTable 更新
  child(...children) {
    super.child(...children);
    this._notifyTableUpdate();
    return this;
  }

  // 通知 VTable 更新
  _notifyTableUpdate() {
    // 查找父元素 VTable
    const parent = this._findParentTable();
    if (parent && parent._updateChildrenStyles) {
      parent._updateChildrenStyles();
    }
  }

  // 查找父元素 VTable
  _findParentTable() {
    // 通过 boundElement 的 parentNode 查找
    if (this._boundElement && this._boundElement.parentNode) {
      let node = this._boundElement.parentNode;
      while (node) {
        if (node._vnode instanceof VTable) {
          return node._vnode;
        }
        node = node.parentNode;
      }
    }
    return null;
  }
}

function vThead(setup = null) {
  return new VThead(setup);
}

// ============================================
// VTbody 表格主体
// ============================================

class VTbody extends Tag {
  constructor(setup = null) {
    super('tbody', null);

    this.styles({
      background: 'var(--yoya-table-body-bg, var(--yoya-bg))',
    });

    if (setup !== null) {
      this.setup(setup);
    }
  }

  // 重写 child 方法，添加子元素时通知 VTable 更新
  child(...children) {
    super.child(...children);
    this._notifyTableUpdate();
    return this;
  }

  // 通知 VTable 更新
  _notifyTableUpdate() {
    // 查找父元素 VTable
    const parent = this._findParentTable();
    if (parent && parent._updateChildrenStyles) {
      parent._updateChildrenStyles();
    }
  }

  // 查找父元素 VTable
  _findParentTable() {
    // 通过 boundElement 的 parentNode 查找
    if (this._boundElement && this._boundElement.parentNode) {
      let node = this._boundElement.parentNode;
      while (node) {
        if (node._vnode instanceof VTable) {
          return node._vnode;
        }
        node = node.parentNode;
      }
    }
    return null;
  }
}

function vTbody(setup = null) {
  return new VTbody(setup);
}

// ============================================
// VTfoot 表格底部
// ============================================

class VTfoot extends Tag {
  constructor(setup = null) {
    super('tfoot', null);

    this.styles({
      background: 'var(--yoya-table-foot-bg, var(--yoya-bg-secondary))',
      borderTop: '2px solid var(--yoya-table-border, var(--yoya-border))',
    });

    if (setup !== null) {
      this.setup(setup);
    }
  }

  // 重写 child 方法，添加子元素时通知 VTable 更新
  child(...children) {
    super.child(...children);
    this._notifyTableUpdate();
    return this;
  }

  // 通知 VTable 更新
  _notifyTableUpdate() {
    // 查找父元素 VTable
    const parent = this._findParentTable();
    if (parent && parent._updateChildrenStyles) {
      parent._updateChildrenStyles();
    }
  }

  // 查找父元素 VTable
  _findParentTable() {
    // 通过 boundElement 的 parentNode 查找
    if (this._boundElement && this._boundElement.parentNode) {
      let node = this._boundElement.parentNode;
      while (node) {
        if (node._vnode instanceof VTable) {
          return node._vnode;
        }
        node = node.parentNode;
      }
    }
    return null;
  }
}

function vTfoot(setup = null) {
  return new VTfoot(setup);
}

// ============================================
// VTr 表格行
// ============================================

class VTr extends Tag {
  static _stateAttrs = ['striped', 'hoverable', 'isEvenRow'];

  constructor(setup = null) {
    super('tr', null);

    // 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 初始化状态
    this.initializeStates({
      striped: false,
      hoverable: false,
      isEvenRow: false,
    });

    // 设置基础样式
    this._setupBaseStyles();

    // 注册状态处理器
    this._registerStateHandlers();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.styles({
      transition: 'background-color 0.2s',
    });
  }

  _registerStateHandlers() {
    // striped + isEvenRow 状态 - 偶数行应用背景色
    this.registerStateHandler('isEvenRow', (isEven, host) => {
      // 只有当 striped 状态启用且是偶数行时才应用背景色
      if (isEven && host.hasState('striped')) {
        host.style('background', 'var(--yoya-table-striped-bg, var(--yoya-bg-secondary))');
        host._hasStripedBg = true;
      } else {
        host.style('background', '');
        host._hasStripedBg = false;
      }
    });

    // striped 状态 - 重新应用偶数行样式
    this.registerStateHandler('striped', (enabled, host) => {
      if (enabled && host.hasState('isEvenRow')) {
        host.style('background', 'var(--yoya-table-striped-bg, var(--yoya-bg-secondary))');
        host._hasStripedBg = true;
      } else {
        if (!host.hasState('hoverable')) {
          host.style('background', '');
        }
        host._hasStripedBg = false;
      }
    });

    // hoverable 状态 - 绑定悬停事件
    this.registerStateHandler('hoverable', (enabled, host) => {
      const el = host._boundElement || host._el;

      // 先清除旧的事件监听器
      if (host._hoverBound) {
        if (el) {
          el.removeEventListener('mouseenter', host._mouseenterHandler);
          el.removeEventListener('mouseleave', host._mouseleaveHandler);
        }
        host._hoverBound = false;
      }

      if (enabled) {
        // 创建事件处理器
        host._mouseenterHandler = () => {
          // 直接设置 DOM 元素的 style.setProperty 来覆盖简写属性
          if (host._el) {
            host._el.style.setProperty('background', 'var(--yoya-table-hover-bg, var(--yoya-hover-bg))');
          }
        };
        host._mouseleaveHandler = () => {
          // 若有条纹且是偶数行，恢复条纹色；否则恢复透明
          if (host._hasStripedBg) {
            if (host._el) {
              host._el.style.setProperty('background', 'var(--yoya-table-striped-bg, var(--yoya-bg-secondary))');
            }
          } else {
            if (host._el) {
              host._el.style.removeProperty('background');
            }
          }
        };

        // 直接绑定到真实 DOM 元素
        if (el) {
          el.addEventListener('mouseenter', host._mouseenterHandler);
          el.addEventListener('mouseleave', host._mouseleaveHandler);
        }
        host._hoverBound = true;
      }
    });
  }

  // 同步 VTable 的状态
  _syncTableStates(tableStriped, tableHoverable, isEvenRow) {
    this.setState('striped', tableStriped);
    this.setState('hoverable', tableHoverable);
    this.setState('isEvenRow', isEvenRow);
  }
}

function vTr(setup = null) {
  return new VTr(setup);
}

// ============================================
// VTh 表格头单元格
// ============================================

class VTh extends Tag {
  constructor(setup = null) {
    super('th', null);

    this.styles({
      padding: 'var(--yoya-table-head-padding, 12px 16px)',
      textAlign: 'left',
      fontWeight: '600',
      color: 'var(--yoya-table-head-color, var(--yoya-text))',
      borderBottom: '2px solid var(--yoya-table-border, var(--yoya-border))',
      whiteSpace: 'nowrap',
    });

    if (setup !== null) {
      this.setup(setup);
    }
  }
}

function vTh(setup = null) {
  return new VTh(setup);
}

// ============================================
// VTd 表格单元格
// ============================================

class VTd extends Tag {
  constructor(setup = null) {
    super('td', null);

    this.styles({
      padding: 'var(--yoya-table-cell-padding, 12px 16px)',
      borderBottom: '1px solid var(--yoya-table-row-border, var(--yoya-border))',
      color: 'var(--yoya-table-cell-color, var(--yoya-text))',
      verticalAlign: 'middle',
    });

    if (setup !== null) {
      this.setup(setup);
    }
  }
}

function vTd(setup = null) {
  return new VTd(setup);
}

// ============================================
// 导出
// ============================================

export {
  VTable, vTable,
  VThead, vThead,
  VTbody, vTbody,
  VTfoot, vTfoot,
  VTr, vTr,
  VTh, vTh,
  VTd, vTd,
};

// ============================================
// Tag 原型扩展
// ============================================

Tag.prototype.vTable = function(setup = null) {
  const table = vTable(setup);
  this.child(table);
  return this;
};

Tag.prototype.vThead = function(setup = null) {
  const thead = vThead(setup);
  this.child(thead);
  return this;
};

Tag.prototype.vTbody = function(setup = null) {
  const tbody = vTbody(setup);
  this.child(tbody);
  return this;
};

Tag.prototype.vTfoot = function(setup = null) {
  const tfoot = vTfoot(setup);
  this.child(tfoot);
  return this;
};

Tag.prototype.vTr = function(setup = null) {
  const tr = vTr(setup);
  this.child(tr);
  return this;
};

Tag.prototype.vTh = function(setup = null) {
  const th = vTh(setup);
  this.child(th);
  return this;
};

Tag.prototype.vTd = function(setup = null) {
  const td = vTd(setup);
  this.child(td);
  return this;
};
