/**
 * Yoya.Basic - Switchers 分段控制器组件
 * 用于在一组互斥选项中选择一个，类似 segmented control / radio group 的横向按钮样式
 * @module Yoya.Switchers
 * @example
 * // 基础用法
 * import { vSwitchers } from '../yoya/index.js';
 *
 * vSwitchers(s => {
 *   s.options([
 *     { value: 'day', label: '日' },
 *     { value: 'week', label: '周' },
 *     { value: 'month', label: '月' },
 *   ]);
 *   s.value('week');
 *   s.onChange((value) => {
 *     console.log('选中：', value);
 *   });
 * });
 *
 * // 自定义尺寸
 * vSwitchers(s => {
 *   s.options(['小', '中', '大']);
 *   s.size('small'); // 'small' | 'medium' | 'large'
 * });
 *
 * // 带禁用项
 * vSwitchers(s => {
 *   s.options([
 *     { value: 'opt1', label: '选项 1' },
 *     { value: 'opt2', label: '选项 2', disabled: true },
 *     { value: 'opt3', label: '选项 3' },
 *   ]);
 *   s.value('opt1');
 * });
 */

import { Tag, div, span } from '../core/basic.js';

// ============================================
// VSwitchers 分段控制器
// ============================================

/**
 * VSwitchers 分段控制器
 * 支持单选、多选、禁用项、尺寸调整等
 * @class
 * @extends Tag
 */
class VSwitchers extends Tag {
  static _stateAttrs = ['disabled'];

  /**
   * 创建 VSwitchers 实例
   * @param {Function} [setup=null] - 初始化函数
   */
  constructor(setup = null) {
    super('div', null);

    // 内部引用
    this._items = [];
    this._selectedValue = null;
    this._selectedValues = []; // 多选模式
    this._options = [];
    this._multiple = false;
    this._onChange = null;
    this._size = 'medium';

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      disabled: false,
    });

    // 3. 设置基础 CSS 类
    this.addClass('yoya-switchers');

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  /**
   * 注册状态处理器
   * @private
   */
  _registerStateHandlers() {
    // disabled 状态
    this.registerStateHandler('disabled', (enabled, host) => {
      if (enabled) {
        host.addClass('yoya-switchers--disabled');
      } else {
        host.removeClass('yoya-switchers--disabled');
      }
      // 同步更新所有选项的禁用状态
      host._updateAllItemsDisabled();
    });
  }

  /**
   * 同步更新所有选项的禁用状态
   * @private
   */
  _updateAllItemsDisabled() {
    const isDisabled = this.hasState('disabled');
    this._items.forEach((item, index) => {
      const option = this._options[index];
      if (option && !option.disabled) {
        // 选项本身不禁用，但容器禁用
        if (isDisabled) {
          item.addClass('yoya-switchers__item--disabled');
        } else {
          item.removeClass('yoya-switchers__item--disabled');
        }
      }
    });
  }

  /**
   * 设置选项
   * @param {Array} options - 选项数组（支持字符串或对象 {value, label, disabled}）
   * @returns {this}
   */
  options(options) {
    if (options === undefined) return this._options;

    this._options = options.map(opt => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt, disabled: false };
      }
      return {
        value: opt.value || opt.label || '',
        label: opt.label || opt.value || '',
        disabled: opt.disabled || false,
      };
    });

    this._renderItems();
    return this;
  }

  /**
   * 渲染选项项
   * @private
   */
  _renderItems() {
    // 清空现有项
    this._items = [];
    this.clear();

    this._options.forEach((option, index) => {
      const item = this._createItem(option, index);
      this._items.push(item);
      this.child(item);
    });

    // 如果有已选值，更新选中状态
    if (this._multiple && this._selectedValues.length > 0) {
      this._updateSelectedState();
    } else if (!this._multiple && this._selectedValue !== null) {
      this._updateSelectedState();
    }
  }

  /**
   * 创建选项项
   * @param {Object} option - 选项配置
   * @param {number} index - 索引
   * @returns {Tag} 选项元素
   * @private
   */
  _createItem(option, index) {
    const item = div(i => {
      i.addClass('yoya-switchers__item');
      i.text(option.label);

      // 如果选项本身禁用或容器禁用，添加禁用样式
      if (option.disabled || this.hasState('disabled')) {
        i.addClass('yoya-switchers__item--disabled');
      }

      // 点击事件
      if (!option.disabled && !this.hasState('disabled')) {
        i.on('click', () => {
          this._handleItemClick(option, index);
        });
      }
    });

    return item;
  }

  /**
   * 处理选项点击
   * @param {Object} option - 选项配置
   * @param {number} index - 索引
   * @private
   */
  _handleItemClick(option, index) {
    if (this._multiple) {
      // 多选模式
      const valueIndex = this._selectedValues.indexOf(option.value);
      if (valueIndex > -1) {
        // 取消选中
        this._selectedValues.splice(valueIndex, 1);
      } else {
        // 选中
        this._selectedValues.push(option.value);
      }
      this._updateSelectedState();
      if (this._onChange) {
        this._onChange([...this._selectedValues], option, index);
      }
    } else {
      // 单选模式
      if (this._selectedValue === option.value) {
        return; // 已选中，不重复触发
      }
      this._selectedValue = option.value;
      this._updateSelectedState();
      if (this._onChange) {
        this._onChange(option.value, option, index);
      }
    }
  }

  /**
   * 更新选中状态
   * @private
   */
  _updateSelectedState() {
    this._items.forEach((item, index) => {
      const option = this._options[index];
      if (!option) return;

      if (this._multiple) {
        const isSelected = this._selectedValues.indexOf(option.value) > -1;
        if (isSelected) {
          item.addClass('yoya-switchers__item--active');
        } else {
          item.removeClass('yoya-switchers__item--active');
        }
      } else {
        if (option.value === this._selectedValue) {
          item.addClass('yoya-switchers__item--active');
        } else {
          item.removeClass('yoya-switchers__item--active');
        }
      }
    });
  }

  /**
   * 设置/获取选中值
   * @param {string|Array} value - 选中值（多选时为数组）
   * @returns {this|*}
   */
  value(value) {
    if (value === undefined) {
      return this._multiple ? [...this._selectedValues] : this._selectedValue;
    }

    if (this._multiple) {
      this._selectedValues = Array.isArray(value) ? [...value] : [value];
    } else {
      this._selectedValue = value;
    }

    this._updateSelectedState();
    return this;
  }

  /**
   * 设置多选模式
   * @param {boolean} multiple - 是否多选
   * @returns {this}
   */
  multiple(multiple) {
    if (multiple === undefined) return this._multiple;
    this._multiple = multiple;
    return this;
  }

  /**
   * 设置禁用状态
   * @param {boolean} disabled - 是否禁用
   * @returns {this}
   */
  disabled(disabled) {
    return this.setState('disabled', disabled);
  }

  /**
   * 设置尺寸
   * @param {string} size - 'small' | 'medium' | 'large'
   * @returns {this}
   */
  size(size) {
    if (size === undefined) return this._size;

    // 移除旧尺寸类
    this.removeClass('yoya-switchers--small')
        .removeClass('yoya-switchers--medium')
        .removeClass('yoya-switchers--large');

    this._size = size;

    // 添加新尺寸类
    if (size === 'small' || size === 'medium' || size === 'large') {
      this.addClass(`yoya-switchers--${size}`);
    } else {
      this.addClass('yoya-switchers--medium');
    }

    return this;
  }

  /**
   * 设置变化事件回调
   * @param {Function} callback - 回调函数
   * @returns {this}
   */
  onChange(callback) {
    if (typeof callback === 'function') {
      this._onChange = callback;
    }
    return this;
  }

  /**
   * 设置背景色
   * @param {string} color - 颜色值
   * @returns {this}
   */
  background(color) {
    if (color === undefined) return this.style('background-color');
    this.style('background-color', color);
    return this;
  }

  /**
   * 设置内边距
   * @param {string} value - 内边距值
   * @returns {this}
   */
  padding(value) {
    if (value === undefined) return this.style('padding');
    this.style('padding', value);
    return this;
  }

  /**
   * 设置外边距
   * @param {string} value - 外边距值
   * @returns {this}
   */
  margin(value) {
    if (value === undefined) return this.style('margin');
    this.style('margin', value);
    return this;
  }

  /**
   * 设置宽度
   * @param {string} value - 宽度值
   * @returns {this}
   */
  width(value) {
    if (value === undefined) return this.style('width');
    this.style('width', value);
    return this;
  }
}

/**
 * 创建 VSwitchers 实例
 * @param {Function} [setup=null] - 初始化函数
 * @returns {VSwitchers}
 */
function vSwitchers(setup = null) {
  return new VSwitchers(setup);
}

// ============================================
// Tag 原型扩展方法
// ============================================

/**
 * Tag 原型扩展 - 添加 vSwitchers 子元素
 * @param {Function} [setup=null] - 初始化函数
 * @returns {this}
 */
Tag.prototype.vSwitchers = function(setup = null) {
  const el = vSwitchers(setup);
  this.child(el);
  return this;
};

// ============================================
// 导出
// ============================================

export {
  VSwitchers,
  vSwitchers,
};
