/**
 * Yoya.ThemeSwitch - 三段式主题切换按钮组件
 * 采用 switch 风格，三个圆形标识分别代表 浅色/自动/深色 模式
 */

import { Tag, div, span } from '../core/basic.js';
import { getThemeMode, setThemeMode } from '../theme/index.js';
import { toast } from './message.js';

// 图标映射
const ICONS = {
  light: '☀️',
  auto: '🔄',
  dark: '🌙'
};

// 提示文本映射
const TOOLTIPS = {
  light: '浅色模式',
  auto: '自动模式（跟随系统）',
  dark: '深色模式'
};

/**
 * 创建三段式主题切换按钮
 * @param {Function} setup - 配置函数
 * @returns {Tag} 主题切换按钮组件
 *
 * @example
 * // 基础用法
 * themeSwitch();
 *
 * @example
 * // 带回调
 * themeSwitch(ts => {
 *   ts.onChange((mode) => {
 *     console.log('主题已切换为:', mode);
 *   });
 * });
 */
export function themeSwitch(setup = null) {
  return new ThemeSwitch(setup);
}

/**
 * ThemeSwitch 组件类
 */
class ThemeSwitch extends Tag {
  constructor(setup = null) {
    super('div', null);

    // 初始化状态
    this._currentMode = getThemeMode();
    this._onChange = null;
    this._size = 'medium'; // 'small' | 'medium' | 'large'

    // 构建组件结构
    this._build();

    // 应用样式
    this._applyStyles();

    // 执行用户配置
    if (setup) setup(this);
  }

  /**
   * 构建组件 DOM 结构
   * @private
   */
  _build() {
    // 容器样式类
    this.className('yoya-theme-switch');

    // 三个选项按钮
    const modes = ['light', 'auto', 'dark'];

    modes.forEach(mode => {
      this.child(div(btn => {
        btn.className(`yoya-theme-switch__option yoya-theme-switch__option--${mode}`);
        btn.id(`theme-option-${mode}`);

        // 图标
        btn.child(span(icon => {
          icon.className('yoya-theme-switch__icon');
          icon.text(ICONS[mode]);
        }));

        // 点击事件
        btn.on('click', () => {
          this._handleClick(mode);
        });

        // 保存引用
        this[`_${mode}Btn`] = btn;
      }));
    });

    // 滑块指示器
    this.child(div(indicator => {
      indicator.className('yoya-theme-switch__indicator');
      this._indicator = indicator;
    }));

    // 初始化指示器位置
    this._updateIndicator();
  }

  /**
   * 应用样式
   * @private
   */
  _applyStyles() {
    this.styles({
      display: 'inline-flex',
      position: 'relative',
      alignItems: 'center',
      background: 'var(--yoya-bg-secondary, #e5e7eb)',
      borderRadius: '9999px',
      padding: '4px',
      cursor: 'pointer',
      userSelect: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.2s ease'
    });
  }

  /**
   * 处理点击事件
   * @private
   */
  _handleClick(mode) {
    if (mode === this._currentMode) return;

    setThemeMode(mode);
    this._currentMode = mode;
    this._updateIndicator();
    this._updateActiveState();

    // 触发 onChange 回调
    if (this._onChange) {
      this._onChange(mode);
    }

    // 显示提示
    toast.info(TOOLTIPS[mode]);
  }

  /**
   * 更新指示器位置
   * @private
   */
  _updateIndicator() {
    if (!this._indicator) return;

    const mode = this._currentMode;
    let translateX = 0;

    // 根据当前模式计算滑块位置
    switch (mode) {
      case 'light':
        translateX = 0;
        break;
      case 'auto':
        translateX = 100;
        break;
      case 'dark':
        translateX = 200;
        break;
    }

    this._indicator.styles({
      transform: `translateX(${translateX}%)`,
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    });
  }

  /**
   * 更新激活状态
   * @private
   */
  _updateActiveState() {
    ['light', 'auto', 'dark'].forEach(mode => {
      const btn = this[`_${mode}Btn`];
      if (btn) {
        if (mode === this._currentMode) {
          btn.className(`yoya-theme-switch__option yoya-theme-switch__option--${mode} yoya-theme-switch__option--active`);
        } else {
          btn.className(`yoya-theme-switch__option yoya-theme-switch__option--${mode}`);
        }
      }
    });
  }

  /**
   * 设置尺寸
   * @param {'small' | 'medium' | 'large'} size
   * @returns {this}
   */
  size(size) {
    this._size = size;
    this.className(`yoya-theme-switch yoya-theme-switch--${size}`);
    return this;
  }

  /**
   * 设置变化回调
   * @param {Function} fn - (mode: 'light' | 'auto' | 'dark') => void
   * @returns {this}
   */
  onChange(fn) {
    this._onChange = fn;
    return this;
  }

  /**
   * 获取当前模式
   * @returns {'light' | 'auto' | 'dark'}
   */
  getMode() {
    return this._currentMode;
  }

  /**
   * 设置当前模式（编程式）
   * @param {'light' | 'auto' | 'dark'} mode
   * @returns {this}
   */
  setMode(mode) {
    if (['light', 'auto', 'dark'].includes(mode) && mode !== this._currentMode) {
      this._currentMode = mode;
      this._updateIndicator();
      this._updateActiveState();
    }
    return this;
  }
}

// 添加尺寸样式类
const sizeStyles = {
  small: {
    width: '120px',
    height: '32px',
    fontSize: '14px'
  },
  medium: {
    width: '150px',
    height: '40px',
    fontSize: '16px'
  },
  large: {
    width: '180px',
    height: '48px',
    fontSize: '18px'
  }
};

// 导出类供扩展使用
export { ThemeSwitch };
