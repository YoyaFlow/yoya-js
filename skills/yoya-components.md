# yoya-components

YoyaJS UI 组件使用技能。当用户需要使用 Card、Menu、Message、Code 等 UI 组件时触发此技能。

## 触发条件

- 用户需要使用 Card、Menu、Message、Code 等组件
- 用户需要创建卡片、菜单、消息提示等 UI 元素
- 用户需要了解组件的 API 和用法

## 组件概览

| 组件 | 用途 | 导入 |
|------|------|------|
| **Card** | 卡片容器 | `vCard`, `vCardHeader`, `vCardBody`, `vCardFooter` |
| **Menu** | 菜单 | `vMenu`, `vMenuItem`, `vDropdownMenu`, `vContextMenu` |
| **Message** | 消息提示 | `toast`, `vMessage` |
| **Button** | 按钮 | `vButton` |
| **Code** | 代码展示 | `vCode`, `codeBlock` |
| **Detail** | 详情展示 | `vDetail`, `vDetailItem` |
| **Field** | 可编辑字段 | `vField` |

---

## Card 卡片组件

### 基础用法

```javascript
import { vCard, vCardHeader, vCardBody, vCardFooter, button, toast } from './yoya/index.js';

vCard(c => {
  c.cardHeader('卡片标题');
  c.cardBody('卡片内容区域');
  c.cardFooter(btn => {
    btn.button('操作').onclick(() => {
      toast.info('点击了操作按钮');
    });
  });
}).bindTo('#app');
```

### 完整示例

```javascript
vCard(c => {
  c.cardHeader(h => {
    h.h3('用户信息');
  });
  c.cardBody(b => {
    b.div('姓名：张三');
    b.div('邮箱：zhangsan@example.com');
    b.div('电话：13800138000');
  });
  c.cardFooter(f => {
    f.button('编辑').onclick(() => toast.info('编辑'));
    f.button('删除').onclick(() => toast.error('删除'));
  });
}).bindTo('#app');
```

### 卡片状态

```javascript
const card = vCard(c => {
  c.cardHeader('标题');
  c.cardBody('内容');
});

// 设置阴影
card.style('boxShadow', '0 4px 12px rgba(0,0,0,0.15)');

// 设置边框
card.style('border', '1px solid #e0e0e0');
```

---

## Menu 菜单组件

### 基础菜单

```javascript
import { vMenu, vMenuItem, vMenuDivider, toast } from './yoya/index.js';

vMenu(m => {
  m.item(it => {
    it.text('📋 菜单项 1')
      .onclick(() => toast.info('菜单项 1'));
  });
  m.item(it => {
    it.text('📁 菜单项 2')
      .onclick(() => toast.info('菜单项 2'));
  });
  m.divider();
  m.item(it => {
    it.text('⚙️ 设置')
      .onclick(() => toast.info('设置'));
  });
}).bindTo('#app');
```

### 带图标的菜单

```javascript
vMenu(m => {
  m.item(it => {
    it.icon('<span>📄</span>');
    it.text('新建');
    it.shortcut('Ctrl+N');
    it.onclick(() => toast.info('新建'));
  });
  m.item(it => {
    it.icon('<span>📂</span>');
    it.text('打开');
    it.shortcut('Ctrl+O');
    it.onclick(() => toast.info('打开'));
  });
  m.divider();
  m.item(it => {
    it.icon('<span>🗑️</span>');
    it.text('删除');
    it.danger();
    it.onclick(() => toast.error('删除'));
  });
});
```

### 菜单项状态

```javascript
// 激活状态
vMenuItem('首页')
  .active();

// 禁用状态
vMenuItem('不可用')
  .disabled();

// 危险操作
vMenuItem('删除')
  .danger();

// 可悬停
vMenuItem('悬停项')
  .hoverable();
```

### 带分组的菜单

```javascript
vMenu(m => {
  m.group(g => {
    g.label('文件操作');
    g.item(it => {
      it.text('新建');
      it.onclick(() => toast.info('新建'));
    });
    g.item(it => {
      it.text('打开');
      it.onclick(() => toast.info('打开'));
    });
  });
  m.divider();
  m.group(g => {
    g.label('编辑');
    g.item(it => {
      it.text('复制');
      it.onclick(() => toast.info('复制'));
    });
    g.item(it => {
      it.text('粘贴');
      it.onclick(() => toast.info('粘贴'));
    });
  });
});
```

### 下拉菜单

```javascript
import { vDropdownMenu, vMenu, toast } from './yoya/index.js';

vDropdownMenu(d => {
  d.trigger('点击我');
  d.menuContent(vMenu(m => {
    m.item(it => {
      it.text('选项 1');
      it.onclick(() => toast.info('选项 1'));
    });
    m.item(it => {
      it.text('选项 2');
      it.onclick(() => toast.info('选项 2'));
    });
  }));
  d.closeOnClickOutside();
}).bindTo('#app');
```

### 右键菜单

```javascript
import { vContextMenu, vMenu, toast } from './yoya/index.js';

// 创建右键菜单
const ctxMenu = vContextMenu(ctx => {
  ctx.menuContent(vMenu(m => {
    m.item(it => {
      it.text('✏️ 编辑');
      it.onclick(() => {
        toast.info('编辑');
        ctxMenu.hide();
      });
    });
    m.item(it => {
      it.text('🗑️ 删除');
      it.danger();
      it.onclick(() => {
        toast.error('删除');
        ctxMenu.hide();
      });
    });
  }));
});

// 绑定到目标元素
ctxMenu.target(document.getElementById('target'));
```

### 水平菜单

```javascript
vMenu(m => {
  m.horizontal();  // 水平布局
  m.item(it => {
    it.text('首页');
    it.active();
  });
  m.item(it => {
    it.text('产品');
  });
  m.item(it => {
    it.text('关于');
  });
}).bindTo('#app');
```

---

## Message 消息组件

### toast 快捷方法

```javascript
import { toast } from './yoya/index.js';

// 成功消息
toast.success('操作成功！');

// 错误消息
toast.error('操作失败，请重试！');

// 警告消息
toast.warning('请注意此操作！');

// 信息消息
toast.info('这是一个普通信息！');
```

### 自定义时长

```javascript
// 3 秒后自动关闭（默认）
toast.info('消息内容');

// 5 秒后自动关闭
toast.info('消息内容', 'info', 5000);

// 不自动关闭
toast.info('消息内容', 'info', 0);

// 手动关闭
const id = toast.info('消息内容', 'info', 0);
toast.close(id);
```

### 使用消息容器

```javascript
import { vMessageContainer } from './yoya/index.js';

// 创建容器
const container = vMessageContainer('top-right');  // top-right, top-left, bottom-right, bottom-left, top, bottom
container.bindTo(document.body);

// 发送消息
container.success('成功！');
container.error('失败！');
container.warning('警告！');
container.info('信息！');

// 清空所有消息
container.clear();
```

---

## vButton 按钮组件

### 基础用法

```javascript
import { vButton, toast } from './yoya/index.js';

// 基础按钮
vButton('点击我').onclick(() => {
  toast.info('按钮被点击了');
}).bindTo('#app');
```

### 按钮类型

```javascript
// 主要按钮
vButton('主要按钮')
  .type('primary');

// 次要按钮
vButton('次要按钮')
  .type('secondary');

// 危险按钮
vButton('危险按钮')
  .type('danger');

// 幽灵按钮
vButton('幽灵按钮')
  .type('ghost');
```

### 按钮状态

```javascript
const btn = vButton('按钮');

// 禁用
btn.disabled(true);

// 加载中
btn.loading(true);

// 设置图标
btn.icon('<span>★</span>');
```

### 按钮尺寸

```javascript
// 大号按钮
vButton('大按钮').size('large');

// 小号按钮
vButton('小按钮').size('small');
```

---

## Code 代码展示组件

### 基础用法

```javascript
import { vCode, toast } from './yoya/index.js';

vCode(c => {
  c.content(`
const hello = (name) => {
  console.log('Hello, ' + name);
};
hello('World');
  `);
  c.title('💻 JavaScript 示例');
  c.onCopy(() => {
    toast.success('代码已复制');
  });
}).bindTo('#app');
```

### 不带标题栏

```javascript
vCode(c => {
  c.content('console.log("Hello");');
  c.showCopyButton(false);      // 隐藏复制按钮
  c.showLineNumbers(false);     // 隐藏行号
}).bindTo('#app');
```

### codeBlock 简化组件

```javascript
import { codeBlock, toast } from './yoya/index.js';

// 快速创建带标题的代码块
codeBlock('示例代码', `const x = 1;`).bindTo('#app');
```

---

## Detail 详情展示组件

### 基础用法

```javascript
import { vDetail, vDetailItem } from './yoya/index.js';

vDetail(d => {
  d.item(i => {
    i.label('姓名');
    i.content('张三');
  });
  d.item(i => {
    i.label('邮箱');
    i.content('zhangsan@example.com');
  });
  d.item(i => {
    i.label('电话');
    i.content('13800138000');
  });
}).bindTo('#app');
```

### 垂直布局

```javascript
vDetail(d => {
  d.layout('vertical');
  d.item(i => {
    i.label('姓名');
    i.content('张三');
  });
  d.item(i => {
    i.label('简介');
    i.content('这是一段详细的个人介绍...');
  });
});
```

---

## Field 可编辑字段组件

### 基础用法

```javascript
import { vField, toast } from './yoya/index.js';

vField(f => {
  f.value('zhangsan');
  f.showContent(el => el.text('用户名：张三'));
  f.editContent((el, setValue) => {
    // 创建输入框
    const input = document.createElement('input');
    input.value = '张三';
    input.style.cssText = 'flex: 1; font-size: inherit; border: none; outline: none;';
    el.child(input);
    // 保存值
    setValueFn = (v) => setValue(v);
    input.oninput = () => setValueFn(input.value);
  });
  f.onSave((data) => {
    toast.success(`保存：${data.value}`);
    return Promise.resolve(); // 支持异步保存
  });
}).bindTo('#app');
```

### 显示/编辑模式

```javascript
vField(f => {
  // 显示内容
  f.showContent(el => {
    el.text('张三');
  });

  // 编辑内容
  f.editContent((el, setValue) => {
    el.input(i => {
      i.type('text');
      i.value('张三');
      i.style('flex', '1');
      // 自动保存
      i.on('input', () => setValue(i.value()));
    });
  });

  // 保存事件
  f.onSave(({ value, oldValue }) => {
    console.log('从', oldValue, '保存到', value);
  });

  // 变化事件
  f.onChange(({ value }) => {
    console.log('值变化：', value);
  });
});
```

### 状态控制

```javascript
const field = vField(...);

// 禁用
field.disabled(true);

// 加载中（保存时）
field.loading(true);

// 手动进入/退出编辑
field.editing(true);
field.editing(false);

// 设置值
field.value('新值');

// 获取值
const val = field.value();
```

### 自动保存模式

```javascript
vField(f => {
  f.autoSave(true);  // 开启自动保存
  f.showContent(el => el.text('显示内容'));
  f.editContent((el, setValue) => {
    el.input(i => {
      i.on('input', () => setValue(i.value()));
    });
  });
  f.onSave(({ value }) => {
    // 自动触发保存
  });
});
```

---

## 组件组合示例

### 用户信息卡片

```javascript
import { vCard, vDetail, vButton, hstack, toast } from './yoya/index.js';

vCard(c => {
  c.cardHeader('用户信息');
  c.cardBody(b => {
    b.vDetail(d => {
      d.item(i => { i.label('姓名'); i.content('张三'); });
      d.item(i => { i.label('邮箱'); i.content('zhangsan@example.com'); });
      d.item(i => { i.label('手机'); i.content('13800138000'); });
      d.item(i => { i.label('地址'); i.content('北京市朝阳区'); });
    });
  });
  c.cardFooter(f => {
    hstack(h => {
      h.gap('12px');
      h.button('编辑').onclick(() => toast.info('编辑'));
      h.button('删除').type('danger').onclick(() => toast.error('删除'));
    });
  });
}).bindTo('#app');
```

### 设置面板

```javascript
import { vCard, vMenu, toast } from './yoya/index.js';

vCard(c => {
  c.cardHeader('设置');
  c.cardBody(b => {
    b.vMenu(m => {
      m.item(it => {
        it.text('👤 个人资料');
        it.onclick(() => toast.info('个人资料'));
      });
      m.item(it => {
        it.text('🔒 账户安全');
        it.onclick(() => toast.info('账户安全'));
      });
      m.item(it => {
        it.text('🔔 通知设置');
        it.onclick(() => toast.info('通知设置'));
      });
      m.divider();
      m.item(it => {
        it.text('🌐 语言设置');
        it.onclick(() => toast.info('语言设置'));
      });
    });
  });
}).bindTo('#app');
```

---

## API 方法汇总

### vCard
- `cardHeader(setup)` - 卡片头部
- `cardBody(setup)` - 卡片内容
- `cardFooter(setup)` - 卡片底部

### vMenu
- `item(setup)` - 添加菜单项
- `divider()` - 添加分割线
- `group(setup)` - 添加菜单组
- `horizontal()` - 水平布局

### vMenuItem
- `text(str)` - 设置文本
- `icon(html)` - 设置图标
- `shortcut(str)` - 设置快捷键
- `onclick(fn)` - 点击事件
- `active()` - 激活状态
- `disabled()` - 禁用状态
- `danger()` - 危险样式
- `hoverable()` - 可悬停

### toast
- `success(msg, duration)` - 成功消息
- `error(msg, duration)` - 错误消息
- `warning(msg, duration)` - 警告消息
- `info(msg, duration)` - 信息消息
- `close(id)` - 关闭指定消息

### vCode
- `content(str)` - 代码内容
- `title(str)` - 标题
- `language(str)` - 语言类型
- `showLineNumbers(bool)` - 显示行号
- `showCopyButton(bool)` - 显示复制按钮
- `onCopy(fn)` - 复制回调

---

## 注意事项

1. **Menu 组件的 item 方法接受 setup 函数**，在函数中配置菜单项
2. **toast 消息默认 3 秒自动关闭**，传入 0 可禁止自动关闭
3. **Card 组件的 header/body/footer 都支持 setup 函数或字符串**
4. **ContextMenu 需要手动调用 hide() 方法关闭**
