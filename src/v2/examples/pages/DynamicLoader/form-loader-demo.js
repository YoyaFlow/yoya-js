/**
 * DynamicLoader 演示 - 表单模块
 * 用于演示动态加载功能
 */

import { div, vForm, toast } from '../../../../yoya/index.js';

/**
 * 渲染表单演示
 */
export function render() {
  return div(container => {
    container.styles({ padding: '20px' });
    container.child(vForm({
      items: [
        { type: 'input', label: '用户名', name: 'username', placeholder: '请输入用户名' },
        { type: 'input', label: '邮箱', name: 'email', placeholder: '请输入邮箱' },
      ],
      onSubmit: (data) => {
        toast.success(`表单提交成功！\n用户名：${data.username}\n邮箱：${data.email}`);
      },
    }));
  });
}
