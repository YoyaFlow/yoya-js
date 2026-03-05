/**
 * Yoya.Components - Form Elements
 * 带主题样式的表单输入组件
 */

import { Tag, span, div, label, input, select, option, textarea } from '../core/basic.js';

// ============================================
// VInput 输入框组件
// ============================================

class VInput extends Tag {
  static _stateAttrs = ['disabled', 'readonly', 'error', 'loading'];

  constructor(setup = null) {
    super('div', null);
    // this._el 已在 super() 中创建

    // 内部 input 元素引用
    this._inputEl = null;
    this._loadingSpinner = null;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      readonly: false,
      error: false,
      loading: false,
    });

    // 3. 设置基础样式（直接设置到 this._el）
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 创建内部元素（在 setup 之前，确保 setup 时可以绑定事件）
    this._createInternalElements();

    // 7. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.styles({
      display: 'inline-flex',
      alignItems: 'center',
      width: '100%',
      maxWidth: '100%',
      fontSize: 'var(--islands-input-font-size, 14px)',
      borderRadius: 'var(--islands-input-radius, 6px)',
      border: '1px solid var(--islands-input-border, var(--islands-border, #e0e0e0))',
      background: 'var(--islands-input-bg, var(--islands-bg, white))',
      color: 'var(--islands-input-text, var(--islands-text, #333))',
      transition: 'all 0.2s',
      outline: 'none',
      height: 'var(--islands-input-height, 32px)',
      boxSizing: 'border-box',
      cursor: 'text',
    });
  }

  _createInternalElements() {
    // 只在首次创建内部 input 元素
    if (this._inputEl) return;

    this._inputEl = input(i => {
      i.styles({
        flex: 1,
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontSize: 'inherit',
        color: 'inherit',
        minWidth: 0,
        width: '100%',
        height: '100%',
        padding: 'var(--islands-input-padding, 8px 12px)',
      });
    });

    // 同步属性到内部 input
    if (this._placeholder) {
      this._inputEl.attr('placeholder', this._placeholder);
    }
    if (this._value !== undefined) {
      this._inputEl.attr('value', this._value);
    }
    if (this._inputType) {
      this._inputEl.attr('type', this._inputType);
    }
    if (this._inputName) {
      this._inputEl.attr('name', this._inputName);
    }

    this.child(this._inputEl);

    // 处理 loading 状态
    if (this.hasState('loading')) {
      this._showLoadingSpinner();
    }

    // 点击外层容器时聚焦到 input
    this.on('click', () => {
      if (this._inputEl) {
        this._inputEl.focus();
      }
    });
  }

  _showLoadingSpinner() {
    if (!this._loadingSpinner) {
      this._loadingSpinner = span(s => {
        s.styles({
          display: 'inline-block',
          width: '14px',
          height: '14px',
          border: '2px solid currentColor',
          borderBottomColor: 'transparent',
          borderRadius: '50%',
          animation: 'buttonLoadingSpin 0.8s linear infinite',
          marginLeft: '12px',
        });
      });
      this.child(this._loadingSpinner);
    }
    this._loadingSpinner.style('display', 'inline-block');
  }

  _hideLoadingSpinner() {
    if (this._loadingSpinner) {
      this._loadingSpinner.style('display', 'none');
    }
  }

  _registerStateHandlers() {
    // disabled 状态
    this.registerStateHandler('disabled', (enabled, host) => {
      host.clearStateStyles();  // 先清空状态样式

      if (enabled) {
        host.styles({
          opacity: '0.5',
          cursor: 'not-allowed',
          background: 'var(--islands-input-disabled-bg, var(--islands-bg-tertiary, #f5f5f5))',
        });
        if (host._inputEl) {
          host._inputEl.attr('disabled', 'disabled');
        }
      } else {
        host.styles({
          opacity: '1',
          cursor: 'text',
          background: 'var(--islands-input-bg, var(--islands-bg, white))',
        });
        if (host._inputEl) {
          host._inputEl.attr('disabled', null);
        }
      }
    });

    // readonly 状态
    this.registerStateHandler('readonly', (readonly, host) => {
      if (host._inputEl) {
        host._inputEl.attr('readonly', readonly ? 'readonly' : null);
      }
    });

    // error 状态
    this.registerStateHandler('error', (hasError, host) => {
      host.clearStateStyles();  // 先清空状态样式

      if (hasError) {
        host.style('borderColor', 'var(--islands-error, #dc3545)');
        host.style('boxShadow', '0 0 0 2px var(--islands-error-alpha, rgba(220, 53, 69, 0.2))');
      } else {
        host.style('borderColor', '');
        host.style('boxShadow', '');
      }
    });

    // loading 状态
    this.registerStateHandler('loading', (loading, host) => {
      if (loading) {
        host._showLoadingSpinner();
      } else {
        host._hideLoadingSpinner();
      }
    });
  }

  // ============================================
  // 链式方法
  // ============================================

  placeholder(value) {
    if (value === undefined) return this._placeholder;
    this._placeholder = value;
    if (this._inputEl) {
      this._inputEl.attr('placeholder', value);
    }
    return this;
  }

  value(val) {
    if (val === undefined) {
      // 获取值时优先从 DOM 元素获取实时值
      if (this._inputEl && this._inputEl._boundElement) {
        return this._inputEl._boundElement.value;
      }
      return this._inputEl ? this._inputEl.attr('value') : this._value;
    }
    this._value = val;
    if (this._inputEl) {
      this._inputEl.attr('value', val);
    }
    return this;
  }

  type(value) {
    if (value === undefined) return this._inputType;
    this._inputType = value;
    if (this._inputEl) {
      this._inputEl.attr('type', value);
    }
    return this;
  }

  name(value) {
    if (value === undefined) return this._inputName;
    this._inputName = value;
    if (this._inputEl) {
      this._inputEl.attr('name', value);
    }
    return this;
  }

  disabled(value = true) {
    return this.setState('disabled', value);
  }

  readonly(value = true) {
    return this.setState('readonly', value);
  }

  error(value = true) {
    return this.setState('error', value);
  }

  loading(value = true) {
    return this.setState('loading', value);
  }

  size(value) {
    if (value === undefined) return this._size;

    const sizeStyles = {
      large: {
        padding: 'var(--islands-input-padding-lg, 10px 16px)',
        fontSize: 'var(--islands-input-font-size-lg, 16px)',
        height: 'var(--islands-input-height-lg, 40px)',
      },
      default: {
        padding: 'var(--islands-input-padding, 8px 12px)',
        fontSize: 'var(--islands-input-font-size, 14px)',
        height: 'var(--islands-input-height, 32px)',
      },
      small: {
        padding: 'var(--islands-input-padding-sm, 4px 8px)',
        fontSize: 'var(--islands-input-font-size-sm, 12px)',
        height: 'var(--islands-input-height-sm, 24px)',
      },
    };

    this._size = value;
    const styles = sizeStyles[value] || sizeStyles.default;
    this.styles(styles);
    return this;
  }

  // 事件绑定 - 使用统一事件包装器
  onChange(handler) {
    if (this._inputEl) {
      const oldValue = this._value;
      this._inputEl.on('change', (e) => {
        const newValue = this._inputEl._el?.value || this._value;
        handler({ event: e, value: newValue, oldValue, target: this });
      });
    }
    return this;
  }

  onInput(handler) {
    if (this._inputEl) {
      this._inputEl.on('input', (e) => {
        // 同步值到内部 _value
        const value = e.target?.value || this._value;
        this._value = value;
        handler({ event: e, value, target: this });
      });
      // 如果已经渲染过，立即绑定事件到 DOM
      if (this._inputEl._rendered) {
        this._inputEl._applyEventsToEl();
      }
    }
    return this;
  }

  focus() {
    if (this._inputEl) {
      this._inputEl.focus();
    }
    return this;
  }

  blur() {
    if (this._inputEl) {
      this._inputEl.blur();
    }
    return this;
  }
}

function vInput(setup = null) {
  return new VInput(setup);
}

// ============================================
// VSelect 选择框组件
// ============================================

class VSelect extends Tag {
  static _stateAttrs = ['disabled', 'error'];

  constructor(setup = null) {
    super('div', null);
    // this._el 已在 super() 中创建

    this._selectEl = null;
    this._options = [];
    this._value = undefined;
    this._placeholder = undefined;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      error: false,
    });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 创建内部元素（在 setup 之前，确保 setup 时可以绑定事件）
    this._createInternalElements();

    // 7. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.styles({
      display: 'inline-flex',
      alignItems: 'center',
      width: '100%',
      fontSize: 'var(--islands-select-font-size, 14px)',
      borderRadius: 'var(--islands-select-radius, 6px)',
      border: '1px solid var(--islands-select-border, var(--islands-border, #e0e0e0))',
      background: 'var(--islands-select-bg, var(--islands-bg, white))',
      color: 'var(--islands-select-text, var(--islands-text, #333))',
      transition: 'all 0.2s',
      outline: 'none',
      height: 'var(--islands-select-height, 32px)',
      boxSizing: 'border-box',
      cursor: 'pointer',
      position: 'relative',
    });
  }

  _createInternalElements() {
    // 首次创建 select 元素
    if (!this._selectEl) {
      this._selectEl = select(s => {
        s.styles({
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: 'inherit',
          color: 'inherit',
          cursor: 'inherit',
          width: '100%',
          height: '100%',
        });
      });

      this.child(this._selectEl);

      // 绑定 change 事件同步值
      this._selectEl.on('change', (e) => {
        if (e._el) {
          this._value = e._el.value;
        }
      });
    }

    // 更新选项
    this._updateOptions();
  }

  _updateOptions() {
    if (!this._selectEl) return;
    this._updateOptionsWithPlaceholder();
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      host.clearStateStyles();  // 先清空状态样式

      if (enabled) {
        host.styles({
          opacity: '0.5',
          cursor: 'not-allowed',
          background: 'var(--islands-select-disabled-bg, var(--islands-bg-tertiary, #f5f5f5))',
        });
        if (host._selectEl) {
          host._selectEl.attr('disabled', 'disabled');
        }
      } else {
        host.styles({
          opacity: '1',
          cursor: 'pointer',
        });
        if (host._selectEl) {
          host._selectEl.attr('disabled', null);
        }
      }
    });

    this.registerStateHandler('error', (hasError, host) => {
      host.clearStateStyles();  // 先清空状态样式

      if (hasError) {
        host.style('borderColor', 'var(--islands-error, #dc3545)');
        host.style('boxShadow', '0 0 0 2px var(--islands-error-alpha, rgba(220, 53, 69, 0.2))');
      } else {
        host.style('borderColor', '');
        host.style('boxShadow', '');
      }
    });
  }

  // ============================================
  // 链式方法
  // ============================================

  options(opts) {
    if (opts === undefined) return this._options;
    this._options = opts;
    if (this._selectEl) {
      this._updateOptionsWithPlaceholder();
    }
    return this;
  }

  value(val) {
    if (val === undefined) {
      return this._selectEl ? this._selectEl.attr('value') : this._value;
    }
    this._value = val;
    if (this._selectEl) {
      this._selectEl.attr('value', val);
    }
    return this;
  }

  name(value) {
    if (value === undefined) return this._name;
    this._name = value;
    if (this._selectEl) {
      this._selectEl.attr('name', value);
    }
    return this;
  }

  placeholder(value) {
    if (value === undefined) return this._placeholder;
    this._placeholder = value;
    if (this._selectEl) {
      // 对于 select 元素，placeholder 通过添加一个禁用的默认选项实现
      this._updateOptionsWithPlaceholder();
    }
    return this;
  }

  _updateOptionsWithPlaceholder() {
    if (!this._selectEl) return;

    // 清空选项
    this._selectEl.clear();

    // 添加 placeholder 选项（如果设置了）
    if (this._placeholder) {
      const placeholderOpt = option(o => {
        o.text(this._placeholder);
        o.attr('value', '');
        o.attr('disabled', 'disabled');
        o.attr('selected', 'selected');
      });
      this._selectEl.child(placeholderOpt);
    }

    // 添加其他选项
    this._options.forEach(opt => {
      const optEl = option(o => {
        o.attr('value', opt.value);
        o.text(opt.label);
        if (opt.value === this._value) {
          o.attr('selected', 'selected');
        }
      });
      this._selectEl.child(optEl);
    });

    // 同步值到 select 元素
    if (this._value !== undefined) {
      this._selectEl.attr('value', this._value);
    }
  }

  disabled(value = true) {
    return this.setState('disabled', value);
  }

  error(value = true) {
    return this.setState('error', value);
  }

  size(value) {
    const sizeStyles = {
      large: {
        padding: 'var(--islands-select-padding-lg, 10px 16px)',
        fontSize: 'var(--islands-select-font-size-lg, 16px)',
        height: 'var(--islands-select-height-lg, 40px)',
      },
      default: {
        padding: 'var(--islands-select-padding, 8px 12px)',
        fontSize: 'var(--islands-select-font-size, 14px)',
        height: 'var(--islands-select-height, 32px)',
      },
      small: {
        padding: 'var(--islands-select-padding-sm, 4px 8px)',
        fontSize: 'var(--islands-select-font-size-sm, 12px)',
        height: 'var(--islands-select-height-sm, 24px)',
      },
    };

    this._size = value;
    const styles = sizeStyles[value] || sizeStyles.default;
    this.styles(styles);
    return this;
  }

  onChange(handler) {
    if (this._selectEl) {
      const oldValue = this._value;
      this._selectEl.on('change', (e) => {
        const newValue = this._selectEl._el?.value || this._value;
        handler({ event: e, value: newValue, oldValue, target: this });
      });
    }
    return this;
  }
}

function vSelect(setup = null) {
  return new VSelect(setup);
}

// ============================================
// VTextarea 多行文本框组件
// ============================================

class VTextarea extends Tag {
  static _stateAttrs = ['disabled', 'readonly', 'error'];

  constructor(setup = null) {
    super('div', null);

    // 内部 textarea 元素引用
    this._textareaEl = null;
    this._rows = 4;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      readonly: false,
      error: false,
    });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 创建内部元素（在 setup 之前，确保 setup 时可以绑定事件）
    this._updateContent();

    // 7. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.styles({
      display: 'inline-flex',
      width: '100%',
      fontSize: 'var(--islands-textarea-font-size, 14px)',
      borderRadius: 'var(--islands-textarea-radius, 6px)',
      border: '1px solid var(--islands-textarea-border, var(--islands-border, #e0e0e0))',
      background: 'var(--islands-textarea-bg, var(--islands-bg, white))',
      color: 'var(--islands-textarea-text, var(--islands-text, #333))',
      transition: 'all 0.2s',
      outline: 'none',
      boxSizing: 'border-box',
      minHeight: 'var(--islands-textarea-min-height, 80px)',
      cursor: 'text',
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      host.clearStateStyles();  // 先清空状态样式

      if (enabled) {
        host.styles({
          opacity: '0.5',
          cursor: 'not-allowed',
          background: 'var(--islands-textarea-disabled-bg, var(--islands-bg-tertiary, #f5f5f5))',
        });
        if (host._textareaEl) {
          host._textareaEl.attr('disabled', 'disabled');
        }
      } else {
        host.styles({
          opacity: '1',
          cursor: 'text',
        });
        if (host._textareaEl) {
          host._textareaEl.attr('disabled', null);
        }
      }
    });

    this.registerStateHandler('readonly', (readonly, host) => {
      if (host._textareaEl) {
        host._textareaEl.attr('readonly', readonly ? 'readonly' : null);
      }
    });

    this.registerStateHandler('error', (hasError, host) => {
      host.clearStateStyles();  // 先清空状态样式

      if (hasError) {
        host.style('borderColor', 'var(--islands-error, #dc3545)');
        host.style('boxShadow', '0 0 0 2px var(--islands-error-alpha, rgba(220, 53, 69, 0.2))');
      } else {
        host.style('borderColor', '');
        host.style('boxShadow', '');
      }
    });
  }

  _updateContent() {
    // 只在首次创建内部 textarea 元素
    if (this._textareaEl) return;

    this._textareaEl = textarea(t => {
      t.styles({
        flex: 1,
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontSize: 'inherit',
        color: 'inherit',
        resize: 'vertical',
        fontFamily: 'inherit',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: 'var(--islands-textarea-padding, 8px 12px)',
      });
      t.attr('rows', this._rows);

      // 设置初始值（textarea 使用 text 内容）
      if (this._value !== undefined) {
        t.text(this._value);
      }
    });

    if (this._placeholder) {
      this._textareaEl.attr('placeholder', this._placeholder);
    }

    this.child(this._textareaEl);

    // 点击外层容器时聚焦到 textarea
    this.on('click', () => {
      if (this._textareaEl) {
        this._textareaEl.focus();
      }
    });
  }

  // ============================================
  // 链式方法
  // ============================================

  placeholder(value) {
    if (value === undefined) return this._placeholder;
    this._placeholder = value;
    if (this._textareaEl) {
      this._textareaEl.attr('placeholder', value);
    }
    return this;
  }

  value(val) {
    if (val === undefined) {
      // 获取值时从 DOM 元素获取
      if (this._textareaEl && this._textareaEl._boundElement) {
        return this._textareaEl._boundElement.value;
      }
      return this._value;
    }
    this._value = val;
    if (this._textareaEl) {
      // 设置值时同时更新内容和 DOM
      this._textareaEl.text(val);
      if (this._textareaEl._boundElement) {
        this._textareaEl._boundElement.value = val;
      }
    }
    return this;
  }

  rows(value) {
    if (value === undefined) return this._rows;
    this._rows = value;
    if (this._textareaEl) {
      this._textareaEl.attr('rows', value);
    }
    return this;
  }

  name(value) {
    if (value === undefined) return this._name;
    this._name = value;
    if (this._textareaEl) {
      this._textareaEl.attr('name', value);
    }
    return this;
  }

  disabled(value = true) {
    return this.setState('disabled', value);
  }

  readonly(value = true) {
    return this.setState('readonly', value);
  }

  error(value = true) {
    return this.setState('error', value);
  }

  onChange(handler) {
    if (this._textareaEl) {
      const oldValue = this._value;
      this._textareaEl.on('change', (e) => {
        const newValue = this._textareaEl._el?.value || this._value;
        handler({ event: e, value: newValue, oldValue, target: this });
      });
    }
    return this;
  }

  onInput(handler) {
    if (this._textareaEl) {
      this._textareaEl.on('input', (e) => {
        const value = e.target?.value || this._value;
        this._value = value;
        handler({ event: e, value, target: this });
      });
      // 如果已经渲染过，立即绑定事件到 DOM
      if (this._textareaEl._rendered) {
        this._textareaEl._applyEventsToEl();
      }
    }
    return this;
  }
}

function vTextarea(setup = null) {
  return new VTextarea(setup);
}

// ============================================
// VCheckbox 复选框组件
// ============================================

class VCheckbox extends Tag {
  static _stateAttrs = ['disabled', 'checked', 'error'];

  constructor(labelText = '', setup = null) {
    if (typeof labelText === 'function') {
      setup = labelText;
      labelText = '';
    }

    super('label', null);

    // 内部 checkbox 元素引用
    this._checkboxEl = null;
    this._labelText = labelText;
    this._onChange = null;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      checked: false,
      error: false,
    });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 7. 创建内部元素
    this._updateContent();
  }

  _setupBaseStyles() {
    this.styles({
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--islands-gap-sm, 6px)',
      cursor: 'pointer',
      fontSize: 'var(--islands-checkbox-font-size, 14px)',
      color: 'var(--islands-checkbox-text, var(--islands-text, #333))',
      userSelect: 'none',
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      host.clearStateStyles();  // 先清空状态样式

      if (enabled) {
        host.styles({
          opacity: '0.5',
          cursor: 'not-allowed',
        });
        if (host._checkboxEl) {
          host._checkboxEl.attr('disabled', 'disabled');
        }
      } else {
        host.styles({
          opacity: '1',
          cursor: 'pointer',
        });
        if (host._checkboxEl) {
          host._checkboxEl.attr('disabled', null);
        }
      }
    });

    this.registerStateHandler('checked', (checked, host) => {
      if (host._checkboxEl) {
        if (checked) {
          host._checkboxEl.attr('checked', 'checked');
        } else {
          host._checkboxEl.attr('checked', null);
        }
        // 如果 DOM 已渲染，同步到真实元素
        if (host._checkboxEl._boundElement) {
          host._checkboxEl._boundElement.checked = checked;
        }
      }
    });

    this.registerStateHandler('error', (hasError, host) => {
      host.clearStateStyles();  // 先清空状态样式

      if (hasError) {
        host.style('color', 'var(--islands-error, #dc3545)');
      }
    });
  }

  _updateContent() {
    // 只在首次创建内部 checkbox 元素
    if (this._checkboxEl) return;

    this._checkboxEl = input(i => {
      i.attr('type', 'checkbox');
      i.styles({
        width: '16px',
        height: '16px',
        margin: 0,
        cursor: 'inherit',
      });
    });

    // 设置 checked 状态
    if (this.hasState('checked')) {
      this._checkboxEl.attr('checked', 'checked');
    }

    // 点击复选框时切换状态
    this._checkboxEl.on('change', (e) => {
      if (!this.hasState('disabled')) {
        const checked = e._boundElement ? e._boundElement.checked : e.target.checked;
        const oldValue = this.hasState('checked');
        this.setState('checked', checked);
        // 触发 onChange 回调 - 使用统一事件对象格式
        if (this._onChange) {
          this._onChange({ event: e, value: checked, oldValue, target: this });
        }
      }
    });

    this.child(this._checkboxEl);

    // 添加标签文本
    if (this._labelText) {
      this.child(span(s => s.text(this._labelText)));
    }
  }

  // ============================================
  // 链式方法
  // ============================================

  label(value) {
    if (value === undefined) return this._labelText;
    this._labelText = value;
    // 如果 checkbox 元素已创建，更新标签文本
    if (this._checkboxEl) {
      // 查找并更新标签 span
      const labelSpan = this._children.find(c => c._tagName === 'span');
      if (labelSpan) {
        labelSpan.text(value);
      } else {
        // 如果还没有标签，添加一个
        this.child(span(s => s.text(value)));
      }
    }
    return this;
  }

  checked(value = true) {
    return this.setState('checked', value);
  }

  disabled(value = true) {
    return this.setState('disabled', value);
  }

  error(value = true) {
    return this.setState('error', value);
  }

  name(value) {
    if (value === undefined) return this._name;
    this._name = value;
    if (this._checkboxEl) {
      this._checkboxEl.attr('name', value);
    }
    return this;
  }

  value(value) {
    if (value === undefined) return this._value;
    this._value = value;
    if (this._checkboxEl) {
      this._checkboxEl.attr('value', value);
    }
    return this;
  }

  onChange(handler) {
    this._onChange = handler;
    return this;
  }
}

function vCheckbox(labelText = '', setup = null) {
  return new VCheckbox(labelText, setup);
}

// ============================================
// VSwitch 开关组件
// ============================================

class VSwitch extends Tag {
  static _stateAttrs = ['disabled', 'checked'];

  constructor(setup = null) {
    super('div', null);

    // 内部状态
    this._checked = false;
    this._label = null;
    this._wrapper = null;
    this._labelEl = null;
    this._switchEl = null;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      checked: false,
    });

    // 3. 注册状态处理器
    this._registerStateHandlers();

    // 4. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 5. 创建内部结构
    this._createInternalElements();
  }

  _createInternalElements() {
    // 创建滑块
    const knob = span(k => {
      k._isKnob = true;
      k.styles({
        display: 'inline-block',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s',
        transform: this._checked ? 'translateX(22px)' : 'translateX(0)',
      });
    });

    // 创建 switch 按钮容器
    this._switchEl = div(s => {
      s.styles({
        display: 'inline-flex',
        alignItems: 'center',
        width: 'var(--islands-switch-width, 44px)',
        height: 'var(--islands-switch-height, 22px)',
        borderRadius: 'var(--islands-switch-radius, 11px)',
        background: this._checked ? 'var(--islands-primary, #667eea)' : 'var(--islands-switch-bg, var(--islands-border, #e0e0e0))',
        padding: '2px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        boxSizing: 'border-box',
      });
      s.child(knob);
    });

    // 如果有 label，创建 wrapper
    if (this._label) {
      this._wrapper = div(w => {
        w.styles({
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          cursor: this.hasState('disabled') ? 'not-allowed' : 'pointer',
        });
        w.child(this._switchEl);
        w.child(this._labelEl = span(s => {
          s.text(this._label);
          s.styles({
            fontSize: '14px',
            color: 'inherit',
            userSelect: 'none',
          });
        }));
      });
      this.child(this._wrapper);
    } else {
      this.child(this._switchEl);
    }

    // 绑定点击事件
    this._switchEl.on('click', (e) => {
      if (!this.hasState('disabled')) {
        const newChecked = !this._checked;
        const oldValue = this._checked;
        this.setState('checked', newChecked);
        // 触发 onChange 回调 - 使用统一事件对象格式
        if (this._onChangeHandler) {
          this._onChangeHandler({ event: e, value: newChecked, oldValue, target: this });
        }
      }
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      if (host._switchEl) {
        host._switchEl.style('cursor', enabled ? 'not-allowed' : 'pointer');
      }
      if (host._wrapper) {
        host._wrapper.style('cursor', enabled ? 'not-allowed' : 'pointer');
      }
      if (host._labelEl) {
        host._labelEl.style('opacity', enabled ? '0.5' : '1');
      }
    });

    this.registerStateHandler('checked', (checked, host) => {
      host._checked = checked;
      if (host._switchEl) {
        host._switchEl.style('background',
          checked ? 'var(--islands-primary, #667eea)' : 'var(--islands-switch-bg, var(--islands-border, #e0e0e0))');
      }
      // 更新滑块位置
      const knob = host._switchEl?._children?.find(c => c._isKnob);
      if (knob) {
        knob.style('transform', checked ? 'translateX(22px)' : 'translateX(0)');
      }
    });
  }

  _onChangeHandler = null;

  // ============================================
  // 链式方法
  // ============================================

  label(value) {
    if (value === undefined) return this._label;
    this._label = value;
    // 如果已经创建了内部元素，需要更新 label
    if (this._labelEl) {
      this._labelEl.text(value);
    }
    return this;
  }

  checked(value = true) {
    return this.setState('checked', value);
  }

  disabled(value = true) {
    return this.setState('disabled', value);
  }

  size(value) {
    const sizes = {
      large: { width: '56px', height: '28px' },
      default: { width: '44px', height: '22px' },
      small: { width: '32px', height: '16px' },
    };

    const size = sizes[value] || sizes.default;
    this.styles({
      width: `var(--islands-switch-width, ${size.width})`,
      height: `var(--islands-switch-height, ${size.height})`,
    });
    return this;
  }

  onChange(handler) {
    this._onChangeHandler = handler;
    return this;
  }
}

function vSwitch(setup = null) {
  return new VSwitch(setup);
}

// ============================================
// VForm 表单容器组件
// ============================================

class VForm extends Tag {
  constructor(setup = null) {
    super('form', null);

    this._setupBaseStyles();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.styles({
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--islands-form-gap, 16px)',
      width: '100%',
    });
  }

  // ============================================
  // 链式方法
  // ============================================

  gap(value) {
    if (value === undefined) return this.style('gap');
    this.style('gap', value);
    return this;
  }

  action(value) {
    if (value === undefined) return this._action;
    this._action = value;
    this.attr('action', value);
    return this;
  }

  method(value) {
    if (value === undefined) return this._method;
    this._method = value;
    this.attr('method', value);
    return this;
  }

  onSubmit(handler) {
    this.on('submit', (e) => {
      e.preventDefault();
      handler({ event: e, target: this });
    });
    return this;
  }
}

function vForm(setup = null) {
  return new VForm(setup);
}

// ============================================
// Tag 原型扩展
// ============================================

Tag.prototype.vInput = function(setup = null) {
  const input = vInput(setup);
  this.child(input);
  return this;
};

Tag.prototype.vSelect = function(setup = null) {
  const select = vSelect(setup);
  this.child(select);
  return this;
};

Tag.prototype.vTextarea = function(setup = null) {
  const textarea = vTextarea(setup);
  this.child(textarea);
  return this;
};

Tag.prototype.vCheckbox = function(labelText = '', setup = null) {
  const checkbox = vCheckbox(labelText, setup);
  this.child(checkbox);
  return this;
};

Tag.prototype.vSwitch = function(setup = null) {
  const sw = vSwitch(setup);
  this.child(sw);
  return this;
};

Tag.prototype.vForm = function(setup = null) {
  const form = vForm(setup);
  this.child(form);
  return this;
};

// ============================================
// VCheckboxes 复选框组组件
// ============================================

class VCheckboxes extends Tag {
  static _stateAttrs = ['disabled', 'error'];

  constructor(setup = null) {
    super('div', null);

    // 内部复选框列表
    this._checkboxes = [];
    this._options = [];
    this._value = [];  // 多选模式使用数组
    this._singleValue = '';  // 单选模式使用单个值
    this._multiple = false;  // 是否多选
    this._layout = 'column';  // 布局方式：column, row, grid
    this._columns = 2;  // grid 布局时的列数
    this._onChange = null;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      error: false,
    });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 7. 创建内部元素
    this._updateContent();
  }

  _setupBaseStyles() {
    this.styles({
      display: 'flex',
      gap: 'var(--islands-gap, 12px)',
      fontSize: 'var(--islands-checkbox-font-size, 14px)',
      color: 'var(--islands-checkbox-text, var(--islands-text, #333))',
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      host.clearStateStyles();

      if (enabled) {
        host.styles({
          opacity: '0.5',
          cursor: 'not-allowed',
        });
        // 禁用所有复选框
        host._checkboxes.forEach(cb => {
          if (cb._checkboxEl) {
            cb._checkboxEl.attr('disabled', 'disabled');
          }
        });
      } else {
        host.styles({
          opacity: '1',
          cursor: 'pointer',
        });
        // 启用所有复选框
        host._checkboxes.forEach(cb => {
          if (cb._checkboxEl) {
            cb._checkboxEl.attr('disabled', null);
          }
        });
      }
    });

    this.registerStateHandler('error', (hasError, host) => {
      host.clearStateStyles();

      if (hasError) {
        host.style('borderColor', 'var(--islands-error, #dc3545)');
        host.style('boxShadow', '0 0 0 2px var(--islands-error-alpha, rgba(220, 53, 69, 0.2))');
      } else {
        host.style('borderColor', '');
        host.style('boxShadow', '');
      }
    });
  }

  _updateContent() {
    // 清空现有复选框
    this.clear();
    this._checkboxes = [];

    // 根据布局方式设置容器样式
    this._applyLayoutStyles();

    // 创建复选框
    this._options.forEach((opt, index) => {
      const cb = vCheckbox(opt.label, c => {
        c.value(opt.value);
        // 根据模式设置选中状态
        if (this._multiple) {
          c.checked(this._value.includes(opt.value));
        } else {
          c.checked(opt.value === this._singleValue);
        }

        // 禁用状态
        if (this.hasState('disabled')) {
          c.disabled();
        }

        // 变化事件 - 使用统一事件对象格式
        c.onChange((e) => {
          const checked = e.value;
          const oldValue = e.oldValue;
          if (this._multiple) {
            // 多选模式：重新遍历所有 checkboxes 构建值数组
            this._value = this._checkboxes
              .filter(cb => cb.hasState('checked'))
              .map(cb => cb.value());
          } else {
            // 单选模式
            if (checked) {
              this._singleValue = opt.value;
              // 取消其他选项的选中状态
              this._checkboxes.forEach((otherCb, otherIndex) => {
                if (otherIndex !== index) {
                  otherCb.setState('checked', false);
                }
              });
            } else {
              this._singleValue = '';
            }
          }
          // 触发 onChange 回调 - 使用统一事件对象格式
          if (this._onChange) {
            this._onChange({
              event: e.event,
              value: this._multiple ? this._value : this._singleValue,
              oldValue: this._multiple ? this._value : this._singleValue,
              target: this,
            });
          }
        });
      });

      this._checkboxes.push(cb);
      this.child(cb);
    });
  }

  _applyLayoutStyles() {
    const layoutStyles = {
      column: {
        flexDirection: 'column',
        gap: 'var(--islands-gap, 12px)',
      },
      row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 'var(--islands-gap, 12px)',
      },
      grid: {
        display: 'grid',
        gridTemplateColumns: `repeat(${this._columns}, 1fr)`,
        gap: 'var(--islands-gap, 12px)',
      },
    };

    this.styles(layoutStyles[this._layout] || layoutStyles.column);
  }

  // ============================================
  // 链式方法
  // ============================================

  options(arr) {
    if (arr === undefined) return this._options;
    this._options = arr;
    this._updateContent();
    return this;
  }

  value(val) {
    if (val === undefined) {
      return this._multiple ? this._value : this._singleValue;
    }
    if (this._multiple) {
      this._value = Array.isArray(val) ? val : (val ? [val] : []);
      // 更新复选框状态
      this._checkboxes.forEach(cb => {
        cb.setState('checked', this._value.includes(cb.value()));
      });
    } else {
      this._singleValue = val;
      // 更新复选框状态
      this._checkboxes.forEach(cb => {
        cb.setState('checked', cb.value() === val);
      });
    }
    return this;
  }

  multiple(v = true) {
    this._multiple = v;
    if (!this._multiple) {
      // 切换到单选模式时，只保留第一个值
      this._singleValue = this._value[0] || '';
    } else {
      // 切换到多选模式时，转换为数组
      if (this._singleValue) {
        this._value = [this._singleValue];
      }
    }
    return this;
  }

  layout(v) {
    if (v === undefined) return this._layout;
    this._layout = v;
    this._applyLayoutStyles();
    return this;
  }

  columns(v) {
    if (v === undefined) return this._columns;
    this._columns = v;
    if (this._layout === 'grid') {
      this._applyLayoutStyles();
    }
    return this;
  }

  disabled(v = true) {
    return this.setState('disabled', v);
  }

  error(v = true) {
    return this.setState('error', v);
  }

  onChange(handler) {
    this._onChange = handler;
    return this;
  }
}

function vCheckboxes(setup = null) {
  return new VCheckboxes(setup);
}

Tag.prototype.vCheckboxes = function(setup = null) {
  const checkboxes = vCheckboxes(setup);
  this.child(checkboxes);
  return this;
};

// ============================================
// 导出
// ============================================

export {
  VInput, vInput,
  VSelect, vSelect,
  VTextarea, vTextarea,
  VCheckbox, vCheckbox,
  VCheckboxes, vCheckboxes,
  VSwitch, vSwitch,
  VForm, vForm,
  VTimer, vTimer,
  VTimer2, vTimer2,
};

// ============================================
// VTimer 日期选择器组件（日历选择器）
// ============================================

class VTimer extends Tag {
  static _stateAttrs = ['disabled', 'error', 'readonly'];

  constructor(setup = null) {
    super('div', null);

    this._inputEl = null;
    this._type = 'date';  // date, datetime-local, time, month, week
    this._value = '';
    this._onChange = null;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      error: false,
      readonly: false,
    });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 7. 创建内部元素
    this._createInternalElements();
  }

  _setupBaseStyles() {
    this.styles({
      display: 'inline-block',
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      host.clearStateStyles();
      if (enabled) {
        host.styles({ opacity: '0.5', cursor: 'not-allowed', pointerEvents: 'none' });
        if (host._inputEl) host._inputEl.attr('disabled', 'disabled');
      } else {
        host.styles({ opacity: '1', cursor: 'pointer' });
        if (host._inputEl) host._inputEl.attr('disabled', null);
      }
    });

    this.registerStateHandler('error', (hasError, host) => {
      host.clearStateStyles();
      if (hasError) {
        host.style('borderColor', 'var(--islands-error, #dc3545)');
        host.style('boxShadow', '0 0 0 2px var(--islands-error-alpha, rgba(220, 53, 69, 0.2))');
      } else {
        host.style('borderColor', '');
        host.style('boxShadow', '');
      }
    });

    this.registerStateHandler('readonly', (readonly, host) => {
      if (host._inputEl) {
        if (readonly) {
          host._inputEl.attr('readonly', 'readonly');
        } else {
          host._inputEl.attr('readonly', null);
        }
      }
    });
  }

  _createInternalElements() {
    this._inputEl = input(i => {
      i.attr('type', this._type);
      i.styles({
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--islands-border, #d1d5db)',
        background: 'white',
        fontSize: '14px',
        color: 'var(--islands-text, #333)',
        outline: 'none',
        cursor: 'pointer',
      });
      if (this._value) i.value(this._value);
      i.on('change', () => this._onValueChange());
      i.on('input', () => this._onValueChange());
    });

    this.child(this._inputEl);
  }

  _onValueChange() {
    const oldValue = this._value;
    this._value = this._inputEl && this._inputEl._boundElement ? this._inputEl._boundElement.value : '';
    if (this._onChange) {
      this._onChange({
        event: new Event('change'),
        value: this._value,
        oldValue,
        target: this,
      });
    }
  }

  // ============================================
  // 链式方法
  // ============================================

  type(t) {
    if (t === undefined) return this._type;
    this._type = t;
    if (this._inputEl) {
      this._inputEl.attr('type', t);
    }
    return this;
  }

  value(val) {
    if (val === undefined) return this._value;
    this._value = val;
    if (this._inputEl) {
      this._inputEl.value(val);
    }
    return this;
  }

  disabled(v = true) {
    return this.setState('disabled', v);
  }

  error(v = true) {
    return this.setState('error', v);
  }

  readonly(v = true) {
    return this.setState('readonly', v);
  }

  min(val) {
    if (this._inputEl) {
      this._inputEl.attr('min', val);
    }
    return this;
  }

  max(val) {
    if (this._inputEl) {
      this._inputEl.attr('max', val);
    }
    return this;
  }

  step(val) {
    if (this._inputEl) {
      this._inputEl.attr('step', val);
    }
    return this;
  }

  placeholder(val) {
    if (this._inputEl) {
      this._inputEl.attr('placeholder', val);
    }
    return this;
  }

  onChange(handler) {
    this._onChange = handler;
    return this;
  }
}

function vTimer(setup = null) {
  return new VTimer(setup);
}

// ============================================
// VTimer2 日期范围选择器组件
// ============================================

class VTimer2 extends Tag {
  static _stateAttrs = ['disabled', 'error', 'readonly'];

  constructor(setup = null) {
    super('div', null);

    this._startInputEl = null;
    this._endInputEl = null;
    this._type = 'date';
    this._value = { start: '', end: '' };
    this._onChange = null;
    this._startMin = null;
    this._startMax = null;
    this._endMin = null;
    this._endMax = null;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
      error: false,
      readonly: false,
    });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }

    // 7. 创建内部元素
    this._createInternalElements();
  }

  _setupBaseStyles() {
    this.styles({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('disabled', (enabled, host) => {
      host.clearStateStyles();
      if (enabled) {
        host.styles({ opacity: '0.5', cursor: 'not-allowed', pointerEvents: 'none' });
        if (host._startInputEl) host._startInputEl.attr('disabled', 'disabled');
        if (host._endInputEl) host._endInputEl.attr('disabled', 'disabled');
      } else {
        host.styles({ opacity: '1', cursor: 'pointer' });
        if (host._startInputEl) host._startInputEl.attr('disabled', null);
        if (host._endInputEl) host._endInputEl.attr('disabled', null);
      }
    });

    this.registerStateHandler('error', (hasError, host) => {
      host.clearStateStyles();
      if (hasError) {
        host.style('borderColor', 'var(--islands-error, #dc3545)');
        host.style('boxShadow', '0 0 0 2px var(--islands-error-alpha, rgba(220, 53, 69, 0.2))');
      } else {
        host.style('borderColor', '');
        host.style('boxShadow', '');
      }
    });

    this.registerStateHandler('readonly', (readonly, host) => {
      if (host._startInputEl) {
        host._startInputEl.attr('readonly', readonly ? 'readonly' : null);
      }
      if (host._endInputEl) {
        host._endInputEl.attr('readonly', readonly ? 'readonly' : null);
      }
    });
  }

  _createInternalElements() {
    // 开始时间输入
    this._startInputEl = input(i => {
      i.attr('type', this._type);
      i.attr('placeholder', '开始日期');
      i.styles({
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--islands-border, #d1d5db)',
        background: 'white',
        fontSize: '14px',
        color: 'var(--islands-text, #333)',
        outline: 'none',
        cursor: 'pointer',
      });
      if (this._value.start) i.value(this._value.start);
      i.on('change', () => this._onValueChange());
      i.on('input', () => this._onValueChange());
    });

    // 分隔符
    const separator = span(s => {
      s.text('至');
      s.styles({ color: '#999', fontSize: '14px' });
    });

    // 结束时间输入
    this._endInputEl = input(i => {
      i.attr('type', this._type);
      i.attr('placeholder', '结束日期');
      i.styles({
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--islands-border, #d1d5db)',
        background: 'white',
        fontSize: '14px',
        color: 'var(--islands-text, #333)',
        outline: 'none',
        cursor: 'pointer',
      });
      if (this._value.end) i.value(this._value.end);
      i.on('change', () => this._onValueChange());
      i.on('input', () => this._onValueChange());
    });

    this.child(this._startInputEl);
    this.child(separator);
    this.child(this._endInputEl);
  }

  _onValueChange() {
    const oldValue = { ...this._value };
    const start = this._startInputEl && this._startInputEl._boundElement ? this._startInputEl._boundElement.value : '';
    const end = this._endInputEl && this._endInputEl._boundElement ? this._endInputEl._boundElement.value : '';

    // 确保开始时间不晚于结束时间
    if (start && end && start > end) {
      // 如果开始时间晚于结束时间，将结束时间设置为开始时间
      this._endInputEl._boundElement.value = start;
      this._value = { start, end: start };
    } else {
      this._value = { start, end };
    }

    // 动态更新结束时间的最小值为开始时间
    if (start && this._endInputEl) {
      this._endInputEl.attr('min', start);
    }

    // 动态更新开始时间的最大值为结束时间
    if (end && this._startInputEl) {
      this._startInputEl.attr('max', end);
    }

    if (this._onChange) {
      this._onChange({
        event: new Event('change'),
        value: this._value,
        oldValue,
        target: this,
      });
    }
  }

  // ============================================
  // 链式方法
  // ============================================

  type(t) {
    if (t === undefined) return this._type;
    this._type = t;
    if (this._startInputEl) {
      this._startInputEl.attr('type', t);
    }
    if (this._endInputEl) {
      this._endInputEl.attr('type', t);
    }
    return this;
  }

  value(val) {
    if (val === undefined) return this._value;
    if (val.start !== undefined) {
      this._value.start = val.start;
      if (this._startInputEl) {
        this._startInputEl.value(val.start);
      }
    }
    if (val.end !== undefined) {
      this._value.end = val.end;
      if (this._endInputEl) {
        this._endInputEl.value(val.end);
      }
    }
    return this;
  }

  disabled(v = true) {
    return this.setState('disabled', v);
  }

  error(v = true) {
    return this.setState('error', v);
  }

  readonly(v = true) {
    return this.setState('readonly', v);
  }

  min(val) {
    if (val === undefined) return { start: this._startMin, end: this._endMin };
    this._startMin = val;
    this._endMin = val;
    if (this._startInputEl) {
      this._startInputEl.attr('min', val);
    }
    if (this._endInputEl) {
      this._endInputEl.attr('min', val);
    }
    return this;
  }

  max(val) {
    if (val === undefined) return { start: this._startMax, end: this._endMax };
    this._startMax = val;
    this._endMax = val;
    if (this._startInputEl) {
      this._startInputEl.attr('max', val);
    }
    if (this._endInputEl) {
      this._endInputEl.attr('max', val);
    }
    return this;
  }

  startMin(val) {
    if (val === undefined) return this._startMin;
    this._startMin = val;
    if (this._startInputEl) {
      this._startInputEl.attr('min', val);
    }
    return this;
  }

  startMax(val) {
    if (val === undefined) return this._startMax;
    this._startMax = val;
    if (this._startInputEl) {
      this._startInputEl.attr('max', val);
    }
    return this;
  }

  endMin(val) {
    if (val === undefined) return this._endMin;
    this._endMin = val;
    if (this._endInputEl) {
      this._endInputEl.attr('min', val);
    }
    return this;
  }

  endMax(val) {
    if (val === undefined) return this._endMax;
    this._endMax = val;
    if (this._endInputEl) {
      this._endInputEl.attr('max', val);
    }
    return this;
  }

  onChange(handler) {
    this._onChange = handler;
    return this;
  }
}

function vTimer2(setup = null) {
  return new VTimer2(setup);
}

Tag.prototype.vTimer = function(setup = null) {
  const timer = vTimer(setup);
  this.child(timer);
  return this;
};

Tag.prototype.vTimer2 = function(setup = null) {
  const timer2 = vTimer2(setup);
  this.child(timer2);
  return this;
};
