/**
 * @fileoverview ScadaEditor 主编辑器类
 * 负责：工程管理、变量管理、告警配置、动画调度、序列化
 */

import { Tag } from '../../../core/basic.js';
import { History } from '../utils/History.js';
import { SymbolNode } from './SymbolNode.js';
import { VariableManager } from './VariableManager.js';
import { AlarmManager } from './AlarmManager.js';
import { AnimationEngine } from '../animation/AnimationEngine.js';

/**
 * 工业组态编辑器主类
 */
class VScadaEditor extends Tag {
  static _stateAttrs = ['ready', 'loading', 'dirty', 'running'];

  constructor(setup = null) {
    super('div', null);

    // 工程管理
    this._projectConfig = {};
    this._canvasConfig = {};

    // 核心管理器
    this._variables = new VariableManager();    // 变量管理
    this._alarms = new AlarmManager();          // 告警管理
    this._animationEngine = new AnimationEngine(this._variables); // 动画引擎

    // 图元管理
    this._symbols = {};  // Map<id, SymbolNode>
    this._symbolRegistry = new Map();  // 注册的图元类型

    // UI 状态
    this._uiState = {
      selectedSymbolId: null,
      hoveredSymbolId: null,
      zoom: 1.0,
      showGrid: true
    };

    this._history = new History(this);

    // 回调
    this._onChange = null;
    this._onSave = null;
    this._onAlarm = null;

    this.registerStateAttrs(...this.constructor._stateAttrs);
    this._registerStateHandlers();

    if (setup) setup(this);
  }

  // ========== 工程配置 ==========

  /**
   * 设置工程配置
   * @param {Object} config - 工程配置对象
   * @returns {VScadaEditor} this
   */
  project(config) {
    this._projectConfig = { ...this._projectConfig, ...config };
    return this;
  }

  /**
   * 设置画布配置
   * @param {Object} config - 画布配置对象
   * @returns {VScadaEditor} this
   */
  canvas(config) {
    this._canvasConfig = { ...this._canvasConfig, ...config };
    return this;
  }

  // ========== 图元注册 ==========

  /**
   * 注册图元类型
   * @param {string} type - 图元类型名
   * @param {Function} factory - 图元工厂函数
   * @param {Object} metadata - 图元元数据
   * @returns {VScadaEditor} this
   */
  registerSymbol(type, factory, metadata = {}) {
    this._symbolRegistry.set(type, { factory, metadata });
    return this;
  }

  // ========== 图元 CRUD ==========

  /**
   * 创建图元
   * @param {string} type - 图元类型
   * @param {Object} options - 选项
   * @returns {SymbolNode} 创建的图元节点
   */
  createSymbol(type, options = {}) {
    const reg = this._symbolRegistry.get(type);
    if (!reg) {
      throw new Error(`Symbol type "${type}" not registered`);
    }

    const id = options.id || `${type}-${Date.now()}`;
    const node = new SymbolNode({
      id,
      type,
      name: options.name || type,
      ...options
    });

    this._symbols[id] = node;
    this._animationEngine.bindSymbol(node);
    this._saveHistory();
    this._triggerChange();
    return node;
  }

  /**
   * 更新图元
   * @param {string} id - 图元 ID
   * @param {Object} changes - 变更对象
   * @returns {SymbolNode|null} 更新后的图元
   */
  updateSymbol(id, changes) {
    const node = this._symbols[id];
    if (!node) return null;

    this._saveHistory();
    node.update(changes);
    this._triggerChange();
    return node;
  }

  /**
   * 删除图元
   * @param {string} id - 图元 ID
   * @returns {SymbolNode|null} 删除的图元
   */
  deleteSymbol(id) {
    const node = this._symbols[id];
    if (!node) return null;

    this._saveHistory();
    this._animationEngine.unbindSymbol(id);
    delete this._symbols[id];
    this._triggerChange();
    return node;
  }

  /**
   * 获取图元
   * @param {string} id - 图元 ID
   * @returns {SymbolNode|null} 图元节点
   */
  getSymbol(id) {
    return this._symbols[id] || null;
  }

  /**
   * 获取所有图元
   * @returns {SymbolNode[]} 图元数组
   */
  getAllSymbols() {
    return Object.values(this._symbols);
  }

  // ========== 变量管理 ==========

  /**
   * 创建变量
   * @param {Object} config - 变量配置
   * @returns {Object} 创建的变量
   */
  createVariable(config) {
    return this._variables.create(config);
  }

  /**
   * 更新变量
   * @param {string} id - 变量 ID
   * @param {Object} changes - 变更对象
   * @returns {Object|null} 更新后的变量
   */
  updateVariable(id, changes) {
    return this._variables.update(id, changes);
  }

  /**
   * 删除变量
   * @param {string} id - 变量 ID
   * @returns {Object|null} 删除的变量
   */
  deleteVariable(id) {
    return this._variables.delete(id);
  }

  /**
   * 获取变量
   * @param {string} id - 变量 ID
   * @returns {Object|null} 变量对象
   */
  getVariable(id) {
    return this._variables.get(id);
  }

  /**
   * 获取所有变量
   * @returns {Object[]} 变量数组
   */
  getAllVariables() {
    return this._variables.getAll();
  }

  /**
   * 根据 PLC 地址获取变量
   * @param {string} address - PLC 地址
   * @returns {Object|null} 变量对象
   */
  getVariableByAddress(address) {
    return this._variables.getByAddress(address);
  }

  /**
   * 更新变量值（从通信层调用）
   * @param {string} address - PLC 地址
   * @param {any} value - 值
   * @param {number} timestamp - 时间戳
   */
  updateVariableValue(address, value, timestamp = Date.now()) {
    return this._variables.updateValue(address, value, timestamp);
  }

  // ========== 告警管理 ==========

  /**
   * 创建告警定义
   * @param {Object} config - 告警配置
   * @returns {Object} 告警定义
   */
  createAlarm(config) {
    return this._alarms.createDefinition(config);
  }

  /**
   * 获取活动告警
   * @returns {Object[]} 活动告警数组
   */
  getActiveAlarms() {
    return this._alarms.getActive();
  }

  /**
   * 确认告警
   * @param {string} id - 告警 ID
   * @returns {Object|null} 确认后的告警
   */
  acknowledgeAlarm(id) {
    return this._alarms.acknowledge(id);
  }

  /**
   * 获取告警历史
   * @param {Object} options - 查询选项
   * @returns {Object[]} 告警历史数组
   */
  getAlarmHistory(options = {}) {
    return this._alarms.getHistory(options);
  }

  // ========== 动画绑定 ==========

  /**
   * 为图元添加动画
   * @param {string} symbolId - 图元 ID
   * @param {Object} animationConfig - 动画配置
   * @returns {Object|null} 动画对象
   */
  bindAnimation(symbolId, animationConfig) {
    const symbol = this._symbols[symbolId];
    if (!symbol) return null;
    return this._animationEngine.addAnimation(symbolId, animationConfig);
  }

  // ========== 选择管理 ==========

  /**
   * 选择图元
   * @param {string} symbolId - 图元 ID
   */
  select(symbolId) {
    this._uiState.selectedSymbolId = symbolId;
    this._triggerChange();
  }

  /**
   * 获取选中的图元
   * @returns {SymbolNode|null} 选中的图元
   */
  getSelected() {
    return this._symbols[this._uiState.selectedSymbolId] || null;
  }

  /**
   * 取消选择
   */
  deselect() {
    this._uiState.selectedSymbolId = null;
    this._triggerChange();
  }

  // ========== 序列化 ==========

  /**
   * 导出为 JSON
   * @returns {Object} JSON 对象
   */
  toJSON() {
    return {
      version: '2.0.0-industrial',
      project: this._projectConfig,
      canvas: this._canvasConfig,
      variables: this._variables.getAll(),
      symbols: Object.values(this._symbols).map(node => node.toJSON()),
      alarms: this._alarms.toJSON(),
      ui: this._uiState
    };
  }

  /**
   * 从 JSON 导入
   * @param {Object} data - JSON 数据
   */
  fromJSON(data) {
    this._projectConfig = data.project || {};
    this._canvasConfig = data.canvas || {};
    this._variables.fromJSON(data.variables || []);
    this._alarms.fromJSON(data.alarms || []);
    this._uiState = data.ui || {};

    // 恢复图元
    this._symbols = {};
    data.symbols?.forEach(nodeData => {
      const node = new SymbolNode(nodeData);
      this._symbols[node.id] = node;
      this._animationEngine.bindSymbol(node);
    });

    this._triggerChange();
  }

  // ========== 撤销/重做 ==========

  /**
   * 撤销
   */
  undo() {
    this._history.undo();
  }

  /**
   * 重做
   */
  redo() {
    this._history.redo();
  }

  /**
   * 是否可以撤销
   * @returns {boolean}
   */
  canUndo() {
    return this._history.canUndo();
  }

  /**
   * 是否可以重做
   * @returns {boolean}
   */
  canRedo() {
    return this._history.canRedo();
  }

  // ========== 运行控制 ==========

  /**
   * 启动运行模式
   */
  startRunning() {
    this.setState('running', true);
    this._animationEngine.start();
    this._alarms.start();
  }

  /**
   * 停止运行模式
   */
  stopRunning() {
    this.setState('running', false);
    this._animationEngine.stop();
    this._alarms.stop();
  }

  /**
   * 是否在运行模式
   * @returns {boolean}
   */
  isRunning() {
    return this.getBooleanState('running');
  }

  // ========== 事件 ==========

  /**
   * 设置变更回调
   * @param {Function} fn - 回调函数
   * @returns {VScadaEditor} this
   */
  onChange(fn) {
    this._onChange = fn;
    return this;
  }

  /**
   * 设置保存回调
   * @param {Function} fn - 回调函数
   * @returns {VScadaEditor} this
   */
  onSave(fn) {
    this._onSave = fn;
    return this;
  }

  /**
   * 设置告警回调
   * @param {Function} fn - 回调函数
   * @returns {VScadaEditor} this
   */
  onAlarm(fn) {
    this._onAlarm = fn;
    return this;
  }

  _triggerChange() {
    if (this._onChange) {
      this._onChange(this.toJSON());
    }
  }

  _saveHistory() {
    this._history.push(this.toJSON());
  }

  _registerStateHandlers() {
    this.registerStateHandler('ready', (isReady, host) => {
      if (isReady) {
        host.style('opacity', '1');
      } else {
        host.style('opacity', '0.5');
      }
    });

    this.registerStateHandler('running', (isRunning) => {
      if (isRunning) {
        this._animationEngine.start();
        this._alarms.start();
      } else {
        this._animationEngine.stop();
        this._alarms.stop();
      }
    });
  }

  renderDom() {
    if (this._deleted) return null;
    const element = super.renderDom();

    // 设置编辑器样式
    element.style.position = 'relative';
    element.style.width = '100%';
    element.style.height = '100%';
    element.style.overflow = 'auto';
    element.style.background = this._canvasConfig.backgroundColor || '#f5f5f5';

    // 渲染画布内容
    this._renderCanvas(element);

    this._boundElement = element;
    return element;
  }

  _renderCanvas(parent) {
    // 渲染所有图元
    Object.values(this._symbols).forEach(symbol => {
      const el = symbol.renderDom();
      if (el) {
        parent.appendChild(el);
      }
    });
  }
}

export { VScadaEditor };
