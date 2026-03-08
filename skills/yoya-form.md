# yoya-form

Yoya.Basic 表单组件使用技能。当用户需要创建表单、使用输入框、选择器、复选框等表单组件时触发此技能。

## 触发条件

- 用户需要创建表单
- 用户需要使用输入框、选择器、复选框等组件
- 用户需要日期时间选择器
- 用户需要表单验证或交互

## 表单组件概览

| 组件 | 用途 | 示例 |
|------|------|------|
| `vForm` | 表单容器 | `vForm(f => {...})` |
| `vInput` | 输入框 | 文本、密码、邮箱等 |
| `vTextarea` | 多行文本 | 长文本输入 |
| `vSelect` | 下拉选择 | 单选下拉框 |
| `vCheckbox` | 复选框 | 单项选择 |
| `vCheckboxes` | 复选框组 | 多项选择 |
| `vSwitch` | 开关 | 是/否切换 |
| `vTimer` | 日期选择器 | 日期、时间、日期时间 |
| `vTimer2` | 日期范围选择器 | 开始 - 结束日期 |

## vForm 表单容器

### 基础用法

```javascript
import { vForm, vInput, button, toast } from './yoya/index.js';

vForm(form => {
  // 输入框
  form.input(i => {
    i.type('text');
    i.placeholder('请输入用户名');
    i.id('username');
  });

  // 密码框
  form.input(i => {
    i.type('password');
    i.placeholder('请输入密码');
    i.id('password');
  });

  // 提交按钮
  form.button('登录').onclick(() => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    toast.success(`登录：${username}`);
  });
}).bindTo('#app');
```

## vInput 输入框

### 基础用法

```javascript
import { vInput } from './yoya/index.js';

// 文本输入
vInput(i => {
  i.type('text');
  i.placeholder('请输入...');
  i.value('默认值');
}).bindTo('#app');

// 密码输入
vInput(i => {
  i.type('password');
  i.placeholder('请输入密码');
}).bindTo('#app');

// 邮箱输入
vInput(i => {
  i.type('email');
  i.placeholder('请输入邮箱');
}).bindTo('#app');

// 数字输入
vInput(i => {
  i.type('number');
  i.min(0);
  i.max(100);
  i.step(1);
}).bindTo('#app');
```

### 带标签的输入框

```javascript
import { div, label, vInput } from './yoya/index.js';

div(d => {
  d.label(l => {
    l.for('username');
    l.text('用户名：');
  });
  d.input(i => {
    i.id('username');
    i.type('text');
    i.placeholder('请输入用户名');
  });
}).bindTo('#app');
```

### 输入框状态

```javascript
const input = vInput(i => {
  i.type('text');
  i.placeholder('请输入...');
});

// 禁用
input.disabled(true);

// 只读
input.readonly(true);

// 错误状态
input.error(true);

// 设置值
input.value('新值');

// 获取值
const val = input.value();
```

## vTextarea 多行文本

```javascript
import { vTextarea } from './yoya/index.js';

vTextarea(t => {
  t.placeholder('请输入描述...');
  t.rows(5);           // 行数
  t.maxLength(500);    // 最大字符数
  t.value('默认内容');
}).bindTo('#app');
```

## vSelect 下拉选择

### 基础用法

```javascript
import { vSelect, vOption } from './yoya/index.js';

vSelect(s => {
  s.option(o => {
    o.value('');
    o.text('请选择');
  });
  s.option(o => {
    o.value('1');
    o.text('选项 1');
  });
  s.option(o => {
    o.value('2');
    o.text('选项 2');
  });
  s.option(o => {
    o.value('3');
    o.text('选项 3');
  });

  // 默认选中
  s.value('2');

  // 变化事件
  s.onChange(val => {
    console.log('选中：', val);
  });
}).bindTo('#app');
```

### 简化选项

```javascript
vSelect(s => {
  // 快速添加选项
  s.options([
    { value: 'apple', label: '苹果' },
    { value: 'banana', label: '香蕉' },
    { value: 'orange', label: '橙子' },
  ]);

  s.value('banana');
  s.onChange(val => {
    console.log('选中：', val);
  });
}).bindTo('#app');
```

## vCheckboxes 复选框组

### 多选模式

```javascript
import { vCheckboxes } from './yoya/index.js';

vCheckboxes(cb => {
  cb.options([
    { value: 'apple', label: '苹果' },
    { value: 'banana', label: '香蕉' },
    { value: 'orange', label: '橙子' },
  ]);
  cb.multiple(true);           // 多选模式
  cb.value(['apple', 'banana']);
  cb.onChange(values => {
    console.log('选中：', values);
  });
}).bindTo('#app');
```

### 单选模式

```javascript
vCheckboxes(cb => {
  cb.options([
    { value: 'red', label: '红色' },
    { value: 'green', label: '绿色' },
    { value: 'blue', label: '蓝色' },
  ]);
  cb.multiple(false);          // 单选模式
  cb.value('red');
  cb.onChange(value => {
    console.log('选中：', value);
  });
}).bindTo('#app');
```

### 布局方式

```javascript
// 垂直排列（默认）
vCheckboxes(cb => {
  cb.options(options);
  cb.layout('column');
});

// 水平排列
vCheckboxes(cb => {
  cb.options(options);
  cb.layout('row');
});

// 网格布局
vCheckboxes(cb => {
  cb.options(options);
  cb.layout('grid');
  cb.columns(3);  // 3 列
});
```

## vSwitch 开关

```javascript
import { vSwitch } from './yoya/index.js';

vSwitch(s => {
  s.checked(true);             // 默认开启
  s.onChange(checked => {
    console.log('开关状态：', checked);
  });
}).bindTo('#app');
```

## vTimer 日期时间选择器

### 日期选择

```javascript
import { vTimer } from './yoya/index.js';

// 日期选择器
vTimer(t => {
  t.type('date');              // 默认值
  t.value('2024-03-15');
  t.onChange(value => {
    console.log('选中日期：', value);
  });
}).bindTo('#app');
```

### 日期时间选择

```javascript
// 日期时间选择器
vTimer(t => {
  t.type('datetime-local');
  t.value('2024-03-15T14:30');
  t.onChange(value => {
    console.log('选中：', value);
  });
});

// 时间选择器
vTimer(t => {
  t.type('time');
  t.value('14:30');
});

// 月份选择器
vTimer(t => {
  t.type('month');
  t.value('2024-03');
});

// 周选择器
vTimer(t => {
  t.type('week');
  t.value('2024-W11');
});
```

### 限制范围

```javascript
vTimer(t => {
  t.type('date');
  t.min('2024-01-01');
  t.max('2024-12-31');
  t.value('2024-06-01');
});
```

## vTimer2 日期范围选择器

```javascript
import { vTimer2 } from './yoya/index.js';

vTimer2(t2 => {
  t2.type('date');
  t2.value({
    start: '2024-03-01',
    end: '2024-03-31'
  });
  t2.onChange(range => {
    console.log('日期范围：', range.start, '-', range.end);
  });
}).bindTo('#app');
```

### 限制范围

```javascript
vTimer2(t2 => {
  t2.type('date');
  t2.startMin('2024-01-01');
  t2.startMax('2024-12-31');
  t2.endMin('2024-01-01');
  t2.endMax('2024-12-31');
  // 或者使用简化的 min/max
  t2.min('2024-01-01');
  t2.max('2024-12-31');
});
```

## 完整表单示例

### 用户注册表单

```javascript
import { vForm, vInput, vSelect, vCheckboxes, vTimer, button, vstack, toast } from './yoya/index.js';

vForm(form => {
  // 用户名
  form.input(i => {
    i.type('text');
    i.placeholder('请输入用户名');
    i.id('username');
  });

  // 邮箱
  form.input(i => {
    i.type('email');
    i.placeholder('请输入邮箱');
    i.id('email');
  });

  // 密码
  form.input(i => {
    i.type('password');
    i.placeholder('请输入密码');
    i.id('password');
  });

  // 确认密码
  form.input(i => {
    i.type('password');
    i.placeholder('请确认密码');
    i.id('confirmPassword');
  });

  // 性别
  form.select(s => {
    s.options([
      { value: '', label: '请选择' },
      { value: 'male', label: '男' },
      { value: 'female', label: '女' },
    ]);
    s.id('gender');
  });

  // 爱好
  form.div(div => {
    div.text('爱好：');
  });
  form.vCheckboxes(cb => {
    cb.options([
      { value: 'reading', label: '阅读' },
      { value: 'sports', label: '运动' },
      { value: 'music', label: '音乐' },
    ]);
    cb.multiple(true);
  });

  // 生日
  form.vTimer(t => {
    t.type('date');
    t.placeholder('请选择生日');
  });

  // 提交按钮
  form.button('注册').onclick(() => {
    // 表单验证
    const data = {
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      confirmPassword: document.getElementById('confirmPassword').value,
      gender: document.getElementById('gender').value,
    };

    if (!data.username || !data.password) {
      toast.error('请填写必填项');
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error('两次密码不一致');
      return;
    }

    toast.success('注册成功');
  });
}).bindTo('#app');
```

## API 方法汇总

### vInput
- `type(str)` - 设置类型
- `value(val)` - 设置/获取值
- `placeholder(str)` - 设置占位符
- `disabled(bool)` - 禁用/启用
- `readonly(bool)` - 只读/可编辑
- `error(bool)` - 错误状态
- `min(val)` / `max(val)` - 最小/最大值
- `onChange(fn)` - 变化事件

### vSelect
- `options(arr)` - 设置选项数组
- `value(val)` - 设置/获取值
- `disabled(bool)` - 禁用/启用
- `error(bool)` - 错误状态
- `onChange(fn)` - 变化事件

### vCheckboxes
- `options(arr)` - 设置选项数组
- `value(val)` - 设置/获取值
- `multiple(bool)` - 单选/多选模式
- `layout(str)` - 布局：column, row, grid
- `columns(num)` - grid 布局的列数
- `disabled(bool)` - 禁用/启用
- `onChange(fn)` - 变化事件

### vTimer
- `type(str)` - 类型：date, datetime-local, time, month, week
- `value(val)` - 设置/获取值
- `min(val)` / `max(val)` - 最小/最大值
- `disabled(bool)` - 禁用/启用
- `onChange(fn)` - 变化事件

### vTimer2
- `type(str)` - 类型
- `value(obj)` - 设置 { start, end }
- `min(val)` / `max(val)` - 范围限制
- `startMin(val)` / `startMax(val)` - 开始日期限制
- `endMin(val)` / `endMax(val)` - 结束日期限制
- `onChange(fn)` - 变化事件

## 注意事项

1. **表单元素需要配合 label 使用时**，确保 `for` 属性与 input 的 `id` 匹配
2. **vCheckboxes 的 value 在多选时是数组**，单选时是单个值
3. **vTimer2 的 value 是对象** { start, end }
4. **表单验证建议在提交时进行**，可以配合 toast 显示错误信息
