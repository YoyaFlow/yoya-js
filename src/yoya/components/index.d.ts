/**
 * Yoya.Basic - Components Type Declarations
 */

import { Tag, Setup } from '../core/basic';

// ============================================
// VCard 卡片布局
// ============================================

declare class VCard extends Tag {
  constructor(setup?: Setup<VCard>);
  hoverable(): this;
  noBorder(): this;
  noShadow(): this;
  bordered(): this;
  onClick(handler: (e: { event: MouseEvent; target: VCard }) => void): this;
  vCardHeader(setup?: Setup<VCardHeader>): this;
  vCardBody(setup?: Setup<VCardBody>): this;
  vCardFooter(setup?: Setup<VCardFooter>): this;
  // 兼容旧方法
  cardHeader(setup?: Setup<VCardHeader>): this;
  cardBody(setup?: Setup<VCardBody>): this;
  cardFooter(setup?: Setup<VCardFooter>): this;
}

declare function vCard(setup?: Setup<VCard>): VCard;

// ============================================
// VCardHeader 卡片头部
// ============================================

declare class VCardHeader extends Tag {
  constructor(setup?: Setup<VCardHeader>);
}

declare function vCardHeader(setup?: Setup<VCardHeader>): VCardHeader;

// ============================================
// VCardBody 卡片内容
// ============================================

declare class VCardBody extends Tag {
  constructor(setup?: Setup<VCardBody>);
}

declare function vCardBody(setup?: Setup<VCardBody>): VCardBody;

// ============================================
// VCardFooter 卡片底部
// ============================================

declare class VCardFooter extends Tag {
  constructor(setup?: Setup<VCardFooter>);
}

declare function vCardFooter(setup?: Setup<VCardFooter>): VCardFooter;

// ============================================
// VMenu 菜单
// ============================================

declare class VMenu extends Tag {
  constructor(setup?: Setup<VMenu>);
  vertical(): this;
  horizontal(): this;
  compact(): this;
  noShadow(): this;
  bordered(): this;
  item(content?: string, setup?: Setup<VMenuItem>): VMenuItem;
  divider(setup?: Setup<VMenuDivider>): this;
  group(setup?: Setup<VMenuGroup>): this;
  submenu(title: string, setup?: Setup<VSubMenu>): VSubMenu;
}

declare function vMenu(setup?: Setup<VMenu>): VMenu;

// ============================================
// VMenuItem 菜单项
// ============================================

declare class VMenuItem extends Tag {
  constructor(content?: string, setup?: Setup<VMenuItem>);
  text(content: string): this;
  icon(content: string): this;
  disabled(): this;
  enabled(): this;
  active(): this;
  inactive(): this;
  danger(): this;
  hoverable(): this;
  shortcut(key: string): this;
  onClick(handler: (e: { event: MouseEvent; text: string; icon?: string; target: VMenuItem }) => void): this;
  submenu(title: string, setup?: Setup<VSubMenu>): VSubMenu;
  toggleState(stateName: string): this;
  setState(state: string, enabled?: boolean): this;
  hasState(state: string): boolean;
  getState(state: string): boolean;
  getAllStates(): Record<string, boolean>;
  initializeStates(defaultStates?: Record<string, boolean>): this;
  deinitializeStates(): this;
  saveStateSnapshot(name?: string): this;
  restoreStateSnapshot(name?: string): this;
}

declare function vMenuItem(content?: string, setup?: Setup<VMenuItem>): VMenuItem;

// ============================================
// VMenuDivider 菜单分割线
// ============================================

declare class VMenuDivider extends Tag {
  constructor(setup?: Setup<VMenuDivider>);
}

declare function vMenuDivider(setup?: Setup<VMenuDivider>): VMenuDivider;

// ============================================
// VMenuGroup 菜单组
// ============================================

declare class VMenuGroup extends Tag {
  constructor(setup?: Setup<VMenuGroup>);
  label(text: string): this;
  item(content?: string, setup?: Setup<VMenuItem>): VMenuItem;
  divider(setup?: Setup<VMenuDivider>): this;
}

declare function vMenuGroup(setup?: Setup<VMenuGroup>): VMenuGroup;

// ============================================
// VSubMenu 子菜单
// ============================================

declare class VSubMenu extends Tag {
  constructor(title?: string, setup?: Setup<VSubMenu>);
  item(content?: string, setup?: Setup<VMenuItem>): VMenuItem;
  divider(setup?: Setup<VMenuDivider>): this;
}

declare function vSubMenu(title?: string, setup?: Setup<VSubMenu>): VSubMenu;

// ============================================
// VDropdownMenu 下拉菜单
// ============================================

declare class VDropdownMenu extends Tag {
  constructor(setup?: Setup<VDropdownMenu>);
  trigger(content: string | Tag): this;
  menuContent(menu: VMenu): this;
  closeOnClickOutside(): this;
}

declare function vDropdownMenu(setup?: Setup<VDropdownMenu>): VDropdownMenu;

// ============================================
// VContextMenu 右键菜单
// ============================================

declare class VContextMenu extends Tag {
  constructor(setup?: Setup<VContextMenu>);
  target(element: HTMLElement): this;
  menuContent(menu: VMenu): this;
  show(x: number, y: number): this;
  hide(): this;
}

declare function vContextMenu(setup?: Setup<VContextMenu>): VContextMenu;

// ============================================
// VMessage 消息提示
// ============================================

type MessageType = 'success' | 'error' | 'warning' | 'info';
type MessagePosition = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';

declare class VMessage extends Tag {
  constructor(content?: string, type?: MessageType, setup?: Setup<VMessage>);
  content(text: string): this;
  closable(value: boolean): this;
  duration(ms: number): this;
  close(): this;
  startTimer(): void;
  stopTimer(): void;
}

declare function vMessage(content?: string, type?: MessageType, setup?: Setup<VMessage>): VMessage;

// ============================================
// VMessageContainer 消息容器
// ============================================

declare class VMessageContainer extends Tag {
  constructor(position?: MessagePosition, setup?: Setup<VMessageContainer>);
  add(content: string, type?: MessageType, duration?: number): VMessage;
  success(content: string, duration?: number): VMessage;
  error(content: string, duration?: number): VMessage;
  warning(content: string, duration?: number): VMessage;
  info(content: string, duration?: number): VMessage;
  clear(): void;
  maxVisible(count: number): this;
}

declare function vMessageContainer(position?: MessagePosition, setup?: Setup<VMessageContainer>): VMessageContainer;

// ============================================
// VMessageManager 消息管理器
// ============================================

interface ToastOptions {
  type?: MessageType;
  duration?: number;
  position?: MessagePosition;
}

declare class VMessageManager {
  constructor();
  success(content: string, duration?: number): VMessage;
  error(content: string, duration?: number): VMessage;
  warning(content: string, duration?: number): VMessage;
  info(content: string, duration?: number): VMessage;
  clear(): void;
  setPosition(position: MessagePosition): void;
  setMaxVisible(count: number): this;
}

declare const vMessageManager: VMessageManager;

declare function toast(content: string, type?: MessageType, duration?: number): VMessage;
declare function toast(content: string, options?: ToastOptions): VMessage;
declare namespace toast {
  export function success(content: string, duration?: number): VMessage;
  export function error(content: string, duration?: number): VMessage;
  export function warning(content: string, duration?: number): VMessage;
  export function info(content: string, duration?: number): VMessage;
  export function clear(): void;
  export function setPosition(position: MessagePosition): void;
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
  onClick(handler: (e: { event: MouseEvent; target: VButton }) => void): this;
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
  onChange(handler: (e: { event: Event; value: string; oldValue?: string; target: VInput }) => void): this;
  onInput(handler: (e: { event: Event; value: string; target: VInput }) => void): this;
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
  onChange(handler: (e: { event: Event; value: string | number; oldValue?: string | number; target: VSelect }) => void): this;
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
  onChange(handler: (e: { event: Event; value: string; oldValue?: string; target: VTextarea }) => void): this;
  onInput(handler: (e: { event: Event; value: string; target: VTextarea }) => void): this;
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
  onChange(handler: (e: { event: Event; value: boolean; oldValue?: boolean; target: VCheckbox }) => void): this;
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
  onChange(handler: (e: { event: Event; value: boolean; oldValue?: boolean; target: VSwitch }) => void): this;
}

declare function vSwitch(setup?: Setup<VSwitch>): VSwitch;

// ============================================
// VForm 表单容器组件
// ============================================

declare class VForm extends Tag {
  constructor(setup?: Setup<VForm>);
  action(value: string): this | string;
  method(value: string): this | string;
  onSubmit(handler: (e: { event: Event; target: VForm }) => void): this;
}

declare function vForm(setup?: Setup<VForm>): VForm;

// ============================================
// VCode 代码展示组件
// ============================================

declare class VCode extends Tag {
  constructor(setup?: Setup<VCode>);
  content(c?: string): this | string;
  language(lang: string): this;
  showLineNumbers(show: boolean): this;
  showCopyButton(show: boolean): this;
  title(t: string): this;
  onCopy(handler: (e: { event: ClipboardEvent; value: string; target: VCode }) => void): this;
}

declare function vCode(setup?: Setup<VCode>): VCode;

// ============================================
// CodeBlock 简化代码块
// ============================================

declare class CodeBlock extends Tag {
  constructor(title?: string, content?: string, setup?: Setup<CodeBlock>);
}

declare function codeBlock(title?: string, content?: string, setup?: Setup<CodeBlock>): CodeBlock;

// ============================================
// VDetail 详情展示组件
// ============================================

declare class VDetail extends Tag {
  constructor(setup?: Setup<VDetail>);
  title(value: string): this | string;
  column(value: number): this | number;
  bordered(value?: boolean): this | boolean;
  layout(value?: 'horizontal' | 'vertical'): this | string;
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
// VSidebar 侧边栏菜单
// ============================================

declare class VSidebar extends Tag {
  constructor(setup?: Setup<VSidebar>);
  width(w: string): this;
  collapsedWidth(w: string): this;
  header(setup: ((el: Tag) => void) | string): this;
  content(setup: (el: Tag) => void): this;
  footer(setup: ((el: Tag) => void) | string): this;
  item(content?: string, setup?: Setup<VMenuItem>): VMenuItem;
  divider(): this;
  group(setup?: Setup<VMenuGroup>): VMenuGroup;
  toggle(): this;
  collapse(): this;
  expand(): this;
  isCollapsed(): boolean;
  showToggleBtn(setup?: Setup<VButton>): this;
  dark(): this;
}

declare function vSidebar(setup?: Setup<VSidebar>): VSidebar;

// ============================================
// VField 可编辑字段组件
// ============================================

declare class VField extends Tag {
  constructor(setup?: Setup<VField>);
  showContent(content: string | Tag | ((container: Tag) => void)): this;
  editContent(content: string | Tag | ((container: Tag) => void)): this;
  placeholder(value: string): this | string;
  onSave(handler: (e: { value: any; oldValue?: any; target: VField }) => void | Promise<void>): this;
  onChange(handler: (e: { value: any; oldValue?: any; target: VField }) => void): this;
  onEdit(handler: (e: { value: any; target: VField }) => void): this;
  disabled(value?: boolean): this | boolean;
  loading(value?: boolean): this | boolean;
  editing(value?: boolean): this | boolean;
}

declare function vField(setup?: Setup<VField>): VField;

// ============================================
// VTable 表格组件
// ============================================

declare class VTable extends Tag {
  constructor(setup?: Setup<VTable>);
  bordered(value?: boolean): this;
  striped(value?: boolean): this;
  hoverable(value?: boolean): this;
  compact(value?: boolean): this;
}

declare function vTable(setup?: Setup<VTable>): VTable;

declare class VThead extends Tag {
  constructor(setup?: Setup<VThead>);
}

declare function vThead(setup?: Setup<VThead>): VThead;

declare class VTbody extends Tag {
  constructor(setup?: Setup<VTbody>);
}

declare function vTbody(setup?: Setup<VTbody>): VTbody;

declare class VTfoot extends Tag {
  constructor(setup?: Setup<VTfoot>);
}

declare function vTfoot(setup?: Setup<VTfoot>): VTfoot;

declare class VTr extends Tag {
  constructor(setup?: Setup<VTr>);
}

declare function vTr(setup?: Setup<VTr>): VTr;

declare class VTh extends Tag {
  constructor(setup?: Setup<VTh>);
}

declare function vTh(setup?: Setup<VTh>): VTh;

declare class VTd extends Tag {
  constructor(setup?: Setup<VTd>);
}

declare function vTd(setup?: Setup<VTd>): VTd;

// ============================================
// VTabs 标签页组件
// ============================================

interface VTabsTabData {
  id: string;
  title: string;
  icon?: string;
  closable: boolean;
  data: Record<string, any>;
  content: ((container: Tag) => void) | Tag;
  el?: Tag;
  contentEl?: Tag;
}

declare class VTabs extends Tag {
  constructor(setup?: Setup<VTabs>);
  editable(value?: boolean): this | boolean;
  closable(value?: boolean): this | boolean;
  dragable(value?: boolean): this | boolean;
  addTab(id: string, title: string, content: ((container: Tag) => void) | Tag, options?: {
    icon?: string;
    closable?: boolean;
    data?: Record<string, any>;
  }): this;
  setActiveTab(id: string): this;
  removeTab(id: string): this;
  updateTabTitle(id: string, title: string): this;
  getActiveTabId(): string | null;
  getActiveTab(): VTabsTabData | null;
  getTabs(): VTabsTabData[];
  onChange(fn: (id: string, tab: VTabsTabData) => void): this;
}

declare function vTabs(setup?: Setup<VTabs>): VTabs;

// ============================================
// VRouter 路由组件
// ============================================

interface VRoute {
  pattern: string;
  component: ((params: Record<string, any>) => Tag) | Tag;
  beforeEnter?: (to: { path: string; pattern: string; params: Record<string, any> }, from: any) => boolean | Promise<boolean>;
}

declare class VRouter extends Tag {
  constructor(setup?: Setup<VRouter>);
  mode(mode: 'hash'): this;
  default(path: string): this;
  route(pattern: string, config: VRoute | ((handler: { component: any; beforeEnter: any }) => void)): this;
  navigate(path: string, options?: { replace?: boolean }): this;
  go(delta: number): this;
  back(): this;
  forward(): this;
  currentPath(): string;
  currentParams(): Record<string, any>;
  refresh(): this;
  beforeEach(guard: (to: any, from: any) => boolean | Promise<boolean>): this;
  afterEach(hook: (to: any, from: any) => void): this;
}

declare function vRouter(setup?: Setup<VRouter>): VRouter;

declare function vRoute(pattern: string): {
  component(fn: (params: Record<string, any>) => Tag): this;
  beforeEnter(fn: (to: any, from: any) => boolean | Promise<boolean>): this;
  build(): VRoute;
};

declare class VLink extends Tag {
  constructor(to?: string, setup?: Setup<VLink>);
  to(path: string): this;
  replace(value?: boolean): this | boolean;
}

declare function vLink(to?: string, content?: string | ((link: VLink) => void), setup?: Setup<VLink>): VLink;

declare class VRouterView extends Tag {
  constructor(router: VRouter, setup?: Setup<VRouterView>);
}

declare function vRouterView(router: VRouter, setup?: Setup<VRouterView>): VRouterView;

// ============================================
// VRouterViews 多路由视图容器
// ============================================

declare class VRouterViews extends Tag {
  constructor(router: VRouter, setup?: Setup<VRouterViews>);
  addView(name: string, options?: { title?: string; icon?: string; closable?: boolean; defaultRoute?: string }): this;
  setActiveView(name: string): this;
  removeView(name: string): this;
  updateViewTitle(name: string, title: string): this;
  getActiveViewName(): string | null;
  getActiveView(): object | null;
  getViews(): object[];
  onChange(fn: (name: string, view: object) => void): this;
}

declare function vRouterViews(router: VRouter, setup?: Setup<VRouterViews>): VRouterViews;

// ============================================
// 导出
// ============================================

export {
  // VCard
  VCard, VCardHeader, VCardBody, VCardFooter,
  vCard, vCardHeader, vCardBody, vCardFooter,

  // VMenu
  VMenu, VMenuItem, VMenuDivider, VMenuGroup, VSubMenu, VDropdownMenu, VContextMenu, VSidebar,
  vMenu, vMenuItem, vMenuDivider, vMenuGroup, vSubMenu, vDropdownMenu, vContextMenu, vSidebar,

  // VMessage
  VMessage, VMessageContainer, VMessageManager,
  vMessage, vMessageContainer,
  vMessageManager, toast,

  // VButton
  VButton, vButton,

  // Form
  VInput, vInput,
  VSelect, vSelect,
  VTextarea, vTextarea,
  VCheckbox, vCheckbox,
  VSwitch, vSwitch,
  VForm, vForm,

  // VCode
  VCode, vCode,
  CodeBlock, codeBlock,

  // VDetail
  VDetail, vDetail,
  VDetailItem, vDetailItem,

  // VField
  VField, vField,

  // VTable
  VTable, vTable,
  VThead, vThead,
  VTbody, vTbody,
  VTfoot, vTfoot,
  VTr, vTr,
  VTh, vTh,
  VTd, vTd,

  // VTabs
  VTabs, vTabs,

  // VRouter
  VRouter, vRouter,
  VRoute, vRoute,
  VLink, vLink,
  VRouterView, vRouterView,

  // VTree
  VTree, vTree,
};
