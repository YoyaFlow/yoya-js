/**
 * Yoya.Basic - Card Component
 * 卡片组件
 */

import { Tag, div } from '../core/basic.js';

// ============================================
// Card 卡片布局
// ============================================

class Card extends Tag {
  constructor(setup = null) {
    super('div', setup);
    this.style('background', 'white');
    this.style('borderRadius', '8px');
    this.style('boxShadow', '0 2px 8px rgba(0,0,0,0.1)');
    this.style('overflow', 'hidden');
  }

  // 悬浮效果
  hoverable() {
    return this.style('transition', 'box-shadow 0.3s')
      .style('cursor', 'pointer');
  }

  // 无边框
  noBorder() {
    return this.style('border', 'none');
  }

  // 无边框阴影
  noShadow() {
    return this.style('boxShadow', 'none');
  }

  // 边框
  bordered() {
    return this.style('border', '1px solid #e0e0e0')
      .style('boxShadow', 'none');
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
    this.style('padding', '16px');
    this.style('borderBottom', '1px solid #e0e0e0');
    this.style('fontWeight', '600');
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
    this.style('padding', '16px');
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
    this.style('padding', '16px');
    this.style('borderTop', '1px solid #e0e0e0');
    this.style('display', 'flex');
    this.style('gap', '8px');
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
