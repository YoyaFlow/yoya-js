/**
 * @fileoverview KeyboardHandler 键盘交互处理器
 * 处理键盘快捷键
 */

import { EventEmitter } from '../utils/EventEmitter.js';

class KeyboardHandler extends EventEmitter {
  constructor(scadaCanvas, options = {}) {
    super();

    this.canvas = scadaCanvas.canvas;
    this.viewport = scadaCanvas.viewport;

    // 快捷键配置
    this.shortcuts = {
      // 缩放
      zoomIn: options.shortcuts?.zoomIn ?? ['+', 'Control+Equal'],
      zoomOut: options.shortcuts?.zoomOut ?? ['-', 'Control+Minus'],
      zoomFit: options.shortcuts?.zoomFit ?? ['0', 'Control+Digit0'],
      zoom100: options.shortcuts?.zoom100 ?? ['1', 'Control+Digit1'],

      // 平移
      panLeft: options.shortcuts?.panLeft ?? ['ArrowLeft'],
      panRight: options.shortcuts?.panRight ?? ['ArrowRight'],
      panUp: options.shortcuts?.panUp ?? ['ArrowUp'],
      panDown: options.shortcuts?.panDown ?? ['ArrowDown'],

      // 其他
      delete: options.shortcuts?.delete ?? ['Delete', 'Backspace'],
      undo: options.shortcuts?.undo ?? ['Control+z'],
      redo: options.shortcuts?.redo ?? ['Control+y', 'Control+Shift+z'],
      save: options.shortcuts?.save ?? ['Control+s'],

      // 显示切换
      toggleGrid: options.shortcuts?.toggleGrid ?? ['g'],
      toggleRulers: options.shortcuts?.toggleRulers ?? ['r'],
      toggleGuides: options.shortcuts?.toggleGuides ?? [';'],

      // 取消拾取
      cancelPickup: options.shortcuts?.cancelPickup ?? ['Escape']
    };

    // 平移速度
    this.panSpeed = options.panSpeed ?? 50;

    // 绑定事件
    this._boundKeyDown = this._onKeyDown.bind(this);
    this.canvas.addEventListener('keydown', this._boundKeyDown);

    // 确保画布可以接收键盘事件
    this.canvas.setAttribute('tabindex', '0');
  }

  /**
   * 键盘按下
   * @private
   * @param {KeyboardEvent} e - 键盘事件
   */
  _onKeyDown(e) {
    const key = this._normalizeKey(e);

    // 检查快捷键
    for (const [action, keys] of Object.entries(this.shortcuts)) {
      if (keys.includes(key)) {
        e.preventDefault();
        this._executeAction(action);
        return;
      }
    }
  }

  /**
   * 标准化按键
   * @private
   * @param {KeyboardEvent} e - 键盘事件
   * @returns {string} 标准化按键字符串
   */
  _normalizeKey(e) {
    const parts = [];

    if (e.ctrlKey || e.metaKey) parts.push('Control');
    if (e.shiftKey) parts.push('Shift');
    if (e.altKey) parts.push('Alt');

    // 特殊按键
    const specialKeys = {
      ' ': 'Space',
      '+': 'Plus',
      '-': 'Minus',
      '=': 'Equal',
      'ArrowLeft': 'ArrowLeft',
      'ArrowRight': 'ArrowRight',
      'ArrowUp': 'ArrowUp',
      'ArrowDown': 'ArrowDown',
      'Delete': 'Delete',
      'Backspace': 'Backspace',
      'Escape': 'Escape',
      'Enter': 'Enter',
      'Tab': 'Tab'
    };

    const key = e.key;
    if (specialKeys[key]) {
      parts.push(specialKeys[key]);
    } else {
      // 字母和数字
      parts.push(key.toUpperCase());
    }

    return parts.join('+');
  }

  /**
   * 执行动作
   * @private
   * @param {string} action - 动作名称
   */
  _executeAction(action) {
    switch (action) {
      case 'zoomIn':
        this.viewport.zoomIn(1.2, this.viewport.canvasWidth / 2, this.viewport.canvasHeight / 2);
        break;

      case 'zoomOut':
        this.viewport.zoomOut(1.2, this.viewport.canvasWidth / 2, this.viewport.canvasHeight / 2);
        break;

      case 'zoomFit':
        // TODO: 实现适应内容
        break;

      case 'zoom100':
        this.viewport.setZoom(1.0);
        break;

      case 'panLeft':
        this.viewport.pan(this.panSpeed, 0);
        break;

      case 'panRight':
        this.viewport.pan(-this.panSpeed, 0);
        break;

      case 'panUp':
        this.viewport.pan(0, this.panSpeed);
        break;

      case 'panDown':
        this.viewport.pan(0, -this.panSpeed);
        break;

      case 'delete':
        this.emit('delete');
        break;

      case 'undo':
        this.emit('undo');
        break;

      case 'redo':
        this.emit('redo');
        break;

      case 'save':
        this.emit('save');
        break;

      case 'toggleGrid':
        this.emit('toggleGrid');
        break;

      case 'toggleRulers':
        this.emit('toggleRulers');
        break;

      case 'toggleGuides':
        this.emit('toggleGuides');
        break;

      case 'cancelPickup':
        this.emit('cancelPickup');
        break;
    }
  }

  /**
   * 注册快捷键
   * @param {string} action - 动作名称
   * @param {string[]} keys - 按键数组
   */
  registerShortcut(action, keys) {
    this.shortcuts[action] = keys;
  }

  /**
   * 注销快捷键
   * @param {string} action - 动作名称
   */
  unregisterShortcut(action) {
    delete this.shortcuts[action];
  }

  /**
   * 启用
   */
  enable() {
    this.canvas.addEventListener('keydown', this._boundKeyDown);
  }

  /**
   * 禁用
   */
  disable() {
    this.canvas.removeEventListener('keydown', this._boundKeyDown);
  }

  /**
   * 销毁
   */
  destroy() {
    this.disable();
    this.removeAllListeners();
  }
}

export { KeyboardHandler };
