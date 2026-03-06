/**
 * Yoya.Basic V1 - Field Demo Page
 * Field 可编辑字段演示页面
 */

import {
  flex, vstack, vCard, vCardHeader, vCardBody,
  vMenu, vMenuItem, vButton, vInput, toast, vField, vDetail,
} from '../../yoya/index.js';

import { appLayout, sidebarGroup, sidebarItem, tocItem, docSection, codeDemo } from './layout.js';

/**
 * 创建 Field 演示页面
 */
export function createFieldPage() {
  return appLayout({
    // 左侧菜单
    sidebar: (sidebar) => {
      sidebar.child(sidebarGroup('开始', [
        sidebarItem('介绍', 'index.html'),
      ]));
      sidebar.child(sidebarGroup('基础组件', [
        sidebarItem('Button 按钮', 'button.html'),
        sidebarItem('Form 表单', 'form.html'),
        sidebarItem('Card 卡片', 'card.html'),
      ]));
      sidebar.child(sidebarGroup('导航组件', [
        sidebarItem('Menu 菜单', 'menu.html'),
      ]));
      sidebar.child(sidebarGroup('反馈组件', [
        sidebarItem('Message 消息', 'message.html'),
        sidebarItem('Code 代码', 'code.html'),
      ]));
      sidebar.child(sidebarGroup('数据展示', [
        sidebarItem('Detail 详情', 'detail.html'),
        sidebarItem('Field 字段', 'field.html', true),
      ]));
    },

    // 中间内容
    content: (content) => {
      // 页面标题
      content.child(vstack(header => {
        header.gap('8px');
        header.child(vMenuItem('Field 可编辑字段'));
        header.child(vMenuItem('支持显示和编辑模式切换的字段组件，点击即可编辑内容。'));
      }));

      // 基础用法
      content.child(docSection('basic', '基础用法', [
        codeDemo('基础可编辑字段',
          vstack(s => {
            s.gap('16px');
            s.child(flex(row => {
              row.gap('8px');
              row.child(vField(f => {
                f.showContent((container, value) => {
                  container.text(value || '点击编辑');
                });
                f.editContent((container, setValue) => {
                  const input = vInput('请输入内容');
                  input._el.value = '初始值';
                  container.child(input);
                  setTimeout(() => input._el.focus(), 0);
                });
                f.onSave(({ value, oldValue }) => {
                  toast.success(`保存：${oldValue} → ${value}`);
                });
              }).styles({ minWidth: '200px' }));
            }));
          }),
          `vField(f => {
  // 显示内容
  f.showContent((container, value) => {
    container.text(value || '点击编辑');
  });

  // 编辑内容
  f.editContent((container, setValue) => {
    const input = vInput('请输入');
    container.child(input);
  });

  // 保存事件
  f.onSave(({ value }) => {
    toast.success('保存：' + value);
  });
})`
        ),
      ]));

      // 自动保存
      content.child(docSection('autosave', '自动保存', [
        codeDemo('失去焦点自动保存',
          vstack(s => {
            s.gap('16px');
            s.child(vField(f => {
              f.showContent((container, value) => {
                container.text(value || '点击编辑（自动保存）');
              });
              f.editContent((container, setValue) => {
                const input = vInput('请输入内容');
                input._el.value = '编辑我';
                container.child(input);
                setTimeout(() => input._el.focus(), 0);
              });
              f.autoSave(true);
              f.onChange(({ value }) => {
                toast.info(`自动保存：${value}`);
              });
            }).styles({ minWidth: '250px' }));
          }),
          `// 自动保存模式
vField(f => {
  f.autoSave(true);  // 失去焦点自动保存
  f.onChange(({ value }) => {
    console.log('值变化:', value);
  });
})`
        ),
      ]));

      // 异步保存
      content.child(docSection('async', '异步保存', [
        codeDemo('模拟异步保存',
          vstack(s => {
            s.gap('16px');
            s.child(vField(f => {
              f.showContent((container, value) => {
                container.text(value || '点击编辑');
              });
              f.editContent((container, setValue) => {
                const input = vInput('请输入用户名');
                input._el.value = '张三';
                container.child(input);
                setTimeout(() => input._el.focus(), 0);
              });
              f.onSave(({ value, oldValue }) => {
                // 模拟异步保存
                return new Promise((resolve) => {
                  setTimeout(() => {
                    toast.success(`保存成功：${oldValue} → ${value}`);
                    resolve();
                  }, 1000);
                });
              });
            }).styles({ minWidth: '200px' }));
          }),
          `// 异步保存
f.onSave(({ value, oldValue }) => {
  // 返回 Promise 进行异步保存
  return new Promise((resolve) => {
    setTimeout(() => {
      // 保存逻辑
      resolve();
    }, 1000);
  });
});`
        ),
      ]));

      // 不同场景
      content.child(docSection('scenes', '使用场景', [
        vCard(c => {
          c.vCardHeader('常见使用场景');
          c.vCardBody(scenes => {
            scenes.child(vstack(s => {
              s.gap('20px');

              // 场景 1：用户信息编辑
              s.child(vDetail(d => {
                d.title('用户信息');
                d.column(2);
                d.item('用户名', 'zhangsan');
                d.item('邮箱', 'zhangsan@example.com');
                d.item('手机', '138****1234');
              }));

              // 场景 2：项目名称
              s.child(flex(row => {
                row.gap('12px');
                row.child(vField(f => {
                  f.showContent((container, value) => {
                    container.text(value || '项目名称');
                  });
                  f.editContent((container, setValue) => {
                    const input = vInput('请输入项目名称');
                    input._el.value = '我的项目';
                    container.child(input);
                    setTimeout(() => input._el.focus(), 0);
                  });
                  f.onSave(({ value }) => {
                    toast.success(`项目已重命名为：${value}`);
                  });
                }).styles({ minWidth: '200px' }));
                row.child(vButton('重命名').type('primary'));
              }));
            }));
          });
        }),
      ]));

      // API
      content.child(docSection('api', 'API', [
        vCard(c => {
          c.vCardBody(api => {
            api.child(vMenu(apiMenu => {
              apiMenu.vertical();

              const apiItems = [
                { name: 'showContent()', desc: '显示内容', props: 'function(container, value)' },
                { name: 'editContent()', desc: '编辑内容', props: 'function(container, setValue)' },
                { name: 'autoSave()', desc: '自动保存', props: 'boolean' },
                { name: 'onSave()', desc: '保存事件', props: 'function({value, oldValue})' },
                { name: 'onChange()', desc: '变化事件', props: 'function({value, oldValue})' },
                { name: 'onEdit()', desc: '编辑事件', props: 'function({value})' },
                { name: 'disabled()', desc: '禁用', props: 'boolean' },
                { name: 'placeholder()', desc: '占位符', props: 'string' },
              ];

              apiItems.forEach(item => {
                apiMenu.item(it => {
                  it.child(flex(apiRow => {
                    apiRow.justifyBetween();
                    apiRow.child(vMenuItem(item.name));
                    apiRow.child(vMenuItem(item.desc));
                    apiRow.child(vMenuItem(item.props));
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
      toc.child(vMenuItem('本页目录'));
      toc.child(vstack(links => {
        links.gap('4px');
        links.child(tocItem('基础用法', '#basic'));
        links.child(tocItem('自动保存', '#autosave'));
        links.child(tocItem('异步保存', '#async'));
        links.child(tocItem('使用场景', '#scenes'));
        links.child(tocItem('API', '#api'));
      }));
    },
  });
}
