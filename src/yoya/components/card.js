/**
 * Yoya.Basic - Card Component
 * 卡片组件
 */

import { Tag, div } from '../core/basic.js';

// ============================================
// VCard 卡片布局
// ============================================

class VCard extends Tag {
  static _stateAttrs = ['hoverable', 'bordered', 'noShadow'];

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
      background: 'var(--islands-card-bg, var(--islands-bg))',
      borderRadius: 'var(--islands-card-radius, 8px)',
      boxShadow: 'var(--islands-card-shadow, var(--islands-shadow))',
      overflow: 'hidden',
      border: 'var(--islands-card-border, 1px solid transparent)',
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

  // 重写 setup 方法，支持对象配置
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

  // 注册状态处理器
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
            boxShadow: 'var(--islands-card-hover-shadow, var(--islands-shadow-hover))',
            transform: 'translateY(-2px)',
          });
        });
        host.on('mouseleave', () => {
          host.styles({
            boxShadow: 'var(--islands-card-shadow, var(--islands-shadow))',
            transform: 'translateY(0)',
          });
        });
      }
    });

    // bordered 状态
    this.registerStateHandler('bordered', (enabled, host) => {
      if (enabled) {
        host.styles({
          border: 'var(--islands-card-border-color, 1px solid var(--islands-border))',
          boxShadow: 'none',
        });
      } else {
        host.styles({
          border: 'var(--islands-card-border, 1px solid transparent)',
          boxShadow: 'var(--islands-card-shadow, var(--islands-shadow))',
        });
      }
    });

    // noShadow 状态
    this.registerStateHandler('noShadow', (enabled, host) => {
      host.style('boxShadow', enabled ? 'none' : 'var(--islands-card-shadow, var(--islands-shadow))');
    });
  }

  // 悬浮效果
  hoverable() {
    return this.setState('hoverable', true);
  }

  // 无边框
  noBorder() {
    return this.style('border', 'none');
  }

  // 无边框阴影
  noShadow() {
    return this.setState('noShadow', true);
  }

  // 边框
  bordered() {
    return this.setState('bordered', true);
  }

  // 子元素工厂方法
  vCardHeader(setup = null) {
    const el = vCardHeader(setup);
    this.child(el);
    return this;
  }

  vCardBody(setup = null) {
    const el = vCardBody(setup);
    this.child(el);
    return this;
  }

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

function vCard(setup = null) {
  return new VCard(setup);
}

// ============================================
// VCardHeader 卡片头部
// ============================================

class VCardHeader extends Tag {
  constructor(setup = null) {
    super('div', setup);
    this.styles({
      padding: 'var(--islands-card-header-padding, 16px)',
      borderBottom: 'var(--islands-card-header-border, 1px solid var(--islands-border-light))',
      fontWeight: 'var(--islands-card-header-font-weight, 600)',
      fontSize: 'var(--islands-card-header-font-size, 16px)',
      color: 'var(--islands-card-header-color, var(--islands-text))',
      background: 'var(--islands-card-header-bg, var(--islands-bg-secondary))',
    });
  }
}

function vCardHeader(setup = null) {
  return new VCardHeader(setup);
}

// ============================================
// VCardBody 卡片内容
// ============================================

class VCardBody extends Tag {
  constructor(setup = null) {
    super('div', setup);
    this.styles({
      padding: 'var(--islands-card-body-padding, 16px)',
      fontSize: 'var(--islands-card-body-font-size, 14px)',
      color: 'var(--islands-card-body-color, var(--islands-text))',
      background: 'var(--islands-card-body-bg, transparent)',
    });
  }
}

function vCardBody(setup = null) {
  return new VCardBody(setup);
}

// ============================================
// VCardFooter 卡片底部
// ============================================

class VCardFooter extends Tag {
  constructor(setup = null) {
    super('div', setup);
    this.styles({
      padding: 'var(--islands-card-footer-padding, 16px)',
      borderTop: 'var(--islands-card-footer-border, 1px solid var(--islands-border-light))',
      display: 'flex',
      gap: 'var(--islands-card-footer-gap, 8px)',
      fontSize: 'var(--islands-card-footer-font-size, 14px)',
      color: 'var(--islands-card-footer-color, var(--islands-text-secondary))',
      background: 'var(--islands-card-footer-bg, transparent)',
    });
  }
}

function vCardFooter(setup = null) {
  return new VCardFooter(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

Tag.prototype.vCard = function(setup = null) {
  const el = vCard(setup);
  this.child(el);
  return this;
};

Tag.prototype.vCardHeader = function(setup = null) {
  const el = vCardHeader(setup);
  this.child(el);
  return this;
};

Tag.prototype.vCardBody = function(setup = null) {
  const el = vCardBody(setup);
  this.child(el);
  return this;
};

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
