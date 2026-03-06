# toast API 重构 - 更简洁的使用方式

## 问题
原 API 设计不够简洁：
- `toast('消息', 'info', 3000)` - 参数顺序不直观，第二个参数类型冗余
- `toast.info('消息', 'info', 3000)` - 便捷方法也需要冗余参数

## 新设计

### 1. 便捷方法（最简洁）
```javascript
toast.success('操作成功！')
toast.error('操作失败！')
toast.warning('请注意！')
toast.info('普通信息')

// 带时长
toast.info('2 秒后关闭', 2000)
```

### 2. 配置对象（推荐，最灵活）
```javascript
toast('消息内容', {
  type: 'success',
  duration: 5000,
  position: 'top-center'
})

// 便捷方法也支持配置对象
toast.success('成功！', { duration: 5000, position: 'bottom-right' })
```

### 3. 兼容旧 API
```javascript
toast('消息', 'info', 3000)  // 仍然可用
```

## 实现改动

### message.js
```javascript
class VMessageManager {
  call = (content, typeOrOptions = 'info', duration = 3000) => {
    let type = typeOrOptions;
    let position = this._position;

    if (typeof typeOrOptions === 'object') {
      type = typeOrOptions.type || 'info';
      duration = typeOrOptions.duration ?? 3000;
      position = typeOrOptions.position || this._position;
    }

    const container = this._recreateContainerIfNeeded(position);
    return container.add(content, type, duration);
  };
}

function toast(content, typeOrOptions = 'info', duration = 3000) {
  return vMessageManager.call(content, typeOrOptions, duration);
}
```

### index.d.ts
```typescript
interface ToastOptions {
  type?: MessageType;
  duration?: number;
  position?: MessagePosition;
}

declare function toast(content: string, type?: MessageType, duration?: number): VMessage;
declare function toast(content: string, options?: ToastOptions): VMessage;
```

## 文件变更
- `src/yoya/components/message.js` - 实现新的 API 逻辑
- `src/yoya/components/index.d.ts` - 添加 ToastOptions 接口
- `src/v1/examples/message.js` - 更新示例代码
