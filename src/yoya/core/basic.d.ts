/**
 * Yoya.Basic - Core Type Declarations
 */

// ============================================
// 通用类型
// ============================================

export type Setup<T> = ((instance: T) => void) | string | Partial<Record<string, any>>;

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
  constructor(host: Tag, stateAttrs?: string[]);

  registerStateAttrs(...attrs: string[]): this;
  getStateAttrs(): string[];

  registerHandler(stateName: string, handler: (enabled: boolean, host: Tag) => void): this;
  removeHandler(stateName: string, handler: Function): this;

  registerInterceptor(interceptor: (stateName: string, enabled: boolean) => { stateName: string; enabled: boolean } | null): this;
  removeInterceptor(interceptor: Function): this;

  setState(stateName: string, enabled?: boolean): this;
  getState(stateName: string): boolean;
  getAllStates(): Record<string, boolean>;
  hasState(stateName: string): boolean;

  saveSnapshot(snapshotName?: string): this;
  restoreSnapshot(snapshotName?: string): this;

  initialize(defaultStates?: Record<string, boolean>): this;
  deinitialize(): this;
  reset(): this;

  destroy(): void;
}

// ============================================
// Theme 主题
// ============================================

export class Theme {
  constructor(name?: string);

  name: string;
  stateStyles: Record<string, Record<string, string>>;
  stateHandlers: Record<string, Function>;
  componentThemes: Record<string, { stateStyles: Record<string, Record<string, string>>; handlers: Record<string, Function> }>;

  setComponentStateStyles(componentName: string, stateName: string, styles: Record<string, string>): this;
  setComponentStateHandler(componentName: string, stateName: string, handler: Function): this;
  register(): this;
  applyToComponent(component: Tag): void;
}

// ============================================
// ThemeManager 主题管理器
// ============================================

export class ThemeManager {
  registerTheme(theme: Theme): this;
  getTheme(name: string): Theme | undefined;
  setTheme(name: string): this;
  getCurrentTheme(): Theme | null;
  applyTheme(component: Tag): this;
  applyAllThemes(component: Tag): this;
}

export const themeManager: ThemeManager;

export function createTheme(name: string, definitions?: Record<string, Record<string, Record<string, string>>>): Theme;
export function registerStateHandler(themeName: string, componentName: string, stateName: string, handler: Function): Theme;
export function initStateMachine(stateAttrs?: string[]): Function;

// ============================================
// Tag 基类
// ============================================

export class Tag {
  constructor(tagName: string, setup?: Setup<Tag>);

  _tagName: string;
  _attrs: Record<string, any>;
  _styles: Record<string, string>;
  _classes: Set<string>;
  _events: Record<string, Function[]>;
  _children: (Tag | Text)[];
  _boundElement: HTMLElement | null;
  _rendered: boolean;
  _deleted: boolean;
  _states: Set<string>;
  _stateStyles: Record<string, Record<string, string>>;
  _stateMachine?: StateMachine;
  _stateTypes: Record<string, StateType>;

  // setup
  setup(setup: Setup<this>): this;

  // 属性
  attr(name: string, value?: any): this | any;
  id(value?: string): this | string;
  name(value?: string): this | string;

  // 类
  class(...classes: (string | string[])[]): this;

  // 样式
  style(name: string, value?: string): this | string;
  style(styles: Record<string, string>): this;
  styles(styles: Record<string, string>): this;

  // 事件
  on(event: string, handler: Function): this;

  // 内容
  text(content: string | number): this;
  html(content: string): this;
  child(...children: (Tag | Text | null | undefined)[]): this;
  clear(): this;

  // DOM
  bindTo(target: string | HTMLElement): this;
  renderDom(): HTMLElement | null;
  destroy(): this;
  toHTML(): string;

  // 状态管理（支持 boolean/string/number）
  registerStateAttrs(...attrs: (string | Record<string, StateType>)[]): this;
  registerStateHandler(stateName: string, handler: StateHandler): this;
  setState(stateName: string, value: StateValue): this;
  getState(stateName: string): StateValue;
  getBooleanState(stateName: string): boolean;
  getStringState(stateName: string): string;
  getNumberState(stateName: string): number;
  hasState(stateName: string): boolean;
  getAllStates(): Record<string, StateValue>;
  resetStates(): this;
  saveStateSnapshot(name?: string): this;
  restoreStateSnapshot(name?: string): this;
  initializeStates(defaultStates?: Record<string, StateValue>): this;
  deinitializeStates(): this;
  registerStateInterceptor(interceptor: StateInterceptor): this;

  // Tag 原型扩展方法 - 基础容器
  div(setup?: Setup<Div>): this;
  span(setup?: Setup<Span>): this;
  p(setup?: Setup<P>): this;
  section(setup?: Setup<Section>): this;
  article(setup?: Setup<Article>): this;
  header(setup?: Setup<Header>): this;
  footer(setup?: Setup<Footer>): this;
  nav(setup?: Setup<Nav>): this;
  aside(setup?: Setup<Aside>): this;
  main(setup?: Setup<Main>): this;
  h1(setup?: Setup<H1>): this;
  h2(setup?: Setup<H2>): this;
  h3(setup?: Setup<H3>): this;
  h4(setup?: Setup<H4>): this;
  h5(setup?: Setup<H5>): this;
  h6(setup?: Setup<H6>): this;

  // Tag 原型扩展方法 - 文本格式化
  a(setup?: Setup<A>): this;
  strong(setup?: Setup<Strong>): this;
  em(setup?: Setup<Em>): this;
  code(setup?: Setup<Code>): this;
  pre(setup?: Setup<Pre>): this;
  blockquote(setup?: Setup<Blockquote>): this;

  // Tag 原型扩展方法 - 表单
  button(setup?: Setup<Button>): this;
  input(setup?: Setup<Input>): this;
  textarea(setup?: Setup<Textarea>): this;
  select(setup?: Setup<Select>): this;
  option(setup?: Setup<Option>): this;
  label(setup?: Setup<Label>): this;
  form(setup?: Setup<Form>): this;

  // Tag 原型扩展方法 - 列表
  ul(setup?: Setup<Ul>): this;
  ol(setup?: Setup<Ol>): this;
  li(setup?: Setup<Li>): this;
  dl(setup?: Setup<Dl>): this;
  dt(setup?: Setup<Dt>): this;
  dd(setup?: Setup<Dd>): this;

  // Tag 原型扩展方法 - 表格
  table(setup?: Setup<Table>): this;
  tr(setup?: Setup<Tr>): this;
  td(setup?: Setup<Td>): this;
  th(setup?: Setup<Th>): this;
  thead(setup?: Setup<Thead>): this;
  tbody(setup?: Setup<Tbody>): this;
  tfoot(setup?: Setup<Tfoot>): this;

  // Tag 原型扩展方法 - 媒体
  img(setup?: Setup<Img>): this;
  video(setup?: Setup<Video>): this;
  audio(setup?: Setup<Audio>): this;
  source(setup?: Setup<Source>): this;

  // Tag 原型扩展方法 - 其他
  br(setup?: Setup<Br>): this;
  hr(setup?: Setup<Hr>): this;

  // Tag 原型扩展方法 - IFrame, Canvas
  iframe(setup?: Setup<IFrame>): this;
  canvas(setup?: Setup<Canvas>): this;
}

// ============================================
// Text 文本节点
// ============================================

export class Text extends Tag {
  constructor(content?: string | number, setup?: Setup<Text>);
  content(value?: string): this | string;
}

export function text(content?: string | number): Text;

// ============================================
// 基础容器元素
// ============================================

export class Div extends Tag {
  constructor(setup?: Setup<Div>);
}
export function div(setup?: Setup<Div>): Div;

export class Span extends Tag {
  constructor(setup?: Setup<Span>);
}
export function span(setup?: Setup<Span>): Span;

export class P extends Tag {
  constructor(setup?: Setup<P>);
}
export function p(setup?: Setup<P>): P;

export class Section extends Tag {
  constructor(setup?: Setup<Section>);
}
export function section(setup?: Setup<Section>): Section;

export class Article extends Tag {
  constructor(setup?: Setup<Article>);
}
export function article(setup?: Setup<Article>): Article;

export class Header extends Tag {
  constructor(setup?: Setup<Header>);
}
export function header(setup?: Setup<Header>): Header;

export class Footer extends Tag {
  constructor(setup?: Setup<Footer>);
}
export function footer(setup?: Setup<Footer>): Footer;

export class Nav extends Tag {
  constructor(setup?: Setup<Nav>);
}
export function nav(setup?: Setup<Nav>): Nav;

export class Aside extends Tag {
  constructor(setup?: Setup<Aside>);
}
export function aside(setup?: Setup<Aside>): Aside;

export class Main extends Tag {
  constructor(setup?: Setup<Main>);
}
export function main(setup?: Setup<Main>): Main;

export class H1 extends Tag {
  constructor(setup?: Setup<H1>);
}
export function h1(setup?: Setup<H1>): H1;

export class H2 extends Tag {
  constructor(setup?: Setup<H2>);
}
export function h2(setup?: Setup<H2>): H2;

export class H3 extends Tag {
  constructor(setup?: Setup<H3>);
}
export function h3(setup?: Setup<H3>): H3;

export class H4 extends Tag {
  constructor(setup?: Setup<H4>);
}
export function h4(setup?: Setup<H4>): H4;

export class H5 extends Tag {
  constructor(setup?: Setup<H5>);
}
export function h5(setup?: Setup<H5>): H5;

export class H6 extends Tag {
  constructor(setup?: Setup<H6>);
}
export function h6(setup?: Setup<H6>): H6;

// ============================================
// 文本格式化元素
// ============================================

export class A extends Tag {
  constructor(setup?: Setup<A>);
  href(value?: string): this | string;
  target(value?: string): this | string;
}
export function a(setup?: Setup<A>): A;

export class Strong extends Tag {
  constructor(setup?: Setup<Strong>);
}
export function strong(setup?: Setup<Strong>): Strong;

export class Em extends Tag {
  constructor(setup?: Setup<Em>);
}
export function em(setup?: Setup<Em>): Em;

export class Code extends Tag {
  constructor(setup?: Setup<Code>);
}
export function code(setup?: Setup<Code>): Code;

export class Pre extends Tag {
  constructor(setup?: Setup<Pre>);
}
export function pre(setup?: Setup<Pre>): Pre;

export class Blockquote extends Tag {
  constructor(setup?: Setup<Blockquote>);
}
export function blockquote(setup?: Setup<Blockquote>): Blockquote;

// ============================================
// 表单元素
// ============================================

export class Button extends Tag {
  constructor(setup?: Setup<Button>);
  type(value?: string): this | string;
  disabled(value?: boolean): this | boolean;
  submit(): this;
  large(): this;
}
export function button(setup?: Setup<Button>): Button;

export class Input extends Tag {
  constructor(setup?: Setup<Input>);
  type(value?: string): this | string;
  value(val?: string): this | string;
  placeholder(value?: string): this | string;
  disabled(value?: boolean): this | boolean;
  readonly(value?: boolean): this | boolean;
}
export function input(setup?: Setup<Input>): Input;

export class Textarea extends Tag {
  constructor(setup?: Setup<Textarea>);
  value(val?: string): this | string;
  placeholder(value?: string): this | string;
  rows(value?: number): this | number;
  cols(value?: number): this | number;
  disabled(value?: boolean): this | boolean;
}
export function textarea(setup?: Setup<Textarea>): Textarea;

export class Select extends Tag {
  constructor(setup?: Setup<Select>);
  value(val?: string): this | string;
  disabled(value?: boolean): this | boolean;
  option(setup?: Setup<Option>): this;
}
export function select(setup?: Setup<Select>): Select;

export class Option extends Tag {
  constructor(setup?: Setup<Option>);
  value(val?: string): this | string;
  selected(value?: boolean): this | boolean;
  disabled(value?: boolean): this | boolean;
}
export function option(setup?: Setup<Option>): Option;

export class Label extends Tag {
  constructor(setup?: Setup<Label>);
  for(value?: string): this | string;
}
export function label(setup?: Setup<Label>): Label;

export class Form extends Tag {
  constructor(setup?: Setup<Form>);
  action(value?: string): this | string;
  method(value?: string): this | string;
  enctype(value?: string): this | string;
  input(setup?: Setup<Input>): this;
  button(setup?: Setup<Button>): this;
  textarea(setup?: Setup<Textarea>): this;
  select(setup?: Setup<Select>): this;
}
export function form(setup?: Setup<Form>): Form;

// ============================================
// 列表元素
// ============================================

export class Ul extends Tag {
  constructor(setup?: Setup<Ul>);
  li(setup?: Setup<Li>): this;
}
export function ul(setup?: Setup<Ul>): Ul;

export class Ol extends Tag {
  constructor(setup?: Setup<Ol>);
  li(setup?: Setup<Li>): this;
}
export function ol(setup?: Setup<Ol>): Ol;

export class Li extends Tag {
  constructor(setup?: Setup<Li>);
}
export function li(setup?: Setup<Li>): Li;

export class Dl extends Tag {
  constructor(setup?: Setup<Dl>);
  dt(setup?: Setup<Dt>): this;
  dd(setup?: Setup<Dd>): this;
}
export function dl(setup?: Setup<Dl>): Dl;

export class Dt extends Tag {
  constructor(setup?: Setup<Dt>);
}
export function dt(setup?: Setup<Dt>): Dt;

export class Dd extends Tag {
  constructor(setup?: Setup<Dd>);
}
export function dd(setup?: Setup<Dd>): Dd;

// ============================================
// 表格元素
// ============================================

export class Table extends Tag {
  constructor(setup?: Setup<Table>);
  tr(setup?: Setup<Tr>): this;
}
export function table(setup?: Setup<Table>): Table;

export class Tr extends Tag {
  constructor(setup?: Setup<Tr>);
  td(setup?: Setup<Td>): this;
  th(setup?: Setup<Th>): this;
}
export function tr(setup?: Setup<Tr>): Tr;

export class Td extends Tag {
  constructor(setup?: Setup<Td>);
  colspan(value?: number): this | number;
  rowspan(value?: number): this | number;
}
export function td(setup?: Setup<Td>): Td;

export class Th extends Tag {
  constructor(setup?: Setup<Th>);
  colspan(value?: number): this | number;
  rowspan(value?: number): this | number;
  scope(value?: string): this | string;
}
export function th(setup?: Setup<Th>): Th;

export class Thead extends Tag {
  constructor(setup?: Setup<Thead>);
  tr(setup?: Setup<Tr>): this;
}
export function thead(setup?: Setup<Thead>): Thead;

export class Tbody extends Tag {
  constructor(setup?: Setup<Tbody>);
  tr(setup?: Setup<Tr>): this;
}
export function tbody(setup?: Setup<Tbody>): Tbody;

export class Tfoot extends Tag {
  constructor(setup?: Setup<Tfoot>);
  tr(setup?: Setup<Tr>): this;
}
export function tfoot(setup?: Setup<Tfoot>): Tfoot;

// ============================================
// 媒体元素
// ============================================

export class Img extends Tag {
  constructor(setup?: Setup<Img>);
  src(value?: string): this | string;
  alt(value?: string): this | string;
  width(value?: number | string): this | number | string;
  height(value?: number | string): this | number | string;
}
export function img(setup?: Setup<Img>): Img;

export class Video extends Tag {
  constructor(setup?: Setup<Video>);
  src(value?: string): this | string;
  width(value?: number | string): this | number | string;
  height(value?: number | string): this | number | string;
  controls(value?: boolean): this | boolean;
  autoplay(value?: boolean): this | boolean;
  loop(value?: boolean): this | boolean;
}
export function video(setup?: Setup<Video>): Video;

export class Audio extends Tag {
  constructor(setup?: Setup<Audio>);
  src(value?: string): this | string;
  controls(value?: boolean): this | boolean;
  autoplay(value?: boolean): this | boolean;
  loop(value?: boolean): this | boolean;
}
export function audio(setup?: Setup<Audio>): Audio;

export class Source extends Tag {
  constructor(setup?: Setup<Source>);
  src(value?: string): this | string;
  type(value?: string): this | string;
}
export function source(setup?: Setup<Source>): Source;

// ============================================
// 其他元素
// ============================================

export class Br extends Tag {
  constructor(setup?: Setup<Br>);
}
export function br(setup?: Setup<Br>): Br;

export class Hr extends Tag {
  constructor(setup?: Setup<Hr>);
}
export function hr(setup?: Setup<Hr>): Hr;

export class IFrame extends Tag {
  constructor(setup?: Setup<IFrame>);
  src(value?: string): this | string;
  width(value?: number | string): this | number | string;
  height(value?: number | string): this | number | string;
  frameborder(value?: number | string): this | number | string;
}
export function iframe(setup?: Setup<IFrame>): IFrame;

export class Canvas extends Tag {
  constructor(setup?: Setup<Canvas>);
  width(value?: number | string): this | number | string;
  height(value?: number | string): this | number | string;
}
export function canvas(setup?: Setup<Canvas>): Canvas;

// ============================================
// 通用工厂函数
// ============================================

export function tag(name: string, setup?: Setup<Tag>): Tag;
