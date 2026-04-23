/**
 * @fileoverview AlarmManager 告警管理器
 * 负责告警条件检测、告警激活、确认、记录
 */

/**
 * 告警管理器
 */
class AlarmManager {
  constructor() {
    this._definitions = new Map();  // 告警定义
    this._activeAlarms = new Map(); // 活动告警
    this._history = [];             // 告警历史
    this._running = false;
    this._checkInterval = 1000;     // 1 秒检查一次
    this._interval = null;
    this._listeners = [];           // 告警事件监听器
  }

  /**
   * 创建告警定义
   * @param {Object} config - 告警配置
   * @returns {Object} 告警定义
   */
  createDefinition(config) {
    const def = {
      id: config.id || `alarm-${Date.now()}`,
      variable: config.variable,  // 变量 ID
      condition: config.condition,  // '>', '<', '>=', '<=', '==', '!='
      threshold: config.threshold,
      level: config.level || 'warning',  // 'info', 'warning', 'critical', 'emergency'
      message: config.message,
      deadband: config.deadband || 0,  // 死区
      delay: config.delay || 0,        // 延时（秒）
      enabled: config.enabled !== false,
      acknowledged: false,
      createdAt: Date.now()
    };

    this._definitions.set(def.id, def);
    return def;
  }

  /**
   * 更新告警定义
   * @param {string} id - 告警 ID
   * @param {Object} changes - 变更对象
   * @returns {Object|null} 更新后的告警定义
   */
  updateDefinition(id, changes) {
    const def = this._definitions.get(id);
    if (!def) return null;

    Object.assign(def, changes);
    return def;
  }

  /**
   * 删除告警定义
   * @param {string} id - 告警 ID
   * @returns {Object|null} 删除的告警定义
   */
  deleteDefinition(id) {
    const def = this._definitions.get(id);
    if (!def) return null;

    this._definitions.delete(id);

    // 同时删除相关的活动告警
    for (const [alarmId, alarm] of this._activeAlarms) {
      if (alarm.definitionId === id) {
        this._activeAlarms.delete(alarmId);
      }
    }

    return def;
  }

  /**
   * 获取告警定义
   * @param {string} id - 告警 ID
   * @returns {Object|null} 告警定义
   */
  getDefinition(id) {
    return this._definitions.get(id) || null;
  }

  /**
   * 获取所有告警定义
   * @returns {Object[]} 告警定义数组
   */
  getAllDefinitions() {
    return Array.from(this._definitions.values());
  }

  /**
   * 启动告警检测
   */
  start() {
    if (this._running) return;

    this._running = true;
    this._interval = setInterval(() => this._checkAlarms(), this._checkInterval);
  }

  /**
   * 停止告警检测
   */
  stop() {
    this._running = false;
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  /**
   * 检查告警条件
   * @private
   * @param {Object} variable - 变量对象
   * @param {Object} def - 告警定义
   */
  _checkAlarm(variable, def) {
    if (!def.enabled) return;

    const value = variable.currentValue;
    if (value === null || value === undefined) return;

    const triggered = this._evaluateCondition(value, def.condition, def.threshold, def.deadband);

    if (triggered && !this._activeAlarms.has(def.id)) {
      this._activateAlarm(def, value);
    } else if (!triggered && this._activeAlarms.has(def.id)) {
      this._clearAlarm(def.id);
    }
  }

  /**
   * 评估条件
   * @private
   * @param {number} value - 当前值
   * @param {string} condition - 条件
   * @param {number} threshold - 阈值
   * @param {number} deadband - 死区
   * @returns {boolean} 是否触发
   */
  _evaluateCondition(value, condition, threshold, deadband = 0) {
    // 应用死区
    const effectiveThreshold = condition.includes('>') ? threshold + deadband :
                               condition.includes('<') ? threshold - deadband : threshold;

    switch (condition) {
      case '>': return value > effectiveThreshold;
      case '>=': return value >= effectiveThreshold;
      case '<': return value < effectiveThreshold;
      case '<=': return value <= effectiveThreshold;
      case '==': return value === effectiveThreshold;
      case '!=': return value !== effectiveThreshold;
      default: return false;
    }
  }

  /**
   * 激活告警
   * @private
   * @param {Object} definition - 告警定义
   * @param {any} value - 触发值
   */
  _activateAlarm(definition, value) {
    const alarm = {
      id: `active-${Date.now()}`,
      definitionId: definition.id,
      variable: definition.variable,
      level: definition.level,
      message: definition.message,
      value: value,
      triggeredAt: new Date().toISOString(),
      acknowledged: false,
      acknowledgedAt: null,
      acknowledgedBy: null,
      clearedAt: null
    };

    this._activeAlarms.set(alarm.id, alarm);
    this._history.push({ ...alarm, event: 'triggered' });

    // 通知监听器
    this._notifyListeners('activate', alarm);

    // 触发编辑器回调
    if (this._onAlarm) {
      this._onAlarm(alarm);
    }
  }

  /**
   * 清除告警
   * @private
   * @param {string} alarmId - 告警 ID
   */
  _clearAlarm(alarmId) {
    const alarm = this._activeAlarms.get(alarmId);
    if (alarm) {
      alarm.clearedAt = new Date().toISOString();
      this._history.push({ ...alarm, event: 'cleared' });
      this._activeAlarms.delete(alarmId);
      this._notifyListeners('clear', alarm);
    }
  }

  /**
   * 确认告警
   * @param {string} alarmId - 告警 ID
   * @param {string} operator - 操作员
   * @returns {Object|null} 确认后的告警
   */
  acknowledge(alarmId, operator = 'anonymous') {
    const alarm = this._activeAlarms.get(alarmId);
    if (!alarm) return null;

    alarm.acknowledged = true;
    alarm.acknowledgedAt = new Date().toISOString();
    alarm.acknowledgedBy = operator;

    this._history.push({ ...alarm, event: 'acknowledged' });
    this._notifyListeners('acknowledge', alarm);

    return alarm;
  }

  /**
   * 获取活动告警
   * @returns {Object[]} 活动告警数组
   */
  getActive() {
    return Array.from(this._activeAlarms.values());
  }

  /**
   * 获取告警历史
   * @param {Object} options - 查询选项
   * @param {string} options.level - 告警级别过滤
   * @param {string} options.startDate - 开始日期
   * @param {string} options.endDate - 结束日期
   * @param {number} options.limit - 最大返回数量
   * @returns {Object[]} 告警历史数组
   */
  getHistory(options = {}) {
    let history = [...this._history];

    // 过滤
    if (options.level) {
      history = history.filter(a => a.level === options.level);
    }
    if (options.startDate) {
      history = history.filter(a => new Date(a.triggeredAt) >= new Date(options.startDate));
    }
    if (options.endDate) {
      history = history.filter(a => new Date(a.triggeredAt) <= new Date(options.endDate));
    }

    // 限制数量
    const limit = options.limit || 1000;
    return history.slice(-limit);
  }

  /**
   * 添加告警监听器
   * @param {Function} listener - 监听函数 (event, alarm) => void
   * @returns {Function} 取消监听函数
   */
  addListener(listener) {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener);
    };
  }

  /**
   * 通知监听器
   * @private
   * @param {string} event - 事件类型 'activate' | 'clear' | 'acknowledge'
   * @param {Object} alarm - 告警对象
   */
  _notifyListeners(event, alarm) {
    this._listeners.forEach(l => {
      try {
        l(event, alarm);
      } catch (e) {
        console.error('Error in alarm listener:', e);
      }
    });
  }

  /**
   * 导出为 JSON
   * @returns {Object} JSON 对象
   */
  toJSON() {
    return {
      definitions: Array.from(this._definitions.values()),
      active: Array.from(this._activeAlarms.values()),
      history: this._history.slice(-1000)  // 保留最近 1000 条
    };
  }

  /**
   * 从 JSON 导入
   * @param {Object} data - JSON 数据
   */
  fromJSON(data) {
    // 恢复告警定义
    data.definitions?.forEach(def => this.createDefinition(def));

    // 不恢复活动告警和历史，因为是运行时状态
    // 如果需要恢复，可以在这里添加逻辑
  }

  /**
   * 清空所有告警
   */
  clear() {
    this._definitions.clear();
    this._activeAlarms.clear();
    this._history = [];
    this.stop();
  }

  /**
   * 获取统计信息
   * @returns {Object} 统计信息
   */
  getStatistics() {
    const activeByLevel = {
      info: 0,
      warning: 0,
      critical: 0,
      emergency: 0
    };

    for (const alarm of this._activeAlarms.values()) {
      activeByLevel[alarm.level]++;
    }

    return {
      totalDefinitions: this._definitions.size,
      activeAlarms: this._activeAlarms.size,
      activeByLevel,
      historyCount: this._history.length
    };
  }

  /**
   * 设置告警回调
   * @param {Function} fn - 回调函数
   */
  onAlarm(fn) {
    this._onAlarm = fn;
  }
}

export { AlarmManager };
