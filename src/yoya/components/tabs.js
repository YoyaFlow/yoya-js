/**
 * Yoya.Components - Tabs
 * IDEA 风格的标签页组件，紧凑设计，优秀的标题与内容结合
 */

import { Tag, div, span } from '../core/basic.js';

// ============================================
// VTabs 标签页容器组件
// ============================================

class VTabs extends Tag {
  static _stateAttrs = ['editable', 'closable', 'dragable', 'activeIndex'];

  constructor(setup = null) {
    super('div', null);

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({
      editable: false,
      closable: true,
      dragable: false,
      activeIndex: 0,
    });

    // 3. 内部状态
    this._tabs = [];
    this._activeTab = null;
    this._contentContainer = null;

    // 4. 设置基础样式
    this._setupBaseStyles();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.styles({
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      background: 'var(--yoya-tabs-bg, var(--yoya-bg))',
      // IDEA 风格：无圆角，完全贴合
      borderTopLeftRadius: '0',
      borderTopRightRadius: '0',
    });
  }

  _registerStateHandlers() {
    // closable 状态处理器
    this.registerStateHandler('closable', (closable, host) => {
      // 更新所有标签页的关闭按钮显示
      this._tabs.forEach((tab) => {
        if (tab._closeBtn) {
          tab._closeBtn.style('display', closable ? 'flex' : 'none');
        }
      });
    });
  }

  /**
   * 添加标签页
   * @param {string} id - 标签页唯一标识
   * @param {string} title - 标签页标题
   * @param {Function} content - 内容创建函数
   * @param {Object} options - 选项 { icon, closable, data }
   * @returns {VTabs} this
   */
  addTab(id, title, content, options = {}) {
    const { icon = null, closable = true, data = {} } = options;

    // 检查是否已存在
    const existingIndex = this._tabs.findIndex((t) => t.id === id);
    if (existingIndex >= 0) {
      // 已存在则激活该标签页
      this.setActiveTab(id);
      return this;
    }

    // 延迟初始化 DOM 结构
    this._ensureDom();

    // 创建标签页数据
    const tabData = {
      id,
      title,
      icon,
      closable,
      data,
      content,
      el: null,
      contentEl: null,
      _closeBtn: null,
    };

    this._tabs.push(tabData);

    // 创建标签元素
    const tabEl = this._createTabElement(tabData);
    this._tabsHeader.child(tabEl);
    tabData.el = tabEl;

    // 创建内容元素（隐藏）
    const contentEl = this._createTabContent(tabData);
    this._contentContainer.child(contentEl);
    tabData.contentEl = contentEl;

    // 如果是第一个标签页或当前没有激活的标签页，激活它
    if (this._tabs.length === 1 || !this._activeTab) {
      this.setActiveTab(id);
    }

    return this;
  }

  /**
   * 确保 DOM 结构已初始化
   */
  _ensureDom() {
    if (!this._tabsHeader) {
      // 创建标签栏容器 - IDEA 风格：紧凑、与内容无缝衔接
      this._tabsHeader = div((h) => {
        h.styles({
          display: 'flex',
          alignItems: 'flex-end',
          gap: '0',
          borderBottom: '1px solid var(--yoya-tabs-border, #e0e0e0)',
          background: 'var(--yoya-tabs-header-bg, #f7f8fa)',
          overflowX: 'auto',
          overflowY: 'hidden',
          flexShrink: '0',
          marginBottom: '0',
        });
        h.style('scrollbarWidth', 'thin');
        h.style('scrollbarColor', 'rgba(128, 128, 128, 0.3) transparent');
      });

      // 创建内容容器
      this._contentContainer = div((c) => {
        c.styles({
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          marginTop: '0',
        });
      });

      this._children = [this._tabsHeader, this._contentContainer];
    }
  }

  /**
   * 创建标签元素
   */
  _createTabElement(tabData) {
    const self = this;

    const tabEl = div((t) => {
      t.styles({
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        // IDEA 风格：更紧凑的 padding
        padding: '6px 12px',
        paddingRight: '8px',
        fontSize: '13px',
        fontWeight: '400',
        color: 'var(--yoya-tabs-color, #666)',
        background: 'transparent',
        border: 'none',
        borderBottom: '2px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        position: 'relative',
        minWidth: '0',
        flexShrink: '0',
        // IDEA 风格：标签顶部圆角
        borderTopLeftRadius: '6px',
        borderTopRightRadius: '6px',
        // 与 header 背景融合，无上边距
        marginTop: '0',
      });

      t.on('mouseenter', () => {
        if (tabData.id !== self._activeTab?.id) {
          t.style('background', 'var(--yoya-tabs-hover-bg, rgba(0,0,0,0.02))');
        }
      });

      t.on('mouseleave', () => {
        if (tabData.id !== self._activeTab?.id) {
          t.style('background', 'transparent');
        }
      });

      t.on('click', () => {
        self.setActiveTab(tabData.id);
      });

      // 图标
      if (tabData.icon) {
        t.child(
          span((i) => {
            i.styles({
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '14px',
              lineHeight: '1',
              opacity: '0.7',
            });
            i.html(tabData.icon);
          })
        );
      }

      // 标题 - IDEA 风格：紧凑清晰
      t.child(
        span((s) => {
          s.styles({
            flex: 1,
            minWidth: '0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            letterSpacing: '0',
          });
          s.text(tabData.title);
          tabData._titleEl = s;
        })
      );

      // 关闭按钮
      t.child(
        span((c) => {
          c.styles({
            display: tabData.closable && this.hasState('closable') ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: '18px',
            height: '18px',
            borderRadius: '3px',
            fontSize: '14px',
            lineHeight: '1',
            color: 'var(--yoya-text-secondary, #999)',
            cursor: 'pointer',
            transition: 'all 0.1s ease',
            opacity: '0',
          });

          c.html('×');

          // 鼠标移到标签上时显示关闭按钮
          t.on('mouseenter', () => {
            c.style('opacity', '0.7');
          });
          t.on('mouseleave', () => {
            c.style('opacity', '0');
          });

          c.on('mouseenter', (e) => {
            e.stopPropagation();
            c.styles({ opacity: '1', background: 'var(--yoya-error-bg, rgba(239, 68, 68, 0.1))', color: 'var(--yoya-error, #ef4444)' });
          });
          c.on('mouseleave', (e) => {
            e.stopPropagation();
            c.styles({ opacity: '0.7', background: 'transparent', color: 'var(--yoya-text-secondary, #999)' });
          });
          c.on('click', (e) => {
            e.stopPropagation();
            self.removeTab(tabData.id);
          });

          tabData._closeBtn = c;
        })
      );
    });

    return tabEl;
  }

  /**
   * 创建内容元素
   */
  _createTabContent(tabData) {
    const contentEl = div((c) => {
      c.styles({
        display: 'none',
        flex: 1,
        overflow: 'auto',
        background: 'var(--yoya-tabs-content-bg, var(--yoya-bg))',
      });

      // 执行内容创建函数
      if (typeof tabData.content === 'function') {
        tabData.content(c);
      } else if (tabData.content instanceof Tag) {
        c.child(tabData.content);
      }
    });

    return contentEl;
  }

  /**
   * 设置激活的标签页
   * @param {string} id - 标签页 ID
   * @returns {VTabs} this
   */
  setActiveTab(id) {
    const tabData = this._tabs.find((t) => t.id === id);
    if (!tabData) return this;

    const previousTab = this._activeTab;

    // 更新激活状态
    this._activeTab = tabData;
    this.setState('activeIndex', this._tabs.indexOf(tabData));

    // 更新之前激活的标签样式
    if (previousTab && previousTab.el) {
      previousTab.el.styles({
        color: 'var(--yoya-tabs-color, #666)',
        background: 'transparent',
        borderBottomColor: 'transparent',
        marginTop: '0',
      });
      // 关闭按钮恢复隐藏
      if (previousTab._closeBtn) {
        previousTab._closeBtn.style('opacity', '0');
      }
    }

    // 更新新激活的标签样式 - IDEA 风格：激活标签与内容背景一致，无缝衔接
    tabData.el.styles({
      color: 'var(--yoya-tabs-active-color, var(--yoya-text, #333))',
      background: 'var(--yoya-tabs-content-bg, var(--yoya-bg, white))',
      borderBottomColor: 'var(--yoya-tabs-active-border)',
      marginTop: '0',
      // 激活标签字体略微加粗
      fontWeight: '500',
    });

    // 激活标签的关闭按钮始终可见
    if (tabData._closeBtn) {
      tabData._closeBtn.style('opacity', '0.7');
    }

    // 隐藏所有内容
    this._tabs.forEach((t) => {
      if (t.contentEl) {
        t.contentEl.style('display', 'none');
      }
    });

    // 显示当前内容
    if (tabData.contentEl) {
      tabData.contentEl.style('display', 'block');
    }

    // 派发事件
    if (this._onChange) {
      this._onChange(tabData.id, tabData);
    }

    return this;
  }

  /**
   * 移除标签页
   * @param {string} id - 标签页 ID
   * @returns {VTabs} this
   */
  removeTab(id) {
    const index = this._tabs.findIndex((t) => t.id === id);
    if (index < 0) return this;

    const tabData = this._tabs[index];
    const wasActive = this._activeTab?.id === id;

    // 从 DOM 移除 - 使用 destroy 方法标记为删除
    if (tabData.el) {
      tabData.el.destroy();
    }
    if (tabData.contentEl) {
      tabData.contentEl.destroy();
    }

    // 从数组移除
    this._tabs.splice(index, 1);

    // 如果移除的是激活的标签页，激活相邻的标签页
    if (wasActive) {
      if (this._tabs.length > 0) {
        const newIndex = Math.min(index, this._tabs.length - 1);
        this.setActiveTab(this._tabs[newIndex].id);
      } else {
        this._activeTab = null;
      }
    }

    return this;
  }

  /**
   * 更新标签页标题
   * @param {string} id - 标签页 ID
   * @param {string} title - 新标题
   * @returns {VTabs} this
   */
  updateTabTitle(id, title) {
    const tabData = this._tabs.find((t) => t.id === id);
    if (!tabData) return this;

    tabData.title = title;
    if (tabData._titleEl) {
      tabData._titleEl.text(title);
    }

    return this;
  }

  /**
   * 获取激活的标签页 ID
   * @returns {string|null}
   */
  getActiveTabId() {
    return this._activeTab?.id || null;
  }

  /**
   * 获取激活的标签页数据
   * @returns {Object|null}
   */
  getActiveTab() {
    return this._activeTab || null;
  }

  /**
   * 获取所有标签页
   * @returns {Array}
   */
  getTabs() {
    return [...this._tabs];
  }

  /**
   * 标签变化回调
   * @param {Function} fn
   * @returns {VTabs} this
   */
  onChange(fn) {
    this._onChange = fn;
    return this;
  }

  renderDom() {
    if (this._deleted) return null;

    if (!this._initialized) {
      // 使用延迟初始化
      this._ensureDom();

      // 添加滚动条样式
      const style = document.createElement('style');
      style.textContent = `
        .yoya-tabs-header::-webkit-scrollbar {
          height: 3px;
        }
        .yoya-tabs-header::-webkit-scrollbar-track {
          background: transparent;
        }
        .yoya-tabs-header::-webkit-scrollbar-thumb {
          background: rgba(128, 128, 128, 0.3);
          border-radius: 2px;
        }
        .yoya-tabs-header::-webkit-scrollbar-thumb:hover {
          background: rgba(128, 128, 128, 0.5);
        }
      `;
      if (typeof document !== 'undefined') {
        const existingStyle = this._tabsHeader._el.querySelector('style.yoya-tabs-header-style');
        if (!existingStyle) {
          style.className = 'yoya-tabs-header-style';
          this._tabsHeader._el.appendChild(style);
        }
      }

      this._initialized = true;
    }

    return super.renderDom();
  }
}

function vTabs(setup = null) {
  return new VTabs(setup);
}

// ============================================
// Tag 原型扩展
// ============================================

Tag.prototype.vTabs = function (setup = null) {
  const tabs = vTabs(setup);
  this.child(tabs);
  return this;
};

// ============================================
// 导出
// ============================================

export { VTabs, vTabs };
