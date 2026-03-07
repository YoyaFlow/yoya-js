/**
 * Yoya.Basic - TypeScript Type Declarations
 * Browser-native HTML DSL Library
 */

// ============================================
// 工具类型
// ============================================

type SetupFunction<T extends Tag = Tag> = (element: T) => void;

type SetupObject = {
  class?: string | string[];
  style?: Record<string, string | number>;
  children?: (string | number | Tag | null | undefined | (string | number | Tag | null | undefined)[])[];
  [key: string]: unknown;
};

type Setup<T extends Tag = Tag> = SetupFunction<T> | SetupObject | string | null;

// ============================================
// Tag 基类
// ============================================

declare class Tag {
  // 公共属性（只读）
  readonly _tagName: string;
  readonly _props: Record<string, any>;

  // 构造函数
  constructor(tagName: string, setup?: Setup);

  // 核心方法
  setup(setup: Setup): this;

  // 属性操作
  attr(name: string, value?: any): this | any;

  // 类操作
  class(...classes: (string | string[])[]): this;

  // 样式操作
  style(name: string, value: string | number, syncImmediately?: boolean): this;
  style(styles: Record<string, string | number>, syncImmediately?: boolean): this;

  // 批量样式设置
  styles(styles: Record<string, string | number>, syncImmediately?: boolean): this;

  // 事件绑定
  on(event: string, handler: (e: Event) => void): this;

  // 统一事件包装器（内部方法）
  _wrapHandler(handler: Function, buildContext?: (e: Event, host: Tag) => Record<string, any>): (e: Event) => void;

  // 标准事件方法 - 统一单对象参数格式
  onClick(handler: (e: { event: MouseEvent; target: Tag }) => void): this;
  onChangeValue(handler: (e: { event: Event; value: any; oldValue?: any; target: Tag }) => void): this;
  onInputValue(handler: (e: { event: Event; value: any; target: Tag }) => void): this;
  onToggle(handler: (e: { event: Event; value: boolean; oldValue?: boolean; target: Tag }) => void): this;
  onFocus(handler: (e: { event: FocusEvent; target: Tag }) => void): this;
  onBlur(handler: (e: { event: FocusEvent; target: Tag }) => void): this;
  onKey(handler: (e: { event: KeyboardEvent; key: string; code: string; target: Tag }) => void): this;
  onMouseEnter(handler: (e: { event: MouseEvent; target: Tag }) => void): this;
  onMouseLeave(handler: (e: { event: MouseEvent; target: Tag }) => void): this;

  // 文本节点（作为子元素）
  text(content: string | number): this;

  // HTML 内容
  html(content: string): this;

  // 子元素
  child(...children: (Tag | string | number | null | undefined | (Tag | string | number | null | undefined)[])[]): this;

  // 清空
  clear(): this;

  // 绑定到 DOM
  bindTo(target: string | HTMLElement): this;

  // 渲染
  renderDom(): HTMLElement | null;

  // 销毁
  destroy(): this;

  // 转换为 HTML 字符串
  toHTML(): string;
}

// ============================================
// 基础容器元素
// ============================================

declare class Div extends Tag {
  constructor(setup?: Setup<Div>);
}

declare class Span extends Tag {
  constructor(setup?: Setup<Span>);
}

declare class P extends Tag {
  constructor(setup?: Setup<P>);
}

declare class Section extends Tag {
  constructor(setup?: Setup<Section>);
}

declare class Article extends Tag {
  constructor(setup?: Setup<Article>);
}

declare class Header extends Tag {
  constructor(setup?: Setup<Header>);
}

declare class Footer extends Tag {
  constructor(setup?: Setup<Footer>);
}

declare class Nav extends Tag {
  constructor(setup?: Setup<Nav>);
}

declare class Aside extends Tag {
  constructor(setup?: Setup<Aside>);
}

declare class Main extends Tag {
  constructor(setup?: Setup<Main>);
}

declare class H1 extends Tag {
  constructor(setup?: Setup<H1>);
}

declare class H2 extends Tag {
  constructor(setup?: Setup<H2>);
}

declare class H3 extends Tag {
  constructor(setup?: Setup<H3>);
}

declare class H4 extends Tag {
  constructor(setup?: Setup<H4>);
}

declare class H5 extends Tag {
  constructor(setup?: Setup<H5>);
}

declare class H6 extends Tag {
  constructor(setup?: Setup<H6>);
}

// ============================================
// 文本格式化元素
// ============================================

declare class A extends Tag {
  constructor(setup?: Setup<A>);
  href(value?: string): this | string;
  target(value?: string): this | string;
}

declare class Strong extends Tag {
  constructor(setup?: Setup<Strong>);
}

declare class Em extends Tag {
  constructor(setup?: Setup<Em>);
}

declare class Code extends Tag {
  constructor(setup?: Setup<Code>);
}

declare class Pre extends Tag {
  constructor(setup?: Setup<Pre>);
}

declare class Blockquote extends Tag {
  constructor(setup?: Setup<Blockquote>);
}

// ============================================
// 表单元素
// ============================================

declare class Button extends Tag {
  constructor(setup?: Setup<Button>);
  type(value?: string): this | string;
  disabled(value?: boolean): this | boolean;
  submit(): this;
  large(): this;
}

declare class Input extends Tag {
  constructor(setup?: Setup<Input>);
  type(value?: string): this | string;
  value(val?: string): this | string;
  placeholder(value?: string): this | string;
  disabled(value?: boolean): this | boolean;
  readonly(value?: boolean): this | boolean;
  name(value?: string): this | string;
  focus(): this;
  blur(): this;
}

declare class Textarea extends Tag {
  constructor(setup?: Setup<Textarea>);
  value(val?: string): this | string;
  placeholder(value?: string): this | string;
  rows(value?: number): this | number;
  cols(value?: number): this | number;
  disabled(value?: boolean): this | boolean;
  name(value?: string): this | string;
  focus(): this;
  blur(): this;
}

declare class Select extends Tag {
  constructor(setup?: Setup<Select>);
  value(val?: string): this | string;
  disabled(value?: boolean): this | boolean;
  name(value?: string): this | string;
  option(setup?: Setup<Option>): this;
}

declare class Option extends Tag {
  constructor(setup?: Setup<Option>);
  value(val?: string): this | string;
  selected(value?: boolean): this | boolean;
  disabled(value?: boolean): this | boolean;
}

declare class Label extends Tag {
  constructor(setup?: Setup<Label>);
  for(value?: string): this | string;
}

declare class Form extends Tag {
  constructor(setup?: Setup<Form>);
  action(value?: string): this | string;
  method(value?: string): this | string;
  enctype(value?: string): this | string;
  input(setup?: Setup<Input>): this;
  button(setup?: Setup<Button>): this;
  textarea(setup?: Setup<Textarea>): this;
  select(setup?: Setup<Select>): this;
}

// ============================================
// 列表元素
// ============================================

declare class Ul extends Tag {
  constructor(setup?: Setup<Ul>);
  li(setup?: Setup<Li>): this;
}

declare class Ol extends Tag {
  constructor(setup?: Setup<Ol>);
  li(setup?: Setup<Li>): this;
}

declare class Li extends Tag {
  constructor(setup?: Setup<Li>);
}

declare class Dl extends Tag {
  constructor(setup?: Setup<Dl>);
  dt(setup?: Setup<Dt>): this;
  dd(setup?: Setup<Dd>): this;
}

declare class Dt extends Tag {
  constructor(setup?: Setup<Dt>);
}

declare class Dd extends Tag {
  constructor(setup?: Setup<Dd>);
}

// ============================================
// 表格元素
// ============================================

declare class Table extends Tag {
  constructor(setup?: Setup<Table>);
  tr(setup?: Setup<Tr>): this;
}

declare class Tr extends Tag {
  constructor(setup?: Setup<Tr>);
  td(setup?: Setup<Td>): this;
  th(setup?: Setup<Th>): this;
}

declare class Td extends Tag {
  constructor(setup?: Setup<Td>);
  colspan(value?: number): this | number;
  rowspan(value?: number): this | number;
}

declare class Th extends Tag {
  constructor(setup?: Setup<Th>);
  colspan(value?: number): this | number;
  rowspan(value?: number): this | number;
  scope(value?: string): this | string;
}

declare class Thead extends Tag {
  constructor(setup?: Setup<Thead>);
  tr(setup?: Setup<Tr>): this;
}

declare class Tbody extends Tag {
  constructor(setup?: Setup<Tbody>);
  tr(setup?: Setup<Tr>): this;
}

declare class Tfoot extends Tag {
  constructor(setup?: Setup<Tfoot>);
  tr(setup?: Setup<Tr>): this;
}

// ============================================
// 媒体元素
// ============================================

declare class Img extends Tag {
  constructor(setup?: Setup<Img>);
  src(value?: string): this | string;
  alt(value?: string): this | string;
  width(value?: number | string): this | number | string;
  height(value?: number | string): this | number | string;
}

declare class Video extends Tag {
  constructor(setup?: Setup<Video>);
  src(value?: string): this | string;
  width(value?: number | string): this | number | string;
  height(value?: number | string): this | number | string;
  controls(value?: boolean): this | boolean;
  autoplay(value?: boolean): this | boolean;
  loop(value?: boolean): this | boolean;
}

declare class Audio extends Tag {
  constructor(setup?: Setup<Audio>);
  src(value?: string): this | string;
  controls(value?: boolean): this | boolean;
  autoplay(value?: boolean): this | boolean;
  loop(value?: boolean): this | boolean;
}

declare class Source extends Tag {
  constructor(setup?: Setup<Source>);
  src(value?: string): this | string;
  type(value?: string): this | string;
}

// ============================================
// 其他元素
// ============================================

declare class Br extends Tag {
  constructor(setup?: Setup<Br>);
}

declare class Hr extends Tag {
  constructor(setup?: Setup<Hr>);
}

declare class Text extends Tag {
  constructor(content?: string | number, setup?: Setup<Text>);
  content(value?: string): this | string;
  renderDom(): Text | null;
  toHTML(): string;
}

declare class IFrame extends Tag {
  constructor(setup?: Setup<IFrame>);
  src(value?: string): this | string;
  width(value?: number | string): this | number | string;
  height(value?: number | string): this | number | string;
  frameborder(value?: number | string): this | number | string;
}

declare class Canvas extends Tag {
  constructor(setup?: Setup<Canvas>);
  width(value?: number | string): this | number | string;
  height(value?: number | string): this | number | string;
}

// ============================================
// 工厂函数
// ============================================

// 基础容器
declare function div(setup?: Setup<Div>): Div;
declare function span(setup?: Setup<Span>): Span;
declare function p(setup?: Setup<P>): P;
declare function section(setup?: Setup<Section>): Section;
declare function article(setup?: Setup<Article>): Article;
declare function header(setup?: Setup<Header>): Header;
declare function footer(setup?: Setup<Footer>): Footer;
declare function nav(setup?: Setup<Nav>): Nav;
declare function aside(setup?: Setup<Aside>): Aside;
declare function main(setup?: Setup<Main>): Main;
declare function h1(setup?: Setup<H1>): H1;
declare function h2(setup?: Setup<H2>): H2;
declare function h3(setup?: Setup<H3>): H3;
declare function h4(setup?: Setup<H4>): H4;
declare function h5(setup?: Setup<H5>): H5;
declare function h6(setup?: Setup<H6>): H6;

// 文本格式化
declare function a(setup?: Setup<A>): A;
declare function strong(setup?: Setup<Strong>): Strong;
declare function em(setup?: Setup<Em>): Em;
declare function code(setup?: Setup<Code>): Code;
declare function pre(setup?: Setup<Pre>): Pre;
declare function blockquote(setup?: Setup<Blockquote>): Blockquote;

// 表单
declare function button(setup?: Setup<Button>): Button;
declare function input(setup?: Setup<Input>): Input;
declare function textarea(setup?: Setup<Textarea>): Textarea;
declare function select(setup?: Setup<Select>): Select;
declare function option(setup?: Setup<Option>): Option;
declare function label(setup?: Setup<Label>): Label;
declare function form(setup?: Setup<Form>): Form;

// 列表
declare function ul(setup?: Setup<Ul>): Ul;
declare function ol(setup?: Setup<Ol>): Ol;
declare function li(setup?: Setup<Li>): Li;
declare function dl(setup?: Setup<Dl>): Dl;
declare function dt(setup?: Setup<Dt>): Dt;
declare function dd(setup?: Setup<Dd>): Dd;

// 表格
declare function table(setup?: Setup<Table>): Table;
declare function tr(setup?: Setup<Tr>): Tr;
declare function td(setup?: Setup<Td>): Td;
declare function th(setup?: Setup<Th>): Th;
declare function thead(setup?: Setup<Thead>): Thead;
declare function tbody(setup?: Setup<Tbody>): Tbody;
declare function tfoot(setup?: Setup<Tfoot>): Tfoot;

// 媒体
declare function img(setup?: Setup<Img>): Img;
declare function video(setup?: Setup<Video>): Video;
declare function audio(setup?: Setup<Audio>): Audio;
declare function source(setup?: Setup<Source>): Source;

// 其他
declare function br(setup?: Setup<Br>): Br;
declare function hr(setup?: Setup<Hr>): Hr;
declare function iframe(setup?: Setup<IFrame>): IFrame;
declare function canvas(setup?: Setup<Canvas>): Canvas;

// 文本节点
declare function text(content?: string | number): Text;

// 通用
declare function tag(name: string, setup?: Setup): Tag;

// ============================================
// 导出
// ============================================

export {
  // 类
  Tag,
  Div, Span, P, Section, Article, Header, Footer, Nav, Aside, Main,
  H1, H2, H3, H4, H5, H6,
  A, Strong, Em, Code, Pre, Blockquote,
  Button, Input, Textarea, Select, Option, Label, Form,
  Ul, Ol, Li, Dl, Dt, Dd,
  Table, Tr, Td, Th, Thead, Tbody, Tfoot,
  Img, Video, Audio, Source,
  Br, Hr, IFrame, Canvas,

  // 工厂函数
  div, span, p, section, article, header, footer, nav, aside, main,
  h1, h2, h3, h4, h5, h6,
  a, strong, em, code, pre, blockquote,
  button, input, textarea, select, option, label, form,
  ul, ol, li, dl, dt, dd,
  table, tr, td, th, thead, tbody, tfoot,
  img, video, audio, source,
  br, hr, iframe, canvas,
  text,
  tag
};

// 导出布局组件
export * from './core/layout';

// 导出 SVG 组件
export * from './core/svg';

// 导出 UI 组件
export * from './components';

// ============================================
// i18n 模块
// ============================================

declare function t(key: string, defaultValue?: string, params?: Record<string, any>): string;
declare function translate(key: string, params?: Record<string, any>): string;
declare function setLanguage(lang: string, save?: boolean): void;
declare function getLanguage(): string;
declare function registerLanguage(lang: string, messages: Record<string, string>): void;
declare function initI18n(options?: {
  defaultLanguage?: string;
  languages?: Map<string, Record<string, string>>;
  autoLoad?: boolean;
}): void;
declare function createText(key: string, defaultValue?: string, params?: Record<string, any>): string;
declare function getSupportedLanguages(): string[];
declare function hasLanguage(lang: string): boolean;
declare function loadLanguageFromStorage(): string | null;
declare function saveLanguageToStorage(lang: string): void;

export {
  t,
  translate,
  setLanguage,
  getLanguage,
  registerLanguage,
  initI18n,
  createText,
  getSupportedLanguages,
  hasLanguage,
  loadLanguageFromStorage,
  saveLanguageToStorage,
};

// ============================================
// Helper 工具模块
// ============================================

/** 加载状态枚举 */
declare const LoadStatus: {
  readonly PENDING: 'pending';
  readonly LOADING: 'loading';
  readonly LOADED: 'loaded';
  readonly ERROR: 'error';
};

type LoadStatusType = 'pending' | 'loading' | 'loaded' | 'error';

/** 动态加载组件配置选项 */
interface DynamicLoaderOptions {
  /** 占位内容 */
  placeholder?: Tag | string;
  /** 加载中显示内容 */
  loadingContent?: Tag | string;
  /** 错误时显示内容 */
  errorContent?: Tag | string;
  /** 加载成功回调 (api, loader) => void */
  onLoad?: (api: any, loader: VDynamicLoader) => void;
  /** 加载失败回调 (error, loader) => void */
  onError?: (error: Error, loader: VDynamicLoader) => void;
  /** 状态变化回调 (status, loader) => void */
  onStatusChange?: (status: LoadStatusType, loader: VDynamicLoader) => void;
  /** 重试次数 */
  retryCount?: number;
  /** 重试间隔（毫秒） */
  retryDelay?: number;
  /** 最小高度 */
  minHeight?: string;
  /** 最小宽度 */
  minWidth?: string;
}

/** 动态加载组件类 */
declare class VDynamicLoader extends Tag {
  constructor(moduleLoader: () => Promise<any>, options?: DynamicLoaderOptions, setup?: Setup<VDynamicLoader>);

  /** 获取加载状态 */
  getStatus(): LoadStatusType;

  /** 检查是否已加载 */
  isLoaded(): boolean;

  /** 检查是否加载失败 */
  isError(): boolean;

  /** 检查是否正在加载 */
  isLoading(): boolean;

  /** 获取导出的 API */
  getApi(): any;

  /** 获取错误信息 */
  getError(): Error | null;

  /** 手动重试加载 */
  retry(): Promise<this>;

  /** 设置加载超时 */
  timeout(ms: number): this;

  /** 设置重试配置 */
  retryConfig(count: number, delay?: number): this;

  /** 设置加载回调 */
  onLoad(callback: (api: any, loader: VDynamicLoader) => void): this;

  /** 设置错误回调 */
  onError(callback: (error: Error, loader: VDynamicLoader) => void): this;

  /** 设置状态变化回调 */
  onStatusChange(callback: (status: LoadStatusType, loader: VDynamicLoader) => void): this;

  /** 卸载组件，清理缓存 */
  unload(): this;

  /** 销毁组件 */
  destroy(): this;
}

/** 创建动态加载组件 */
declare function vDynamicLoader(
  moduleLoader: () => Promise<any>,
  options?: DynamicLoaderOptions,
  setup?: Setup<VDynamicLoader>
): VDynamicLoader;

// ============================================
// VSidebar 侧边栏菜单
// ============================================

/** 侧边栏组件选项 */
interface VSidebarOptions {
  /** 侧边栏宽度 */
  width?: string;
  /** 折叠时宽度 */
  collapsedWidth?: string;
}

/** 侧边栏组件类 */
declare class VSidebar extends Tag {
  constructor(setup?: Setup<VSidebar>);

  /** 设置侧边栏宽度 */
  width(w: string): this;

  /** 设置折叠时宽度 */
  collapsedWidth(w: string): this;

  /** 设置头部内容 */
  header(setup: ((el: Tag) => void) | string): this;

  /** 设置内容区域 */
  content(setup: (el: Tag) => void): this;

  /** 设置底部内容 */
  footer(setup: ((el: Tag) => void) | string): this;

  /** 添加菜单项 */
  item(content?: string, setup?: Setup<VMenuItem>): VMenuItem;

  /** 添加分割线 */
  divider(): this;

  /** 添加菜单组 */
  group(setup?: Setup<VMenuGroup>): VMenuGroup;

  /** 切换折叠状态 */
  toggle(): this;

  /** 折叠侧边栏 */
  collapse(): this;

  /** 展开侧边栏 */
  expand(): this;

  /** 是否已折叠 */
  isCollapsed(): boolean;

  /** 添加切换按钮到头部 */
  showToggleBtn(setup?: Setup<VButton>): this;

  /** 使用深色模式 */
  dark(): this;
}

/** 创建侧边栏组件 */
declare function vSidebar(setup?: Setup<VSidebar>): VSidebar;

/** 模块加载结果 */
interface ModuleLoadResult {
  [key: string]: any | { error: Error };
}

/** 批量加载配置选项 */
interface LoadModulesOptions {
  /** 是否并行加载 */
  parallel?: boolean;
  /** 进度回调 (loaded, total) => void */
  onProgress?: (loaded: number, total: number) => void;
  /** 完成回调 (results) => void */
  onComplete?: (results: ModuleLoadResult) => void;
}

/** 批量加载多个模块 */
declare function loadModules(
  modules: Array<{ name: string; loader: () => Promise<any> }>,
  options?: LoadModulesOptions
): Promise<Map<string, any>>;

/** 预加载模块到缓存 */
declare function preloadModules(loaders: Array<() => Promise<any>>): Promise<void>;

/** 清除模块缓存 */
declare function clearModuleCache(loader?: (() => Promise<any>) | string): void;

/** 获取模块缓存状态 */
declare function getModuleCacheStatus(loader: () => Promise<any>): {
  status: LoadStatusType;
  api?: any;
  error?: Error;
} | null;

export {
  // 状态常量
  LoadStatus,

  // 动态加载组件
  VDynamicLoader,
  vDynamicLoader,

  // 侧边栏组件
  VSidebar,
  vSidebar,

  // 批量加载工具
  loadModules,
  preloadModules,
  clearModuleCache,
  getModuleCacheStatus,
};
