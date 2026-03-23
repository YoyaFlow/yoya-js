/**
 * Yoya.Components - Interaction Components
 * 交互组件：Tooltip, Popover, Dropdown, Collapse
 */

import { Tag, div, span, input, button } from '../core/basic.js';
import { vCard, vCardHeader, vCardBody } from './card.js';

// ============================================
// VTooltip 文字提示气泡
// ============================================

class VTooltip extends Tag {
  static _stateAttrs = ['visible'];

  constructor(setup = null) {
    super('span', null);

    this._title = '';
    this._target = null;
    this._placement = 'top';
    this._trigger = 'hover';
    this._color = '';
    this._onVisibleChange = null;

    this.registerStateAttrs(...this.constructor._stateAttrs);
    this.initializeStates({ visible: false });
    this._setupBaseStyles();
    this.saveBaseStylesSnapshot();
    this._registerStateHandlers();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupString(setup) {
    this._title = setup;
    this._renderContent();
  }

  _setupBaseStyles() {
    this.addClass('yoya-tooltip');
    this.style('display', 'inline-block');
    this.style('position', 'relative');
  }

  _registerStateHandlers() {
    this.registerStateHandler('visible', (visible, host) => {
      if (this._tooltipEl) {
        this._tooltipEl.style('display', visible ? 'block' : 'none');
      }
      if (this._onVisibleChange) {
        this._onVisibleChange(visible);
      }
    });
  }

  _createTooltip() {
    this._tooltipEl = div(t => {
      t.addClass('yoya-tooltip__content');
      t.styles({
        position: 'absolute',
        padding: '6px 12px',
        backgroundColor: this._color || 'rgba(0, 0, 0, 0.75)',
        color: '#fff',
        borderRadius: '4px',
        fontSize: '13px',
        whiteSpace: 'nowrap',
        zIndex: '1000',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        display: this.hasState('visible') ? 'block' : 'none'
      });

      // 根据 placement 设置位置
      const placementStyles = {
        'top': { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' },
        'topLeft': { bottom: '100%', left: '0', marginBottom: '8px' },
        'topRight': { bottom: '100%', right: '0', marginBottom: '8px' },
        'bottom': { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' },
        'bottomLeft': { top: '100%', left: '0', marginTop: '8px' },
        'bottomRight': { top: '100%', right: '0', marginTop: '8px' },
        'left': { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' },
        'leftTop': { right: '100%', top: '0', marginRight: '8px' },
        'leftBottom': { right: '100%', bottom: '0', marginRight: '8px' },
        'right': { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' },
        'rightTop': { left: '100%', top: '0', marginLeft: '8px' },
        'rightBottom': { left: '100%', bottom: '0', marginLeft: '8px' }
      };

      const style = placementStyles[this._placement] || placementStyles['top'];
      Object.keys(style).forEach(key => {
        t.style(key, style[key]);
      });

      t.text(this._title);
    });
    this._children.push(this._tooltipEl);
  }

  _renderContent() {
    if (!this._tooltipEl) {
      this._createTooltip();
    } else if (this._tooltipEl) {
      this._tooltipEl.text(this._title);
    }
  }

  _bindEvents() {
    if (this._target) {
      if (this._trigger === 'hover') {
        this._target.on('mouseenter', () => this.setState('visible', true));
        this._target.on('mouseleave', () => this.setState('visible', false));
        // 同步事件到真实 DOM
        this._syncTargetEvents();
      } else if (this._trigger === 'click') {
        this._target.on('click', () => {
          this.setState('visible', !this.hasState('visible'));
        });
        this._syncTargetEvents();
      } else if (this._trigger === 'focus') {
        this._target.on('focus', () => this.setState('visible', true));
        this._target.on('blur', () => this.setState('visible', false));
        this._syncTargetEvents();
      }
    }
  }

  _syncTargetEvents() {
    // 将事件同步到目标元素的真实 DOM
    if (this._target) {
      // 确保目标元素已经渲染
      if (!this._target._el) {
        this._target.renderDom();
      }
      if (this._target._el) {
        this._target._applyEventsToEl();
      }
    }
  }

  title(t) {
    this._title = t;
    this._renderContent();
    return this;
  }

  target(el) {
    this._target = el;
    // 先创建 tooltip 元素（如果还没有创建）
    if (!this._tooltipEl) {
      this._createTooltip();
    }
    // 重新构建子元素列表：tooltip + target
    this._children = [this._tooltipEl];
    this.child(el);
    this._bindEvents();
    return this;
  }

  placement(p) {
    this._placement = p;
    if (this._tooltipEl) {
      this._createTooltip();
    }
    return this;
  }

  trigger(t) {
    this._trigger = t;
    this._bindEvents();
    return this;
  }

  color(c) {
    this._color = c;
    return this;
  }

  visible(v) {
    this.setState('visible', v);
    return this;
  }

  onVisibleChange(fn) {
    this._onVisibleChange = fn;
    return this;
  }
}

// ============================================
// VPopover 弹出气泡卡片
// ============================================

class VPopover extends Tag {
  static _stateAttrs = ['visible'];

  constructor(setup = null) {
    super('span', null);

    this._title = '';
    this._content = null;
    this._target = null;
    this._trigger = 'click';
    this._placement = 'top';
    this._width = 300;
    this._overlayClassName = '';
    this._onVisibleChange = null;

    this.registerStateAttrs(...this.constructor._stateAttrs);
    this.initializeStates({ visible: false });
    this._setupBaseStyles();
    this.saveBaseStylesSnapshot();
    this._registerStateHandlers();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-popover');
    this.style('display', 'inline-block');
    this.style('position', 'relative');
  }

  _registerStateHandlers() {
    this.registerStateHandler('visible', (visible, host) => {
      if (this._popoverEl) {
        this._popoverEl.style('display', visible ? 'block' : 'none');
      }
      if (this._onVisibleChange) {
        this._onVisibleChange(visible);
      }
    });
  }

  _createPopover() {
    this._popoverEl = vCard(p => {
      p.addClass('yoya-popover__content');
      p.styles({
        position: 'absolute',
        zIndex: '1000',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        display: this.hasState('visible') ? 'block' : 'none',
        minWidth: `${this._width}px`
      });

      if (this._overlayClassName) {
        p.className(this._overlayClassName);
      }

      if (this._title) {
        p.vCardHeader(this._title);
      }
      p.vCardBody(c => c.child(this._content));
    });
    this._children.push(this._popoverEl);
  }

  _applyPlacement() {
    if (!this._popoverEl) return;

    const placementStyles = {
      'top': { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '12px' },
      'topLeft': { bottom: '100%', left: '0', marginBottom: '12px' },
      'topRight': { bottom: '100%', right: '0', marginBottom: '12px' },
      'bottom': { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '12px' },
      'bottomLeft': { top: '100%', left: '0', marginTop: '12px' },
      'bottomRight': { top: '100%', right: '0', marginTop: '12px' },
      'left': { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '12px' },
      'right': { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '12px' }
    };

    const style = placementStyles[this._placement] || placementStyles['top'];
    Object.keys(style).forEach(key => {
      this._popoverEl.style(key, style[key]);
    });
  }

  _bindEvents() {
    if (this._target) {
      if (this._trigger === 'hover') {
        this._target.on('mouseenter', () => this.setState('visible', true));
        this._target.on('mouseleave', () => this.setState('visible', false));
        this._syncTargetEvents();
      } else if (this._trigger === 'click') {
        this._target.on('click', () => {
          this.setState('visible', !this.hasState('visible'));
        });
        this._syncTargetEvents();
      } else if (this._trigger === 'focus') {
        this._target.on('focus', () => this.setState('visible', true));
        this._target.on('blur', () => this.setState('visible', false));
        this._syncTargetEvents();
      } else if (this._trigger === 'contextMenu') {
        this._target.on('contextmenu', (e) => {
          e.preventDefault();
          this.setState('visible', true);
        });
        this._syncTargetEvents();
      }
    }
  }

  _syncTargetEvents() {
    // 将事件同步到目标元素的真实 DOM
    if (this._target) {
      // 确保目标元素已经渲染
      if (!this._target._el) {
        this._target.renderDom();
      }
      if (this._target._el) {
        this._target._applyEventsToEl();
      }
    }
  }

  title(t) {
    this._title = t;
    if (this._popoverEl) {
      this._createPopover();
    }
    return this;
  }

  content(c) {
    this._content = c;
    if (this._popoverEl) {
      this._createPopover();
    }
    return this;
  }

  target(el) {
    this._target = el;
    this._children = [];
    this.child(el);
    if (!this._popoverEl) {
      this._createPopover();
      this._applyPlacement();
    }
    this._bindEvents();
    return this;
  }

  placement(p) {
    this._placement = p;
    this._applyPlacement();
    return this;
  }

  trigger(t) {
    this._trigger = t;
    this._bindEvents();
    return this;
  }

  width(w) {
    this._width = w;
    return this;
  }

  overlayClassName(c) {
    this._overlayClassName = c;
    return this;
  }

  visible(v) {
    this.setState('visible', v);
    return this;
  }

  onVisibleChange(fn) {
    this._onVisibleChange = fn;
    return this;
  }
}

// ============================================
// VDropdown 下拉菜单
// ============================================

class VDropdown extends Tag {
  static _stateAttrs = ['visible', 'multiple'];

  constructor(setup = null) {
    super('div', null);

    this._trigger = null;
    this._menu = null;
    this._placement = 'bottomLeft';
    this._triggerType = 'click';
    this._multiple = false;
    this._searchable = false;
    this._searchValue = '';
    this._onSelect = null;
    this._selectedValues = [];

    this.registerStateAttrs(...this.constructor._stateAttrs);
    this.initializeStates({ visible: false, multiple: false });
    this._setupBaseStyles();
    this.saveBaseStylesSnapshot();
    this._registerStateHandlers();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-dropdown');
    this.style('display', 'inline-block');
    this.style('position', 'relative');
  }

  _registerStateHandlers() {
    this.registerStateHandler('visible', (visible, host) => {
      if (this._dropdownEl) {
        this._dropdownEl.style('display', visible ? 'block' : 'none');
      }
    });

    this.registerStateHandler('multiple', (multiple, host) => {
      this._multiple = multiple;
    });
  }

  _createDropdown() {
    this._dropdownEl = div(d => {
      d.addClass('yoya-dropdown__content');
      d.styles({
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: '4px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '1000',
        minWidth: '150px',
        display: this.hasState('visible') ? 'block' : 'none'
      });

      if (this._searchable) {
        const searchInput = input(i => {
          i.addClass('yoya-dropdown__search');
          i.styles({
            width: '100%',
            padding: '8px 12px',
            border: '1px solid var(--yoya-border)',
            borderRadius: '4px 4px 0 0',
            outline: 'none'
          });
          i.placeholder('搜索...');
          i.on('input', (e) => {
            this._searchValue = e.target.value;
            this._filterMenuItems();
          });
        });
        d.child(searchInput);
      }

      if (this._menu) {
        d.child(this._menu);
      }
    });
    this._children.push(this._dropdownEl);
  }

  _filterMenuItems() {
    // 简单的搜索过滤逻辑
    if (this._menu && this._searchable) {
      const items = this._menu._children || [];
      items.forEach(item => {
        if (item.text && typeof item.text === 'string') {
          const visible = item.text.toLowerCase().includes(this._searchValue.toLowerCase());
          item.style('display', visible ? 'block' : 'none');
        }
      });
    }
  }

  _applyPlacement() {
    if (!this._dropdownEl) return;

    const placementStyles = {
      'bottomLeft': { top: '100%', left: '0', marginTop: '8px' },
      'bottomRight': { top: '100%', right: '0', marginTop: '8px' },
      'topLeft': { bottom: '100%', left: '0', marginBottom: '8px' },
      'topRight': { bottom: '100%', right: '0', marginBottom: '8px' }
    };

    const style = placementStyles[this._placement] || placementStyles['bottomLeft'];
    Object.keys(style).forEach(key => {
      this._dropdownEl.style(key, style[key]);
    });
  }

  _bindEvents() {
    if (this._trigger) {
      if (this._triggerType === 'hover') {
        this._trigger.on('mouseenter', () => this.setState('visible', true));
        this._trigger.on('mouseleave', () => this.setState('visible', false));
        this._syncTargetEvents();
      } else {
        this._trigger.on('click', () => {
          this.setState('visible', !this.hasState('visible'));
        });
        this._syncTargetEvents();
      }
    }

    // 点击外部关闭
    document.addEventListener('click', (e) => {
      if (this._dropdownEl && this.hasState('visible')) {
        const dropdownEl = this._dropdownEl.renderDom();
        const triggerEl = this._trigger ? this._trigger.renderDom() : null;
        if (!dropdownEl.contains(e.target) && (triggerEl && !triggerEl.contains(e.target))) {
          this.setState('visible', false);
        }
      }
    });
  }

  _syncTargetEvents() {
    // 将事件同步到目标元素的真实 DOM
    if (this._trigger) {
      // 确保目标元素已经渲染
      if (!this._trigger._el) {
        this._trigger.renderDom();
      }
      if (this._trigger._el) {
        this._trigger._applyEventsToEl();
      }
    }
  }

  trigger(el) {
    this._trigger = el;
    this._children = [];
    this.child(el);
    if (!this._dropdownEl) {
      this._createDropdown();
      this._applyPlacement();
    }
    this._bindEvents();
    return this;
  }

  menu(m) {
    this._menu = m;
    if (this._dropdownEl) {
      this._createDropdown();
      this._applyPlacement();
    }
    return this;
  }

  placement(p) {
    this._placement = p;
    this._applyPlacement();
    return this;
  }

  triggerType(t) {
    this._triggerType = t;
    this._bindEvents();
    return this;
  }

  multiple(m) {
    this.setState('multiple', m);
    return this;
  }

  searchable(s) {
    this._searchable = s;
    if (this._dropdownEl) {
      this._createDropdown();
      this._applyPlacement();
    }
    return this;
  }

  onSelect(fn) {
    this._onSelect = fn;
    return this;
  }
}

// ============================================
// VCollapse 折叠面板
// ============================================

class VCollapse extends Tag {
  static _stateAttrs = ['accordion'];

  constructor(setup = null) {
    super('div', null);

    this._panels = [];
    this._accordion = false;
    this._activeKeys = [];
    this._onChange = null;

    this.registerStateAttrs(...this.constructor._stateAttrs);
    this.initializeStates({ accordion: false });
    this._setupBaseStyles();
    this.saveBaseStylesSnapshot();
    this._registerStateHandlers();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-collapse');
    this.style('display', 'block');
  }

  _registerStateHandlers() {
    this.registerStateHandler('accordion', (accordion, host) => {
      this._accordion = accordion;
    });
  }

  _updatePanels() {
    this._children = [];
    this._panels.forEach((panel, index) => {
      const isActive = this._activeKeys.includes(panel.key);

      const panelEl = div(p => {
        p.addClass('yoya-collapse__panel');
        p.styles({
          border: '1px solid var(--yoya-border)',
          borderRadius: '4px',
          marginBottom: index < this._panels.length - 1 ? '8px' : '0',
          overflow: 'hidden'
        });

        // 面板头部
        const header = div(h => {
          h.addClass('yoya-collapse__header');
          h.styles({
            padding: '12px 16px',
            backgroundColor: 'var(--yoya-bg-tertiary)',
            cursor: 'pointer',
            fontWeight: '500',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          });

          h.text(panel.header);

          // 展开/收起图标
          const icon = span(i => {
            i.html(isActive ? '▼' : '▶');
            i.styles({
              fontSize: '12px',
              transition: 'transform 0.3s'
            });
          });
          h.child(icon);

          h.on('click', () => {
            this._handlePanelClick(panel.key);
          });
        });
        p.child(header);

        // 面板内容
        const content = div(c => {
          c.addClass('yoya-collapse__content');
          c.styles({
            padding: isActive ? '16px' : '0',
            maxHeight: isActive ? '1000px' : '0',
            overflow: 'hidden',
            transition: 'all 0.3s',
            backgroundColor: 'var(--yoya-bg)'
          });

          if (isActive && panel.content) {
            c.child(panel.content);
          }
        });
        p.child(content);
      });

      this._children.push(panelEl);
    });
  }

  _handlePanelClick(key) {
    if (this._accordion) {
      // 手风琴模式：只保留一个激活的面板
      this._activeKeys = this._activeKeys[0] === key ? [] : [key];
    } else {
      // 普通模式：切换面板状态
      const index = this._activeKeys.indexOf(key);
      if (index > -1) {
        this._activeKeys.splice(index, 1);
      } else {
        this._activeKeys.push(key);
      }
    }

    if (this._onChange) {
      this._onChange(this._activeKeys);
    }

    this._updatePanels();

    // 重新渲染
    this._rendered = false;
    if (this._el) {
      this._el.innerHTML = '';
      this.renderDom();
    }
  }

  panel(p) {
    // 支持对象或 setup 函数
    if (typeof p === 'function') {
      const panelConfig = {};
      p(panelConfig);
      this._panels.push(panelConfig);
    } else if (typeof p === 'object' && p !== null) {
      this._panels.push(p);
    }
    this._updatePanels();
    return this;
  }

  accordion(value) {
    this.setState('accordion', value);
    return this;
  }

  activeKey(keys) {
    this._activeKeys = Array.isArray(keys) ? keys : [keys];
    this._updatePanels();
    return this;
  }

  defaultActiveKey(keys) {
    return this.activeKey(keys);
  }

  onChange(fn) {
    this._onChange = fn;
    return this;
  }
}


// ============================================
// 工厂函数
// ============================================

function vTooltip(setup = null) {
  return new VTooltip(setup);
}

function vPopover(setup = null) {
  return new VPopover(setup);
}

function vDropdown(setup = null) {
  return new VDropdown(setup);
}

function vCollapse(setup = null) {
  return new VCollapse(setup);
}

// ============================================
// 导出
// ============================================

export {
  VTooltip,
  vTooltip,
  VPopover,
  vPopover,
  VDropdown,
  vDropdown,
  VCollapse,
  vCollapse,
};
