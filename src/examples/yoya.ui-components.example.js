/**
 * Yoya.Basic - UI 组件演示
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
} from '../yoya/index.js';

const app = document.getElementById('app');

// 页面标题
app.appendChild(div(d => {
  d.h2(h => h.text('📦 UI 组件演示'));
  d.styles({ marginBottom: '30px' });
}));

// ============================================
// 1. Avatar 头像组件
// ============================================

app.appendChild(div(section => {
  section.styles({
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  });

  section.child(div(header => {
    header.h2(h => h.text('1. Avatar 头像组件'));
    header.styles({ marginBottom: '20px' });
  }));

  // 尺寸对比
  section.child(div(row => {
    row.styles({ marginBottom: '20px' });
    row.child(div(label => {
      label.text('尺寸：');
      label.styles({ fontWeight: '500', marginRight: '16px' });
    }));
    row.child(vAvatar(a => a.text('小').size('small')));
    row.child(vAvatar(a => a.text('默')));
    row.child(vAvatar(a => a.text('大').size('large')));
    row.child(vAvatar(a => a.text('自定义').size(50)));
  }));

  // 形状对比
  section.child(div(row => {
    row.styles({ marginBottom: '20px' });
    row.child(div(label => {
      label.text('形状：');
      label.styles({ fontWeight: '500', marginRight: '16px' });
    }));
    row.child(vAvatar(a => a.text('圆').shape('circle').size(48)));
    row.child(span(s => { s.text(' | ').styles({ margin: '0 16px' }); }));
    row.child(vAvatar(a => a.text('方').shape('square').size(48)));
  }));

  // 内容类型
  section.child(div(row => {
    row.styles({ marginBottom: '20px' });
    row.child(div(label => {
      label.text('内容：');
      label.styles({ fontWeight: '500', marginRight: '16px' });
    }));
    row.child(vAvatar(a => a.text('张')));
    row.child(vAvatar(a => a.src('https://api.dicebear.com/7.x/avataaars/svg?seed=1').size(40)));
    row.child(vAvatar(a => a.icon('<span style="font-size:20px">👤</span>')));
  }));

  // 头像组
  section.child(div(row => {
    row.child(div(label => {
      label.text('头像组：');
      label.styles({ fontWeight: '500', marginRight: '16px' });
    }));
    row.child(vAvatarGroup(g => {
      g.child(vAvatar(a => a.src('https://api.dicebear.com/7.x/avataaars/svg?seed=A')));
      g.child(vAvatar(a => a.src('https://api.dicebear.com/7.x/avataaars/svg?seed=B')));
      g.child(vAvatar(a => a.src('https://api.dicebear.com/7.x/avataaars/svg?seed=C')));
      g.child(vAvatar(a => a.src('https://api.dicebear.com/7.x/avataaars/svg?seed=D')));
    }));
  }));
}));

// ============================================
// 2. Badge 徽标组件
// ============================================

app.appendChild(div(section => {
  section.styles({
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  });

  section.child(div(header => {
    header.h2(h => h.text('2. Badge 徽标组件'));
    header.styles({ marginBottom: '20px' });
  }));

  // 数字徽章
  section.child(div(row => {
    row.styles({ marginBottom: '20px' });
    row.child(div(label => {
      label.text('数字徽章：');
      label.styles({ fontWeight: '500', marginRight: '16px' });
    }));
    row.child(vBadge(b => b.count(5).target(vButton(btn => btn.text('按钮')))));
    row.child(vBadge(b => b.count(99).target(vButton(btn => btn.text('按钮')))));
    row.child(vBadge(b => b.count(100).overflowCount(99).target(vButton(btn => btn.text('按钮')))));
  }));

  // 红点徽章
  section.child(div(row => {
    row.styles({ marginBottom: '20px' });
    row.child(div(label => {
      label.text('红点徽章：');
      label.styles({ fontWeight: '500', marginRight: '16px' });
    }));
    row.child(vBadge(b => b.dot().target(vButton(btn => btn.text('未读消息')))));
  }));

  // 状态徽章
  section.child(div(row => {
    row.child(div(label => {
      label.text('状态徽章：');
      label.styles({ fontWeight: '500', marginRight: '16px' });
    }));
    row.child(vBadge(b => b.text('成功').status('success').standalone()));
    row.child(vBadge(b => b.text('错误').status('error').standalone()));
    row.child(vBadge(b => b.text('警告').status('warning').standalone()));
    row.child(vBadge(b => b.text('默认').status('default').standalone()));
  }));
}));

// ============================================
// 3. Progress 进度条组件
// ============================================

app.appendChild(div(section => {
  section.styles({
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  });

  section.child(div(header => {
    header.h2(h => h.text('3. Progress 进度条组件'));
    header.styles({ marginBottom: '20px' });
  }));

  // 基础进度
  section.child(div(row => {
    row.styles({ marginBottom: '20px' });
    row.child(vProgress(p => p.percent(30)).style('flex', '1'));
  }));

  section.child(div(row => {
    row.styles({ marginBottom: '20px' });
    row.child(vProgress(p => p.percent(50)).style('flex', '1'));
  }));

  section.child(div(row => {
    row.styles({ marginBottom: '20px' });
    row.child(vProgress(p => p.percent(70)).style('flex', '1'));
  }));

  // 不同状态
  section.child(div(row => {
    row.styles({ marginBottom: '20px' });
    row.child(div(label => {
      label.text('状态：');
      label.styles({ fontWeight: '500', marginRight: '16px' });
    }));
    row.child(vProgress(p => p.percent(100).status('success')).style('flex', '1'));
  }));

  section.child(div(row => {
    row.styles({ marginBottom: '20px' });
    row.child(div(label => {
      label.text('异常：');
      label.styles({ fontWeight: '500', marginRight: '16px' });
    }));
    row.child(vProgress(p => p.percent(50).status('exception')).style('flex', '1'));
  }));

  section.child(div(row => {
    row.styles({ marginBottom: '20px' });
    row.child(div(label => {
      label.text('激活：');
      label.styles({ fontWeight: '500', marginRight: '16px' });
    }));
    row.child(vProgress(p => p.percent(60).status('active')).style('flex', '1'));
  }));
}));

// ============================================
// 4. Skeleton 骨架屏组件
// ============================================

app.appendChild(div(section => {
  section.styles({
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  });

  section.child(div(header => {
    header.h2(h => h.text('4. Skeleton 骨架屏组件'));
    header.styles({ marginBottom: '20px' });
  }));

  section.child(div(row => {
    row.styles({ marginBottom: '20px' });
    row.child(div(label => {
      label.text('段落：');
      label.styles({ fontWeight: '500', marginRight: '16px' });
    }));
    row.child(vSkeleton(s => s.rows(3)).style('flex', '1'));
  }));

  section.child(div(row => {
    row.styles({ marginBottom: '20px' });
    row.child(div(label => {
      label.text('带头像：');
      label.styles({ fontWeight: '500', marginRight: '16px' });
    }));
    row.child(vSkeleton(s => s.avatar().rows(2)).style('flex', '1'));
  }));

  section.child(div(row => {
    row.child(div(label => {
      label.text('带标题：');
      label.styles({ fontWeight: '500', marginRight: '16px' });
    }));
    row.child(vSkeleton(s => s.title().paragraph(2)).style('flex', '1'));
  }));
}));

// ============================================
// 5. Tag 标签组件
// ============================================

app.appendChild(div(section => {
  section.styles({
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  });

  section.child(div(header => {
    header.h2(h => h.text('5. Tag 标签组件'));
    header.styles({ marginBottom: '20px' });
  }));

  // 颜色
  section.child(div(row => {
    row.styles({ marginBottom: '20px' });
    row.child(div(label => {
      label.text('颜色：');
      label.styles({ fontWeight: '500', marginRight: '16px' });
    }));
    row.child(vTag(t => t.text('默认')));
    row.child(vTag(t => t.text('蓝色').color('blue')));
    row.child(vTag(t => t.text('绿色').color('green')));
    row.child(vTag(t => t.text('红色').color('red')));
    row.child(vTag(t => t.text('橙色').color('orange')));
    row.child(vTag(t => t.text('紫色').color('purple')));
  }));

  // 尺寸
  section.child(div(row => {
    row.styles({ marginBottom: '20px' });
    row.child(div(label => {
      label.text('尺寸：');
      label.styles({ fontWeight: '500', marginRight: '16px' });
    }));
    row.child(vTag(t => t.text('小').size('small')));
    row.child(vTag(t => t.text('默认')));
    row.child(vTag(t => t.text('大').size('large')));
  }));

  // 可关闭
  section.child(div(row => {
    row.child(div(label => {
      label.text('可关闭：');
      label.styles({ fontWeight: '500', marginRight: '16px' });
    }));
    row.child(vTag(t => {
      t.text('可关闭标签');
      t.closable(true);
      t.onClose(() => toast.info('标签已关闭'));
    }));
  }));
}));

// ============================================
// 6. Alert 警告提示组件
// ============================================

app.appendChild(div(section => {
  section.styles({
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  });

  section.child(div(header => {
    header.h2(h => h.text('6. Alert 警告提示组件'));
    header.styles({ marginBottom: '20px' });
  }));

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
}));

// ============================================
// 7. Breadcrumb 面包屑组件
// ============================================

app.appendChild(div(section => {
  section.styles({
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  });

  section.child(div(header => {
    header.h2(h => h.text('7. Breadcrumb 面包屑组件'));
    header.styles({ marginBottom: '20px' });
  }));

  section.child(div(row => {
    row.styles({ marginBottom: '20px' });
    row.child(vBreadcrumb(b => {
      b.item('首页', () => toast.info('点击首页'));
      b.item('产品列表', () => toast.info('点击产品列表'));
      b.item('产品详情');
    }));
  }));

  section.child(div(row => {
    row.child(vBreadcrumb(b => {
      b.separator('>');
      b.item('首页', () => toast.info('点击首页'));
      b.item('设置', () => toast.info('点击设置'));
      b.item('账户安全');
    }));
  }));
}));

console.log('UI 组件演示页面已加载');
