/**
 * Yoya.Basic - 主题变量配置
 * 所有组件支持的主题变量列表
 *
 * 使用方式：在 CSS 中定义这些变量，或在 JavaScript 中通过 style.setProperty 设置
 *
 * 变量命名规范:
 * - 前缀：--yoya-* (通用主题变量前缀)
 * - 格式：--yoya-{component}-{property}-{modifier}
 * - 示例：--yoya-card-bg-hover (卡片组件 - 背景色 - 悬停状态)
 */

// ============================================
// 基础主题变量
// ============================================

export const baseVariables = {
  // 主色
  '--yoya-primary': '#667eea',
  '--yoya-primary-hover': '#5a6fd6',
  '--yoya-primary-alpha': 'rgba(102, 126, 234, 0.1)',

  // 成功色
  '--yoya-success': '#28a745',
  '--yoya-success-hover': '#218838',

  // 警告色
  '--yoya-warning': '#ffc107',
  '--yoya-warning-hover': '#e0a800',

  // 错误色
  '--yoya-error': '#dc3545',
  '--yoya-error-hover': '#c82333',

  // 背景色
  '--yoya-bg': 'white',
  '--yoya-bg-secondary': '#f7f8fa',

  // 文本色
  '--yoya-text': '#333',
  '--yoya-text-secondary': '#666',

  // 边框色
  '--yoya-border': '#e0e0e0',

  // 间距
  '--yoya-padding-sm': '8px',
  '--yoya-padding-md': '16px',
  '--yoya-padding-lg': '24px',
  '--yoya-margin-md': '8px',
  '--yoya-gap-sm': '6px',
  '--yoya-gap-md': '12px',

  // 圆角
  '--yoya-radius-sm': '4px',
  '--yoya-radius-md': '8px',
  '--yoya-radius-lg': '12px',

  // 阴影
  '--yoya-shadow': '0 4px 12px rgba(0,0,0,0.15)',

  // 悬停背景
  '--yoya-hover-bg': 'rgba(102, 126, 234, 0.05)',
};

// ============================================
// Card 卡片组件变量
// ============================================

export const cardVariables = {
  '--yoya-card-bg': 'white',
  '--yoya-card-radius': '8px',
  '--yoya-card-shadow': '0 2px 8px rgba(0,0,0,0.1)',
  '--yoya-card-border': '1px solid transparent',
  '--yoya-card-hover-shadow': '0 4px 16px rgba(0,0,0,0.15)',

  // 头部
  '--yoya-card-header-padding': '16px',
  '--yoya-card-header-border': '1px solid #e0e0e0',
  '--yoya-card-header-font-weight': '600',
  '--yoya-card-header-font-size': '16px',
  '--yoya-card-header-color': '#333',
  '--yoya-card-header-bg': 'transparent',

  // 内容
  '--yoya-card-body-padding': '16px',
  '--yoya-card-body-font-size': '14px',
  '--yoya-card-body-color': '#333',
  '--yoya-card-body-bg': 'transparent',

  // 底部
  '--yoya-card-footer-padding': '16px',
  '--yoya-card-footer-border': '1px solid #e0e0e0',
  '--yoya-card-footer-gap': '8px',
  '--yoya-card-footer-font-size': '14px',
  '--yoya-card-footer-color': '#666',
  '--yoya-card-footer-bg': 'transparent',
};

// ============================================
// Button 按钮组件变量
// ============================================

export const buttonVariables = {
  '--yoya-button-padding': '8px 16px',
  '--yoya-button-padding-sm': '4px 10px',
  '--yoya-button-padding-lg': '10px 20px',
  '--yoya-button-font-size': '14px',
  '--yoya-button-font-size-sm': '12px',
  '--yoya-button-font-size-lg': '16px',
  '--yoya-button-height': '32px',
  '--yoya-button-height-sm': '24px',
  '--yoya-button-height-lg': '40px',
  '--yoya-button-min-width': '64px',
  '--yoya-button-radius': '6px',
};

// ============================================
// Menu 菜单组件变量
// ============================================

export const menuVariables = {
  // 菜单容器
  '--yoya-menu-bg': 'white',
  '--yoya-menu-radius': '8px',
  '--yoya-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
  '--yoya-menu-padding': '8px 0',
  '--yoya-menu-min-width': '160px',
  '--yoya-menu-border': '1px solid #e0e0e0',

  // 菜单项
  '--yoya-menu-item-padding': '10px',
  '--yoya-menu-item-horizontal-padding': '16px',
  '--yoya-menu-item-gap': '10px',
  '--yoya-menu-item-radius': '4px',
  '--yoya-menu-item-color': '#333',
  '--yoya-menu-item-font-size': '13px',
  '--yoya-menu-item-hover-bg': 'rgba(102, 126, 234, 0.05)',
  '--yoya-menu-item-active-bg': 'rgba(102, 126, 234, 0.1)',
  '--yoya-menu-item-active-font-weight': '500',
  '--yoya-menu-item-active-color': '#667eea',
  '--yoya-menu-item-disabled-opacity': '0.5',
  '--yoya-menu-item-disabled-cursor': 'not-allowed',
  '--yoya-menu-item-disabled-color': '#999',
  '--yoya-menu-item-danger-color': '#dc3545',

  // 分割线
  '--yoya-menu-divider-height': '1px',
  '--yoya-menu-divider-bg': '#e0e0e0',
  '--yoya-menu-divider-margin': '8px',

  // 菜单组
  '--yoya-menu-group-label-padding': '8px 16px 4px',
  '--yoya-menu-group-label-font-size': '12px',
  '--yoya-menu-group-label-color': '#999',
  '--yoya-menu-group-label-font-weight': '500',
  '--yoya-menu-group-label-letter-spacing': '0.5px',

  // 下拉菜单
  '--yoya-dropdown-trigger-padding': '8px 16px',
  '--yoya-dropdown-trigger-bg': '#667eea',
  '--yoya-dropdown-trigger-color': 'white',
  '--yoya-dropdown-trigger-radius': '6px',
  '--yoya-dropdown-trigger-gap': '6px',
  '--yoya-dropdown-trigger-hover-bg': '#5a6fd6',
  '--yoya-dropdown-arrow-size': '10px',
  '--yoya-dropdown-menu-offset': '4px',
  '--yoya-dropdown-menu-min-width': '160px',
  '--yoya-dropdown-menu-bg': 'white',
  '--yoya-dropdown-menu-radius': '8px',
  '--yoya-dropdown-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
  '--yoya-dropdown-menu-padding': '8px 0',
  '--yoya-dropdown-z-index': '1000',

  // 右键菜单
  '--yoya-context-menu-z-index': '9999',
  '--yoya-context-menu-bg': 'white',
  '--yoya-context-menu-radius': '8px',
  '--yoya-context-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
  '--yoya-context-menu-padding': '8px 0',
  '--yoya-context-menu-min-width': '160px',
  '--yoya-context-menu-border': '1px solid #e0e0e0',
};

// ============================================
// Message 消息组件变量
// ============================================

export const messageVariables = {
  // 容器
  '--yoya-message-z-index': '9999',
  '--yoya-message-gap': '10px',
  '--yoya-message-container-padding': '16px',
  '--yoya-message-max-width': '420px',

  // 消息体
  '--yoya-message-icon-size': '18px',
  '--yoya-message-icon-margin': '10px',
  '--yoya-message-font-size': '14px',
  '--yoya-message-line-height': '1.5',
  '--yoya-message-text-color': 'inherit',
  '--yoya-message-close-size': '20px',
  '--yoya-message-close-padding': '0 4px',
  '--yoya-message-close-opacity': '0.7',
  '--yoya-message-close-hover-opacity': '1',
  '--yoya-message-close-color': 'inherit',

  // 成功消息
  '--yoya-message-success-bg': 'rgba(74, 222, 128, 0.15)',
  '--yoya-message-success-color': '#166534',
  '--yoya-message-success-border': '1px solid rgba(74, 222, 128, 0.3)',

  // 错误消息
  '--yoya-message-error-bg': 'rgba(248, 113, 113, 0.15)',
  '--yoya-message-error-color': '#991b1b',
  '--yoya-message-error-border': '1px solid rgba(248, 113, 113, 0.3)',

  // 警告消息
  '--yoya-message-warning-bg': 'rgba(251, 191, 36, 0.15)',
  '--yoya-message-warning-color': '#92400e',
  '--yoya-message-warning-border': '1px solid rgba(251, 191, 36, 0.3)',

  // 信息消息
  '--yoya-message-info-bg': 'rgba(34, 211, 238, 0.15)',
  '--yoya-message-info-color': '#0e7490',
  '--yoya-message-info-border': '1px solid rgba(34, 211, 238, 0.3)',
};

// ============================================
// Code 代码组件变量
// ============================================

export const codeVariables = {
  // 容器
  '--yoya-code-bg': '#1e1e1e',
  '--yoya-code-radius': '8px',
  '--yoya-code-border': '1px solid rgba(255,255,255,0.1)',
  '--yoya-code-padding': '16px',
  '--yoya-code-font-size': '13px',
  '--yoya-code-line-height': '1.6',
  '--yoya-code-text-color': '#d4d4d4',
  '--yoya-code-font-family': '"Fira Code", "Consolas", "Monaco", monospace',

  // 标题栏
  '--yoya-code-header-padding': '10px 16px',
  '--yoya-code-header-bg': 'rgba(255,255,255,0.05)',
  '--yoya-code-header-border': '1px solid rgba(255,255,255,0.1)',
  '--yoya-code-title-color': '#007acc',
  '--yoya-code-title-font-size': '13px',
  '--yoya-code-title-font-weight': '600',

  // 复制按钮
  '--yoya-code-copy-padding': '4px 10px',
  '--yoya-code-copy-radius': '4px',
  '--yoya-code-copy-font-size': '12px',
  '--yoya-code-copy-bg': '#444',
  '--yoya-code-copy-color': '#ccc',
  '--yoya-code-copy-hover-bg': '#555',
  '--yoya-code-copy-hover-color': 'white',
  '--yoya-code-copy-success-bg': '#28a745',
  '--yoya-code-copy-success-color': 'white',

  // 语法高亮
  '--yoya-code-token-comment': '#6a9955',
  '--yoya-code-token-keyword': '#569cd6',
  '--yoya-code-token-string': '#ce9178',
  '--yoya-code-token-function': '#dcdcaa',
  '--yoya-code-token-number': '#b5cea8',
};

// ============================================
// Field 可编辑字段组件变量
// ============================================

export const fieldVariables = {
  // 基础
  '--yoya-field-gap': '6px',
  '--yoya-field-min-width': '80px',
  '--yoya-field-min-height': '32px',
  '--yoya-field-font-size': '14px',
  '--yoya-field-text-color': '#333',
  '--yoya-field-radius': '6px',

  // 显示状态
  '--yoya-field-show-gap': '4px',
  '--yoya-field-show-height': '32px',
  '--yoya-field-show-padding': '8px 12px',
  '--yoya-field-show-bg': 'transparent',
  '--yoya-field-show-border': '1px solid transparent',
  '--yoya-field-show-hover-bg': 'rgba(0,0,0,0.03)',
  '--yoya-field-show-hover-border': '#e0e0e0',

  // 编辑图标
  '--yoya-field-edit-icon-size': '12px',
  '--yoya-field-edit-icon-color': '#999',
  '--yoya-field-edit-icon-margin': '6px',

  // 编辑状态
  '--yoya-field-edit-gap': '6px',
  '--yoya-field-edit-padding': '4px',
  '--yoya-field-edit-bg': 'white',
  '--yoya-field-edit-border': '1px solid #e0e0e0',
  '--yoya-field-edit-shadow': '0 2px 8px rgba(0,0,0,0.1)',

  // 按钮
  '--yoya-field-btn-size': '24px',
  '--yoya-field-btn-padding': '0 6px',
  '--yoya-field-btn-radius': '4px',
  '--yoya-field-btn-font-size': '11px',
  '--yoya-field-btn-gap': '4px',
  '--yoya-field-save-bg': '#28a745',
  '--yoya-field-save-color': 'white',
  '--yoya-field-save-border': '1px solid #28a745',
  '--yoya-field-save-hover-bg': '#218838',
  '--yoya-field-cancel-bg': 'white',
  '--yoya-field-cancel-color': '#666',
  '--yoya-field-cancel-border': '1px solid #e0e0e0',
  '--yoya-field-cancel-hover-bg': '#f5f5f5',

  // 状态
  '--yoya-field-disabled-opacity': '0.5',
  '--yoya-field-disabled-cursor': 'not-allowed',
  '--yoya-field-loading-opacity': '0.7',
};

// ============================================
// Descriptions 详情组件变量
// ============================================

export const descriptionsVariables = {
  '--yoya-descriptions-font-size': '14px',
  '--yoya-descriptions-text': '#333',
  '--yoya-descriptions-bg': 'transparent',

  // 标题
  '--yoya-descriptions-title-padding': '12px 0',
  '--yoya-descriptions-title-size': '16px',
  '--yoya-descriptions-title-font-weight': '600',
  '--yoya-descriptions-title-color': '#333',
  '--yoya-descriptions-title-margin': '12px',

  // 表格
  '--yoya-descriptions-padding': '12px 16px',
  '--yoya-descriptions-border': '#e0e0e0',

  // 标签
  '--yoya-descriptions-label-bg': '#f7f8fa',
  '--yoya-descriptions-label-color': '#666',
  '--yoya-descriptions-label-font-weight': '500',
  '--yoya-descriptions-label-width': '120px',

  // 内容
  '--yoya-descriptions-content-color': '#333',
};

// ============================================
// Body 页面背景组件变量
// ============================================

export const bodyVariables = {
  // 背景
  '--yoya-body-bg': 'var(--yoya-bg, white)',
  '--yoya-body-bg-color': 'var(--yoya-body-bg, var(--yoya-bg, white))',

  // 尺寸
  '--yoya-body-min-height': '100vh',
  '--yoya-body-width': '100%',

  // 布局
  '--yoya-body-display': 'flex',
  '--yoya-body-flex-direction': 'column',
  '--yoya-body-align-items': 'stretch',
  '--yoya-body-justify-content': 'flex-start',

  // 间距
  '--yoya-body-padding': '0',
  '--yoya-body-margin': '0',

  // 过渡
  '--yoya-body-transition': 'background-color 0.3s ease, min-height 0.3s ease',

  // 全屏模式
  '--yoya-body-fullscreen-min-height': '100vh',
  '--yoya-body-fullscreen-width': '100%',
};

// ============================================
// 导出所有变量
// ============================================

export const allVariables = {
  ...baseVariables,
  ...cardVariables,
  ...buttonVariables,
  ...menuVariables,
  ...messageVariables,
  ...codeVariables,
  ...fieldVariables,
  ...descriptionsVariables,
  ...bodyVariables,
};

// ============================================
// 辅助函数：应用主题变量到指定元素
// ============================================

/**
 * 应用主题变量到指定元素
 * @param {HTMLElement} element - 目标元素
 * @param {Object} variables - 变量对象
 */
export function applyVariables(element, variables) {
  for (const [name, value] of Object.entries(variables)) {
    element.style.setProperty(name, value);
  }
}

/**
 * 应用主题变量到根元素
 * @param {Object} variables - 变量对象
 */
export function applyGlobalVariables(variables) {
  const root = document.documentElement;
  applyVariables(root, variables);
}

/**
 * 创建暗色主题变量
 * 完整的暗色主题变量定义 - 覆盖所有组件变量
 */
export function createDarkTheme() {
  return {
    // 基础色
    '--yoya-bg': '#1a1a1a',
    '--yoya-bg-secondary': '#2a2a2a',
    '--yoya-text': '#e0e0e0',
    '--yoya-text-secondary': '#a0a0a0',
    '--yoya-border': '#404040',
    '--yoya-hover-bg': 'rgba(255,255,255,0.05)',
    '--yoya-shadow': '0 4px 12px rgba(0,0,0,0.3)',

    // Card
    '--yoya-card-bg': '#2a2a2a',
    '--yoya-card-shadow': '0 2px 8px rgba(0,0,0,0.3)',
    '--yoya-card-header-border': '1px solid #404040',
    '--yoya-card-header-color': '#e0e0e0',
    '--yoya-card-body-color': '#e0e0e0',
    '--yoya-card-footer-border': '1px solid #404040',
    '--yoya-card-footer-color': '#a0a0a0',

    // Button
    '--yoya-button-bg': '#3a3a3a',
    '--yoya-button-text': '#e0e0e0',
    '--yoya-button-border': '1px solid #404040',

    // Menu
    '--yoya-menu-bg': '#2a2a2a',
    '--yoya-menu-shadow': '0 4px 12px rgba(0,0,0,0.3)',
    '--yoya-menu-border': '1px solid #404040',
    '--yoya-menu-item-color': '#e0e0e0',
    '--yoya-menu-item-hover-bg': 'rgba(255,255,255,0.05)',
    '--yoya-menu-item-active-bg': 'rgba(255,255,255,0.1)',
    '--yoya-menu-divider-bg': '#404040',
    '--yoya-menu-group-label-color': '#888',

    // Dropdown
    '--yoya-dropdown-menu-bg': '#2a2a2a',
    '--yoya-dropdown-menu-shadow': '0 4px 12px rgba(0,0,0,0.3)',
    '--yoya-context-menu-bg': '#2a2a2a',
    '--yoya-context-menu-shadow': '0 4px 12px rgba(0,0,0,0.3)',

    // Message (暗色模式使用纯色背景)
    '--yoya-message-success-bg': 'rgba(34, 197, 94, 0.15)',
    '--yoya-message-success-color': '#4ade80',
    '--yoya-message-success-border': '1px solid rgba(34, 197, 94, 0.3)',
    '--yoya-message-error-bg': 'rgba(239, 68, 68, 0.15)',
    '--yoya-message-error-color': '#f87171',
    '--yoya-message-error-border': '1px solid rgba(239, 68, 68, 0.3)',
    '--yoya-message-warning-bg': 'rgba(245, 158, 11, 0.15)',
    '--yoya-message-warning-color': '#fbbf24',
    '--yoya-message-warning-border': '1px solid rgba(245, 158, 11, 0.3)',
    '--yoya-message-info-bg': 'rgba(56, 189, 248, 0.15)',
    '--yoya-message-info-color': '#38bdf8',
    '--yoya-message-info-border': '1px solid rgba(56, 189, 248, 0.3)',

    // Code
    '--yoya-code-bg': '#2d2d2d',
    '--yoya-code-border': '1px solid rgba(255,255,255,0.1)',
    '--yoya-code-text-color': '#d4d4d4',

    // Field
    '--yoya-field-text-color': '#e0e0e0',
    '--yoya-field-edit-bg': '#2a2a2a',
    '--yoya-field-edit-border': '1px solid #404040',
    '--yoya-field-show-hover-bg': 'rgba(255,255,255,0.03)',
    '--yoya-field-show-hover-border': '#404040',

    // Descriptions
    '--yoya-descriptions-text': '#e0e0e0',
    '--yoya-descriptions-border': '#404040',
    '--yoya-descriptions-label-bg': '#2a2a2a',
    '--yoya-descriptions-label-color': '#a0a0a0',
    '--yoya-descriptions-content-color': '#e0e0e0',

    // Body
    '--yoya-body-bg': 'var(--yoya-bg, #1a1a1a)',
  };
}
