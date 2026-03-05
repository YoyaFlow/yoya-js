/**
 * Yoya.Basic - Browser-native HTML DSL Library
 * 提供类似 Kotlin HTML DSL 的声明式语法
 */

// 从 basic.js 导入 Tag
import { Tag } from './core/basic.js';

// 从 theme.js 导入 initTagExtensions 并立即初始化
import { initTagExtensions } from './core/theme.js';
initTagExtensions(Tag);

// 导出 basic.js
export {
  // 基类
  Tag,

  // 基础容器
  Div, Span, P, Section, Article, Header, Footer, Nav, Aside, Main,
  H1, H2, H3, H4, H5, H6,

  // 文本格式化
  A, Strong, Em, Code, Pre, Blockquote,

  // 表单
  Button, Input, Textarea, Select, Option, Label, Form,

  // 列表
  Ul, Ol, Li, Dl, Dt, Dd,

  // 表格
  Table, Tr, Td, Th, Thead, Tbody, Tfoot,

  // 媒体
  Img, Video, Audio, Source,

  // 其他
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
} from './core/basic.js';

// 导出布局组件
export {
  // 类
  Flex, Grid, ResponsiveGrid,
  Stack, HStack, VStack,
  Center, Spacer, Container,
  Divider,

  // 工厂函数
  flex, grid, responsiveGrid,
  stack, hstack, vstack,
  center, spacer, container,
  divider
} from './core/layout.js';

// 导出 SVG 组件
export {
  // 类
  SvgTag, Svg, Circle, Ellipse, Rect, Line, Polyline, Polygon, Path,
  SvgText, Tspan,
  LinearGradient, RadialGradient, Stop, Pattern,
  Filter, SvgImage, G, SvgElement, Defs,

  // 工厂函数
  svg, circle, ellipse, rect, line, polyline, polygon, path,
  svgText, tspan,
  linearGradient, radialGradient, pattern,
  filter, svgImage, g,
  svgElement, defs, stop
} from './core/svg.js';

// 导出 UI 组件
export {
  // Card 组件
  VCard, VCardHeader, VCardBody, VCardFooter,
  vCard, vCardHeader, vCardBody, vCardFooter,

  // Menu 组件
  VMenu, VMenuItem, VMenuDivider, VMenuGroup, VDropdownMenu, VContextMenu,
  vMenu, vMenuItem, vMenuDivider, vMenuGroup, vDropdownMenu, vContextMenu,

  // Message 组件
  VMessage, VMessageContainer, VMessageManager,
  vMessage, vMessageContainer,
  vMessageManager, toast,

  // Button 组件
  VButton, vButton,

  // Code 组件
  VCode, vCode,
  CodeBlock, codeBlock,

  // Form 组件
  VInput, vInput,
  VSelect, vSelect, VOption, vOption,
  VTextarea, vTextarea,
  VCheckbox, vCheckbox,
  VCheckboxes, vCheckboxes,
  VSwitch, vSwitch,
  VForm, vForm,
  VTimer, vTimer,
  VTimer2, vTimer2,

  // Descriptions 组件
  VDetail, vDetail,
  VDetailItem, vDetailItem,

  // Field 组件
  VField, vField,

  // Body 组件
  VBody, vBody,
  createBody,
} from './components/index.js';

// 导出主题系统
export {
  // 类
  StateMachine,
  Theme,
  ThemeManager,

  // 全局单例
  themeManager,

  // 辅助函数
  createTheme,
  registerStateHandler,
  initStateMachine,
  initTagExtensions
} from './core/theme.js';

// 导出主题管理模块
export {
  // 主题管理
  initTheme,
  applyTheme,
  switchTheme,
  setThemeMode,     // 设置 mode (auto|light|dark)
  getThemeMode,     // 获取当前 mode
  getEffectiveThemeMode, // 获取生效的 mode
  getCurrentThemeId,
  getRegisteredThemes,
  registerTheme,
  getTheme,
  // 主题变量
  allVariables,
  baseVariables,
  cardVariables,
  buttonVariables,
  menuVariables,
  messageVariables,
  codeVariables,
  fieldVariables,
  descriptionsVariables,
  applyVariables,
  applyGlobalVariables,
  createDarkTheme as createDarkThemeVars,
} from './theme/index.js';

// 导出 Islands 主题系列
export {
  createLightTheme,
  createDarkTheme,
  size as islandsSize,
} from './theme/islands/index.js';

// 导出 i18n 模块
export {
  // 核心函数
  t,
  translate,
  setLanguage,
  getLanguage,
  registerLanguage,
  initI18n,
  createText,

  // 语言管理
  getSupportedLanguages,
  hasLanguage,
  loadLanguageFromStorage,
  saveLanguageToStorage,
} from './i18n.js';
