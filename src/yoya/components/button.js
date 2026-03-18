/**
 * Yoya.Components - Button
 * 带主题样式的按钮组件
 */

import { Tag, span, div } from '../core/basic.js';

// ============================================
// VButton 按钮组件
// ============================================

class VButton extends Tag {
  // 状态属性
  static _stateAttrs = ['disabled', 'loading', 'block', 'ghost', 'hovered'];

  constructor(content = '', setup = null) {
    // 如果 content 是函数，则它是 setup
    if (typeof content === 'function') {
      setup = content;
      content = '';
    }
    // 如果 content 是对象且 setup 未定义，说明是 vButton({ onClick: ... }) 单参数用法
    else if (typeof content === 'object' && content !== null && setup === undefined) {
      setup = content;
      content = '';
    }
    // 正确用法：vButton("文本", { setupObject }) - content 是字符串，setup 是对象，无需处理

    super('button', null);
    // this._el 已在 super() 中创建

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      loading: false,
      block: false,
      ghost: false,
      hovered: false,
      type: 'default'
    });

    // 3. 设置基础 CSS 类
    this.addClass('yoya-button');

    // 4. 应用默认类型 CSS 类
    this._applyTypeClass();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 7. 更新内容（setup 可能已经设置了内容，所以只在没有内容时才使用 content 参数）
    if (content && !this._content) {
      this._content = content;
      this._updateContent();
    }
  }

  // 应用类型 CSS 类
  _applyTypeClass() {
    const type = this._type || 'default';

    // 移除旧类型类
    this.removeClass('yoya-button--primary')
        .removeClass('yoya-button--success')
        .removeClass('yoya-button--warning')
        .removeClass('yoya-button--danger')
        .removeClass('yoya-button--info')
        .removeClass('yoya-button--default');

    // 添加新类型类
    this.addClass(`yoya-button--${type}`);

    // 处理 ghost 状态
    if (this.hasState('ghost')) {
      this.addClass('yoya-button--ghost');
    } else {
      this.removeClass('yoya-button--ghost');
    }
  }

  // 注册状态处理器
  _registerStateHandlers() {
    // disabled 状态
    this.registerStateHandler('disabled', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-button--disabled');
        host.attr('disabled', 'true');
      } else {
        host.removeClass('yoya-button--disabled');
        host.attr('disabled', 'false');
      }
    });

    // loading 状态
    this.registerStateHandler('loading', (loading, host) => {
      if (loading) {
        host.addClass('yoya-button--loading');
      } else {
        host.removeClass('yoya-button--loading');
      }
      host._updateContent();
    });

    // block 状态（占满容器）
    this.registerStateHandler('block', (isBlock, host) => {
      if (isBlock) {
        host.addClass('yoya-button--block');
      } else {
        host.removeClass('yoya-button--block');
      }
    });

    // ghost 状态
    this.registerStateHandler('ghost', (isGhost, host) => {
      if (isGhost) {
        host.addClass('yoya-button--ghost');
      } else {
        host.removeClass('yoya-button--ghost');
      }
      host._applyTypeClass();
    });

    // hovered 状态 - CSS :hover 已处理，无需额外逻辑
  }

  // 更新内容（支持 loading 状态）- 复用元素，不重新创建
  _updateContent() {
    // 复用或创建 loading 图标
    if (this.hasState('loading')) {
      if (!this._loadingSpinner) {
        this._loadingSpinner = span(s => {
          s.styles({
            display: 'inline-block',
            width: '1em',
            height: '1em',
            border: '2px solid currentColor',
            borderBottomColor: 'transparent',
            borderRadius: '50%',
            animation: 'buttonLoadingSpin 0.8s linear infinite',
          });
        });
        // 在内容元素之前插入
        const contentIndex = this._children.indexOf(this._contentEl);
        if (contentIndex >= 0) {
          this._children.splice(contentIndex, 0, this._loadingSpinner);
        } else {
          this.child(this._loadingSpinner);
        }
      }
      this._loadingSpinner.style('display', 'inline-block');
    } else {
      if (this._loadingSpinner) {
        this._loadingSpinner.style('display', 'none');
      }
    }

    // 复用或创建内容元素
    if (!this._contentEl) {
      this._contentEl = span(c => {
        c.styles({ display: 'inline-block' });
      });
      this.child(this._contentEl);
    }

    if (this._content) {
      this._contentEl.html(this._content);
    }
  }

  _ensureContentEl() {
    if (!this._contentEl) {
      this._contentEl = span(c => {
        c.styles({ display: "inline-block" });
      });
      this.child(this._contentEl);
    }
  }

  // ============================================
  // 链式方法
  // ============================================

  text(content) {
    this._content = content;
    this._ensureContentEl();
    if (this._contentEl) {
      this._contentEl.html(this._content);
    }
    return this;
  }

  type(value) {
    if (value === undefined) return this._type;
    this._type = value;
    this._applyTypeClass();
    return this;
  }

  size(value) {
    if (value === undefined) return this._size;

    // 移除旧尺寸类
    this.removeClass('yoya-button--small')
        .removeClass('yoya-button--medium')
        .removeClass('yoya-button--large');

    this._size = value;

    // 添加新尺寸类
    if (value === 'small' || value === 'medium' || value === 'large') {
      this.addClass(`yoya-button--${value}`);
    } else {
      this.addClass('yoya-button--medium'); // 默认尺寸
    }

    return this;
  }

  disabled(value = true) {
    return this.setState('disabled', value);
  }

  loading(value = true) {
    return this.setState('loading', value);
  }

  block(value = true) {
    return this.setState('block', value);
  }

  ghost(value = true) {
    return this.setState('ghost', value);
  }

  // 事件方法 - 基于 Tag._wrapHandler 包装器
  // onClick 直接使用 Tag 基类的 onClick() 方法
}

function vButton(content = '', setup = null) {
  return new VButton(content, setup);
}

// ============================================
// VButtons - 按钮组组件（紧凑模式）
// ============================================

class VButtons extends Tag {
  // 状态属性
  static _stateAttrs = ['vertical', 'compact', 'size'];

  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      vertical: false,
      compact: false,
      size: null
    });

    // 3. 设置基础 CSS 类
    this.addClass('yoya-buttons');

    // 4. 注册状态处理器
    this._registerStateHandlers();

    // 5. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  // 注册状态处理器
  _registerStateHandlers() {
    // vertical 状态 - 控制布局方向
    this.registerStateHandler('vertical', (isVertical, host) => {
      if (isVertical) {
        host.addClass('yoya-buttons--vertical');
        host.removeClass('yoya-buttons--horizontal');
      } else {
        host.addClass('yoya-buttons--horizontal');
        host.removeClass('yoya-buttons--vertical');
      }
    });

    // compact 状态 - 控制是否紧凑模式
    this.registerStateHandler('compact', (isCompact, host) => {
      if (isCompact) {
        host.addClass('yoya-buttons--compact');
      } else {
        host.removeClass('yoya-buttons--compact');
      }
    });

    // size 状态 - 控制按钮尺寸（传递给子按钮）
    this.registerStateHandler('size', (size, host) => {
      // VButtons 本身不直接应用尺寸类，而是在添加按钮时传递给子按钮
      if (host._itemsInitialized) {
        host._applySizeToChildren(size);
      }
    });
  }

  // 应用尺寸到所有子按钮
  _applySizeToChildren(size) {
    this._children.forEach(child => {
      if (child instanceof VButton) {
        child.size(size);
      }
    });
  }

  // ============================================
  // 链式方法
  // ============================================

  // 添加单个按钮
  button(content = '', setup = null) {
    const btn = vButton(content, setup);
    this.child(btn);
    return this;
  }

  // 批量添加按钮（旧 API，保留兼容）
  buttons(buttonConfigs) {
    if (Array.isArray(buttonConfigs)) {
      buttonConfigs.forEach(config => {
        if (typeof config === 'string') {
          this.button(config);
        } else if (typeof config === 'object' && config !== null) {
          this.button(config.content || '', config);
        }
      });
    }
    return this;
  }

  // 配置化添加按钮组（推荐）
  // 支持 vButtons({ items: [...], onClick: (item) => {...} })
  items(items, baseConfig = {}) {
    if (!Array.isArray(items)) {
      return this;
    }

    const {
      onClick,
      type = 'default',
      size,
      disabled = false,
      ghost = false,
      ...restBaseConfig
    } = baseConfig;

    this._itemsInitialized = true;

    items.forEach((item, index) => {
      // 支持字符串简写
      if (typeof item === 'string') {
        item = { name: item, label: item };
      }

      const {
        name,
        label,
        content = label || name || `Button ${index}`,
        type: itemType,
        size: itemSize,
        disabled: itemDisabled,
        ghost: itemGhost,
        onClick: itemOnClick,
        ...itemRest
      } = item;

      // 创建按钮
      this.button(content, btn => {
        // 应用基础配置
        if (type && !itemType) btn.type(type);
        if (itemType) btn.type(itemType);
        if (size && !itemSize) btn.size(size);
        if (itemSize) btn.size(itemSize);
        if (disabled && !itemDisabled) btn.disabled(disabled);
        if (itemDisabled) btn.disabled(itemDisabled);
        if (ghost && !itemGhost) btn.ghost(ghost);
        if (itemGhost) btn.ghost(itemGhost);

        // 应用其他配置
        Object.keys(itemRest).forEach(key => {
          if (typeof btn[key] === 'function') {
            btn[key](itemRest[key]);
          }
        });

        // 统一 onClick 处理：先调用 item.onClick，再调用统一的 onClick
        btn.on('click', (e) => {
          if (itemOnClick) itemOnClick(e, item, index);
          if (onClick) onClick(e, { ...item, index }, index);
        });
      });
    });

    return this;
  }

  // 设置布局方向
  vertical(value = true) {
    if (value === undefined) return this.hasState('vertical');
    return this.setState('vertical', value);
  }

  // 快捷方法：横向布局
  horizontal() {
    return this.setState('vertical', false);
  }

  // 设置紧凑模式
  compact(value = true) {
    if (value === undefined) return this.hasState('compact');
    return this.setState('compact', value);
  }

  // 设置间距
  gap(value) {
    if (value === undefined) return this.style('gap');
    this.style('gap', value);
    return this;
  }

  // 设置按钮尺寸
  size(value) {
    if (value === undefined) return this._size;
    this.setState('size', value);
    return this;
  }
}

function vButtons(setup = null) {
  // 支持 vButtons({ items: [...], onClick: ... }) 对象配置方式
  if (setup !== null && typeof setup === 'object' && !Array.isArray(setup)) {
    const { items, onClick, vertical, horizontal, compact, gap, size, ...restSetup } = setup;

    return new VButtons(box => {
      // 设置布局
      if (vertical) box.vertical(true);
      if (horizontal) box.horizontal();
      if (compact) box.compact(true);
      if (gap) box.gap(gap);
      if (size) box.size(size);

      // 应用其他配置
      Object.keys(restSetup).forEach(key => {
        if (typeof box[key] === 'function') {
          box[key](restSetup[key]);
        }
      });

      // 添加按钮项
      if (items && Array.isArray(items)) {
        box.items(items, { onClick, size });
      }
    });
  }

  return new VButtons(setup);
}

// Tag 原型扩展
Tag.prototype.vButtons = function(setup = null) {
  const buttons = vButtons(setup);
  this.child(buttons);
  return this;
};

// ============================================
// Tag 原型扩展
// ============================================

Tag.prototype.vButton = function(content = '', setup = null) {
  const btn = vButton(content, setup);
  this.child(btn);
  return this;
};

// ============================================
// 导出
// ============================================

export {
  VButton,
  vButton,
  VButtons,
  vButtons,
};