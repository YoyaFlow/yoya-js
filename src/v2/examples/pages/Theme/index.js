/**
 * Yoya.Basic V2 - Theme Showcase Page
 * 主题展示页面 - 演示主题切换功能
 */

import {
  flex, grid, responsiveGrid, vstack, hstack,
  vCard, vCardHeader, vCardBody,
  vButton, toast, setThemeMode, getThemeMode, switchTheme,
  div, span, h3, vDropdownMenu, vMenu, vCode, vDetail
} from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';

/**
 * 创建主题展示页面
 */
export function createThemePage() {
  const tocItems = [
    { text: '主题切换', href: '#switch', level: 1 },
    { text: '组件展示', href: '#components', level: 1 },
    { text: 'CSS 变量', href: '#variables', level: 1 },
    { text: '代码示例', href: '#code', level: 1 },
  ];

  return AppShell({
    currentPage: 'theme.html',
    tocItems,
    content: (content) => {
      // 页面标题
      content.child(PageHeader({
        title: '🎨 主题系统',
        description: 'Yoya.Basic 支持浅色/深色模式切换，基于 CSS 变量实现主题系统。',
      }));

      // 主题切换演示
      content.child(DocSection('switch', '主题切换', [
        vCard(card => {
          card.vCardHeader('切换主题模式');
          card.vCardBody(body => {
            body.child(hstack(actions => {
              actions.gap('12px');
              actions.style('alignItems', 'flex-start');
              actions.style('flexWrap', 'wrap');

              // 浅色按钮
              actions.child(vButton(btn => {
                btn.text('☀️ 浅色');
                btn.type('primary');
                btn.onClick(() => {
                  setThemeMode('light');
                  toast.success('已切换到浅色主题');
                });
              }));

              // 深色按钮
              actions.child(vButton(btn => {
                btn.text('🌙 深色');
                btn.type('primary');
                btn.onClick(() => {
                  setThemeMode('dark');
                  toast.success('已切换到深色主题');
                });
              }));

              // 自动按钮
              actions.child(vButton(btn => {
                btn.text('🔄 自动');
                btn.type('default');
                btn.onClick(() => {
                  setThemeMode('auto');
                  toast.info('已切换到自动模式（跟随系统）');
                });
              }));

              // 当前模式显示
              actions.child(div(info => {
                info.style('padding', '8px 16px');
                info.style('background', 'var(--yoya-bg-secondary)');
                info.style('borderRadius', '4px');
                info.style('fontSize', '13px');
                info.style('color', 'var(--yoya-text-secondary)');
                info.child(span(s => {
                  s.text('当前模式：');
                }));
                info.child(span(mode => {
                  mode.id('current-mode-display');
                  mode.style('fontWeight', '600');
                  mode.style('color', 'var(--yoya-primary)');
                  mode.text(getThemeMode());
                }));
              }));
            }));
          });
        }),
      ]));

      // 组件展示
      content.child(DocSection('components', '组件展示', [
        vCard(card => {
          card.vCardHeader('🧩 组件主题适配');
          card.vCardBody(showcase => {
            showcase.child(vstack(section => {
              section.style('margin-bottom', '24px');

              // 按钮展示
              section.child(h3(h => {
                h.style('margin', '0 0 12px 0');
                h.style('fontSize', '14px');
                h.style('color', 'var(--yoya-text-secondary)');
                h.style('fontWeight', '500');
                h.text('按钮样式');
              }));

              section.child(hstack(btns => {
                btns.gap('12px');
                btns.style('flexWrap', 'wrap');

                btns.child(vButton('Primary').type('primary'));
                btns.child(vButton('Secondary'));
                btns.child(vButton('Success').style('background', 'var(--yoya-success)').style('color', 'white'));
                btns.child(vButton('Warning').style('background', 'var(--yoya-warning)').style('color', '#333'));
                btns.child(vButton('Danger').style('background', 'var(--yoya-error)').style('color', 'white'));
              }));
            }));

            // 消息提示
            showcase.child(vstack(section => {
              section.style('margin-top', '24px');

              section.child(h3(h => {
                h.style('margin', '0 0 12px 0');
                h.style('fontSize', '14px');
                h.style('color', 'var(--yoya-text-secondary)');
                h.style('fontWeight', '500');
                h.text('消息提示');
              }));

              section.child(hstack(msgs => {
                msgs.gap('12px');
                msgs.style('flexWrap', 'wrap');

                msgs.child(vButton('成功').onClick(() => toast.success('操作成功完成！')));
                msgs.child(vButton('错误').onClick(() => toast.error('发生错误，请重试！')));
                msgs.child(vButton('警告').onClick(() => toast.warning('请注意此操作的影响！')));
                msgs.child(vButton('信息').onClick(() => toast.info('这是一条提示信息！')));
              }));
            }));

            // 下拉菜单
            showcase.child(vstack(section => {
              section.style('margin-top', '24px');

              section.child(h3(h => {
                h.style('margin', '0 0 12px 0');
                h.style('fontSize', '14px');
                h.style('color', 'var(--yoya-text-secondary)');
                h.style('fontWeight', '500');
                h.text('下拉菜单');
              }));

              section.child(vDropdownMenu(dropdown => {
                dropdown.trigger(vButton('📋 点击打开菜单'));
                dropdown.menuContent(vMenu(menu => {
                  menu.item(it => {
                    it.text('📄 新建文件');
                  });
                  menu.item(it => {
                    it.text('📂 打开文件');
                  });
                  menu.divider();
                  menu.item(it => {
                    it.text('⚙️ 设置');
                  });
                }));
                dropdown.closeOnClickOutside();
              }));
            }));
          });
        }),
      ]));

      // CSS 变量预览
      content.child(DocSection('variables', 'CSS 变量预览', [
        vCard(card => {
          card.vCardHeader('🎨 主题变量');
          card.vCardBody(preview => {
            // 颜色网格
            preview.child(grid(colorGrid => {
              colorGrid.columns(4);
              colorGrid.gap('12px');
              colorGrid.style('marginBottom', '16px');

              const colors = [
                { name: 'Primary', var: '--yoya-primary' },
                { name: 'Success', var: '--yoya-success' },
                { name: 'Warning', var: '--yoya-warning' },
                { name: 'Error', var: '--yoya-error' },
                { name: 'Background', var: '--yoya-bg' },
                { name: 'Secondary BG', var: '--yoya-bg-secondary' },
                { name: 'Text', var: '--yoya-text' },
                { name: 'Border', var: '--yoya-border' },
              ];

              colors.forEach(color => {
                colorGrid.child(div(box => {
                  box.style('padding', '12px');
                  box.style('borderRadius', '8px');
                  box.style('border', '1px solid var(--yoya-border)');
                  box.style('textAlign', 'center');
                  box.style('fontSize', '12px');
                  box.style('background', `var(${color.var})`);
                  box.style('color', color.var.includes('bg') || color.var.includes('Background')
                    ? 'var(--yoya-text)' : 'inherit');
                  box.child(span(name => {
                    name.style('display', 'block');
                    name.style('marginBottom', '4px');
                    name.style('fontWeight', '500');
                    name.text(color.name);
                  }));
                  box.child(span(code => {
                    code.style('fontFamily', 'monospace');
                    code.style('fontSize', '10px');
                    code.style('opacity', '0.7');
                    code.text(`var(${color.var})`);
                  }));
                }));
              });
            }));

            // 动态更新当前模式
            preview.child(div(updater => {
              updater.id('theme-updater');
              updater.style('display', 'none');
            }));
          });
        }),
      ]));

      // 代码示例
      content.child(DocSection('code', '代码示例', [
        vCode(code => {
          code.content(`// Yoya.Basic 主题系统使用示例
import {
  vBody, vCard, vButton,
  initTheme, switchTheme, setThemeMode, getThemeMode
} from 'yoya-basic';

// 初始化主题
initTheme({
  defaultTheme: 'islands',
  defaultMode: 'auto'
});

// 切换主题模式
setThemeMode('light');  // 浅色
setThemeMode('dark');   // 深色
setThemeMode('auto');   // 自动（跟随系统）

// 获取当前模式
const mode = getThemeMode();
console.log('当前模式:', mode);

// 在组件中使用
vBody(b => {
  b.child(vCard(c => {
    c.vCardHeader('欢迎使用');
    c.vCardBody('主题系统已就绪');
  }));

  // 主题切换按钮
  b.child(vButton('切换到深色')
    .onClick(() => {
      setThemeMode('dark');
      toast.success('已切换到深色模式');
    }));
}).bindTo('#app');`);
          code.title('JavaScript');
          code.showLineNumbers(true);
        }),
      ]));

      // 定时更新模式显示
      setInterval(() => {
        const modeDisplay = document.getElementById('current-mode-display');
        if (modeDisplay) {
          modeDisplay.textContent = getThemeMode();
        }
      }, 500);
    },
  });
}
