/**
 * @fileoverview VariableManager 变量管理器
 * 管理 PLC 数据点表，负责变量的 CRUD 和实时值更新
 */

/**
 * 变量管理器
 */
class VariableManager {
  constructor() {
    this._variables = new Map();  // id -> Variable
    this._addressIndex = new Map();  // PLC 地址 -> variableId
    this._subscribers = new Map();  // variableId -> Set<callback>
  }

  /**
   * 创建变量
   * @param {Object} config - 变量配置
   * @returns {Object} 创建的变量
   */
  create(config) {
    const variable = {
      id: config.id || `var-${Date.now()}`,
      name: config.name,
      address: config.address,  // PLC 地址，如 "DB1.DBX0.0"
      dataType: config.dataType || 'bool',  // bool, int, real, string
      initialValue: config.initialValue,
      currentValue: config.initialValue,
      unit: config.unit || '',
      min: config.min,
      max: config.max,
      timestamp: 0,
      quality: 'good'  // good, bad, uncertain
    };

    this._variables.set(variable.id, variable);
    if (config.address) {
      this._addressIndex.set(config.address, variable.id);
    }

    // 初始化订阅者集合
    this._subscribers.set(variable.id, new Set());

    return variable;
  }

  /**
   * 更新变量
   * @param {string} id - 变量 ID
   * @param {Object} changes - 变更对象
   * @returns {Object|null} 更新后的变量
   */
  update(id, changes) {
    const variable = this._variables.get(id);
    if (!variable) return null;

    Object.assign(variable, changes);
    return variable;
  }

  /**
   * 更新变量值
   * @param {string} address - PLC 地址
   * @param {any} value - 值
   * @param {number} timestamp - 时间戳
   * @returns {Object|null} 更新后的变量
   */
  updateValue(address, value, timestamp = Date.now()) {
    const id = this._addressIndex.get(address);
    if (!id) return null;

    const variable = this._variables.get(id);
    const oldValue = variable.currentValue;

    variable.currentValue = value;
    variable.timestamp = timestamp;
    variable.quality = 'good';

    // 通知订阅者
    if (oldValue !== value) {
      this._notifySubscribers(variable.id, value, oldValue);
    }

    return variable;
  }

  /**
   * 删除变量
   * @param {string} id - 变量 ID
   * @returns {Object|null} 删除的变量
   */
  delete(id) {
    const variable = this._variables.get(id);
    if (!variable) return null;

    if (variable.address) {
      this._addressIndex.delete(variable.address);
    }
    this._subscribers.delete(id);
    this._variables.delete(id);

    return variable;
  }

  /**
   * 获取变量
   * @param {string} id - 变量 ID
   * @returns {Object|null} 变量对象
   */
  get(id) {
    return this._variables.get(id) || null;
  }

  /**
   * 根据 PLC 地址获取变量
   * @param {string} address - PLC 地址
   * @returns {Object|null} 变量对象
   */
  getByAddress(address) {
    const id = this._addressIndex.get(address);
    return id ? this._variables.get(id) : null;
  }

  /**
   * 获取所有变量
   * @returns {Object[]} 变量数组
   */
  getAll() {
    return Array.from(this._variables.values());
  }

  /**
   * 订阅变量变化
   * @param {string} id - 变量 ID
   * @param {Function} callback - 回调函数 (value, oldValue) => void
   * @returns {Function} 取消订阅函数
   */
  subscribe(id, callback) {
    if (!this._subscribers.has(id)) {
      this._subscribers.set(id, new Set());
    }
    this._subscribers.get(id).add(callback);

    // 返回取消订阅函数
    return () => {
      this._subscribers.get(id)?.delete(callback);
    };
  }

  /**
   * 批量更新变量值
   * @param {Array} updates - 更新数组 [[variableId, value, timestamp], ...]
   */
  batchUpdate(updates) {
    const changed = [];
    for (const [id, value, timestamp] of updates) {
      const variable = this._variables.get(id);
      if (variable) {
        const oldValue = variable.currentValue;
        variable.currentValue = value;
        variable.timestamp = timestamp || Date.now();
        variable.quality = 'good';

        if (oldValue !== value) {
          changed.push({ variable, value, oldValue });
        }
      }
    }

    // 通知订阅者
    for (const { variable, value, oldValue } of changed) {
      this._notifySubscribers(variable.id, value, oldValue);
    }
  }

  /**
   * 通知订阅者
   * @private
   * @param {string} id - 变量 ID
   * @param {any} value - 新值
   * @param {any} oldValue - 旧值
   */
  _notifySubscribers(id, value, oldValue) {
    const subscribers = this._subscribers.get(id);
    if (subscribers) {
      subscribers.forEach(cb => {
        try {
          cb(value, oldValue);
        } catch (e) {
          console.error(`Error in variable subscriber for ${id}:`, e);
        }
      });
    }
  }

  /**
   * 从 JSON 导入
   * @param {Object[]} data - 变量数组
   */
  fromJSON(data) {
    data.forEach(item => this.create(item));
  }

  /**
   * 导出为 JSON
   * @returns {Object[]} 变量数组
   */
  toJSON() {
    return this.getAll();
  }

  /**
   * 从 Excel 导入（需要实现 Excel 解析）
   * @param {File} file - Excel 文件
   * @returns {Promise<Object[]>} 导入的变量数组
   */
  async importFromExcel(file) {
    // TODO: 实现 Excel 解析
    // 支持列：Name, Address, DataType, InitialValue, Unit, Min, Max
    console.warn('importFromExcel not implemented yet');
    return [];
  }

  /**
   * 导出为 Excel（需要实现 Excel 生成）
   * @returns {Object[]} 变量数组
   */
  exportToExcel() {
    return this.getAll();
  }

  /**
   * 清空所有变量
   */
  clear() {
    this._variables.clear();
    this._addressIndex.clear();
    this._subscribers.clear();
  }

  /**
   * 获取变量数量
   * @returns {number} 变量数量
   */
  get count() {
    return this._variables.size;
  }
}

export { VariableManager };
