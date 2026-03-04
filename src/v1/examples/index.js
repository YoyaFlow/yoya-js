/**
 * Yoya.Basic V1 - Home Page
 * 使用已有组件创建演示界面首页
 */

import {
  // 布局组件
  flex, grid, responsiveGrid, vstack, hstack, center, spacer, container, divider,
  // UI 组件
  card, cardHeader, cardBody, cardFooter,
  menu, menuItem, menuDivider,
  vButton,
  vCode, codeBlock,
  toast,
  // 主题
  themeManager, switchTheme, getCurrentThemeId,
} from './yoya/index.js';

/**
 * 创建首页内容
 * 全部使用已有组件组合实现，享受主题支持
 */
export function createHomePage() {
  return vstack(page => {
    page.styles({ minHeight: '100vh', background: 'var(--islands-bg, #f8f9fa)' });

    // ========== 顶部导航栏 ==========
    page.child(flex(navbar => {
      navbar.alignItems('center');
      navbar.justifyBetween();
      navbar.styles({
        height: '60px',
        padding: '0 24px',
        background: 'var(--islands-card-bg, white)',
        borderBottom: 'var(--islands-card-header-border, 1px solid var(--islands-border, #e0e0e0))',
        boxShadow: 'var(--islands-card-shadow, 0 2px 8px rgba(0,0,0,0.1))',
        position: 'sticky',
        top: '0',
        zIndex: '1000',
      });

      // 左侧：品牌 + 导航
      navbar.child(flex(left => {
        left.alignItems('center');
        left.gap('24px');

        // 品牌标识（使用 MenuItem 享受主题）
        left.child(menuItem('🏝️ Yoya.Basic V1', brand => {
          brand.styles({
            fontSize: 'var(--islands-navbar-brand-font-size, 18px)',
            fontWeight: 'var(--islands-navbar-brand-font-weight, 600)',
            color: 'var(--islands-primary, #667eea)',
          });
        }));

        // 导航链接
        left.child(flex(links => {
          links.alignItems('center');
          links.gap('4px');

          links.child(menuItem('指南', link => {
            link.styles({ fontSize: '14px' });
            link.on('click', () => toast.info('指南页面开发中...'));
          }));
          links.child(menuItem('组件', link => {
            link.styles({ fontSize: '14px' });
            link.on('click', () => window.location.href = 'components.html');
          }));
        }));
      }));

      // 右侧：主题切换按钮
      navbar.child(flex(right => {
        right.alignItems('center');
        right.gap('12px');

        right.child(vButton(btn => {
          btn.ghost();
          btn.text('🌙 深色');
          btn.on('click', () => {
            const current = getCurrentThemeId();
            const next = current === 'islands:light' ? 'islands:dark' : 'islands:light';
            switchTheme(next);
            btn.text(next === 'islands:dark' ? '☀️ 浅色' : '🌙 深色');
          });
        }));
      }));
    }));

    // ========== 主内容区域 ==========
    page.child(container(main => {
      main.styles({
        padding: '32px 24px',
        maxWidth: 'var(--islands-doc-content-max-width, 1200px)',
      });

      // ----- 欢迎卡片 -----
      main.child(card(welcome => {
        welcome.styles({
          marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        });

        welcome.cardHeader(title => {
          title.styles({ borderBottom: 'none' });
          title.child(vstack(titleContent => {
            titleContent.gap('8px');
            titleContent.child(flex(titleLine => {
              titleLine.alignItems('center');
              titleLine.gap('12px');
              titleLine.child(menuItem('Yoya.Basic V1', h1 => {
                h1.styles({
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'var(--islands-text, #333)',
                });
              }));
            }));
          }));
        });

        welcome.cardBody(content => {
          content.child(vstack(desc => {
            desc.gap('16px');
            desc.child(menuItem(
              '一个浏览器原生的 HTML DSL 库，提供类似 Kotlin HTML DSL 的声明式语法。使用纯 ES 模块，无需构建工具，开箱即用。',
              p => {
                p.styles({
                  fontSize: '16px',
                  lineHeight: '1.8',
                  color: 'var(--islands-text-secondary, #666)',
                });
              }
            ));

            // 操作按钮
            desc.child(flex(actions => {
              actions.gap('12px');
              actions.child(vButton(btn => {
                btn.text('快速开始');
                btn.type('primary');
              }));
              actions.child(vButton(btn => {
                btn.text('查看示例');
                btn.ghost();
              }));
            }));
          }));
        });
      }));

      // ----- 特性卡片 -----
      main.child(vstack(features => {
        features.gap('24px');
        features.styles({ marginBottom: '32px' });

        features.child(flex(titleRow => {
          titleRow.alignItems('center');
          titleRow.child(menuItem('核心特性', h2 => {
            h2.styles({
              fontSize: '24px',
              fontWeight: '600',
              color: 'var(--islands-text, #333)',
            });
          }));
        }));

        features.child(responsiveGrid(grid => {
          grid.minSize('280px');
          grid.gap('20px');

          // 特性 1
          grid.child(card(c => {
            c.cardHeader(h => {
              h.styles({ fontSize: '18px', fontWeight: '600' });
              h.text('📦 开箱即用');
            });
            c.cardBody(p => {
              p.styles({
                color: 'var(--islands-text-secondary, #666)',
                lineHeight: '1.6',
              });
              p.text('纯 ES 模块实现，无需构建工具，通过 <script type="module"> 直接使用');
            });
          }));

          // 特性 2
          grid.child(card(c => {
            c.cardHeader(h => {
              h.styles({ fontSize: '18px', fontWeight: '600' });
              h.text('🎨 主题系统');
            });
            c.cardBody(p => {
              p.styles({
                color: 'var(--islands-text-secondary, #666)',
                lineHeight: '1.6',
              });
              p.text('内置 Islands 主题，支持浅色/深色模式切换，可自定义主题变量');
            });
          }));

          // 特性 3
          grid.child(card(c => {
            c.cardHeader(h => {
              h.styles({ fontSize: '18px', fontWeight: '600' });
              h.text('⚡️ 流式 API');
            });
            c.cardBody(p => {
              p.styles({
                color: 'var(--islands-text-secondary, #666)',
                lineHeight: '1.6',
              });
              p.text('链式调用设计，setup 函数组织代码，开发体验流畅');
            });
          }));

          // 特性 4
          grid.child(card(c => {
            c.cardHeader(h => {
              h.styles({ fontSize: '18px', fontWeight: '600' });
              h.text('🔧 状态机');
            });
            c.cardBody(p => {
              p.styles({
                color: 'var(--islands-text-secondary, #666)',
                lineHeight: '1.6',
              });
              p.text('内置状态机机制，支持状态拦截器、快照，复杂交互轻松管理');
            });
          }));
        }));
      }));

      // ----- 快速示例 -----
      main.child(vstack(quickstart => {
        quickstart.gap('16px');
        quickstart.styles({ marginBottom: '32px' });

        quickstart.child(flex(titleRow => {
          titleRow.alignItems('center');
          titleRow.child(menuItem('快速上手', h2 => {
            h2.styles({
              fontSize: '24px',
              fontWeight: '600',
              color: 'var(--islands-text, #333)',
            });
          }));
        }));

        quickstart.child(card(c => {
          c.cardHeader(h => {
            h.styles({ fontSize: '16px', fontWeight: '600' });
            h.text('示例：创建卡片组件');
          });
          c.cardBody(code => {
            code.child(codeBlock('', `card(c => {
  c.cardHeader('卡片标题');
  c.cardBody('这是卡片内容区域');
  c.cardFooter(btn => {
    btn.vButton('操作', b => b.type('primary'));
  });
})`));
          });
        }));
      }));

      // ----- 组件导航 -----
      main.child(vstack(components => {
        components.gap('16px');
        components.styles({ marginBottom: '32px' });

        components.child(flex(titleRow => {
          titleRow.alignItems('center');
          titleRow.child(menuItem('组件列表', h2 => {
            h2.styles({
              fontSize: '24px',
              fontWeight: '600',
              color: 'var(--islands-text, #333)',
            });
          }));
        }));

        components.child(grid(compGrid => {
          compGrid.columns(3, '1fr');
          compGrid.gap('16px');

          // 基础组件
          compGrid.child(card(c => {
            c.cardHeader(h => {
              h.styles({ fontSize: '16px', fontWeight: '600' });
              h.text('基础组件');
            });
            c.cardBody(m => {
              m.child(menu(menu => {
                menu.vertical();
                menu.item(it => {
                  it.text('🔘 Button 按钮');
                  it.on('click', () => window.location.href = 'button.html');
                });
                menu.item(it => {
                  it.text('📝 Form 表单');
                  it.on('click', () => toast.info('Form 页面开发中...'));
                });
                menu.item(it => {
                  it.text('📋 Card 卡片');
                  it.on('click', () => toast.info('Card 页面开发中...'));
                });
              }));
            });
          }));

          // 导航组件
          compGrid.child(card(c => {
            c.cardHeader(h => {
              h.styles({ fontSize: '16px', fontWeight: '600' });
              h.text('导航组件');
            });
            c.cardBody(m => {
              m.child(menu(menu => {
                menu.vertical();
                menu.item(it => {
                  it.text('📑 Menu 菜单');
                  it.on('click', () => toast.info('Menu 页面开发中...'));
                });
                menu.item(it => {
                  it.text('🏷️ Tabs 标签页');
                  it.on('click', () => toast.info('Tabs 页面开发中...'));
                });
              }));
            });
          }));

          // 反馈组件
          compGrid.child(card(c => {
            c.cardHeader(h => {
              h.styles({ fontSize: '16px', fontWeight: '600' });
              h.text('反馈组件');
            });
            c.cardBody(m => {
              m.child(menu(menu => {
                menu.vertical();
                menu.item(it => {
                  it.text('💬 Message 消息');
                  it.on('click', () => toast.info('Message 页面开发中...'));
                });
                menu.item(it => {
                  it.text('🔔 Toast 提示');
                  it.on('click', () => {
                    toast.success('成功提示');
                    toast.error('错误提示');
                    toast.warning('警告提示');
                    toast.info('信息提示');
                  });
                });
              }));
            });
          }));
        }));
      }));

      // ----- 底部分割线和页脚 -----
      main.child(vstack(footer => {
        footer.gap('24px');

        footer.child(divider(d => {
          d.styles({ margin: '32px 0' });
        }));

        footer.child(flex(footerContent => {
          footerContent.justifyCenter();
          footerContent.child(menuItem('© 2024 Yoya.Basic. 使用 Yoya.Basic V1 构建', foot => {
            foot.styles({
              color: 'var(--islands-text-secondary, #666)',
              fontSize: '14px',
            });
          }));
        }));
      }));
    }));
  });
}
