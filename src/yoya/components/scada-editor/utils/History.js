/**
 * @fileoverview History 撤销/重做历史管理
 * 使用快照模式保存状态
 */

/**
 * 撤销/重做历史管理
 */
class History {
  constructor(editor, options = {}) {
    this._editor = editor;
    this._past = [];       // 过去的状态
    this._future = [];     // 撤销后的状态
    this._maxLength = options.maxLength || 50;
    this._skipNext = false;
  }

  /**
   * 推送状态到历史
   * @param {Object} state - 状态对象
   */
  push(state) {
    if (this._skipNext) {
      this._skipNext = false;
      return;
    }

    // 清空未来的状态（用户进行了新操作）
    this._future = [];

    // 保存快照（深拷贝）
    this._past.push(JSON.parse(JSON.stringify(state)));

    // 限制历史长度
    if (this._past.length > this._maxLength) {
      this._past.shift();
    }
  }

  /**
   * 撤销
   * @returns {boolean} 是否成功撤销
   */
  undo() {
    if (this._past.length === 0) return false;

    // 保存当前状态到 future
    const currentState = this._editor.toJSON();
    this._future.push(currentState);

    // 恢复上一个状态
    const previousState = this._past.pop();
    this._skipNext = true;  // 避免保存历史
    this._editor.fromJSON(previousState);

    return true;
  }

  /**
   * 重做
   * @returns {boolean} 是否成功重做
   */
  redo() {
    if (this._future.length === 0) return false;

    // 保存当前状态到 past
    const currentState = this._editor.toJSON();
    this._past.push(currentState);

    // 恢复下一个状态
    const nextState = this._future.pop();
    this._skipNext = true;
    this._editor.fromJSON(nextState);

    return true;
  }

  /**
   * 是否可以撤销
   * @returns {boolean}
   */
  canUndo() {
    return this._past.length > 0;
  }

  /**
   * 是否可以重做
   * @returns {boolean}
   */
  canRedo() {
    return this._future.length > 0;
  }

  /**
   * 清空历史
   */
  clear() {
    this._past = [];
    this._future = [];
    this._skipNext = false;
  }

  /**
   * 获取历史长度
   * @returns {number} 过去状态的数量
   */
  get length() {
    return this._past.length;
  }

  /**
   * 设置最大历史长度
   * @param {number} maxLength - 最大长度
   */
  setMaxLength(maxLength) {
    this._maxLength = maxLength;
    // 如果当前长度超过新限制，截断
    while (this._past.length > maxLength) {
      this._past.shift();
    }
    while (this._future.length > maxLength) {
      this._future.shift();
    }
  }

  /**
   * 获取历史统计
   * @returns {Object} 统计信息
   */
  getStatistics() {
    return {
      past: this._past.length,
      future: this._future.length,
      maxLength: this._maxLength
    };
  }
}

export { History };
