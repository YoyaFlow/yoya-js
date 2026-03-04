/**
 * Yoya.Basic V1 - Menu Demo Page
 * Menu 菜单演示页面
 */

import {
  flex, vstack, hstack,
  card, cardHeader, cardBody,
  menu, menuItem, menuDivider, menuGroup, dropdownMenu, contextMenu,
  vButton, vCode, toast,
} from '../../yoya/index.js';

import { appLayout, sidebarGroup, sidebarItem, tocItem, docSection, codeDemo } from './layout.js';

/**
 * 创建 Menu 演示页面
 */
export function createMenuPage() {
  return appLayout({
    // 左侧菜单
    sidebar: (sidebar) => {
      sidebar.child(sidebarGroup('开始', [
        sidebarItem('介绍', 'index.html'),
        sidebarItem('快速开始', 'quickstart.html'),
      ]));
      sidebar.child(sidebarGroup('基础组件', [
        sidebarItem('Button 按钮', 'button.html'),
        sidebarItem('Form 表单', 'form.html'),
        sidebarItem('Card 卡片', 'card.html'),
      ]));
      sidebar.child(sidebarGroup('导航组件', [
        sidebarItem('Menu 菜单', 'menu.html', true),
        sidebarItem('Tabs 标签页', 'tabs.html'),
      ]));
      sidebar.child(sidebarGroup('反馈组件', [
        sidebarItem('Message 消息', 'message.html'),
        sidebarItem('Toast 提示', 'toast.html'),
      ]));
    },

    // 中间内容
    content: (content) => {
      // 页面标题
      content.child(vstack(header => {
        header.gap('8px');
        header.styles({ marginBottom: '24px' });

        header.child(menuItem('Menu 菜单', h1 => {
          h1.styles({ fontSize: '28px', fontWeight: '700', color: 'var(--islands-text, #333)' });
        }));

        header.child(menuItem('菜单组件用于展示操作列表，支持垂直/水平布局、分组、下拉和右键菜单等功能。', desc => {
          desc.styles({ fontSize: '15px', lineHeight: '1.7', color: 'var(--islands-text-secondary, #666)' });
        }));
      }));

      // 基础菜单
      content.child(docSection('basic', '基础菜单', [
        codeDemo('垂直菜单（默认）',
          menu(m => {
            m.item(it => {
              it.text('📋 菜单项 1');
              it.onclick(() => toast.info('点击了菜单项 1'));
            });
            m.item(it => {
              it.text('📁 菜单项 2');
              it.onclick(() => toast.info('点击了菜单项 2'));
            });
            m.item(it => {
              it.text('⚙️ 设置');
              it.onclick(() => toast.info('点击了设置'));
            });
          }),
          `menu(m => {
  m.item(it => {
    it.text('📋 菜单项 1')
    it.onclick(() => toast.info('菜单项 1'))
  })
  m.item(it => {
    it.text('📁 菜单项 2')
    it.onclick(() => toast.info('菜单项 2'))
  })
  m.item(it => {
    it.text('⚙️ 设置')
    it.onclick(() => toast.info('设置'))
  })
})`
        ),

        codeDemo('水平菜单',
          menu(m => {
            m.horizontal();
            m.item(it => {
              it.text('首页');
              it.active();
            });
            m.item(it => {
              it.text('产品');
              it.onclick(() => toast.info('产品'));
            });
            m.item(it => {
              it.text('关于');
              it.onclick(() => toast.info('关于'));
            });
          }),
          `menu(m => {
  m.horizontal()
  m.item(it => {
    it.text('首页')
    it.active()
  })
  m.item(it => {
    it.text('产品')
  })
})`
        ),
      ]));

      // 带分割线的菜单
      content.child(docSection('divider', '带分割线的菜单', [
        codeDemo('菜单分割线',
          menu(m => {
            m.item(it => {
              it.text('📄 新建');
              it.onclick(() => toast.info('新建'));
            });
            m.item(it => {
              it.text('📂 打开');
              it.onclick(() => toast.info('打开'));
            });
            m.divider();
            m.item(it => {
              it.text('💾 保存');
              it.onclick(() => toast.info('保存'));
            });
            m.item(it => {
              it.text('🗑️ 删除');
              it.onclick(() => toast.info('删除'));
            });
          }),
          `menu(m => {
  m.item(it => { it.text('📄 新建') })
  m.item(it => { it.text('📂 打开') })
  m.divider()
  m.item(it => { it.text('💾 保存') })
  m.item(it => { it.text('🗑️ 删除') })
})`
        ),
      ]));

      // 带分组的菜单
      content.child(docSection('group', '带分组的菜单', [
        codeDemo('菜单分组',
          menu(m => {
            m.group(g => {
              g.label('文件操作');
              g.item(it => {
                it.text('📄 新建');
                it.onclick(() => toast.info('新建'));
              });
              g.item(it => {
                it.text('📂 打开');
                it.onclick(() => toast.info('打开'));
              });
            });
            m.divider();
            m.group(g => {
              g.label('编辑');
              g.item(it => {
                it.text('✂️ 剪切');
                it.onclick(() => toast.info('剪切'));
              });
              g.item(it => {
                it.text('📋 复制');
                it.onclick(() => toast.info('复制'));
              });
              g.item(it => {
                it.text('📌 粘贴');
                it.onclick(() => toast.info('粘贴'));
              });
            });
          }),
          `menu(m => {
  m.group(g => {
    g.label('文件操作')
    g.item(it => { it.text('📄 新建') })
    g.item(it => { it.text('📂 打开') })
  })
  m.divider()
  m.group(g => {
    g.label('编辑')
    g.item(it => { it.text('✂️ 剪切') })
    g.item(it => { it.text('📋 复制') })
    g.item(it => { it.text('📌 粘贴') })
  })
})`
        ),
      ]));

      // 菜单项状态
      content.child(docSection('state', '菜单项状态', [
        codeDemo('激活、禁用、危险状态',
          menu(m => {
            m.item(it => {
              it.text('🏠 首页');
              it.active();
            });
            m.item(it => {
              it.text('📦 产品');
              it.onclick(() => toast.info('产品'));
            });
            m.item(it => {
              it.text('🔒 禁用项');
              it.disabled();
            });
            m.divider();
            m.item(it => {
              it.text('🗑️ 删除');
              it.danger();
              it.onclick(() => toast.error('删除操作'));
            });
          }),
          `menu(m => {
  m.item(it => {
    it.text('🏠 首页')
    it.active()
  })
  m.item(it => {
    it.text('📦 产品')
  })
  m.item(it => {
    it.text('🔒 禁用项')
    it.disabled()
  })
  m.divider()
  m.item(it => {
    it.text('🗑️ 删除')
    it.danger()
  })
})`
        ),
      ]));

      // 带快捷键的菜单
      content.child(docSection('shortcut', '带快捷键的菜单', [
        codeDemo('菜单项快捷键',
          menu(m => {
            m.item(it => {
              it.text('📄 新建');
              it.shortcut('Ctrl+N');
              it.onclick(() => toast.info('新建'));
            });
            m.item(it => {
              it.text('🔍 查找');
              it.shortcut('Ctrl+F');
              it.onclick(() => toast.info('查找'));
            });
            m.item(it => {
              it.text('💾 保存');
              it.shortcut('Ctrl+S');
              it.onclick(() => toast.info('保存'));
            });
          }),
          `menu(m => {
  m.item(it => {
    it.text('📄 新建')
    it.shortcut('Ctrl+N')
  })
  m.item(it => {
    it.text('🔍 查找')
    it.shortcut('Ctrl+F')
  })
  m.item(it => {
    it.text('💾 保存')
    it.shortcut('Ctrl+S')
  })
})`
        ),
      ]));

      // 下拉菜单
      content.child(docSection('dropdown', '下拉菜单', [
        card(c => {
          c.styles({ marginBottom: '24px' });
          c.cardHeader(h => {
            h.styles({ fontSize: '14px', fontWeight: '600' });
            h.text('下拉菜单演示');
          });
          c.cardBody(demo => {
            demo.child(flex(row => {
              row.gap('16px');

              // 基础下拉菜单
              row.child(dropdownMenu(d => {
                d.trigger('下拉菜单 ▼');
                d.menuContent(menu(m => {
                  m.item(it => {
                    it.text('📋 选项 1');
                    it.onclick(() => {
                      toast.info('选项 1');
                    });
                  });
                  m.item(it => {
                    it.text('📁 选项 2');
                    it.onclick(() => toast.info('选项 2'));
                  });
                  m.divider();
                  m.item(it => {
                    it.text('⚙️ 设置');
                    it.onclick(() => toast.info('设置'));
                  });
                }));
                d.closeOnClickOutside();
              }));

              // 带图标的下拉菜单
              row.child(dropdownMenu(d => {
                d.trigger('更多操作 ▼');
                d.menuContent(menu(m => {
                  m.item(it => {
                    it.text('✏️ 编辑');
                    it.onclick(() => toast.info('编辑'));
                  });
                  m.item(it => {
                    it.text('📤 分享');
                    it.onclick(() => toast.info('分享'));
                  });
                  m.divider();
                  m.item(it => {
                    it.text('🗑️ 删除');
                    it.danger();
                    it.onclick(() => toast.error('删除'));
                  });
                }));
                d.closeOnClickOutside();
              }));
            }));
          });
        }),
      ]));

      // 右键菜单
      content.child(docSection('context', '右键菜单', [
        card(c => {
          c.styles({ marginBottom: '24px' });
          c.cardHeader(h => {
            h.styles({ fontSize: '14px', fontWeight: '600' });
            h.text('右键菜单演示');
          });
          c.cardBody(demo => {
            demo.child(vstack(stack => {
              stack.gap('12px');

              // 触发区域
              stack.child(card(target => {
                target.styles({
                  padding: '40px',
                  border: '2px dashed var(--islands-border, #e0e0e0)',
                  background: 'var(--islands-bg-secondary, #f8f9fa)',
                  textAlign: 'center',
                });
                target.child(menuItem('👉 在此区域右键点击 ⬅️', hint => {
                  hint.styles({
                    fontSize: '16px',
                    color: 'var(--islands-text-secondary, #666)',
                  });
                }));
              }));

              // 右键菜单（需要 JavaScript 绑定）
              stack.child(menuItem('提示：在上方灰色区域点击鼠标右键，即可看到自定义右键菜单。', tip => {
                tip.styles({
                  fontSize: '13px',
                  color: 'var(--islands-primary, #667eea)',
                  fontStyle: 'italic',
                });
              }));
            }));

            // 右键菜单逻辑（在 setup 中处理）
            demo.child(contextMenu(ctx => {
              ctx.menuContent(menu(m => {
                m.item(it => {
                  it.text('✏️ 编辑');
                  it.onclick(() => {
                    toast.info('编辑');
                    ctx.hide();
                  });
                });
                m.item(it => {
                  it.text('📤 导出');
                  it.onclick(() => {
                    toast.info('导出');
                    ctx.hide();
                  });
                });
                m.divider();
                m.item(it => {
                  it.text('🗑️ 删除');
                  it.danger();
                  it.onclick(() => {
                    toast.error('删除');
                    ctx.hide();
                  });
                });
              }));
              // 绑定到目标元素（需要在 DOM 渲染后）
              setTimeout(() => {
                const targetEl = demo._boundElement?.querySelector('[style*="dashed"]');
                if (targetEl) {
                  ctx.target(targetEl);
                }
              }, 100);
            }));
          });
        }),
      ]));

      // API
      content.child(docSection('api', 'API', [
        card(c => {
          c.cardBody(api => {
            api.child(menu(apiMenu => {
              apiMenu.vertical();

              const apiItems = [
                { name: 'menu', desc: '菜单容器', props: 'vertical() / horizontal()' },
                { name: 'menuItem', desc: '菜单项', props: 'text, icon, shortcut, onclick, active, disabled, danger' },
                { name: 'menuDivider', desc: '分割线', props: '-' },
                { name: 'menuGroup', desc: '菜单分组', props: 'label(分组标题)' },
                { name: 'dropdownMenu', desc: '下拉菜单', props: 'trigger, menuContent, closeOnClickOutside' },
                { name: 'contextMenu', desc: '右键菜单', props: 'menuContent, target(绑定元素)' },
              ];

              apiItems.forEach(item => {
                apiMenu.item(it => {
                  it.child(flex(apiRow => {
                    apiRow.justifyBetween();
                    apiRow.styles({ width: '100%', padding: '8px 0' });
                    apiRow.child(menuItem(item.name, name => {
                      name.styles({ fontFamily: 'monospace', fontSize: '13px', color: 'var(--islands-primary, #667eea)', fontWeight: '500', width: '140px' });
                    }));
                    apiRow.child(menuItem(item.desc, desc => {
                      desc.styles({ color: 'var(--islands-text-secondary, #666)', flex: 1 });
                    }));
                    apiRow.child(menuItem(item.props, type => {
                      type.styles({ fontFamily: 'monospace', fontSize: '10px', color: '#999' });
                    }));
                  }));
                });
              });
            }));
          });
        }),
      ]));
    },

    // 右侧目录
    toc: (toc) => {
      toc.child(menuItem('本页目录', title => {
        title.styles({ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--islands-text, #333)' });
      }));
      toc.child(vstack(links => {
        links.gap('4px');
        links.child(tocItem('基础菜单', '#basic'));
        links.child(tocItem('分割线', '#divider'));
        links.child(tocItem('菜单分组', '#group'));
        links.child(tocItem('项状态', '#state'));
        links.child(tocItem('快捷键', '#shortcut'));
        links.child(tocItem('下拉菜单', '#dropdown'));
        links.child(tocItem('右键菜单', '#context'));
        links.child(tocItem('API', '#api'));
      }));
    },
  });
}
