/**
 * Yoya.Basic - UI 组件综合演示
 * Avatar, Badge, Progress, Skeleton, Tag, Alert, Breadcrumb
 */

import {
  div, h2, h3, span,
  vAvatar, vAvatarGroup,
  vBadge,
  vProgress,
  vSkeleton,
  vTag,
  vAlert,
  vBreadcrumb,
  vButton,
  toast
} from '../../yoya/index.js';

// ============================================
// 演示页面样式
// ============================================

const pageStyles = {
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '40px 20px',
    margin: 0
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '40px'
  },
  section: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333',
    borderBottom: '2px solid #667eea',
    paddingBottom: '10px'
  },
  row: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '16px'
  },
  label: {
    minWidth: '100px',
    fontWeight: '500',
    color: '#666'
  }
};

// ============================================
// 演示模块 1: Avatar 头像组件
// ============================================

function createAvatarDemo() {
  return div(section => {
    section.styles(pageStyles.section);

    section.h2(h => {
      h.text('1. Avatar 头像组件');
      h.styles(pageStyles.title);
    });

    // 尺寸对比
    section.div(row => {
      row.styles(pageStyles.row);
      row.div(label => {
        label.text('尺寸：');
        label.styles(pageStyles.label);
      });
      row.child(vAvatar(a => a.text('小').size('small')));
      row.child(vAvatar(a => a.text('默')));
      row.child(vAvatar(a => a.text('大').size('large')));
      row.child(vAvatar(a => a.text('自定义').size(50)));
    });

    // 形状对比
    section.div(row => {
      row.styles(pageStyles.row);
      row.div(label => {
        label.text('形状：');
        label.styles(pageStyles.label);
      });
      row.child(vAvatar(a => a.text('圆').shape('circle').size(48)));
      row.child(span(s => { s.text(' | ').styles({ margin: '0 16px' }); }));
      row.child(vAvatar(a => a.text('方').shape('square').size(48)));
    });

    // 内容类型
    section.div(row => {
      row.styles(pageStyles.row);
      row.div(label => {
        label.text('内容：');
        label.styles(pageStyles.label);
      });
      row.child(vAvatar(a => a.text('张')));
      row.child(vAvatar(a => a.src('https://api.dicebear.com/7.x/avataaars/svg?seed=1').size(40)));
      row.child(vAvatar(a => a.icon('<span style="font-size:20px">👤</span>')));
    });

    // 头像组
    section.div(row => {
      row.child(div(label => {
        label.text('头像组：');
        label.styles(pageStyles.label);
      }));
      row.child(vAvatarGroup(g => {
        g.child(vAvatar(a => a.src('https://api.dicebear.com/7.x/avataaars/svg?seed=A')));
        g.child(vAvatar(a => a.src('https://api.dicebear.com/7.x/avataaars/svg?seed=B')));
        g.child(vAvatar(a => a.src('https://api.dicebear.com/7.x/avataaars/svg?seed=C')));
        g.child(vAvatar(a => a.src('https://api.dicebear.com/7.x/avataaars/svg?seed=D')));
      }));
    });
  });
}

// ============================================
// 演示模块 2: Badge 徽标组件
// ============================================

function createBadgeDemo() {
  return div(section => {
    section.styles(pageStyles.section);

    section.h2(h => {
      h.text('2. Badge 徽标组件');
      h.styles(pageStyles.title);
    });

    // 数字徽章
    section.div(row => {
      row.styles(pageStyles.row);
      row.div(label => {
        label.text('数字徽章：');
        label.styles(pageStyles.label);
      });
      row.child(vBadge(b => b.count(5).target(vButton(btn => btn.text('按钮')))));
      row.child(vBadge(b => b.count(99).target(vButton(btn => btn.text('按钮')))));
      row.child(vBadge(b => b.count(100).overflowCount(99).target(vButton(btn => btn.text('按钮')))));
    });

    // 红点徽章
    section.div(row => {
      row.styles(pageStyles.row);
      row.div(label => {
        label.text('红点徽章：');
        label.styles(pageStyles.label);
      });
      row.child(vBadge(b => b.dot().target(vButton(btn => btn.text('未读消息')))));
    });

    // 状态徽章
    section.div(row => {
      row.div(label => {
        label.text('状态徽章：');
        label.styles(pageStyles.label);
      });
      row.child(vBadge(b => b.text('成功').status('success').standalone()));
      row.child(vBadge(b => b.text('错误').status('error').standalone()));
      row.child(vBadge(b => b.text('警告').status('warning').standalone()));
      row.child(vBadge(b => b.text('默认').status('default').standalone()));
    });
  });
}

// ============================================
// 演示模块 3: Progress 进度条组件
// ============================================

function createProgressDemo() {
  return div(section => {
    section.styles(pageStyles.section);

    section.h2(h => {
      h.text('3. Progress 进度条组件');
      h.styles(pageStyles.title);
    });

    // 基础进度
    section.div(row => {
      row.styles(pageStyles.row);
      row.child(vProgress(p => p.percent(30)).style('flex', '1'));
    });

    section.div(row => {
      row.styles(pageStyles.row);
      row.child(vProgress(p => p.percent(50)).style('flex', '1'));
    });

    section.div(row => {
      row.styles(pageStyles.row);
      row.child(vProgress(p => p.percent(70)).style('flex', '1'));
    });

    // 不同状态
    section.div(row => {
      row.styles(pageStyles.row);
      row.div(label => {
        label.text('状态：');
        label.styles(pageStyles.label);
      });
      row.child(vProgress(p => p.percent(100).status('success')).style('flex', '1'));
    });

    section.div(row => {
      row.styles(pageStyles.row);
      row.div(label => {
        label.text('异常：');
        label.styles(pageStyles.label);
      });
      row.child(vProgress(p => p.percent(50).status('exception')).style('flex', '1'));
    });

    section.div(row => {
      row.styles(pageStyles.row);
      row.div(label => {
        label.text('激活：');
        label.styles(pageStyles.label);
      });
      row.child(vProgress(p => p.percent(60).status('active')).style('flex', '1'));
    });
  });
}

// ============================================
// 演示模块 4: Skeleton 骨架屏组件
// ============================================

function createSkeletonDemo() {
  return div(section => {
    section.styles(pageStyles.section);

    section.h2(h => {
      h.text('4. Skeleton 骨架屏组件');
      h.styles(pageStyles.title);
    });

    // 段落骨架
    section.div(row => {
      row.styles(pageStyles.row);
      row.div(label => {
        label.text('段落：');
        label.styles(pageStyles.label);
      });
      row.child(vSkeleton(s => s.rows(3)).style('flex', '1'));
    });

    // 带头像骨架
    section.div(row => {
      row.styles(pageStyles.row);
      row.div(label => {
        label.text('带头像：');
        label.styles(pageStyles.label);
      });
      row.child(vSkeleton(s => s.avatar().rows(2)).style('flex', '1'));
    });

    // 带标题骨架
    section.div(row => {
      row.div(label => {
        label.text('带标题：');
        label.styles(pageStyles.label);
      });
      row.child(vSkeleton(s => s.title().paragraph(2)).style('flex', '1'));
    });
  });
}

// ============================================
// 演示模块 5: Tag 标签组件
// ============================================

function createTagDemo() {
  return div(section => {
    section.styles(pageStyles.section);

    section.h2(h => {
      h.text('5. Tag 标签组件');
      h.styles(pageStyles.title);
    });

    // 颜色
    section.div(row => {
      row.styles(pageStyles.row);
      row.div(label => {
        label.text('颜色：');
        label.styles(pageStyles.label);
      });
      row.child(vTag(t => t.text('默认')));
      row.child(vTag(t => t.text('蓝色').color('blue')));
      row.child(vTag(t => t.text('绿色').color('green')));
      row.child(vTag(t => t.text('红色').color('red')));
      row.child(vTag(t => t.text('橙色').color('orange')));
      row.child(vTag(t => t.text('紫色').color('purple')));
    });

    // 尺寸
    section.div(row => {
      row.styles(pageStyles.row);
      row.div(label => {
        label.text('尺寸：');
        label.styles(pageStyles.label);
      });
      row.child(vTag(t => t.text('小').size('small')));
      row.child(vTag(t => t.text('默认')));
      row.child(vTag(t => t.text('大').size('large')));
    });

    // 可关闭
    section.div(row => {
      row.div(label => {
        label.text('可关闭：');
        label.styles(pageStyles.label);
      });
      row.child(vTag(t => {
        t.text('可关闭标签');
        t.closable(true);
        t.onClose(() => toast.info('标签已关闭'));
      }));
    });
  });
}

// ============================================
// 演示模块 6: Alert 警告提示组件
// ============================================

function createAlertDemo() {
  return div(section => {
    section.styles(pageStyles.section);

    section.h2(h => {
      h.text('6. Alert 警告提示组件');
      h.styles(pageStyles.title);
    });

    section.child(vAlert(a => {
      a.type('info');
      a.message('信息提示');
      a.description('这是一条普通的提示信息，用于告知用户某些操作结果。');
    }));

    section.child(vAlert(a => {
      a.type('success');
      a.message('成功提示');
      a.description('操作已成功完成！');
    }));

    section.child(vAlert(a => {
      a.type('warning');
      a.message('警告提示');
      a.description('请注意，此操作可能会影响某些功能。');
    }));

    section.child(vAlert(a => {
      a.type('error');
      a.message('错误提示');
      a.description('操作失败，请检查输入是否正确。');
      a.closable(true);
    }));
  });
}

// ============================================
// 演示模块 7: Breadcrumb 面包屑组件
// ============================================

function createBreadcrumbDemo() {
  return div(section => {
    section.styles(pageStyles.section);

    section.h2(h => {
      h.text('7. Breadcrumb 面包屑组件');
      h.styles(pageStyles.title);
    });

    // 基础面包屑
    section.div(row => {
      row.styles(pageStyles.row);
      row.child(vBreadcrumb(b => {
        b.item('首页', () => toast.info('点击首页'));
        b.item('产品列表', () => toast.info('点击产品列表'));
        b.item('产品详情');
      }));
    });

    // 自定义分隔符
    section.div(row => {
      row.child(vBreadcrumb(b => {
        b.separator('>');
        b.item('首页', () => toast.info('点击首页'));
        b.item('设置', () => toast.info('点击设置'));
        b.item('账户安全');
      }));
    });
  });
}

// ============================================
// 创建主应用
// ============================================

function createApp() {
  return div(app => {
    app.styles(pageStyles.body);

    app.div(container => {
      container.styles(pageStyles.container);

      // 页面标题
      container.div(header => {
        header.styles(pageStyles.header);
        header.h1(h => {
          h.text('📦 Yoya.Basic UI 组件演示');
          h.styles({
            fontSize: '36px',
            margin: '0 0 10px 0'
          });
        });
        header.p(p => {
          p.text('灵活多样的 UI 组件库');
          p.styles({
            color: 'rgba(255,255,255,0.9)',
            fontSize: '16px'
          });
        });
      });

      // 各个组件演示
      container.child(createAvatarDemo());
      container.child(createBadgeDemo());
      container.child(createProgressDemo());
      container.child(createSkeletonDemo());
      container.child(createTagDemo());
      container.child(createAlertDemo());
      container.child(createBreadcrumbDemo());

      // 页脚
      container.div(footer => {
        footer.styles({
          textAlign: 'center',
          padding: '30px',
          color: 'rgba(255,255,255,0.7)',
          marginTop: '40px'
        });
        footer.p(p => {
          p.text('Yoya.Basic - UI 组件库');
          p.styles({ marginBottom: '10px' });
        });
      });
    });
  });
}

// ============================================
// 渲染应用
// ============================================

console.log('🚀 Yoya.Basic UI 组件演示页面加载开始...');

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('📦 开始渲染 UI 组件演示页面...');
  const appEl = document.getElementById('app');
  const app = createApp();
  app.bindTo(appEl);

  console.log('✅ UI 组件演示页面渲染完成！');
}
