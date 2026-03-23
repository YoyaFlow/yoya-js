/**
 * Yoya.Components - UI Elements
 * 基础 UI 组件：Avatar, Badge, Progress, Skeleton, Tag, Alert, Breadcrumb, Statistic
 */

import { Tag, div, span, img, p } from '../core/basic.js';

// ============================================
// VAvatar 头像组件
// ============================================

class VAvatar extends Tag {
  static _stateAttrs = ['shape'];

  constructor(setup = null) {
    super('div', null);

    this._src = '';
    this._alt = '';
    this._size = 'default';
    this._shape = 'circle';
    this._icon = '';
    this._text = '';

    this.registerStateAttrs(...this.constructor._stateAttrs);
    this.initializeStates({ shape: 'circle' });
    this._setupBaseStyles();
    this._applyDefaultSize();
    this.saveBaseStylesSnapshot();
    this._registerStateHandlers();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupString(setup) {
    this._text = setup;
    this._ensureContent();
  }

  _setupBaseStyles() {
    this.addClass('yoya-avatar');
    this.addClass('yoya-avatar--circle');
    this.style('display', 'inline-flex');
    this.style('alignItems', 'center');
    this.style('justifyContent', 'center');
    this.style('overflow', 'hidden');
    this.style('backgroundColor', 'var(--yoya-primary)');
    this.style('color', 'var(--yoya-text-inverse)');
    this.style('fontWeight', '500');
    this.style('textAlign', 'center');
    this.style('borderRadius', '50%');
    this.style('flexShrink', '0');
    this.style('minWidth', 'inherit');
  }

  _applyDefaultSize() {
    const sizeMap = {
      'large': 40,
      'default': 32,
      'small': 24
    };
    const pixelSize = sizeMap[this._size] || 32;
    this.style('width', `${pixelSize}px`);
    this.style('height', `${pixelSize}px`);
    this.style('fontSize', `${pixelSize * 0.5}px`);
  }

  _registerStateHandlers() {
    this.registerStateHandler('shape', (shape, host) => {
      if (shape === 'square') {
        host.removeClass('yoya-avatar--circle');
        host.addClass('yoya-avatar--square');
        host.style('borderRadius', '4px');
      } else {
        host.removeClass('yoya-avatar--square');
        host.addClass('yoya-avatar--circle');
        host.style('borderRadius', '50%');
      }
    });
  }

  _ensureContent() {
    if (!this._contentBox) {
      this._contentBox = span(c => {
        c.style('display', 'flex');
        c.style('alignItems', 'center');
        c.style('justifyContent', 'center');
        c.style('width', '100%');
        c.style('height', '100%');
        c.style('borderRadius', 'inherit');
        c.style('overflow', 'hidden');
        c.style('flexShrink', '0');
        c.style('minWidth', '0');
      });
      this._children.push(this._contentBox);
    }

    this._contentBox._children = [];

    if (this._src) {
      this._contentBox.child(img(i => {
        i.src(this._src);
        i.alt(this._alt);
        i.style('width', '100%');
        i.style('height', '100%');
        i.style('objectFit', 'cover');
      }));
    } else if (this._icon) {
      this._contentBox.html(this._icon);
    } else if (this._text) {
      this._contentBox.text(this._text);
    }
  }

  src(url) {
    this._src = url;
    this._ensureContent();
    return this;
  }

  alt(text) {
    this._alt = text;
    return this;
  }

  size(value) {
    this._size = value;

    const sizeMap = {
      'large': 40,
      'default': 32,
      'small': 24
    };

    let pixelSize;
    if (typeof value === 'number') {
      // 数字：直接使用，如 vAvatar(a => { a.size(48) })
      pixelSize = value;
      this.style('width', `${pixelSize}px`);
      this.style('height', `${pixelSize}px`);
    } else if (typeof value === 'string' && /^\d+(\.\d+)?/.test(value)) {
      // 带单位的字符串：如 '48px', '3rem', '1.5in' 等
      const match = value.match(/^(\d+(\.\d+)?)(.*)$/);
      const numValue = parseFloat(match[1]);
      const unit = match[3] || 'px';
      pixelSize = numValue;
      this.style('width', `${numValue}${unit}`);
      this.style('height', `${numValue}${unit}`);
    } else {
      // 预设值：'large', 'default', 'small'
      pixelSize = sizeMap[value] || 32;
      this.style('width', `${pixelSize}px`);
      this.style('height', `${pixelSize}px`);
    }

    this.style('fontSize', typeof value === 'number' ? `${pixelSize * 0.5}px` : (typeof value === 'string' && /^\d+(\.\d+)?/.test(value) ? `${pixelSize * 0.5}${value.replace(/^[\d.]+/, '') || 'px'}` : `${pixelSize * 0.5}px`));

    return this;
  }

  shape(type) {
    this.setState('shape', type);
    return this;
  }

  icon(html) {
    this._icon = html;
    this._ensureContent();
    return this;
  }

  text(content) {
    this._text = content;
    this._ensureContent();
    return this;
  }

  onClick(fn) {
    this.on('click', fn);
    this.style('cursor', 'pointer');
    return this;
  }
}

// ============================================
// VAvatar.Group 头像组
// ============================================

class VAvatarGroup extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._max = 0;
    this._avatars = [];

    this._setupBaseStyles();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-avatar-group');
    this.style('display', 'flex');
    this.style('flexDirection', 'row-reverse');
  }

  max(n) {
    this._max = n;
    return this;
  }

  child(avatar) {
    if (avatar instanceof VAvatar) {
      this._avatars.push(avatar);
      const index = this._avatars.length;
      avatar.style('marginLeft', index > 1 ? '-8px' : '0');
      avatar.style('border', '2px solid var(--yoya-bg)');
      super.child(avatar);
    }
    return this;
  }
}

// ============================================
// VBadge 徽标组件
// ============================================

class VBadge extends Tag {
  static _stateAttrs = ['status', 'dot', 'standalone'];

  constructor(setup = null) {
    super('span', null);

    this._count = 0;
    this._target = null;
    this._color = '';
    this._overflowCount = 99;
    this._text = '';

    this.registerStateAttrs(...this.constructor._stateAttrs);
    this.initializeStates({ status: 'default', dot: false, standalone: false });
    this._setupBaseStyles();
    this.saveBaseStylesSnapshot();
    this._registerStateHandlers();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupString(setup) {
    this._text = setup;
    this._renderContent();
  }

  _setupBaseStyles() {
    this.addClass('yoya-badge');
    this.style('display', 'inline-block');
    this.style('textAlign', 'center');
    this.style('lineHeight', '1');
  }

  _registerStateHandlers() {
    this.registerStateHandler('dot', (isDot, host) => {
      if (isDot) {
        host.addClass('yoya-badge--dot');
      }
    });

    this.registerStateHandler('standalone', (standalone, host) => {
      if (standalone) {
        host.style('position', 'static');
      }
    });

    this.registerStateHandler('status', (status, host) => {
      host.removeClass('yoya-badge--success', 'yoya-badge--error', 'yoya-badge--warning', 'yoya-badge--processing', 'yoya-badge--default');
      if (status) {
        host.addClass(`yoya-badge--${status}`);
      }
    });
  }

  _renderContent() {
    let displayCount = this._count;
    if (typeof this._count === 'number' && this._count > this._overflowCount) {
      displayCount = `${this._overflowCount}+`;
    }

    const content = this._dot ? '' : (this._text || displayCount);

    if (this._target) {
      // 附着模式：徽章覆盖在目标元素上
      this._children = [];
      super.child(this._target);

      const badgeEl = span(b => {
        b.addClass('yoya-badge__overlay');
        b.text(content);
        if (this._color) {
          b.style('backgroundColor', this._color);
        }
      });
      this._children.push(badgeEl);
    } else {
      // 独立模式：直接显示为一个独立的徽标
      this.setState('standalone', true);
      this.addClass('yoya-badge--standalone');

      if (!this._badgeTextBox) {
        this._badgeTextBox = span(b => {
          b.addClass('yoya-badge__overlay');
          b.styles({
            position: 'static',
            transform: 'none',
            display: 'inline-block'
          });
        });
        this._children.push(this._badgeTextBox);
      }
      this._badgeTextBox.text(content);

      if (this._color) {
        this._badgeTextBox.style('backgroundColor', this._color);
      }
    }
  }

  count(n) {
    this._count = n;
    this._renderContent();
    return this;
  }

  target(el) {
    this._target = el;
    this._renderContent();
    return this;
  }

  dot() {
    this._dot = true;
    this.setState('dot', true);
    return this;
  }

  status(type) {
    this.setState('status', type);
    return this;
  }

  standalone() {
    this.setState('standalone', true);
    return this;
  }

  color(c) {
    this._color = c;
    return this;
  }

  overflowCount(n) {
    this._overflowCount = n;
    this._renderContent();
    return this;
  }

  text(content) {
    this._text = content;
    this._renderContent();
    return this;
  }
}

// ============================================
// VProgress 进度条组件
// ============================================

class VProgress extends Tag {
  static _stateAttrs = ['status'];

  constructor(setup = null) {
    super('div', null);

    this._percent = 0;
    this._type = 'line';
    this._strokeWidth = 10;
    this._showInfo = true;
    this._strokeColor = '#1890ff';
    this._text = '';

    this.registerStateAttrs(...this.constructor._stateAttrs);
    this.initializeStates({ status: 'normal' });
    this._setupBaseStyles();
    this.saveBaseStylesSnapshot();
    this._registerStateHandlers();
    this._createInternalElements();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-progress');
    this.style('display', 'inline-block');
    this.style('width', '100%');
  }

  _registerStateHandlers() {
    this.registerStateHandler('status', (status, host) => {
      host.removeClass('yoya-progress--normal', 'yoya-progress--active', 'yoya-progress--exception', 'yoya-progress--success');
      host.addClass(`yoya-progress--${status}`);
    });
  }

  _createInternalElements() {
    this._progressBox = div(b => {
      b.addClass('yoya-progress__outer');
      b.styles({
        position: 'relative',
        backgroundColor: 'var(--yoya-bg-tertiary)',
        borderRadius: '100px',
        fontSize: '0'
      });
    });
    this._children.push(this._progressBox);

    this._bar = div(b => {
      b.addClass('yoya-progress__inner');
      b.styles({
        position: 'relative',
        backgroundColor: 'var(--yoya-primary)',
        borderRadius: '100px',
        transition: 'width 0.3s ease'
      });
      b.style('height', `${this._strokeWidth}px`);
      b.style('width', '0%');
    });
    this._progressBox.child(this._bar);

    if (this._showInfo) {
      this._ensureInfoEl();
    }
  }

  _ensureInfoEl() {
    if (!this._infoEl) {
      this._infoEl = span(i => {
        i.addClass('yoya-progress__text');
        i.styles({
          display: 'inline-block',
          marginLeft: '8px',
          fontSize: '14px',
          color: 'var(--yoya-text-secondary)'
        });
      });
      this._children.push(this._infoEl);
    }
  }

  _updatePercent() {
    const clamped = Math.max(0, Math.min(100, this._percent));
    this._bar.style('width', `${clamped}%`);

    if (this._showInfo && this._infoEl) {
      this._infoEl.text(this._text || `${clamped}%`);
    }
  }

  percent(n) {
    this._percent = Math.max(0, Math.min(100, n));
    this._updatePercent();
    return this;
  }

  type(t) {
    this._type = t;
    return this;
  }

  strokeWidth(n) {
    this._strokeWidth = n;
    this._bar.style('height', `${n}px`);
    return this;
  }

  showInfo(bool) {
    this._showInfo = bool;
    if (bool) {
      this._ensureInfoEl();
      this._infoEl.style('display', 'inline-block');
    } else if (this._infoEl) {
      this._infoEl.style('display', 'none');
    }
    return this;
  }

  status(s) {
    this.setState('status', s);
    const colorMap = {
      'normal': '#1890ff',
      'active': '#1890ff',
      'exception': '#ff4d4f',
      'success': '#52c41a'
    };
    this._strokeColor = colorMap[s] || this._strokeColor;
    this._bar.style('backgroundColor', this._strokeColor);
    return this;
  }

  strokeColor(c) {
    this._strokeColor = c;
    this._bar.style('backgroundColor', c);
    return this;
  }

  text(t) {
    this._text = t;
    this._updatePercent();
    return this;
  }
}

// ============================================
// VSkeleton 骨架屏组件
// ============================================

class VSkeleton extends Tag {
  static _stateAttrs = ['active'];

  constructor(setup = null) {
    super('div', null);

    this._type = 'paragraph';
    this._rows = 3;
    this._showAvatar = false;
    this._showTitle = false;
    this._showButton = false;

    this.registerStateAttrs(...this.constructor._stateAttrs);
    this.initializeStates({ active: false });
    this._setupBaseStyles();
    this.saveBaseStylesSnapshot();
    this._registerStateHandlers();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-skeleton');
    this.style('display', 'block');
    this.style('padding', '16px');
    this.style('backgroundColor', 'var(--yoya-bg)');
    this.style('width', '100%');
    this.style('minWidth', '100%');
  }

  _registerStateHandlers() {
    this.registerStateHandler('active', (active, host) => {
      if (active) {
        host.addClass('yoya-skeleton--active');
      }
    });
  }

  _buildContent() {
    this._children = [];

    if (this._showAvatar) {
      this._avatarBox = div(a => {
        a.addClass('yoya-skeleton__avatar');
        a.styles({
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'var(--yoya-bg-tertiary)',
          marginBottom: '16px'
        });
      });
      this._children.push(this._avatarBox);
    }

    if (this._showTitle) {
      this._titleBox = div(t => {
        t.addClass('yoya-skeleton__title');
        t.styles({
          height: '20px',
          width: '60%',
          backgroundColor: 'var(--yoya-bg-tertiary)',
          marginBottom: '16px',
          borderRadius: '4px'
        });
      });
      this._children.push(this._titleBox);
    }

    if (this._type === 'paragraph' || this._rows > 0) {
      for (let i = 0; i < this._rows; i++) {
        const width = i === this._rows - 1 ? '60%' : '100%';
        const row = div(r => {
          r.addClass('yoya-skeleton__row');
          r.styles({
            height: '16px',
            width,
            backgroundColor: 'var(--yoya-bg-tertiary)',
            marginBottom: i < this._rows - 1 ? '8px' : '0',
            borderRadius: '4px'
          });
        });
        this._children.push(row);
      }
    }

    if (this._showButton) {
      this._buttonBox = div(b => {
        b.addClass('yoya-skeleton__button');
        b.styles({
          height: '32px',
          width: '100px',
          backgroundColor: 'var(--yoya-bg-tertiary)',
          marginTop: '16px',
          borderRadius: '4px'
        });
      });
      this._children.push(this._buttonBox);
    }
  }

  type(t) {
    this._type = t;
    if (t === 'avatar') this._showAvatar = true;
    if (t === 'button') this._showButton = true;
    this._buildContent();
    return this;
  }

  rows(n) {
    this._rows = n;
    this._buildContent();
    return this;
  }

  active(bool) {
    this.setState('active', bool);
    return this;
  }

  avatar() {
    this._showAvatar = true;
    this._buildContent();
    return this;
  }

  title() {
    this._showTitle = true;
    this._buildContent();
    return this;
  }

  button() {
    this._showButton = true;
    this._buildContent();
    return this;
  }

  paragraph(n = 3) {
    this._rows = n;
    this._buildContent();
    return this;
  }
}

// ============================================
// VTag 标签组件
// ============================================

class VTag extends Tag {
  static _stateAttrs = ['color', 'size', 'bordered', 'closable'];

  constructor(setup = null) {
    super('span', null);

    this._text = '';
    this._color = 'default';
    this._size = 'default';
    this._bordered = true;
    this._closable = false;
    this._onClose = null;

    this.registerStateAttrs(...this.constructor._stateAttrs);
    this.initializeStates({ color: 'default', size: 'default', bordered: true, closable: false });
    this._setupBaseStyles();
    this.saveBaseStylesSnapshot();
    this._registerStateHandlers();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupString(setup) {
    this._text = setup;
    this._ensureContent();
  }

  _setupBaseStyles() {
    this.addClass('yoya-tag');
    this.style('display', 'inline-flex');
    this.style('alignItems', 'center');
    this.style('padding', '2px 8px');
    this.style('fontSize', '12px');
    this.style('lineHeight', '1.5');
    this.style('borderRadius', '4px');
  }

  _registerStateHandlers() {
    this.registerStateHandler('color', (color, host) => {
      host.removeClass('yoya-tag--default', 'yoya-tag--blue', 'yoya-tag--green', 'yoya-tag--red', 'yoya-tag--orange', 'yoya-tag--purple');
      if (color && color !== 'default') {
        host.addClass(`yoya-tag--${color}`);
      }
      this._applyColorStyles(color, host);
    });

    this.registerStateHandler('size', (size, host) => {
      if (size === 'large') {
        host.style('padding', '4px 12px');
        host.style('fontSize', '14px');
      } else if (size === 'small') {
        host.style('padding', '1px 6px');
        host.style('fontSize', '10px');
      } else {
        host.style('padding', '2px 8px');
        host.style('fontSize', '12px');
      }
    });

    this.registerStateHandler('bordered', (bordered, host) => {
      if (bordered) {
        host.style('border', '1px solid var(--yoya-border)');
      } else {
        host.style('border', 'none');
      }
    });

    this.registerStateHandler('closable', (closable, host) => {
      if (closable) {
        this._ensureCloseButton();
      } else if (this._closeBtn) {
        this._closeBtn.style('display', 'none');
      }
    });
  }

  _applyColorStyles(color, host) {
    const colorMap = {
      'default': { bg: 'var(--yoya-bg-tertiary)', text: 'var(--yoya-text-secondary)', border: 'var(--yoya-border)' },
      'blue': { bg: 'var(--yoya-info-bg)', text: 'var(--yoya-info)', border: 'var(--yoya-info)' },
      'green': { bg: 'var(--yoya-success-bg)', text: 'var(--yoya-success)', border: 'var(--yoya-success)' },
      'red': { bg: 'var(--yoya-error-bg)', text: 'var(--yoya-error)', border: 'var(--yoya-error)' },
      'orange': { bg: 'var(--yoya-warning-bg)', text: 'var(--yoya-warning)', border: 'var(--yoya-warning)' },
      'purple': { bg: 'rgba(114, 46, 209, 0.1)', text: '#a882eb', border: '#a882eb' }
    };

    const c = colorMap[color] || colorMap.default;
    if (typeof color === 'string' && color.startsWith('#')) {
      host.style('backgroundColor', color);
      host.style('color', '#fff');
      host.style('borderColor', color);
    } else if (c) {
      host.style('backgroundColor', c.bg);
      host.style('color', c.text);
      host.style('borderColor', c.border);
    }
  }

  _ensureContent() {
    if (!this._textBox) {
      this._textBox = span();
      this._children.push(this._textBox);
    }
    this._textBox.text(this._text);
  }

  _ensureCloseButton() {
    if (!this._closeBtn) {
      this._closeBtn = span(c => {
        c.addClass('yoya-tag__close');
        c.html('×');
        c.styles({
          marginLeft: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          lineHeight: '1'
        });
        c.on('click', (e) => {
          e.stopPropagation();
          this._handleClose();
        });
      });
      this._children.push(this._closeBtn);
    }
  }

  _handleClose() {
    this.style('display', 'none');
    if (this._onClose) {
      this._onClose(this);
    }
  }

  text(t) {
    this._text = t;
    this._ensureContent();
    return this;
  }

  color(c) {
    this.setState('color', c);
    return this;
  }

  size(s) {
    this.setState('size', s);
    return this;
  }

  bordered(bool) {
    this.setState('bordered', bool);
    return this;
  }

  closable(bool) {
    this.setState('closable', bool);
    return this;
  }

  onClose(fn) {
    this._onClose = fn;
    return this;
  }

  onClick(fn) {
    this.on('click', fn);
    return this;
  }
}

// ============================================
// VAlert 警告提示组件
// ============================================

class VAlert extends Tag {
  static _stateAttrs = ['type', 'showIcon', 'closable'];

  constructor(setup = null) {
    super('div', null);

    this._message = '';
    this._description = '';
    this._type = 'info';
    this._showIcon = true;
    this._closable = false;
    this._action = null;
    this._onClose = null;

    this.registerStateAttrs(...this.constructor._stateAttrs);
    this.initializeStates({ type: 'info', showIcon: true, closable: false });
    this._setupBaseStyles();
    this.saveBaseStylesSnapshot();
    this._registerStateHandlers();
    this._buildContent();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-alert');
    this.styles({
      padding: '8px 16px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px'
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('type', (type, host) => {
      host.removeClass('yoya-alert--info', 'yoya-alert--success', 'yoya-alert--warning', 'yoya-alert--error');
      host.addClass(`yoya-alert--${type}`);
    });

    this.registerStateHandler('showIcon', (showIcon, host) => {
      if (this._iconBox) {
        this._iconBox.style('display', showIcon ? 'block' : 'none');
      }
    });

    this.registerStateHandler('closable', (closable, host) => {
      if (this._closeBtn) {
        this._closeBtn.style('display', closable ? 'block' : 'none');
      }
    });
  }

  _buildContent() {
    this._children = [];

    this._iconBox = span(i => {
      i.addClass('yoya-alert__icon');
      i.styles({ fontSize: '16px' });
    });
    this._children.push(this._iconBox);

    this._contentBox = div(c => {
      c.addClass('yoya-alert__content');
      c.style('flex', '1');
      c.style('minWidth', '0');
    });
    this._children.push(this._contentBox);

    this._closeBtn = span(b => {
      b.addClass('yoya-alert__close');
      b.html('×');
      b.styles({ cursor: 'pointer', fontSize: '16px', lineHeight: '1', color: 'var(--yoya-text-tertiary)' });
      b.on('click', (e) => {
        e.stopPropagation();
        this._handleClose();
      });
      b.style('display', 'none');
    });
    this._children.push(this._closeBtn);
  }

  _updateContent() {
    if (!this._messageEl) {
      this._messageEl = div(m => {
        m.addClass('yoya-alert__message');
        m.style('fontWeight', '500');
      });
      this._contentBox.child(this._messageEl);
    }
    this._messageEl.text(this._message);

    if (this._description) {
      if (!this._descEl) {
        this._descEl = div(d => {
          d.addClass('yoya-alert__description');
          d.style('fontSize', '13px');
          d.style('marginTop', '4px');
          d.style('color', 'var(--yoya-text-secondary)');
        });
        this._contentBox.child(this._descEl);
      }
      this._descEl.text(this._description);
    }
  }

  _updateIcon() {
    const iconMap = {
      'info': 'ℹ️',
      'success': '✓',
      'warning': '⚠️',
      'error': '✕'
    };
    const colorMap = {
      'info': 'var(--yoya-info)',
      'success': 'var(--yoya-success)',
      'warning': 'var(--yoya-warning)',
      'error': 'var(--yoya-error)'
    };
    if (this._iconBox) {
      this._iconBox.text(iconMap[this._type] || iconMap.info);
      this._iconBox.style('color', colorMap[this._type] || colorMap.info);
    }
  }

  _handleClose() {
    this.style('display', 'none');
    if (this._onClose) {
      this._onClose(this);
    }
  }

  message(m) {
    this._message = m;
    this._updateContent();
    return this;
  }

  description(d) {
    this._description = d;
    this._updateContent();
    return this;
  }

  type(t) {
    this.setState('type', t);
    this._updateIcon();
    return this;
  }

  showIcon(bool) {
    this.setState('showIcon', bool);
    return this;
  }

  closable(bool) {
    this.setState('closable', bool);
    return this;
  }

  action(el) {
    this._action = el;
    if (this._actionBox) {
      this._actionBox._children = [];
      this._actionBox.child(el);
    } else {
      this._actionBox = div(a => {
        a.addClass('yoya-alert__action');
        a.style('marginLeft', '8px');
        a.child(el);
      });
      this._contentBox.child(this._actionBox);
    }
    return this;
  }

  onClose(fn) {
    this._onClose = fn;
    return this;
  }
}

// ============================================
// VBreadcrumb 面包屑组件
// ============================================

class VBreadcrumb extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._items = [];
    this._separator = '/';
    this._maxCount = 0;

    this._setupBaseStyles();
    this._buildContent();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-breadcrumb');
    this.style('display', 'flex');
    this.style('alignItems', 'center');
    this.style('fontSize', '14px');
  }

  _buildContent() {
    this._itemsContainer = span(c => {
      c.addClass('yoya-breadcrumb__items');
      c.style('display', 'inline-flex');
      c.style('alignItems', 'center');
    });
    this._children.push(this._itemsContainer);
  }

  _renderItems() {
    this._itemsContainer._children = [];

    let displayItems = this._items;
    if (this._maxCount > 0 && this._items.length > this._maxCount) {
      const skip = this._items.length - this._maxCount + 1;
      displayItems = this._items.slice(skip);
      displayItems.unshift({ text: '...', type: 'ellipsis' });
    }

    displayItems.forEach((item, index) => {
      if (item.type === 'ellipsis') {
        const ellipsisEl = span(e => {
          e.text('...');
          e.style('padding', '0 8px');
        });
        this._itemsContainer.child(ellipsisEl);
      } else {
        const itemEl = span(i => {
          i.addClass('yoya-breadcrumb__item');
          i.styles({ display: 'inline-flex', alignItems: 'center' });
          i.text(item.text);
          if (item.onClick && index < displayItems.length - 1) {
            i.style('cursor', 'pointer');
            i.style('color', 'var(--yoya-primary)');
            i.on('click', item.onClick);
          }
          if (index === displayItems.length - 1) {
            i.style('color', 'var(--yoya-text-primary)');
            i.style('cursor', 'default');
          }
        });
        this._itemsContainer.child(itemEl);

        if (index < displayItems.length - 1) {
          const sep = span(s => {
            s.addClass('yoya-breadcrumb__separator');
            s.styles({ padding: '0 8px', color: 'var(--yoya-text-tertiary)' });
            s.text(this._separator);
          });
          this._itemsContainer.child(sep);
        }
      }
    });
  }

  item(textOrObj, onClick) {
    const item = typeof textOrObj === 'string'
      ? { text: textOrObj, onClick }
      : textOrObj;
    this._items.push(item);
    this._renderItems();
    return this;
  }

  separator(s) {
    this._separator = s;
    this._renderItems();
    return this;
  }

  maxCount(n) {
    this._maxCount = n;
    this._renderItems();
    return this;
  }
}

// ============================================
// VStatistic 统计数值组件
// ============================================

class VStatistic extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._title = '';
    this._value = 0;
    this._prefix = '';
    this._suffix = '';
    this._precision = undefined;
    this._separator = ',';
    this._animated = false;
    this._duration = 2000;
    this._valueEl = null;

    this._setupBaseStyles();
    this._createInternalElements();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupString(setup) {
    this._value = parseFloat(setup) || 0;
    this._updateValue();
  }

  _setupBaseStyles() {
    this.addClass('yoya-statistic');
    this.style('display', 'inline-block');
    this.style('verticalAlign', 'top');
  }

  _createInternalElements() {
    this._titleEl = div(t => {
      t.addClass('yoya-statistic__title');
      t.styles({
        fontSize: '14px',
        color: 'var(--yoya-text-secondary)',
        marginBottom: '8px'
      });
    });
    this._children.push(this._titleEl);

    this._valueEl = div(v => {
      v.addClass('yoya-statistic__value');
      v.styles({
        fontSize: '24px',
        fontWeight: '600',
        color: 'var(--yoya-text-primary)',
        lineHeight: '1.5',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      });
    });
    this._children.push(this._valueEl);
  }

  _formatNumber(num) {
    // 处理精度
    let formatted = this._precision !== undefined
      ? num.toFixed(this._precision)
      : String(num);

    // 处理分隔符
    if (this._separator) {
      const parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this._separator);
      formatted = parts.join('.');
    }

    return formatted;
  }

  _updateValue() {
    if (!this._valueEl) return;

    this._valueEl._children = [];

    // 前缀
    if (this._prefix) {
      const prefixEl = span(p => {
        p.addClass('yoya-statistic__prefix');
        p.text(this._prefix);
        p.style('flexShrink', '0');
      });
      this._valueEl.child(prefixEl);
    }

    // 数值
    const valueEl = span(v => {
      v.addClass('yoya-statistic__number');
      v.text(this._formatNumber(this._value));
    });
    this._valueEl.child(valueEl);

    // 后缀
    if (this._suffix) {
      const suffixEl = span(s => {
        s.addClass('yoya-statistic__suffix');
        s.text(this._suffix);
        s.style('marginLeft', '4px');
      });
      this._valueEl.child(suffixEl);
    }
  }

  _animateValue(from, to) {
    const startTime = performance.now();
    const current = { value: from };

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this._duration, 1);

      // 缓动函数（easeOutExpo）
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      current.value = from + (to - from) * eased;
      this._value = current.value;

      // 更新显示
      const numberEl = this._valueEl._children.find(c => c.hasClass('yoya-statistic__number'));
      if (numberEl) {
        numberEl.text(this._formatNumber(current.value));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  title(t) {
    this._title = t;
    if (this._titleEl) {
      this._titleEl.text(t);
    }
    return this;
  }

  value(v) {
    const oldValue = this._value;
    this._value = v;

    if (this._animated && this._valueEl && typeof v === 'number') {
      this._animateValue(oldValue, v);
    } else {
      this._updateValue();
    }
    return this;
  }

  prefix(p) {
    this._prefix = p;
    this._updateValue();
    return this;
  }

  suffix(s) {
    this._suffix = s;
    this._updateValue();
    return this;
  }

  precision(p) {
    this._precision = p;
    this._updateValue();
    return this;
  }

  separator(s) {
    this._separator = s;
    this._updateValue();
    return this;
  }

  animated(bool) {
    this._animated = bool;
    return this;
  }

  duration(ms) {
    this._duration = ms;
    return this;
  }
}

function vStatistic(setup = null) {
  return new VStatistic(setup);
}

// ============================================
// 工厂函数
// ============================================

function vAvatar(setup = null) {
  return new VAvatar(setup);
}

function vAvatarGroup(setup = null) {
  return new VAvatarGroup(setup);
}

vAvatar.group = (setup = null) => new VAvatarGroup(setup);

function vBadge(setup = null) {
  return new VBadge(setup);
}

function vProgress(setup = null) {
  return new VProgress(setup);
}

function vSkeleton(setup = null) {
  return new VSkeleton(setup);
}

function vTag(setup = null) {
  return new VTag(setup);
}

function vAlert(setup = null) {
  return new VAlert(setup);
}

function vBreadcrumb(setup = null) {
  return new VBreadcrumb(setup);
}

// ============================================
// 导出
// ============================================

export {
  VAvatar,
  VAvatarGroup,
  vAvatar,
  vAvatarGroup,
  VBadge,
  vBadge,
  VProgress,
  vProgress,
  VSkeleton,
  vSkeleton,
  VTag,
  vTag,
  VAlert,
  vAlert,
  VBreadcrumb,
  vBreadcrumb,
  VStatistic,
  vStatistic,
};
