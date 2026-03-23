/**
 * Yoya.Basic V2 - UI Components Demo Page
 * UI 基础组件演示：Avatar, Badge, Progress, Skeleton, Tag, Alert, Breadcrumb
 */

import {
  flex,
  vstack,
  vCard,
  vCardHeader,
  vCardBody,
  vAvatar,
  vAvatarGroup,
  vBadge,
  vProgress,
  vSkeleton,
  vTag,
  vAlert,
  vBreadcrumb,
  toast,
} from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

/**
 * 创建 UI 组件演示页面
 */
export function createUIComponentsPage() {
  const tocItems = [
    { text: 'VAvatar 头像', href: '#avatar', level: 1 },
    { text: 'VBadge 徽标', href: '#badge', level: 1 },
    { text: 'VProgress 进度条', href: '#progress', level: 1 },
    { text: 'VSkeleton 骨架屏', href: '#skeleton', level: 1 },
    { text: 'VTag 标签', href: '#tag', level: 1 },
    { text: 'VAlert 警告提示', href: '#alert', level: 1 },
    { text: 'VBreadcrumb 面包屑', href: '#breadcrumb', level: 1 },
  ];

  return AppShell({
    currentPage: 'ui-components.html',
    tocItems,
    content: (content) => {
      // 页面标题
      content.child(PageHeader({
        title: 'UI Components 基础组件',
        description: '基础 UI 组件库，提供常用的界面元素：头像、徽标、进度条、骨架屏、标签、警告提示、面包屑。',
      }));

      // ========== VAvatar 头像 ==========
      content.child(DocSection('avatar', 'VAvatar 头像', [
        CodeDemo('基础头像',
          flex(row => {
            row.gap('16px');
            row.child(vAvatar(a => {
              a.text('用户');
            }));
            row.child(vAvatar(a => {
              a.text('U');
            }));
            row.child(vAvatar(a => {
              a.text('张三');
            }));
          }),
          `vAvatar(a => {
  a.text('用户')
})

vAvatar('U')
vAvatar('张三')`
        ),

        CodeDemo('头像尺寸',
          flex(row => {
            row.gap('16px');
            row.child(vAvatar(a => {
              a.text('大');
              a.size('large');
            }));
            row.child(vAvatar(a => {
              a.text('中');
            }));
            row.child(vAvatar(a => {
              a.text('小');
              a.size('small');
            }));
          }),
          `vAvatar(a => {
  a.text('大')
  a.size('large')  // 40px
})

vAvatar('中')  // 默认 32px

vAvatar(a => {
  a.text('小')
  a.size('small')  // 24px
})`
        ),

        CodeDemo('自定义尺寸',
          flex(row => {
            row.gap('16px');
            row.child(vAvatar(a => {
              a.text('48');
              a.size(48);
            }));
            row.child(vAvatar(a => {
              a.text('60');
              a.size(60);
            }));
            row.child(vAvatar(a => {
              a.text('20');
              a.size(20);
            }));
          }),
          `// 传入数字（像素值）
vAvatar(a => {
  a.text('48')
  a.size(48)  // 48px
})

vAvatar(a => {
  a.text('60')
  a.size(60)  // 60px
})

vAvatar(a => {
  a.text('20')
  a.size(20)  // 20px
})`
        ),

        CodeDemo('头像形状',
          flex(row => {
            row.gap('16px');
            row.child(vAvatar(a => {
              a.text('圆');
            }));
            row.child(vAvatar(a => {
              a.text('方');
              a.shape('square');
            }));
          }),
          `// 圆形（默认）
vAvatar('圆')

// 方形
vAvatar(a => {
  a.text('方')
  a.shape('square')
})`
        ),

        CodeDemo('头像组',
          vAvatarGroup(g => {
            g.child(vAvatar('A'));
            g.child(vAvatar('B'));
            g.child(vAvatar('C'));
            g.child(vAvatar('D'));
          }),
          `vAvatarGroup(g => {
  g.child(vAvatar('A'))
  g.child(vAvatar('B'))
  g.child(vAvatar('C'))
  g.child(vAvatar('D'))
})`
        ),
      ]));

      // ========== VBadge 徽标 ==========
      content.child(DocSection('badge', 'VBadge 徽标', [
        CodeDemo('独立徽标',
          flex(row => {
            row.gap('16px');
            row.child(vBadge(b => {
              b.count(5);
            }));
            row.child(vBadge(b => {
              b.count(10);
              b.color('#52c41a');
            }));
            row.child(vBadge(b => {
              b.count(99);
              b.color('#fa8c16');
            }));
          }),
          `// 基础徽标
vBadge(b => {
  b.count(5)
})

// 自定义颜色
vBadge(b => {
  b.count(10)
  b.color('#52c41a')
})`
        ),

        CodeDemo('Dot 模式',
          flex(row => {
            row.gap('16px');
            row.child(vBadge(b => {
              b.dot();
            }));
            row.child(vBadge(b => {
              b.dot();
              b.color('#52c41a');
            }));
            row.child(vBadge(b => {
              b.dot();
              b.color('#fa8c16');
            }));
          }),
          `// 红点
vBadge(b => {
  b.dot()
})

// 绿点
vBadge(b => {
  b.dot()
  b.color('#52c41a')
})`
        ),

        CodeDemo('状态徽标',
          flex(row => {
            row.gap('16px');
            row.child(vBadge(b => {
              b.text('默认');
              b.status('default');
            }));
            row.child(vBadge(b => {
              b.text('成功');
              b.status('success');
            }));
            row.child(vBadge(b => {
              b.text('错误');
              b.status('error');
            }));
            row.child(vBadge(b => {
              b.text('警告');
              b.status('warning');
            }));
            row.child(vBadge(b => {
              b.text('处理中');
              b.status('processing');
            }));
          }),
          `vBadge(b => {
  b.text('成功')
  b.status('success')
})

vBadge(b => {
  b.text('错误')
  b.status('error')
})`
        ),
      ]));

      // ========== VProgress 进度条 ==========
      content.child(DocSection('progress', 'VProgress 进度条', [
        CodeDemo('基础进度',
          vstack(col => {
            col.gap('16px');
            col.child(vProgress(p => {
              p.percent(30);
            }));
            col.child(vProgress(p => {
              p.percent(50);
            }));
            col.child(vProgress(p => {
              p.percent(80);
            }));
          }),
          `vProgress(p => {
  p.percent(30)
})

vProgress(p => {
  p.percent(50)
})

vProgress(p => {
  p.percent(80)
})`
        ),

        CodeDemo('进度状态',
          vstack(col => {
            col.gap('16px');
            col.child(vProgress(p => {
              p.percent(50);
              p.status('normal');
            }));
            col.child(vProgress(p => {
              p.percent(70);
              p.status('active');
            }));
            col.child(vProgress(p => {
              p.percent(80);
              p.status('success');
            }));
            col.child(vProgress(p => {
              p.percent(60);
              p.status('exception');
            }));
          }),
          `vProgress(p => {
  p.percent(50)
  p.status('normal')
})

vProgress(p => {
  p.percent(70)
  p.status('active')  // 激活动画
})

vProgress(p => {
  p.percent(80)
  p.status('success')
})

vProgress(p => {
  p.percent(60)
  p.status('exception')
})`
        ),

        CodeDemo('自定义样式',
          vstack(col => {
            col.gap('16px');
            col.child(vProgress(p => {
              p.percent(60);
              p.strokeWidth(20);
              p.strokeColor('#1890ff');
            }));
            col.child(vProgress(p => {
              p.percent(75);
              p.strokeWidth(8);
              p.strokeColor('#52c41a');
            }));
          }),
          `vProgress(p => {
  p.percent(60)
  p.strokeWidth(20)  // 进度条高度
  p.strokeColor('#1890ff')
})`
        ),
      ]));

      // ========== VSkeleton 骨架屏 ==========
      content.child(DocSection('skeleton', 'VSkeleton 骨架屏', [
        CodeDemo('段落骨架',
          vstack(col => {
            col.gap('16px');
            col.child(vSkeleton(s => {
              s.paragraph(3);
              s.active(true);
            }));
          }),
          `// 3 行段落骨架
vSkeleton(s => {
  s.paragraph(3)
  s.active(true)  // 激活动画
})`
        ),

        CodeDemo('头像 + 段落',
          vstack(col => {
            col.gap('16px');
            col.child(vSkeleton(s => {
              s.avatar();
              s.paragraph(3);
              s.active(true);
            }));
          }),
          `vSkeleton(s => {
  s.avatar()
  s.paragraph(3)
  s.active(true)
})`
        ),

        CodeDemo('卡片骨架',
          vstack(col => {
            col.gap('16px');
            col.child(vSkeleton(s => {
              s.avatar();
              s.title();
              s.paragraph(3);
              s.button();
              s.active(true);
            }));
          }),
          `vSkeleton(s => {
  s.avatar()
  s.title()
  s.paragraph(3)
  s.button()
  s.active(true)
})`
        ),
      ]));

      // ========== VTag 标签 ==========
      content.child(DocSection('tag', 'VTag 标签', [
        CodeDemo('基础标签',
          flex(row => {
            row.gap('12px');
            row.child(vTag('默认'));
            row.child(vTag(t => {
              t.text('蓝色');
              t.color('blue');
            }));
            row.child(vTag(t => {
              t.text('绿色');
              t.color('green');
            }));
            row.child(vTag(t => {
              t.text('红色');
              t.color('red');
            }));
            row.child(vTag(t => {
              t.text('橙色');
              t.color('orange');
            }));
            row.child(vTag(t => {
              t.text('紫色');
              t.color('purple');
            }));
          }),
          `vTag('默认')

vTag(t => {
  t.text('蓝色')
  t.color('blue')
})

vTag(t => {
  t.text('红色')
  t.color('red')
})`
        ),

        CodeDemo('标签尺寸',
          flex(row => {
            row.gap('12px');
            row.child(vTag(t => {
              t.text('小');
              t.size('small');
              t.color('blue');
            }));
            row.child(vTag(t => {
              t.text('默认');
              t.color('green');
            }));
            row.child(vTag(t => {
              t.text('大');
              t.size('large');
              t.color('red');
            }));
          }),
          `vTag(t => {
  t.text('小')
  t.size('small')
})

vTag('默认')  // default

vTag(t => {
  t.text('大')
  t.size('large')
})`
        ),

        CodeDemo('可关闭标签',
          flex(row => {
            row.gap('12px');
            row.child(vTag(t => {
              t.text('可关闭 1');
              t.color('blue');
              t.closable(true);
              t.onClose(() => toast('标签 1 关闭'));
            }));
            row.child(vTag(t => {
              t.text('可关闭 2');
              t.color('green');
              t.closable(true);
              t.onClose(() => toast('标签 2 关闭'));
            }));
          }),
          `vTag(t => {
  t.text('可关闭')
  t.color('blue')
  t.closable(true)
  t.onClose(() => {
    toast('标签关闭了')
  })
})`
        ),
      ]));

      // ========== VAlert 警告提示 ==========
      content.child(DocSection('alert', 'VAlert 警告提示', [
        CodeDemo('基础用法',
          vstack(col => {
            col.gap('16px');
            col.child(vAlert(a => {
              a.message('这是一条普通提示');
              a.type('info');
            }));
            col.child(vAlert(a => {
              a.message('操作成功完成');
              a.type('success');
            }));
            col.child(vAlert(a => {
              a.message('请注意此操作的影响');
              a.type('warning');
            }));
            col.child(vAlert(a => {
              a.message('操作失败，请重试');
              a.type('error');
            }));
          }),
          `vAlert(a => {
  a.message('这是一条普通提示')
  a.type('info')
})

vAlert(a => {
  a.message('操作成功')
  a.type('success')
})`
        ),

        CodeDemo('带描述的警告',
          vstack(col => {
            col.gap('16px');
            col.child(vAlert(a => {
              a.message('提交成功');
              a.description('您的表单已成功提交，我们将在 24 小时内处理。');
              a.type('success');
            }));
            col.child(vAlert(a => {
              a.message('网络异常');
              a.description('请检查您的网络连接后重试。');
              a.type('error');
            }));
          }),
          `vAlert(a => {
  a.message('提交成功')
  a.description('详细描述信息...')
  a.type('success')
})`
        ),

        CodeDemo('可关闭的警告',
          vstack(col => {
            col.gap('16px');
            col.child(vAlert(a => {
              a.message('可关闭的提示');
              a.type('info');
              a.closable(true);
              a.onClose(() => toast('警告已关闭'));
            }));
            col.child(vAlert(a => {
              a.message('可关闭的成功提示');
              a.description('带有描述的警告也可以关闭');
              a.type('success');
              a.closable(true);
            }));
          }),
          `vAlert(a => {
  a.message('可关闭')
  a.type('info')
  a.closable(true)
  a.onClose(() => toast('关闭了'))
})`
        ),
      ]));

      // ========== VBreadcrumb 面包屑 ==========
      content.child(DocSection('breadcrumb', 'VBreadcrumb 面包屑', [
        CodeDemo('基础用法',
          vBreadcrumb(b => {
            b.item('首页');
            b.item('应用管理');
            b.item('应用列表');
            b.item('应用详情');
          }),
          `vBreadcrumb(b => {
  b.item('首页')
  b.item('应用管理')
  b.item('应用列表')
  b.item('应用详情')
})`
        ),

        CodeDemo('自定义分隔符',
          vBreadcrumb(b => {
            b.item('首页');
            b.item('应用管理');
            b.item('应用列表');
            b.separator('>');
          }),
          `vBreadcrumb(b => {
  b.item('首页')
  b.item('应用管理')
  b.item('应用列表')
  b.separator('>')  // 自定义分隔符
})`
        ),

        CodeDemo('可点击的面包屑',
          vBreadcrumb(b => {
            b.item('首页', () => {
              toast('点击首页');
            });
            b.item('应用管理', () => {
              toast('点击应用管理');
            });
            b.item('应用列表');
          }),
          `vBreadcrumb(b => {
  b.item('首页', () => {
    toast('点击首页')
  })
  b.item('应用管理', () => {
    toast('点击应用管理')
  })
  b.item('应用列表')  // 最后一项不可点击
})`
        ),
      ]));

      // ========== API ==========
      content.child(DocSection('api', 'API 参考', [
        ApiTable([
          {
            name: 'VAvatar',
            desc: '头像组件',
            type: 'text, src, size, shape, icon, onClick'
          },
          {
            name: 'VBadge',
            desc: '徽标组件',
            type: 'count, dot, status, color, target'
          },
          {
            name: 'VProgress',
            desc: '进度条组件',
            type: 'percent, status, strokeWidth, strokeColor, showInfo'
          },
          {
            name: 'VSkeleton',
            desc: '骨架屏组件',
            type: 'type, rows, avatar, title, button, active'
          },
          {
            name: 'VTag',
            desc: '标签组件',
            type: 'text, color, size, bordered, closable, onClose'
          },
          {
            name: 'VAlert',
            desc: '警告提示组件',
            type: 'message, description, type, showIcon, closable, action'
          },
          {
            name: 'VBreadcrumb',
            desc: '面包屑组件',
            type: 'item, separator, maxCount'
          },
        ]),
      ]));
    },
  });
}
