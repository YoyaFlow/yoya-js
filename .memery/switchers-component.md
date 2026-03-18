# VSwitchers 组件文档

## 概述

VSwitchers 是一个分段控制器组件（Segmented Control），用于在一组互斥选项中选择一个或多个选项。常用于视图切换、时间范围选择、筛选条件等场景。

## 特性

- **单选/多选模式** - 支持单选和多选两种模式
- **禁用支持** - 支持禁用整个控制器或单个选项
- **尺寸调整** - 支持 small/medium/large 三种尺寸
- **主题集成** - 使用主题变量，支持亮色/暗色主题
- **链式 API** - 所有方法支持链式调用

## 基础用法

```javascript
import { vSwitchers } from '../yoya/index.js';

// 基础单选
vSwitchers(s => {
  s.options(['日', '周', '月']);
  s.value('周');
  s.onChange((value) => {
    console.log('选中：', value);
  });
});

// 对象配置
vSwitchers(s => {
  s.options([
    { value: 'day', label: '日' },
    { value: 'week', label: '周' },
    { value: 'month', label: '月' },
  ]);
  s.value('week');
});
```

## API 方法

### 配置方法

| 方法 | 参数 | 说明 | 示例 |
|------|------|------|------|
| `options(arr)` | `Array` | 设置选项数组 | `s.options(['A', 'B', 'C'])` |
| `value(val)` | `string\|Array` | 设置/获取选中值 | `s.value('opt1')` |
| `multiple(bool)` | `boolean` | 设置多选模式 | `s.multiple(true)` |
| `disabled(bool)` | `boolean` | 设置禁用状态 | `s.disabled(true)` |
| `size(str)` | `string` | 设置尺寸 | `s.size('large')` |
| `onChange(fn)` | `function` | 设置变化事件回调 | `s.onChange(...)` |

### 样式方法

| 方法 | 参数 | 说明 |
|------|------|------|
| `background(color)` | `string` | 设置背景颜色 |
| `padding(value)` | `string` | 设置内边距 |
| `margin(value)` | `string` | 设置外边距 |
| `width(value)` | `string` | 设置宽度 |

## 选项格式

### 字符串简写

```javascript
s.options(['选项 A', '选项 B', '选项 C']);
// 等价于
s.options([
  { value: '选项 A', label: '选项 A', disabled: false },
  { value: '选项 B', label: '选项 B', disabled: false },
  { value: '选项 C', label: '选项 C', disabled: false },
]);
```

### 对象配置

```javascript
s.options([
  { value: 'opt1', label: '选项 1', disabled: false },
  { value: 'opt2', label: '选项 2', disabled: true }, // 禁用项
]);
```

## 使用示例

### 1. 基础单选

```javascript
vSwitchers(s => {
  s.options([
    { value: 'day', label: '日' },
    { value: 'week', label: '周' },
    { value: 'month', label: '月' },
  ]);
  s.value('week');
  s.onChange((value) => {
    console.log('选中：', value);
  });
});
```

### 2. 多选模式

```javascript
vSwitchers(s => {
  s.multiple(true);
  s.options([
    { value: 'apple', label: '苹果' },
    { value: 'banana', label: '香蕉' },
    { value: 'orange', label: '橙子' },
  ]);
  s.value(['apple', 'orange']);
  s.onChange((values) => {
    console.log('选中：', values);
  });
});
```

### 3. 带禁用项

```javascript
vSwitchers(s => {
  s.options([
    { value: 'opt1', label: '选项 1' },
    { value: 'opt2', label: '选项 2', disabled: true },
    { value: 'opt3', label: '选项 3' },
  ]);
  s.value('opt1');
});
```

### 4. 整体禁用

```javascript
vSwitchers(s => {
  s.options(['选项 A', '选项 B', '选项 C']);
  s.disabled(true);
});
```

### 5. 不同尺寸

```javascript
// 小尺寸
vSwitchers(s => {
  s.options(['小', '中', '大']);
  s.size('small');
});

// 中尺寸（默认）
vSwitchers(s => {
  s.options(['小', '中', '大']);
  s.size('medium');
});

// 大尺寸
vSwitchers(s => {
  s.options(['小', '中', '大']);
  s.size('large');
});
```

### 6. 在卡片中使用

```javascript
vCard(card => {
  card.vCardHeader('时间范围选择');
  card.vCardBody(body => {
    body.vSwitchers(s => {
      s.options([
        { value: 'today', label: '今日' },
        { value: 'week', label: '近 7 天' },
        { value: 'month', label: '近 30 天' },
      ]);
      s.value('week');
    });
  });
});
```

### 7. 块级模式（占满容器）

```javascript
vSwitchers(s => {
  s.options(['首页', '发现', '消息', '我的']);
  s.styles({ display: 'flex' });
  // 让每个选项平均分布
  s._items.forEach(item => {
    item.style('flex', '1');
  });
});
```

### 8. 动态更新选项

```javascript
const switchers = vSwitchers(s => {
  s.options(['选项 1', '选项 2', '选项 3']);
});

// 动态更新选项
switchers.options(['新选项 A', '新选项 B', '新选项 C']);
```

## 事件回调

`onChange` 回调函数参数：

**单选模式**：
```javascript
s.onChange((value, option, index) => {
  console.log('选中值：', value);      // 'opt1'
  console.log('选项对象：', option);   // { value: 'opt1', label: '选项 1' }
  console.log('索引：', index);        // 0
});
```

**多选模式**：
```javascript
s.onChange((values, option, index) => {
  console.log('选中值数组：', values); // ['opt1', 'opt3']
  console.log('点击的选项：', option);
  console.log('索引：', index);
});
```

## CSS 类

| 类名 | 说明 |
|------|------|
| `.yoya-switchers` | 基础容器类 |
| `.yoya-switchers__item` | 选项项类 |
| `.yoya-switchers__item--active` | 选中状态 |
| `.yoya-switchers__item--disabled` | 禁用状态 |
| `.yoya-switchers--disabled` | 容器禁用状态 |
| `.yoya-switchers--small` | 小尺寸 |
| `.yoya-switchers--medium` | 中尺寸 |
| `.yoya-switchers--large` | 大尺寸 |

## 尺寸规格

| 尺寸 | 内边距 | 字体大小 | 圆角 |
|------|--------|----------|------|
| small | 4px 8px | 12px | 3px |
| medium | 6px 8px | 14px | 4px |
| large | 8px 16px | 16px | 6px |

## 主题变量

VSwitchers 使用以下主题变量：

```css
/* 背景色 */
--yoya-bg-secondary      /* 容器背景 */
--yoya-bg                /* 选中项背景 */
--yoya-bg-hover          /* 悬停背景 */

/* 文本色 */
--yoya-text-primary      /* 主要文字 */
--yoya-text-secondary    /* 次要文字 */
--yoya-text-disabled     /* 禁用文字 */

/* 其他 */
--yoya-radius-sm/md      /* 圆角 */
--yoya-padding-xs/sm/md  /* 内边距 */
--yoya-gap-xs            /* 间距 */
--yoya-transition-fast   /* 过渡动画 */
```

## 注意事项

1. **单选模式下**，点击已选中的选项不会触发 `onChange` 事件
2. **多选模式下**，`value()` 方法返回数组，`onChange` 回调第一个参数也是数组
3. **禁用优先级**：容器禁用 > 选项禁用，容器禁用时所有选项都不可点击
4. **动态更新**：调用 `options()` 会重新渲染所有选项，选中状态会保留（如果值仍然存在）
