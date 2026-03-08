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
    '--islands-primary': colors.primary,
    '--islands-primary-light': colors.primaryLight,
    '--islands-primary-dark': colors.primaryDark,
    '--islands-primary-alpha': colors.primaryAlpha,
    '--islands-bg': colors.background,
    '--islands-bg-secondary': colors.backgroundSecondary,
    '--islands-bg-tertiary': colors.backgroundTertiary,
    '--islands-bg-hover': colors.backgroundHover,
    '--islands-text': colors.textPrimary,
    '--islands-text-secondary': colors.textSecondary,
    '--islands-text-tertiary': colors.textTertiary,
    '--islands-text-disabled': colors.textDisabled,
    '--islands-text-link': colors.textLink,
    '--islands-border': colors.border,
    '--islands-border-light': colors.borderLight,
    '--islands-border-focus': colors.borderFocus,
    '--islands-border-hover': colors.borderHover,
    '--islands-success': colors.success,
    '--islands-success-bg': colors.successBg,
    '--islands-warning': colors.warning,
    '--islands-warning-bg': colors.warningBg,
    '--islands-error': colors.error,
    '--islands-error-bg': colors.errorBg,
    '--islands-info': colors.info,
    '--islands-info-bg': colors.infoBg,
    '--islands-selection': colors.selection,
    '--islands-selection-inactive': colors.selectionInactive,
    '--islands-shadow': colors.shadow,
    '--islands-shadow-hover': colors.shadowHover,
    '--islands-shadow-dropdown': colors.shadowDropdown,
    '--islands-hover-bg': colors.backgroundHover,
    '--islands-error-alpha': colors.errorBg,
    '--islands-overlay': colors.overlay,
    // 尺寸变量
    '--islands-padding-xs': size.paddingXs,
    '--islands-padding-sm': size.paddingSm,
    '--islands-padding-md': size.paddingMd,
    '--islands-padding-lg': size.paddingLg,
    '--islands-margin-xs': size.marginXs,
    '--islands-margin-sm': size.marginSm,
    '--islands-margin-md': size.marginMd,
    '--islands-margin-lg': size.marginLg,
    '--islands-gap-xs': size.gapXs,
    '--islands-gap-sm': size.gapSm,
    '--islands-gap-md': size.gapMd,
    '--islands-gap-lg': size.gapLg,
    '--islands-radius-sm': size.radiusSm,
    '--islands-radius-md': size.radiusMd,
    '--islands-radius-lg': size.radiusLg,
    '--islands-font-size-sm': size.fontSizeSm,
    '--islands-font-size-md': size.fontSizeMd,
    // 按钮变量
    '--islands-button-padding': '8px 16px',
    '--islands-button-padding-lg': '10px 20px',
    '--islands-button-padding-sm': '4px 10px',
    '--islands-button-font-size': '14px',
    '--islands-button-font-size-lg': '16px',
    '--islands-button-font-size-sm': '12px',
    '--islands-button-height': '32px',
    '--islands-button-height-lg': '40px',
    '--islands-button-height-sm': '24px',
    '--islands-button-radius': '6px',
    '--islands-button-min-width': '64px',
    '--islands-button-primary-bg': colors.primary,
    '--islands-button-primary-hover': colors.primaryLight,
    '--islands-button-primary-active': colors.primaryDark,
    '--islands-button-success-bg': colors.success,
    '--islands-button-success-hover': '#3D9F4E',
    '--islands-button-warning-bg': colors.warning,
    '--islands-button-warning-hover': '#E0962E',
    '--islands-button-danger-bg': colors.error,
    '--islands-button-danger-hover': '#C84646',
    '--islands-button-default-bg': colors.background,
    '--islands-button-default-hover': colors.backgroundHover,
    '--islands-button-default-border': colors.border,
    // 输入框变量
    '--islands-input-padding': '8px 12px',
    '--islands-input-padding-lg': '10px 16px',
    '--islands-input-padding-sm': '4px 8px',
    '--islands-input-font-size': '14px',
    '--islands-input-font-size-lg': '16px',
    '--islands-input-font-size-sm': '12px',
    '--islands-input-height': '32px',
    '--islands-input-height-lg': '40px',
    '--islands-input-height-sm': '24px',
    '--islands-input-radius': '6px',
    '--islands-input-border': colors.border,
    '--islands-input-bg': colors.background,
    '--islands-input-text': colors.textPrimary,
    '--islands-input-disabled-bg': colors.backgroundTertiary,
    // 选择框变量
    '--islands-select-padding': '8px 12px',
    '--islands-select-padding-lg': '10px 16px',
    '--islands-select-padding-sm': '4px 8px',
    '--islands-select-font-size': '14px',
    '--islands-select-font-size-lg': '16px',
    '--islands-select-font-size-sm': '12px',
    '--islands-select-height': '32px',
    '--islands-select-height-lg': '40px',
    '--islands-select-height-sm': '24px',
    '--islands-select-radius': '6px',
    '--islands-select-border': colors.border,
    '--islands-select-bg': colors.background,
    '--islands-select-text': colors.textPrimary,
    '--islands-select-disabled-bg': colors.backgroundTertiary,
    // 文本域变量
    '--islands-textarea-padding': '8px 12px',
    '--islands-textarea-font-size': '14px',
    '--islands-textarea-radius': '6px',
    '--islands-textarea-border': colors.border,
    '--islands-textarea-bg': colors.background,
    '--islands-textarea-text': colors.textPrimary,
    '--islands-textarea-disabled-bg': colors.backgroundTertiary,
    '--islands-textarea-min-height': '80px',
    // 复选框变量
    '--islands-checkbox-font-size': '14px',
    '--islands-checkbox-text': colors.textPrimary,
    // 开关变量
    '--islands-switch-width': '44px',
    '--islands-switch-height': '22px',
    '--islands-switch-bg': colors.border,
    // 表单变量
    '--islands-form-gap': '16px',
    // 详情展示变量
    '--islands-descriptions-font-size': '14px',
    '--islands-descriptions-text': colors.textPrimary,
    '--islands-descriptions-title-size': '16px',
    '--islands-descriptions-title-color': colors.textPrimary,
    '--islands-descriptions-title-padding': '12px 0',
    '--islands-descriptions-padding': '12px 16px',
    '--islands-descriptions-border': colors.border,
    '--islands-descriptions-label-bg': colors.backgroundSecondary,
    '--islands-descriptions-label-color': colors.textSecondary,
    '--islands-descriptions-content-color': colors.textPrimary,
    // 字段编辑变量
    '--islands-field-padding': '4px 8px',
    '--islands-field-radius': '4px',
    '--islands-field-min-width': '80px',
    '--islands-field-min-height': '24px',
    // 代码变量
    '--islands-code-bg': '#1e1e1e',
    '--islands-code-radius': '8px',
    '--islands-code-border': '1px solid rgba(255,255,255,0.1)',
    '--islands-code-padding': '16px',
    '--islands-code-font-size': '13px',
    '--islands-code-line-height': '1.6',
    '--islands-code-text-color': '#d4d4d4',
    '--islands-code-font-family': '"Fira Code", "Consolas", "Monaco", monospace',
    '--islands-code-header-padding': '10px 16px',
    '--islands-code-header-bg': 'rgba(255,255,255,0.05)',
    '--islands-code-header-border': '1px solid rgba(255,255,255,0.1)',
    '--islands-code-title-color': '#007acc',
    '--islands-code-title-font-size': '13px',
    '--islands-code-title-font-weight': '600',
    '--islands-code-copy-padding': '4px 10px',
    '--islands-code-copy-radius': '4px',
    '--islands-code-copy-font-size': '12px',
    '--islands-code-copy-bg': '#444',
    '--islands-code-copy-color': '#ccc',
    '--islands-code-copy-hover-bg': '#555',
    '--islands-code-copy-hover-color': 'white',
    '--islands-code-copy-success-bg': '#28a745',
    '--islands-code-copy-success-color': 'white',
    // 消息变量
    '--islands-message-z-index': '9999',
    '--islands-message-gap': '10px',
    '--islands-message-container-padding': '16px',
    '--islands-message-max-width': '420px',
    '--islands-message-icon-size': '18px',
    '--islands-message-icon-margin': '10px',
    '--islands-message-font-size': '14px',
    '--islands-message-line-height': '1.5',
    '--islands-message-close-size': '20px',
    '--islands-message-close-padding': '0 4px',
    '--islands-message-close-opacity': '0.7',
    '--islands-message-close-hover-opacity': '1',
    '--islands-message-success-bg': colors.successBg,
    '--islands-message-success-color': colors.success,
    '--islands-message-success-border': `1px solid ${colors.success}`,
    '--islands-message-error-bg': colors.errorBg,
    '--islands-message-error-color': colors.error,
    '--islands-message-error-border': `1px solid ${colors.error}`,
    '--islands-message-warning-bg': colors.warningBg,
    '--islands-message-warning-color': colors.warning,
    '--islands-message-warning-border': `1px solid ${colors.warning}`,
    '--islands-message-info-bg': colors.infoBg,
    '--islands-message-info-color': colors.info,
    '--islands-message-info-border': `1px solid ${colors.info}`,
    // 菜单变量
    '--islands-menu-bg': 'white',
    '--islands-menu-radius': '8px',
    '--islands-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
    '--islands-menu-padding': '8px 0',
    '--islands-menu-min-width': '160px',
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
    '--islands-menu-item-danger-color': '#dc3545',
    '--islands-menu-divider-height': '1px',
    '--islands-menu-divider-bg': '#e0e0e0',
    '--islands-menu-group-label-padding': '8px 16px 4px',
    '--islands-menu-group-label-font-size': '12px',
    '--islands-menu-group-label-color': '#999',
    '--islands-dropdown-trigger-bg': '#667eea',
    '--islands-dropdown-trigger-color': 'white',
    '--islands-dropdown-trigger-radius': '6px',
    '--islands-dropdown-menu-bg': 'white',
    '--islands-dropdown-menu-radius': '8px',
    '--islands-dropdown-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
    '--islands-context-menu-bg': 'white',
    '--islands-context-menu-radius': '8px',
    '--islands-context-menu-shadow': '0 4px 12px rgba(0,0,0,0.15)',
    // 表格变量
    '--islands-table-bg': colors.background,
    '--islands-table-text': colors.textPrimary,
    '--islands-table-border': colors.border,
    '--islands-table-head-bg': colors.backgroundSecondary,
    '--islands-table-head-color': colors.textPrimary,
    '--islands-table-body-bg': colors.background,
    '--islands-table-foot-bg': colors.backgroundSecondary,
    '--islands-table-row-border': colors.border,
    '--islands-table-cell-color': colors.textPrimary,
    '--islands-table-cell-padding': '12px 16px',
    '--islands-table-head-padding': '12px 16px',
    '--islands-table-striped-bg': colors.backgroundSecondary,
    '--islands-table-hover-bg': 'rgba(102, 126, 234, 0.05)',
    '--islands-table-font-size': '14px',
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
          border: '1px solid var(--islands-table-border)',
        },
        compact: {
          '--islands-table-cell-padding': '8px 12px',
        },
      },
      baseStyles: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 'var(--islands-table-font-size, 14px)',
        color: 'var(--islands-table-text)',
        background: 'var(--islands-table-bg)',
      },
    },

    // 表格行
    VTr: {
      stateStyles: {
        striped: {
          background: 'var(--islands-table-striped-bg)',
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
        padding: 'var(--islands-table-head-padding)',
        textAlign: 'left',
        fontWeight: '600',
        color: 'var(--islands-table-head-color)',
        borderBottom: '2px solid var(--islands-table-border)',
        whiteSpace: 'nowrap',
      },
    },

    // 表格单元格
    VTd: {
      stateStyles: {},
      baseStyles: {
        padding: 'var(--islands-table-cell-padding)',
        borderBottom: '1px solid var(--islands-table-row-border)',
        color: 'var(--islands-table-cell-color)',
        verticalAlign: 'middle',
      },
    },

    // 表格头部
    VThead: {
      stateStyles: {},
      baseStyles: {
        background: 'var(--islands-table-head-bg)',
        borderBottom: '2px solid var(--islands-table-border)',
      },
    },

    // 表格主体
    VTbody: {
      stateStyles: {},
      baseStyles: {
        background: 'var(--islands-table-body-bg)',
      },
    },

    // 表格底部
    VTfoot: {
      stateStyles: {},
      baseStyles: {
        background: 'var(--islands-table-foot-bg)',
        borderTop: '2px solid var(--islands-table-border)',
      },
    },
  };

  return theme;
}

export default createLightTheme;
