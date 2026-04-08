/**
 * TopNavbar 组件
 * 顶部导航栏 - 使用 VTopNavbar
 */

import { vTopNavbar, toast, setThemeMode, getThemeMode } from '../../../yoya/index.js';

// 主题图标映射
const icons = { auto: '🔄', light: '☀️', dark: '🌙' };

// 主题切换按钮引用
let themeButtonRef = null;
// 标记是否已经初始化过按钮图标
let themeButtonInitialized = false;
// 缓存当前按钮图标，避免重复更新
let currentIcon = null;

// 初始化主题事件监听器（只执行一次）
function initThemeChangeListener() {
  if (typeof window === 'undefined') return;

  window.addEventListener('theme-changed', (e) => {
    // 优先使用 currentMode（auto|light|dark），回退到 mode（light|dark）
    const mode = e.detail?.currentMode || e.detail?.mode || getThemeMode();
    const newIcon = icons[mode];

    // 如果图标没有变化，跳过更新
    if (currentIcon === newIcon) return;
    currentIcon = newIcon;

    if (themeButtonRef) {
      // 更新按钮内容（使用 VButton 的 text() 方法）
      themeButtonRef.text(newIcon);
    }
  });
}

// 立即初始化监听器
initThemeChangeListener();

// 更新按钮图标（在按钮创建后调用，只在首次创建时执行）
function updateThemeButtonIcon() {
  if (themeButtonRef && !themeButtonInitialized) {
    themeButtonInitialized = true;
    // 使用 requestAnimationFrame 确保在下一帧更新，此时按钮已渲染到 DOM
    requestAnimationFrame(() => {
      const currentMode = getThemeMode();
      const newIcon = icons[currentMode];
      currentIcon = newIcon;
      themeButtonRef.text(newIcon);
    });
  }
}

export function TopNavbar() {
  return vTopNavbar(navbar => {
    navbar.height('56px');

    // 左侧：品牌 Logo
    navbar.logo('🏝️ YoyaFlow', () => {
      window.location.href = 'index.html';
    });

    // 中间：主导航
    navbar.item('首页', () => {
      window.location.href = 'index.html';
    });

    navbar.item('文档', () => {
      window.location.href = 'button.html';
    });

    // 右侧：主题切换
    navbar.right(right => {
      const mode = getThemeMode();

      const btn = right.button(icons[mode], () => {
        const current = getThemeMode();
        const next = current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto';
        setThemeMode(next);
        toast.info(`主题模式：${next === 'auto' ? '跟随系统' : next === 'light' ? '浅色' : '深色'}`);
      });

      btn.ghost();
      btn.type('primary');
      btn.size('small');
      btn.style('cursor', 'pointer');

      // 保存按钮引用用于更新图标（使用按钮实例而非 _boundElement）
      themeButtonRef = btn;

      // 确保按钮图标正确（在页面加载时从 localStorage 恢复主题后）
      updateThemeButtonIcon();
    });
  });
}
