/**
 * Yoya.Components - Field
 * 可编辑字段组件，支持显示和编辑模式切换
 */

import { Tag, div, span, button } from '../core/basic.js';

// ============================================
// VField 可编辑字段组件
// ============================================

class VField extends Tag {
  static _stateAttrs = ['editing', 'disabled', 'loading'];

  constructor(setup = null) {
    super('div', null);

    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 内容定义
    this._showContentFn = null;
    this._editContentFn = null;

    // 回调
    this._onSave = null;
    this._onChange = null;
    this._onEdit = null;

    // 配置
    this._placeholder = '点击编辑';
    this._autoSave = false;
    this._editable = true;

    // 状态
    this._value = undefined;
    this._editValue = undefined;

    // 1. 初始化状态
    this.initializeStates({
      editing: false,
      disabled: false,
      loading: false,
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

    // 6. 构建内容（setup 后才执行）
    this._buildContent();

    // 7. 设置全局点击事件
    this._setupGlobalClickHandler();
  }

  _setupBaseStyles() {
    this.styles({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '0',
      minWidth: '80px',
      minHeight: '32px',
      position: 'relative',
      boxSizing: 'border-box',
      cursor: 'pointer',
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('editing', (editing, host) => {
      if (editing) {
        host._showContainer && host._showContainer.style('display', 'none');
        host._editContainer && host._editContainer.style('display', 'flex');
        if (host._onEdit) host._onEdit(host._value, host);
      } else {
        host._showContainer && host._showContainer.style('display', 'flex');
        host._editContainer && host._editContainer.style('display', 'none');
      }
    });

    this.registerStateHandler('disabled', (disabled, host) => {
      host.clearStateStyles();
      if (disabled) {
        host.styles({ opacity: '0.5', cursor: 'not-allowed', pointerEvents: 'none' });
      } else {
        host.styles({ opacity: '1', cursor: 'pointer', pointerEvents: 'auto' });
      }
    });

    this.registerStateHandler('loading', (loading, host) => {
      host.clearStateStyles();
      host.style('pointerEvents', loading ? 'none' : 'auto');
    });
  }

  // ============================================
  // 构建内容（只调用一次）
  // ============================================
  _buildShowEl(){
    // 内容
    this._showEl = div(c => {
      c.styles({
        flex: 1,
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        fontSize: '14px',
      });
    });
  }
  _buildEditIcon(){
    // 编辑图标
    this._editIcon = span(e => {
      e.styles({
        fontSize: '12px',
        color: '#999',
        opacity: '0',
        transition: 'opacity 0.2s',
        marginLeft: '6px',
        cursor: 'pointer',
      });
      e.html('✏️');
      e.on('click', (ev) => {
        ev.stopPropagation();
        if (this._editable) this.setState('editing', true);
      });
    });
  }
  _buildShowContainer(){
    this._buildShowEl()
    this._buildEditIcon()
    this._showContainer = div(s => {
      s.styles({
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        height: '32px',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid transparent',
        background: 'transparent',
        boxSizing: 'border-box',
      });

      // hover 显示图标
      s.on('mouseenter', () => {
        if (!this.hasState('disabled') && !this.hasState('editing')) {
          this._editIcon.style('opacity', '0.7');
        }
      });
      s.on('mouseleave', () => {
        if (!this.hasState('editing')) {
          this._editIcon.style('opacity', '0');
        }
      });
      // 点击/双击进入编辑
      s.on('click', () => {
        if (!this.hasState('disabled') && !this.hasState('editing') && this._editable) {
          this.setState('editing', true);
        }
      });
      s.on('dblclick', () => {
        if (!this.hasState('disabled') && !this.hasState('editing') && this._editable) {
          this.setState('editing', true);
        }
      });
    })
    this._showContainer.child(this._showEl)
    this._showContainer.child(this._editIcon);;
  }
  _buildEditEl(){
    // 编辑内容
    this._editEl = div(c => {
      c.styles({
        flex: 1,
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
      });
    });
  }
  _buildBtnContainer(){
    let that = this;
    this._btnContainer = div(a => {
      a.styles({ display: 'flex', gap: '4px' });
      a.child(button(save => {
        save.styles({
          minWidth: '24px', height: '24px', padding: '0 6px',
          border: '1px solid #28a745', borderRadius: '4px',
          background: '#28a745', color: 'white',
          fontSize: '11px', cursor: 'pointer',
        });
        save.text('✓');
        save.on('click', (ev) => { ev.stopPropagation(); that._handleSave(); });
      }));
      a.child(button(cancel => {
        cancel.styles({
          minWidth: '24px', height: '24px', padding: '0 6px',
          border: '1px solid #e0e0e0', borderRadius: '4px',
          background: 'white', color: '#666',
          fontSize: '11px', cursor: 'pointer',
        });
        cancel.text('✕');
        cancel.on('click', (ev) => { ev.stopPropagation(); that._handleCancel(); });
      }));
    });
  }
  _buildEditContainer(){
    this._buildEditEl()
    this._buildBtnContainer()
    this._editContainer = div(e => {
      e.styles({
        display: 'none',
        alignItems: 'center',
        gap: '6px',
        width: '100%',
        boxSizing: 'border-box',
      });
      e.child(this._editEl);
      // 按钮（手动保存模式）
      e.child(this._btnContainer);
      e.on('click', (ev) => ev.stopPropagation());
    });
  }
  _buildContent() {
    // 创建显示容器
    this._buildShowContainer()
    this.child(this._showContainer);
    // 创建编辑容器
    this._buildEditContainer()
    this.child(this._editContainer);

    // 更新内容
    this._updateShowContent();
    this._updateEditContent();

    // 更新按钮显示
    if (this._btnContainer) {
      this._btnContainer.style('display', this._autoSave ? 'none' : 'flex');
    }
  }

  _updateShowContent() {
    if (!this._showEl) return;
    this._showEl.clear();
    const displayValue = this._value;
    if (typeof this._showContentFn === 'function') {
      this._showContentFn(this._showEl, displayValue, this);
    } else if (typeof this._showContentFn === 'string') {
      this._showEl.text(this._showContentFn);
    } else {
      this._showEl.styles({ color: '#999', fontStyle: 'italic' });
      this._showEl.text(this._placeholder);
    }
  }

  _updateEditContent() {
    if (!this._editEl) return;
    this._editEl.clear();

    const setValue = (value) => {
      this._editValue = value;
      if (this._autoSave) this._handleSave();
    };

    if (typeof this._editContentFn === 'function') {
      this._editContentFn(this._editEl, setValue, this);
    }
  }

  // ============================================
  // 保存/取消
  // ============================================

  _handleSave() {
    const newValue = this._editValue !== undefined ? this._editValue : this._value;
    const oldValue = this._value;

    if (this._onSave) {
      const result = this._onSave(newValue, oldValue, this);
      if (result && result.then) {
        this.setState('loading', true);
        result.then(() => {
          this.setState('loading', false);
          this._value = newValue;
          this.setState('editing', false);
          this._updateShowContent();
          if (this._onChange) this._onChange(newValue, oldValue, this);
        }).catch(() => this.setState('loading', false));
      } else {
        this._value = newValue;
        this.setState('editing', false);
        this._updateShowContent();
        if (this._onChange) this._onChange(newValue, oldValue, this);
      }
    } else {
      this._value = newValue;
      this.setState('editing', false);
      this._updateShowContent();
      if (this._onChange) this._onChange(newValue, oldValue, this);
    }
  }

  _handleCancel() {
    this.setState('editing', false);
  }

  _setupGlobalClickHandler() {
    if (typeof document !== 'undefined' && !this._globalClickHandlerSetup) {
      this._globalClickHandlerSetup = true;
      document.addEventListener('click', (e) => {
        if (this.hasState('editing') && !this._el.contains(e.target)) {
          if (this._autoSave) this._handleSave();
          else this._handleCancel();
        }
      });
    }
  }

  // ============================================
  // API
  // ============================================

  showContent(fn) {
    if (fn === undefined) return this._showContentFn;
    this._showContentFn = fn;
    if (!this.hasState('editing')) this._updateShowContent();
    return this;
  }

  editContent(fn) {
    if (fn === undefined) return this._editContentFn;
    this._editContentFn = fn;
    if (this.hasState('editing')) this._updateEditContent();
    return this;
  }

  getValue() { return this._value; }

  setValue(value) {
    if (this.hasState('editing')) {
      this._editValue = value;
      if (this._autoSave) this._handleSave();
    } else {
      this._value = value;
      this._updateShowContent();
    }
    return this;
  }

  autoSave(v = true) { this._autoSave = v; return this; }
  placeholder(v) { if (v === undefined) return this._placeholder; this._placeholder = v; return this; }
  editable(v = true) { this._editable = v; return this; }
  onEdit(fn) { this._onEdit = fn; return this; }
  onSave(fn) { this._onSave = fn; return this; }
  onChange(fn) { this._onChange = fn; return this; }

  disabled(v = true) { return this.setState('disabled', v); }
  loading(v = true) { return this.setState('loading', v); }
  editing(v = true) { return this.setState('editing', v); }
}

function vField(setup = null) {
  return new VField(setup);
}

Tag.prototype.vField = function(setup = null) {
  const field = vField(setup);
  this.child(field);
  return this;
};

export { VField, vField };
