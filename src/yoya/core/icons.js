/**
 * Yoya.Icons - SVG 图标库
 * 提供常用图标的函数式创建方法
 * 使用 PascalCase 命名，直接返回 SVG 元素
 *
 * 所有图标都基于 svg.js 的 SvgTag 基类构建，遵循项目组件开发规范
 */

import { svg, path } from './svg.js';

/**
 * 创建基础图标配置
 * 返回默认的 SVG 属性配置对象
 */
function defaultIconProps(props = {}) {
  return {
    width: props.width || '24',
    height: props.height || '24',
    viewBox: props.viewBox || '0 0 24 24',
    fill: 'none',
    stroke: props.stroke || 'currentColor',
    strokeWidth: props['stroke-width'] || '2',
    strokeLinecap: props['stroke-linecap'] || 'round',
    strokeLinejoin: props['stroke-linejoin'] || 'round',
    ...props,
  };
}

/**
 * 创建图标
 * 使用 svg 工厂函数创建 SVG 容器，内部包含 path 路径
 * @param {string} d - 路径数据
 * @param {Object} props - 属性配置
 * @returns {SvgTag} SVG 元素（svg 容器）
 */
function createIcon(d, props = {}) {
  const attrs = defaultIconProps(props);

  // 创建 SVG 容器
  return svg(setup => {
    setup.attr('width', attrs.width);
    setup.attr('height', attrs.height);
    setup.attr('viewBox', attrs.viewBox);
    setup.style('display', 'inline-block');
    setup.style('vertical-align', 'middle');

    // 创建 path 路径作为子元素
    setup.path(pathSetup => {
      pathSetup.d(attrs.d || d);
      pathSetup.attr('fill', attrs.fill);
      pathSetup.attr('stroke', attrs.stroke);
      pathSetup.attr('stroke-width', attrs.strokeWidth);
      pathSetup.attr('stroke-linecap', attrs.strokeLinecap);
      pathSetup.attr('stroke-linejoin', attrs.strokeLinejoin);

      // 应用额外的属性到 path
      for (const [key, value] of Object.entries(props)) {
        if (!['d', 'width', 'height', 'viewBox'].includes(key)) {
          pathSetup.attr(key, value);
        }
      }
    });
  });
}

// ============= 导航类图标 =============

export function HomeIcon(props = {}) {
  return createIcon('M 3 9 l 9 -7 l 9 7 v 11 a 2 2 0 0 1 -2 2 h -14 a 2 2 0 0 1 -2 -2 z', props);
}

export function DashboardIcon(props = {}) {
  const icon = createIcon('', props);
  // 添加 4 个矩形路径
  const paths = [
    'M 3 3 h 8 v 8 h -8 z',
    'M 13 3 h 8 v 8 h -8 z',
    'M 3 13 h 8 v 8 h -8 z',
    'M 13 13 h 8 v 8 h -8 z',
  ];
  // 需要在 svg.js 中支持多路径，这里简化为单路径图标
  return createIcon('M 3 3 h 8 v 8 h -8 Z M 13 3 h 8 v 8 h -8 Z M 3 13 h 8 v 8 h -8 Z M 13 13 h 8 v 8 h -8 Z', props);
}

export function MenuIcon(props = {}) {
  return createIcon('M 3 6 h 18 M 3 12 h 18 M 3 18 h 18', props);
}

export function ChevronDownIcon(props = {}) {
  return createIcon('M 6 9 l 6 6 l 6 -6', props);
}

export function ChevronUpIcon(props = {}) {
  return createIcon('M 18 15 l -6 -6 l -6 6', props);
}

export function ChevronLeftIcon(props = {}) {
  return createIcon('M 15 6 l -6 6 l 6 6', props);
}

export function ChevronRightIcon(props = {}) {
  return createIcon('M 9 6 l 6 6 l -6 6', props);
}

export function ArrowLeftIcon(props = {}) {
  return createIcon('M 19 12 h -16 M 9 6 l -6 6 l 6 6', props);
}

export function ArrowRightIcon(props = {}) {
  return createIcon('M 5 12 h 16 M 15 6 l 6 6 l -6 6', props);
}

export function CloseIcon(props = {}) {
  return createIcon('M 18 6 L 6 18 M 6 6 l 12 12', props);
}

export function PlusIcon(props = {}) {
  return createIcon('M 12 5 v 14 M 5 12 h 14', props);
}

export function MinusIcon(props = {}) {
  return createIcon('M 5 12 h 14', props);
}

// ============= 用户类图标 =============

export function UserIcon(props = {}) {
  return createIcon('M 20 21 v -2 a 4 4 0 0 0 -4 -4 h -8 a 4 4 0 0 0 -4 4 v 2 M 12 3 a 4 4 0 1 0 0 8 a 4 4 0 1 0 0 -8', props);
}

export function UsersIcon(props = {}) {
  return createIcon('M 17 21 v -2 a 4 4 0 0 0 -4 -4 h -1 M 16 3.13 a 4 4 0 0 1 0 7.75 M 23 21 v -2 a 4 4 0 0 0 -3 -3.87 M 20 9.88 a 4 4 0 0 1 0 7.75 M 7 21 v -2 a 4 4 0 0 1 -4 -4 v 0 a 4 4 0 0 1 1.47 -3.06 M 12 7 a 4 4 0 1 0 0 8 a 4 4 0 1 0 0 -8', props);
}

export function SettingsIcon(props = {}) {
  return createIcon('M 12 15 a 3 3 0 1 0 0 -6 a 3 3 0 1 0 0 6 z M 19.4 15 a 1.65 1.65 0 0 0 .33 1.82 l .06 .06 a 2 2 0 1 1 -2.83 2.83 l -.06 -.06 a 1.65 1.65 0 0 0 -1.82 -.33 a 1.65 1.65 0 0 0 -1 1.51 v .17 a 2 2 0 1 1 -4 0 v -.17 a 1.65 1.65 0 0 0 -1 -1.51 a 1.65 1.65 0 0 0 -1.82 .33 l -.06 .06 a 2 2 0 1 1 -2.83 -2.83 l .06 -.06 a 1.65 1.65 0 0 0 .33 -1.82 a 1.65 1.65 0 0 0 -1.51 -1 h -.17 a 2 2 0 1 1 0 -4 h .17 a 1.65 1.65 0 0 0 1.51 -1 a 1.65 1.65 0 0 0 -.33 -1.82 l -.06 -.06 a 2 2 0 1 1 2.83 -2.83 l .06 .06 a 1.65 1.65 0 0 0 1.82 -.33 h .17 a 1.65 1.65 0 0 0 1 -1.51 v -.17 a 2 2 0 1 1 4 0 v .17 a 1.65 1.65 0 0 0 1 1.51 a 1.65 1.65 0 0 0 1.82 -.33 l .06 -.06 a 2 2 0 1 1 2.83 2.83 l -.06 .06 a 1.65 1.65 0 0 0 -.33 1.82 v .17 a 1.65 1.65 0 0 0 1.51 1 h .17 a 2 2 0 1 1 0 4 h -.17 a 1.65 1.65 0 0 0 -1.51 1', props);
}

export function ProfileIcon(props = {}) {
  return createIcon('M 20 21 v -2 a 4 4 0 0 0 -4 -4 h -8 a 4 4 0 0 0 -4 4 v 2 M 12 3 a 4 4 0 1 0 0 8 a 4 4 0 1 0 0 -8 M 3 7 h 18', props);
}

export function LoginIcon(props = {}) {
  return createIcon('M 15 3 h 4 a 2 2 0 0 1 2 2 v 14 a 2 2 0 0 1 -2 2 h -4 M 10 17 l 5 -5 l -5 -5 M 15 12 h -9', props);
}

export function LogoutIcon(props = {}) {
  return createIcon('M 9 21 h -4 a 2 2 0 0 1 -2 -2 v -14 a 2 2 0 0 1 2 -2 h 4 M 16 17 l 5 -5 l -5 -5 M 21 12 h -9', props);
}

// ============= 操作类图标 =============

export function SearchIcon(props = {}) {
  return createIcon('M 11 19 a 8 8 0 1 0 0 -16 a 8 8 0 1 0 0 16 M 21 21 l -4.35 -4.35', props);
}

export function EditIcon(props = {}) {
  return createIcon('M 11 4 h 4 a 2 2 0 0 1 2 2 v 14 a 2 2 0 0 1 -2 2 h -4 M 11 4 l -6 6 v 8 h 12 v -8 l -6 -6 M 11 4 v 6', props);
}

export function DeleteIcon(props = {}) {
  return createIcon('M 3 6 h 18 M 19 6 v 14 a 2 2 0 0 1 -2 2 h -10 a 2 2 0 0 1 -2 -2 v -14 M 8 6 v -4 h 8 v 4', props);
}

export function SaveIcon(props = {}) {
  return createIcon('M 19 21 h -14 a 2 2 0 0 1 -2 -2 v -14 a 2 2 0 0 1 2 -2 h 11.586 a 2 2 0 0 1 1.414 .586 l 4.414 4.414 a 2 2 0 0 1 .586 1.414 v 11.586 a 2 2 0 0 1 -2 2 M 17 21 v -8 h -10 v 8 M 7 3 v 5 h 8 v -5', props);
}

export function UploadIcon(props = {}) {
  return createIcon('M 21 15 v 4 a 2 2 0 0 1 -2 2 h -14 a 2 2 0 0 1 -2 -2 v -4 M 17 8 l -5 -5 l -5 5 M 12 3 v 12', props);
}

export function DownloadIcon(props = {}) {
  return createIcon('M 21 15 v 4 a 2 2 0 0 1 -2 2 h -14 a 2 2 0 0 1 -2 -2 v -4 M 7 10 l 5 5 l 5 -5 M 12 15 v -12', props);
}

export function CopyIcon(props = {}) {
  return createIcon('M 8 4 h 10 a 2 2 0 0 1 2 2 v 14 a 2 2 0 0 1 -2 2 h -10 a 2 2 0 0 1 -2 -2 v -14 a 2 2 0 0 1 2 -2 M 8 4 v 10 a 2 2 0 0 1 -2 2 h -4 a 2 2 0 0 1 -2 -2 v -14 a 2 2 0 0 1 2 -2 h 4', props);
}

export function CheckIcon(props = {}) {
  return createIcon('M 20 6 l -11 11 l -6 -6', props);
}

export function XIcon(props = {}) {
  return createIcon('M 18 6 l -12 12 M 6 6 l 12 12', props);
}

// ============= 文件类图标 =============

export function FileIcon(props = {}) {
  return createIcon('M 14 2 h -8 a 2 2 0 0 0 -2 2 v 16 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 v -10 l -6 -6 z M 14 2 v 6 h 6', props);
}

export function FolderIcon(props = {}) {
  return createIcon('M 22 19 a 2 2 0 0 1 -2 2 h -16 a 2 2 0 0 1 -2 -2 v -14 a 2 2 0 0 1 2 -2 h 8 l 2 2 h 8 a 2 2 0 0 1 2 2 v 2 z', props);
}

export function FileTextIcon(props = {}) {
  return createIcon('M 14 2 h -8 a 2 2 0 0 0 -2 2 v 16 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 v -10 l -6 -6 z M 14 2 v 6 h 6 M 10 13 v 6 M 14 13 v 6 M 18 13 v 6', props);
}

export function ImageIcon(props = {}) {
  return createIcon('M 21 19 v -14 a 2 2 0 0 0 -2 -2 h -14 a 2 2 0 0 0 -2 2 v 14 a 2 2 0 0 0 2 2 h 14 a 2 2 0 0 0 2 -2 z M 8.5 13.5 l 2.5 3 l 3.5 -4.5 l 4.5 6 h -13 z M 8.5 10.5 a 2.5 2.5 0 1 0 0 -5 a 2.5 2.5 0 1 0 0 5', props);
}

export function VideoIcon(props = {}) {
  return createIcon('M 23 7 l -7 5 l 7 5 v -10 z M 3 5 h 13 a 2 2 0 0 1 2 2 v 10 a 2 2 0 0 1 -2 2 h -13 a 2 2 0 0 1 -2 -2 v -10 a 2 2 0 0 1 2 -2', props);
}

// ============= 通知类图标 =============

export function BellIcon(props = {}) {
  return createIcon('M 18 8 a 6 6 0 1 0 -12 0 c 0 7 -3 9 -3 9 h 18 s -3 -2 -3 -9 M 13.73 21 a 2 2 0 0 1 -3.46 0', props);
}

export function AlertCircleIcon(props = {}) {
  return createIcon('M 12 22 a 10 10 0 1 0 0 -20 a 10 10 0 1 0 0 20 M 12 8 v 8 M 12 16 h .01', props);
}

export function AlertTriangleIcon(props = {}) {
  return createIcon('M 10.29 3.86 l -8.48 14.71 a 2 2 0 0 0 1.71 3 h 16.96 a 2 2 0 0 0 1.71 -3 l -8.48 -14.71 a 2 2 0 0 0 -3.46 0 M 12 9 v 4 M 12 17 h .01', props);
}

export function InfoIcon(props = {}) {
  return createIcon('M 12 22 a 10 10 0 1 0 0 -20 a 10 10 0 1 0 0 20 M 12 16 v -4 M 12 8 h .01', props);
}

export function CheckCircleIcon(props = {}) {
  return createIcon('M 22 11.08 v 1 a 10 10 0 1 1 -5.93 -9.14 M 22 4 l -10 10 l -5 -5', props);
}

export function XCircleIcon(props = {}) {
  return createIcon('M 22 11.08 v 1 a 10 10 0 1 1 -5.93 -9.14 M 22 4 l -10 10 l -5 -5 M 18 6 l -12 12 M 6 6 l 12 12', props);
}

// ============= 通讯类图标 =============

export function MailIcon(props = {}) {
  return createIcon('M 4 4 h 16 a 2 2 0 0 1 2 2 v 12 a 2 2 0 0 1 -2 2 h -16 a 2 2 0 0 1 -2 -2 v -12 a 2 2 0 0 1 2 -2 z M 22 6 l -10 7 l -10 -7', props);
}

export function PhoneIcon(props = {}) {
  return createIcon('M 22 16.92 v 3 a 2 2 0 0 1 -2.18 2 a 19.79 19.79 0 0 1 -8.63 -3.07 a 19.5 19.5 0 0 1 -6 -6 a 19.79 19.79 0 0 1 -3.07 -8.67 a 2 2 0 0 1 2 -2.17 l 3 -0.01 a 2 2 0 0 1 2 1.72 c 0.12 0.9 0.34 1.77 0.65 2.6 a 2 2 0 0 1 -0.45 2.11 l -1.27 1.27 a 16 16 0 0 0 6 6 l 1.27 -1.27 a 2 2 0 0 1 2.11 -0.45 c 0.83 0.31 1.7 0.53 2.6 0.65 a 2 2 0 0 1 1.72 1.97', props);
}

export function MessageSquareIcon(props = {}) {
  return createIcon('M 21 15 a 2 2 0 0 1 -2 2 h -7 l -7 7 v -7 a 2 2 0 0 1 -2 -2 v -10 a 2 2 0 0 1 2 -2 h 14 a 2 2 0 0 1 2 2 v 10', props);
}

export function MessageCircleIcon(props = {}) {
  return createIcon('M 21 11.5 a 8.38 8.38 0 0 1 -.9 3.8 a 8.5 8.5 0 0 1 -7.6 4.7 a 8.38 8.38 0 0 1 -3.8 -.9 l -3.7 2.2 v -3.7 a 8.5 8.5 0 0 1 -4.7 -7.6 a 8.38 8.38 0 0 1 .9 -3.8 a 8.5 8.5 0 0 1 7.6 -4.7 a 8.38 8.38 0 0 1 3.8 .9 a 8.5 8.5 0 0 1 4.7 7.6', props);
}

// ============= 状态类图标 =============

export function HeartIcon(props = {}) {
  return createIcon('M 20.84 4.61 a 5.5 5.5 0 0 0 -7.78 0 l -1.06 1.06 l -1.06 -1.06 a 5.5 5.5 0 0 0 -7.78 7.78 l 8.84 8.84 a 1 1 0 0 0 1.42 0 l 8.84 -8.84 a 5.5 5.5 0 0 0 0 -7.78', props);
}

export function StarIcon(props = {}) {
  return createIcon('M 12 2 l 3.09 6.26 l 6.91 1 l -5 4.87 l 1.18 6.88 l -6.18 -3.26 l -6.18 3.26 l 1.18 -6.88 l -5 -4.87 l 6.91 -1 z', props);
}

export function ThumbsUpIcon(props = {}) {
  return createIcon('M 14 9 v 11 a 2 2 0 0 1 -2 2 h 0 a 2 2 0 0 1 -2 -2 v -11 a 2 2 0 0 1 2 -2 h 0 a 2 2 0 0 1 2 2 M 7 9 h 14 a 2 2 0 0 1 2 2 v 7 a 2 2 0 0 1 -2 2 h -7 a 2 2 0 0 1 -2 -2 v -7 a 2 2 0 0 1 2 -2 M 7 20 h 7 M 7 9 l -2 -7', props);
}

export function ThumbsDownIcon(props = {}) {
  return createIcon('M 10 15 v -11 a 2 2 0 0 1 2 -2 h 0 a 2 2 0 0 1 2 2 v 11 a 2 2 0 0 1 -2 2 h 0 a 2 2 0 0 1 -2 -2 M 17 15 h -14 a 2 2 0 0 1 -2 -2 v -7 a 2 2 0 0 1 2 -2 h 7 a 2 2 0 0 1 2 2 v 7 a 2 2 0 0 1 -2 2 M 17 4 h -7 M 17 15 l 2 7', props);
}

// ============= 时间类图标 =============

export function ClockIcon(props = {}) {
  return createIcon('M 12 22 a 10 10 0 1 0 0 -20 a 10 10 0 1 0 0 20 M 12 6 v 6 l 4 2', props);
}

export function CalendarIcon(props = {}) {
  return createIcon('M 19 4 h -1 v -2 a 2 2 0 0 0 -2 -2 h -8 a 2 2 0 0 0 -2 2 v 2 h -1 a 2 2 0 0 0 -2 2 v 14 a 2 2 0 0 0 2 2 h 14 a 2 2 0 0 0 2 -2 v -14 a 2 2 0 0 0 -2 -2 M 19 10 h -14 v 8 h 14 v -8 M 9 4 v 6 M 15 4 v 6', props);
}

export function CalendarEventIcon(props = {}) {
  return createIcon('M 19 4 h -1 v -2 a 2 2 0 0 0 -2 -2 h -8 a 2 2 0 0 0 -2 2 v 2 h -1 a 2 2 0 0 0 -2 2 v 14 a 2 2 0 0 0 2 2 h 14 a 2 2 0 0 0 2 -2 v -14 a 2 2 0 0 0 -2 -2 M 19 10 h -14 v 8 h 14 v -8 M 9 4 v 6 M 15 4 v 6 M 12 14 l 2 2 l 4 -4', props);
}

// ============= 链接类图标 =============

export function LinkIcon(props = {}) {
  return createIcon('M 10 13 a 5 5 0 0 0 7.54 .54 l 3 -3 a 5 5 0 0 0 -7.07 -7.07 l -1.72 1.71 M 14 11 a 5 5 0 0 0 -7.54 -.54 l -3 3 a 5 5 0 0 0 7.07 7.07 l 1.71 -1.71', props);
}

export function ExternalLinkIcon(props = {}) {
  return createIcon('M 18 13 v 6 a 2 2 0 0 1 -2 2 h -10 a 2 2 0 0 1 -2 -2 v -10 a 2 2 0 0 1 2 -2 h 6 M 15 3 h 6 v 6 M 10 14 l 11 -11', props);
}

export function ShareIcon(props = {}) {
  return createIcon('M 4 12 v 6 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 v -6 a 2 2 0 0 0 -2 -2 h -4 M 16 6 l -4 -4 l -4 4 M 12 2 v 13', props);
}

// ============= 设备类图标 =============

export function MonitorIcon(props = {}) {
  return createIcon('M 3 3 h 18 v 14 h -18 z M 8 21 h 8 M 12 17 v 4', props);
}

export function SmartphoneIcon(props = {}) {
  return createIcon('M 6 2 h 12 a 2 2 0 0 1 2 2 v 16 a 2 2 0 0 1 -2 2 h -12 a 2 2 0 0 1 -2 -2 v -16 a 2 2 0 0 1 2 -2 M 12 18 h .01', props);
}

export function TabletIcon(props = {}) {
  return createIcon('M 4 2 h 16 a 2 2 0 0 1 2 2 v 16 a 2 2 0 0 1 -2 2 h -16 a 2 2 0 0 1 -2 -2 v -16 a 2 2 0 0 1 2 -2 M 12 18 h .01', props);
}

// ============= 其他图标 =============

export function EyeIcon(props = {}) {
  return createIcon('M 1 12 s 4 -8 11 -8 s 11 8 11 8 s -4 8 -11 8 s -11 -8 -11 -8 M 12 5 a 7 7 0 1 0 0 14 a 7 7 0 1 0 0 -14 M 12 9 a 3 3 0 1 0 0 6 a 3 3 0 1 0 0 -6', props);
}

export function EyeOffIcon(props = {}) {
  return createIcon('M 17.94 17.94 a 10.07 10.07 0 0 1 -13.88 0 M 1 1 l 22 22 M 10.58 10.58 a 3 3 0 0 0 3.84 3.84 M 9.9 4.24 a 10.07 10.07 0 0 1 10.04 2.82 M 5.64 5.64 a 10.07 10.07 0 0 0 -3.58 2.42 M 1 12 s 4 -8 11 -8 c 1.3 0 2.54 .22 3.71 .61', props);
}

export function LockIcon(props = {}) {
  return createIcon('M 19 11 h -1 v -4 a 5 5 0 0 0 -10 0 v 4 h -1 a 2 2 0 0 0 -2 2 v 8 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 v -8 a 2 2 0 0 0 -2 -2 M 12 3 a 3 3 0 0 1 3 3 v 4 h -6 v -4 a 3 3 0 0 1 3 -3', props);
}

export function UnlockIcon(props = {}) {
  return createIcon('M 19 11 h -1 v -4 a 5 5 0 0 1 8.71 -3.29 M 7 11 v -4 a 5 5 0 0 1 9.9 -1 M 19 11 h -1 v 4 h -10 v -4 h -1 a 2 2 0 0 0 -2 2 v 8 a 2 2 0 0 0 2 2 h 12 a 2 2 0 0 0 2 -2 v -8 a 2 2 0 0 0 -2 -2', props);
}

export function KeyIcon(props = {}) {
  return createIcon('M 21 2 l -2 2 m 0 4 l -2 2 m 0 4 a 2 2 0 1 1 -2.83 -2.83 l 7.83 -7.83 a 2 2 0 0 1 2.83 2.83 z M 12 12 l -3 3 M 9 15 l -2 2 M 15 9 l -3 3', props);
}

export function FilterIcon(props = {}) {
  return createIcon('M 22 3 h -16 a 2 2 0 0 0 -2 2 v 2 l 8 7 v 6 l 4 2 v -8 l 8 -7 v -2 a 2 2 0 0 0 -2 -2', props);
}

export function LayersIcon(props = {}) {
  return createIcon('M 12 2 l -10 5 l 10 5 l 10 -5 z M 2 17 l 10 5 l 10 -5 M 2 12 l 10 5 l 10 -5', props);
}

export function PackageIcon(props = {}) {
  return createIcon('M 16.5 9.4 l -9 -5.19 M 21 16 v -4.5 a 2 2 0 0 0 -1 -1.73 l -7 -4 a 2 2 0 0 0 -2 0 l -7 4 a 2 2 0 0 0 -1 1.73 v 4.5 a 2 2 0 0 0 1 1.73 l 7 4 a 2 2 0 0 0 2 0 l 7 -4 a 2 2 0 0 0 1 -1.73 M 3.27 6.96 l 8.73 5.04 l 8.73 -5.04 M 12 22 v -10', props);
}

export function ShoppingCartIcon(props = {}) {
  return createIcon('M 6 6 h 15 l -1.5 9 h -12 z M 6 6 l -1 -4 h -2 M 9 21 a 1 1 0 1 0 0 -2 a 1 1 0 1 0 0 2 M 20 21 a 1 1 0 1 0 0 -2 a 1 1 0 1 0 0 2', props);
}

export function CreditCardIcon(props = {}) {
  return createIcon('M 3 4 h 18 a 2 2 0 0 1 2 2 v 12 a 2 2 0 0 1 -2 2 h -18 a 2 2 0 0 1 -2 -2 v -12 a 2 2 0 0 1 2 -2 M 3 10 h 18', props);
}

export function DollarSignIcon(props = {}) {
  return createIcon('M 12 2 v 20 M 17 5 h -5 a 3 3 0 0 0 0 6 h 5 a 3 3 0 0 1 0 6 h -5', props);
}

export function TrendingUpIcon(props = {}) {
  return createIcon('M 23 6 l -9.5 9.5 l -5 -5 l -10 10', props);
}

export function TrendingDownIcon(props = {}) {
  return createIcon('M 23 18 l -9.5 -9.5 l -5 5 l -10 -10', props);
}

export function ActivityIcon(props = {}) {
  return createIcon('M 22 12 l -4 0 l -3 -9 l -6 18 l -3 -9 l -4 0', props);
}

export function ZapIcon(props = {}) {
  return createIcon('M 13 2 l -10 13 h 9 l -1 11 l 10 -13 h -9 z', props);
}

export function HelpCircleIcon(props = {}) {
  return createIcon('M 12 22 a 10 10 0 1 0 0 -20 a 10 10 0 1 0 0 20 M 9.09 9 a 3 3 0 0 1 5.83 1 c 0 2 -3 3 -3 3 M 12 17 h .01', props);
}

export function MaximizeIcon(props = {}) {
  return createIcon('M 8 3 h 13 v 13 M 3 8 h 13 v 13 M 3 21 l 8 -8 M 21 3 l -8 8', props);
}

export function MinimizeIcon(props = {}) {
  return createIcon('M 8 3 h 13 v 13 M 3 8 h 13 v 13 M 21 21 l -8 -8 M 3 3 l 8 8', props);
}

export function RefreshCwIcon(props = {}) {
  return createIcon('M 1 4 v 6 h 6 M 23 20 v -6 h -6 M 20.49 15 a 9 9 0 1 1 -2.12 -9.36 l 2.63 -2.64 M 3.51 9 a 9 9 0 1 1 2.12 9.36 l -2.63 2.64', props);
}

export function MoreHorizontalIcon(props = {}) {
  return createIcon('M 12 12 h .01 M 19 12 h .01 M 5 12 h .01', props);
}

export function MoreVerticalIcon(props = {}) {
  return createIcon('M 12 12 h .01 M 12 19 h .01 M 12 5 h .01', props);
}

export function GridIcon(props = {}) {
  return createIcon('M 3 3 h 8 v 8 h -8 z M 13 3 h 8 v 8 h -8 z M 3 13 h 8 v 8 h -8 z M 13 13 h 8 v 8 h -8 z', props);
}

export function ListIcon(props = {}) {
  return createIcon('M 8 6 h 13 M 8 12 h 13 M 8 18 h 13 M 3 6 h .01 M 3 12 h .01 M 3 18 h .01', props);
}
