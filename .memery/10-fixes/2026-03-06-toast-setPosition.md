# toast.setPosition 方法缺失修复

## 问题
`message.html` 页面中"消息位置"部分的按钮点击无效，原因是 `toast.setPosition()` 方法虽然定义在 `VMessageManager` 类中，但没有添加到 `toast` 函数对象上。

## 解决方案

### 1. 修改 `src/yoya/components/message.js`
在第 367 行添加：
```javascript
toast.setPosition = (position) => vMessageManager.setPosition(position);
```

### 2. 修改 `src/yoya/components/index.d.ts`
在第 229 行添加类型定义：
```typescript
export function setPosition(position: MessagePosition): void;
```

## 验证
- ✅ TypeScript 类型检查通过
- ✅ `toast.setPosition()` 方法现在可以正常使用

## 相关文件
- `src/yoya/components/message.js`
- `src/yoya/components/index.d.ts`
- `src/v1/examples/message.js`
