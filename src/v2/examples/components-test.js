/**
 * Yoya.Basic - 组件主题测试页面
 */

import {
  vButton, vMenu, vMenuItem, vMenuDivider,
  vCard, vCardHeader, vCardBody, vCardFooter,
  initTheme, setThemeMode, getThemeMode, getEffectiveThemeMode,
  toast
} from '../../../yoya/index.js';

// 初始化主题
initTheme({
  defaultTheme: 'islands',
  defaultMode: 'light'
});

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', () => {
  initThemeComponents();
});

function initThemeComponents() {
  // 主题切换器
  const themeContainer = document.getElementById('theme-switcher');
  const modeDisplay = document.getElementById('current-mode');

  // 监听主题变化
  window.addEventListener('theme-changed', (e) => {
    const { mode, currentMode } = e.detail;
    modeDisplay.textContent = `当前模式：${currentMode} (生效：${mode})`;
  });

  // 创建主题切换按钮
  const switcherDiv = document.createElement('div');
  switcherDiv.style.display = 'flex';
  switcherDiv.style.gap = '8px';

  vButton(b => {
    b.text('☀️ 浅色');
    b.onclick(() => {
      setThemeMode('light');
      toast.success('已切换到浅色模式');
    });
  }).bindTo(switcherDiv);

  vButton(b => {
    b.text('🌙 深色');
    b.type('primary');
    b.onclick(() => {
      setThemeMode('dark');
      toast.success('已切换到深色模式');
    });
  }).bindTo(switcherDiv);

  vButton(b => {
    b.text('🔄 自动');
    b.onclick(() => {
      setThemeMode('auto');
      toast.info('已切换到自动模式（跟随系统）');
    });
  }).bindTo(switcherDiv);

  themeContainer.appendChild(switcherDiv);
  modeDisplay.textContent = `当前模式：${getThemeMode()} (生效：${getEffectiveThemeMode()})`;

  // Button 按钮
  const btnTypesContainer = document.getElementById('btn-types');
  vButton(b => { b.text('Default'); }).bindTo(btnTypesContainer);
  vButton(b => { b.text('Primary'); b.type('primary'); }).bindTo(btnTypesContainer);
  vButton(b => { b.text('Success'); b.type('success'); }).bindTo(btnTypesContainer);
  vButton(b => { b.text('Warning'); b.type('warning'); }).bindTo(btnTypesContainer);
  vButton(b => { b.text('Danger'); b.type('danger'); }).bindTo(btnTypesContainer);

  const btnGhostContainer = document.getElementById('btn-ghost');
  vButton(b => { b.text('Ghost Primary'); b.ghost(true); b.type('primary'); }).bindTo(btnGhostContainer);
  vButton(b => { b.text('Ghost Success'); b.ghost(true); b.type('success'); }).bindTo(btnGhostContainer);
  vButton(b => { b.text('Ghost Danger'); b.ghost(true); b.type('danger'); }).bindTo(btnGhostContainer);

  // Menu 菜单
  const menuVertical = vMenu(m => {
    m.vertical();
    m.item(it => {
      it.text('🏠 首页');
      it.active();
    });
    m.item(it => {
      it.text('📁 文档');
    });
    m.item(it => {
      it.text('⚙️ 设置');
    });
    m.divider();
    m.item(it => {
      it.text('🗑️ 删除');
      it.danger();
    });
  });
  document.getElementById('menu-vertical').appendChild(menuVertical.renderDom());

  // Card 卡片
  const cardsContainer = document.getElementById('cards');

  const card1 = vCard(c => {
    c.vCardHeader('基础卡片');
    c.vCardBody('这是一个基础的卡片容器，支持头部、内容区和底部。');
    c.vCardFooter(f => {
      f.vButton(b => { b.text('取消'); });
      f.vButton(b => { b.text('确定'); b.type('primary'); });
    });
  });
  cardsContainer.appendChild(card1.renderDom());

  const card2 = vCard(c => {
    c.hoverable();
    c.vCardHeader('悬浮卡片');
    c.vCardBody('鼠标悬停时会有上浮和阴影加深的效果。');
  });
  cardsContainer.appendChild(card2.renderDom());

  console.log('Component theme test page initialized');
}
