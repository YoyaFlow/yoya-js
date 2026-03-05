# 事件回调函数参数规范

## 统一规则

**所有事件回调函数使用单个对象参数**，通过解构获取需要的属性：

```javascript
// ✅ 推荐：解构需要的属性
vButton('提交').onClick(({event, target}) => {
  console.log('点击事件', event);
  console.log('按钮实例', target);
});

vInput().onChange(({event, value, oldValue, target}) => {
  console.log('旧值:', oldValue);
  console.log('新值:', value);
});

// 简化：只取需要的属性
vInput().onChange((e) => {
  console.log('值:', e.value);
  console.log('输入框:', e.target);
});
```

## 事件对象结构

```typescript
interface EventContext {
  event: Event | MouseEvent | KeyboardEvent;  // 原生事件对象
  target: Tag;                                 // 组件实例
  value?: any;                                 // 当前值（可选）
  oldValue?: any;                              // 旧值（可选）
  checked?: boolean;                           // 选中状态（可选）
  key?: string;                                // 按键（可选）
  code?: string;                               // 按键代码（可选）
  [key: string]: any;                          // 其他自定义属性
}
```

## 方法命名规范

**事件方法使用大驼峰命名（PascalCase）**：

| 事件类型 | 方法名 | 参数 |
|----------|--------|------|
| 点击 | `onClick` | `({event, target})` |
| 值变化 | `onChange` | `({event, value, oldValue, target})` |
| 输入 | `onInput` | `({event, value, target})` |
| 焦点 | `onFocus` | `({event, target})` |
| 失焦 | `onBlur` | `({event, target})` |
| 键盘 | `onKey` | `({event, key, code, target})` |
| 鼠标进入 | `onMouseEnter` | `({event, target})` |
| 鼠标离开 | `onMouseLeave` | `({event, target})` |
| 复制 | `onCopy` | `({event, value, target})` |

## 使用示例

### 点击事件

```javascript
// 完整解构
vButton('提交').onClick(({event, target}) => {
  console.log('点击事件', event);
  console.log('按钮实例', target);
});

// 简化写法
vButton('提交').onClick((e) => {
  console.log('按钮', e.target);
  console.log('事件', e.event);
});
```

### 值变化事件

```javascript
// 完整解构
vInput().onChange(({event, value, oldValue, target}) => {
  console.log('旧值:', oldValue);
  console.log('新值:', value);
  console.log('输入框:', target);
});

// 简化写法
vInput().onChange((e) => {
  console.log('值变化:', e.value);
});
```

### 输入事件

```javascript
// 完整解构
vInput().onInput(({event, value, target}) => {
  console.log('输入中:', value);
});

// 简化写法
vInput().onInput((e) => {
  console.log('输入:', e.value);
});
```

### 开关事件

```javascript
// 完整解构
vSwitch().onChange(({event, value, oldValue, target}) => {
  console.log('开关状态:', value);
});

// 简化写法
vSwitch().onChange((e) => {
  console.log('状态:', e.value);
});
```

### 键盘事件

```javascript
// 完整解构
vInput().onKey(({event, key, code, target}) => {
  console.log('按键:', key, '代码:', code);
});

// 简化写法
vInput().onKey((e) => {
  console.log('按键:', e.key);
});
```

### 焦点事件

```javascript
// 完整解构
vInput().onFocus(({event, target}) => {
  console.log('获得焦点', target);
});

// 简化写法
vInput().onFocus((e) => {
  console.log('焦点事件', e.event);
});
```

### 鼠标事件

```javascript
// 完整解构
div().onMouseEnter(({event, target}) => {
  console.log('鼠标进入', target);
});

// 简化写法
div().onMouseEnter((e) => {
  console.log('进入', e.target);
});
```

## 各组件统一 API

### 表单组件

```typescript
// VButton - 点击事件
vButton('提交').onClick((e: {
  event: MouseEvent;
  target: VButton;
}) => void);

// VInput - 值变化/输入事件
vInput().onChange((e: {
  event: Event;
  value: string;
  oldValue?: string;
  target: VInput;
}) => void);

vInput().onInput((e: {
  event: Event;
  value: string;
  target: VInput;
}) => void);

// VSelect - 值变化事件
vSelect().onChange((e: {
  event: Event;
  value: string;
  oldValue?: string;
  target: VSelect;
}) => void);

// VTextarea - 值变化/输入事件
vTextarea().onChange((e: {
  event: Event;
  value: string;
  oldValue?: string;
  target: VTextarea;
}) => void);

// VCheckbox - 值变化事件
vCheckbox('同意').onChange((e: {
  event: Event;
  value: boolean;
  oldValue?: boolean;
  target: VCheckbox;
}) => void);

// VSwitch - 值变化事件
vSwitch().onChange((e: {
  event: Event;
  value: boolean;
  oldValue?: boolean;
  target: VSwitch;
}) => void);
```

### 其他组件

```typescript
// VMenuItem - 点击事件
vMenuItem('菜单').onClick((e: {
  event: MouseEvent;
  target: VMenuItem;
}) => void);

// VCode - 复制事件
vCode().onCopy((e: {
  event: ClipboardEvent;
  value: string;
  target: VCode;
}) => void);
```

## 组件开发指南

### 基于 Tag 基类包装器

组件可以继承 Tag 基类的事件方法，无需额外封装：

```javascript
// VButton - 直接使用 Tag.onClick()
class VButton extends Tag {
  // onClick 已从 Tag 继承，无需重复定义
}

// VInput - 使用 Tag.onChangeValue() 并封装为 onChange
class VInput extends Tag {
  onChange(handler) {
    return this.onChangeValue(handler);  // 基于 Tag.onChangeValue
  }

  onInput(handler) {
    return this.onInputValue(handler);  // 基于 Tag.onInputValue
  }
}

// VCheckbox - 使用 Tag.onToggle() 并封装为 onChange
class VCheckbox extends Tag {
  onChange(handler) {
    return this.onToggle(handler);  // 基于 Tag.onToggle
  }
}

// VCode - 自定义事件包装
class VCode extends Tag {
  onCopy(handler) {
    this.on('copy', this._wrapHandler(handler, (e) => {
      return { value: this._codeContent };
    }));
    return this;
  }
}
```

### 自定义事件参数

如果组件需要传递额外的事件参数，可以在 `_wrapHandler` 中扩展：

```javascript
class VMenuItem extends Tag {
  onClick(handler) {
    this.on('click', this._wrapHandler(handler, (e) => {
      return {
        text: this.text(),
        icon: this._icon,
      };
    }));
    return this;
  }
}

// 使用
vMenuItem('菜单').onClick(({event, target, text, icon}) => {
  console.log('点击了:', text);
});
```

## 基础元素事件 API

```javascript
// 任何元素都可以使用 Tag 基类的事件方法
div().onClick((e) => {...});
div().onFocus((e) => {...});
div().onBlur((e) => {...});
div().onKey((e) => {...});
div().onMouseEnter((e) => {...});
div().onMouseLeave((e) => {...});

// 链式调用
div()
  .onClick((e) => console.log('点击', e.target))
  .onMouseEnter((e) => console.log('进入', e.target))
  .onMouseLeave((e) => console.log('离开', e.target));
```

## 好处

| 好处 | 说明 |
|------|------|
| 自描述性 | 属性名清晰表达含义 |
| 灵活性 | 只解构需要的属性 |
| 扩展性 | 可以轻松添加新属性 |
| 一致性 | 所有事件使用统一格式 |
| 避免混淆 | 不会搞混参数顺序 |
| 嵌套友好 | 使用 `e.value` 不会有命名冲突 |

## 对比

```javascript
// ❌ 旧方式：参数顺序不统一，容易混淆
vButton().onclick((e, btn) => {...});           // 两个参数
vInput().onchange((e, value, input) => {...});  // 三个参数
vSwitch().onchange((e, checked) => {...});      // 两个参数

// ✅ 新方式：统一单对象参数
vButton().onClick(({event, target}) => {...});   // 解构
vInput().onChange(({event, value, target}) => {...}); // 解构
vSwitch().onChange(({event, value, target}) => {...}); // 解构

// ✅ 简化写法（适合嵌套作用域）
vButton().onClick((e) => {...});               // e.target
vInput().onChange((e) => {...});               // e.value
vSwitch().onChange((e) => {...});              // e.value
```

## 嵌套作用域使用

在嵌套作用域中，使用 `e.xxx` 形式可避免命名冲突：

```javascript
// 多层嵌套时，使用 e.value 避免变量名冲突
vCard(c => {
  c.vCardBody(b => {
    b.child(vInput().onChange((e) => {
      // e.value 清晰明确
      console.log('输入 1:', e.value);
    }));
    b.child(vInput().onChange((e) => {
      // e.value 清晰明确
      console.log('输入 2:', e.value);
    }));
  });
});

// 解构形式适合简单场景
vInput().onChange(({value, target}) => {
  console.log('值:', value, '来自:', target);
});
```

## 迁移指南

### 从旧代码迁移

```javascript
// 旧代码 - VButton
onclick(handler) {
  this.on('click', handler);
  return this;
}
// ✅ 无需修改，已符合规范

// 旧代码 - VInput
onChange(handler) {
  if (this._inputEl) {
    this._inputEl.on('change', handler);
  }
  return this;
}
// ❌ 需要修改为传递值
onchange(handler) {
  this._inputEl.on('change', (e) => {
    const value = this.value();
    handler(value, e);
  });
  return this;
}

// 旧代码 - VSwitch
onChange(handler) {
  this._onChangeHandler = handler;
  return this;
}
// ❌ 需要修改为直接绑定
onchange(handler) {
  this._onChangeHandler = handler;  // 保留，因为点击时调用
  return this;
}
```

## 最佳实践

1. **优先使用 `this.on()`** - 直接绑定事件，无需额外存储
2. **值变化事件传递值** - 让用户方便获取变化后的值
3. **保持参数一致** - 同类组件事件参数保持一致
4. **文档标注参数** - 在类型定义中标注事件回调参数

## 类型定义

```typescript
// 事件回调类型定义
interface VButton {
  onclick(handler: (e: MouseEvent) => void): this;
}

interface VInput {
  onchange(handler: (value: string, e: Event) => void): this;
  oninput(handler: (value: string, e: Event) => void): this;
}

interface VSelect {
  onchange(handler: (value: string, e: Event) => void): this;
}

interface VCheckbox {
  onchange(handler: (checked: boolean, e: Event) => void): this;
}

interface VSwitch {
  onchange(handler: (checked: boolean) => void): this;
}

interface VMenuItem {
  onclick(handler: (item: VMenuItem, e: MouseEvent) => void): this;
}

interface VCode {
  oncopy(handler: (code: string) => void): this;
}
```

## 相关文件

- `src/yoya/components/button.js` - 按钮组件
- `src/yoya/components/form.js` - 表单组件
- `src/yoya/components/menu.js` - 菜单组件
- `src/yoya/components/code.js` - 代码组件
- `src/yoya/components/index.d.ts` - 类型定义
