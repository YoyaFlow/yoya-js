/**
 * Yoya.Basic - Components Type Declarations
 */

import { Tag, Setup } from '../core/basic';

// ============================================
// Card 卡片布局
// ============================================

declare class Card extends Tag {
  constructor(setup?: Setup<Card>);
  hoverable(): this;
  noBorder(): this;
  noShadow(): this;
  bordered(): this;
}

declare function card(setup?: Setup<Card>): Card;

// ============================================
// CardHeader 卡片头部
// ============================================

declare class CardHeader extends Tag {
  constructor(setup?: Setup<CardHeader>);
}

declare function cardHeader(setup?: Setup<CardHeader>): CardHeader;

// ============================================
// CardBody 卡片内容
// ============================================

declare class CardBody extends Tag {
  constructor(setup?: Setup<CardBody>);
}

declare function cardBody(setup?: Setup<CardBody>): CardBody;

// ============================================
// CardFooter 卡片底部
// ============================================

declare class CardFooter extends Tag {
  constructor(setup?: Setup<CardFooter>);
}

declare function cardFooter(setup?: Setup<CardFooter>): CardFooter;

// ============================================
// Menu 菜单
// ============================================

declare class Menu extends Tag {
  constructor(setup?: Setup<Menu>);
  vertical(): this;
  horizontal(): this;
  compact(): this;
  noShadow(): this;
  bordered(): this;
  item(content?: string, setup?: Setup<MenuItem>): MenuItem;
  divider(setup?: Setup<MenuDivider>): this;
  group(setup?: Setup<MenuGroup>): this;
}

declare function menu(setup?: Setup<Menu>): Menu;

// ============================================
// MenuItem 菜单项
// ============================================

declare class MenuItem extends Tag {
  constructor(content?: string, setup?: Setup<MenuItem>);
  text(content: string): this;
  icon(content: string): this;
  disabled(): this;
  enabled(): this;
  active(): this;
  inactive(): this;
  danger(): this;
  hoverable(): this;
  shortcut(key: string): this;
  onclick(fn: (item: MenuItem) => void): this;
  toggleState(stateName: string): this;
  // 状态管理方法（继承自 Tag）
  setState(state: string, enabled?: boolean): this;
  hasState(state: string): boolean;
  getState(state: string): boolean;
  getAllStates(): Record<string, boolean>;
  resetStates(): this;
  saveStateSnapshot(name?: string): this;
  restoreStateSnapshot(name?: string): this;
  initializeStates(defaultStates?: Record<string, boolean>): this;
  deinitializeStates(): this;
}

declare function menuItem(content?: string, setup?: Setup<MenuItem>): MenuItem;

// ============================================
// MenuDivider 菜单分割线
// ============================================

declare class MenuDivider extends Tag {
  constructor(setup?: Setup<MenuDivider>);
}

declare function menuDivider(setup?: Setup<MenuDivider>): MenuDivider;

// ============================================
// MenuGroup 菜单组
// ============================================

declare class MenuGroup extends Tag {
  constructor(setup?: Setup<MenuGroup>);
  label(text: string): this;
  item(content?: string, setup?: Setup<MenuItem>): MenuItem;
  divider(setup?: Setup<MenuDivider>): this;
}

declare function menuGroup(setup?: Setup<MenuGroup>): MenuGroup;

// ============================================
// DropdownMenu 下拉菜单
// ============================================

declare class DropdownMenu extends Tag {
  constructor(setup?: Setup<DropdownMenu>);
  trigger(content: string | Tag): this;
  menuContent(menu: Menu): this;
  closeOnClickOutside(): this;
}

declare function dropdownMenu(setup?: Setup<DropdownMenu>): DropdownMenu;

// ============================================
// ContextMenu 右键菜单
// ============================================

declare class ContextMenu extends Tag {
  constructor(setup?: Setup<ContextMenu>);
  target(element: HTMLElement): this;
  menuContent(menu: Menu): this;
  show(x: number, y: number): this;
  hide(): this;
}

declare function contextMenu(setup?: Setup<ContextMenu>): ContextMenu;

// ============================================
// Message 消息提示
// ============================================

type MessageType = 'success' | 'error' | 'warning' | 'info';
type MessagePosition = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';

declare class Message extends Tag {
  constructor(content?: string, type?: MessageType, setup?: Setup<Message>);
  content(text: string): this;
  closable(value: boolean): this;
  duration(ms: number): this;
  close(): this;
  startTimer(): void;
  stopTimer(): void;
}

declare function message(content?: string, type?: MessageType, setup?: Setup<Message>): Message;

// ============================================
// MessageContainer 消息容器
// ============================================

declare class MessageContainer extends Tag {
  constructor(position?: MessagePosition, setup?: Setup<MessageContainer>);
  add(content: string, type?: MessageType, duration?: number): Message;
  success(content: string, duration?: number): Message;
  error(content: string, duration?: number): Message;
  warning(content: string, duration?: number): Message;
  info(content: string, duration?: number): Message;
  clear(): void;
  maxVisible(count: number): this;
}

declare function messageContainer(position?: MessagePosition, setup?: Setup<MessageContainer>): MessageContainer;

// ============================================
// MessageManager 消息管理器
// ============================================

declare class MessageManager {
  constructor();
  success(content: string, duration?: number): Message;
  error(content: string, duration?: number): Message;
  warning(content: string, duration?: number): Message;
  info(content: string, duration?: number): Message;
  clear(): void;
  setPosition(position: MessagePosition): this;
  maxVisible(count: number): this;
}

declare const messageManager: MessageManager;

declare function toast(content: string, type?: MessageType, duration?: number): Message;
declare namespace toast {
  export function success(content: string, duration?: number): Message;
  export function error(content: string, duration?: number): Message;
  export function warning(content: string, duration?: number): Message;
  export function info(content: string, duration?: number): Message;
  export function clear(): void;
}

// ============================================
// VButton 按钮组件
// ============================================

declare class VButton extends Tag {
  constructor(content?: string, setup?: Setup<VButton>);
  type(value: 'primary' | 'success' | 'warning' | 'danger' | 'default'): this | string;
  size(value: 'large' | 'default' | 'small'): this | string;
  disabled(value?: boolean): this | boolean;
  loading(value?: boolean): this | boolean;
  block(value?: boolean): this | boolean;
  ghost(value?: boolean): this | boolean;
}

declare function vButton(content?: string, setup?: Setup<VButton>): VButton;

// ============================================
// VInput 输入框组件
// ============================================

declare class VInput extends Tag {
  constructor(setup?: Setup<VInput>);
  placeholder(value: string): this | string;
  value(val?: string): this | string;
  type(value: string): this | string;
  name(value: string): this | string;
  disabled(value?: boolean): this | boolean;
  readonly(value?: boolean): this | boolean;
  error(value?: boolean): this | boolean;
  loading(value?: boolean): this | boolean;
  size(value: 'large' | 'default' | 'small'): this | string;
  onChange(handler: (e: Event) => void): this;
  onInput(handler: (e: Event) => void): this;
  focus(): this;
  blur(): this;
}

declare function vInput(setup?: Setup<VInput>): VInput;

// ============================================
// VSelect 选择框组件
// ============================================

declare class VSelect extends Tag {
  constructor(setup?: Setup<VSelect>);
  options(opts: Array<{ value: string | number; label: string }>): this;
  value(val?: string | number): this | string | number;
  name(value: string): this | string;
  placeholder(value: string): this | string;
  disabled(value?: boolean): this | boolean;
  error(value?: boolean): this | boolean;
  size(value: 'large' | 'default' | 'small'): this | string;
  onChange(handler: (e: Event) => void): this;
}

declare function vSelect(setup?: Setup<VSelect>): VSelect;

// ============================================
// VTextarea 多行文本框组件
// ============================================

declare class VTextarea extends Tag {
  constructor(setup?: Setup<VTextarea>);
  placeholder(value: string): this | string;
  value(val?: string): this | string;
  rows(value: number): this | number;
  name(value: string): this | string;
  disabled(value?: boolean): this | boolean;
  readonly(value?: boolean): this | boolean;
  error(value?: boolean): this | boolean;
  onChange(handler: (e: Event) => void): this;
  onInput(handler: (e: Event) => void): this;
}

declare function vTextarea(setup?: Setup<VTextarea>): VTextarea;

// ============================================
// VCheckbox 复选框组件
// ============================================

declare class VCheckbox extends Tag {
  constructor(labelText?: string, setup?: Setup<VCheckbox>);
  label(value: string): this | string;
  checked(value?: boolean): this | boolean;
  disabled(value?: boolean): this | boolean;
  error(value?: boolean): this | boolean;
  name(value: string): this | string;
  value(value: string): this | string;
  onChange(handler: (e: Event) => void): this;
}

declare function vCheckbox(labelText?: string, setup?: Setup<VCheckbox>): VCheckbox;

// ============================================
// VSwitch 开关组件
// ============================================

declare class VSwitch extends Tag {
  constructor(setup?: Setup<VSwitch>);
  checked(value?: boolean): this | boolean;
  disabled(value?: boolean): this | boolean;
  size(value: 'large' | 'default' | 'small'): this | string;
  onChange(handler: (checked: boolean) => void): this;
}

declare function vSwitch(setup?: Setup<VSwitch>): VSwitch;

// ============================================
// VForm 表单容器组件
// ============================================

declare class VForm extends Tag {
  constructor(setup?: Setup<VForm>);
  action(value: string): this | string;
  method(value: string): this | string;
  onSubmit(handler: (e: Event) => void): this;
}

declare function vForm(setup?: Setup<VForm>): VForm;

// ============================================
// VDetail 详情展示组件
// ============================================

declare class VDetail extends Tag {
  constructor(setup?: Setup<VDetail>);
  title(value: string): this | string;
  column(value: number): this | number;
  bordered(value?: boolean): this | boolean;
  item(label: string, content: string | Tag): this;
  items(items: Array<{ label: string; content: string | Tag }>): this;
}

declare function vDetail(setup?: Setup<VDetail>): VDetail;

// ============================================
// VDetailItem 详情项
// ============================================

declare class VDetailItem extends Tag {
  constructor(label?: string, content?: string | Tag, setup?: Setup<VDetailItem>);
  label(value: string): this | string;
  content(value: string | Tag): this;
}

declare function vDetailItem(label?: string, content?: string | Tag, setup?: Setup<VDetailItem>): VDetailItem;

// ============================================
// VField 可编辑字段组件
// ============================================

declare class VField extends Tag {
  constructor(setup?: Setup<VField>);
  showContent(content: string | Tag | ((container: Tag) => void)): this;
  editContent(content: string | Tag | ((container: Tag) => void)): this;
  placeholder(value: string): this | string;
  onSave(handler: () => void | Promise<void>): this;
  onChange(handler: () => void): this;
  disabled(value?: boolean): this | boolean;
  loading(value?: boolean): this | boolean;
  editing(value?: boolean): this | boolean;
}

declare function vField(setup?: Setup<VField>): VField;

// ============================================
// 导出
// ============================================

export {
  // Card
  Card, CardHeader, CardBody, CardFooter,
  card, cardHeader, cardBody, cardFooter,

  // Menu
  Menu, MenuItem, MenuDivider, MenuGroup, DropdownMenu, ContextMenu,
  menu, menuItem, menuDivider, menuGroup, dropdownMenu, contextMenu,

  // Message
  Message, MessageContainer, MessageManager,
  message, messageContainer,
  messageManager, toast,

  // Button
  VButton, vButton,

  // Form
  VInput, vInput,
  VSelect, vSelect,
  VTextarea, vTextarea,
  VCheckbox, vCheckbox,
  VSwitch, vSwitch,
  VForm, vForm,

  // Detail
  VDetail, vDetail,
  VDetailItem, vDetailItem,

  // Field
  VField, vField,
};
