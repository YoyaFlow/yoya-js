/**
 * Yoya.Basic V2 - Detail Demo Page
 */

import { vstack } from '../../../../yoya/index.js';
import { vDetail, vDetailItem } from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

/**
 * 创建 Detail 演示页面
 */
export function createDetailPage() {
  const tocItems = [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '纵向布局', href: '#vertical', level: 1 },
    { text: '自定义列数', href: '#columns', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'detail.html',
    tocItems,
    content: (content) => {
      content.child(PageHeader({
        title: 'Detail 详情展示',
        description: '详情展示组件用于展示键值对数据。',
      }));

      content.child(DocSection('basic', '基础用法', [
        CodeDemo('基础详情展示',
          vDetail(d => {
            d.item('用户名', 'zhangsan');
            d.item('邮箱', 'zhangsan@example.com');
            d.item('手机', '138****1234');
            d.item('地址', '北京市朝阳区 xxx 街道');
          }),
          `vDetail(d => {
  d.item('用户名', 'zhangsan')
  d.item('邮箱', 'zhangsan@example.com')
  d.item('手机', '138****1234')
  d.item('地址', '北京市朝阳区 xxx 街道')
})`
        ),
      ]));

      content.child(DocSection('vertical', '纵向布局', [
        CodeDemo('纵向布局（适应长标签）',
          vDetail(d => {
            d.column(3);
            d.layout('vertical');
            d.item('用户名', 'zhangsan');
            d.item('电子邮箱地址', 'zhangsan@example.com');
            d.item('手机号码', '138****1234');
            d.item('详细居住地址', '北京市朝阳区 xxx 街道');
            d.item('当前职业信息', '软件工程师');
            d.item('工作单位名称', 'xxx 科技有限公司');
          }),
          `vDetail(d => {
  d.column(3)
  d.layout('vertical')  // 纵向布局
  d.item('用户名', 'zhangsan')
  d.item('电子邮箱地址', 'zhangsan@example.com')
  d.item('手机号码', '138****1234')
})`
        ),
      ]));

      content.child(DocSection('columns', '自定义列数', [
        CodeDemo('三列布局',
          vDetail(d => {
            d.column(3);  // 3 列布局
            d.item('用户名', 'zhangsan');
            d.item('邮箱', 'zhangsan@example.com');
            d.item('手机', '138****1234');
            d.item('地址', '北京市朝阳区 xxx 街道');
            d.item('职业', '工程师');
            d.item('公司', 'xxx 科技');
          }),
          `vDetail(d => {
  d.columns(3)
  d.item('用户名', 'zhangsan')
  d.item('邮箱', 'zhangsan@example.com')
  // ...
})`
        ),
      ]));

      content.child(DocSection('api', 'API', [
        ApiTable([
          { name: 'item', desc: '详情项', type: '(label, value) => Tag' },
          { name: 'layout', desc: '布局方式', type: 'horizontal | vertical' },
          { name: 'columns', desc: '列数', type: 'number' },
          { name: 'labelStyle', desc: '标签样式', type: 'object' },
          { name: 'valueStyle', desc: '值样式', type: 'object' },
        ]),
      ]));
    },
  });
}
