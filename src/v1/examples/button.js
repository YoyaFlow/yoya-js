/**
 * Yoya.Basic V1 - Button Demo Page
 * Button 按钮演示页面 - 使用已有组件构建
 */

import {
  // 布局组件
  flex, grid, responsiveGrid, vstack, hstack, center, spacer, container, divider,
  // UI 组件
  card, cardHeader, cardBody,
  menu, menuItem,
  vButton,
  vCode,
  breadcrumb,
  toast,
  // 主题
  themeManager, switchTheme, getCurrentThemeId,
} from './yoya/index.js';

/**
 * 创建 Button 演示页面
 */
export function createButtonPage() {
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
        borderBottom: '1px solid var(--islands-border, #e0e0e0)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: '0',
        zIndex: '1000',
      });

      navbar.child(flex(left => {
        left.alignItems('center');
        left.gap('24px');

        left.child(menuItem('🏝️ Yoya.Basic V1', brand => {
          brand.styles({
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--islands-primary, #667eea)',
          });
          brand.on('click', () => window.location.href = 'index.html');
        }));

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
      main.styles({ padding: '32px 24px', maxWidth: '1200px' });

      // ----- 页面标题 -----
      main.child(vstack(header => {
        header.gap('12px');
        header.styles({ marginBottom: '32px' });

        // 面包屑导航
        header.child(flex(crumb => {
          crumb.gap('8px');
          crumb.alignItems('center');
          crumb.child(menuItem('首页', cr => {
            cr.styles({ fontSize: '14px', color: 'var(--islands-primary, #667eea)' });
            cr.on('click', () => window.location.href = 'index.html');
          }));
          crumb.child(menuItem('/', sep => {
            sep.styles({ fontSize: '14px', color: '#999' });
          }));
          crumb.child(menuItem('组件', cr => {
            cr.styles({ fontSize: '14px', color: 'var(--islands-primary, #667eea)' });
            cr.on('click', () => window.location.href = 'components.html');
          }));
          crumb.child(menuItem('/', sep => {
            sep.styles({ fontSize: '14px', color: '#999' });
          }));
          crumb.child(menuItem('Button', cr => {
            cr.styles({ fontSize: '14px', color: 'var(--islands-text, #333)', fontWeight: '500' });
          }));
        }));

        // 标题
        header.child(flex(titleRow => {
          titleRow.alignItems('center');
          titleRow.gap('12px');
          titleRow.child(menuItem('Button 按钮', h1 => {
            h1.styles({ fontSize: '32px', fontWeight: '700', color: 'var(--islands-text, #333)' });
          }));
          titleRow.child(menuItem('基础组件', badge => {
            badge.styles({
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '999px',
              background: 'var(--islands-primary, #667eea)',
              color: 'white',
              fontWeight: '500',
            });
          }));
        }));

        // 描述
        header.child(menuItem('按钮用于触发一个操作。支持多种类型、尺寸、状态，以及加载效果。', desc => {
          desc.styles({ fontSize: '16px', lineHeight: '1.8', color: 'var(--islands-text-secondary, #666)' });
        }));
      }));

      // ----- 基础按钮 -----
      main.child(card(section => {
        section.cardHeader(h => {
          h.styles({ fontSize: '16px', fontWeight: '600' });
          h.text('基础用法');
        });
        section.cardBody(demo => {
          demo.child(flex(row => {
            row.gap('12px');
            row.alignItems('center');
            row.wrap();
            row.child(vButton(b => b.text('默认按钮')));
            row.child(vButton(b => { b.text('主要按钮'); b.type('primary'); }));
            row.child(vButton(b => { b.text('成功按钮'); b.type('success'); }));
            row.child(vButton(b => { b.text('警告按钮'); b.type('warning'); }));
            row.child(vButton(b => { b.text('危险按钮'); b.type('danger'); }));
          }));
        });
      }));

      // ----- Ghost 按钮 -----
      main.child(card(section => {
        section.cardHeader(h => {
          h.styles({ fontSize: '16px', fontWeight: '600' });
          h.text('Ghost 幽灵按钮');
        });
        section.cardBody(demo => {
          demo.child(flex(row => {
            row.gap('12px');
            row.alignItems('center');
            row.wrap();
            row.child(vButton(b => { b.text('默认'); b.ghost(); }));
            row.child(vButton(b => { b.text('主要'); b.type('primary'); b.ghost(); }));
            row.child(vButton(b => { b.text('成功'); b.type('success'); b.ghost(); }));
            row.child(vButton(b => { b.text('警告'); b.type('warning'); b.ghost(); }));
            row.child(vButton(b => { b.text('危险'); b.type('danger'); b.ghost(); }));
          }));
        });
      }));

      // ----- 按钮尺寸 -----
      main.child(card(section => {
        section.cardHeader(h => {
          h.styles({ fontSize: '16px', fontWeight: '600' });
          h.text('按钮尺寸');
        });
        section.cardBody(demo => {
          demo.child(flex(row => {
            row.gap('12px');
            row.alignItems('center');
            row.child(vstack(col => {
              col.gap('8px');
              col.alignItems('center');
              col.child(vButton(b => { b.text('Large'); b.type('primary'); b.size('large'); }));
              col.child(vButton(b => { b.text('Default'); b.type('primary'); }));
              col.child(vButton(b => { b.text('Small'); b.type('primary'); b.size('small'); }));
            }));
          }));
        });
      }));

      // ----- 加载状态 -----
      main.child(card(section => {
        section.cardHeader(h => {
          h.styles({ fontSize: '16px', fontWeight: '600' });
          h.text('加载状态');
        });
        section.cardBody(demo => {
          demo.child(flex(row => {
            row.gap('12px');
            row.alignItems('center');
            row.child(vButton(b => { b.text('加载中...'); b.loading(); }));
            row.child(vButton(b => {
              b.text('点击加载');
              b.type('primary');
              b.on('click', () => {
                b.loading(true);
                setTimeout(() => {
                  b.loading(false);
                  toast.success('操作成功！');
                }, 2000);
              });
            }));
          }));
        });
      }));

      // ----- 禁用状态 -----
      main.child(card(section => {
        section.cardHeader(h => {
          h.styles({ fontSize: '16px', fontWeight: '600' });
          h.text('禁用状态');
        });
        section.cardBody(demo => {
          demo.child(flex(row => {
            row.gap('12px');
            row.alignItems('center');
            row.child(vButton(b => { b.text('默认禁用'); b.disabled(); }));
            row.child(vButton(b => { b.text('主要禁用'); b.type('primary'); b.disabled(); }));
            row.child(vButton(b => { b.text('幽灵禁用'); b.ghost(); b.disabled(); }));
          }));
        });
      }));

      // ----- 代码示例 -----
      main.child(card(section => {
        section.cardHeader(h => {
          h.styles({ fontSize: '16px', fontWeight: '600' });
          h.text('使用代码');
        });
        section.cardBody(code => {
          code.child(vCode(c => {
            c.content(`// 基础按钮
vButton(btn => btn.text('按钮'))

// 不同类型
vButton(btn => { btn.text('主要'); btn.type('primary') })
vButton(btn => { btn.text('成功'); btn.type('success') })
vButton(btn => { btn.text('危险'); btn.type('danger') })

// Ghost 样式
vButton(btn => { btn.text('幽灵'); btn.ghost() })

// 不同尺寸
vButton(btn => { btn.text('大号'); btn.size('large') })
vButton(btn => { btn.text('小号'); btn.size('small') })

// 状态
vButton(btn => { btn.text('加载中'); btn.loading() })
vButton(btn => { btn.text('禁用'); btn.disabled() })

// 点击事件
vButton(btn => {
  btn.text('点击')
  btn.type('primary')
  btn.onclick(() => toast.success('点击了按钮'))
})`);
            c.showLineNumbers(true);
          }));
        });
      }));

      // ----- API 文档 -----
      main.child(card(section => {
        section.cardHeader(h => {
          h.styles({ fontSize: '16px', fontWeight: '600' });
          h.text('API');
        });
        section.cardBody(api => {
          api.child(vstack(apiContent => {
            apiContent.gap('16px');

            // 使用 Menu 展示 API（替代表格）
            api.child(menu(apiMenu => {
              apiMenu.vertical();

              apiMenu.item(it => {
                it.child(flex(apiRow => {
                  apiRow.justifyBetween();
                  apiRow.styles({ width: '100%' });
                  apiRow.child(menuItem('type', name => {
                    name.styles({ fontFamily: 'monospace', fontSize: '13px', color: 'var(--islands-primary, #667eea)', fontWeight: '500' });
                  }));
                  apiRow.child(menuItem('按钮类型', desc => {
                    desc.styles({ color: 'var(--islands-text-secondary, #666)' });
                  }));
                  apiRow.child(menuItem('primary | success | warning | danger | default', type => {
                    type.styles({ fontFamily: 'monospace', fontSize: '12px', color: '#999' });
                  }));
                }));
              });

              apiMenu.item(it => {
                it.child(flex(apiRow => {
                  apiRow.justifyBetween();
                  apiRow.styles({ width: '100%' });
                  apiRow.child(menuItem('size', name => {
                    name.styles({ fontFamily: 'monospace', fontSize: '13px', color: 'var(--islands-primary, #667eea)', fontWeight: '500' });
                  }));
                  apiRow.child(menuItem('按钮尺寸', desc => {
                    desc.styles({ color: 'var(--islands-text-secondary, #666)' });
                  }));
                  apiRow.child(menuItem('large | default | small', type => {
                    type.styles({ fontFamily: 'monospace', fontSize: '12px', color: '#999' });
                  }));
                }));
              });

              apiMenu.item(it => {
                it.child(flex(apiRow => {
                  apiRow.justifyBetween();
                  apiRow.styles({ width: '100%' });
                  apiRow.child(menuItem('disabled', name => {
                    name.styles({ fontFamily: 'monospace', fontSize: '13px', color: 'var(--islands-primary, #667eea)', fontWeight: '500' });
                  }));
                  apiRow.child(menuItem('是否禁用', desc => {
                    desc.styles({ color: 'var(--islands-text-secondary, #666)' });
                  }));
                  apiRow.child(menuItem('boolean', type => {
                    type.styles({ fontFamily: 'monospace', fontSize: '12px', color: '#999' });
                  }));
                }));
              });

              apiMenu.item(it => {
                it.child(flex(apiRow => {
                  apiRow.justifyBetween();
                  apiRow.styles({ width: '100%' });
                  apiRow.child(menuItem('loading', name => {
                    name.styles({ fontFamily: 'monospace', fontSize: '13px', color: 'var(--islands-primary, #667eea)', fontWeight: '500' });
                  }));
                  apiRow.child(menuItem('是否加载中', desc => {
                    desc.styles({ color: 'var(--islands-text-secondary, #666)' });
                  }));
                  apiRow.child(menuItem('boolean', type => {
                    type.styles({ fontFamily: 'monospace', fontSize: '12px', color: '#999' });
                  }));
                }));
              });

              apiMenu.item(it => {
                it.child(flex(apiRow => {
                  apiRow.justifyBetween();
                  apiRow.styles({ width: '100%' });
                  apiRow.child(menuItem('ghost', name => {
                    name.styles({ fontFamily: 'monospace', fontSize: '13px', color: 'var(--islands-primary, #667eea)', fontWeight: '500' });
                  }));
                  apiRow.child(menuItem('是否幽灵按钮', desc => {
                    desc.styles({ color: 'var(--islands-text-secondary, #666)' });
                  }));
                  apiRow.child(menuItem('boolean', type => {
                    type.styles({ fontFamily: 'monospace', fontSize: '12px', color: '#999' });
                  }));
                }));
              });
            }));
          }));
        });
      }));

      // ----- 分页导航 -----
      main.child(flex(pager => {
        pager.justifyBetween();
        pager.styles({ marginTop: '32px' });

        pager.child(vButton(btn => {
          btn.ghost();
          btn.text('← 上一页');
          btn.on('click', () => window.location.href = 'index.html');
        }));

        pager.child(vButton(btn => {
          btn.ghost();
          btn.text('下一页：Form →');
          btn.on('click', () => toast.info('Form 页面开发中...'));
        }));
      }));

      // ----- 页脚 -----
      main.child(vstack(footer => {
        footer.gap('24px');
        footer.styles({ marginTop: '48px' });

        footer.child(divider(d => d.styles({ margin: '32px 0' })));

        footer.child(center(foot => {
          foot.child(menuItem('© 2024 Yoya.Basic. 使用 Yoya.Basic V1 构建', f => {
            f.styles({ color: 'var(--islands-text-secondary, #666)', fontSize: '14px' });
          }));
        }));
      }));
    }));
  });
}
