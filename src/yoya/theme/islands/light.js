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

  // 定义颜色变量
  const colors = {
    // 主色调
    primary: '#667eea',
    primaryLight: '#7c8ff0',
    primaryDark: '#5a6fd6',

    // 背景色
    background: '#ffffff',
    backgroundSecondary: '#f7f8fa',
    backgroundTertiary: '#eff1f4',

    // 文字颜色
    textPrimary: '#1a1a1a',
    textSecondary: '#666666',
    textDisabled: '#999999',

    // 边框
    border: '#e0e0e0',
    borderLight: '#f0f0f0',

    // 状态色
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',

    // 阴影
    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowHover: 'rgba(0, 0, 0, 0.12)',
  };

  // 全局样式变量
  theme.variables = {
    '--islands-primary': colors.primary,
    '--islands-primary-light': colors.primaryLight,
    '--islands-primary-dark': colors.primaryDark,
    '--islands-primary-alpha': 'rgba(102, 126, 234, 0.1)',
    '--islands-bg': colors.background,
    '--islands-bg-secondary': colors.backgroundSecondary,
    '--islands-bg-tertiary': colors.backgroundTertiary,
    '--islands-text': colors.textPrimary,
    '--islands-text-secondary': colors.textSecondary,
    '--islands-text-disabled': colors.textDisabled,
    '--islands-border': colors.border,
    '--islands-border-light': colors.borderLight,
    '--islands-success': colors.success,
    '--islands-warning': colors.warning,
    '--islands-error': colors.error,
    '--islands-info': colors.info,
    '--islands-shadow': colors.shadow,
    '--islands-shadow-hover': colors.shadowHover,
    '--islands-hover-bg': 'rgba(102, 126, 234, 0.05)',
    '--islands-error-alpha': 'rgba(220, 53, 69, 0.2)',
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
    '--islands-message-success-bg': 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
    '--islands-message-success-color': '#155724',
    '--islands-message-success-border': '1px solid #c3e6cb',
    '--islands-message-error-bg': 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
    '--islands-message-error-color': '#721c24',
    '--islands-message-error-border': '1px solid #f5c6cb',
    '--islands-message-warning-bg': 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
    '--islands-message-warning-color': '#856404',
    '--islands-message-warning-border': '1px solid #ffeaa7',
    '--islands-message-info-bg': 'linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%)',
    '--islands-message-info-color': '#0c5460',
    '--islands-message-info-border': '1px solid #bee5eb',
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
    // 卡片变量
    '--islands-card-bg': 'white',
    '--islands-card-radius': '8px',
    '--islands-card-shadow': '0 2px 8px rgba(0,0,0,0.1)',
    '--islands-card-header-padding': '16px',
    '--islands-card-header-border': '1px solid #e0e0e0',
    '--islands-card-header-font-weight': '600',
    '--islands-card-header-font-size': '16px',
    '--islands-card-header-color': '#333',
    '--islands-card-body-padding': '16px',
    '--islands-card-body-font-size': '14px',
    '--islands-card-body-color': '#333',
    '--islands-card-footer-padding': '16px',
    '--islands-card-footer-border': '1px solid #e0e0e0',
    '--islands-card-footer-gap': '8px',
    '--islands-card-footer-font-size': '14px',
    '--islands-card-footer-color': '#666',
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
  };

  return theme;
}

export default createLightTheme;
