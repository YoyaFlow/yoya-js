# UI 组件库实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按顺序实现 P1 和 P2 阶段的 UI 组件，每个组件完成后在 `/src/examples` 中创建演示页面，使用浏览器验证，最终在 `src/v2/examples` 中创建完整的演示页面。

**Architecture:**
- 组件按类型分组到不同文件：`ui.js`、`interaction.js`、`data-display.js`、`navigation.js`
- 每个组件遵循统一的类 + 工厂函数模式
- 使用状态机系统管理组件状态
- CSS 样式通过主题系统管理

**Tech Stack:**
- 纯 ES 模块，浏览器原生运行
- jsdom 用于单元测试
- Playwright 用于浏览器端到端测试
- Vite 用于开发服务器

---

## Phase 1: P1 基础 UI 组件 (ui.js)

### Task 1: VAvatar 头像组件

**Files:**
- Modify: `src/yoya/components/ui.js` (create this file)
- Create: `src/examples/yoya.avatar.example.html`
- Create: `src/examples/yoya.avatar.example.js`
- Create: `tests/avatar.test.js`
- Modify: `src/yoya/components/index.js`
- Modify: `src/yoya/index.js`
- Create: `theme/css/components/avatar.css`

- [ ] **Step 1: 创建 ui.js 文件并实现 VAvatar 组件**

```javascript
/**
 * Yoya.Components - UI Elements
 * 基础 UI 组件
 */

import { Tag, div, img, span } from '../core/basic.js';

// ============================================
// VAvatar 头像组件
// ============================================

class VAvatar extends Tag {
  static _stateAttrs = ['shape'];

  constructor(setup = null) {
    super('div', null);

    this._src = '';
    this._alt = '';
    this._size = 'default'; // large | default | small | number
    this._shape = 'circle'; // circle | square
    this._icon = '';
    this._text = '';

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({ shape: 'circle' });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupString(setup) {
    this._text = setup;
    this._ensureContent();
  }

  _setupBaseStyles() {
    this.addClass('yoya-avatar');
    this.style('display', 'inline-flex');
    this.style('alignItems', 'center');
    this.style('justifyContent', 'center');
    this.style('overflow', 'hidden');
    this.style('backgroundColor', '#1890ff');
    this.style('color', '#fff');
  }

  _registerStateHandlers() {
    // shape 状态处理器
    this.registerStateHandler('shape', (shape, host) => {
      if (shape === 'square') {
        host.style('borderRadius', '4px');
      } else {
        host.style('borderRadius', '50%');
      }
    });
  }

  _ensureContent() {
    if (!this._contentBox) {
      this._contentBox = span();
      this._children.push(this._contentBox);
    }

    if (this._src) {
      this._contentBox.child(img(i => {
        i.src(this._src);
        i.alt(this._alt);
        i.style('width', '100%');
        i.style('height', '100%');
        i.style('objectFit', 'cover');
      }));
    } else if (this._icon) {
      this._contentBox.html(this._icon);
    } else if (this._text) {
      this._contentBox.text(this._text);
    }
  }

  src(url) {
    this._src = url;
    this._ensureContent();
    return this;
  }

  alt(text) {
    this._alt = text;
    return this;
  }

  size(value) {
    this._size = value;

    const sizeMap = {
      'large': 40,
      'default': 32,
      'small': 24
    };

    const pixelSize = typeof value === 'number' ? value : (sizeMap[value] || 32);
    this.style('width', `${pixelSize}px`);
    this.style('height', `${pixelSize}px`);
    this.style('fontSize', `${pixelSize * 0.5}px`);

    return this;
  }

  shape(type) {
    this.setState('shape', type);
    return this;
  }

  icon(html) {
    this._icon = html;
    this._ensureContent();
    return this;
  }

  text(content) {
    this._text = content;
    this._ensureContent();
    return this;
  }

  onClick(fn) {
    this.on('click', fn);
    this.style('cursor', 'pointer');
    return this;
  }
}

// ============================================
// VAvatar.Group 头像组
// ============================================

class VAvatarGroup extends Tag {
  constructor(setup = null) {
    super('div', null);

    this._max = 0;
    this._avatars = [];

    this._setupBaseStyles();

    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-avatar-group');
    this.style('display', 'flex');
    this.style('flexDirection', 'row-reverse');
  }

  max(n) {
    this._max = n;
    return this;
  }

  child(avatar) {
    if (avatar instanceof VAvatar) {
      this._avatars.push(avatar);

      // 应用重叠样式
      const index = this._avatars.length;
      avatar.style('marginLeft', index > 1 ? '-8px' : '0');
      avatar.style('border', '2px solid #fff');

      super.child(avatar);
    }
    return this;
  }
}

// ============================================
// 工厂函数
// ============================================

function vAvatar(setup = null) {
  return new VAvatar(setup);
}

function vAvatarGroup(setup = null) {
  return new VAvatarGroup(setup);
}

// 支持 vAvatar.group() 链式调用
vAvatar.group = (setup = null) => new VAvatarGroup(setup);

// ============================================
// 导出
// ============================================

export {
  VAvatar,
  VAvatarGroup,
  vAvatar,
  vAvatarGroup,
};
```

- [ ] **Step 2: 创建 Avatar CSS 样式**

创建 `theme/css/components/avatar.css`:

```css
/* Avatar Component */
.yoya-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #1890ff;
  color: #fff;
  font-weight: 500;
  text-align: center;
  text-transform: capitalize;
}

.yoya-avatar--circle {
  border-radius: 50%;
}

.yoya-avatar--square {
  border-radius: 4px;
}

/* Avatar Group */
.yoya-avatar-group {
  display: flex;
  flex-direction: row-reverse;
}

.yoya-avatar-group .yoya-avatar {
  border: 2px solid #fff;
  margin-left: -8px;
}

.yoya-avatar-group .yoya-avatar:first-child {
  margin-left: 0;
}
```

- [ ] **Step 3: 创建 Avatar 测试文件**

创建 `tests/avatar.test.js`:

```javascript
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
  resources: 'usable'
});

global.window = dom.window;
global.document = dom.window.document;

import { vAvatar, vAvatarGroup } from '../src/yoya/index.js';

function assert(condition, message) {
  if (!condition) throw new Error(`❌ 测试失败：${message}`);
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`❌ 测试失败：${message}\n   期望：${expected}\n   实际：${actual}`);
  }
}

const tests = {
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
  },

  'VAvatar size 方法设置尺寸': () => {
    const avatar = vAvatar(a => {
      a.size('large');
    });
    assertEquals(avatar._styles.width, '40px', '宽度应该是 40px');
    assertEquals(avatar._styles.height, '40px', '高度应该是 40px');
  },

  'VAvatar shape 方法设置形状': () => {
    const avatar = vAvatar(a => {
      a.shape('square');
    });
    assertEquals(avatar._styles.borderRadius, '4px', '方形应该是 4px 圆角');
  },

  'VAvatarGroup 支持 max 方法': () => {
    const group = vAvatarGroup(g => {
      g.max(3);
    });
    assertEquals(group._max, 3, '应该设置最大数量');
  }
};

// 运行测试
let passed = 0;
let failed = 0;

for (const [name, testFn] of Object.entries(tests)) {
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

console.log(`\n测试完成：${passed + failed} 个测试，${passed} 通过，${failed} 失败\n`);

if (failed > 0) process.exit(1);
```

- [ ] **Step 4: 运行测试验证 Avatar 组件**

```bash
node tests/avatar.test.js
```
Expected: 所有测试通过

- [ ] **Step 5: 创建 Avatar 演示页面**

创建 `src/examples/yoya.avatar.example.html`:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yoya - Avatar 头像组件演示</title>
  <link rel="stylesheet" href="../yoya/theme/css/index.js">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 40px 20px;
    }
    .demo-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .demo-section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .demo-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #333;
      border-bottom: 2px solid #1890ff;
      padding-bottom: 10px;
    }
    .demo-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }
  </style>
</head>
<body>
  <div class="demo-container" id="app"></div>
  <script type="module" src="yoya.avatar.example.js"></script>
</body>
</html>
```

创建 `src/examples/yoya.avatar.example.js`:

```javascript
/**
 * Yoya.Basic - Avatar 头像组件演示
 */

import { div, h2, vAvatar, vAvatarGroup, toast } from '../yoya/index.js';

const app = document.getElementById('app');

// 页面标题
app.appendChild(div(d => {
  d.h2('h => h.text('📸 Avatar 头像组件演示'));
  d.styles({ marginBottom: '30px' });
}));

// 1. 基础用法 - 文字头像
app.appendChild(div(section => {
  section.styles({
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  });

  section.child(div(header => {
    header.h2(h => h.text('1. 基础用法 - 文字头像'));
    header.styles({ marginBottom: '20px' });
  }));

  section.child(div(row => {
    row.styles({ display: 'flex', gap: '16px' });

    row.child(vAvatar(a => a.text('张')));
    row.child(vAvatar(a => a.text('李').size('large')));
    row.child(vAvatar(a => a.text('王').size('small')));
    row.child(vAvatar(a => a.text('Admin').size(48)));
  }));
}));

// 2. 图片头像
app.appendChild(div(section => {
  section.styles({
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  });

  section.child(div(header => {
    header.h2(h => h.text('2. 图片头像'));
    header.styles({ marginBottom: '20px' });
  }));

  section.child(div(row => {
    row.styles({ display: 'flex', gap: '16px' });

    row.child(vAvatar(a => {
      a.src('https://api.dicebear.com/7.x/avataaars/svg?seed=1');
      a.alt('用户 1');
      a.size(48);
    }));
    row.child(vAvatar(a => {
      a.src('https://api.dicebear.com/7.x/avataaars/svg?seed=2');
      a.alt('用户 2');
      a.size(48);
    }));
    row.child(vAvatar(a => {
      a.src('https://api.dicebear.com/7.x/avataaars/svg?seed=3');
      a.alt('用户 3');
      a.size(48);
    }));
  }));
}));

// 3. 形状对比
app.appendChild(div(section => {
  section.styles({
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  });

  section.child(div(header => {
    header.h2(h => h.text('3. 形状对比'));
    header.styles({ marginBottom: '20px' });
  }));

  section.child(div(row => {
    row.styles({ display: 'flex', gap: '24px', alignItems: 'center' });

    row.child(div(col => {
      col.styles({ textAlign: 'center' });
      col.child(vAvatar(a => a.text('圆').shape('circle').size(60)));
      col.child(div(d => { d.text('圆形'); d.styles({ marginTop: '8px' }); }));
    }));

    row.child(div(col => {
      col.styles({ textAlign: 'center' });
      col.child(vAvatar(a => a.text('方').shape('square').size(60)));
      col.child(div(d => { d.text('方形'); d.styles({ marginTop: '8px' }); }));
    }));
  }));
}));

// 4. 头像组
app.appendChild(div(section => {
  section.styles({
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  });

  section.child(div(header => {
    header.h2(h => h.text('4. 头像组'));
    header.styles({ marginBottom: '20px' });
  }));

  section.child(vAvatarGroup(g => {
    g.max(3);
    g.child(vAvatar(a => a.text('A').src('https://api.dicebear.com/7.x/avataaars/svg?seed=A')));
    g.child(vAvatar(a => a.text('B').src('https://api.dicebear.com/7.x/avataaars/svg?seed=B')));
    g.child(vAvatar(a => a.text('C').src('https://api.dicebear.com/7.x/avataaars/svg?seed=C')));
    g.child(vAvatar(a => a.text('D').src('https://api.dicebear.com/7.x/avataaars/svg?seed=D')));
  }));
}));

// 5. 可点击头像
app.appendChild(div(section => {
  section.styles({
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  });

  section.child(div(header => {
    header.h2(h => h.text('5. 可点击头像'));
    header.styles({ marginBottom: '20px' });
  });

  section.child(div(row => {
    row.styles({ display: 'flex', gap: '16px' });

    row.child(vAvatar(a => {
      a.text('点我');
      a.onClick(() => toast.success('头像被点击了！'));
    }));
  }));
}));

console.log('Avatar 演示页面已加载');
```

- [ ] **Step 6: 更新 components/index.js 导出 Avatar**

在 `src/yoya/components/index.js` 中添加:

```javascript
export { VAvatar, VAvatarGroup, vAvatar, vAvatarGroup } from './ui.js';
```

- [ ] **Step 7: 更新 index.js 主入口导出**

在 `src/yoya/index.js` 中确认导出已包含 vAvatar

- [ ] **Step 8: 在浏览器中验证 Avatar 演示**

```bash
npm run dev
```

然后访问 `http://localhost:3000/src/examples/yoya.avatar.example.html`

- [ ] **Step 9: 提交 Avatar 组件**

```bash
git add src/yoya/components/ui.js
git add src/examples/yoya.avatar.example.html
git add src/examples/yoya.avatar.example.js
git add tests/avatar.test.js
git add theme/css/components/avatar.css
git add src/yoya/components/index.js
git commit -m "feat: add VAvatar component with demo and tests"
```

---

### Task 2: VBadge 徽标组件

**Files:**
- Modify: `src/yoya/components/ui.js`
- Create: `src/examples/yoya.badge.example.html`
- Create: `src/examples/yoya.badge.example.js`
- Create: `tests/badge.test.js`
- Create: `theme/css/components/badge.css`
- Modify: `src/yoya/components/index.js`

- [ ] **Step 1: 在 ui.js 中添加 VBadge 组件**

```javascript
// ============================================
// VBadge 徽标组件
// ============================================

class VBadge extends Tag {
  static _stateAttrs = ['status', 'dot', 'standalone'];

  constructor(setup = null) {
    super('span', null);

    this._count = 0;
    this._target = null;
    this._color = '';
    this._overflowCount = 99;

    // 1. 注册状态属性
    this.registerStateAttrs(...this.constructor._stateAttrs);

    // 2. 初始化状态
    this.initializeStates({ status: 'default', dot: false, standalone: false });

    // 3. 设置基础样式
    this._setupBaseStyles();

    // 4. 保存基础样式快照
    this.saveBaseStylesSnapshot();

    // 5. 注册状态处理器
    this._registerStateHandlers();

    // 6. 执行 setup
    if (setup !== null) {
      this.setup(setup);
    }
  }

  _setupBaseStyles() {
    this.addClass('yoya-badge');
    this.style('position', 'relative');
    this.style('display', 'inline-block');
  }

  _registerStateHandlers() {
    // dot 状态 - 红点模式
    this.registerStateHandler('dot', (isDot, host) => {
      if (isDot) {
        host.addClass('yoya-badge--dot');
      }
    });

    // standalone 状态 - 独立模式
    this.registerStateHandler('standalone', (standalone, host) => {
      if (standalone) {
        host.style('position', 'static');
      }
    });

    // status 状态
    this.registerStateHandler('status', (status, host) => {
      host.removeClass('yoya-badge--success', 'yoya-badge--error', 'yoya-badge--warning', 'yoya-badge--processing', 'yoya-badge--default');
      if (status) {
        host.addClass(`yoya-badge--${status}`);
      }
    });
  }

  _ensureBadgeElement() {
    if (!this._badgeEl) {
      this._badgeEl = span(b => {
        b.addClass('yoya-badge__overlay');
      });
    }
  }

  count(n) {
    this._count = n;
    this._renderContent();
    return this;
  }

  target(el) {
    this._target = el;
    return this;
  }

  dot() {
    this.setState('dot', true);
    return this;
  }

  status(type) {
    this.setState('status', type);
    return this;
  }

  standalone() {
    this.setState('standalone', true);
    return this;
  }

  color(c) {
    this._color = c;
    if (this._badgeEl) {
      this._badgeEl.style('backgroundColor', c);
    }
    return this;
  }

  overflowCount(n) {
    this._overflowCount = n;
    this._renderContent();
    return this;
  }

  _renderContent() {
    // 实现徽标内容渲染逻辑
  }
}

// ============================================
// 工厂函数
// ============================================

function vBadge(setup = null) {
  return new VBadge(setup);
}

export { VBadge, vBadge };
```

- [ ] **Step 2: 创建 Badge CSS**

创建 `theme/css/components/badge.css`

- [ ] **Step 3: 创建 Badge 测试文件**

创建 `tests/badge.test.js`

- [ ] **Step 4: 运行测试**

```bash
node tests/badge.test.js
```

- [ ] **Step 5: 创建 Badge 演示页面**

- [ ] **Step 6: 更新导出**

- [ ] **Step 7: 浏览器验证**

- [ ] **Step 8: 提交**

---

### Task 3: VProgress 进度条组件

（类似结构，实现进度条组件）

### Task 4: VSkeleton 骨架屏组件

（类似结构，实现骨架屏组件）

### Task 5: VTag 标签组件

（类似结构，实现标签组件）

### Task 6: VAlert 警告提示组件

（类似结构，实现警告组件）

### Task 7: VBreadcrumb 面包屑组件

（类似结构，实现面包屑组件）

---

## Phase 2: P1 交互组件 (interaction.js)

### Task 8: VTooltip 文字提示

### Task 9: VPopover 气泡卡片

### Task 10: VDropdown 下拉菜单

### Task 11: VCollapse 折叠面板

### Task 12: VTree 树形控件

### Task 13: VTreeSelect 树形选择器

---

## Phase 3: P2 数据展示组件 (data-display.js)

### Task 14: VTimeline 时间轴

### Task 15: VCalendar 日历

### Task 16: VCarousel 轮播

### Task 17: VStatistic 统计数值

### Task 18: VDescriptions 描述列表

---

## Phase 4: P2 导航组件 (navigation.js)

### Task 19: VPagination 分页

### Task 20: VSteps 步骤条

### Task 21: VAnchor 锚点

### Task 22: VAffix 固钉

### Task 23: VBackTop 回到顶部

---

## Phase 5: 最终演示

### Task 24: 创建 v2/examples 完整演示页面

**Files:**
- Create: `src/v2/examples/components-demo.html`
- Create: `src/v2/examples/components-demo.js`
- Create: `src/v2/examples/pages/Components/`

- [ ] **Step 1: 创建组件演示页面框架**
- [ ] **Step 2: 整合所有已实现的组件**
- [ ] **Step 3: 添加组件 API 文档展示**
- [ ] **Step 4: 使用 Playwright 进行端到端测试**
- [ ] **Step 5: 提交最终演示**

```bash
git add src/v2/examples/components-demo.html
git add src/v2/examples/components-demo.js
git commit -m "feat: add comprehensive components demo page"
```

---

## 测试验证流程

每个组件完成后：
1. 运行单元测试 `node tests/{component}.test.js`
2. 启动开发服务器 `npm run dev`
3. 在浏览器中访问演示页面
4. 使用 Playwright 运行浏览器测试 `npm run test:browser`

## 提交规范

- 每个组件独立提交
- 提交信息格式：`feat(component): add {ComponentName} with demo and tests`
- 包含：组件实现、CSS 样式、测试文件、演示页面、导出配置
