/**
 * Yoya.Basic - 主题变量配置
 * 所有组件支持的主题变量列表
 *
 * 使用方式：在 CSS 中定义这些变量，或在 JavaScript 中通过 style.setProperty 设置
 */

// ============================================
// 基础主题变量
// ============================================

export const baseVariables = {
  // 主色
  '--islands-primary': '#667eea',
  '--islands-primary-hover': '#5a6fd6',
  '--islands-primary-alpha': 'rgba(102, 126, 234, 0.1)',

  // 成功色
  '--islands-success': '#28a745',
  '--islands-success-hover': '#218838',

  // 警告色
  '--islands-warning': '#ffc107',
  '--islands-warning-hover': '#e0a800',

  // 错误色
  '--islands-error': '#dc3545',
  '--islands-error-hover': '#c82333',

  // 背景色
  '--islands-bg': 'white',
  '--islands-bg-secondary': '#f7f8fa',

  // 文本色
  '--islands-text': '#333',
  '--islands-text-secondary': '#666',

  // 边框色
  '--islands-border': '#e0e0e0',

  // 间距
  '--islands-padding-sm': '8px',
  '--islands-padding-md': '16px',
  '--islands-padding-lg': '24px',
  '--islands-margin-md': '8px',
  '--islands-gap-sm': '6px',
  '--islands-gap-md': '12px',

  // 圆角
  '--islands-radius-sm': '4px',
  '--islands-radius-md': '8px',
  '--islands-radius-lg': '12px',

  // 阴影
  '--islands-shadow': '0 4px 12px rgba(0,0,0,0.15)',

  // 悬停背景
  '--islands-hover-bg': 'rgba(102, 126, 234, 0.05)',
};

// ============================================
// Card 卡片组件变量
// ============================================

export const cardVariables = {
  '--islands-card-bg': 'white',
  '--islands-card-radius': '8px',
  '--islands-card-shadow': '0 2px 8px rgba(0,0,0,0.1)',
  '--islands-card-border': '1px solid transparent',
  '--islands-card-hover-shadow': '0 4px 16px rgba(0,0,0,0.15)',

  // 头部
  '--islands-card-header-padding': '16px',
  '--islands-card-header-border': '1px solid #e0e0e0',
  '--islands-card-header-font-weight': '600',
  '--islands-card-header-font-size': '16px',
  '--islands-card-header-color': '#333',
  '--islands-card-header-bg': 'transparent',

  // 内容
  '--islands-card-body-padding': '16px',
  '--islands-card-body-font-size': '14px',
  '--islands-card-body-color': '#333',
  '--islands-card-body-bg': 'transparent',

  // 底部
  '--islands-card-footer-padding': '16px',
  '--islands-card-footer-border': '1px solid #e0e0e0',
  '--islands-card-footer-gap': '8px',
  '--islands-card-footer-font-size': '14px',
  '--islands-card-footer-color': '#666',
  '--islands-card-footer-bg': 'transparent',
};

// ============================================
// Button 按钮组件变量
// ============================================

export const buttonVariables = {
  '--islands-button-padding': '8px 16px',
  '--islands-button-padding-sm': '4px 10px',
  '--islands-button-padding-lg': '10px 20px',
  '--islands-button-font-size': '14px',
  '--islands-button-font-size-sm': '12px',
  '--islands-button-font-size-lg': '16px',
  '--islands-button-height': '32px',
  '--islands-button-height-sm': '24px',
  '--islands-button-height-lg': '40px',
  '--islands-button-min-width': '64px',
  '--islands-button-radius': '6px',
};

// ============================================
// Menu 菜单组件变量
// ============================================

export const menuVariables = {
  // 菜单容器
  '--islands-menu-bg': 'white',
  '--islands-menu-radius': '8px',
  '--islands-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
  '--islands-menu-padding': '8px 0',
  '--islands-menu-min-width': '160px',
  '--islands-menu-border': '1px solid #e0e0e0',

  // 菜单项
  '--islands-menu-item-padding': '10px',
  '--islands-menu-item-horizontal-padding': '16px',
  '--islands-menu-item-gap': '10px',
  '--islands-menu-item-radius': '4px',
  '--islands-menu-item-color': '#333',
  '--islands-menu-item-font-size': '13px',
  '--islands-menu-item-hover-bg': 'rgba(102, 126, 234, 0.05)',
  '--islands-menu-item-active-bg': 'rgba(102, 126, 234, 0.1)',
  '--islands-menu-item-active-font-weight': '500',
  '--islands-menu-item-active-color': '#667eea',
  '--islands-menu-item-disabled-opacity': '0.5',
  '--islands-menu-item-disabled-cursor': 'not-allowed',
  '--islands-menu-item-disabled-color': '#999',
  '--islands-menu-item-danger-color': '#dc3545',

  // 分割线
  '--islands-menu-divider-height': '1px',
  '--islands-menu-divider-bg': '#e0e0e0',
  '--islands-menu-divider-margin': '8px',

  // 菜单组
  '--islands-menu-group-label-padding': '8px 16px 4px',
  '--islands-menu-group-label-font-size': '12px',
  '--islands-menu-group-label-color': '#999',
  '--islands-menu-group-label-font-weight': '500',
  '--islands-menu-group-label-letter-spacing': '0.5px',

  // 下拉菜单
  '--islands-dropdown-trigger-padding': '8px 16px',
  '--islands-dropdown-trigger-bg': '#667eea',
  '--islands-dropdown-trigger-color': 'white',
  '--islands-dropdown-trigger-radius': '6px',
  '--islands-dropdown-trigger-gap': '6px',
  '--islands-dropdown-trigger-hover-bg': '#5a6fd6',
  '--islands-dropdown-arrow-size': '10px',
  '--islands-dropdown-menu-offset': '4px',
  '--islands-dropdown-menu-min-width': '160px',
  '--islands-dropdown-menu-bg': 'white',
  '--islands-dropdown-menu-radius': '8px',
  '--islands-dropdown-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
  '--islands-dropdown-menu-padding': '8px 0',
  '--islands-dropdown-z-index': '1000',

  // 右键菜单
  '--islands-context-menu-z-index': '9999',
  '--islands-context-menu-bg': 'white',
  '--islands-context-menu-radius': '8px',
  '--islands-context-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
  '--islands-context-menu-padding': '8px 0',
  '--islands-context-menu-min-width': '160px',
  '--islands-context-menu-border': '1px solid #e0e0e0',
};

// ============================================
// Message 消息组件变量
// ============================================

export const messageVariables = {
  // 容器
  '--islands-message-z-index': '9999',
  '--islands-message-gap': '10px',
  '--islands-message-container-padding': '16px',
  '--islands-message-max-width': '420px',

  // 消息体
  '--islands-message-icon-size': '18px',
  '--islands-message-icon-margin': '10px',
  '--islands-message-font-size': '14px',
  '--islands-message-line-height': '1.5',
  '--islands-message-text-color': 'inherit',
  '--islands-message-close-size': '20px',
  '--islands-message-close-padding': '0 4px',
  '--islands-message-close-opacity': '0.7',
  '--islands-message-close-hover-opacity': '1',
  '--islands-message-close-color': 'inherit',

  // 成功消息
  '--islands-message-success-bg': 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
  '--islands-message-success-color': '#155724',
  '--islands-message-success-border': '1px solid #c3e6cb',

  // 错误消息
  '--islands-message-error-bg': 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
  '--islands-message-error-color': '#721c24',
  '--islands-message-error-border': '1px solid #f5c6cb',

  // 警告消息
  '--islands-message-warning-bg': 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
  '--islands-message-warning-color': '#856404',
  '--islands-message-warning-border': '1px solid #ffeaa7',

  // 信息消息
  '--islands-message-info-bg': 'linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%)',
  '--islands-message-info-color': '#0c5460',
  '--islands-message-info-border': '1px solid #bee5eb',
};

// ============================================
// Code 代码组件变量
// ============================================

export const codeVariables = {
  // 容器
  '--islands-code-bg': '#1e1e1e',
  '--islands-code-radius': '8px',
  '--islands-code-border': '1px solid rgba(255,255,255,0.1)',
  '--islands-code-padding': '16px',
  '--islands-code-font-size': '13px',
  '--islands-code-line-height': '1.6',
  '--islands-code-text-color': '#d4d4d4',
  '--islands-code-font-family': '"Fira Code", "Consolas", "Monaco", monospace',

  // 标题栏
  '--islands-code-header-padding': '10px 16px',
  '--islands-code-header-bg': 'rgba(255,255,255,0.05)',
  '--islands-code-header-border': '1px solid rgba(255,255,255,0.1)',
  '--islands-code-title-color': '#007acc',
  '--islands-code-title-font-size': '13px',
  '--islands-code-title-font-weight': '600',

  // 复制按钮
  '--islands-code-copy-padding': '4px 10px',
  '--islands-code-copy-radius': '4px',
  '--islands-code-copy-font-size': '12px',
  '--islands-code-copy-bg': '#444',
  '--islands-code-copy-color': '#ccc',
  '--islands-code-copy-hover-bg': '#555',
  '--islands-code-copy-hover-color': 'white',
  '--islands-code-copy-success-bg': '#28a745',
  '--islands-code-copy-success-color': 'white',

  // 语法高亮
  '--islands-code-token-comment': '#6a9955',
  '--islands-code-token-keyword': '#569cd6',
  '--islands-code-token-string': '#ce9178',
  '--islands-code-token-function': '#dcdcaa',
  '--islands-code-token-number': '#b5cea8',
};

// ============================================
// Field 可编辑字段组件变量
// ============================================

export const fieldVariables = {
  // 基础
  '--islands-field-gap': '6px',
  '--islands-field-min-width': '80px',
  '--islands-field-min-height': '32px',
  '--islands-field-font-size': '14px',
  '--islands-field-text-color': '#333',
  '--islands-field-radius': '6px',

  // 显示状态
  '--islands-field-show-gap': '4px',
  '--islands-field-show-height': '32px',
  '--islands-field-show-padding': '8px 12px',
  '--islands-field-show-bg': 'transparent',
  '--islands-field-show-border': '1px solid transparent',
  '--islands-field-show-hover-bg': 'rgba(0,0,0,0.03)',
  '--islands-field-show-hover-border': '#e0e0e0',

  // 编辑图标
  '--islands-field-edit-icon-size': '12px',
  '--islands-field-edit-icon-color': '#999',
  '--islands-field-edit-icon-margin': '6px',

  // 编辑状态
  '--islands-field-edit-gap': '6px',
  '--islands-field-edit-padding': '4px',
  '--islands-field-edit-bg': 'white',
  '--islands-field-edit-border': '1px solid #e0e0e0',
  '--islands-field-edit-shadow': '0 2px 8px rgba(0,0,0,0.1)',

  // 按钮
  '--islands-field-btn-size': '24px',
  '--islands-field-btn-padding': '0 6px',
  '--islands-field-btn-radius': '4px',
  '--islands-field-btn-font-size': '11px',
  '--islands-field-btn-gap': '4px',
  '--islands-field-save-bg': '#28a745',
  '--islands-field-save-color': 'white',
  '--islands-field-save-border': '1px solid #28a745',
  '--islands-field-save-hover-bg': '#218838',
  '--islands-field-cancel-bg': 'white',
  '--islands-field-cancel-color': '#666',
  '--islands-field-cancel-border': '1px solid #e0e0e0',
  '--islands-field-cancel-hover-bg': '#f5f5f5',

  // 状态
  '--islands-field-disabled-opacity': '0.5',
  '--islands-field-disabled-cursor': 'not-allowed',
  '--islands-field-loading-opacity': '0.7',
};

// ============================================
// Descriptions 详情组件变量
// ============================================

export const descriptionsVariables = {
  '--islands-descriptions-font-size': '14px',
  '--islands-descriptions-text': '#333',
  '--islands-descriptions-bg': 'transparent',

  // 标题
  '--islands-descriptions-title-padding': '12px 0',
  '--islands-descriptions-title-size': '16px',
  '--islands-descriptions-title-font-weight': '600',
  '--islands-descriptions-title-color': '#333',
  '--islands-descriptions-title-margin': '12px',

  // 表格
  '--islands-descriptions-padding': '12px 16px',
  '--islands-descriptions-border': '#e0e0e0',

  // 标签
  '--islands-descriptions-label-bg': '#f7f8fa',
  '--islands-descriptions-label-color': '#666',
  '--islands-descriptions-label-font-weight': '500',
  '--islands-descriptions-label-width': '120px',

  // 内容
  '--islands-descriptions-content-color': '#333',
};

// ============================================
// Body 页面背景组件变量
// ============================================

export const bodyVariables = {
  // 背景
  '--islands-body-bg': 'var(--islands-bg, white)',
  '--islands-body-bg-color': 'var(--islands-body-bg, var(--islands-bg, white))',

  // 尺寸
  '--islands-body-min-height': '100vh',
  '--islands-body-width': '100%',

  // 布局
  '--islands-body-display': 'flex',
  '--islands-body-flex-direction': 'column',
  '--islands-body-align-items': 'stretch',
  '--islands-body-justify-content': 'flex-start',

  // 间距
  '--islands-body-padding': '0',
  '--islands-body-margin': '0',

  // 过渡
  '--islands-body-transition': 'background-color 0.3s ease, min-height 0.3s ease',

  // 全屏模式
  '--islands-body-fullscreen-min-height': '100vh',
  '--islands-body-fullscreen-width': '100%',
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
 */
export function createDarkTheme() {
  return {
    '--islands-bg': '#1a1a1a',
    '--islands-bg-secondary': '#2a2a2a',
    '--islands-text': '#e0e0e0',
    '--islands-text-secondary': '#a0a0a0',
    '--islands-border': '#404040',
    '--islands-card-bg': '#2a2a2a',
    '--islands-menu-bg': '#2a2a2a',
    '--islands-dropdown-menu-bg': '#2a2a2a',
    '--islands-context-menu-bg': '#2a2a2a',
    '--islands-field-edit-bg': '#2a2a2a',
    '--islands-button-bg': '#3a3a3a',
    '--islands-hover-bg': 'rgba(255,255,255,0.05)',
  };
}
