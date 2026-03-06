/**
 * TopNavbar 组件
 * 顶部导航栏
 */

import { flex } from '../../../yoya/index.js';
import { vMenuItem } from '../../../yoya/index.js';
import { vButton } from '../../../yoya/index.js';
import { toast } from '../../../yoya/index.js';
import { setThemeMode, getThemeMode, getEffectiveThemeMode } from '../../../yoya/index.js';

export function TopNavbar() {
  return flex(navbar => {
    navbar.alignItems('center');
    navbar.justifyBetween();
    navbar.styles({
      height: '56px',
      padding: '0 20px',
      background: 'var(--islands-card-bg, white)',
      borderBottom: '1px solid var(--islands-border, #e0e0e0)',
      position: 'sticky',
      top: '0',
      zIndex: '1000',
    });

    // 左侧：品牌 + 主导航
    navbar.child(flex(left => {
      left.alignItems('center');
      left.gap('24px');

      // 品牌
      left.child(vMenuItem('🏝️ Yoya.Basic V2', brand => {
        brand.styles({
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--islands-primary, #667eea)',
          cursor: 'pointer',
        });
        brand.on('click', () => {
          window.location.href = 'index.html';
        });
      }));

      // 主导航
      left.child(flex(nav => {
        nav.alignItems('center');
        nav.gap('4px');
        nav.child(vMenuItem('首页', link => {
          link.styles({ fontSize: '14px', color: 'var(--islands-text-secondary, #666)', cursor: 'pointer' });
          link.on('click', () => window.location.href = 'index.html');
        }));
        nav.child(vMenuItem('|', sep => {
          sep.styles({ fontSize: '12px', color: '#ddd' });
        }));
        nav.child(vMenuItem('文档', link => {
          link.styles({ fontSize: '14px', color: 'var(--islands-text-secondary, #666)', cursor: 'pointer' });
          link.on('click', () => window.location.href = 'button.html');
        }));
      }));
    }));

    // 右侧：主题切换
    navbar.child(flex(right => {
      right.alignItems('center');
      right.gap('8px');

      right.child(vButton(btn => {
        btn.ghost();
        btn.size('small');
        const mode = getThemeMode();
        const icons = { auto: '🔄', light: '☀️', dark: '🌙' };
        btn.text(icons[mode] || '🌙');
        btn.on('click', () => {
          const current = getThemeMode();
          const next = current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto';
          setThemeMode(next);
          btn.text(icons[next]);
          toast.info(`主题模式：${next === 'auto' ? '跟随系统' : next === 'light' ? '浅色' : '深色'}`);
        });
      }));
    }));
  });
}
