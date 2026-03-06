/**
 * Yoya.Basic V2 - Form Demo Page
 */

import { flex, vstack, vCard, vCardBody, vMenu, vMenuItem, vButton, vCode, toast } from '../../../../yoya/index.js';
import { vForm, vInput, vTextarea, vSelect, vCheckbox, vCheckboxes, label } from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

/**
 * 创建 Form 演示页面
 */
export function createFormPage() {
  const tocItems = [
    { text: 'setup 三种方式', href: '#setup', level: 1 },
    { text: '输入框', href: '#input', level: 1 },
    { text: '文本域', href: '#textarea', level: 1 },
    { text: '选择框', href: '#select', level: 1 },
    { text: '复选框和单选', href: '#checkbox-radio', level: 1 },
    { text: '表单布局', href: '#layout', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'form.html',
    tocItems,
    content: (content) => {
      // 页面标题
      content.child(PageHeader({
        title: 'Form 表单',
        description: '表单组件用于收集用户输入，支持多种输入类型和验证功能。',
      }));

      // setup 三种方式
      content.child(DocSection('setup', 'setup 三种方式', [
        CodeDemo('setupString - 简单输入框',
          vstack(s => {
            s.gap('12px');
            s.child(vInput('请输入用户名'));
            s.child(vInput('请输入密码'));
          }),
          `// ✅ 推荐：placeholder 直接用字符串
vInput('请输入用户名')
vInput('请输入密码')`
        ),

        CodeDemo('setupObject - 对象配置',
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
vInput({
  placeholder: '请输入邮箱',
  type: 'email',
  onchange: (e) => toast(e.target.value)
})

vTextarea({
  placeholder: '请输入内容',
  rows: 3
})`
        ),

        CodeDemo('setupFunction + 链式调用',
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
  i.placeholder('请输入用户名')
  i.type('text')
  i.on('change', (e) => toast(e.target.value))
})

// 或更简洁的链式
vInput('请输入密码').type('password')`
        ),
      ]));

      // 输入框
      content.child(DocSection('input', '输入框', [
        CodeDemo('基础输入框',
          vstack(stack => {
            stack.gap('12px');
            stack.child(vInput('请输入用户名'));
            stack.child(vInput(i => { i.type('password'); i.placeholder('请输入密码'); }));
            stack.child(vInput(i => { i.type('email'); i.placeholder('请输入邮箱'); }));
          }),
          `vInput('请输入用户名')
vInput(i => { i.type('password'); i.placeholder('请输入密码'); })`
        ),

        CodeDemo('带标签的输入框',
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
      content.child(DocSection('textarea', '文本域', [
        CodeDemo('基础文本域',
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
      content.child(DocSection('select', '选择框', [
        CodeDemo('下拉选择',
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
      content.child(DocSection('checkbox-radio', '复选框和单选', [
        CodeDemo('复选框',
          vstack(stack => {
            stack.gap('8px');
            stack.child(vCheckbox('选项 1'));
            stack.child(vCheckbox('选项 2'));
            stack.child(vCheckbox('选项 3'));
          }),
          `vCheckbox('选项 1')
vCheckbox('选项 2')`
        ),

        CodeDemo('单选框',
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
      content.child(DocSection('layout', '表单布局', [
        CodeDemo('垂直表单',
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
      content.child(DocSection('api', 'API', [
        ApiTable([
          { name: 'vInput', desc: '输入框', type: 'type, placeholder, value' },
          { name: 'vTextarea', desc: '文本域', type: 'rows, cols, value' },
          { name: 'vSelect', desc: '下拉选择', type: 'value, multiple' },
          { name: 'vCheckbox', desc: '复选框', type: 'checked, value' },
          { name: 'vCheckboxes', desc: '复选框组', type: 'options, multiple, value, onChange' },
        ]),
      ]));
    },
  });
}
