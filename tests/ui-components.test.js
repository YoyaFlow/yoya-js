/**
 * Yoya.Basic - UI 组件单元测试
 * 测试 Avatar, Badge, Progress, Skeleton, Tag, Alert, Breadcrumb 组件
 */

import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;

import {
  vAvatar, vAvatarGroup,
  vBadge,
  vProgress,
  vSkeleton,
  vTag,
  vAlert,
  vBreadcrumb
} from '../src/yoya/index.js';

function assert(condition, message) {
  if (!condition) throw new Error(`❌ 测试失败：${message}`);
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`❌ 测试失败：${message}\n   期望：${expected}\n   实际：${actual}`);
  }
}

// ============================================
// VAvatar 测试
// ============================================

const avatarTests = {
  'VAvatar 基础创建': () => {
    const avatar = vAvatar();
    assert(avatar !== null, '应该创建头像组件');
  },

  'VAvatar 支持 text 方法': () => {
    const avatar = vAvatar(a => {
      a.text('用户');
    });
    assert(avatar._text === '用户', '应该设置文本');
  },

  'VAvatar 支持 src 方法': () => {
    const avatar = vAvatar(a => {
      a.src('avatar.jpg');
      a.alt('头像');
    });
    assertEquals(avatar._src, 'avatar.jpg', '应该设置图片路径');
    assertEquals(avatar._alt, '头像', '应该设置 alt 文本');
  },

  'VAvatar size 方法设置尺寸': () => {
    const avatar = vAvatar(a => {
      a.size('large');
    });
    assertEquals(avatar._styles.width, '40px', 'large 宽度应该是 40px');
    assertEquals(avatar._styles.height, '40px', 'large 高度应该是 40px');
  },

  'VAvatar size 小尺寸': () => {
    const avatar = vAvatar(a => {
      a.size('small');
    });
    assertEquals(avatar._styles.width, '24px', 'small 宽度应该是 24px');
    assertEquals(avatar._styles.height, '24px', 'small 高度应该是 24px');
  },

  'VAvatar size 数字尺寸': () => {
    const avatar = vAvatar(a => {
      a.size(60);
    });
    assertEquals(avatar._styles.width, '60px', '宽度应该是 60px');
    assertEquals(avatar._styles.height, '60px', '高度应该是 60px');
  },

  'VAvatar shape 方法设置方形': () => {
    const avatar = vAvatar(a => {
      a.shape('square');
    });
    assertEquals(avatar._styles.borderRadius, '4px', '方形应该是 4px 圆角');
  },

  'VAvatar shape 方法设置圆形': () => {
    const avatar = vAvatar(a => {
      a.shape('circle');
    });
    assertEquals(avatar._styles.borderRadius, '50%', '圆形应该是 50% 圆角');
  },

  'VAvatarGroup 支持 max 方法': () => {
    const group = vAvatarGroup(g => {
      g.max(3);
    });
    assertEquals(group._max, 3, '应该设置最大数量');
  },

  'VAvatarGroup 支持 child 方法': () => {
    const group = vAvatarGroup(g => {
      g.child(vAvatar(a => a.text('A')));
      g.child(vAvatar(a => a.text('B')));
    });
    assert(group._avatars.length === 2, '应该有两个头像');
  }
};

// ============================================
// VBadge 测试
// ============================================

const badgeTests = {
  'VBadge 基础创建': () => {
    const badge = vBadge();
    assert(badge !== null, '应该创建徽标组件');
  },

  'VBadge 支持 count 方法': () => {
    const badge = vBadge(b => {
      b.count(5);
    });
    assert(badge._count === 5, '应该设置数量');
  },

  'VBadge 支持 dot 方法': () => {
    const badge = vBadge(b => {
      b.dot();
    });
    assert(badge._dot === true, '应该设置红点模式');
  },

  'VBadge 支持 status 方法': () => {
    const badge = vBadge(b => {
      b.status('success');
    });
    assert(badge.getState('status') === 'success', '应该设置状态');
  },

  'VBadge 支持 color 方法': () => {
    const badge = vBadge(b => {
      b.color('green');
    });
    assertEquals(badge._color, 'green', '应该设置颜色');
  },

  'VBadge 支持 overflowCount 方法': () => {
    const badge = vBadge(b => {
      b.count(100);
      b.overflowCount(99);
    });
    assertEquals(badge._overflowCount, 99, '应该设置溢出值');
  }
};

// ============================================
// VProgress 测试
// ============================================

const progressTests = {
  'VProgress 基础创建': () => {
    const progress = vProgress();
    assert(progress !== null, '应该创建进度条组件');
  },

  'VProgress 支持 percent 方法': () => {
    const progress = vProgress(p => {
      p.percent(75);
    });
    assertEquals(progress._percent, 75, '应该设置百分比');
  },

  'VProgress percent 限制在 0-100': () => {
    const progress = vProgress(p => {
      p.percent(150);
    });
    assertEquals(progress._percent, 100, '百分比应该限制在 100');
  },

  'VProgress 支持 strokeWidth 方法': () => {
    const progress = vProgress(p => {
      p.strokeWidth(20);
    });
    assertEquals(progress._strokeWidth, 20, '应该设置线条宽度');
  },

  'VProgress 支持 status 方法': () => {
    const progress = vProgress(p => {
      p.status('success');
    });
    assert(progress.getState('status') === 'success', '应该设置状态');
  },

  'VProgress 支持 strokeColor 方法': () => {
    const progress = vProgress(p => {
      p.strokeColor('#52c41a');
    });
    assertEquals(progress._strokeColor, '#52c41a', '应该设置颜色');
  }
};

// ============================================
// VSkeleton 测试
// ============================================

const skeletonTests = {
  'VSkeleton 基础创建': () => {
    const skeleton = vSkeleton();
    assert(skeleton !== null, '应该创建骨架屏组件');
  },

  'VSkeleton 支持 rows 方法': () => {
    const skeleton = vSkeleton(s => {
      s.rows(5);
    });
    assertEquals(skeleton._rows, 5, '应该设置行数');
  },

  'VSkeleton 支持 active 方法': () => {
    const skeleton = vSkeleton(s => {
      s.active(true);
    });
    assert(skeleton.getState('active') === true, '应该设置激活状态');
  },

  'VSkeleton 支持 avatar 方法': () => {
    const skeleton = vSkeleton(s => {
      s.avatar();
    });
    assert(skeleton._showAvatar === true, '应该显示头像占位');
  },

  'VSkeleton 支持 title 方法': () => {
    const skeleton = vSkeleton(s => {
      s.title();
    });
    assert(skeleton._showTitle === true, '应该显示标题占位');
  },

  'VSkeleton 支持 button 方法': () => {
    const skeleton = vSkeleton(s => {
      s.button();
    });
    assert(skeleton._showButton === true, '应该显示按钮占位');
  },

  'VSkeleton 支持 paragraph 方法': () => {
    const skeleton = vSkeleton(s => {
      s.paragraph(5);
    });
    assertEquals(skeleton._rows, 5, '应该设置段落行数');
  }
};

// ============================================
// VTag 测试
// ============================================

const tagTests = {
  'VTag 基础创建': () => {
    const tag = vTag();
    assert(tag !== null, '应该创建标签组件');
  },

  'VTag 支持 text 方法': () => {
    const tag = vTag(t => {
      t.text('标签');
    });
    assertEquals(tag._text, '标签', '应该设置文本');
  },

  'VTag 支持 color 方法': () => {
    const tag = vTag(t => {
      t.color('blue');
    });
    assertEquals(tag.getState('color'), 'blue', '应该设置颜色');
  },

  'VTag 支持 size 方法': () => {
    const tag = vTag(t => {
      t.size('large');
    });
    assertEquals(tag.getState('size'), 'large', '应该设置尺寸');
  },

  'VTag 支持 bordered 方法': () => {
    const tag = vTag(t => {
      t.bordered(false);
    });
    assertEquals(tag.getState('bordered'), false, '应该设置边框');
  },

  'VTag 支持 closable 方法': () => {
    const tag = vTag(t => {
      t.closable(true);
    });
    assertEquals(tag.getState('closable'), true, '应该设置可关闭');
  },

  'VTag 支持 onClose 回调': () => {
    let called = false;
    const tag = vTag(t => {
      t.closable(true);
      t.onClose(() => { called = true; });
    });
    assert(tag._onClose !== null, '应该设置关闭回调');
  }
};

// ============================================
// VAlert 测试
// ============================================

const alertTests = {
  'VAlert 基础创建': () => {
    const alert = vAlert();
    assert(alert !== null, '应该创建警告组件');
  },

  'VAlert 支持 message 方法': () => {
    const alert = vAlert(a => {
      a.message('警告信息');
    });
    assertEquals(alert._message, '警告信息', '应该设置消息');
  },

  'VAlert 支持 description 方法': () => {
    const alert = vAlert(a => {
      a.description('详细描述');
    });
    assertEquals(alert._description, '详细描述', '应该设置描述');
  },

  'VAlert 支持 type 方法': () => {
    const alert = vAlert(a => {
      a.type('warning');
    });
    assertEquals(alert.getState('type'), 'warning', '应该设置类型');
  },

  'VAlert 支持 showIcon 方法': () => {
    const alert = vAlert(a => {
      a.showIcon(false);
    });
    assertEquals(alert.getState('showIcon'), false, '应该设置显示图标');
  },

  'VAlert 支持 closable 方法': () => {
    const alert = vAlert(a => {
      a.closable(true);
    });
    assertEquals(alert.getState('closable'), true, '应该设置可关闭');
  },

  'VAlert 支持 onClose 回调': () => {
    let called = false;
    const alert = vAlert(a => {
      a.closable(true);
      a.onClose(() => { called = true; });
    });
    assert(alert._onClose !== null, '应该设置关闭回调');
  }
};

// ============================================
// VBreadcrumb 测试
// ============================================

const breadcrumbTests = {
  'VBreadcrumb 基础创建': () => {
    const breadcrumb = vBreadcrumb();
    assert(breadcrumb !== null, '应该创建面包屑组件');
  },

  'VBreadcrumb 支持 item 方法': () => {
    const breadcrumb = vBreadcrumb(b => {
      b.item('首页');
      b.item('列表');
    });
    assert(breadcrumb._items.length === 2, '应该有两个项');
  },

  'VBreadcrumb 支持 separator 方法': () => {
    const breadcrumb = vBreadcrumb(b => {
      b.separator('>');
    });
    assertEquals(breadcrumb._separator, '>', '应该设置分隔符');
  },

  'VBreadcrumb 支持 maxCount 方法': () => {
    const breadcrumb = vBreadcrumb(b => {
      b.maxCount(4);
    });
    assertEquals(breadcrumb._maxCount, 4, '应该设置最大数量');
  },

  'VBreadcrumb item 支持 onClick 回调': () => {
    let called = false;
    const breadcrumb = vBreadcrumb(b => {
      b.item('首页', () => { called = true; });
    });
    assert(breadcrumb._items[0].onClick !== null, '应该设置点击回调');
  }
};

// ============================================
// 运行所有测试
// ============================================

function runTests() {
  console.log('\n🧪 开始运行 UI 组件测试...\n');

  let passed = 0;
  let failed = 0;

  const allTests = {
    ...avatarTests,
    ...badgeTests,
    ...progressTests,
    ...skeletonTests,
    ...tagTests,
    ...alertTests,
    ...breadcrumbTests
  };

  for (const [name, testFn] of Object.entries(allTests)) {
    try {
      testFn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(`   ${error.message}`);
      failed++;
    }
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`测试完成：${passed + failed} 个测试，${passed} 通过，${failed} 失败`);
  console.log(`${'─'.repeat(50)}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
