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
  button, input, textarea, select, option, vOption, label, form,
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
  // Box 组件
  VBox, vBox,

  // Card 组件
  VCard, VCardHeader, VCardBody, VCardFooter,
  vCard, vCardHeader, vCardBody, vCardFooter,

  // Menu 组件
  VMenu, VMenuItem, VMenuDivider, VMenuGroup, VSubMenu, VDropdownMenu, VContextMenu, VSidebar, VTopNavbar,
  vMenu, vMenuItem, vMenuDivider, vMenuGroup, vSubMenu, vDropdownMenu, vContextMenu, vSidebar, vTopNavbar,

  // Message 组件
  VMessage, VMessageContainer, VMessageManager,
  vMessage, vMessageContainer,
  vMessageManager, toast,

  // Button 组件
  VButton, vButton,
  VButtons, vButtons,

  // Code 组件
  VCode, vCode,
  CodeBlock, codeBlock,

  // Form 组件
  VInput, vInput,
  VSelect, vSelect,
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

  // Switchers 组件
  VSwitchers, vSwitchers,

  // Body 组件
  VBody, vBody,
  createBody,

  // Table 组件
  VTable, vTable,
  VThead, vThead,
  VTbody, vTbody,
  VTfoot, vTfoot,
  VTr, vTr,
  VTh, vTh,
  VTd, vTd,

  // Echart 组件
  VEchart, vEchart,

  // Router 组件
  VRouter, vRouter,
  VRoute, vRoute,
  VLink, vLink,
  VRouterView, vRouterView,

  // Tabs 组件
  VTabs, vTabs,

  // Pager 组件
  VPager, vPager,

  // Modal 组件
  VModal, vModal,
  VConfirm, vConfirm,
  confirm,

  // Grid 24 栅格系统组件
  VRow, vRow,
  VCol, vCol,

  // UI 基础组件
  VAvatar, VAvatarGroup, vAvatar, vAvatarGroup,
  VBadge, vBadge,
  VProgress, vProgress,
  VSkeleton, vSkeleton,
  VTag, vTag,
  VAlert, vAlert,
  VBreadcrumb, vBreadcrumb,
  VStatistic, vStatistic,

  // Interaction 交互组件
  VTooltip, vTooltip,
  VPopover, vPopover,
  VDropdown, vDropdown,
  VCollapse, vCollapse,
  VTree, vTree,
  VTreeSelect, vTreeSelect,
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

// 导出主题管理模块（CSS-based）
export {
  // 核心函数
  initTheme,
  switchTheme,
  setThemeMode,     // 设置 mode (auto|dark|light)
  getThemeMode,     // 获取当前 mode
  getEffectiveThemeMode, // 获取生效的 mode
  getCurrentThemeId,
  registerThemeConfig,

  // CSS 文件路径工具（用于自定义主题）
  getThemeBasePath,
  getThemeCssPath,
  getComponentCssPath,
  loadCssFile,
  loadComponentCssFiles,

  // CSS 文件列表
  COMPONENT_CSS_FILES,
} from './theme/index.js';

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

// 导出 helper 工具模块
export {
  // 状态常量
  LoadStatus,

  // 动态加载组件
  VDynamicLoader,
  vDynamicLoader,

  // 批量加载工具
  loadModules,
  preloadModules,
  clearModuleCache,
  getModuleCacheStatus,
} from './core/helper.js';

// 导出图标库（icons.js）
export {
  // 导航类图标
  HomeIcon,
  DashboardIcon,
  MenuIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CloseIcon,
  PlusIcon,
  MinusIcon,

  // 用户类图标
  UserIcon,
  UsersIcon,
  SettingsIcon,
  ProfileIcon,
  LoginIcon,
  LogoutIcon,

  // 操作类图标
  SearchIcon,
  EditIcon,
  DeleteIcon,
  SaveIcon,
  UploadIcon,
  DownloadIcon,
  CopyIcon,
  CheckIcon,
  XIcon,

  // 文件类图标
  FileIcon,
  FolderIcon,
  FileTextIcon,
  ImageIcon,
  VideoIcon,

  // 通知类图标
  BellIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  InfoIcon,
  CheckCircleIcon,
  XCircleIcon,

  // 通讯类图标
  MailIcon,
  PhoneIcon,
  MessageSquareIcon,
  MessageCircleIcon,

  // 状态类图标
  HeartIcon,
  StarIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,

  // 时间类图标
  ClockIcon,
  CalendarIcon,
  CalendarEventIcon,

  // 链接类图标
  LinkIcon,
  ExternalLinkIcon,
  ShareIcon,

  // 设备类图标
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,

  // 其他图标
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  UnlockIcon,
  KeyIcon,
  FilterIcon,
  LayersIcon,
  PackageIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  DollarSignIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ActivityIcon,
  ZapIcon,
  HelpCircleIcon,
  MaximizeIcon,
  MinimizeIcon,
  RefreshCwIcon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  GridIcon,
  ListIcon,
} from './core/icons.js';
