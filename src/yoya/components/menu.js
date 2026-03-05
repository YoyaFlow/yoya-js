/**
 * Yoya.Basic - Menu Components
 * 菜单组件库
 */

import { Tag, span, div } from '../core/basic.js';

// ============================================
// VMenu 菜单
// ============================================

class VMenu extends Tag {
  constructor(setup = null) {
    super('div', null);
    this.styles({
      display: 'inline-block',
      background: 'var(--islands-menu-bg, white)',
      borderRadius: 'var(--islands-menu-radius, var(--islands-radius-md, 8px))',
      boxShadow: 'var(--islands-menu-shadow, var(--islands-shadow, 0 4px 12px rgba(0,0,0,0.15)))',
      padding: 'var(--islands-menu-padding, var(--islands-padding-sm, 8px)) 0',
      minWidth: 'var(--islands-menu-min-width, 160px)',
      border: 'var(--islands-menu-border, 1px solid var(--islands-border, #e0e0e0))',
    });

    if (setup !== null) {
      this.setup(setup);
    }
  }

  vertical() {
    return this.style('flexDirection', 'column');
  }

  horizontal() {
    this.style('display', 'flex');
    this.style('flexDirection', 'row');
    this.style('flexWrap', 'nowrap');
    this.style('gap', '4px');
    this.style('padding', '8px');
    return this;
  }

  compact() {
    return this.style('padding', '4px 0');
  }

  noShadow() {
    return this.style('boxShadow', 'none');
  }

  bordered() {
    return this.style('border', '1px solid #e0e0e0');
  }

  item(content = '', setup = null) {
    const el = vMenuItem(content, setup);
    this.child(el);
    return el;
  }

  divider(setup = null) {
    const el = vMenuDivider(setup);
    this.child(el);
    return this;
  }

  group(setup = null) {
    const el = vMenuGroup(setup);
    this.child(el);
    return this;
  }
}

function vMenu(setup = null) {
  return new VMenu(setup);
}

// ============================================
// VMenuItem 菜单项
// ============================================

class VMenuItem extends Tag {
  static _stateAttrs = ['disabled', 'active', 'danger', 'hoverable'];

  constructor(content = '', setup = null) {
    if (typeof content === 'function') {
      setup = content;
      content = '';
    }

    super('div', null);
    this.registerStateAttrs(...this.constructor._stateAttrs);
    this._registerStateHandlers();

    this.styles({
      padding: 'var(--islands-menu-item-padding, var(--islands-padding-sm, 10px)) var(--islands-menu-item-horizontal-padding, var(--islands-padding-md, 16px))',
      cursor: 'pointer',
      alignItems: 'center',
      gap: 'var(--islands-menu-item-gap, var(--islands-gap-sm, 10px))',
      transition: 'background-color 0.2s',
      borderRadius: 'var(--islands-menu-item-radius, var(--islands-radius-sm, 4px))',
      color: 'var(--islands-menu-item-color, var(--islands-text, #333))',
      fontSize: 'var(--islands-menu-item-font-size, var(--islands-font-size-sm, 13px))',
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
      hoverable: false
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
          opacity: 'var(--islands-menu-item-disabled-opacity, 0.5)',
          cursor: 'var(--islands-menu-item-disabled-cursor, not-allowed)',
          pointerEvents: 'none',
          color: 'var(--islands-menu-item-disabled-color, var(--islands-text-secondary, #999))',
        });
        if (el) {
          el.style.opacity = 'var(--islands-menu-item-disabled-opacity, 0.5)';
          el.style.cursor = 'var(--islands-menu-item-disabled-cursor, not-allowed)';
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
          background: 'var(--islands-menu-item-active-bg, var(--islands-primary-alpha, rgba(102, 126, 234, 0.1)))',
          fontWeight: 'var(--islands-menu-item-active-font-weight, 500)',
          color: 'var(--islands-menu-item-active-color, var(--islands-primary, #667eea))',
        });
        if (el) {
          el.style.background = 'var(--islands-menu-item-active-bg, var(--islands-primary-alpha, rgba(102, 126, 234, 0.1)))';
          el.style.fontWeight = 'var(--islands-menu-item-active-font-weight, 500)';
          el.style.color = 'var(--islands-menu-item-active-color, var(--islands-primary, #667eea))';
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
        host.style('color', 'var(--islands-menu-item-danger-color, var(--islands-error, #dc3545))');
        if (el) {
          el.style.color = 'var(--islands-menu-item-danger-color, var(--islands-error, #dc3545))';
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
  }

  _registerHoverInterceptor() {
    this.registerStateInterceptor((stateName, value) => {
      if (this.hasState('disabled') && stateName !== 'disabled') {
        return null;
      }
      return { stateName, value };
    });
  }

  _setupInteractions() {
    const self = this;

    this.on('mouseenter', () => {
      if (!self.hasState('disabled')) {
        self.style('background', 'var(--islands-menu-item-hover-bg, var(--islands-hover-bg, rgba(102, 126, 234, 0.05)))');
        if (self._boundElement) {
          self._boundElement.style.background = 'var(--islands-menu-item-hover-bg, var(--islands-hover-bg, rgba(102, 126, 234, 0.05)))';
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

  text(content) {
    this._text = content;
    this._updateContent();
    return this;
  }

  icon(content) {
    this._icon = content;
    this._ensureIconBox();
    if (this._iconBox) {
      this._iconBox.html(this._icon);
    }
    return this;
  }

  onclick(fn) {
    this._onclick = fn;
    return this;
  }

  // 统一事件格式的方法
  onClick(handler) {
    this._onclick = handler;
    return this;
  }

  disabled() {
    return this.setState('disabled', true);
  }

  enabled() {
    return this.setState('disabled', false);
  }

  active() {
    return this.setState('active', true);
  }

  inactive() {
    return this.setState('active', false);
  }

  danger() {
    return this.setState('danger', true);
  }

  hoverable() {
    return this.setState('hoverable', true);
  }

  shortcut(key) {
    this._shortcut = key;
    this._updateContent();
    return this;
  }

  toggleState(stateName) {
    return this.setState(stateName, !this.hasState(stateName));
  }

  _ensureIconBox() {
    if (this._iconBox) return;
    this._iconBox = span(iconEl => {
      iconEl.styles({ display: 'inline-flex', alignItems: 'center', color: 'inherit', pointerEvents: 'none' });
    });
    this.child(this._iconBox);
  }

  _ensureTextBox() {
    if (this._textBox) return;
    this._textBox = span(textEl => {
      textEl.styles({ flex: 1, color: 'inherit', pointerEvents: 'none' });
    });
    this.child(this._textBox);
  }

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
    this.clear();
    this._iconBox = null;
    this._textBox = null;
    this._shortcutBox = null;

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
  }

  renderDom() {
    const element = super.renderDom();
    if (element) {
      element._vMenuItem = this;
    }
    return element;
  }
}

function vMenuItem(content = '', setup = null) {
  return new VMenuItem(content, setup);
}

// ============================================
// VMenuDivider 菜单分割线
// ============================================

class VMenuDivider extends Tag {
  constructor(setup = null) {
    super('hr', setup);
    this.styles({
      border: 'none',
      height: 'var(--islands-menu-divider-height, 1px)',
      background: 'var(--islands-menu-divider-bg, var(--islands-border, #e0e0e0))',
      margin: 'var(--islands-menu-divider-margin, var(--islands-margin-md, 8px)) 0',
    });
  }
}

function vMenuDivider(setup = null) {
  return new VMenuDivider(setup);
}

// ============================================
// VMenuGroup 菜单组
// ============================================

class VMenuGroup extends Tag {
  constructor(setup = null) {
    super('div', setup);
    this.styles({
      display: 'flex',
      flexDirection: 'column',
    });
  }

  label(text) {
    this._label = text;
    this._updateContent();
    return this;
  }

  item(content = '', setup = null) {
    const el = vMenuItem(content, setup);
    this.child(el);
    return el;
  }

  divider(setup = null) {
    const el = vMenuDivider(setup);
    this.child(el);
    return this;
  }

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
          padding: 'var(--islands-menu-group-label-padding, 8px 16px 4px)',
          fontSize: 'var(--islands-menu-group-label-font-size, 12px)',
          color: 'var(--islands-menu-group-label-color, #999)',
          fontWeight: 'var(--islands-menu-group-label-font-weight, 500)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--islands-menu-group-label-letter-spacing, 0.5px)',
        });
        label._isLabel = true;
      });

      const nonLabelChildren = this._children.filter(c => !c._isLabel);
      this._children = [newLabelEl, ...nonLabelChildren];
    }
  }
}

function vMenuGroup(setup = null) {
  return new VMenuGroup(setup);
}

// ============================================
// VDropdownMenu 下拉菜单
// ============================================

class VDropdownMenu extends Tag {
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

  trigger(content) {
    this._triggerContent = content;
    return this;
  }

  menuContent(menu) {
    this._menu = menu;
    return this;
  }

  closeOnClickOutside() {
    this._closeOnClickOutside = true;
    return this;
  }

  _toggle() {
    if (!this._menuContainer || !this._arrow) return;

    const menuEl = this._menuContainer._boundElement;
    const arrowEl = this._arrow._boundElement;

    if (!menuEl || !arrowEl) return;

    const isOpen = menuEl.style.display === 'block';
    menuEl.style.display = isOpen ? 'none' : 'block';
    arrowEl.style.transform = isOpen ? '' : 'rotate(180deg)';
  }

  _buildStructure() {
    if (this._built) return;

    this.clear();

    this._triggerWrap = div(wrap => {
      wrap.styles({
        cursor: 'pointer',
        padding: 'var(--islands-dropdown-trigger-padding, 8px 16px)',
        background: 'var(--islands-dropdown-trigger-bg, #667eea)',
        color: 'var(--islands-dropdown-trigger-color, white)',
        borderRadius: 'var(--islands-dropdown-trigger-radius, 6px)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--islands-dropdown-trigger-gap, 6px)',
        userSelect: 'none',
        transition: 'all 0.2s',
      });
      wrap.on('mouseenter', () => {
        wrap.style('background', 'var(--islands-dropdown-trigger-hover-bg, #5a6fd6)');
      });
      wrap.on('mouseleave', () => {
        wrap.style('background', 'var(--islands-dropdown-trigger-bg, #667eea)');
      });

      if (typeof this._triggerContent === 'string') {
        wrap.span(this._triggerContent);
      } else if (this._triggerContent && this._triggerContent.renderDom) {
        wrap.child(this._triggerContent);
      }

      wrap.span(arrow => {
        arrow.text('▼');
        arrow.styles({ fontSize: 'var(--islands-dropdown-arrow-size, 10px)', transition: 'transform 0.2s' });
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
          top: 'calc(100% + var(--islands-dropdown-menu-offset, 4px))',
          left: '0',
          minWidth: 'var(--islands-dropdown-menu-min-width, 160px)',
          background: 'var(--islands-dropdown-menu-bg, white)',
          borderRadius: 'var(--islands-dropdown-menu-radius, var(--islands-radius-md, 8px))',
          boxShadow: 'var(--islands-dropdown-menu-shadow, 0 4px 12px rgba(0,0,0,0.15))',
          padding: 'var(--islands-dropdown-menu-padding, 8px) 0',
          zIndex: 'var(--islands-dropdown-z-index, 1000)',
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

function vDropdownMenu(setup = null) {
  return new VDropdownMenu(setup);
}

// ============================================
// VContextMenu 右键菜单
// ============================================

class VContextMenu extends Tag {
  constructor(setup = null) {
    super('div', null);
    this.styles({
      position: 'fixed',
      zIndex: 'var(--islands-context-menu-z-index, 9999)',
      display: 'none',
      background: 'var(--islands-context-menu-bg, white)',
      borderRadius: 'var(--islands-context-menu-radius, var(--islands-radius-md, 8px))',
      boxShadow: 'var(--islands-context-menu-shadow, 0 4px 12px rgba(0,0,0,0.15))',
      padding: 'var(--islands-context-menu-padding, 8px) 0',
      minWidth: 'var(--islands-context-menu-min-width, 160px)',
      border: 'var(--islands-context-menu-border, 1px solid var(--islands-border, #e0e0e0))',
    });
    this._target = null;
    this._menu = null;
    this._built = false;

    if (setup !== null) {
      this.setup(setup);
    }

    this._buildContent();
  }

  target(element) {
    this._target = element;
    this._bindTarget();
    return this;
  }

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

    document.addEventListener('click', () => { this.hide(); });
    window.addEventListener('scroll', () => { this.hide(); });
  }

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

  hide() {
    if (this._boundElement) {
      this._boundElement.style.display = 'none';
    }
    return this;
  }

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

function vContextMenu(setup = null) {
  return new VContextMenu(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

Tag.prototype.vMenu = function(setup = null) {
  const el = vMenu(setup);
  this.child(el);
  return this;
};

Tag.prototype.vMenuItem = function(content = '', setup = null) {
  const el = vMenuItem(content, setup);
  this.child(el);
  return this;
};

Tag.prototype.vMenuDivider = function(setup = null) {
  const el = vMenuDivider(setup);
  this.child(el);
  return this;
};

Tag.prototype.vDropdownMenu = function(setup = null) {
  const el = vDropdownMenu(setup);
  this.child(el);
  return this;
};

Tag.prototype.vMenuGroup = function(setup = null) {
  const el = vMenuGroup(setup);
  this.child(el);
  return this;
};

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
// 导出
// ============================================

export {
  VMenu,
  VMenuItem,
  VMenuDivider,
  VMenuGroup,
  VDropdownMenu,
  VContextMenu,
  vMenu,
  vMenuItem,
  vMenuDivider,
  vMenuGroup,
  vDropdownMenu,
  vContextMenu
};
