/**
 * Islands 主题 - 深色模式
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
 * 创建 Islands 深色主题
 */
export function createDarkTheme() {
  const theme = new Theme('islands:dark');

  // 定义颜色变量
  const colors = {
    // 主色调
    primary: '#7c8ff0',
    primaryLight: '#94a3f5',
    primaryDark: '#667eea',

    // 背景色
    background: '#1a1a2e',
    backgroundSecondary: '#252542',
    backgroundTertiary: '#2f2f5a',

    // 文字颜色
    textPrimary: '#eaeaea',
    textSecondary: '#b0b0b0',
    textDisabled: '#666666',

    // 边框
    border: '#3a3a5c',
    borderLight: '#45456a',

    // 状态色
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#22d3ee',

    // 阴影
    shadow: 'rgba(0, 0, 0, 0.2)',
    shadowHover: 'rgba(0, 0, 0, 0.3)',
  };

  // 全局样式变量
  theme.variables = {
    '--islands-primary': colors.primary,
    '--islands-primary-light': colors.primaryLight,
    '--islands-primary-dark': colors.primaryDark,
    '--islands-primary-alpha': 'rgba(124, 143, 240, 0.2)',
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
    '--islands-hover-bg': 'rgba(255, 255, 255, 0.05)',
    '--islands-error-alpha': 'rgba(248, 113, 113, 0.2)',
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
        background: colors.backgroundSecondary,
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
          background: 'rgba(124, 143, 240, 0.2)',
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
      hoverStyles: {
        background: 'rgba(255, 255, 255, 0.05)',
      },
    },

    // 卡片
    Card: {
      stateStyles: {},
      baseStyles: {
        background: colors.backgroundSecondary,
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
        borderBottom: `1px solid ${colors.border}`,
        background: colors.backgroundTertiary,
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
        borderTop: `1px solid ${colors.border}`,
        background: colors.backgroundTertiary,
        fontSize: size.fontSizeSm,
      },
    },

    // 消息
    Message: {
      stateStyles: {},
      variants: {
        success: {
          background: 'rgba(74, 222, 128, 0.15)',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          color: colors.success,
        },
        error: {
          background: 'rgba(248, 113, 113, 0.15)',
          border: '1px solid rgba(248, 113, 113, 0.3)',
          color: colors.error,
        },
        warning: {
          background: 'rgba(251, 191, 36, 0.15)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          color: colors.warning,
        },
        info: {
          background: 'rgba(34, 211, 238, 0.15)',
          border: '1px solid rgba(34, 211, 238, 0.3)',
          color: colors.info,
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
        background: colors.background,
        color: colors.textPrimary,
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
          boxShadow: '0 0 0 2px rgba(248, 113, 113, 0.2)',
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
          boxShadow: '0 0 0 2px rgba(248, 113, 113, 0.2)',
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
          boxShadow: '0 0 0 2px rgba(248, 113, 113, 0.2)',
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
  };

  return theme;
}

export default createDarkTheme;
