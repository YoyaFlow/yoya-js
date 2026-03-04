# UI 组件 API

## Card 卡片

```javascript
card(c => {
  c.cardHeader(h => {
    h.text('标题');
    h.styles({ fontSize: '16px', fontWeight: '600' });
  });
  c.cardBody('内容或 setup 函数');
  c.cardFooter(b => {
    b.button('操作');
  });
});
```

### Card 内部缓存结构

```javascript
class Card extends Tag {
  _headerBox;   // 缓存 CardHeader
  _bodyBox;     // 缓存 CardBody
  _footerBox;   // 缓存 CardFooter
}
```

## Menu 菜单

```javascript
menu(m => {
  // 菜单项
  m.item(it => {
    it.text('菜单项');
    it.icon('<svg>...</svg>');
    it.shortcut('Ctrl+S');
    it.active();
    it.disabled();
    it.danger();
    it.onclick(fn);
  });

  // 分割线
  m.divider();

  // 菜单组
  m.group(g => {
    g.label('组名');
    g.item(...);
  });
});
```

### MenuItem 状态

| 状态 | 方法 | 效果 |
|------|------|------|
| disabled | `.disabled()` | 透明度 0.5, 不可点击 |
| active | `.active()` | 激活高亮 |
| danger | `.danger()` | 红色警告样式 |
| hoverable | `.hoverable()` | 可悬停高亮 |

## DropdownMenu 下拉菜单

```javascript
dropdownMenu(d => {
  d.trigger('点击我');
  d.menuContent(menu(...));
  d.closeOnClickOutside();
});
```

## ContextMenu 右键菜单

```javascript
const ctxMenu = contextMenu(ctx => {
  ctx.menuContent(menu(...));
});
ctxMenu.target(document.getElementById('target'));
```

## Message 消息提示

```javascript
import { toast } from '../yoya/index.js';

toast.success('操作成功！');
toast.error('操作失败！');
toast.warning('请注意！');
toast.info('提示信息');

// 自定义时长
toast.info('消息', 'info', 5000);  // 5 秒
toast.info('消息', 'info', 0);     // 不自动关闭
```

## 相关文件

- `src/yoya/components/card.js` - Card 组件
- `src/yoya/components/menu.js` - Menu 组件
- `src/yoya/components/message.js` - Message 组件
