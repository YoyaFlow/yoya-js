/**
 * Yoya.Basic - Card Component
 * 卡片组件：提供卡片布局容器，支持头部、内容、底部结构
 * @module Yoya.Card
 * @example
 * // 基础卡片
 * import { vCard, vCardHeader, vCardBody, vCardFooter } from '../yoya/index.js';
 *
 * vCard(c => {
 *   c.vCardHeader('卡片标题');
 *   c.vCardBody('卡片内容');
 *   c.vCardFooter(b => {
 *     b.button('操作');
 *   });
 * });
 *
 * // 悬浮卡片
 * vCard(c => {
 *   c.hoverable();
 *   c.vCardBody('悬浮效果卡片');
 * });
 */

import { Tag, div } from '../core/basic.js';

// ============================================
// VCard 卡片布局
// ============================================

/**
 * VCard 卡片容器
 * 支持 hoverable、bordered、noShadow 等状态
 * @class
 * @extends Tag
 */
class VCard extends Tag {
  static _stateAttrs = ['hoverable', 'bordered', 'noShadow'];

  /**
   * 创建 VCard 卡片实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      hoverable: false,
      bordered: false,
      noShadow: false,
    });

    // 3. 设置基础样式（使用主题变量）
    this.styles({
      background: 'var(--yoya-card-bg, var(--yoya-bg))',
      borderRadius: 'var(--yoya-card-radius, 8px)',
      boxShadow: 'var(--yoya-card-shadow, var(--yoya-shadow))',
      overflow: 'hidden',
      border: 'var(--yoya-card-border, 1px solid transparent)',
    });

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 设置卡片内容（支持函数/字符串/对象配置）
   * @param {Function|string|Object} setup - 初始化配置
   * @returns {this}
   */
  setup(setup) {
    if (typeof setup === 'function') {
      setup(this);
    } else if (typeof setup === 'string') {
      // 字符串作为卡片内容
      this.vCardBody(setup);
    } else if (typeof setup === 'object' && setup !== null) {
      // 对象配置：支持 header, body, footer 等属性
      if (setup.header !== undefined) {
        if (typeof setup.header === 'function') {
          this.vCardHeader(setup.header);
        } else if (typeof setup.header === 'string') {
          this.vCardHeader(setup.header);
        } else {
          this.vCardHeader(c => c.child(setup.header));
        }
      }
      if (setup.body !== undefined) {
        if (typeof setup.body === 'function') {
          this.vCardBody(setup.body);
        } else if (typeof setup.body === 'string') {
          this.vCardBody(setup.body);
        } else {
          this.vCardBody(c => c.child(setup.body));
        }
      }
      if (setup.footer !== undefined) {
        if (typeof setup.footer === 'function') {
          this.vCardFooter(setup.footer);
        } else if (typeof setup.footer === 'string') {
          this.vCardFooter(setup.footer);
        } else {
          this.vCardFooter(c => c.child(setup.footer));
        }
      }
      // 处理其他配置（class, style 等）
      if (setup.class) this.className(setup.class);
      if (setup.style) this.styles(setup.style);
      if (setup.onclick) this.on('click', setup.onclick);
    }
    return this;
  }

  /**
   * 注册状态处理器
   * @private
   */
  _registerStateHandlers() {
    // hoverable 状态
    this.registerStateHandler('hoverable', (enabled, host) => {
      if (enabled) {
        host.styles({
          transition: 'box-shadow 0.3s, transform 0.2s',
          cursor: 'pointer',
        });
        host.on('mouseenter', () => {
          host.styles({
            boxShadow: 'var(--yoya-card-hover-shadow, var(--yoya-shadow-hover))',
            transform: 'translateY(-2px)',
          });
        });
        host.on('mouseleave', () => {
          host.styles({
            boxShadow: 'var(--yoya-card-shadow, var(--yoya-shadow))',
            transform: 'translateY(0)',
          });
        });
      }
    });

    // bordered 状态
    this.registerStateHandler('bordered', (enabled, host) => {
      if (enabled) {
        host.styles({
          border: 'var(--yoya-card-border-color, 1px solid var(--yoya-border))',
          boxShadow: 'none',
        });
      } else {
        host.styles({
          border: 'var(--yoya-card-border, 1px solid transparent)',
          boxShadow: 'var(--yoya-card-shadow, var(--yoya-shadow))',
        });
      }
    });

    // noShadow 状态
    this.registerStateHandler('noShadow', (enabled, host) => {
      host.style('boxShadow', enabled ? 'none' : 'var(--yoya-card-shadow, var(--yoya-shadow))');
    });
  }

  /**
   * 启用悬浮效果（鼠标悬停时上移 + 阴影）
   * @returns {this}
   */
  hoverable() {
    return this.setState('hoverable', true);
  }

  /**
   * 移除边框
   * @returns {this}
   */
  noBorder() {
    return this.style('border', 'none');
  }

  /**
   * 移除阴影
   * @returns {this}
   */
  noShadow() {
    return this.setState('noShadow', true);
  }

  /**
   * 启用边框样式
   * @returns {this}
   */
  bordered() {
    return this.setState('bordered', true);
  }

  /**
   * 添加卡片头部
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this}
   */
  /**
   * 添加卡片头部
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this}
   */
  vCardHeader(setup = null) {
    const el = vCardHeader(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加卡片内容
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this}
   */
  vCardBody(setup = null) {
    const el = vCardBody(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加卡片底部
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this}
   */
  vCardFooter(setup = null) {
    const el = vCardFooter(setup);
    this.child(el);
    return this;
  }

  // 兼容旧方法名
  cardHeader(setup = null) { return this.vCardHeader(setup); }
  cardBody(setup = null) { return this.vCardBody(setup); }
  cardFooter(setup = null) { return this.vCardFooter(setup); }
}

/**
 * 创建 VCard 卡片
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VCard}
 */
function vCard(setup = null) {
  return new VCard(setup);
}

// ============================================
// VCardHeader 卡片头部
// ============================================

/**
 * VCardHeader 卡片头部容器
 * @class
 * @extends Tag
 */
class VCardHeader extends Tag {
  /**
   * 创建 VCardHeader 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.styles({
      padding: 'var(--yoya-card-header-padding, 16px)',
      borderBottom: 'var(--yoya-card-header-border, 1px solid var(--yoya-border-light))',
      fontWeight: 'var(--yoya-card-header-font-weight, 600)',
      fontSize: 'var(--yoya-card-header-font-size, 16px)',
      color: 'var(--yoya-card-header-color, var(--yoya-text))',
      background: 'var(--yoya-card-header-bg, var(--yoya-bg-secondary))',
    });
  }
}

/**
 * 创建 VCardHeader 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VCardHeader}
 */
function vCardHeader(setup = null) {
  return new VCardHeader(setup);
}

// ============================================
// VCardBody 卡片内容
// ============================================

/**
 * VCardBody 卡片内容容器
 * @class
 * @extends Tag
 */
class VCardBody extends Tag {
  /**
   * 创建 VCardBody 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.styles({
      padding: 'var(--yoya-card-body-padding, 16px)',
      fontSize: 'var(--yoya-card-body-font-size, 14px)',
      color: 'var(--yoya-card-body-color, var(--yoya-text))',
      background: 'var(--yoya-card-body-bg, transparent)',
    });
  }
}

/**
 * 创建 VCardBody 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VCardBody}
 */
function vCardBody(setup = null) {
  return new VCardBody(setup);
}

// ============================================
// VCardFooter 卡片底部
// ============================================

/**
 * VCardFooter 卡片底部容器
 * @class
 * @extends Tag
 */
class VCardFooter extends Tag {
  /**
   * 创建 VCardFooter 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.styles({
      padding: 'var(--yoya-card-footer-padding, 16px)',
      borderTop: 'var(--yoya-card-footer-border, 1px solid var(--yoya-border-light))',
      display: 'flex',
      gap: 'var(--yoya-card-footer-gap, 8px)',
      fontSize: 'var(--yoya-card-footer-font-size, 14px)',
      color: 'var(--yoya-card-footer-color, var(--yoya-text-secondary))',
      background: 'var(--yoya-card-footer-bg, transparent)',
    });
  }
}

/**
 * 创建 VCardFooter 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VCardFooter}
 */
function vCardFooter(setup = null) {
  return new VCardFooter(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

/**
 * Tag 原型扩展 - 添加 vCard 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vCard = function(setup = null) {
  const el = vCard(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vCardHeader 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vCardHeader = function(setup = null) {
  const el = vCardHeader(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vCardBody 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vCardBody = function(setup = null) {
  const el = vCardBody(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vCardFooter 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vCardFooter = function(setup = null) {
  const el = vCardFooter(setup);
  this.child(el);
  return this;
};

// 兼容旧方法名
Tag.prototype.card = Tag.prototype.vCard;
Tag.prototype.cardHeader = Tag.prototype.vCardHeader;
Tag.prototype.cardBody = Tag.prototype.vCardBody;
Tag.prototype.cardFooter = Tag.prototype.vCardFooter;

// ============================================
// 导出
// ============================================

export {
  VCard,
  VCardHeader,
  VCardBody,
  VCardFooter,
  vCard,
  vCardHeader,
  vCardBody,
  vCardFooter
};
