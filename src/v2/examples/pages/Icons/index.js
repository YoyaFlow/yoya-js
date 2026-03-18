/**
 * Yoya.Basic V2 - Icons Demo Page
 * 图标库演示页面
 */

import {
  div, span, h2, h3, p, code, pre, vCard, vCardBody, toast, vCode,
  // 导航类图标
  HomeIcon, DashboardIcon, MenuIcon, ChevronDownIcon, ChevronUpIcon, ChevronLeftIcon, ChevronRightIcon,
  ArrowLeftIcon, ArrowRightIcon, CloseIcon, PlusIcon, MinusIcon,
  // 用户类图标
  UserIcon, UsersIcon, SettingsIcon, ProfileIcon, LoginIcon, LogoutIcon,
  // 操作类图标
  SearchIcon, EditIcon, DeleteIcon, SaveIcon, UploadIcon, DownloadIcon, CopyIcon, CheckIcon, XIcon,
  // 文件类图标
  FileIcon, FolderIcon, FileTextIcon, ImageIcon, VideoIcon,
  // 通知类图标
  BellIcon, AlertCircleIcon, AlertTriangleIcon, InfoIcon, CheckCircleIcon, XCircleIcon,
  // 通讯类图标
  MailIcon, PhoneIcon, MessageSquareIcon, MessageCircleIcon,
  // 状态类图标
  HeartIcon, StarIcon, ThumbsUpIcon, ThumbsDownIcon,
  // 时间类图标
  ClockIcon, CalendarIcon, CalendarEventIcon,
  // 链接类图标
  LinkIcon, ExternalLinkIcon, ShareIcon,
  // 设备类图标
  MonitorIcon, SmartphoneIcon, TabletIcon,
  // 其他图标
  EyeIcon, EyeOffIcon, LockIcon, UnlockIcon, KeyIcon, FilterIcon, LayersIcon, PackageIcon,
  ShoppingCartIcon, CreditCardIcon, DollarSignIcon, TrendingUpIcon, TrendingDownIcon,
  ActivityIcon, ZapIcon, HelpCircleIcon, MaximizeIcon, MinimizeIcon, RefreshCwIcon,
  MoreHorizontalIcon, MoreVerticalIcon, GridIcon, ListIcon,
} from '../../../../yoya/index.js';

import { AppShell } from '../../framework/AppShell.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';

/**
 * 创建图标展示网格
 */
function createIconGrid(icons) {
  return div(grid => {
    grid.styles({
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
      gap: '12px',
    });

    for (const { name, icon: iconFn } of icons) {
      div(item => {
        item.styles({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          background: 'var(--yoya-bg, #fff)',
          border: '1px solid var(--yoya-border, #e1e1e1)',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        });

        // 悬停效果
        item.on('mouseenter', () => {
          item.style('background', 'var(--yoya-bg-hover, #f5f5f5)');
          item.style('transform', 'translateY(-2px)');
        });

        item.on('mouseleave', () => {
          item.style('background', 'var(--yoya-bg, #fff)');
          item.style('transform', 'translateY(0)');
        });

        // 点击复制
        item.on('click', () => {
          navigator.clipboard.writeText(name).then(() => {
            toast.success(`已复制 ${name}`);
          });
        });

        // 图标
        const iconEl = iconFn();
        iconEl.attr('width', '32');
        iconEl.attr('height', '32');
        iconEl.style('margin-bottom', '8px');
        iconEl.style('color', 'var(--yoya-text-primary, #333)');
        // 使用 child() 方法添加 Tag 实例作为子元素
        item.child(iconEl);

        // 名称
        item.span(nameEl => {
          nameEl.styles({
            fontSize: '12px',
            color: 'var(--yoya-text-secondary, #666)',
            textAlign: 'center',
          });
          nameEl.text(name.replace('Icon', ''));
        });

      }).bindTo(grid);
    }
  });
}

/**
 * 创建使用示例代码
 */
function createUsageExample(iconNames) {
  const firstIcon = iconNames[0]?.replace('Icon', '') || 'Home';
  return `// 导入图标
import { ${iconNames[0] || 'HomeIcon'} } from '@yoya/basic';

// 基础用法 - 创建图标（默认 24x24）
const icon = ${iconNames[0] || 'HomeIcon'}();

// 设置大小
const largeIcon = ${iconNames[0] || 'HomeIcon'}({ width: '32', height: '32' });

// 设置颜色（使用主题变量）
const themedIcon = ${iconNames[0] || 'HomeIcon'}({ stroke: 'var(--yoya-text-primary)' });

// 在组件中使用
div(box => {
  box.child(${iconNames[0] || 'HomeIcon'}());
  box.text('${firstIcon}');
});`;
}

/**
 * 创建 Icons 演示页面
 */
export function createIconsPage() {
  // 图标分类数据
  const iconCategories = [
    {
      id: 'navigation',
      title: '导航类图标',
      description: '用于导航和方向指示的图标',
      icons: [
        { name: 'HomeIcon', icon: HomeIcon },
        { name: 'DashboardIcon', icon: DashboardIcon },
        { name: 'MenuIcon', icon: MenuIcon },
        { name: 'ChevronDownIcon', icon: ChevronDownIcon },
        { name: 'ChevronUpIcon', icon: ChevronUpIcon },
        { name: 'ChevronLeftIcon', icon: ChevronLeftIcon },
        { name: 'ChevronRightIcon', icon: ChevronRightIcon },
        { name: 'ArrowLeftIcon', icon: ArrowLeftIcon },
        { name: 'ArrowRightIcon', icon: ArrowRightIcon },
        { name: 'CloseIcon', icon: CloseIcon },
        { name: 'PlusIcon', icon: PlusIcon },
        { name: 'MinusIcon', icon: MinusIcon },
      ],
    },
    {
      id: 'user',
      title: '用户类图标',
      description: '与用户和个人资料相关的图标',
      icons: [
        { name: 'UserIcon', icon: UserIcon },
        { name: 'UsersIcon', icon: UsersIcon },
        { name: 'SettingsIcon', icon: SettingsIcon },
        { name: 'ProfileIcon', icon: ProfileIcon },
        { name: 'LoginIcon', icon: LoginIcon },
        { name: 'LogoutIcon', icon: LogoutIcon },
      ],
    },
    {
      id: 'action',
      title: '操作类图标',
      description: '用于操作和行为指示的图标',
      icons: [
        { name: 'SearchIcon', icon: SearchIcon },
        { name: 'EditIcon', icon: EditIcon },
        { name: 'DeleteIcon', icon: DeleteIcon },
        { name: 'SaveIcon', icon: SaveIcon },
        { name: 'UploadIcon', icon: UploadIcon },
        { name: 'DownloadIcon', icon: DownloadIcon },
        { name: 'CopyIcon', icon: CopyIcon },
        { name: 'CheckIcon', icon: CheckIcon },
        { name: 'XIcon', icon: XIcon },
      ],
    },
    {
      id: 'file',
      title: '文件类图标',
      description: '与文件和文档相关的图标',
      icons: [
        { name: 'FileIcon', icon: FileIcon },
        { name: 'FolderIcon', icon: FolderIcon },
        { name: 'FileTextIcon', icon: FileTextIcon },
        { name: 'ImageIcon', icon: ImageIcon },
        { name: 'VideoIcon', icon: VideoIcon },
      ],
    },
    {
      id: 'notification',
      title: '通知类图标',
      description: '用于通知和状态提示的图标',
      icons: [
        { name: 'BellIcon', icon: BellIcon },
        { name: 'AlertCircleIcon', icon: AlertCircleIcon },
        { name: 'AlertTriangleIcon', icon: AlertTriangleIcon },
        { name: 'InfoIcon', icon: InfoIcon },
        { name: 'CheckCircleIcon', icon: CheckCircleIcon },
        { name: 'XCircleIcon', icon: XCircleIcon },
      ],
    },
    {
      id: 'communication',
      title: '通讯类图标',
      description: '与通讯和联络相关的图标',
      icons: [
        { name: 'MailIcon', icon: MailIcon },
        { name: 'PhoneIcon', icon: PhoneIcon },
        { name: 'MessageSquareIcon', icon: MessageSquareIcon },
        { name: 'MessageCircleIcon', icon: MessageCircleIcon },
      ],
    },
    {
      id: 'status',
      title: '状态类图标',
      description: '表示状态和评价的图标',
      icons: [
        { name: 'HeartIcon', icon: HeartIcon },
        { name: 'StarIcon', icon: StarIcon },
        { name: 'ThumbsUpIcon', icon: ThumbsUpIcon },
        { name: 'ThumbsDownIcon', icon: ThumbsDownIcon },
      ],
    },
    {
      id: 'time',
      title: '时间类图标',
      description: '与时间和日期相关的图标',
      icons: [
        { name: 'ClockIcon', icon: ClockIcon },
        { name: 'CalendarIcon', icon: CalendarIcon },
        { name: 'CalendarEventIcon', icon: CalendarEventIcon },
      ],
    },
    {
      id: 'link',
      title: '链接类图标',
      description: '与链接和分享相关的图标',
      icons: [
        { name: 'LinkIcon', icon: LinkIcon },
        { name: 'ExternalLinkIcon', icon: ExternalLinkIcon },
        { name: 'ShareIcon', icon: ShareIcon },
      ],
    },
    {
      id: 'device',
      title: '设备类图标',
      description: '与设备和平台相关的图标',
      icons: [
        { name: 'MonitorIcon', icon: MonitorIcon },
        { name: 'SmartphoneIcon', icon: SmartphoneIcon },
        { name: 'TabletIcon', icon: TabletIcon },
      ],
    },
    {
      id: 'other',
      title: '其他图标',
      description: '其他常用图标',
      icons: [
        { name: 'EyeIcon', icon: EyeIcon },
        { name: 'EyeOffIcon', icon: EyeOffIcon },
        { name: 'LockIcon', icon: LockIcon },
        { name: 'UnlockIcon', icon: UnlockIcon },
        { name: 'KeyIcon', icon: KeyIcon },
        { name: 'FilterIcon', icon: FilterIcon },
        { name: 'LayersIcon', icon: LayersIcon },
        { name: 'PackageIcon', icon: PackageIcon },
        { name: 'ShoppingCartIcon', icon: ShoppingCartIcon },
        { name: 'CreditCardIcon', icon: CreditCardIcon },
        { name: 'DollarSignIcon', icon: DollarSignIcon },
        { name: 'TrendingUpIcon', icon: TrendingUpIcon },
        { name: 'TrendingDownIcon', icon: TrendingDownIcon },
        { name: 'ActivityIcon', icon: ActivityIcon },
        { name: 'ZapIcon', icon: ZapIcon },
        { name: 'HelpCircleIcon', icon: HelpCircleIcon },
        { name: 'MaximizeIcon', icon: MaximizeIcon },
        { name: 'MinimizeIcon', icon: MinimizeIcon },
        { name: 'RefreshCwIcon', icon: RefreshCwIcon },
        { name: 'MoreHorizontalIcon', icon: MoreHorizontalIcon },
        { name: 'MoreVerticalIcon', icon: MoreVerticalIcon },
        { name: 'GridIcon', icon: GridIcon },
        { name: 'ListIcon', icon: ListIcon },
      ],
    },
  ];

  const tocItems = [
    { text: '概述', href: '#overview', level: 1 },
    { text: '导航类', href: '#navigation', level: 1 },
    { text: '用户类', href: '#user', level: 1 },
    { text: '操作类', href: '#action', level: 1 },
    { text: '文件类', href: '#file', level: 1 },
    { text: '通知类', href: '#notification', level: 1 },
    { text: '其他图标', href: '#other', level: 1 },
    { text: '使用方式', href: '#usage', level: 1 },
  ];

  return AppShell({
    currentPage: 'icons.html',
    tocItems,
    content: (content) => {
      // 页面标题
      content.child(PageHeader({
        title: 'Icons 图标库',
        description: `共 ${iconCategories.reduce((sum, cat) => sum + cat.icons.length, 0)} 个 SVG 图标，使用 PascalCase 命名，直接返回 SVG 元素。点击图标可复制使用代码。`,
      }));

      // 概述
      content.child(DocSection('overview', '概述', [
        vCard(card => {
          card.vCardBody(body => {
            body.styles({ padding: '20px' });

            // 使用说明
            body.div(info => {
              info.styles({
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
              });

              info.div(item => {
                item.styles({ textAlign: 'center' });
                item.h3(h => {
                  h.styles({ fontSize: '24px', margin: '0 0 8px 0' });
                  h.text('72+');
                });
                item.p(p => {
                  p.styles({ color: 'var(--yoya-text-secondary)', margin: 0, fontSize: '13px' });
                  p.text('个图标');
                });
              });

              info.div(item => {
                item.styles({ textAlign: 'center' });
                item.h3(h => {
                  h.styles({ fontSize: '24px', margin: '0 0 8px 0' });
                  h.text('SVG');
                });
                item.p(p => {
                  p.styles({ color: 'var(--yoya-text-secondary)', margin: 0, fontSize: '13px' });
                  p.text('矢量格式');
                });
              });

              info.div(item => {
                item.styles({ textAlign: 'center' });
                item.h3(h => {
                  h.styles({ fontSize: '24px', margin: '0 0 8px 0' });
                  h.text('currentColor');
                });
                item.p(p => {
                  p.styles({ color: 'var(--yoya-text-secondary)', margin: 0, fontSize: '13px' });
                  p.text('主题适配');
                });
              });

              info.div(item => {
                item.styles({ textAlign: 'center' });
                item.h3(h => {
                  h.styles({ fontSize: '24px', margin: '0 0 8px 0' });
                  h.text('12px');
                });
                item.p(p => {
                  p.styles({ color: 'var(--yoya-text-secondary)', margin: 0, fontSize: '13px' });
                  p.text('最小字号');
                });
              });
            });
          });
        }),
      ]));

      // 使用方式
      content.child(DocSection('usage', '使用方式', [
        div(usage => {
          usage.styles({ marginBottom: '24px' });

          usage.h3(title => {
            title.styles({ fontSize: '16px', marginBottom: '12px' });
            title.text('导入和使用');
          });

          // 使用 vCode 组件
          usage.child(vCode(c => {
            c.content(`// 从 @yoya/basic 导入图标
import { HomeIcon, UserIcon, SettingsIcon, div } from '@yoya/basic';

// 基础用法 - 创建图标（默认 24x24）
const icon = HomeIcon();

// 设置大小
const largeIcon = HomeIcon({ width: '32', height: '32' });

// 设置颜色（使用主题变量）
const themedIcon = HomeIcon({ stroke: 'var(--yoya-text-primary)' });

// 在组件中使用
div(box => {
  box.child(HomeIcon());
  box.text('首页');
});

// 或者先创建图标元素
const homeIcon = HomeIcon();
div(box => {
  box.child(homeIcon);
  box.text('首页');
});`);
            c.showLineNumbers(true);
            c.showCopyButton(true);
          }));

          usage.h3(title => {
            title.styles({ fontSize: '16px', margin: '24px 0 12px 0' });
            title.text('自定义样式');
          });

          // 使用 vCode 组件
          usage.child(vCode(c => {
            c.content(`// 修改大小
SettingsIcon({ width: '32', height: '32' });

// 修改颜色（使用 CSS）
const icon = HomeIcon();
icon.style('color', '#ff0000');

// 修改描边宽度
SearchIcon({ 'stroke-width': '1.5' });

// 使用主题变量
const icon = BellIcon();
icon.style('color', 'var(--yoya-text-primary)');`);
            c.showLineNumbers(true);
            c.showCopyButton(true);
          }));
        }),
      ]));

      // 按分类展示所有图标
      for (const category of iconCategories) {
        const iconNames = category.icons.map(i => i.name);

        content.child(DocSection(category.id, category.title, [
          p(desc => {
            desc.styles({
              marginBottom: '16px',
              color: 'var(--yoya-text-secondary)',
            });
            desc.text(category.description);
          }),

          createIconGrid(category.icons),

          // 简化代码演示（只有代码块，没有演示区域）
          vCard(codeCard => {
            codeCard.styles({ marginTop: '16px' });
            codeCard.vCardHeader(h => {
              h.text('使用示例');
            });
            codeCard.vCardBody(body => {
              body.child(vCode(c => {
                c.content(createUsageExample(iconNames));
                c.showLineNumbers(true);
                c.showCopyButton(true);
                c.onCopy(() => {
                  toast.success('代码已复制');
                });
              }));
            });
          }),
        ]));
      }
    },
  });
}
