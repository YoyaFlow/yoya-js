/**
 * Yoya.Basic - Menu Components
 * 菜单组件库
 */

import { Tag, span, div } from '../core/basic.js';

// ============================================
// Menu 菜单
// ============================================

class Menu extends Tag {
  constructor(setup = null) {
    super('div', null);  // 先不执行 setup
    this.style('display', 'inline-block');
    this.style('background', 'var(--islands-bg, white)');
    this.style('borderRadius', 'var(--islands-radius-md, 8px)');
    this.style('boxShadow', 'var(--islands-shadow, 0 4px 12px rgba(0,0,0,0.15))');
    this.style('padding', 'var(--islands-padding-sm, 8px) 0');
    this.style('minWidth', '160px');
    this.style('border', '1px solid var(--islands-border, #e0e0e0)');

    // 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  // 垂直菜单（默认）
  vertical() {
    return this.style('flexDirection', 'column');
  }

  // 水平菜单
  horizontal() {
    this.style('display', 'flex');
    this.style('flexDirection', 'row');
    this.style('flexWrap', 'nowrap');
    this.style('gap', '4px');
    this.style('padding', '8px');
    return this;
  }

  // 紧凑模式
  compact() {
    return this.style('padding', '4px 0');
  }

  // 无边框阴影
  noShadow() {
    return this.style('boxShadow', 'none');
  }

  // 带边框
  bordered() {
    return this.style('border', '1px solid #e0e0e0');
  }

  // 子元素工厂方法
  item(content = '', setup = null) {
    const el = menuItem(content, setup);
    this.child(el);
    return el;  // 返回 MenuItem 实例，支持链式调用
  }

  divider(setup = null) {
    const el = menuDivider(setup);
    this.child(el);
    return this;
  }

  group(setup = null) {
    const el = menuGroup(setup);
    this.child(el);
    return this;
  }
}

function menu(setup = null) {
  return new Menu(setup);
}

// ============================================
// MenuItem 菜单项
// ============================================

class MenuItem extends Tag {
  // 状态属性列表
  static _stateAttrs = ['disabled', 'active', 'danger', 'hoverable'];

  constructor(content = '', setup = null) {
    // 如果 content 是函数，则它是 setup
    if (typeof content === 'function') {
      setup = content;
      content = '';
    }

    // 初始化状态机
    super('div', null);
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 注册状态处理器
    this._registerStateHandlers();

    // 设置基础样式
    this.style('padding', 'var(--islands-padding-sm, 10px) var(--islands-padding-md, 16px)');
    this.style('cursor', 'pointer');
    this.style('alignItems', 'center');
    this.style('gap', 'var(--islands-gap-sm, 10px)');
    this.style('transition', 'background-color 0.2s');
    this.style('borderRadius', 'var(--islands-radius-sm, 4px)');
    this.style('color', 'var(--islands-text, #333)');
    this.style('font-size', 'var(--islands-font-size-sm, 13px)');
    this.style('background', 'transparent');

    // 保存样式快照（用于恢复）
    this.saveStateSnapshot('base');

    // 注册 hover 拦截器
    this._registerHoverInterceptor();

    // 设置交互处理器
    this._setupInteractions();

    // 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 初始化状态
    this.initializeStates({
      disabled: false,
      active: false,
      danger: false,
      hoverable: false
    });

    if (content) {
      this.text(content);
    }
  }

  /**
   * 注册状态处理器
   * @private
   */
  _registerStateHandlers() {
    // disabled 状态处理器
    this.registerStateHandler('disabled', (enabled, host) => {
      const el = host._boundElement;
      if (enabled) {
        host.styles({
          opacity: '0.5',
          cursor: 'not-allowed',
          pointerEvents: 'none'
        });
        if (el) {
          el.style.opacity = '0.5';
          el.style.cursor = 'not-allowed';
          el.style.pointerEvents = 'none';
        }
      } else {
        host.style('opacity', '');
        host.style('cursor', 'pointer');
        host.style('pointerEvents', '');
        if (el) {
          el.style.opacity = '';
          el.style.cursor = 'pointer';
          el.style.pointerEvents = '';
        }
      }
    });

    // active 状态处理器
    this.registerStateHandler('active', (enabled, host) => {
      const el = host._boundElement;
      if (enabled) {
        host.styles({
          background: 'var(--islands-primary-alpha, rgba(102, 126, 234, 0.1))',
          fontWeight: '500'
        });
        if (el) {
          el.style.background = 'var(--islands-primary-alpha, rgba(102, 126, 234, 0.1))';
          el.style.fontWeight = '500';
        }
      } else {
        host.style('background', '');
        host.style('fontWeight', '');
        if (el) {
          el.style.background = '';
          el.style.fontWeight = '';
        }
      }
    });

    // danger 状态处理器
    this.registerStateHandler('danger', (enabled, host) => {
      const el = host._boundElement;
      if (enabled) {
        host.style('color', 'var(--islands-error, #dc3545)');
        if (el) {
          el.style.color = 'var(--islands-error, #dc3545)';
        }
      } else {
        host.style('color', '');
        if (el) {
          el.style.color = '';
        }
      }
    });

    // hoverable 状态处理器（仅标记，实际效果由拦截器处理）
    this.registerStateHandler('hoverable', () => {
      // hoverable 状态的视觉效果由拦截器动态处理
    });
  }

  /**
   * 注册 hover 拦截器
   * @private
   */
  _registerHoverInterceptor() {
    this.registerStateInterceptor((stateName, value) => {
      // 如果处于禁用状态，拦截所有状态变更
      if (this.hasState('disabled') && stateName !== 'disabled') {
        return null;  // 取消操作
      }
      return { stateName, value };
    });
  }

  /**
   * 设置交互处理器
   * @private
   */
  _setupInteractions() {
    const self = this;  // 保存 MenuItem 引用

    // hover 效果
    this.on('mouseenter', () => {
      if (!self.hasState('disabled')) {
        self.style('background', 'var(--islands-hover-bg, rgba(102, 126, 234, 0.05))');
        if (self._boundElement) {
          self._boundElement.style.background = 'var(--islands-hover-bg, rgba(102, 126, 234, 0.05))';
        }
      }
    }).on('mouseleave', () => {
      if (!self.hasState('disabled') && !self.hasState('active')) {
        self.style('background', 'transparent');
        if (self._boundElement) {
          self._boundElement.style.background = '';
        }
      }
    });

    // 点击选中效果
    this.on('click', () => {
      if (!self.hasState('disabled')) {
        // 清除所有菜单项的激活状态（包括当前项）
        const parent = self._boundElement?.parentNode;
        if (parent) {
          Array.from(parent.children).forEach(child => {
            if (child._menuItem) {
              child._menuItem.setState('active', false);
            }
          });
        }
        // 设置当前菜单项为激活状态
        self.setState('active', true);

        // 触发用户自定义点击事件
        if (self._onclick) {
          self._onclick(self);
        }
      }
    });
  }

  // 设置文本内容
  text(content) {
    this._text = content;
    this._updateContent();
    return this;
  }

  // 图标
  icon(content) {
    this._icon = content;
    this._ensureIconBox();
    if (this._iconBox) {
      this._iconBox.html(this._icon);
    }
    return this;
  }

  // 设置点击回调
  onclick(fn) {
    this._onclick = fn;
    return this;
  }

  // 禁用状态
  disabled() {
    return this.setState('disabled', true);
  }

  // 启用状态（禁用状态的逆向操作）
  enabled() {
    return this.setState('disabled', false);
  }

  // 激活状态
  active() {
    return this.setState('active', true);
  }

  // 取消激活
  inactive() {
    return this.setState('active', false);
  }

  // 危险项（删除等）
  danger() {
    return this.setState('danger', true);
  }

  // 悬停效果
  hoverable() {
    return this.setState('hoverable', true);
  }

  // 快捷键
  shortcut(key) {
    this._shortcut = key;
    this._updateContent();
    return this;
  }

  /**
   * 切换状态
   * @param {string} stateName - 状态名
   * @returns {this}
   */
  toggleState(stateName) {
    return this.setState(stateName, !this.hasState(stateName));
  }

  // 确保图标容器存在
  _ensureIconBox() {
    if (this._iconBox) return;

    this._iconBox = span(iconEl => {
      iconEl.styles({ display: 'inline-flex', alignItems: 'center', color: 'inherit', pointerEvents: 'none' });
    });
    this.child(this._iconBox);
  }

  // 确保文本容器存在
  _ensureTextBox() {
    if (this._textBox) return;

    this._textBox = span(textEl => {
      textEl.styles({ flex: 1, color: 'inherit', pointerEvents: 'none' });
    });
    this.child(this._textBox);
  }

  // 确保快捷键容器存在
  _ensureShortcutBox() {
    if (this._shortcutBox) return;

    this._shortcutBox = span(shortcutEl => {
      shortcutEl.styles({
        fontSize: '12px',
        color: '#999',
        background: '#f5f5f5',
        padding: '2px 6px',
        borderRadius: '4px',
        pointerEvents: 'none'
      });
    });
    this.child(this._shortcutBox);
  }

  _updateContent() {
    // 清空子元素和缓存引用
    this.clear();
    this._iconBox = null;
    this._textBox = null;
    this._shortcutBox = null;

    // 图标
    if (this._icon) {
      this._ensureIconBox();
      this._iconBox.html(this._icon);
    }

    // 文本
    if (this._text) {
      this._ensureTextBox();
      this._textBox.text(this._text);
    }

    // 快捷键
    if (this._shortcut) {
      this._ensureShortcutBox();
      this._shortcutBox.text(this._shortcut);
    }
  }

  /**
   * 重写 renderDom 方法，在渲染后设置引用
   */
  renderDom() {
    const element = super.renderDom();
    if (element) {
      element._menuItem = this;  // 绑定 MenuItem 引用到 DOM 元素
    }
    return element;
  }
}

function menuItem(content = '', setup = null) {
  return new MenuItem(content, setup);
}

// ============================================
// MenuDivider 菜单分割线
// ============================================

class MenuDivider extends Tag {
  constructor(setup = null) {
    super('hr', setup);
    this.style('border', 'none');
    this.style('height', '1px');
    this.style('background', 'var(--islands-border, #e0e0e0)');
    this.style('margin', 'var(--islands-margin-md, 8px) 0');
  }
}

function menuDivider(setup = null) {
  return new MenuDivider(setup);
}

// ============================================
// MenuGroup 菜单组
// ============================================

class MenuGroup extends Tag {
  constructor(setup = null) {
    super('div', setup);
  }

  // 组标题
  label(text) {
    this._label = text;
    this._updateContent();
    return this;
  }

  // 子元素工厂方法
  item(content = '', setup = null) {
    const el = menuItem(content, setup);
    this.child(el);
    return el;  // 返回 MenuItem 实例，支持链式调用
  }

  divider(setup = null) {
    const el = menuDivider(setup);
    this.child(el);
    return this;
  }

  _updateContent() {
    // 移除旧的标签元素（如果有）
    const labelEl = this._children.find(c => c._isLabel);
    if (labelEl) {
      this._children = this._children.filter(c => c !== labelEl);
    }

    // 如果有标签，在开头添加标签元素
    if (this._label) {
      const newLabelEl = span(label => {
        label.text(this._label);
        label.styles({
          display: 'block',
          padding: '8px 16px 4px',
          fontSize: '12px',
          color: '#999',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        });
        label._isLabel = true;
      });

      // 在第一个位置插入标签元素
      const nonLabelChildren = this._children.filter(c => !c._isLabel);
      this._children = [newLabelEl, ...nonLabelChildren];
    }
  }
}

function menuGroup(setup = null) {
  return new MenuGroup(setup);
}

// ============================================
// DropdownMenu 下拉菜单
// ============================================

class DropdownMenu extends Tag {
  constructor(setup = null) {
    super('div', null);  // 先不执行 setup
    this.style('position', 'relative');
    this.style('display', 'inline-block');
    this._triggerContent = null;
    this._menu = null;
    this._triggerWrap = null;
    this._menuContainer = null;
    this._arrow = null;
    this._built = false;

    // 执行 setup（允许用户设置 _triggerContent 和 _menu）
    if (setup !== null) {
      this.setup(setup);
    }

    // setup 完成后构建结构
    this._buildStructure();
  }

  // 触发器内容
  trigger(content) {
    this._triggerContent = content;
    return this;
  }

  // 菜单内容
  menuContent(menu) {
    this._menu = menu;
    return this;
  }

  // 点击外部关闭
  closeOnClickOutside() {
    this._closeOnClickOutside = true;
    return this;
  }

  _toggle() {
    if (!this._menuContainer || !this._arrow) return;

    // 获取真实 DOM 元素
    const menuEl = this._menuContainer._boundElement;
    const arrowEl = this._arrow._boundElement;

    if (!menuEl || !arrowEl) return;

    const isOpen = menuEl.style.display === 'block';
    menuEl.style.display = isOpen ? 'none' : 'block';
    arrowEl.style.transform = isOpen ? '' : 'rotate(180deg)';
  }

  _buildStructure() {
    if (this._built) return;

    // 清空子元素
    this.clear();

    // 触发器容器
    this._triggerWrap = div(wrap => {
      wrap.styles({
        cursor: 'pointer',
        padding: '8px 16px',
        background: '#667eea',
        color: 'white',
        borderRadius: '6px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        userSelect: 'none'
      });

      // 触发器内容
      if (typeof this._triggerContent === 'string') {
        wrap.span(this._triggerContent);
      } else if (this._triggerContent && this._triggerContent.renderDom) {
        wrap.child(this._triggerContent);
      }

      // 下拉箭头
      wrap.span(arrow => {
        arrow.text('▼');
        arrow.styles({
          fontSize: '10px',
          transition: 'transform 0.2s'
        });
        this._arrow = arrow;
      });

      // 点击切换事件
      wrap.on('click', (e) => {
        e.stopPropagation();
        this._toggle();
      });
    });

    this.child(this._triggerWrap);

    // 菜单容器
    if (this._menu) {
      this._menuContainer = div(menuWrap => {
        menuWrap.styles({
          position: 'absolute',
          top: '100%',
          left: '0',
          minWidth: '160px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          padding: '8px 0',
          zIndex: '1000',
          display: 'none'
        });

        // 添加菜单子元素
        if (this._menu._children) {
          this._menu._children.forEach(child => {
            if (child) {
              menuWrap.child(child);
            }
          });
        }
      });

      this.child(this._menuContainer);
    }

    // 点击外部关闭
    if (this._closeOnClickOutside) {
      const closeHandler = (e) => {
        const element = this._boundElement;
        if (element && !element.contains(e.target)) {
          const menuEl = this._menuContainer?._boundElement;
          const arrowEl = this._arrow?._boundElement;
          if (menuEl) menuEl.style.display = 'none';
          if (arrowEl) arrowEl.style.transform = '';
        }
      };
      document.addEventListener('click', closeHandler);
    }

    this._built = true;
  }
}

function dropdownMenu(setup = null) {
  return new DropdownMenu(setup);
}

// ============================================
// ContextMenu 右键菜单
// ============================================

class ContextMenu extends Tag {
  constructor(setup = null) {
    super('div', null);  // 先不执行 setup
    this.style('position', 'fixed');
    this.style('zIndex', '9999');
    this.style('display', 'none');
    this.style('background', 'white');
    this.style('borderRadius', '8px');
    this.style('boxShadow', '0 4px 12px rgba(0,0,0,0.15)');
    this.style('padding', '8px 0');
    this.style('minWidth', '160px');
    this._target = null;
    this._menu = null;
    this._built = false;

    // 执行 setup（允许用户设置 _menu）
    if (setup !== null) {
      this.setup(setup);
    }

    // setup 完成后构建内容
    this._buildContent();
  }

  // 绑定目标元素
  target(element) {
    this._target = element;
    this._bindTarget();
    return this;
  }

  // 菜单内容
  menuContent(menu) {
    this._menu = menu;
    return this;
  }

  _bindTarget() {
    if (!this._target) return;

    this._target.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.show(e.clientX, e.clientY);
    });

    // 点击外部关闭
    document.addEventListener('click', () => {
      this.hide();
    });

    // 滚动时关闭
    window.addEventListener('scroll', () => {
      this.hide();
    });
  }

  show(x, y) {
    if (this._boundElement) {
      this._boundElement.style.display = 'block';
      this._boundElement.style.left = `${x}px`;
      this._boundElement.style.top = `${y}px`;

      // 确保菜单不超出视口
      const rect = this._boundElement.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        this._boundElement.style.left = `${x - rect.width}px`;
      }
      if (rect.bottom > window.innerHeight) {
        this._boundElement.style.top = `${y - rect.height}px`;
      }
    }
    return this;
  }

  hide() {
    if (this._boundElement) {
      this._boundElement.style.display = 'none';
    }
    return this;
  }

  _buildContent() {
    if (this._built) return;

    // 清空子元素
    this.clear();

    // 添加菜单子元素
    if (this._menu && this._menu._children) {
      this._menu._children.forEach(child => {
        if (child) {
          this.child(child);
        }
      });
    }

    this._built = true;
  }
}

function contextMenu(setup = null) {
  return new ContextMenu(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

Tag.prototype.menu = function(setup = null) {
  const el = menu(setup);
  this.child(el);
  return this;
};

Tag.prototype.menuItem = function(content = '', setup = null) {
  const el = menuItem(content, setup);
  this.child(el);
  return this;
};

Tag.prototype.menuDivider = function(setup = null) {
  const el = menuDivider(setup);
  this.child(el);
  return this;
};

Tag.prototype.dropdownMenu = function(setup = null) {
  const el = dropdownMenu(setup);
  this.child(el);
  return this;
};

// ============================================
// 导出
// ============================================

export {
  // 类
  Menu,
  MenuItem,
  MenuDivider,
  MenuGroup,
  DropdownMenu,
  ContextMenu,

  // 工厂函数
  menu,
  menuItem,
  menuDivider,
  menuGroup,
  dropdownMenu,
  contextMenu
};
