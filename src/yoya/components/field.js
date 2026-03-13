/**
 * Yoya.Components - Field
 * 可编辑字段组件，支持显示和编辑模式切换
 */

import { Tag, div, span, button } from '../core/basic.js';

// ============================================
// VField 可编辑字段组件
// ============================================

class VField extends Tag {
  static _stateAttrs = ['editing', 'disabled', 'loading', 'hovered'];

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
      hovered: false,
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
      gap: 'var(--yoya-field-gap, 6px)',
      padding: '0',
      minWidth: 'var(--yoya-field-min-width, 80px)',
      minHeight: 'var(--yoya-field-min-height, 32px)',
      position: 'relative',
      boxSizing: 'border-box',
      cursor: 'pointer',
      fontSize: 'var(--yoya-field-font-size, 14px)',
      color: 'var(--yoya-field-text-color, var(--yoya-text, #333))',
    });
  }

  _registerStateHandlers() {
    this.registerStateHandler('editing', (editing, host) => {
      if (editing) {
        host._showContainer && host._showContainer.style('display', 'none');
        host._editContainer && host._editContainer.style('display', 'flex');
        // 进入编辑状态时重置 hover 状态
        host.setState('hovered', false);
        if (host._onEdit) host._onEdit({ value: host._value, target: host });
      } else {
        host._showContainer && host._showContainer.style('display', 'flex');
        host._editContainer && host._editContainer.style('display', 'none');
      }
    });

    this.registerStateHandler('hovered', (hovered, host) => {
      if (hovered && !host.hasState('disabled') && !host.hasState('editing')) {
        host._editIcon && host._editIcon.style('opacity', '1');
      } else {
        host._editIcon && host._editIcon.style('opacity', '0');
      }
    });

    this.registerStateHandler('disabled', (disabled, host) => {
      host.clearStateStyles();
      if (disabled) {
        host.styles({
          opacity: 'var(--yoya-field-disabled-opacity, 0.5)',
          cursor: 'var(--yoya-field-disabled-cursor, not-allowed)',
          pointerEvents: 'none',
        });
      } else {
        host.styles({
          opacity: '1',
          cursor: 'pointer',
          pointerEvents: 'auto',
        });
      }
    });

    this.registerStateHandler('loading', (loading, host) => {
      host.clearStateStyles();
      host.style('pointerEvents', loading ? 'none' : 'auto');
      host.style('opacity', loading ? 'var(--yoya-field-loading-opacity, 0.7)' : '1');
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
        fontSize: 'inherit',
        color: 'inherit',
      });
    });
  }
  _buildEditIcon(){
    // 编辑图标
    this._editIcon = span(e => {
      e.styles({
        fontSize: 'var(--yoya-field-edit-icon-size, 14px)',
        color: 'var(--yoya-field-edit-icon-color, #999)',
        opacity: '0',
        transition: 'opacity 0.2s',
        marginLeft: 'var(--yoya-field-edit-icon-margin, 4px)',
        cursor: 'pointer',
      });
      e.html('📝');
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
        gap: 'var(--yoya-field-show-gap, 4px)',
        height: 'var(--yoya-field-show-height, 32px)',
        padding: 'var(--yoya-field-show-padding, 8px 12px)',
        borderRadius: 'var(--yoya-field-radius, 6px)',
        border: 'var(--yoya-field-show-border, 1px solid transparent)',
        background: 'var(--yoya-field-show-bg, transparent)',
        boxSizing: 'border-box',
        transition: 'background-color 0.2s, border-color 0.2s',
      });

      // hover 显示图标
      // 绑定事件处理函数
      this._boundHandleMouseEnter = () => {
        this.setState('hovered', true);
      };

      this._boundHandleMouseLeave = () => {
        this.setState('hovered', false);
      }

      // hover 显示图标
      s.on('mouseenter', this._boundHandleMouseEnter);
      s.on('mouseleave', this._boundHandleMouseLeave);
      // 点击/双击进入编辑
      // 绑定点击事件处理函数
      this._boundHandleClick = () => {
        if (!this.hasState('disabled') && !this.hasState('editing') && this._editable) {
          this.setState('editing', true);
        }
      };

      this._boundHandleDoubleClick = () => {
        if (!this.hasState('disabled') && !this.hasState('editing') && this._editable) {
          this.setState('editing', true);
        }
      };

      // 点击/双击进入编辑
      s.on('dblclick', this._boundHandleDoubleClick);
    })
    this._showContainer.child(this._showEl)
    this._showContainer.child(this._editIcon);
  }
  _buildEditEl(){
    // 编辑内容
    this._editEl = div(c => {
      c.styles({
        flex: 1,
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        fontSize: 'inherit',
        color: 'inherit',
      });
    });
  }
  _buildBtnContainer(){
    let that = this;
    this._btnContainer = div(a => {
      a.styles({
        display: 'flex',
        gap: 'var(--yoya-field-btn-gap, 4px)',
      });
      a.child(button(save => {
        save.styles({
          minWidth: 'var(--yoya-field-btn-size, 24px)',
          height: 'var(--yoya-field-btn-size, 24px)',
          padding: 'var(--yoya-field-btn-padding, 0 6px)',
          border: 'var(--yoya-field-save-border, 1px solid #28a745)',
          borderRadius: 'var(--yoya-field-btn-radius, 4px)',
          background: 'var(--yoya-field-save-bg, #28a745)',
          color: 'var(--yoya-field-save-color, white)',
          fontSize: 'var(--yoya-field-btn-font-size, 11px)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        });
        save.text('✓');
        save.on('mouseenter', () => {
          save.styles({
            background: 'var(--yoya-field-save-hover-bg, #218838)',
          });
        });
        save.on('click', (ev) => { ev.stopPropagation(); that._handleSave(); });
      }));
      a.child(button(cancel => {
        cancel.styles({
          minWidth: 'var(--yoya-field-btn-size, 24px)',
          height: 'var(--yoya-field-btn-size, 24px)',
          padding: 'var(--yoya-field-btn-padding, 0 6px)',
          border: 'var(--yoya-field-cancel-border, 1px solid #e0e0e0)',
          borderRadius: 'var(--yoya-field-btn-radius, 4px)',
          background: 'var(--yoya-field-cancel-bg, white)',
          color: 'var(--yoya-field-cancel-color, #666)',
          fontSize: 'var(--yoya-field-btn-font-size, 11px)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        });
        cancel.text('✕');
        cancel.on('mouseenter', () => {
          cancel.styles({
            background: 'var(--yoya-field-cancel-hover-bg, #f5f5f5)',
          });
        });
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
        gap: 'var(--yoya-field-edit-gap, 6px)',
        width: '100%',
        boxSizing: 'border-box',
        padding: 'var(--yoya-field-edit-padding, 4px)',
        background: 'var(--yoya-field-edit-bg, white)',
        borderRadius: 'var(--yoya-field-radius, 6px)',
        border: 'var(--yoya-field-edit-border, 1px solid var(--yoya-border, #e0e0e0))',
        boxShadow: 'var(--yoya-field-edit-shadow, 0 2px 8px rgba(0,0,0,0.1))',
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

    const setValueFn = (value) => {
      this._editValue = value;
      // 判断当前状态：
      // - 显示状态（!editing）：说明有异步保存动作没执行完，执行保存动作
      // - 编辑状态（editing）：说明修改动作还没执行完，不执行保存动作
      // 注意：在自动保存模式下，用户输入时处于编辑状态，不应触发保存
      // 只有当从显示状态进入时（如异步保存场景中），才需要执行保存
      if (!this.hasState('editing')) {
        // 当前是显示状态，执行保存
        if (this._autoSave) this._handleSave();
      }
      // 编辑状态下不执行保存，等待用户确认或失去焦点
    };

    if (typeof this._editContentFn === 'function') {
      this._editContentFn(this._editEl, setValueFn, this);
    }
  }

  // ============================================
  // 保存/取消
  // ============================================

  _handleSave() {
    this._doSave();
  }
  _doSave(){
    // 验证 _editValue 是否为有效值（不是组件实例）
    if (this._editValue !== undefined && this._editValue !== null) {
      // 如果 _editValue 是对象且有 value 方法，则可能是组件实例
      if (typeof this._editValue === 'object' && this._editValue !== null && typeof this._editValue.value === 'function') {
        console.warn('VField: _editValue appears to be a component instance, extracting value');
        this._editValue = this._editValue.value();
      }
    }

    const newValue = this._editValue !== undefined ? this._editValue : this._value;
    const oldValue = this._value;

    if (this._onSave) {
      const result = this._onSave({ value: newValue, oldValue, target: this });
      if (result && result.then) {
        // 异步保存：立即退出编辑状态（进入显示状态），但保持 loading
        // 这样 setValueFn 可以判断：显示状态=有异步保存没执行完，编辑状态=用户还在编辑
        this.setState('loading', true);
        this.setState('editing', false);
        result.then(() => {
          this.setState('loading', false);
          this._value = newValue;
          this._updateShowContent();
          if (this._onChange) this._onChange({ value: newValue, oldValue, target: this });
        }).catch(() => {
          this.setState('loading', false);
          // 保存失败时重新进入编辑状态
          this.setState('editing', true);
        });
      } else {
        this._value = newValue;
        this.setState('editing', false);
        this._updateShowContent();
        if (this._onChange) this._onChange({ value: newValue, oldValue, target: this });
      }
    } else {
      this._value = newValue;
      this.setState('editing', false);
      this._updateShowContent();
      if (this._onChange) this._onChange({ value: newValue, oldValue, target: this });
    }
  }

  _handleCancel() {
    this.setState('editing', false);
  }

  _setupGlobalClickHandler() {
    if (typeof document !== 'undefined' && !this._globalClickHandlerSetup) {
      this._globalClickHandlerSetup = true;
      // 绑定全局点击事件处理函数
      this._boundHandleGlobalClick = (e) => {
        if (this.hasState('editing') && !this._el.contains(e.target)) {
          if (this._autoSave) this._handleSave();
          else this._handleCancel();
        }
      };
      document.addEventListener('click', this._boundHandleGlobalClick);
    }
  }

  // ============================================
  // 链式方法
  // ============================================

  getValue() {
    return this._value;
  }

  setValue(value) {
    let validatedValue = value;
    if (value !== undefined && value !== null) {
      if (typeof value === 'object' && value !== null && typeof value.value === 'function') {
        console.warn('VField.setValue: value appears to be a component instance, extracting value');
        validatedValue = value.value();
      }
    }

    if (this.hasState('editing')) {
      this._editValue = validatedValue;
      this._value = validatedValue;
      this._updateShowContent();
      if (this._autoSave) this._handleSave();
    } else {
      this._value = validatedValue;
      this._updateShowContent();
    }
    return this;
  }

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

  value(val) {
    if (val === undefined) return this.getValue();
    return this.setValue(val);
  }

  autoSave(v) {
    if (v === undefined) return this._autoSave;
    this._autoSave = v;
    return this;
  }

  placeholder(v) {
    if (v === undefined) return this._placeholder;
    this._placeholder = v;
    return this;
  }

  editable(v) {
    if (v === undefined) return this._editable;
    this._editable = v;
    return this;
  }

  onEdit(fn) {
    if (fn === undefined) return this._onEdit;
    this._onEdit = fn;
    return this;
  }

  onSave(fn) {
    if (fn === undefined) return this._onSave;
    this._onSave = fn;
    return this;
  }

  onChange(fn) {
    if (fn === undefined) return this._onChange;
    this._onChange = fn;
    return this;
  }

  disabled(v = true) {
    return this.setState('disabled', v);
  }

  loading(v = true) {
    return this.setState('loading', v);
  }

  editing(v) {
    if (v === undefined) return this.hasState('editing');
    return this.setState('editing', v);
  }

  destroy() {
    // 移除全局点击事件监听器
    if (this._globalClickHandlerSetup) {
      document.removeEventListener('click', this._boundHandleGlobalClick);
      this._globalClickHandlerSetup = false;
    }
    
    // 移除事件监听器引用
    this._boundHandleMouseEnter = null;
    this._boundHandleMouseLeave = null;
    this._boundHandleClick = null;
    this._boundHandleDoubleClick = null;
    this._boundHandleGlobalClick = null;
    
    // 调用父类的destroy方法
    super.destroy();
  }
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
