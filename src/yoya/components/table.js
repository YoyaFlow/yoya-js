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
      hoverable: true,
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
      fontSize: 'var(--islands-table-font-size, 14px)',
      color: 'var(--islands-table-text, var(--islands-text, #333))',
      background: 'var(--islands-table-bg, white)',
    });
  }

  _registerStateHandlers() {
    // bordered 状态
    this.registerStateHandler('bordered', (enabled, host) => {
      if (enabled) {
        host.styles({
          border: '1px solid var(--islands-table-border, #e0e0e0)',
        });
      } else {
        host.style('border', '');
      }
    });

    // striped 状态
    this.registerStateHandler('striped', (enabled, host) => {
      if (enabled) {
        host.styles({
          '--islands-table-striped-bg': 'var(--islands-bg-secondary, #f7f8fa)',
        });
      } else {
        host.style('--islands-table-striped-bg', '');
      }
    });

    // hoverable 状态
    this.registerStateHandler('hoverable', (enabled, host) => {
      if (enabled) {
        host.styles({
          '--islands-table-hover-bg': 'var(--islands-hover-bg, rgba(102, 126, 234, 0.05))',
        });
      } else {
        host.style('--islands-table-hover-bg', '');
      }
    });

    // compact 状态
    this.registerStateHandler('compact', (enabled, host) => {
      if (enabled) {
        host.styles({
          '--islands-table-cell-padding': '8px 12px',
        });
      } else {
        host.style('--islands-table-cell-padding', '');
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
      background: 'var(--islands-table-head-bg, #f7f8fa)',
      borderBottom: '2px solid var(--islands-table-border, #e0e0e0)',
    });

    if (setup !== null) {
      this.setup(setup);
    }
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
      background: 'var(--islands-table-body-bg, white)',
    });

    if (setup !== null) {
      this.setup(setup);
    }
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
      background: 'var(--islands-table-foot-bg, #f7f8fa)',
      borderTop: '2px solid var(--islands-table-border, #e0e0e0)',
    });

    if (setup !== null) {
      this.setup(setup);
    }
  }
}

function vTfoot(setup = null) {
  return new VTfoot(setup);
}

// ============================================
// VTr 表格行
// ============================================

class VTr extends Tag {
  constructor(setup = null) {
    super('tr', null);

    this.styles({
      transition: 'background-color 0.2s',
    });

    if (setup !== null) {
      this.setup(setup);
    }
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
      padding: 'var(--islands-table-head-padding, 12px 16px)',
      textAlign: 'left',
      fontWeight: '600',
      color: 'var(--islands-table-head-color, #333)',
      borderBottom: '2px solid var(--islands-table-border, #e0e0e0)',
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
      padding: 'var(--islands-table-cell-padding, 12px 16px)',
      borderBottom: '1px solid var(--islands-table-row-border, #e0e0e0)',
      color: 'var(--islands-table-cell-color, #333)',
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
