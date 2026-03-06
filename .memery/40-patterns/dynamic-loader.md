# 动态加载组件 (VDynamicLoader)

## 功能特性

1. **按需加载** - 使用 ES Modules 动态 import() 加载模块
2. **错误处理** - 加载失败不影响页面正常运行，显示错误内容
3. **状态管理** - 支持 pending/loading/loaded/error 四种状态
4. **缓存机制** - 已加载模块自动缓存，避免重复加载
5. **重试机制** - 支持配置自动重试次数和间隔
6. **回调支持** - onLoad/onError/onStatusChange 回调

## 使用示例

### 基础用法

```javascript
import { vDynamicLoader, div } from '../../yoya/index.js';

vDynamicLoader(
  () => import('./my-component.js'),
  {
    placeholder: div('点击加载'),
    loadingContent: div('加载中...'),
    errorContent: div('加载失败'),
    onLoad: (api, loader) => {
      api.render();
    },
    onError: (error) => {
      console.warn('加载失败:', error);
    }
  }
);
```

### 链式调用

```javascript
vDynamicLoader(() => import('./chart.js'))
  .onLoad((api) => { api.init(); })
  .onError((error) => { console.error(error); })
  .onStatusChange((status) => { console.log(status); });
```

### 配置重试

```javascript
vDynamicLoader(
  () => import('./unstable.js'),
  {
    retryCount: 3,
    retryDelay: 2000,
  }
);
```

### 批量加载

```javascript
import { loadModules } from '../../yoya/index.js';

await loadModules([
  { name: 'chart', loader: () => import('./chart.js') },
  { name: 'table', loader: () => import('./table.js') },
  { name: 'form', loader: () => import('./form.js') },
], {
  parallel: true,  // 并行加载
  onProgress: (loaded, total) => {...},
  onComplete: (results) => {...},
});
```

### 预加载

```javascript
import { preloadModules } from '../../yoya/index.js';

// 预加载到缓存
await preloadModules([
  () => import('./chart.js'),
  () => import('./table.js'),
]);

// 之后创建组件时会直接使用缓存
vDynamicLoader(() => import('./chart.js'));
```

## API

### VDynamicLoader 类

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `getStatus()` | 获取加载状态 | `'pending'\|'loading'\|'loaded'\|'error'` |
| `isLoaded()` | 是否已加载 | `boolean` |
| `isError()` | 是否加载失败 | `boolean` |
| `isLoading()` | 是否正在加载 | `boolean` |
| `getApi()` | 获取模块 API | `any` |
| `getError()` | 获取错误信息 | `Error \| null` |
| `retry()` | 手动重试加载 | `Promise<this>` |
| `timeout(ms)` | 设置超时 | `this` |
| `retryConfig(count, delay)` | 设置重试配置 | `this` |
| `onLoad(callback)` | 设置加载回调 | `this` |
| `onError(callback)` | 设置错误回调 | `this` |
| `onStatusChange(callback)` | 设置状态回调 | `this` |
| `unload()` | 卸载组件，清理缓存 | `this` |
| `destroy()` | 销毁组件 | `this` |

### 配置选项

```typescript
interface DynamicLoaderOptions {
  placeholder?: Tag | string;      // 占位内容
  loadingContent?: Tag | string;   // 加载中显示内容
  errorContent?: Tag | string;     // 错误时显示内容
  onLoad?: (api, loader) => void;  // 加载成功回调
  onError?: (error, loader) => void; // 加载失败回调
  onStatusChange?: (status, loader) => void; // 状态变化回调
  retryCount?: number;             // 重试次数
  retryDelay?: number;             // 重试间隔（毫秒）
  minHeight?: string;              // 最小高度
  minWidth?: string;               // 最小宽度
}
```

### 批量加载工具

```javascript
// 批量加载
loadModules(modules, options)

// 预加载
preloadModules(loaders)

// 清除缓存
clearModuleCache(loader?)

// 获取缓存状态
getModuleCacheStatus(loader)
```

## 实现细节

### 模块缓存

使用 `Map` 缓存已加载的模块，以 loader 函数的字符串表示作为缓存键：

```javascript
const _moduleCache = new Map();

// 缓存键
loader.toString()
```

### 错误隔离

所有回调执行都包裹在 try-catch 中，确保回调错误不影响组件状态：

```javascript
try {
  this._onLoad(api, this);
} catch (e) {
  console.warn('DynamicLoader onLoad 回调执行失败:', e);
}
```

## 相关文件

- `src/yoya/core/helper.js` - 实现
- `src/yoya/index.d.ts` - 类型定义
- `src/v1/examples/dynamic-loader.js` - 示例
