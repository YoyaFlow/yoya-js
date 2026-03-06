/**
 * Yoya.Basic V2 - Body Demo Page
 * 页面背景容器演示
 */

import { vstack, div, h1, h2, p } from '../../../../yoya/index.js';
import { vBody, vCard, vCardHeader, vCardBody } from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';

/**
 * 创建 Body 演示页面
 */
export function createBodyPage() {
  const tocItems = [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '全屏模式', href: '#fullscreen', level: 1 },
    { text: '自定义样式', href: '#custom', level: 1 },
  ];

  return AppShell({
    currentPage: 'body.html',
    tocItems,
    content: (content) => {
      content.child(PageHeader({
        title: 'Body 容器',
        description: 'Body 容器组件用于页面整体背景和内容容器。',
      }));

      content.child(DocSection('basic', '基础用法', [
        CodeDemo('基础 Body 容器',
          vBody(b => {
            b.padding('24px');
            b.child(vCard(c => {
              c.vCardHeader('卡片标题');
              c.vCardBody('这是卡片内容');
            }));
          }),
          `vBody(b => {
  b.padding('24px')
  b.child(vCard(c => {
    c.vCardHeader('卡片标题')
    c.vCardBody('这是卡片内容')
  }))
})`
        ),
      ]));

      content.child(DocSection('fullscreen', '全屏模式', [
        CodeDemo('全屏模式',
          vBody(b => {
            b.fullscreen(true);
            b.center();
            b.child(h1('居中内容'));
          }),
          `vBody(b => {
  b.fullscreen(true)
  b.center()
  b.child(h1('居中内容'))
})`
        ),
      ]));

      content.child(DocSection('custom', '自定义样式', [
        CodeDemo('自定义背景色',
          vBody(b => {
            b.background('#f0f2f5');
            b.padding('32px');
            b.child(vCard(c => {
              c.vCardHeader('自定义背景');
              c.vCardBody('这是一个带有自定义背景的卡片');
            }));
          }),
          `vBody(b => {
  b.background('#f0f2f5')
  b.padding('32px')
  b.child(vCard(...))
})`
        ),
      ]));
    },
  });
}
