/**
 * Yoya.Basic - Menu Components
 * 菜单组件库：提供菜单、下拉菜单、右键菜单、侧边栏等组件
 * @module Yoya.Menu
 * @example
 * // 基础菜单
 * import { vMenu, vMenuItem, vMenuDivider } from '../yoya/index.js';
 *
 * vMenu(m => {
 *   m.item(it => {
 *     it.text('📋 菜单项 1')
 *       .onclick(() => console.log('点击 1'));
 *   });
 *   m.item(it => {
 *     it.text('📁 菜单项 2')
 *       .onclick(() => console.log('点击 2'));
 *   });
 *   m.divider();
 *   m.item(it => {
 *     it.text('⚙️ 设置')
 *       .onclick(() => console.log('设置'));
 *   });
 * });
 *
 * // 带图标的菜单项
 * vMenuItem(item => {
 *   item.icon('<span>🏠</span>')
 *       .text('首页')
 *       .shortcut('Ctrl+H')
 *       .active();
 * });
 */

import { Tag, span, div, button } from '../core/basic.js';
import { vButton } from './button.js';

// ============================================
// VMenu 菜单
// ============================================

/**
 * VMenu 菜单容器
 * 支持垂直/水平布局，可包含菜单项、分割线、子菜单等
 * @class
 * @extends Tag
 */
class VMenu extends Tag {
  /**
   * 创建 VMenu 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);
    this.styles({
      display: 'inline-block',
      background: 'var(--yoya-menu-bg, var(--yoya-bg))',
      borderRadius: 'var(--yoya-menu-radius, var(--yoya-radius-md))',
      boxShadow: 'var(--yoya-menu-shadow, var(--yoya-shadow-dropdown))',
      padding: 'var(--yoya-menu-padding, 8px) 0',
      minWidth: 'var(--yoya-menu-min-width, 160px)',
      border: 'var(--yoya-menu-border, 1px solid var(--yoya-border))',
      pointerEvents: 'auto',
    });

    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 设置垂直布局
   * @returns {this}
   */
  vertical() {
    return this.style('flexDirection', 'column');
  }

  /**
   * 设置水平布局
   * @returns {this}
   */
  horizontal() {
    this.style('display', 'flex');
    this.style('flexDirection', 'row');
    this.style('flexWrap', 'nowrap');
    this.style('gap', '4px');
    this.style('padding', '8px');
    return this;
  }

  /**
   * 设置紧凑模式（减小内边距）
   * @returns {this}
   */
  compact() {
    return this.style('padding', '4px 0');
  }

  /**
   * 移除阴影
   * @returns {this}
   */
  noShadow() {
    return this.style('boxShadow', 'none');
  }

  /**
   * 添加边框
   * @returns {this}
   */
  bordered() {
    return this.style('border', '1px solid #e0e0e0');
  }

  /**
   * 添加菜单项
   * @param {string|Function} [content=''] - 内容或 setup 函数
   * @param {Function} [setup=null] - 初始化函数
   * @returns {VMenuItem}
   */
  item(content = '', setup = null) {
    const el = vMenuItem(content, setup);
    this.child(el);
    return el;
  }

  /**
   * 添加分割线
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this}
   */
  divider(setup = null) {
    const el = vMenuDivider(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加菜单组
   * @param {Function} [setup=null] - 初始化函数
   * @returns {VMenuGroup}
   */
  group(setup = null) {
    const el = vMenuGroup(setup);
    this.child(el);
    return this;
  }

  /**
   * 添加子菜单
   * @param {string} title - 子菜单标题
   * @param {Function} [setup=null] - 初始化函数
   * @returns {VSubMenu}
   */
  submenu(title, setup = null) {
    // 使用 vSubMenu 创建子菜单
    const subMenu = vSubMenu(title, setup);
    this.child(subMenu);
    return subMenu;
  }
}

/**
 * 创建 VMenu 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VMenu}
 */
function vMenu(setup = null) {
  return new VMenu(setup);
}

// ============================================
// VMenuItem 菜单项
// ============================================

/**
 * VMenuItem 菜单项
 * 支持 disabled、active、danger、hoverable、expanded 等状态
 * @class
 * @extends Tag
 */
class VMenuItem extends Tag {
  static _stateAttrs = ['disabled', 'active', 'danger', 'hoverable', 'expanded'];

  /**
   * 创建 VMenuItem 实例
   * @param {string|Function} [content=''] - 内容或 setup 函数
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(content = '', setup = null) {
    if (typeof content === 'function') {
      setup = content;
      content = '';
    }

    super('div', null);
    this.registerStateAttrs(...this.constructor._stateAttrs);
    this._registerStateHandlers();

    this.styles({
      padding: 'var(--yoya-menu-item-padding, 10px) var(--yoya-menu-item-horizontal-padding, 16px)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--yoya-menu-item-gap, 10px)',
      transition: 'background-color 0.2s',
      borderRadius: 'var(--yoya-menu-item-radius, 4px)',
      color: 'var(--yoya-menu-item-color, var(--yoya-text))',
      fontSize: 'var(--yoya-menu-item-font-size, 13px)',
      background: 'transparent',
    });

    this.saveStateSnapshot('base');
    this._registerHoverInterceptor();
    this._setupInteractions();

    if (setup !== null) {
      this.setup(setup);
    }

    this.initializeStates({
      disabled: false,
      active: false,
      danger: false,
      hoverable: false,
      expanded: false,
    });

    if (content) {
      this.text(content);
    }
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      const el = host._boundElement;
      if (enabled) {
        host.styles({
          opacity: 'var(--yoya-menu-item-disabled-opacity, 0.5)',
          cursor: 'var(--yoya-menu-item-disabled-cursor, not-allowed)',
          pointerEvents: 'none',
          color: 'var(--yoya-menu-item-disabled-color, var(--yoya-text-secondary))',
        });
        if (el) {
          el.style.opacity = 'var(--yoya-menu-item-disabled-opacity, 0.5)';
          el.style.cursor = 'var(--yoya-menu-item-disabled-cursor, not-allowed)';
          el.style.pointerEvents = 'none';
        }
      } else {
        host.style('opacity', '');
        host.style('cursor', 'pointer');
        host.style('pointerEvents', '');
        host.style('color', '');
        if (el) {
          el.style.opacity = '';
          el.style.cursor = 'pointer';
          el.style.pointerEvents = '';
          el.style.color = '';
        }
      }
    });

    this.registerStateHandler('active', (enabled, host) => {
      const el = host._boundElement;
      if (enabled) {
        host.styles({
          background: 'var(--yoya-menu-item-active-bg, var(--yoya-primary-alpha))',
          fontWeight: 'var(--yoya-menu-item-active-font-weight, 500)',
          color: 'var(--yoya-menu-item-active-color, var(--yoya-primary))',
        });
        if (el) {
          el.style.background = 'var(--yoya-menu-item-active-bg, var(--yoya-primary-alpha))';
          el.style.fontWeight = 'var(--yoya-menu-item-active-font-weight, 500)';
          el.style.color = 'var(--yoya-menu-item-active-color, var(--yoya-primary))';
        }
      } else {
        host.style('background', '');
        host.style('fontWeight', '');
        host.style('color', '');
        if (el) {
          el.style.background = '';
          el.style.fontWeight = '';
          el.style.color = '';
        }
      }
    });

    this.registerStateHandler('danger', (enabled, host) => {
      const el = host._boundElement;
      if (enabled) {
        host.style('color', 'var(--yoya-menu-item-danger-color, var(--yoya-error))');
        if (el) {
          el.style.color = 'var(--yoya-menu-item-danger-color, var(--yoya-error))';
        }
      } else {
        host.style('color', '');
        if (el) {
          el.style.color = '';
        }
      }
    });

    this.registerStateHandler('hoverable', () => {
      // hoverable 状态的视觉效果由拦截器动态处理
    });

    // expanded 状态 - 用于子菜单展开/折叠
    this.registerStateHandler('expanded', (expanded, host) => {
      // 获取子菜单容器引用（从 titleItem 上获取）
      const submenuContainer = host._submenuContainer;
      const arrowEl = host._arrowEl;

      if (submenuContainer && arrowEl && submenuContainer._boundElement && arrowEl._boundElement) {
        if (expanded) {
          submenuContainer._boundElement.style.display = 'flex';
          arrowEl._boundElement.style.transform = 'rotate(90deg)';
          // 展开时高亮父菜单项
          host.style('background', 'var(--yoya-menu-item-hover-bg, var(--yoya-hover-bg))');
        } else {
          submenuContainer._boundElement.style.display = 'none';
          arrowEl._boundElement.style.transform = 'rotate(0deg)';
          // 折叠时恢复背景（如果没有 active）
          if (!host.hasState('active')) {
            host.style('background', 'transparent');
          }
        }
      }
    });
  }

  /**
   * 注册悬浮拦截器
   * @private
   */
  _registerHoverInterceptor() {
    this.registerStateInterceptor((stateName, value) => {
      if (this.hasState('disabled') && stateName !== 'disabled') {
        return null;
      }
      return { stateName, value };
    });
  }

  /**
   * 设置交互事件（悬浮、点击）
   * @private
   */
  _setupInteractions() {
    const self = this;

    this.on('mouseenter', () => {
      if (!self.hasState('disabled')) {
        self.style('background', 'var(--yoya-menu-item-hover-bg, var(--yoya-hover-bg))');
        if (self._boundElement) {
          self._boundElement.style.background = 'var(--yoya-menu-item-hover-bg, var(--yoya-hover-bg))';
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

    this.on('click', (e) => {
      if (!self.hasState('disabled')) {
        // 有子菜单：只能展开/折叠，不能选中
        if (self._submenuContainer || self._arrowEl) {
          e.stopPropagation();
          const isExpanded = self.getState('expanded') || false;
          self.setState('expanded', !isExpanded);
          return;
        }

        // 没有子菜单（叶子节点）：可以选中
        const parent = self._boundElement?.parentNode;
        if (parent) {
          Array.from(parent.children).forEach(child => {
            if (child._vMenuItem) {
              child._vMenuItem.setState('active', false);
            }
          });
        }
        self.setState('active', true);
        if (self._onclick) {
          self._onclick({ event: e, text: self._text, icon: self._icon, target: self });
        }
      }
    });
  }

  /**
   * 添加子菜单
   * @param {string} title - 子菜单标题
   * @param {Function} [setup=null] - 初始化函数
   * @returns {VSubMenu}
   */
  submenu(title, setup = null) {
    // 使用 vSubMenu 创建子菜单
    const subMenu = vSubMenu(title, setup);
    this._submenu = subMenu;
    this._submenuContainer = subMenu._container;

    // 为此菜单项添加展开/折叠箭头
    this._ensureArrow();

    return subMenu;
  }

  /**
   * 确保箭头元素存在
   * @private
   */
  _ensureArrow() {
    if (this._arrowEl) return;
    this._arrowEl = span(arrow => {
      arrow.styles({
        marginLeft: 'auto',
        fontSize: '10px',
        transition: 'transform 0.2s',
        opacity: '0.5',
        display: 'inline-block',
        flexShrink: '0',
      });
      arrow.text('▶');
    });
  }

  /**
   * 确保箭头元素已添加到子元素
   * @private
   */
  _ensureArrowEl() {
    if (!this._arrowEl) return;
    if (!this._children.includes(this._arrowEl)) {
      this.child(this._arrowEl);
    }
  }

  /**
   * 设置菜单项文本
   * @param {string} content - 文本内容
   * @returns {this}
   */
  text(content) {
    this._text = content;
    this._updateContent();
    return this;
  }

  /**
   * 设置菜单项图标
   * @param {string} content - 图标 HTML 或文本
   * @returns {this}
   */
  icon(content) {
    this._icon = content;
    this._ensureIconBox();
    if (this._iconBox) {
      this._iconBox.html(this._icon);
    }
    return this;
  }

  /**
   * 设置点击事件处理
   * @param {Function} fn - 事件处理函数
   * @returns {this}
   */
  onclick(fn) {
    this._onclick = fn;
    return this;
  }

  /**
   * 设置点击事件处理（统一事件格式）
   * @param {Function} handler - 事件处理函数
   * @returns {this}
   */
  onClick(handler) {
    this._onclick = handler;
    return this;
  }

  /**
   * 禁用菜单项
   * @returns {this}
   */
  disabled() {
    return this.setState('disabled', true);
  }

  /**
   * 启用菜单项
   * @returns {this}
   */
  enabled() {
    return this.setState('disabled', false);
  }

  /**
   * 激活菜单项
   * @returns {this}
   */
  active() {
    return this.setState('active', true);
  }

  /**
   * 取消激活菜单项
   * @returns {this}
   */
  inactive() {
    return this.setState('active', false);
  }

  /**
   * 设置为危险样式（红色）
   * @returns {this}
   */
  danger() {
    return this.setState('danger', true);
  }

  /**
   * 启用悬浮效果
   * @returns {this}
   */
  hoverable() {
    return this.setState('hoverable', true);
  }

  /**
   * 设置快捷键提示
   * @param {string} key - 快捷键文本
   * @returns {this}
   */
  shortcut(key) {
    this._shortcut = key;
    this._updateContent();
    return this;
  }

  /**
   * 切换状态
   * @param {string} stateName - 状态名称
   * @returns {this}
   */
  toggleState(stateName) {
    return this.setState(stateName, !this.hasState(stateName));
  }

  /**
   * 确保图标容器存在
   * @private
   */
  _ensureIconBox() {
    if (this._iconBox) return;
    this._iconBox = span(iconEl => {
      iconEl.styles({ display: 'inline-flex', alignItems: 'center', color: 'inherit', pointerEvents: 'none' });
    });
    this.child(this._iconBox);
  }

  /**
   * 确保文本容器存在
   * @private
   */
  _ensureTextBox() {
    if (this._textBox) return;
    this._textBox = span(textEl => {
      textEl.styles({
        flex: 1,
        color: 'inherit',
        pointerEvents: 'none',
        opacity: '1',
        transition: 'opacity 0.2s ease, width 0.3s ease',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      });
    });
    this.child(this._textBox);
  }

  /**
   * 确保快捷键容器存在
   * @private
   */
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
    // 清除旧的子元素（从 _children 数组中移除）
    this._children = this._children.filter(c => {
      return c !== this._iconBox && c !== this._textBox && c !== this._shortcutBox && c !== this._arrowEl;
    });

    this._iconBox = null;
    this._textBox = null;
    this._shortcutBox = null;
    this._arrowEl = null;

    if (this._icon) {
      this._ensureIconBox();
      this._iconBox.html(this._icon);
    }

    if (this._text) {
      this._ensureTextBox();
      this._textBox.text(this._text);
    }

    if (this._shortcut) {
      this._ensureShortcutBox();
      this._shortcutBox.text(this._shortcut);
    }

    // 添加箭头（如果有子菜单）
    if (this._submenuContainer) {
      this._ensureArrowEl();
    }
  }

  /**
   * 渲染 DOM 元素
   * @returns {HTMLElement|null}
   */
  renderDom() {
    const element = super.renderDom();
    if (element) {
      element._vMenuItem = this;
    }
    return element;
  }
}

/**
 * 创建 VMenuItem 实例
 * @param {string|Function} [content=''] - 内容或 setup 函数
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VMenuItem}
 */
function vMenuItem(content = '', setup = null) {
  return new VMenuItem(content, setup);
}

// ============================================
// VMenuDivider 菜单分割线
// ============================================

/**
 * VMenuDivider 菜单分割线
 * @class
 * @extends Tag
 */
class VMenuDivider extends Tag {
  /**
   * 创建 VMenuDivider 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('hr', setup);
    this.styles({
      border: 'none',
      height: 'var(--yoya-menu-divider-height, 1px)',
      background: 'var(--yoya-menu-divider-bg, var(--yoya-border))',
      margin: 'var(--yoya-menu-divider-margin, 8px) 0',
    });
  }
}

/**
 * 创建 VMenuDivider 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VMenuDivider}
 */
function vMenuDivider(setup = null) {
  return new VMenuDivider(setup);
}

// ============================================
// VMenuGroup 菜单组
// ============================================

/**
 * VMenuGroup 菜单组容器
 * @class
 * @extends Tag
 */
class VMenuGroup extends Tag {
  /**
   * 创建 VMenuGroup 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', setup);
    this.styles({
      display: 'flex',
      flexDirection: 'column',
    });
  }

  /**
   * 设置组标签
   * @param {string} text - 标签文本
   * @returns {this}
   */
  label(text) {
    this._label = text;
    this._updateContent();
    return this;
  }

  /**
   * 添加菜单项
   * @param {string|Function} [content=''] - 内容或 setup 函数
   * @param {Function} [setup=null] - 初始化函数
   * @returns {VMenuItem}
   */
  item(content = '', setup = null) {
    const el = vMenuItem(content, setup);
    this.child(el);
    return el;
  }

  /**
   * 添加分割线
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this}
   */
  divider(setup = null) {
    const el = vMenuDivider(setup);
    this.child(el);
    return this;
  }

  /**
   * 更新内容（标签 + 菜单项）
   * @private
   */
  _updateContent() {
    const labelEl = this._children.find(c => c._isLabel);
    if (labelEl) {
      this._children = this._children.filter(c => c !== labelEl);
    }

    if (this._label) {
      const newLabelEl = span(label => {
        label.text(this._label);
        label.styles({
          display: 'block',
          padding: 'var(--yoya-menu-group-label-padding, 8px 16px 4px)',
          fontSize: 'var(--yoya-menu-group-label-font-size, 12px)',
          color: 'var(--yoya-menu-group-label-color, var(--yoya-text-tertiary))',
          fontWeight: 'var(--yoya-menu-group-label-font-weight, 500)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--yoya-menu-group-label-letter-spacing, 0.5px)',
        });
        label._isLabel = true;
      });

      const nonLabelChildren = this._children.filter(c => !c._isLabel);
      this._children = [newLabelEl, ...nonLabelChildren];
    }
  }
}

/**
 * 创建 VMenuGroup 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VMenuGroup}
 */
function vMenuGroup(setup = null) {
  return new VMenuGroup(setup);
}

// ============================================
// VDropdownMenu 下拉菜单
// ============================================

/**
 * VDropdownMenu 下拉菜单
 * 支持点击触发展开/折叠，可设置点击外部关闭
 * @class
 * @extends Tag
 */
class VDropdownMenu extends Tag {
  /**
   * 创建 VDropdownMenu 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);
    this.style('position', 'relative');
    this.style('display', 'inline-block');
    this._triggerContent = null;
    this._menu = null;
    this._triggerWrap = null;
    this._menuContainer = null;
    this._arrow = null;
    this._built = false;

    if (setup !== null) {
      this.setup(setup);
    }

    this._buildStructure();
  }

  /**
   * 设置触发器内容
   * @param {string|Tag} content - 内容或标签
   * @returns {this}
   */
  trigger(content) {
    this._triggerContent = content;
    return this;
  }

  /**
   * 设置菜单内容
   * @param {VMenu} menu - 菜单实例
   * @returns {this}
   */
  menuContent(menu) {
    this._menu = menu;
    return this;
  }

  /**
   * 启用点击外部关闭
   * @returns {this}
   */
  closeOnClickOutside() {
    this._closeOnClickOutside = true;
    return this;
  }

  /**
   * 切换展开/折叠状态
   * @private
   */
  _toggle() {
    if (!this._menuContainer || !this._arrow) return;

    const menuEl = this._menuContainer._boundElement;
    const arrowEl = this._arrow._boundElement;

    if (!menuEl || !arrowEl) return;

    const isOpen = menuEl.style.display === 'block';
    menuEl.style.display = isOpen ? 'none' : 'block';
    arrowEl.style.transform = isOpen ? '' : 'rotate(180deg)';
  }

  /**
   * 构建下拉菜单结构
   * @private
   */
  _buildStructure() {
    if (this._built) return;

    this.clear();

    this._triggerWrap = div(wrap => {
      wrap.styles({
        cursor: 'pointer',
        padding: 'var(--yoya-dropdown-trigger-padding, 8px 16px)',
        background: 'var(--yoya-dropdown-trigger-bg, var(--yoya-primary))',
        color: 'var(--yoya-dropdown-trigger-color, white)',
        borderRadius: 'var(--yoya-dropdown-trigger-radius, 6px)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--yoya-dropdown-trigger-gap, 6px)',
        userSelect: 'none',
        transition: 'all 0.2s',
      });
      wrap.on('mouseenter', () => {
        wrap.style('background', 'var(--yoya-dropdown-trigger-hover-bg, var(--yoya-primary-dark))');
      });
      wrap.on('mouseleave', () => {
        wrap.style('background', 'var(--yoya-dropdown-trigger-bg, var(--yoya-primary))');
      });

      if (typeof this._triggerContent === 'string') {
        wrap.span(this._triggerContent);
      } else if (this._triggerContent && this._triggerContent.renderDom) {
        wrap.child(this._triggerContent);
      }

      wrap.span(arrow => {
        arrow.text('▼');
        arrow.styles({ fontSize: 'var(--yoya-dropdown-arrow-size, 10px)', transition: 'transform 0.2s' });
        this._arrow = arrow;
      });

      wrap.on('click', (e) => {
        e.stopPropagation();
        this._toggle();
      });
    });

    this.child(this._triggerWrap);

    if (this._menu) {
      this._menuContainer = div(menuWrap => {
        menuWrap.styles({
          position: 'absolute',
          top: 'calc(100% + var(--yoya-dropdown-menu-offset, 4px))',
          left: '0',
          minWidth: 'var(--yoya-dropdown-menu-min-width, 160px)',
          background: 'var(--yoya-dropdown-menu-bg, var(--yoya-bg))',
          borderRadius: 'var(--yoya-dropdown-menu-radius, var(--yoya-radius-md))',
          boxShadow: 'var(--yoya-dropdown-menu-shadow, var(--yoya-shadow-dropdown))',
          padding: 'var(--yoya-dropdown-menu-padding, 8px) 0',
          zIndex: 'var(--yoya-dropdown-z-index, 1000)',
          display: 'none',
        });

        if (this._menu._children) {
          this._menu._children.forEach(child => {
            if (child) menuWrap.child(child);
          });
        }
      });

      this.child(this._menuContainer);
    }

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

/**
 * 创建 VDropdownMenu 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VDropdownMenu}
 */
function vDropdownMenu(setup = null) {
  return new VDropdownMenu(setup);
}

// ============================================
// VContextMenu 右键菜单
// ============================================

/**
 * VContextMenu 右键菜单
 * 绑定到指定元素的右键事件，在鼠标位置显示
 * @class
 * @extends Tag
 */
class VContextMenu extends Tag {
  /**
   * 创建 VContextMenu 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);
    this.styles({
      position: 'fixed',
      zIndex: 'var(--yoya-context-menu-z-index, 9999)',
      display: 'none',
      background: 'var(--yoya-context-menu-bg, var(--yoya-bg))',
      borderRadius: 'var(--yoya-context-menu-radius, var(--yoya-radius-md))',
      boxShadow: 'var(--yoya-context-menu-shadow, var(--yoya-shadow-dropdown))',
      padding: 'var(--yoya-context-menu-padding, 8px) 0',
      minWidth: 'var(--yoya-context-menu-min-width, 160px)',
      border: 'var(--yoya-context-menu-border, 1px solid var(--yoya-border))',
    });
    this._target = null;
    this._menu = null;
    this._built = false;

    if (setup !== null) {
      this.setup(setup);
    }

    this._buildContent();
  }

  /**
   * 绑定目标元素（右键触发）
   * @param {HTMLElement} element - 目标 DOM 元素
   * @returns {this}
   */
  target(element) {
    this._target = element;
    this._bindTarget();
    return this;
  }

  /**
   * 设置菜单内容
   * @param {VMenu} menu - 菜单实例
   * @returns {this}
   */
  menuContent(menu) {
    this._menu = menu;
    return this;
  }

  /**
   * 绑定目标元素事件
   * @private
   */
  _bindTarget() {
    if (!this._target) return;

    this._target.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.show(e.clientX, e.clientY);
    });

    document.addEventListener('click', () => { this.hide(); });
    window.addEventListener('scroll', () => { this.hide(); });
  }

  /**
   * 显示右键菜单
   * @param {number} x - x 坐标
   * @param {number} y - y 坐标
   * @returns {this}
   */
  show(x, y) {
    if (this._boundElement) {
      this._boundElement.style.display = 'block';
      this._boundElement.style.left = `${x}px`;
      this._boundElement.style.top = `${y}px`;

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

  /**
   * 隐藏右键菜单
   * @returns {this}
   */
  hide() {
    if (this._boundElement) {
      this._boundElement.style.display = 'none';
    }
    return this;
  }

  /**
   * 构建菜单内容
   * @private
   */
  _buildContent() {
    if (this._built) return;

    this.clear();

    if (this._menu && this._menu._children) {
      this._menu._children.forEach(child => {
        if (child) this.child(child);
      });
    }

    this._built = true;
  }
}

/**
 * 创建 VContextMenu 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VContextMenu}
 */
function vContextMenu(setup = null) {
  return new VContextMenu(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

/**
 * Tag 原型扩展 - 添加 vMenu 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vMenu = function(setup = null) {
  const el = vMenu(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vMenuItem 子元素
 * @param {string|Function} [content=''] - 内容或 setup 函数
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vMenuItem = function(content = '', setup = null) {
  const el = vMenuItem(content, setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vMenuDivider 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vMenuDivider = function(setup = null) {
  const el = vMenuDivider(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vDropdownMenu 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vDropdownMenu = function(setup = null) {
  const el = vDropdownMenu(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vMenuGroup 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vMenuGroup = function(setup = null) {
  const el = vMenuGroup(setup);
  this.child(el);
  return this;
};

/**
 * Tag 原型扩展 - 添加 vContextMenu 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vContextMenu = function(setup = null) {
  const el = vContextMenu(setup);
  this.child(el);
  return this;
};

// 兼容旧方法名
Tag.prototype.menu = Tag.prototype.vMenu;
Tag.prototype.menuItem = Tag.prototype.vMenuItem;
Tag.prototype.menuDivider = Tag.prototype.vMenuDivider;
Tag.prototype.dropdownMenu = Tag.prototype.vDropdownMenu;
Tag.prototype.menuGroup = Tag.prototype.vMenuGroup;
Tag.prototype.contextMenu = Tag.prototype.vContextMenu;

// ============================================
// VSubMenu 子菜单
// ============================================

/**
 * VSubMenu 子菜单
 * 可展开/折叠的菜单项，包含子菜单项
 * @class
 * @extends Tag
 */
class VSubMenu extends Tag {
  static _stateAttrs = ['expanded'];

  /**
   * 创建 VSubMenu 实例
   * @param {string} [title=''] - 子菜单标题
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(title = '', setup = null) {
    super('div', null);

    this._title = title;
    this._submenuItems = [];
    this._arrowEl = null;
    this._headerItem = null;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({ expanded: false });

    // 3. 创建标题项（带箭头）
    this._headerItem = vMenuItem(title, item => {
      item.styles({ fontWeight: '500' });

      // 添加展开箭头
      item._arrowEl = span(arrow => {
        arrow.styles({
          marginLeft: 'auto',
          fontSize: '10px',
          transition: 'transform 0.2s',
          opacity: '0.5',
          display: 'inline-block',
          flexShrink: '0',
        });
        arrow.text('▶');
      });
      this._arrowEl = item._arrowEl;
      item.child(item._arrowEl);

      // 点击标题切换展开/折叠
      item.on('click', (e) => {
        e.stopPropagation();
        const isExpanded = this.getState('expanded') || false;
        this.setState('expanded', !isExpanded);
      });
    });

    // 4. 创建子菜单容器
    this._container = div(container => {
      container.styles({
        display: 'none',
        flexDirection: 'column',
        marginLeft: '16px',
        paddingLeft: '8px',
        borderLeft: '1px solid var(--yoya-border, #e0e0e0)',
        marginTop: '4px',
      });
    });

    // 5. 注册 expanded 状态处理器
    this.registerStateHandler('expanded', (expanded, host) => {
      if (host._container?._boundElement && host._arrowEl?._boundElement) {
        if (expanded) {
          host._container._boundElement.style.display = 'flex';
          host._arrowEl._boundElement.style.transform = 'rotate(90deg)';
        } else {
          host._container._boundElement.style.display = 'none';
          host._arrowEl._boundElement.style.transform = 'rotate(0deg)';
        }
      }
    });

    // 6. 执行 setup
    if (setup !== null) {
      if (typeof setup === 'function') {
        setup(this);
      } else if (typeof setup === 'object' && setup !== null) {
        this._setupObject(setup);
      }
    }
  }

  /**
   * 处理对象配置
   * @param {Object} config - 配置对象
   * @private
   */
  _setupObject(config) {
    // 处理对象配置
    if (config.items && Array.isArray(config.items)) {
      config.items.forEach(itemConfig => {
        this.item(itemConfig);
      });
    }
  }

  /**
   * 添加子菜单项
   * @param {string|Function} [content=''] - 内容或 setup 函数
   * @param {Function} [setup=null] - 初始化函数
   * @returns {VMenuItem}
   */
  item(content = '', setup = null) {
    const el = vMenuItem(content, setup);
    el.styles({ paddingLeft: '24px' });
    this._container.child(el);
    this._submenuItems.push(el);
    return el;
  }

  /**
   * 添加分割线
   * @returns {VMenuDivider}
   */
  divider() {
    const el = vMenuDivider();
    el.styles({ marginLeft: '16px' });
    this._container.child(el);
    return el;
  }

  /**
   * 渲染 DOM 元素
   * @returns {HTMLElement|null}
   */
  renderDom() {
    if (this._deleted) return null;

    // 确保子元素按正确顺序添加
    if (!this._children.includes(this._headerItem)) {
      this._children.unshift(this._headerItem);
    }
    if (!this._children.includes(this._container)) {
      this._children.push(this._container);
    }

    return super.renderDom();
  }
}

/**
 * 创建 VSubMenu 实例
 * @param {string} [title=''] - 子菜单标题
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VSubMenu}
 */
function vSubMenu(title = '', setup = null) {
  return new VSubMenu(title, setup);
}

// ============================================
// VSidebar 侧边栏菜单
// ============================================

/**
 * VSidebar 侧边栏菜单
 * 支持折叠/展开，可设置宽度、头部、内容、底部等
 * @class
 * @extends Tag
 */
class VSidebar extends Tag {
  static _stateAttrs = ['collapsed', 'expanded'];

  /**
   * 创建 VSidebar 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 配置
    this._width = 'var(--yoya-sidebar-width, 240px)';
    this._collapsedWidth = 'var(--yoya-sidebar-collapsed-width, 64px)';

    // 内部元素引用
    this._headerEl = null;
    this._contentEl = null;
    this._footerEl = null;
    this._toggleBtnEl = null;

    // 状态
    this._collapsed = false;

    // 1. 初始化状态
    this.initializeStates({
      collapsed: false,
      expanded: false,
    });

    // 2. 设置基础样式
    this._setupBaseStyles();

    // 3. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 4. 注册状态处理器
    this._registerStateHandlers();

    // 5. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 设置基础样式
   * @private
   */
  _setupBaseStyles() {
    this.styles({
      display: 'flex',
      flexDirection: 'column',
      width: this._width,
      minWidth: this._width,
      height: '100%',
      background: 'var(--yoya-sidebar-bg, var(--yoya-card-bg, white))',
      borderRight: 'var(--yoya-sidebar-border, 1px solid var(--yoya-border, #e0e0e0))',
      color: 'var(--yoya-sidebar-content-color, var(--yoya-text, #333))',
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      boxSizing: 'border-box',
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('collapsed', (collapsed, host) => {
      const el = host._boundElement;

      if (collapsed) {
        // 折叠状态
        host.styles({
          width: host._collapsedWidth,
          minWidth: host._collapsedWidth,
        });

        // 隐藏头部和尾部 - 带淡出效果
        if (host._headerEl) {
          host._headerEl.styles({
            opacity: '0',
            transform: 'translateX(-10px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          });
          setTimeout(() => {
            host._headerEl.style('display', 'none');
          }, 200);
        }
        if (host._footerEl) {
          host._footerEl.styles({
            opacity: '0',
            transform: 'translateX(-10px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          });
          setTimeout(() => {
            host._footerEl.style('display', 'none');
          }, 200);
        }

        // 隐藏菜单项文本 - 带淡出效果
        if (host._contentEl) {
          const items = host._contentEl._children.filter(c => c._textBox);
          items.forEach((item, index) => {
            setTimeout(() => {
              if (item._textBox) {
                item._textBox.styles({
                  opacity: '0',
                  transition: 'opacity 0.15s ease',
                });
              }
              if (item._shortcutBox) {
                item._shortcutBox.styles({
                  opacity: '0',
                  transition: 'opacity 0.15s ease',
                });
              }
            }, index * 30);
          });
        }

        if (el) {
          el.style.width = host._collapsedWidth;
          el.style.minWidth = host._collapsedWidth;
        }
      } else {
        // 展开状态
        host.styles({
          width: host._width,
          minWidth: host._width,
        });

        // 显示头部和尾部 - 带淡入效果
        if (host._headerEl) {
          host._headerEl.style('display', 'flex');
          setTimeout(() => {
            host._headerEl.styles({
              opacity: '1',
              transform: 'translateX(0)',
              transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s',
            });
          }, 50);
        }
        if (host._footerEl) {
          host._footerEl.style('display', 'flex');
          setTimeout(() => {
            host._footerEl.styles({
              opacity: '1',
              transform: 'translateX(0)',
              transition: 'opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s',
            });
          }, 50);
        }

        // 显示菜单项文本 - 带阶梯淡入效果
        if (host._contentEl) {
          const items = host._contentEl._children.filter(c => c._textBox);
          items.forEach((item, index) => {
            setTimeout(() => {
              if (item._textBox) {
                item._textBox.style('display', '');
                item._textBox.styles({
                  opacity: '1',
                  transition: 'opacity 0.2s ease',
                });
              }
              if (item._shortcutBox) {
                item._shortcutBox.style('display', '');
                item._shortcutBox.styles({
                  opacity: '1',
                  transition: 'opacity 0.2s ease',
                });
              }
            }, 100 + index * 30);
          });
        }

        if (el) {
          el.style.width = host._width;
          el.style.minWidth = host._width;
        }
      }
    });
  }

  /**
   * 设置侧边栏宽度
   * @param {string} w - 宽度值
   * @returns {this}
   */
  width(w) {
    this._width = w;
    if (!this._collapsed) {
      this.style('width', w);
      this.style('minWidth', w);
    }
    return this;
  }

  /**
   * 设置折叠时宽度
   * @param {string} w - 宽度值
   * @returns {this}
   */
  collapsedWidth(w) {
    this._collapsedWidth = w;
    return this;
  }

  /**
   * 设置头部内容
   * @param {Function|string} setup - 初始化函数或文本
   * @returns {this}
   */
  header(setup) {
    if (!this._headerEl) {
      this._headerEl = div(header => {
        header.styles({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--yoya-sidebar-header-padding, 16px)',
          borderBottom: 'var(--yoya-sidebar-header-border, 1px solid var(--yoya-border, #e0e0e0))',
          background: 'var(--yoya-sidebar-header-bg, var(--yoya-bg-secondary, #f7f8fa))',
          color: 'var(--yoya-sidebar-header-color, var(--yoya-text, #333))',
        });
      });
      this.child(this._headerEl);
    } else {
      this._headerEl.clear();
    }

    if (typeof setup === 'function') {
      setup(this._headerEl);
    } else if (typeof setup === 'string') {
      this._headerEl.text(setup);
    }

    return this;
  }

  /**
   * 设置内容区域
   * @param {Function} setup - 初始化函数
   * @returns {this}
   */
  content(setup) {
    if (!this._contentEl) {
      this._contentEl = div(content => {
        content.styles({
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: 'var(--yoya-sidebar-content-padding, 8px 0)',
        });
      });
      this.child(this._contentEl);
    } else {
      this._contentEl.clear();
    }

    if (typeof setup === 'function') {
      // 创建一个包装对象，提供便捷的 item、divider、group 方法
      const contentWrapper = {
        item: (content, itemSetup) => {
          const el = vMenuItem(content, itemSetup);
          this._contentEl.child(el);
          return el;
        },
        divider: () => {
          const el = vMenuDivider();
          el.styles({
            marginLeft: '8px',
            marginRight: '8px',
          });
          this._contentEl.child(el);
          return this;
        },
        group: (groupSetup) => {
          const el = vMenuGroup(groupSetup);
          this._contentEl.child(el);
          return el;
        },
        // 返回原始 div 元素供直接使用
        _el: this._contentEl,
      };
      setup(contentWrapper);
    }

    return this;
  }

  /**
   * 设置底部内容
   * @param {Function|string} setup - 初始化函数或文本
   * @returns {this}
   */
  footer(setup) {
    if (!this._footerEl) {
      this._footerEl = div(footer => {
        footer.styles({
          display: 'flex',
          alignItems: 'center',
          padding: 'var(--yoya-sidebar-footer-padding, 16px)',
          borderTop: 'var(--yoya-sidebar-footer-border, 1px solid var(--yoya-border, #e0e0e0))',
          background: 'var(--yoya-sidebar-footer-bg, var(--yoya-bg-secondary, #f7f8fa))',
          color: 'var(--yoya-sidebar-footer-color, var(--yoya-text-secondary, #666))',
        });
      });
      this.child(this._footerEl);
    } else {
      this._footerEl.clear();
    }

    if (typeof setup === 'function') {
      setup(this._footerEl);
    } else if (typeof setup === 'string') {
      this._footerEl.text(setup);
    }

    return this;
  }

  /**
   * 添加菜单项
   * @param {string|Function} [content=''] - 内容或 setup 函数
   * @param {Function} [setup=null] - 初始化函数
   * @returns {VMenuItem}
   */
  item(content = '', setup = null) {
    if (!this._contentEl) {
      this.content(c => {});
    }
    const el = vMenuItem(content, setup);
    this._contentEl.child(el);
    return el;
  }

  /**
   * 添加分割线
   * @returns {this}
   */
  divider() {
    if (!this._contentEl) {
      this.content(c => {});
    }
    const el = vMenuDivider();
    el.styles({
      marginLeft: 'var(--yoya-sidebar-divider-margin, 8px)',
      marginRight: 'var(--yoya-sidebar-divider-margin, 8px)',
    });
    this._contentEl.child(el);
    return this;
  }

  /**
   * 添加菜单组
   * @param {Function} [setup=null] - 初始化函数
   * @returns {VMenuGroup}
   */
  group(setup = null) {
    if (!this._contentEl) {
      this.content(c => {});
    }
    const el = vMenuGroup(setup);
    this._contentEl.child(el);
    return el;
  }

  /**
   * 切换折叠状态
   * @returns {this}
   */
  toggle() {
    const collapsed = this.hasState('collapsed');
    this.setState('collapsed', !collapsed);
    this._collapsed = !collapsed;
    return this;
  }

  /**
   * 折叠侧边栏
   * @returns {this}
   */
  collapse() {
    this.setState('collapsed', true);
    this._collapsed = true;
    return this;
  }

  /**
   * 展开侧边栏
   * @returns {this}
   */
  expand() {
    this.setState('collapsed', false);
    this._collapsed = false;
    return this;
  }

  /**
   * 检查是否已折叠
   * @returns {boolean}
   */
  isCollapsed() {
    return this.hasState('collapsed');
  }

  /**
   * 添加切换按钮到头部
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this}
   */
  showToggleBtn(setup = null) {
    if (!this._headerEl) {
      this.header(h => {});
    }

    this._toggleBtnEl = button(btn => {
      btn.styles({
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 'var(--yoya-sidebar-toggle-padding, 8px)',
        borderRadius: 'var(--yoya-sidebar-toggle-radius, 6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        color: 'var(--yoya-text-secondary, #666)',
        fontSize: '16px',
      });
      btn.text('◀');
      btn.on('mouseenter', () => {
        btn.styles({
          background: 'var(--yoya-hover-bg, rgba(30, 64, 175, 0.1))',
          color: 'var(--yoya-primary)',
        });
      });
      btn.on('mouseleave', () => {
        btn.styles({
          background: 'transparent',
          color: 'var(--yoya-text-secondary, #666)',
        });
      });
      btn.on('click', () => {
        this.toggle();
      });
    });

    // 监听折叠状态变化，更新按钮图标方向
    this.registerStateInterceptor((stateName, value) => {
      if (stateName === 'collapsed' && this._toggleBtnEl && this._toggleBtnEl._boundElement) {
        setTimeout(() => {
          this._toggleBtnEl.textContent(value ? '▶' : '◀');
          this._toggleBtnEl.styles({
            transform: value ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          });
        }, 50);
      }
      return { stateName, value };
    });

    this._headerEl.child(this._toggleBtnEl);
    return this;
  }

  /**
   * 使用深色模式样式
   * @returns {this}
   */
  dark() {
    this.styles({
      background: 'var(--yoya-sidebar-bg-dark, var(--yoya-bg-dark, #1a1a1a))',
      borderRight: 'var(--yoya-sidebar-border-dark, 1px solid var(--yoya-border-dark, #333))',
    });
    if (this._headerEl) {
      this._headerEl.styles({
        background: 'var(--yoya-sidebar-header-bg-dark, var(--yoya-bg-dark-secondary, #2a2a2a))',
        borderBottom: 'var(--yoya-sidebar-header-border-dark, 1px solid var(--yoya-border-dark, #333))',
      });
    }
    if (this._footerEl) {
      this._footerEl.styles({
        background: 'var(--yoya-sidebar-footer-bg-dark, var(--yoya-bg-dark-secondary, #2a2a2a))',
        borderTop: 'var(--yoya-sidebar-footer-border-dark, 1px solid var(--yoya-border-dark, #333))',
      });
    }
    return this;
  }

  /**
   * 销毁组件（清理引用）
   * @returns {this}
   */
  destroy() {
    this._headerEl = null;
    this._contentEl = null;
    this._footerEl = null;
    this._toggleBtnEl = null;
    super.destroy();
  }
}

/**
 * 创建 VSidebar 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VSidebar}
 */
function vSidebar(setup = null) {
  return new VSidebar(setup);
}

/**
 * Tag 原型扩展 - 添加 vSidebar 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vSidebar = function(setup = null) {
  const el = vSidebar(setup);
  this.child(el);
  return this;
};

// ============================================
// VTopNavbar 顶部导航栏组件
// ============================================

/**
 * VTopNavbar - 顶部导航栏组件
 * 用于页面顶部的导航栏，支持 Logo、菜单项、右侧操作区等
 * @example
 * vTopNavbar(nav => {
 *   nav.height('60px');
 *   nav.logo('🏝️ Yoya.Basic', () => location.href = '/');
 *   nav.item('首页', () => toast('首页'));
 *   nav.item('文档', () => toast('文档'));
 *   nav.right(r => {
 *     r.button('登录', () => toast('登录'));
 *   });
 * });
 */
class VTopNavbar extends Tag {
  static _stateAttrs = ['fixed', 'bordered', 'themeMode'];

  /**
   * 创建 VTopNavbar 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 内部元素引用
    this._containerEl = null;
    this._logoEl = null;
    this._menuEl = null;
    this._rightEl = null;

    // 配置
    this._height = 'var(--yoya-navbar-height, 60px)';

    // 1. 初始化状态
    this.initializeStates({
      fixed: false,
      bordered: true,
      themeMode: 'light',
    });

    // 2. 设置基础样式
    this._setupBaseStyles();

    // 3. 注册状态处理器
    this._registerStateHandlers();

    // 4. 监听主题变化事件
    this._setupThemeListener();

    // 5. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 设置基础样式
   * @private
   */
  _setupBaseStyles() {
    this.styles({
      display: 'block',
      width: '100%',
      height: this._height,
      background: 'var(--yoya-navbar-bg, white)',
      borderBottom: 'var(--yoya-navbar-border, 1px solid var(--yoya-border, #e0e0e0))',
      boxSizing: 'border-box',
      zIndex: 'var(--yoya-navbar-z-index, 1000)',
    });

    // 创建内部容器
    this._containerEl = div(container => {
      container.styles({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        padding: '0 var(--yoya-navbar-padding, 16px)',
        boxSizing: 'border-box',
      });
    });
    this.child(this._containerEl);
  }

  _registerStateHandlers() {
    // fixed 状态处理器
    this.registerStateHandler('fixed', (fixed, host) => {
      if (fixed) {
        host.styles({
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
        });
      } else {
        host.styles({
          position: 'static',
        });
      }
    });

    // bordered 状态处理器
    this.registerStateHandler('bordered', (bordered, host) => {
      if (bordered) {
        host.style('borderBottom', 'var(--yoya-navbar-border, 1px solid var(--yoya-border, #e0e0e0))');
      } else {
        host.style('borderBottom', 'none');
      }
    });

    // themeMode 状态处理器
    this.registerStateHandler('themeMode', (mode, host) => {
      if (mode === 'dark') {
        host.styles({
          background: 'var(--yoya-navbar-bg-dark, var(--yoya-bg-dark, #1a1a1a))',
          borderBottom: 'var(--yoya-navbar-border-dark, 1px solid var(--yoya-border-dark, #333))',
        });
      } else {
        host.styles({
          background: 'var(--yoya-navbar-bg, white)',
          borderBottom: 'var(--yoya-navbar-border, 1px solid var(--yoya-border, #e0e0e0))',
        });
      }
    });
  }

  /**
   * 设置主题变化监听器
   * @private
   */
  _setupThemeListener() {
    if (typeof window === 'undefined') return;

    // 监听主题变化事件
    window.addEventListener('theme-changed', (e) => {
      const mode = e.detail?.mode || 'light';
      this.setState('themeMode', mode);
    });

    // 初始化时获取当前主题模式
    // 从全局 window._yoyaMode 获取（由 setThemeMode 设置）
    const getInitialMode = () => {
      if (typeof window._yoyaMode === 'string') {
        if (window._yoyaMode === 'auto') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return window._yoyaMode;
      }
      // 默认值
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const initialMode = getInitialMode();
    this.setState('themeMode', initialMode);
  }

  /**
   * 设置导航栏高度
   * @param {string} h - 高度值
   * @returns {this}
   */
  height(h) {
    this._height = h;
    this.style('height', h);
    return this;
  }

  /**
   * 设置 Logo 区域
   * @param {string|Function} content - Logo 内容（文本或 setup 函数）
   * @param {Function} [onClick=null] - 点击回调
   * @returns {this}
   */
  logo(content, onClick = null) {
    if (!this._logoEl) {
      this._logoEl = div(logo => {
        logo.styles({
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: 'var(--yoya-navbar-logo-size, 18px)',
          fontWeight: '600',
          color: 'var(--yoya-navbar-logo-color, var(--yoya-text, #333))',
          cursor: 'pointer',
          userSelect: 'none',
        });
      });
    } else {
      this._logoEl.clear();
    }

    if (typeof content === 'function') {
      content(this._logoEl);
    } else {
      this._logoEl.text(content);
    }

    if (onClick) {
      this._logoEl.on('click', onClick);
    }

    // 将 Logo 添加到容器（如果尚未添加）
    if (this._containerEl && !this._logoEl._parent) {
      this._containerEl._children.unshift(this._logoEl);
      this._logoEl._parent = this._containerEl;
    }

    return this;
  }

  /**
   * 添加导航项
   * @param {string} content - 菜单项文本
   * @param {Function} [setup=null] - 初始化函数
   * @returns {this}
   */
  item(content, setup = null) {
    if (!this._menuEl) {
      this._menuEl = div(menu => {
        menu.styles({
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        });
      });
    }

    const menuItem = div(item => {
      item.styles({
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 12px',
        borderRadius: 'var(--yoya-navbar-item-radius, 4px)',
        fontSize: 'var(--yoya-navbar-item-size, 14px)',
        color: 'var(--yoya-navbar-item-color, var(--yoya-text-secondary, #666))',
        cursor: 'pointer',
        transition: 'all 0.2s',
        userSelect: 'none',
      });

      item.text(content);

      item.on('mouseenter', () => {
        item.styles({
          background: 'var(--yoya-navbar-item-hover-bg, rgba(0,0,0,0.04))',
          color: 'var(--yoya-navbar-item-hover-color, var(--yoya-text, #333))',
        });
      });

      item.on('mouseleave', () => {
        if (!item._active) {
          item.styles({
            background: 'transparent',
            color: 'var(--yoya-navbar-item-color, var(--yoya-text-secondary, #666))',
          });
        }
      });

      item.on('click', (e) => {
        e.stopPropagation();
        // 移除其他项的激活状态
        if (this._menuEl) {
          this._menuEl._children.forEach(child => {
            if (child !== item) {
              child._active = false;
              child.styles({
                background: 'transparent',
                color: 'var(--yoya-navbar-item-color, var(--yoya-text-secondary, #666))',
                fontWeight: '400',
              });
            }
          });
        }
        // 设置当前项为激活状态
        item._active = true;
        item.styles({
          background: 'var(--yoya-navbar-item-active-bg, var(--yoya-primary-alpha, rgba(37,99,235,0.08)))',
          color: 'var(--yoya-navbar-item-active-color, var(--yoya-primary))',
          fontWeight: '500',
        });

        if (setup && typeof setup === 'function') {
          setup(item);
        }
      });
    });

    this._menuEl.child(menuItem);

    // 将菜单区域添加到容器（在 Logo 之后，_rightEl 之前）
    if (this._containerEl) {
      if (!this._menuEl._parent) {
        // 找到 _rightEl 的位置，在其之前插入
        const rightIndex = this._containerEl._children.indexOf(this._rightEl);
        if (rightIndex >= 0) {
          this._containerEl._children.splice(rightIndex, 0, this._menuEl);
        } else {
          this._containerEl._children.push(this._menuEl);
        }
        this._menuEl._parent = this._containerEl;
        this._containerEl.renderDom();
      }
    }
    return this;
  }

  /**
   * 设置右侧区域
   * @param {Function} setup - 初始化函数
   * @returns {this}
   */
  right(setup) {
    if (!this._rightEl) {
      this._rightEl = div(right => {
        right.styles({
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        });
      });
    }

    // 提供便捷的 button 方法
    const rightWrapper = {
      button: (content, onClick = null) => {
        const btn = vButton(content);
        rightWrapper._el.child(btn);
        if (onClick) {
          btn.on('click', onClick);
        }
        return btn;
      },
      item: (content, setup = null) => this.item(content, setup),
      divider: () => {
        const dividerEl = div(d => {
          d.styles({
            width: '1px',
            height: '20px',
            background: 'var(--yoya-border, #e0e0e0)',
            margin: '0 8px',
          });
        });
        rightWrapper._el.child(dividerEl);
        return rightWrapper;
      },
      _el: this._rightEl,
    };

    if (typeof setup === 'function') {
      setup(rightWrapper);
    }

    // 将右侧区域添加到容器末尾
    if (this._containerEl) {
      // 确保 _rightEl 在_children 数组的最后
      const index = this._containerEl._children.indexOf(this._rightEl);
      if (index >= 0) {
        this._containerEl._children.splice(index, 1);
      }
      this._containerEl._children.push(this._rightEl);
      this._rightEl._parent = this._containerEl;
      this._containerEl.renderDom();
    }
    return this;
  }

  /**
   * 设置为深色模式（兼容旧 API）
   * @returns {this}
   */
  dark() {
    this.setState('themeMode', 'dark');
    return this;
  }
}

/**
 * 创建 VTopNavbar 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VTopNavbar}
 */
function vTopNavbar(setup = null) {
  return new VTopNavbar(setup);
}

/**
 * Tag 原型扩展 - 添加 vTopNavbar 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vTopNavbar = function(setup = null) {
  const el = vTopNavbar(setup);
  this.child(el);
  return this;
};

// ============================================
// 导出
// ============================================

export {
  // Menu 组件
  VMenu, VMenuItem, VMenuDivider, VMenuGroup, VSubMenu, VDropdownMenu, VContextMenu,
  vMenu, vMenuItem, vMenuDivider, vMenuGroup, vSubMenu, vDropdownMenu, vContextMenu,

  // Sidebar 组件
  VSidebar,
  vSidebar,

  // TopNavbar 组件
  VTopNavbar,
  vTopNavbar,
};
