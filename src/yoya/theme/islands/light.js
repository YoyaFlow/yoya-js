/**
 * Islands 主题 - 浅色模式
 * Small 尺寸规格
 */

import { Theme } from '../../core/theme.js';

// Small 尺寸规格
const size = {
  paddingXs: '4px',
  paddingSm: '6px',
  paddingMd: '8px',
  paddingLg: '10px',
  marginXs: '4px',
  marginSm: '6px',
  marginMd: '8px',
  marginLg: '10px',
  gapXs: '4px',
  gapSm: '6px',
  gapMd: '8px',
  gapLg: '10px',
  radiusSm: '4px',
  radiusMd: '6px',
  radiusLg: '8px',
  fontSizeSm: '12px',
  fontSizeMd: '13px',
};

/**
 * 创建 Islands 浅色主题
 */
export function createLightTheme() {
  const theme = new Theme('islands:light');

  // 定义颜色变量 - JetBrains Islands 浅色主题配色
  const colors = {
    // 主色调 - JetBrains 蓝紫色
    primary: '#5A67D6',        // 主要交互色
    primaryLight: '#7B85EE',    // 悬停/高亮
    primaryDark: '#4655B8',     // 按压/激活
    primaryAlpha: 'rgba(90, 103, 214, 0.1)',  // 半透明背景

    // 背景色 - Islands 风格白色系
    background: '#FFFFFF',
    backgroundSecondary: '#F5F6F7',   // 次级背景（表头、分组）
    backgroundTertiary: '#EBECED',    // 第三级背景（禁用、不可用）
    backgroundHover: '#E8EAED',       // 悬停背景

    // 文字颜色 - JetBrains 灰度体系
    textPrimary: '#2B2D30',     // 主要文字
    textSecondary: '#6B6E75',   // 次要文字/描述
    textTertiary: '#9A9DA3',    // 辅助文字
    textDisabled: '#B8BAC0',    // 禁用文字
    textLink: '#3574F0',        // 链接色

    // 边框 - JetBrains 边框色
    border: '#D3D3D6',          // 主边框
    borderLight: '#E5E5E7',     // 次级边框
    borderFocus: '#5A67D6',     // 聚焦边框
    borderHover: '#A8A8AC',     // 悬停边框

    // 状态色 - JetBrains 语义色
    success: '#49B85C',         // 成功（绿色）
    successBg: 'rgba(73, 184, 92, 0.1)',
    warning: '#F0A664',         // 警告（橙色）
    warningBg: 'rgba(240, 166, 100, 0.1)',
    error: '#E05252',           // 错误（红色）
    errorBg: 'rgba(224, 82, 82, 0.1)',
    info: '#4FB3E4',            // 信息（蓝色）
    infoBg: 'rgba(79, 179, 228, 0.1)',

    //  selection - 选区背景
    selection: 'rgba(90, 103, 214, 0.2)',
    selectionInactive: 'rgba(90, 103, 214, 0.1)',

    // 阴影 - JetBrains 柔和阴影
    shadow: 'rgba(30, 32, 35, 0.08)',
    shadowHover: 'rgba(30, 32, 35, 0.12)',
    shadowDropdown: 'rgba(30, 32, 35, 0.15)',

    // 特殊效果
    overlay: 'rgba(30, 32, 35, 0.5)',
    scrim: 'rgba(0, 0, 0, 0.32)',
  };

  // 全局样式变量
  theme.variables = {
    '--yoya-primary': colors.primary,
    '--yoya-primary-light': colors.primaryLight,
    '--yoya-primary-dark': colors.primaryDark,
    '--yoya-primary-alpha': colors.primaryAlpha,
    '--yoya-bg': colors.background,
    '--yoya-bg-secondary': colors.backgroundSecondary,
    '--yoya-bg-tertiary': colors.backgroundTertiary,
    '--yoya-bg-hover': colors.backgroundHover,
    '--yoya-text': colors.textPrimary,
    '--yoya-text-secondary': colors.textSecondary,
    '--yoya-text-tertiary': colors.textTertiary,
    '--yoya-text-disabled': colors.textDisabled,
    '--yoya-text-link': colors.textLink,
    '--yoya-border': colors.border,
    '--yoya-border-light': colors.borderLight,
    '--yoya-border-focus': colors.borderFocus,
    '--yoya-border-hover': colors.borderHover,
    '--yoya-success': colors.success,
    '--yoya-success-bg': colors.successBg,
    '--yoya-warning': colors.warning,
    '--yoya-warning-bg': colors.warningBg,
    '--yoya-error': colors.error,
    '--yoya-error-bg': colors.errorBg,
    '--yoya-info': colors.info,
    '--yoya-info-bg': colors.infoBg,
    '--yoya-selection': colors.selection,
    '--yoya-selection-inactive': colors.selectionInactive,
    '--yoya-shadow': colors.shadow,
    '--yoya-shadow-hover': colors.shadowHover,
    '--yoya-shadow-dropdown': colors.shadowDropdown,
    '--yoya-hover-bg': colors.backgroundHover,
    '--yoya-error-alpha': colors.errorBg,
    '--yoya-overlay': colors.overlay,
    // 尺寸变量
    '--yoya-padding-xs': size.paddingXs,
    '--yoya-padding-sm': size.paddingSm,
    '--yoya-padding-md': size.paddingMd,
    '--yoya-padding-lg': size.paddingLg,
    '--yoya-margin-xs': size.marginXs,
    '--yoya-margin-sm': size.marginSm,
    '--yoya-margin-md': size.marginMd,
    '--yoya-margin-lg': size.marginLg,
    '--yoya-gap-xs': size.gapXs,
    '--yoya-gap-sm': size.gapSm,
    '--yoya-gap-md': size.gapMd,
    '--yoya-gap-lg': size.gapLg,
    '--yoya-radius-sm': size.radiusSm,
    '--yoya-radius-md': size.radiusMd,
    '--yoya-radius-lg': size.radiusLg,
    '--yoya-font-size-sm': size.fontSizeSm,
    '--yoya-font-size-md': size.fontSizeMd,
    // 按钮变量
    '--yoya-button-padding': '8px 16px',
    '--yoya-button-padding-lg': '10px 20px',
    '--yoya-button-padding-sm': '4px 10px',
    '--yoya-button-font-size': '14px',
    '--yoya-button-font-size-lg': '16px',
    '--yoya-button-font-size-sm': '12px',
    '--yoya-button-height': '32px',
    '--yoya-button-height-lg': '40px',
    '--yoya-button-height-sm': '24px',
    '--yoya-button-radius': '6px',
    '--yoya-button-min-width': '64px',
    '--yoya-button-primary-bg': colors.primary,
    '--yoya-button-primary-hover': colors.primaryLight,
    '--yoya-button-primary-active': colors.primaryDark,
    '--yoya-button-success-bg': colors.success,
    '--yoya-button-success-hover': '#3D9F4E',
    '--yoya-button-warning-bg': colors.warning,
    '--yoya-button-warning-hover': '#E0962E',
    '--yoya-button-danger-bg': colors.error,
    '--yoya-button-danger-hover': '#C84646',
    '--yoya-button-default-bg': colors.background,
    '--yoya-button-default-hover': colors.backgroundHover,
    '--yoya-button-default-border': colors.border,
    // 输入框变量
    '--yoya-input-padding': '8px 12px',
    '--yoya-input-padding-lg': '10px 16px',
    '--yoya-input-padding-sm': '4px 8px',
    '--yoya-input-font-size': '14px',
    '--yoya-input-font-size-lg': '16px',
    '--yoya-input-font-size-sm': '12px',
    '--yoya-input-height': '32px',
    '--yoya-input-height-lg': '40px',
    '--yoya-input-height-sm': '24px',
    '--yoya-input-radius': '6px',
    '--yoya-input-border': colors.border,
    '--yoya-input-bg': colors.background,
    '--yoya-input-text': colors.textPrimary,
    '--yoya-input-disabled-bg': colors.backgroundTertiary,
    // 选择框变量
    '--yoya-select-padding': '8px 12px',
    '--yoya-select-padding-lg': '10px 16px',
    '--yoya-select-padding-sm': '4px 8px',
    '--yoya-select-font-size': '14px',
    '--yoya-select-font-size-lg': '16px',
    '--yoya-select-font-size-sm': '12px',
    '--yoya-select-height': '32px',
    '--yoya-select-height-lg': '40px',
    '--yoya-select-height-sm': '24px',
    '--yoya-select-radius': '6px',
    '--yoya-select-border': colors.border,
    '--yoya-select-bg': colors.background,
    '--yoya-select-text': colors.textPrimary,
    '--yoya-select-disabled-bg': colors.backgroundTertiary,
    // 文本域变量
    '--yoya-textarea-padding': '8px 12px',
    '--yoya-textarea-font-size': '14px',
    '--yoya-textarea-radius': '6px',
    '--yoya-textarea-border': colors.border,
    '--yoya-textarea-bg': colors.background,
    '--yoya-textarea-text': colors.textPrimary,
    '--yoya-textarea-disabled-bg': colors.backgroundTertiary,
    '--yoya-textarea-min-height': '80px',
    // 复选框变量
    '--yoya-checkbox-font-size': '14px',
    '--yoya-checkbox-text': colors.textPrimary,
    // 开关变量
    '--yoya-switch-width': '44px',
    '--yoya-switch-height': '22px',
    '--yoya-switch-bg': colors.border,
    // 表单变量
    '--yoya-form-gap': '16px',
    // 详情展示变量
    '--yoya-descriptions-font-size': '14px',
    '--yoya-descriptions-text': colors.textPrimary,
    '--yoya-descriptions-title-size': '16px',
    '--yoya-descriptions-title-color': colors.textPrimary,
    '--yoya-descriptions-title-padding': '12px 0',
    '--yoya-descriptions-padding': '12px 16px',
    '--yoya-descriptions-border': colors.border,
    '--yoya-descriptions-label-bg': colors.backgroundSecondary,
    '--yoya-descriptions-label-color': colors.textSecondary,
    '--yoya-descriptions-content-color': colors.textPrimary,
    // 字段编辑变量
    '--yoya-field-padding': '4px 8px',
    '--yoya-field-radius': '4px',
    '--yoya-field-min-width': '80px',
    '--yoya-field-min-height': '24px',
    // 代码变量
    '--yoya-code-bg': '#1e1e1e',
    '--yoya-code-radius': '8px',
    '--yoya-code-border': '1px solid rgba(255,255,255,0.1)',
    '--yoya-code-padding': '16px',
    '--yoya-code-font-size': '13px',
    '--yoya-code-line-height': '1.6',
    '--yoya-code-text-color': '#d4d4d4',
    '--yoya-code-font-family': '"Fira Code", "Consolas", "Monaco", monospace',
    '--yoya-code-header-padding': '10px 16px',
    '--yoya-code-header-bg': 'rgba(255,255,255,0.05)',
    '--yoya-code-header-border': '1px solid rgba(255,255,255,0.1)',
    '--yoya-code-title-color': '#007acc',
    '--yoya-code-title-font-size': '13px',
    '--yoya-code-title-font-weight': '600',
    '--yoya-code-copy-padding': '4px 10px',
    '--yoya-code-copy-radius': '4px',
    '--yoya-code-copy-font-size': '12px',
    '--yoya-code-copy-bg': '#444',
    '--yoya-code-copy-color': '#ccc',
    '--yoya-code-copy-hover-bg': '#555',
    '--yoya-code-copy-hover-color': 'white',
    '--yoya-code-copy-success-bg': '#28a745',
    '--yoya-code-copy-success-color': 'white',
    // 消息变量
    '--yoya-message-z-index': '9999',
    '--yoya-message-gap': '10px',
    '--yoya-message-container-padding': '16px',
    '--yoya-message-max-width': '420px',
    '--yoya-message-icon-size': '18px',
    '--yoya-message-icon-margin': '10px',
    '--yoya-message-font-size': '14px',
    '--yoya-message-line-height': '1.5',
    '--yoya-message-close-size': '20px',
    '--yoya-message-close-padding': '0 4px',
    '--yoya-message-close-opacity': '0.7',
    '--yoya-message-close-hover-opacity': '1',
    '--yoya-message-success-bg': colors.successBg,
    '--yoya-message-success-color': colors.success,
    '--yoya-message-success-border': `1px solid ${colors.success}`,
    '--yoya-message-error-bg': colors.errorBg,
    '--yoya-message-error-color': colors.error,
    '--yoya-message-error-border': `1px solid ${colors.error}`,
    '--yoya-message-warning-bg': colors.warningBg,
    '--yoya-message-warning-color': colors.warning,
    '--yoya-message-warning-border': `1px solid ${colors.warning}`,
    '--yoya-message-info-bg': colors.infoBg,
    '--yoya-message-info-color': colors.info,
    '--yoya-message-info-border': `1px solid ${colors.info}`,
    // 菜单变量
    '--yoya-menu-bg': 'white',
    '--yoya-menu-radius': '8px',
    '--yoya-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
    '--yoya-menu-padding': '8px 0',
    '--yoya-menu-min-width': '160px',
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
    '--yoya-menu-item-danger-color': '#dc3545',
    '--yoya-menu-divider-height': '1px',
    '--yoya-menu-divider-bg': '#e0e0e0',
    '--yoya-menu-group-label-padding': '8px 16px 4px',
    '--yoya-menu-group-label-font-size': '12px',
    '--yoya-menu-group-label-color': '#999',
    '--yoya-dropdown-trigger-bg': '#667eea',
    '--yoya-dropdown-trigger-color': 'white',
    '--yoya-dropdown-trigger-radius': '6px',
    '--yoya-dropdown-menu-bg': 'white',
    '--yoya-dropdown-menu-radius': '8px',
    '--yoya-dropdown-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
    '--yoya-context-menu-bg': 'white',
    '--yoya-context-menu-radius': '8px',
    '--yoya-context-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
    // 表格变量
    '--yoya-table-bg': colors.background,
    '--yoya-table-text': colors.textPrimary,
    '--yoya-table-border': colors.border,
    '--yoya-table-head-bg': colors.backgroundSecondary,
    '--yoya-table-head-color': colors.textPrimary,
    '--yoya-table-body-bg': colors.background,
    '--yoya-table-foot-bg': colors.backgroundSecondary,
    '--yoya-table-row-border': colors.border,
    '--yoya-table-cell-color': colors.textPrimary,
    '--yoya-table-cell-padding': '12px 16px',
    '--yoya-table-head-padding': '12px 16px',
    '--yoya-table-striped-bg': colors.backgroundSecondary,
    '--yoya-table-hover-bg': 'rgba(102, 126, 234, 0.05)',
    '--yoya-table-font-size': '14px',
  };

  // 组件主题定义
  theme.componentThemes = {
    // 按钮
    Button: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          background: colors.backgroundTertiary,
        },
      },
      baseStyles: {
        padding: `${size.paddingSm} ${size.paddingMd}`,
        fontSize: size.fontSizeSm,
        borderRadius: size.radiusSm,
      },
    },

    // 菜单
    Menu: {
      stateStyles: {},
      baseStyles: {
        background: colors.background,
        borderRadius: size.radiusMd,
        boxShadow: `0 2px 8px ${colors.shadow}`,
        padding: `${size.paddingSm} 0`,
        minWidth: '140px',
      },
    },

    // 菜单项
    MenuItem: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
        active: {
          background: 'rgba(102, 126, 234, 0.1)',
          fontWeight: '500',
        },
        danger: {
          color: colors.error,
        },
      },
      baseStyles: {
        padding: `${size.paddingSm} ${size.paddingMd}`,
        cursor: 'pointer',
        alignItems: 'center',
        gap: size.gapSm,
        transition: 'background-color 0.2s',
        borderRadius: size.radiusSm,
        color: colors.textPrimary,
        fontSize: size.fontSizeSm,
      },
    },

    // 卡片
    Card: {
      stateStyles: {},
      baseStyles: {
        background: colors.background,
        borderRadius: size.radiusLg,
        boxShadow: `0 2px 8px ${colors.shadow}`,
        overflow: 'hidden',
      },
    },

    // 卡片头部
    CardHeader: {
      stateStyles: {},
      baseStyles: {
        padding: `${size.paddingMd} ${size.paddingLg}`,
        borderBottom: `1px solid ${colors.borderLight}`,
        background: colors.backgroundSecondary,
        fontSize: size.fontSizeMd,
      },
    },

    // 卡片内容
    CardBody: {
      stateStyles: {},
      baseStyles: {
        padding: `${size.paddingMd} ${size.paddingLg}`,
        fontSize: size.fontSizeMd,
      },
    },

    // 卡片底部
    CardFooter: {
      stateStyles: {},
      baseStyles: {
        padding: `${size.paddingMd} ${size.paddingLg}`,
        borderTop: `1px solid ${colors.borderLight}`,
        background: colors.backgroundSecondary,
        fontSize: size.fontSizeSm,
      },
    },

    // 消息
    Message: {
      stateStyles: {},
      variants: {
        success: {
          background: '#d4edda',
          border: '1px solid #c3e6cb',
          color: '#155724',
        },
        error: {
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
        },
        warning: {
          background: '#fff3cd',
          border: '1px solid #ffeeba',
          color: '#856404',
        },
        info: {
          background: '#d1ecf1',
          border: '1px solid #bee5eb',
          color: '#0c5460',
        },
      },
      baseStyles: {
        padding: `${size.paddingSm} ${size.paddingMd}`,
        borderRadius: size.radiusMd,
        fontSize: size.fontSizeSm,
        margin: `${size.marginSm} 0`,
      },
    },

    // 输入框
    Input: {
      stateStyles: {
        disabled: {
          background: colors.backgroundTertiary,
          cursor: 'not-allowed',
        },
      },
      baseStyles: {
        padding: `${size.paddingSm} ${size.paddingMd}`,
        border: `1px solid ${colors.border}`,
        borderRadius: size.radiusSm,
        fontSize: size.fontSizeSm,
        transition: 'border-color 0.2s, box-shadow 0.2s',
      },
    },

    // 分隔线
    Divider: {
      stateStyles: {},
      baseStyles: {
        height: '1px',
        background: colors.border,
        margin: `${size.marginMd} 0`,
      },
    },

    // 按钮组件
    VButton: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
        loading: {
          cursor: 'wait',
          pointerEvents: 'none',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: size.gapSm,
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '400',
        borderRadius: size.radiusSm,
        border: '1px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.2s',
        outline: 'none',
        minWidth: '64px',
        height: '32px',
      },
    },

    // 输入框组件
    VInput: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          background: colors.backgroundTertiary,
        },
        error: {
          borderColor: colors.error,
          boxShadow: '0 0 0 2px rgba(220, 53, 69, 0.2)',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        width: '100%',
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: size.radiusSm,
        border: `1px solid ${colors.border}`,
        background: colors.background,
        color: colors.textPrimary,
        transition: 'all 0.2s',
        outline: 'none',
        height: '32px',
        boxSizing: 'border-box',
      },
    },

    // 选择框组件
    VSelect: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          background: colors.backgroundTertiary,
        },
        error: {
          borderColor: colors.error,
          boxShadow: '0 0 0 2px rgba(220, 53, 69, 0.2)',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        width: '100%',
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: size.radiusSm,
        border: `1px solid ${colors.border}`,
        background: colors.background,
        color: colors.textPrimary,
        transition: 'all 0.2s',
        outline: 'none',
        height: '32px',
        boxSizing: 'border-box',
        cursor: 'pointer',
      },
    },

    // 文本域组件
    VTextarea: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          background: colors.backgroundTertiary,
        },
        error: {
          borderColor: colors.error,
          boxShadow: '0 0 0 2px rgba(220, 53, 69, 0.2)',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        width: '100%',
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: size.radiusSm,
        border: `1px solid ${colors.border}`,
        background: colors.background,
        color: colors.textPrimary,
        transition: 'all 0.2s',
        outline: 'none',
        boxSizing: 'border-box',
        minHeight: '80px',
      },
    },

    // 复选框组件
    VCheckbox: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: size.gapSm,
        cursor: 'pointer',
        fontSize: '14px',
        color: colors.textPrimary,
        userSelect: 'none',
      },
    },

    // 开关组件
    VSwitch: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        width: '44px',
        height: '22px',
        borderRadius: '11px',
        background: colors.border,
        padding: '2px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        boxSizing: 'border-box',
      },
    },

    // 表单容器
    VForm: {
      stateStyles: {},
      baseStyles: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
      },
    },

    // 详情展示
    VDescriptions: {
      stateStyles: {},
      baseStyles: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        fontSize: '14px',
        color: colors.textPrimary,
      },
    },

    // 可编辑字段
    VField: {
      stateStyles: {
        disabled: {
          opacity: '0.5',
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
      },
      baseStyles: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: size.gapSm,
        padding: '4px 8px',
        borderRadius: size.radiusSm,
        border: '1px dashed transparent',
        minWidth: '80px',
        minHeight: '24px',
        position: 'relative',
        boxSizing: 'border-box',
        transition: 'all 0.2s',
      },
    },

    // 页面背景
    VBody: {
      stateStyles: {},
      baseStyles: {
        display: 'flex',
        flexDirection: 'column',
        background: colors.background,
        minHeight: '100vh',
        width: '100%',
        transition: 'background-color 0.3s ease',
      },
    },

    // 表格
    VTable: {
      stateStyles: {
        bordered: {
          border: '1px solid var(--yoya-table-border)',
        },
        compact: {
          '--yoya-table-cell-padding': '8px 12px',
        },
      },
      baseStyles: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 'var(--yoya-table-font-size, 14px)',
        color: 'var(--yoya-table-text)',
        background: 'var(--yoya-table-bg)',
      },
    },

    // 表格行
    VTr: {
      stateStyles: {
        striped: {
          background: 'var(--yoya-table-striped-bg)',
        },
        hoverable: {
          transition: 'background-color 0.2s',
        },
      },
      baseStyles: {
        transition: 'background-color 0.2s',
      },
    },

    // 表格头单元格
    VTh: {
      stateStyles: {},
      baseStyles: {
        padding: 'var(--yoya-table-head-padding)',
        textAlign: 'left',
        fontWeight: '600',
        color: 'var(--yoya-table-head-color)',
        borderBottom: '2px solid var(--yoya-table-border)',
        whiteSpace: 'nowrap',
      },
    },

    // 表格单元格
    VTd: {
      stateStyles: {},
      baseStyles: {
        padding: 'var(--yoya-table-cell-padding)',
        borderBottom: '1px solid var(--yoya-table-row-border)',
        color: 'var(--yoya-table-cell-color)',
        verticalAlign: 'middle',
      },
    },

    // 表格头部
    VThead: {
      stateStyles: {},
      baseStyles: {
        background: 'var(--yoya-table-head-bg)',
        borderBottom: '2px solid var(--yoya-table-border)',
      },
    },

    // 表格主体
    VTbody: {
      stateStyles: {},
      baseStyles: {
        background: 'var(--yoya-table-body-bg)',
      },
    },

    // 表格底部
    VTfoot: {
      stateStyles: {},
      baseStyles: {
        background: 'var(--yoya-table-foot-bg)',
        borderTop: '2px solid var(--yoya-table-border)',
      },
    },
  };

  return theme;
}

export default createLightTheme;
