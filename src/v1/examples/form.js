/**
 * Yoya.Basic V1 - Form Demo Page
 * Form 表单演示页面 - 演示 setup 三种方式
 */

import {
  flex, vstack, vCard, vCardBody,
  vMenu, vMenuItem, vButton, vCode, toast,
  vForm, vInput, vTextarea, vSelect, vCheckbox, vCheckboxes, label,
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
      ]));
      sidebar.child(sidebarGroup('基础组件', [
        sidebarItem('Button 按钮', 'button.html'),
        sidebarItem('Form 表单', 'form.html', true),
        sidebarItem('Card 卡片', 'card.html'),
      ]));
      sidebar.child(sidebarGroup('导航组件', [
        sidebarItem('Menu 菜单', 'menu.html'),
      ]));
    },

    // 中间内容
    content: (content) => {
      // 页面标题
      content.child(vstack(header => {
        header.gap('8px');
        header.child(vMenuItem('Form 表单'));
        header.child(vMenuItem('表单组件用于收集用户输入，支持多种输入类型和验证功能。'));
      }));

      // setup 三种方式
      content.child(docSection('setup', 'setup 三种方式', [
        codeDemo('setupString - 简单输入框',
          vstack(s => {
            s.gap('12px');
            s.child(vInput('请输入用户名'));
            s.child(vInput('请输入密码'));
          }),
          `// ✅ 推荐：placeholder 直接用字符串
vInput('请输入用户名')
vInput('请输入密码')`
        ),

        codeDemo('setupObject - 对象配置',
          vstack(s => {
            s.gap('12px');
            s.child(vInput({
              placeholder: '请输入邮箱',
              type: 'email',
              onchange: (e) => toast.info(e.target.value),
            }));
            s.child(vTextarea({
              placeholder: '请输入内容',
              rows: 3,
            }));
          }),
          `// ✅ 推荐：配置属性和事件用对象
// 仅配置模式：第一个参数为对象
vInput({
  placeholder: '请输入邮箱',
  type: 'email',
  onchange: (e) => toast(e.target.value)
})

// 配置 + 内容模式：第一个参数为对象，第二个参数为内容
vCard({ class: 'custom-card' }, '卡片内容')`
        ),

        codeDemo('setupFunction + 链式调用',
          vstack(s => {
            s.gap('12px');
            s.child(vInput(i => {
              i.placeholder('请输入用户名');
              i.type('text');
              i.on('change', (e) => toast.info(e.target.value));
            }));
            s.child(vInput('请输入密码').type('password'));
          }),
          `// ✅ 推荐：复杂逻辑用函数 + 链式
vInput(i => {
  i.placeholder('用户名')
  i.type('text')
  i.on('change', (e) => toast(e.target.value))
})

// 或更简洁的链式
vInput('密码').type('password')`
        ),
      ]));

      // 输入框
      content.child(docSection('input', '输入框', [
        codeDemo('基础输入框',
          vstack(stack => {
            stack.gap('12px');
            stack.child(vInput('请输入用户名'));
            stack.child(vInput(i => { i.type('password'); i.placeholder('请输入密码'); }));
            stack.child(vInput(i => { i.type('email'); i.placeholder('请输入邮箱'); }));
          }),
          `vInput('请输入用户名')
vInput(i => { i.type('password'); i.placeholder('请输入密码'); })`
        ),

        codeDemo('带标签的输入框',
          vstack(stack => {
            stack.gap('8px');
            stack.child(label('用户名'));
            stack.child(vInput('请输入用户名'));
            stack.child(label('密码'));
            stack.child(vInput(i => { i.type('password'); i.placeholder('请输入密码'); }));
          }),
          `label('用户名')
vInput('请输入用户名')`
        ),
      ]));

      // 文本域
      content.child(docSection('textarea', '文本域', [
        codeDemo('基础文本域',
          vstack(stack => {
            stack.gap('12px');
            stack.child(vTextarea('请输入内容'));
            stack.child(vTextarea(t => { t.rows(4); t.placeholder('请输入描述'); }));
          }),
          `vTextarea('请输入内容')
vTextarea(t => { t.rows(4); t.placeholder('请输入描述'); })`
        ),
      ]));

      // 选择框
      content.child(docSection('select', '选择框', [
        codeDemo('下拉选择',
          vstack(stack => {
            stack.gap('12px');
            stack.child(vSelect(s => {
              s.options([
                { value: '', label: '请选择选项' },
                { value: '1', label: '选项 1' },
                { value: '2', label: '选项 2' },
                { value: '3', label: '选项 3' },
              ]);
            }));
          }),
          `vSelect(s => {
  s.options([
    { value: '', label: '请选择选项' },
    { value: '1', label: '选项 1' },
    { value: '2', label: '选项 2' },
  ])
})`
        ),
      ]));

      // 复选框和单选
      content.child(docSection('checkbox-radio', '复选框和单选', [
        codeDemo('复选框',
          vstack(stack => {
            stack.gap('8px');
            stack.child(vCheckbox('选项 1'));
            stack.child(vCheckbox('选项 2'));
            stack.child(vCheckbox('选项 3'));
          }),
          `vCheckbox('选项 1')
vCheckbox('选项 2')`
        ),

        codeDemo('单选框',
          vstack(stack => {
            stack.gap('8px');
            stack.child(vCheckboxes(cb => {
              cb.multiple(false);  // 单选模式
              cb.options([
                { value: '1', label: '单选 1' },
                { value: '2', label: '单选 2' },
                { value: '3', label: '单选 3' },
              ]);
              cb.value('1');
              cb.onChange((value) => toast.info('选中：' + value));
            }));
          }),
          `vCheckboxes(cb => {
  cb.multiple(false)  // 单选模式
  cb.options([
    { value: '1', label: '单选 1' },
    { value: '2', label: '单选 2' },
  ])
  cb.value('1')
  cb.onChange((value) => toast('选中：' + value))
})`
        ),
      ]));

      // 表单布局
      content.child(docSection('layout', '表单布局', [
        codeDemo('垂直表单',
          vCard(c => {
            c.vCardHeader('用户登录');
            c.vCardBody(form => {
              form.child(vstack(stack => {
                stack.gap('16px');
                stack.child(label('用户名'));
                stack.child(vInput('请输入用户名'));
                stack.child(label('密码'));
                stack.child(vInput('请输入密码').type('password'));
                stack.child(flex(btns => {
                  btns.gap('12px');
                  btns.child(vButton('登录').type('primary'));
                  btns.child(vButton('重置').ghost());
                }));
              }));
            });
          }),
          `vCard(c => {
  c.vCardHeader('用户登录')
  c.vCardBody(form => {
    form.child(vstack(stack => {
      stack.gap('16px')
      stack.child(label('用户名'))
      stack.child(vInput('请输入用户名'))
      stack.child(vButton('登录').type('primary'))
    }))
  })
})`
        ),
      ]));

      // API
      content.child(docSection('api', 'API', [
        vCard(c => {
          c.vCardBody(api => {
            api.child(vMenu(apiMenu => {
              apiMenu.vertical();

              const apiItems = [
                { name: 'vInput', desc: '输入框', props: 'type, placeholder, value' },
                { name: 'vTextarea', desc: '文本域', props: 'rows, cols, value' },
                { name: 'vSelect', desc: '下拉选择', props: 'value, multiple' },
                { name: 'vCheckbox', desc: '复选框', props: 'checked, value' },
                { name: 'vCheckboxes', desc: '复选框组', props: 'options, multiple, value, onChange' },
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
        links.child(tocItem('setup 三种方式', '#setup'));
        links.child(tocItem('输入框', '#input'));
        links.child(tocItem('文本域', '#textarea'));
        links.child(tocItem('选择框', '#select'));
        links.child(tocItem('复选框和单选', '#checkbox-radio'));
        links.child(tocItem('表单布局', '#layout'));
        links.child(tocItem('API', '#api'));
      }));
    },
  });
}
