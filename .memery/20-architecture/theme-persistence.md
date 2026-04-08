---
name: 主题持久化机制
description: 主题系统使用 localStorage 保存用户偏好，页面加载时自动恢复
type: architecture
---

## 主题持久化

主题系统通过 localStorage 保存用户的主题偏好，确保页面刷新后保持用户选择的主题模式。

### 存储键名

- `yoya-theme` - 保存主题 ID（如 'islands'）
- `yoya-mode` - 保存模式（'auto' | 'light' | 'dark'）

### 初始化流程

```javascript
// src/v2/examples/home.js
import { initTheme } from '../../yoya/index.js';

initTheme({
  defaultTheme: 'islands',
  defaultMode: 'auto',
});
```

### 持久化机制

1. **保存**：`setThemeMode(mode)` 调用 `saveModeToStorage(mode)` 将模式保存到 localStorage
2. **加载**：`initTheme()` 调用 `loadModeFromStorage()` 从 localStorage 读取 savedMode
3. **应用**：如果 savedMode 存在，使用 savedMode；否则使用 defaultMode

### 核心代码

```javascript
// src/yoya/theme/index.js

// 保存 mode 到 localStorage
function saveModeToStorage(mode) {
  try {
    localStorage.setItem(STORAGE_KEY_MODE, mode);
  } catch (e) {
    // 忽略存储错误
  }
}

// 从 localStorage 读取 mode
function loadModeFromStorage() {
  try {
    return localStorage.getItem(STORAGE_KEY_MODE);
  } catch (e) {
    return null;
  }
}

// initTheme 初始化时从 localStorage 恢复
export function initTheme(options = {}) {
  const savedTheme = loadThemeFromStorage();
  const savedMode = loadModeFromStorage();
  
  currentThemeId = savedTheme || defaultTheme;
  currentMode = savedMode || defaultMode;
  
  // ...
}
```

### 使用注意事项

- 必须在页面入口文件中调用 `initTheme()`，否则主题偏好不会恢复
- 主题切换按钮通过调用 `setThemeMode(next)` 自动保存到 localStorage
