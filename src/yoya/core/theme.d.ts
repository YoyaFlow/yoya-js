/**
 * Yoya.Basic - Theme System Type Declarations
 * 支持 boolean、string、number 多种状态值类型
 */

import { Tag } from './basic';

// ============================================
// 状态值类型
// ============================================

export type StateValue = boolean | string | number;
export type StateType = 'boolean' | 'string' | 'number';
export type StateHandler = (value: StateValue, host: Tag, oldValue: StateValue) => void;
export type StateInterceptor = (stateName: string, value: StateValue) => { stateName: string; value: StateValue } | null;

// ============================================
// StateMachine 状态机
// ============================================

export class StateMachine {
  constructor(host: Tag, stateAttrs?: (string | Record<string, StateType>)[]);

  /**
   * 注册状态属性
   * @example
   * registerStateAttrs('disabled', 'active')
   * registerStateAttrs({ size: 'string', count: 'number' })
   * registerStateAttrs('disabled', { size: 'string' })
   */
  registerStateAttrs(...attrs: (string | Record<string, StateType>)[]): this;

  /**
   * 获取注册的状态属性列表
   */
  getStateAttrs(): string[];

  /**
   * 获取状态类型定义
   */
  getStateType(stateName: string): StateType;

  /**
   * 注册状态处理器
   * @param stateName - 状态名
   * @param handler - 处理函数 (value: StateValue, host: Tag, oldValue?: StateValue) => void
   */
  registerHandler(stateName: string, handler: StateHandler): this;

  /**
   * 移除状态处理器
   */
  removeHandler(stateName: string, handler: StateHandler): this;

  /**
   * 注册状态变更拦截器
   * @param interceptor - (stateName: string, value: StateValue) => { stateName, value } | null
   */
  registerInterceptor(interceptor: StateInterceptor): this;

  /**
   * 移除拦截器
   */
  removeInterceptor(interceptor: StateInterceptor): this;

  /**
   * 设置状态（支持 boolean/string/number）
   * @param stateName - 状态名
   * @param value - 状态值（boolean/string/number）
   */
  setState(stateName: string, value: StateValue): this;

  /**
   * 设置 boolean 状态（快捷方法）
   */
  setBooleanState(stateName: string, enabled?: boolean): this;

  /**
   * 设置 string 状态（快捷方法）
   */
  setStringState(stateName: string, value: string): this;

  /**
   * 设置 number 状态（快捷方法）
   */
  setNumberState(stateName: string, value: number): this;

  /**
   * 获取状态值（返回原始类型）
   */
  getState(stateName: string): StateValue;

  /**
   * 获取布尔状态值
   */
  getBooleanState(stateName: string): boolean;

  /**
   * 获取字符串状态值
   */
  getStringState(stateName: string): string;

  /**
   * 获取数值状态值
   */
  getNumberState(stateName: string): number;

  /**
   * 获取所有状态
   */
  getAllStates(): Record<string, StateValue>;

  /**
   * 检查是否处于某个状态（仅适用于 boolean 状态）
   */
  hasState(stateName: string): boolean;

  /**
   * 保存当前状态快照
   */
  saveSnapshot(snapshotName?: string): this;

  /**
   * 恢复状态快照
   */
  restoreSnapshot(snapshotName?: string): this;

  /**
   * 初始化状态（设置默认值）
   * @param defaultStates - 默认状态 { disabled: false, size: 'medium', count: 0 }
   */
  initialize(defaultStates?: Record<string, StateValue>): this;

  /**
   * 恢复到初始化前的状态
   */
  deinitialize(): this;

  /**
   * 重置所有状态（根据类型使用默认值）
   */
  reset(): this;

  /**
   * 销毁状态机
   */
  destroy(): void;
}

// ============================================
// Theme 主题类
// ============================================

export type ComponentThemeDefinition = {
  stateStyles: Record<string, Record<string, string>>;
  handlers: Record<string, StateHandler>;
};

export class Theme {
  constructor(name?: string);

  name: string;
  stateStyles: Record<string, Record<string, string>>;
  stateHandlers: Record<string, StateHandler>;
  componentThemes: Record<string, ComponentThemeDefinition>;

  /**
   * 设置组件的状态样式
   * @param componentName - 组件名（如 'MenuItem'）
   * @param stateName - 状态名（如 'disabled'）
   * @param styles - 样式对象
   */
  setComponentStateStyles(componentName: string, stateName: string, styles: Record<string, string>): this;

  /**
   * 设置组件的状态处理器
   * @param componentName - 组件名
   * @param stateName - 状态名
   * @param handler - 处理函数 (value, host, oldValue) => void
   */
  setComponentStateHandler(componentName: string, stateName: string, handler: StateHandler): this;

  /**
   * 注册主题到注册表
   */
  register(): this;

  /**
   * 应用主题到组件
   */
  applyToComponent(component: Tag): void;

  /**
   * 移除样式（内部方法）
   */
  _removeStyles(component: Tag, styles: Record<string, string>): void;
}

// ============================================
// ThemeManager 主题管理器
// ============================================

export class ThemeManager {
  /**
   * 注册主题
   */
  registerTheme(theme: Theme): this;

  /**
   * 获取主题
   */
  getTheme(name: string): Theme | undefined;

  /**
   * 设置当前主题
   */
  setTheme(name: string): this;

  /**
   * 获取当前主题
   */
  getCurrentTheme(): Theme | null;

  /**
   * 应用当前主题到组件
   */
  applyTheme(component: Tag): this;

  /**
   * 应用所有已注册主题到组件
   */
  applyAllThemes(component: Tag): this;
}

// ============================================
// 全局单例
// ============================================

export const themeManager: ThemeManager;

// ============================================
// 辅助函数
// ============================================

/**
 * 快速创建主题
 * @param name - 主题名
 * @param definitions - 主题定义
 *   格式：{ MenuItem: { disabled: { opacity: '0.5' }, active: { background: 'blue' } } }
 */
export function createTheme(
  name: string,
  definitions?: Record<string, Record<string, Record<string, string>>>
): Theme;

/**
 * 快速注册状态处理器
 * @param themeName - 主题名
 * @param componentName - 组件名
 * @param stateName - 状态名
 * @param handler - 处理函数 (value, host, oldValue) => void
 */
export function registerStateHandler(
  themeName: string,
  componentName: string,
  stateName: string,
  handler: StateHandler
): Theme;

/**
 * 为 Tag 组件添加状态机支持的装饰器函数
 * @param stateAttrs - 状态属性列表
 */
export function initStateMachine(stateAttrs?: (string | Record<string, StateType>)[]): () => void;
