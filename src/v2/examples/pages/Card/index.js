/**
 * Yoya.Basic V2 - Card Demo Page
 */

import { flex, vstack, grid, vButton, toast } from '../../../../yoya/index.js';
import { vCard, vCardHeader, vCardBody, vCardFooter } from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';
import { ApiTable } from '../../components/ApiTable.js';

/**
 * 创建 Card 演示页面
 */
export function createCardPage() {
  const tocItems = [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '卡片结构', href: '#structure', level: 1 },
    { text: '卡片组合', href: '#composite', level: 1 },
    { text: 'API', href: '#api', level: 1 },
  ];

  return AppShell({
    currentPage: 'card.html',
    tocItems,
    content: (content) => {
      content.child(PageHeader({
        title: 'Card 卡片',
        description: '卡片组件用于包裹内容，提供统一的容器样式。',
      }));

      content.child(DocSection('basic', '基础用法', [
        CodeDemo('基础卡片',
          vCard(c => {
            c.vCardHeader('卡片标题');
            c.vCardBody('这是卡片内容区域');
          }),
          `vCard(c => {
  c.vCardHeader('卡片标题')
  c.vCardBody('这是卡片内容区域')
})`
        ),

        CodeDemo('带操作区的卡片',
          vCard(c => {
            c.vCardHeader('操作卡片');
            c.vCardBody('内容区域');
            c.vCardFooter(b => {
              b.child(flex(row => {
                row.gap('8px');
                row.child(vButton('取消').ghost());
                row.child(vButton('确定').type('primary'));
              }));
            });
          }),
          `vCard(c => {
  c.vCardHeader('标题')
  c.vCardBody('内容')
  c.vCardFooter(b => {
    b.child(vButton('取消').ghost())
    b.child(vButton('确定').type('primary'))
  })
})`
        ),
      ]));

      content.child(DocSection('structure', '卡片结构', [
        CodeDemo('完整卡片结构',
          vCard(c => {
            c.vCardHeader('完整卡片');
            c.vCardBody(p => {
              p.div('卡片包含三个部分：');
              p.ul(u => {
                u.li('vCardHeader - 卡片头部');
                u.li('vCardBody - 卡片主体');
                u.li('vCardFooter - 卡片底部');
              });
            });
            c.vCardFooter('底部信息');
          }),
          `vCard(c => {
  c.vCardHeader('卡片头部')
  c.vCardBody('卡片主体')
  c.vCardFooter('卡片底部')
})`
        ),
      ]));

      content.child(DocSection('composite', '卡片组合', [
        CodeDemo('卡片网格',
          grid(g => {
            g.columns(2);
            g.gap('16px');
            g.child(vCard(c => {
              c.vCardHeader('卡片 1');
              c.vCardBody('内容 1');
            }));
            g.child(vCard(c => {
              c.vCardHeader('卡片 2');
              c.vCardBody('内容 2');
            }));
            g.child(vCard(c => {
              c.vCardHeader('卡片 3');
              c.vCardBody('内容 3');
            }));
            g.child(vCard(c => {
              c.vCardHeader('卡片 4');
              c.vCardBody('内容 4');
            }));
          }),
          `grid(g => {
  g.columns(2)
  g.gap('16px')
  g.child(vCard(...))
})`
        ),
      ]));

      content.child(DocSection('api', 'API', [
        ApiTable([
          { name: 'vCard', desc: '卡片容器', type: '-' },
          { name: 'vCardHeader', desc: '卡片头部', type: 'string | function' },
          { name: 'vCardBody', desc: '卡片主体', type: 'function' },
          { name: 'vCardFooter', desc: '卡片底部', type: 'function' },
        ]),
      ]));
    },
  });
}
