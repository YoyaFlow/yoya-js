# 事件处理规范

## 问题背景

当前各组件的事件处理方式不一致，存在以下问题：

1. **事件存储方式不统一**：有的用 `_onclick`，有的用 `_onChangeHandler`，有的直接用 `this.on()`
2. **事件参数传递不统一**：有的传递原生事件对象，有的传递自定义值，有的不传参数
3. **事件命名不统一**：有的用 `onclick`，有的用 `onClick`，有的用 `on('click')`

## 统一规则

### 1. 事件方法命名规范

统一使用 **小写驼峰** 命名，与 HTML 事件属性一致：

```javascript
// ✅ 推荐
onclick(handler)
onchange(handler)
oninput(handler)
onfocus(handler)
onblur(handler)

// ❌ 不推荐
onClick(handler)
onChange(handler)
onInput(handler)
```

### 2. 事件存储规范

统一使用 `_eventHandlers` 对象存储所有事件回调：

```javascript
class VComponent extends Tag {
  constructor(setup = null) {
    super('div', setup);

    // 统一存储所有事件回调
    this._eventHandlers = {
      click: null,
      change: null,
      input: null,
    };
  }
}
```

### 3. 事件绑定规范

**优先使用 `this.on()` 直接绑定**，无需额外存储：

```javascript
// ✅ 推荐：直接使用 this.on() 绑定
class VButton extends Tag {
  onclick(handler) {
    this.on('click', handler);
    return this;
  }
}

// ❌ 不推荐：额外存储回调函数
class VButton extends Tag {
  constructor() {
    this._onclick = null;  // 不需要
  }
  onclick(handler) {
    this._onclick = handler;  // 不需要
  }
}
```

### 4. 事件参数传递规范

#### 4.1 简单事件 - 传递原生事件对象

对于简单事件，直接传递原生事件对象：

```javascript
// onclick - 传递 MouseEvent
onclick(handler) {
  this.on('click', (e) => handler(e));
}

// 使用
vButton('提交').onclick((e) => {
  console.log('点击事件', e);
});
```

#### 4.2 值变化事件 - 传递值 + 原生事件

对于值变化的事件，传递 **值作为第一个参数**，原生事件作为第二个参数：

```javascript
// onchange - 传递 value + Event
onchange(handler) {
  this._inputEl.on('change', (e) => {
    const value = e._boundElement?.value || this._value;
    handler(value, e);
  });
  return this;
}

// 使用
vInput().onchange((value, e) => {
  console.log('值变化:', value);
  console.log('原生事件:', e);
});
```

#### 4.3 特殊事件 - 只传递业务数据

对于特殊业务事件，只传递业务相关的值：

```javascript
// VSwitch - 只传递 checked 状态
onchange(handler) {
  this._switchEl.on('click', () => {
    if (!this.hasState('disabled')) {
      const newChecked = !this._checked;
      this.setState('checked', newChecked);
      handler(newChecked);  // 只传递业务值
    }
  });
  return this;
}

// 使用
vSwitch().onchange((checked) => {
  console.log('开关状态:', checked);
});
```

### 5. 各组件事件规范

#### 5.1 按钮 (VButton)

```javascript
onclick(handler) {
  this.on('click', handler);
  return this;
}

// 使用
vButton('提交').onclick((e) => {
  console.log('点击了按钮', e);
});
```

#### 5.2 输入框 (VInput)

```javascript
// 值变化 - 传递值 + 事件
onchange(handler) {
  this._inputEl.on('change', (e) => {
    const value = this.value();
    handler(value, e);
  });
  return this;
}

// 输入 - 传递值 + 事件
oninput(handler) {
  this._inputEl.on('input', (e) => {
    const value = e._boundElement?.value || this._value;
    handler(value, e);
  });
  return this;
}

// 使用
vInput().onchange((value, e) => {
  console.log('值变化:', value);
});

vInput().oninput((value, e) => {
  console.log('输入中:', value);
});
```

#### 5.3 选择框 (VSelect)

```javascript
onchange(handler) {
  this._selectEl.on('change', (e) => {
    const value = this.value();
    handler(value, e);
  });
  return this;
}

// 使用
vSelect().onchange((value, e) => {
  console.log('选择了:', value);
});
```

#### 5.4 文本域 (VTextarea)

```javascript
onchange(handler) {
  this._textareaEl.on('change', (e) => {
    const value = this.value();
    handler(value, e);
  });
  return this;
}

oninput(handler) {
  this._textareaEl.on('input', (e) => {
    const value = this.value();
    handler(value, e);
  });
  return this;
}
```

#### 5.5 复选框 (VCheckbox)

```javascript
onchange(handler) {
  this._checkboxEl.on('change', (e) => {
    const checked = this.checked();
    handler(checked, e);
  });
  return this;
}

// 使用
vCheckbox('同意').onchange((checked, e) => {
  console.log('复选框:', checked);
});
```

#### 5.6 开关 (VSwitch)

```javascript
onchange(handler) {
  this._switchEl.on('click', () => {
    if (!this.hasState('disabled')) {
      const newChecked = !this._checked;
      this.setState('checked', newChecked);
      handler(newChecked);  // 只传递业务值
    }
  });
  return this;
}

// 使用
vSwitch().onchange((checked) => {
  console.log('开关:', checked);
});
```

#### 5.7 菜单项 (VMenuItem)

```javascript
onclick(handler) {
  this.on('click', (e) => {
    handler(this, e);  // 传递实例 + 事件
  });
  return this;
}

// 使用
vMenuItem('菜单').onclick((item, e) => {
  console.log('点击了菜单项', item);
});
```

#### 5.8 代码块 (VCode)

```javascript
oncopy(handler) {
  this._onCopy = handler;  // 特殊：内部回调
  return this;
}

// 使用
vCode().oncopy((code) => {
  console.log('代码已复制:', code);
});
```

## 参数传递规则总结

| 事件类型 | 参数 1 | 参数 2 | 说明 |
|----------|--------|--------|------|
| onclick | MouseEvent | - | 简单点击事件 |
| onchange (表单) | value | Event | 值变化事件 |
| oninput | value | Event | 输入事件 |
| onchange (VSwitch) | checked | - | 开关状态变化 |
| onclick (VMenuItem) | this (实例) | Event | 菜单项点击 |
| oncopy | codeContent | - | 复制完成 |

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
