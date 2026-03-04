/**
 * Yoya.Basic V1 - Form Demo Page
 * Form 表单演示页面
 */

import {
  flex, vstack, card, cardHeader, cardBody,
  menu, menuItem, vButton, vCode, toast,
  vInput, vSelect, vTextarea, vCheckbox, vCheckboxes, vSwitch, vForm, vTimer,
} from '../../yoya/index.js';

import { appLayout, sidebarGroup, sidebarItem, tocItem, docSection, codeDemo } from './layout.js';

/**
 * 创建 Form 演示页面
 */
export function createFormPage() {
  return appLayout({
    // 左侧菜单
    sidebar: (sidebar) => {
      sidebar.child(sidebarGroup('开始', [
        sidebarItem('介绍', 'index.html'),
        sidebarItem('快速开始', 'quickstart.html'),
      ]));
      sidebar.child(sidebarGroup('基础组件', [
        sidebarItem('Button 按钮', 'button.html'),
        sidebarItem('Form 表单', 'form.html', true),
        sidebarItem('Card 卡片', 'card.html'),
      ]));
      sidebar.child(sidebarGroup('导航组件', [
        sidebarItem('Menu 菜单', 'menu.html'),
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

        header.child(menuItem('Form 表单', h1 => {
          h1.styles({ fontSize: '28px', fontWeight: '700', color: 'var(--islands-text, #333)' });
        }));

        header.child(menuItem('表单组件用于收集用户输入，支持多种输入类型和验证功能。', desc => {
          desc.styles({ fontSize: '15px', lineHeight: '1.7', color: 'var(--islands-text-secondary, #666)' });
        }));
      }));

      // 输入框
      content.child(docSection('input', '输入框 VInput', [
        codeDemo('基础输入框',
          vstack(stack => {
            stack.gap('12px');
            stack.child(vInput(i => {
              i.placeholder('请输入用户名');
            }));
            stack.child(vInput(i => {
              i.placeholder('请输入邮箱');
              i.type('email');
            }));
            stack.child(vInput(i => {
              i.placeholder('请输入密码');
              i.type('password');
            }));
          }),
          `vInput(i => {
  i.placeholder('请输入用户名')
})
vInput(i => {
  i.placeholder('请输入邮箱')
  i.type('email')
})
vInput(i => {
  i.placeholder('请输入密码')
  i.type('password')
})`
        ),

        codeDemo('带禁用状态',
          vstack(stack => {
            stack.gap('12px');
            stack.child(vInput(i => {
              i.placeholder('正常输入框');
            }));
            stack.child(vInput(i => {
              i.placeholder('禁用输入框');
              i.disabled();
              i.value('已禁用');
            }));
          }),
          `vInput(i => {
  i.placeholder('正常输入框')
})
vInput(i => {
  i.placeholder('禁用输入框')
  i.disabled()
  i.value('已禁用')
})`
        ),
      ]));

      // 选择框
      content.child(docSection('select', '选择框 VSelect', [
        codeDemo('基础选择框',
          vstack(stack => {
            stack.gap('12px');
            stack.child(vSelect(s => {
              s.placeholder('请选择城市');
              s.options([
                { value: 'beijing', label: '北京' },
                { value: 'shanghai', label: '上海' },
                { value: 'guangzhou', label: '广州' },
                { value: 'shenzhen', label: '深圳' },
              ]);
            }));
            stack.child(vSelect(s => {
              s.placeholder('请选择水果（可多选）');
              s.multiple();
              s.options([
                { value: 'apple', label: '苹果' },
                { value: 'banana', label: '香蕉' },
                { value: 'orange', label: '橙子' },
              ]);
            }));
          }),
          `vSelect(s => {
  s.placeholder('请选择城市')
  s.options([
    { value: 'beijing', label: '北京' },
    { value: 'shanghai', label: '上海' },
  ])
})

vSelect(s => {
  s.placeholder('请选择水果（可多选）')
  s.multiple()
  s.options([...])
})`
        ),
      ]));

      // 文本域
      content.child(docSection('textarea', '文本域 VTextarea', [
        codeDemo('基础文本域',
          vstack(stack => {
            stack.gap('12px');
            stack.child(vTextarea(t => {
              t.placeholder('请输入描述内容...');
              t.rows(4);
            }));
          }),
          `vTextarea(t => {
  t.placeholder('请输入描述内容...')
  t.rows(4)
})`
        ),
      ]));

      // 复选框
      content.child(docSection('checkbox', '复选框 VCheckbox', [
        codeDemo('单个复选框',
          vstack(stack => {
            stack.gap('12px');
            stack.child(vCheckbox(c => {
              c.label('我已阅读并同意服务条款');
              c.checked();
            }));
            stack.child(vCheckbox(c => {
              c.label('订阅产品更新邮件');
              c.disabled();
            }));
          }),
          `vCheckbox(c => {
  c.label('我已阅读并同意服务条款')
  c.checked()
})`
        ),

        codeDemo('复选框组',
          vCheckboxes(cb => {
            cb.options([
              { value: 'read', label: '阅读' },
              { value: 'sports', label: '运动' },
              { value: 'music', label: '音乐' },
              { value: 'travel', label: '旅行' },
            ]);
            cb.multiple();
            cb.value(['read', 'music']);
            cb.onChange((values) => {
              toast.info('选中：' + values.join(', '));
            });
          }),
          `vCheckboxes(cb => {
  cb.options([
    { value: 'read', label: '阅读' },
    { value: 'sports', label: '运动' },
  ])
  cb.multiple()
  cb.value(['read', 'music'])
  cb.onChange((values) => {
    console.log('选中：', values)
  })
})`
        ),
      ]));

      // 开关
      content.child(docSection('switch', '开关 VSwitch', [
        codeDemo('基础开关',
          vstack(stack => {
            stack.gap('12px');
            stack.child(vSwitch(s => {
              s.label('开启通知');
              s.checked();
              s.onChange((checked) => {
                toast.info(checked ? '通知已开启' : '通知已关闭');
              });
            }));
            stack.child(vSwitch(s => {
              s.label('自动同步');
              s.disabled();
            }));
          }),
          `vSwitch(s => {
  s.label('开启通知')
  s.checked()
  s.onChange((checked) => {
    toast.info(checked ? '通知已开启' : '通知已关闭')
  })
})`
        ),
      ]));

      // 日期时间选择器
      content.child(docSection('timer', '日期选择器 VTimer', [
        codeDemo('日期选择',
          vstack(stack => {
            stack.gap('12px');
            stack.child(vTimer(t => {
              t.type('date');
              t.value(new Date().toISOString().split('T')[0]);
              t.onChange((value) => {
                toast.info('选中日期：' + value);
              });
            }));
            stack.child(vTimer(t => {
              t.type('time');
              t.onChange((value) => {
                toast.info('选中时间：' + value);
              });
            }));
          }),
          `vTimer(t => {
  t.type('date')
  t.value('2024-03-15')
  t.onChange((value) => {
    console.log('选中日期：', value)
  })
})

vTimer(t => {
  t.type('time')
})`
        ),
      ]));

      // 完整表单示例
      content.child(docSection('example', '完整表单示例', [
        card(c => {
          c.styles({ marginBottom: '24px' });

          c.cardHeader(h => {
            h.styles({ fontSize: '14px', fontWeight: '600' });
            h.text('用户注册表单');
          });

          c.cardBody(form => {
            form.child(vForm(f => {
              f.gap('16px');

              // 用户名
              f.child(vInput(i => {
                i.placeholder('用户名');
              }));

              // 邮箱
              f.child(vInput(i => {
                i.placeholder('邮箱');
                i.type('email');
              }));

              // 密码
              f.child(vInput(i => {
                i.placeholder('密码');
                i.type('password');
              }));

              // 选择框
              f.child(vSelect(s => {
                s.placeholder('所在地区');
                s.options([
                  { value: 'beijing', label: '北京' },
                  { value: 'shanghai', label: '上海' },
                  { value: 'other', label: '其他' },
                ]);
              }));

              // 文本域
              f.child(vTextarea(t => {
                t.placeholder('个人简介（选填）');
                t.rows(3);
              }));

              // 复选框
              f.child(vCheckbox(c => {
                c.label('我已阅读并同意服务条款');
              }));

              // 按钮
              f.child(flex(btns => {
                btns.gap('12px');
                btns.child(vButton(b => {
                  b.text('注册');
                  b.type('primary');
                  b.onclick(() => {
                    toast.success('注册成功！');
                  });
                }));
                btns.child(vButton(b => {
                  b.text('重置');
                  b.ghost();
                }));
              }));
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
                { name: 'VInput', desc: '输入框', props: 'placeholder, value, disabled, type, onChange' },
                { name: 'VSelect', desc: '选择框', props: 'options, multiple, placeholder, disabled, onChange' },
                { name: 'VTextarea', desc: '文本域', props: 'placeholder, value, rows, disabled, onChange' },
                { name: 'VCheckbox', desc: '复选框', props: 'label, checked, disabled, onChange' },
                { name: 'VSwitch', desc: '开关', props: 'label, checked, disabled, onChange' },
                { name: 'VTimer', desc: '日期选择器', props: 'type, value, min, max, disabled, onChange' },
              ];

              apiItems.forEach(item => {
                apiMenu.item(it => {
                  it.child(flex(apiRow => {
                    apiRow.justifyBetween();
                    apiRow.styles({ width: '100%', padding: '8px 0' });
                    apiRow.child(menuItem(item.name, name => {
                      name.styles({ fontFamily: 'monospace', fontSize: '13px', color: 'var(--islands-primary, #667eea)', fontWeight: '500', width: '100px' });
                    }));
                    apiRow.child(menuItem(item.desc, desc => {
                      desc.styles({ color: 'var(--islands-text-secondary, #666)', flex: 1 });
                    }));
                    apiRow.child(menuItem(item.props, type => {
                      type.styles({ fontFamily: 'monospace', fontSize: '11px', color: '#999' });
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
        links.child(tocItem('输入框', '#input'));
        links.child(tocItem('选择框', '#select'));
        links.child(tocItem('文本域', '#textarea'));
        links.child(tocItem('复选框', '#checkbox'));
        links.child(tocItem('开关', '#switch'));
        links.child(tocItem('日期选择器', '#timer'));
        links.child(tocItem('完整示例', '#example'));
        links.child(tocItem('API', '#api'));
      }));
    },
  });
}
