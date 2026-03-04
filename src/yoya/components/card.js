/**
 * Yoya.Basic - Card Component
 * 卡片组件
 */

import { Tag, div } from '../core/basic.js';

// ============================================
// Card 卡片布局
// ============================================

class Card extends Tag {
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
      background: 'var(--islands-card-bg, white)',
      borderRadius: 'var(--islands-card-radius, 8px)',
      boxShadow: 'var(--islands-card-shadow, 0 2px 8px rgba(0,0,0,0.1))',
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
            boxShadow: 'var(--islands-card-hover-shadow, 0 4px 16px rgba(0,0,0,0.15))',
            transform: 'translateY(-2px)',
          });
        });
        host.on('mouseleave', () => {
          host.styles({
            boxShadow: 'var(--islands-card-shadow, 0 2px 8px rgba(0,0,0,0.1))',
            transform: 'translateY(0)',
          });
        });
      }
    });

    // bordered 状态
    this.registerStateHandler('bordered', (enabled, host) => {
      if (enabled) {
        host.styles({
          border: 'var(--islands-card-border-color, 1px solid #e0e0e0)',
          boxShadow: 'none',
        });
      } else {
        host.styles({
          border: 'var(--islands-card-border, 1px solid transparent)',
          boxShadow: 'var(--islands-card-shadow, 0 2px 8px rgba(0,0,0,0.1))',
        });
      }
    });

    // noShadow 状态
    this.registerStateHandler('noShadow', (enabled, host) => {
      host.style('boxShadow', enabled ? 'none' : 'var(--islands-card-shadow, 0 2px 8px rgba(0,0,0,0.1))');
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
  cardHeader(setup = null) {
    const el = cardHeader(setup);
    this.child(el);
    return this;
  }

  cardBody(setup = null) {
    const el = cardBody(setup);
    this.child(el);
    return this;
  }

  cardFooter(setup = null) {
    const el = cardFooter(setup);
    this.child(el);
    return this;
  }
}

function card(setup = null) {
  return new Card(setup);
}

// ============================================
// CardHeader 卡片头部
// ============================================

class CardHeader extends Tag {
  constructor(setup = null) {
    super('div', setup);
    this.styles({
      padding: 'var(--islands-card-header-padding, 16px)',
      borderBottom: 'var(--islands-card-header-border, 1px solid #e0e0e0)',
      fontWeight: 'var(--islands-card-header-font-weight, 600)',
      fontSize: 'var(--islands-card-header-font-size, 16px)',
      color: 'var(--islands-card-header-color, var(--islands-text, #333))',
      background: 'var(--islands-card-header-bg, transparent)',
    });
  }
}

function cardHeader(setup = null) {
  return new CardHeader(setup);
}

// ============================================
// CardBody 卡片内容
// ============================================

class CardBody extends Tag {
  constructor(setup = null) {
    super('div', setup);
    this.styles({
      padding: 'var(--islands-card-body-padding, 16px)',
      fontSize: 'var(--islands-card-body-font-size, 14px)',
      color: 'var(--islands-card-body-color, var(--islands-text, #333))',
      background: 'var(--islands-card-body-bg, transparent)',
    });
  }
}

function cardBody(setup = null) {
  return new CardBody(setup);
}

// ============================================
// CardFooter 卡片底部
// ============================================

class CardFooter extends Tag {
  constructor(setup = null) {
    super('div', setup);
    this.styles({
      padding: 'var(--islands-card-footer-padding, 16px)',
      borderTop: 'var(--islands-card-footer-border, 1px solid #e0e0e0)',
      display: 'flex',
      gap: 'var(--islands-card-footer-gap, 8px)',
      fontSize: 'var(--islands-card-footer-font-size, 14px)',
      color: 'var(--islands-card-footer-color, var(--islands-text-secondary, #666))',
      background: 'var(--islands-card-footer-bg, transparent)',
    });
  }
}

function cardFooter(setup = null) {
  return new CardFooter(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

Tag.prototype.card = function(setup = null) {
  const el = card(setup);
  this.child(el);
  return this;
};

Tag.prototype.cardHeader = function(setup = null) {
  const el = cardHeader(setup);
  this.child(el);
  return this;
};

Tag.prototype.cardBody = function(setup = null) {
  const el = cardBody(setup);
  this.child(el);
  return this;
};

Tag.prototype.cardFooter = function(setup = null) {
  const el = cardFooter(setup);
  this.child(el);
  return this;
};

// ============================================
// 导出
// ============================================

export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  card,
  cardHeader,
  cardBody,
  cardFooter
};
