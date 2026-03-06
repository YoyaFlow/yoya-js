/**
 * Yoya.Basic V2 - Message Demo Page
 */

import { flex, vstack, vButton } from '../../../../yoya/index.js';
import { toast } from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

/**
 * 创建 Message 演示页面
 */
export function createMessagePage() {
  const tocItems = [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '消息类型', href: '#types', level: 1 },
    { text: '自定义时长', href: '#duration', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'message.html',
    tocItems,
    content: (content) => {
      content.child(PageHeader({
        title: 'Message 消息提示',
        description: '消息提示组件用于展示全局消息反馈。',
      }));

      content.child(DocSection('basic', '基础用法', [
        CodeDemo('基础消息',
          flex(row => {
            row.gap('12px');
            row.child(vButton(b => {
              b.text('成功消息');
              b.on('click', () => toast.success('操作成功！'));
            }));
            row.child(vButton(b => {
              b.text('错误消息');
              b.on('click', () => toast.error('操作失败！'));
            }));
          }),
          `toast.success('操作成功！')
toast.error('操作失败！')`
        ),
      ]));

      content.child(DocSection('types', '消息类型', [
        CodeDemo('四种消息类型',
          flex(row => {
            row.gap('12px');
            row.child(vButton('成功').type('success')
              .on('click', () => toast.success('成功消息')));
            row.child(vButton('错误').type('danger')
              .on('click', () => toast.error('错误消息')));
            row.child(vButton('警告').type('warning')
              .on('click', () => toast.warning('警告消息')));
            row.child(vButton('信息').ghost()
              .on('click', () => toast.info('信息消息')));
          }),
          `toast.success('成功消息')
toast.error('错误消息')
toast.warning('警告消息')
toast.info('信息消息')`
        ),
      ]));

      content.child(DocSection('duration', '自定义时长', [
        CodeDemo('消息时长',
          flex(row => {
            row.gap('12px');
            row.child(vButton('3 秒关闭').ghost()
              .on('click', () => toast.info('3 秒后关闭', 3000)));
            row.child(vButton('5 秒关闭').ghost()
              .on('click', () => toast.info('5 秒后关闭', 5000)));
            row.child(vButton('不关闭').ghost()
              .on('click', () => toast.info('不自动关闭', 0)));
          }),
          `// 3 秒后关闭（默认）
toast.info('消息内容')

// 5 秒后关闭
toast.info('消息内容', 5000)

// 不自动关闭
toast.info('消息内容', 0)`
        ),
      ]));

      content.child(DocSection('api', 'API', [
        ApiTable([
          { name: 'toast.success', desc: '成功消息', type: '(message, duration?) => void' },
          { name: 'toast.error', desc: '错误消息', type: '(message, duration?) => void' },
          { name: 'toast.warning', desc: '警告消息', type: '(message, duration?) => void' },
          { name: 'toast.info', desc: '信息消息', type: '(message, duration?) => void' },
        ]),
      ]));
    },
  });
}
