/**
 * Yoya.Theme & I18n 演示示例
 */

import {
  div, h1, h2, h3, h4, p, span, button, vCard, vCardHeader, vCardBody, vCardFooter,
  vMenu, vMenuItem, vMenuDivider,
  select, option, label, input,
  toast,
  // 主题相关
  initTheme, applyTheme, switchTheme, getCurrentThemeId,
  registerTheme, getTheme,
  createLightTheme, createDarkTheme,
  // i18n 相关
  initI18n, setLanguage, getLanguage, t, registerLanguage,
} from '../yoya/index.js';

// 根虚拟元素引用
let rootVirtualTree = null;

// ============================================
// 注册主题
// ============================================

// 注册 Islands 主题
registerTheme('islands:light', createLightTheme);
registerTheme('islands:dark', createDarkTheme);

// ============================================
// 注册语言包
// ============================================

registerLanguage('zh-CN', {
  // 通用
  'common': {
    'title': '主题与国际化演示',
    'subtitle': 'Yoya.Basic Theme & I18n Demo',
    'ok': '确定',
    'cancel': '取消',
    'save': '保存',
    'delete': '删除',
    'edit': '编辑',
    'search': '搜索',
    'loading': '加载中...',
  },
  // 主题
  'theme': {
    'title': '主题切换',
    'select': '选择主题',
    'light': '浅色模式',
    'dark': '深色模式',
    'current': '当前主题：{theme}',
  },
  // 语言
  'language': {
    'title': '语言切换',
    'select': '选择语言',
    'zh-CN': '简体中文',
    'en-US': 'English',
    'ja-JP': '日本語',
    'current': '当前语言：{language}',
  },
  // 菜单
  'menu': {
    'home': '首页',
    'dashboard': '数据看板',
    'profile': '个人中心',
    'settings': '系统设置',
    'logout': '退出登录',
    'file': '文件',
    'edit': '编辑',
    'help': '帮助',
  },
  // 卡片
  'card': {
    'welcome': '欢迎使用',
    'welcomeMessage': '欢迎使用 Yoya.Basic 主题和国际化系统！',
    'features': '功能特性',
    'feature1': '支持浅色/深色主题切换',
    'feature2': '支持多语言国际化',
    'feature3': '主题配置持久化存储',
    'feature4': 'Small 尺寸规格，紧凑布局',
  },
  // 消息
  'message': {
    'themeChanged': '主题已切换为：{theme}',
    'languageChanged': '语言已切换为：{language}',
    'itemClicked': '点击了：{item}',
  },
});

registerLanguage('en-US', {
  'common': {
    'title': 'Theme & I18n Demo',
    'subtitle': 'Yoya.Basic Theme & I18n Demo',
    'ok': 'OK',
    'cancel': 'Cancel',
    'save': 'Save',
    'delete': 'Delete',
    'edit': 'Edit',
    'search': 'Search',
    'loading': 'Loading...',
  },
  'theme': {
    'title': 'Theme Switch',
    'select': 'Select Theme',
    'light': 'Light Mode',
    'dark': 'Dark Mode',
    'current': 'Current Theme: {theme}',
  },
  'language': {
    'title': 'Language Switch',
    'select': 'Select Language',
    'zh-CN': '简体中文',
    'en-US': 'English',
    'ja-JP': '日本語',
    'current': 'Current Language: {language}',
  },
  'menu': {
    'home': 'Home',
    'dashboard': 'Dashboard',
    'profile': 'Profile',
    'settings': 'Settings',
    'logout': 'Logout',
    'file': 'File',
    'edit': 'Edit',
    'help': 'Help',
  },
  'card': {
    'welcome': 'Welcome',
    'welcomeMessage': 'Welcome to Yoya.Basic Theme & I18n System!',
    'features': 'Features',
    'feature1': 'Light/Dark theme switching',
    'feature2': 'Multi-language i18n support',
    'feature3': 'Theme persistence in localStorage',
    'feature4': 'Small size specs, compact layout',
  },
  'message': {
    'themeChanged': 'Theme switched to: {theme}',
    'languageChanged': 'Language switched to: {language}',
    'itemClicked': 'Clicked: {item}',
  },
});

registerLanguage('ja-JP', {
  'common': {
    'title': 'テーマと国際化デモ',
    'subtitle': 'Yoya.Basic テーマと国際化デモ',
    'ok': 'OK',
    'cancel': 'キャンセル',
    'save': '保存',
    'delete': '削除',
    'edit': '編集',
    'search': '検索',
    'loading': '読み込み中...',
  },
  'theme': {
    'title': 'テーマ切り替え',
    'select': 'テーマを選択',
    'light': 'ライトモード',
    'dark': 'ダークモード',
    'current': '現在のテーマ：{theme}',
  },
  'language': {
    'title': '言語切り替え',
    'select': '言語を選択',
    'zh-CN': '简体中文',
    'en-US': 'English',
    'ja-JP': '日本語',
    'current': '現在の言語：{language}',
  },
  'menu': {
    'home': 'ホーム',
    'dashboard': 'ダッシュボード',
    'profile': 'プロフィール',
    'settings': '設定',
    'logout': 'ログアウト',
    'file': 'ファイル',
    'edit': '編集',
    'help': 'ヘルプ',
  },
  'card': {
    'welcome': 'ようこそ',
    'welcomeMessage': 'Yoya.Basic テーマと国際化システムへようこそ！',
    'features': '機能',
    'feature1': 'ライト/ダークテーマ切り替え',
    'feature2': '多言語国際化サポート',
    'feature3': 'localStorage にテーマを保存',
    'feature4': 'Small サイズ仕様、コンパクトレイアウト',
  },
  'message': {
    'themeChanged': 'テーマを切り替え：{theme}',
    'languageChanged': '言語を切り替え：{language}',
    'itemClicked': 'クリック：{item}',
  },
});

// ============================================
// 初始化
// ============================================

// 初始化 i18n
initI18n({
  defaultLanguage: 'zh-CN',
  autoLoad: true,
});

// 初始化主题
initTheme({
  defaultTheme: 'islands:light',
  themes: new Map([
    ['islands:light', createLightTheme],
    ['islands:dark', createDarkTheme],
  ]),
  onLoaded: (theme) => {
    console.log('Theme loaded:', theme?.name);
    renderApp();
  },
});

// ============================================
// 渲染应用
// ============================================

function renderApp() {
  const app = document.getElementById('app');
  if (!app) {
    setTimeout(renderApp, 100);
    return;
  }

  // 首次渲染，创建虚拟树
  if (!rootVirtualTree) {
    rootVirtualTree = div(root => {
      root.styles({
      minHeight: '100vh',
      background: 'var(--islands-bg)',
      color: 'var(--islands-text)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    });

    // 头部
    root.div(header => {
      header.styles({
        background: 'var(--islands-bg-secondary)',
        borderBottom: '1px solid var(--islands-border)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      });

      // 标题
      header.div(title => {
        title.h1(h => {
          h.styles({ fontSize: '18px', margin: '0', color: 'var(--islands-text)' });
          h.text(t('common.title'));
        });
        title.p(p => {
          p.styles({ fontSize: '12px', margin: '4px 0 0', color: 'var(--islands-text-secondary)' });
          p.text(t('common.subtitle'));
        });
      });

      // 控制区
      header.div(controls => {
        controls.styles({ display: 'flex', alignItems: 'center', gap: '12px' });

        // 主题选择
        controls.div(themeSelect => {
          themeSelect.styles({ display: 'flex', alignItems: 'center', gap: '6px' });
          themeSelect.label(l => {
            l.styles({ fontSize: '12px', color: 'var(--islands-text-secondary)' });
            l.text(t('theme.select'));
          });
          themeSelect.select(sel => {
            sel.styles({ padding: '4px 8px', fontSize: '12px', borderRadius: '4px' });
            sel.id('theme-selector');
            sel.option(o => {
              o.value('islands:light');
              o.text(t('theme.light'));
            });
            sel.option(o => {
              o.value('islands:dark');
              o.text(t('theme.dark'));
            });
            // 设置当前值
            setTimeout(() => {
              const current = getCurrentThemeId() || 'islands:light';
              sel._boundElement && (sel._boundElement.value = current);
            }, 0);
            sel.on('change', (e) => {
              const themeId = e.target.value;
              switchTheme(themeId);
              toast.success(t('message.themeChanged', '', { theme: themeId }));
              // 刷新页面以应用新主题
              setTimeout(() => {
                window.location.reload();
              }, 300);
            });
          });
        });

        // 语言选择
        controls.div(langSelect => {
          langSelect.styles({ display: 'flex', alignItems: 'center', gap: '6px' });
          langSelect.label(l => {
            l.styles({ fontSize: '12px', color: 'var(--islands-text-secondary)' });
            l.text(t('language.select'));
          });
          langSelect.select(sel => {
            sel.styles({ padding: '4px 8px', fontSize: '12px', borderRadius: '4px' });
            sel.id('language-selector');
            sel.option(o => {
              o.value('zh-CN');
              o.text('简体中文');
            });
            sel.option(o => {
              o.value('en-US');
              o.text('English');
            });
            sel.option(o => {
              o.value('ja-JP');
              o.text('日本語');
            });
            // 设置当前值
            setTimeout(() => {
              const current = getLanguage() || 'zh-CN';
              sel._boundElement && (sel._boundElement.value = current);
            }, 0);
            sel.on('change', (e) => {
              const lang = e.target.value;
              setLanguage(lang);
              toast.success(t('message.languageChanged', '', { language: lang }));
              // 刷新页面以应用新语言
              setTimeout(() => {
                window.location.reload();
              }, 300);
            });
          });
        });
      });
    });

    // 内容区
    root.div(content => {
      content.styles({ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' });

      // 欢迎卡片
      content.div(welcomeCard => {
        welcomeCard.styles({ background: 'var(--islands-bg-secondary)', borderRadius: '8px', overflow: 'hidden' });
        welcomeCard.cardHeader(h => {
          h.styles({ borderBottom: '1px solid var(--islands-border)' });
          h.text(t('card.welcome'));
        });
        welcomeCard.cardBody(b => {
          b.p(p => {
            p.styles({ margin: '0 0 12px', fontSize: '13px', lineHeight: '1.6' });
            p.text(t('card.welcomeMessage'));
          });
        });
      });

      // 功能特性卡片
      content.div(featuresCard => {
        featuresCard.styles({ background: 'var(--islands-bg-secondary)', borderRadius: '8px', overflow: 'hidden' });
        featuresCard.cardHeader(h => {
          h.styles({ borderBottom: '1px solid var(--islands-border)' });
          h.text(t('card.features'));
        });
        featuresCard.cardBody(b => {
          b.ul(ul => {
            ul.styles({ margin: 0, paddingLeft: '20px', fontSize: '13px' });
            ul.li(li => { li.text(t('card.feature1')); });
            ul.li(li => { li.text(t('card.feature2')); });
            ul.li(li => { li.text(t('card.feature3')); });
            ul.li(li => { li.text(t('card.feature4')); });
          });
        });
      });

      // 菜单演示卡片
      content.div(menuCard => {
        menuCard.styles({ background: 'var(--islands-bg-secondary)', borderRadius: '8px', overflow: 'hidden' });
        menuCard.cardHeader(h => {
          h.styles({ borderBottom: '1px solid var(--islands-border)' });
          h.text(t('menu.file'));
        });
        menuCard.cardBody(b => {
          b.menu(m => {
            m.item(it => {
              it.text('🏠 ' + t('menu.home'));
              it.active();
              it.onclick(() => toast.info(t('message.itemClicked', '', { item: t('menu.home') })));
            });
            m.item(it => {
              it.text('📊 ' + t('menu.dashboard'));
              it.onclick(() => toast.info(t('message.itemClicked', '', { item: t('menu.dashboard') })));
            });
            m.item(it => {
              it.text('👤 ' + t('menu.profile'));
              it.onclick(() => toast.info(t('message.itemClicked', '', { item: t('menu.profile') })));
            });
            m.divider();
            m.item(it => {
              it.text('⚙️ ' + t('menu.settings'));
              it.onclick(() => toast.info(t('message.itemClicked', '', { item: t('menu.settings') })));
            });
            m.item(it => {
              it.text('🚪 ' + t('menu.logout'));
              it.danger();
              it.onclick(() => toast.error(t('message.itemClicked', '', { item: t('menu.logout') })));
            });
          });
        });
      });

      // i18n 演示卡片
      content.div(i18nCard => {
        i18nCard.styles({ background: 'var(--islands-bg-secondary)', borderRadius: '8px', overflow: 'hidden' });
        i18nCard.cardHeader(h => {
          h.styles({ borderBottom: '1px solid var(--islands-border)' });
          h.text('i18n 翻译演示');
        });
        i18nCard.cardBody(b => {
          b.div(d => {
            d.styles({ fontSize: '13px', lineHeight: '1.8' });

            // 基础翻译
            d.p(p => {
              p.text('基础翻译：');
              p.span(s => {
                s.styles({ color: 'var(--islands-primary)', fontWeight: '500' });
                s.text(t('common.ok', '确定'));
              });
            });

            // 带参数翻译
            d.p(p => {
              p.text('带参数：');
              p.span(s => {
                s.styles({ color: 'var(--islands-primary)', fontWeight: '500' });
                s.text(t('theme.current', '当前主题：{theme}', { theme: getCurrentThemeId() || 'islands:light' }));
              });
            });

            // String 扩展
            d.p(p => {
              p.text('String 扩展：');
              p.span(s => {
                s.styles({ color: 'var(--islands-primary)', fontWeight: '500' });
                const lang = getLanguage();
                s.text('当前语言'.t('language.current', { language: lang }));
              });
            });
          });
        });
      });
    });

    // 底部
    root.div(footer => {
      footer.styles({
        borderTop: '1px solid var(--islands-border)',
        padding: '12px 20px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--islands-text-secondary)',
      });
      footer.text('Yoya.Basic - Theme & I18n Demo © 2024');
    });
  });
  }

  // 绑定到 DOM（首次渲染或重新渲染）
  rootVirtualTree.bindTo(app);
}

// 监听主题切换事件
if (typeof window !== 'undefined') {
  window.addEventListener('theme-changed', (e) => {
    console.log('Theme changed:', e.detail.theme?.name);
  });

  window.addEventListener('language-changed', (e) => {
    console.log('Language changed:', e.detail.language);
  });
}

// 导出以便调试
window.yoyaDemo = {
  switchTheme,
  setLanguage,
  t,
  getCurrentThemeId,
  getLanguage,
};
