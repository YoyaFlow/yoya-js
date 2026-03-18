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
    // 主色调 - 中性蓝色（减少紫色调）
    primary: '#1E40AF',         // 主要交互色（中性蓝）
    primaryLight: '#3B82F6',     // 悬停/高亮
    primaryDark: '#1E3A8A',      // 按压/激活
    primaryAlpha: 'rgba(30, 64, 175, 0.08)',  // 半透明背景
    primaryHover: 'rgba(30, 64, 175, 0.12)',  // 悬停背景

    // 背景色 - Islands 风格白色系（增强层次）
    background: '#FFFFFF',        // 主背景
    backgroundSecondary: '#F8F9FA',   // 次级背景（表头、分组、卡片头尾）
    backgroundTertiary: '#F0F1F3',    // 第三级背景（禁用、不可用）
    backgroundHover: '#E8EAED',       // 悬停背景
    backgroundElevated: '#FFFFFF',    //  elevated 背景（菜单、弹窗）

    // 文字颜色 - JetBrains 灰度体系（增强对比度）
    textPrimary: '#1A1C1F',     // 主要文字（提高对比度）
    textSecondary: '#4A4D55',   // 次要文字/描述（增强对比度）
    textTertiary: '#8B8D93',    // 辅助文字
    textDisabled: '#B8BAC0',    // 禁用文字
    textLink: '#3574F0',        // 链接色
    textInverse: '#FFFFFF',     // 反色文字（用于深色背景上）

    // 边框 - JetBrains 边框色（优化层次）
    border: '#D3D3D6',          // 主边框
    borderLight: '#E5E5E7',     // 次级边框
    borderFocus: '#1E40AF',     // 聚焦边框（中性蓝）
    borderHover: '#A8A8AC',     // 悬停边框
    borderStrong: '#C2C2C5',    // 强调边框（输入框等）

    // 状态色 - JetBrains 语义色（优化对比度）
    success: '#2E7D32',         // 成功（深绿色，提高对比度）
    successBg: 'rgba(46, 125, 50, 0.08)',
    successHover: 'rgba(46, 125, 50, 0.15)',
    warning: '#C25E00',         // 警告（深橙色，提高对比度）
    warningBg: 'rgba(194, 94, 0, 0.08)',
    warningHover: 'rgba(194, 94, 0, 0.15)',
    error: '#C62828',           // 错误（深红色，提高对比度）
    errorBg: 'rgba(198, 40, 40, 0.08)',
    errorHover: 'rgba(198, 40, 40, 0.15)',
    info: '#1976D2',            // 信息（深蓝色，提高对比度）
    infoBg: 'rgba(25, 118, 210, 0.08)',
    infoHover: 'rgba(25, 118, 210, 0.15)',

    // selection - 选区背景
    selection: 'rgba(30, 64, 175, 0.15)',
    selectionInactive: 'rgba(30, 64, 175, 0.08)',

    // 阴影 - JetBrains 柔和阴影（优化层次）
    shadow: 'rgba(30, 32, 35, 0.08)',
    shadowHover: 'rgba(30, 32, 35, 0.15)',
    shadowDropdown: 'rgba(30, 32, 35, 0.2)',
    shadowElevated: 'rgba(30, 32, 35, 0.12)',

    // 特殊效果
    overlay: 'rgba(30, 32, 35, 0.5)',
    scrim: 'rgba(0, 0, 0, 0.32)',
    backdrop: 'rgba(255, 255, 255, 0.8)',  // 毛玻璃背景
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
    '--yoya-body-color': colors.textPrimary,
    '--yoya-text': colors.textPrimary,
    '--yoya-text-primary': colors.textPrimary,
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
    '--yoya-success-hover': colors.successHover,
    '--yoya-warning': colors.warning,
    '--yoya-warning-bg': colors.warningBg,
    '--yoya-warning-hover': colors.warningHover,
    '--yoya-error': colors.error,
    '--yoya-error-bg': colors.errorBg,
    '--yoya-error-hover': colors.errorHover,
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
    '--yoya-button-default-bg': colors.backgroundSecondary,
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
    // 侧边栏变量
    '--yoya-sidebar-width': '240px',
    '--yoya-sidebar-collapsed-width': '64px',
    '--yoya-sidebar-bg': colors.background,
    '--yoya-sidebar-border': colors.border,
    '--yoya-sidebar-header-bg': colors.backgroundSecondary,
    '--yoya-sidebar-header-border': colors.borderLight,
    '--yoya-sidebar-header-padding': '16px',
    '--yoya-sidebar-header-color': colors.textPrimary,
    '--yoya-sidebar-content-padding': '8px 0',
    '--yoya-sidebar-content-color': colors.textPrimary,
    '--yoya-sidebar-footer-bg': colors.backgroundSecondary,
    '--yoya-sidebar-footer-border': colors.borderLight,
    '--yoya-sidebar-footer-padding': '16px',
    '--yoya-sidebar-footer-color': colors.textSecondary,
    '--yoya-sidebar-divider-margin': '8px',
    '--yoya-sidebar-toggle-padding': '8px',
    '--yoya-sidebar-toggle-radius': '6px',
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
    '--yoya-message-text-color': colors.textPrimary,
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
    '--yoya-menu-bg': colors.backgroundElevated,
    '--yoya-menu-radius': '8px',
    '--yoya-menu-shadow': colors.shadowDropdown,
    '--yoya-menu-padding': '6px 0',
    '--yoya-menu-min-width': '180px',
    '--yoya-menu-item-padding': '8px 12px',
    '--yoya-menu-item-horizontal-padding': '14px',
    '--yoya-menu-item-gap': '8px',
    '--yoya-menu-item-radius': '6px',
    '--yoya-menu-item-color': colors.textPrimary,
    '--yoya-menu-item-font-size': '14px',
    '--yoya-menu-item-hover-bg': colors.backgroundHover,
    '--yoya-menu-item-active-bg': colors.primaryAlpha,
    '--yoya-menu-item-active-font-weight': '500',
    '--yoya-menu-item-active-color': colors.primary,
    '--yoya-menu-item-disabled-opacity': '0.5',
    '--yoya-menu-item-danger-color': colors.error,
    '--yoya-menu-item-danger-hover-bg': colors.errorBg,
    '--yoya-menu-divider-height': '1px',
    '--yoya-menu-divider-bg': colors.borderLight,
    '--yoya-menu-group-label-padding': '6px 12px 4px',
    '--yoya-menu-group-label-font-size': '12px',
    '--yoya-menu-group-label-color': colors.textTertiary,

    // Tabs 标签页变量
    '--yoya-tabs-bg': colors.background,
    '--yoya-tabs-header-bg': colors.backgroundSecondary,
    '--yoya-tabs-content-bg': colors.background,
    '--yoya-tabs-border': colors.border,
    '--yoya-tabs-color': colors.textSecondary,
    '--yoya-tabs-active-color': colors.textPrimary,
    '--yoya-tabs-active-bg': colors.background,
    '--yoya-tabs-active-border': colors.primary,
    '--yoya-tabs-hover-bg': colors.backgroundHover,

    // Pager 分页变量
    '--yoya-pager-bg': colors.background,
    '--yoya-pager-border': colors.border,
    '--yoya-pager-color': colors.textPrimary,

    // Top Navbar 顶部导航栏变量
    '--yoya-navbar-bg': colors.background,
    '--yoya-navbar-border': `1px solid ${colors.border}`,
    '--yoya-navbar-logo-color': colors.textPrimary,
    '--yoya-navbar-item-color': colors.textSecondary,
    '--yoya-navbar-item-hover-bg': colors.backgroundHover,
    '--yoya-navbar-item-hover-color': colors.textPrimary,
    '--yoya-navbar-item-active-bg': colors.primaryAlpha,
    '--yoya-navbar-item-active-color': colors.primary,

    '--yoya-dropdown-trigger-color': colors.textInverse,
    '--yoya-dropdown-trigger-radius': '6px',
    '--yoya-dropdown-menu-bg': colors.backgroundElevated,
    '--yoya-dropdown-menu-radius': '8px',
    '--yoya-dropdown-menu-shadow': colors.shadowDropdown,
    '--yoya-context-menu-bg': colors.backgroundElevated,
    '--yoya-context-menu-radius': '8px',
    '--yoya-context-menu-shadow': colors.shadowDropdown,
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

    // Modal 弹出框变量
    '--yoya-modal-mask-bg': 'rgba(0, 0, 0, 0.45)',
    '--yoya-modal-mask-backdrop-filter': 'blur(4px)',
    '--yoya-modal-bg': colors.backgroundElevated,
    '--yoya-modal-shadow': '0 4px 12px rgba(0, 0, 0, 0.15)',
    '--yoya-modal-radius': '8px',
    '--yoya-modal-min-width': '300px',
    '--yoya-modal-max-width': '90%',
    '--yoya-modal-max-height': '90vh',
    '--yoya-modal-header-padding': '16px 20px',
    '--yoya-modal-header-border': '1px solid ' + colors.border,
    '--yoya-modal-header-font-weight': '600',
    '--yoya-modal-header-font-size': '16px',
    '--yoya-modal-header-line-height': '1.5',
    '--yoya-modal-header-color': colors.textPrimary,
    '--yoya-modal-body-padding': '20px',
    '--yoya-modal-body-color': colors.textPrimary,
    '--yoya-modal-body-font-size': '14px',
    '--yoya-modal-body-line-height': '1.5',
    '--yoya-modal-footer-padding': '12px 20px',
    '--yoya-modal-footer-border': '1px solid ' + colors.border,
    '--yoya-modal-footer-gap': '8px',
    '--yoya-modal-footer-justify': 'flex-end',
    '--yoya-modal-close-size': '24px',
    '--yoya-modal-close-color': colors.textSecondary,
    '--yoya-modal-close-hover-color': colors.textPrimary,
    '--yoya-modal-close-hover-bg': 'rgba(0, 0, 0, 0.05)',
    '--yoya-modal-close-radius': '4px',
    '--yoya-modal-animation-duration': '0.3s',
    '--yoya-modal-animation-timing': 'ease',
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
        background: colors.backgroundElevated,
        borderRadius: size.radiusMd,
        boxShadow: `0 4px 16px ${colors.shadowDropdown}`,
        padding: `${size.paddingSm} 0`,
        minWidth: '180px',
        border: `1px solid ${colors.borderLight}`,
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
          background: colors.primaryAlpha,
          fontWeight: '500',
          color: colors.primary,
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
        transition: 'background-color 0.15s, color 0.15s',
        borderRadius: size.radiusSm,
        color: colors.textPrimary,
        fontSize: size.fontSizeSm,
        margin: `0 ${size.marginXs}`,
      },
      hoverStyles: {
        background: colors.backgroundHover,
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
        border: `1px solid ${colors.borderLight}`,
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
        fontWeight: '600',
        color: colors.textPrimary,
      },
    },

    // 卡片内容
    CardBody: {
      stateStyles: {},
      baseStyles: {
        padding: `${size.paddingMd} ${size.paddingLg}`,
        fontSize: size.fontSizeMd,
        color: colors.textPrimary,
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
        color: colors.textSecondary,
      },
    },

    // 消息
    Message: {
      stateStyles: {},
      variants: {
        success: {
          background: colors.successBg,
          border: `1px solid ${colors.success}`,
          color: colors.success,
        },
        error: {
          background: colors.errorBg,
          border: `1px solid ${colors.error}`,
          color: colors.error,
        },
        warning: {
          background: colors.warningBg,
          border: `1px solid ${colors.warning}`,
          color: colors.warning,
        },
        info: {
          background: colors.infoBg,
          border: `1px solid ${colors.info}`,
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
        transition: 'border-color 0.2s, box-shadow 0.2s',
        background: colors.background,
        color: colors.textPrimary,
      },
    },

    // 分隔线
    Divider: {
      stateStyles: {},
      baseStyles: {
        height: '1px',
        background: colors.borderLight,
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
        fontWeight: '500',
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
          boxShadow: '0 0 0 2px rgba(198, 40, 40, 0.2)',
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
          boxShadow: '0 0 0 2px rgba(198, 40, 40, 0.2)',
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
          boxShadow: '0 0 0 2px rgba(198, 40, 40, 0.2)',
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
        cursor: 'pointer',
      },
      hoverStyles: {
        background: colors.backgroundHover,
        borderColor: colors.border,
      },
    },

    // 侧边栏
    VSidebar: {
      stateStyles: {},
      baseStyles: {
        background: colors.background,
        borderRight: `1px solid ${colors.border}`,
        color: colors.textPrimary,
      },
    },

    // 侧边栏头部
    VSidebarHeader: {
      stateStyles: {},
      baseStyles: {
        background: colors.backgroundSecondary,
        borderBottom: `1px solid ${colors.borderLight}`,
        color: colors.textPrimary,
      },
    },

    // 侧边栏底部
    VSidebarFooter: {
      stateStyles: {},
      baseStyles: {
        background: colors.backgroundSecondary,
        borderTop: `1px solid ${colors.borderLight}`,
        color: colors.textSecondary,
      },
    },

    // 页面背景
    VBody: {
      stateStyles: {},
      baseStyles: {
        display: 'flex',
        flexDirection: 'column',
        background: colors.backgroundSecondary,
        color: colors.textPrimary,
        minHeight: '100vh',
        width: '100%',
        transition: 'background-color 0.3s ease',
      },
    },

    // Tabs 标签页组件
    VTabs: {
      stateStyles: {},
      baseStyles: {
        background: colors.background,
      },
    },

    // Pager 分页组件
    VPager: {
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
        fontSize: size.fontSizeSm,
        color: colors.textPrimary,
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

    // 代码组件
    VCode: {
      stateStyles: {},
      baseStyles: {
        background: colors.backgroundSecondary,
        borderRadius: size.radiusMd,
        border: `1px solid ${colors.border}`,
        overflow: 'hidden',
      },
    },

    // 图表组件
    VEchart: {
      stateStyles: {},
      baseStyles: {
        background: colors.background,
        borderRadius: size.radiusMd,
        border: `1px solid ${colors.border}`,
      },
    },
  };

  return theme;
}

export default createLightTheme;
