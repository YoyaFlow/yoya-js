/**
 * Yoya.Basic - UI 组件演示
 * Button、Form、Detail、Field 等 UI 组件展示
 */

import {
  div, h2, h3, span, pre, code,
  vButton, vInput, vSelect, vTextarea, vCheckbox, vSwitch, vForm,
  vDetail, vField, vCheckboxes,
  toast
} from '../yoya/index.js';

// ============================================
// 辅助函数：创建演示 + 代码组合
// ============================================
function demoWithCode(title, demoContent, codeString) {
  return div(section => {
    section.styles({
      background: 'white',
      borderRadius: '12px',
      marginBottom: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      overflow: 'hidden',
    });

    // 演示区域
    section.child(div(demoArea => {
      demoArea.styles({ padding: '30px', borderBottom: '1px solid #e0e0e0' });

      demoArea.child(h2(h => {
        h.text(title);
        h.styles({
          color: '#333',
          fontSize: '20px',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '2px solid #667eea',
        });
      }));

      demoArea.child(demoContent);
    }));

    // 代码区域
    section.child(div(codeArea => {
      codeArea.styles({ background: '#1e1e1e', padding: '20px' });

      codeArea.child(div(header => {
        header.styles({ color: '#007acc', fontSize: '14px', marginBottom: '10px', fontWeight: '600' });
        header.text('💻 示例代码');
      }));

      codeArea.child(pre(p => {
        p.child(code(c => {
          c.styles({ color: '#d4d4d4' });
          c.html(codeString);
        }));
      }));
    }));
  });
}

// ============================================
// Button 按钮组件演示
// ============================================
export const buttonDemo = demoWithCode(
  'VButton 按钮组件',
  div(content => {
    // 基础按钮
    content.child(h3(h => h.text('基础按钮')));
    content.child(div(row => {
      row.styles({ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' });
      row.child(vButton('默认', b => b.type('default')));
      row.child(vButton('主要', b => b.type('primary')));
      row.child(vButton('成功', b => b.type('success')));
      row.child(vButton('警告', b => b.type('warning')));
      row.child(vButton('危险', b => b.type('danger')));
    }));

    // Ghost 按钮
    content.child(h3(h => h.text('Ghost 样式')));
    content.child(div(row => {
      row.styles({ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' });
      row.child(vButton('主要', b => b.type('primary').ghost()));
      row.child(vButton('成功', b => b.type('success').ghost()));
      row.child(vButton('警告', b => b.type('warning').ghost()));
      row.child(vButton('危险', b => b.type('danger').ghost()));
    }));

    // 不同尺寸
    content.child(h3(h => h.text('不同尺寸')));
    content.child(div(row => {
      row.styles({ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', alignItems: 'center' });
      row.child(vButton('大号', b => b.size('large').type('primary')));
      row.child(vButton('默认', b => b.size('default').type('primary')));
      row.child(vButton('小号', b => b.size('small').type('primary')));
    }));

    // 特殊状态
    content.child(h3(h => h.text('特殊状态')));
    content.child(div(row => {
      row.styles({ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' });
      row.child(vButton('禁用', b => b.disabled().type('default')));
      row.child(vButton('加载中', b => b.loading().type('primary')));
      row.child(vButton('块级', b => b.block().type('success')).styles({ width: '200px' }));
    }));

    // 点击事件
    content.child(h3(h => h.text('点击事件')));
    content.child(div(row => {
      row.styles({ display: 'flex', flexWrap: 'wrap', gap: '12px' });
      row.child(vButton('Toast', b => b
        .type('primary')
        .on('click', () => toast.info('按钮被点击了！'))
      ));
      row.child(vButton('成功', b => b
        .type('success')
        .on('click', () => toast.success('操作成功！'))
      ));
      row.child(vButton('错误', b => b
        .type('danger')
        .on('click', () => toast.error('操作失败！'))
      ));
    }));
  }),
  `
<span class="token-comment">// 基础按钮</span>
<span class="token-function">vButton</span>(<span class="token-string">'默认'</span>, b => b.<span class="token-property">type</span>(<span class="token-string">'default'</span>));
<span class="token-function">vButton</span>(<span class="token-string">'主要'</span>, b => b.<span class="token-property">type</span>(<span class="token-string">'primary'</span>));
<span class="token-function">vButton</span>(<span class="token-string">'成功'</span>, b => b.<span class="token-property">type</span>(<span class="token-string">'success'</span>));

<span class="token-comment">// Ghost 样式</span>
<span class="token-function">vButton</span>(<span class="token-string">'主要'</span>, b => b.<span class="token-property">type</span>(<span class="token-string">'primary'</span>).<span class="token-function">ghost</span>());

<span class="token-comment">// 不同尺寸</span>
<span class="token-function">vButton</span>(<span class="token-string">'大号'</span>, b => b.<span class="token-property">size</span>(<span class="token-string">'large'</span>).<span class="token-property">type</span>(<span class="token-string">'primary'</span>));
<span class="token-function">vButton</span>(<span class="token-string">'小号'</span>, b => b.<span class="token-property">size</span>(<span class="token-string">'small'</span>).<span class="token-property">type</span>(<span class="token-string">'primary'</span>));

<span class="token-comment">// 特殊状态</span>
<span class="token-function">vButton</span>(<span class="token-string">'禁用'</span>, b => b.<span class="token-function">disabled</span>().<span class="token-property">type</span>(<span class="token-string">'default'</span>));
<span class="token-function">vButton</span>(<span class="token-string">'加载中'</span>, b => b.<span class="token-function">loading</span>().<span class="token-property">type</span>(<span class="token-string">'primary'</span>));
<span class="token-function">vButton</span>(<span class="token-string">'块级'</span>, b => b.<span class="token-function">block</span>().<span class="token-property">type</span>(<span class="token-string">'success'</span>));

<span class="token-comment">// 点击事件</span>
<span class="token-function">vButton</span>(<span class="token-string">'Toast'</span>, b => b
  .<span class="token-property">type</span>(<span class="token-string">'primary'</span>)
  .<span class="token-function">on</span>(<span class="token-string">'click'</span>, () => <span class="token-function">toast</span>.<span class="token-function">info</span>(<span class="token-string">'按钮被点击了！'</span>))
);`
);

// ============================================
// Form 表单组件演示
// ============================================
export const formDemo = demoWithCode(
  'VForm 表单组件',
  div(content => {
    // 输入框
    content.child(h3(h => h.text('输入框')));
    content.child(div(row => {
      row.styles({ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' });
      row.child(vInput(i => i.placeholder('普通输入框').styles({ width: '300px' })));
      row.child(vInput(i => i.placeholder('禁用状态').disabled().styles({ width: '300px' })));
      row.child(vInput(i => i.placeholder('错误状态').error().styles({ width: '300px' })));
      row.child(vInput(i => i.placeholder('加载中').loading().styles({ width: '300px' })));
    }));

    // 不同尺寸输入框
    content.child(h3(h => h.text('不同尺寸')));
    content.child(div(row => {
      row.styles({ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' });
      row.child(vInput(i => i.placeholder('大号输入框').size('large').styles({ width: '300px' })));
      row.child(vInput(i => i.placeholder('默认尺寸').size('default').styles({ width: '300px' })));
      row.child(vInput(i => i.placeholder('小号').size('small').styles({ width: '300px' })));
    }));

    // 选择框
    content.child(h3(h => h.text('选择框')));
    content.child(div(row => {
      row.styles({ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' });
      row.child(vSelect(s => {
        s.styles({ width: '200px' });
        s.options([
          { value: '1', label: '选项 1' },
          { value: '2', label: '选项 2' },
          { value: '3', label: '选项 3' },
        ]);
        s.value('1');
      }));
      row.child(vSelect(s => {
        s.styles({ width: '200px' });
        s.disabled();
        s.options([
          { value: '1', label: '禁用选项' },
        ]);
      }));
    }));

    // 文本域
    content.child(h3(h => h.text('多行文本')));
    content.child(div(row => {
      row.styles({ marginBottom: '20px' });
      row.child(vTextarea(t => {
        t.placeholder('请输入内容...');
        t.rows(4);
        t.styles({ width: '400px' });
      }));
    }));

    // 复选框和开关
    content.child(h3(h => h.text('复选框和开关')));
    content.child(div(row => {
      row.styles({ display: 'flex', gap: '24px', marginBottom: '20px', alignItems: 'center' });
      row.child(vCheckbox('同意协议', c => c.checked()));
      row.child(vCheckbox('记住我', c => c.disabled()));
      row.child(div(d => {
        d.styles({ display: 'flex', alignItems: 'center', gap: '8px' });
        d.child(span(s => s.text('开关关闭')));
        d.child(vSwitch());
        d.child(span(s => s.text('开关打开')));
        d.child(vSwitch(s => s.checked()));
      }));
    }));
  }),
  `
<span class="token-comment">// 输入框</span>
<span class="token-function">vInput</span>(i => i.<span class="token-property">placeholder</span>(<span class="token-string">'请输入...'</span>).<span class="token-property">styles</span>({ <span class="token-property">width</span>: <span class="token-string">'300px'</span> }));
<span class="token-function">vInput</span>(i => i.<span class="token-function">disabled</span>().<span class="token-property">placeholder</span>(<span class="token-string">'禁用状态'</span>));
<span class="token-function">vInput</span>(i => i.<span class="token-function">error</span>().<span class="token-property">placeholder</span>(<span class="token-string">'错误状态'</span>));
<span class="token-function">vInput</span>(i => i.<span class="token-function">loading</span>().<span class="token-property">placeholder</span>(<span class="token-string">'加载中'</span>));

<span class="token-comment">// 不同尺寸</span>
<span class="token-function">vInput</span>(i => i.<span class="token-property">size</span>(<span class="token-string">'large'</span>).<span class="token-property">placeholder</span>(<span class="token-string">'大号输入框'</span>));
<span class="token-function">vInput</span>(i => i.<span class="token-property">size</span>(<span class="token-string">'small'</span>).<span class="token-property">placeholder</span>(<span class="token-string">'小号输入框'</span>));

<span class="token-comment">// 选择框</span>
<span class="token-function">vSelect</span>(s => {
  s.<span class="token-property">styles</span>({ <span class="token-property">width</span>: <span class="token-string">'200px'</span> });
  s.<span class="token-function">options</span>([
    { <span class="token-property">value</span>: <span class="token-string">'1'</span>, <span class="token-property">label</span>: <span class="token-string">'选项 1'</span> },
    { <span class="token-property">value</span>: <span class="token-string">'2'</span>, <span class="token-property">label</span>: <span class="token-string">'选项 2'</span> },
  ]);
});

<span class="token-comment">// 多行文本</span>
<span class="token-function">vTextarea</span>(t => {
  t.<span class="token-property">placeholder</span>(<span class="token-string">'请输入内容...'</span>);
  t.<span class="token-property">rows</span>(<span class="token-number">4</span>);
  t.<span class="token-property">styles</span>({ <span class="token-property">width</span>: <span class="token-string">'400px'</span> });
});

<span class="token-comment">// 复选框</span>
<span class="token-function">vCheckbox</span>(<span class="token-string">'同意协议'</span>, c => c.<span class="token-function">checked</span>());

<span class="token-comment">// 开关</span>
<span class="token-function">vSwitch</span>();
<span class="token-function">vSwitch</span>(s => s.<span class="token-function">checked</span>());`
);

// ============================================
// Detail 详情展示组件演示
// ============================================
export const detailDemo = demoWithCode(
  'VDetail 详情展示',
  div(content => {
    // 基础详情
    content.child(h3(h => h.text('基础详情（3 列）')));
    content.child(vDetail(d => {
      d.styles({ marginBottom: '24px' });
      d.title('用户信息');
      d.column(3);
      d.item('姓名', '张三');
      d.item('年龄', '25');
      d.item('城市', '北京');
      d.item('职业', '工程师');
      d.item('公司', '某科技公司');
      d.item('邮箱', 'zhangsan@example.com');
    }));

    // 单列详情
    content.child(h3(h => h.text('单列详情')));
    content.child(vDetail(d => {
      d.styles({ marginBottom: '24px' });
      d.title('订单详情');
      d.column(1);
      d.item('订单号', 'ORD-2024-001');
      d.item('下单时间', '2024-01-15 14:30:00');
      d.item('订单状态', '已完成');
      d.item('收货地址', '北京市朝阳区某某街道某某小区');
    }));

    // 带边框
    content.child(h3(h => h.text('带边框样式')));
    content.child(vDetail(d => {
      d.styles({ marginBottom: '24px' });
      d.title('产品信息');
      d.column(2);
      d.bordered();
      d.item('产品名称', 'Yoya.Basic DSL 库');
      d.item('版本号', 'v1.0.0');
      d.item('开发语言', 'JavaScript ES6+');
      d.item('运行环境', '浏览器原生');
    }));
  }),
  `
<span class="token-comment">// 基础详情（3 列）</span>
<span class="token-function">vDetail</span>(d => {
  d.<span class="token-property">title</span>(<span class="token-string">'用户信息'</span>);
  d.<span class="token-property">column</span>(<span class="token-number">3</span>);
  d.<span class="token-function">item</span>(<span class="token-string">'姓名'</span>, <span class="token-string">'张三'</span>);
  d.<span class="token-function">item</span>(<span class="token-string">'年龄'</span>, <span class="token-string">'25'</span>);
  d.<span class="token-function">item</span>(<span class="token-string">'城市'</span>, <span class="token-string">'北京'</span>);
});

<span class="token-comment">// 单列详情</span>
<span class="token-function">vDetail</span>(d => {
  d.<span class="token-property">title</span>(<span class="token-string">'订单详情'</span>);
  d.<span class="token-property">column</span>(<span class="token-number">1</span>);
  d.<span class="token-function">item</span>(<span class="token-string">'订单号'</span>, <span class="token-string">'ORD-2024-001'</span>);
  d.<span class="token-function">item</span>(<span class="token-string">'下单时间'</span>, <span class="token-string">'2024-01-15 14:30:00'</span>);
});

<span class="token-comment">// 带边框</span>
<span class="token-function">vDetail</span>(d => {
  d.<span class="token-property">title</span>(<span class="token-string">'产品信息'</span>);
  d.<span class="token-property">column</span>(<span class="token-number">2</span>);
  d.<span class="token-function">bordered</span>();
  d.<span class="token-function">item</span>(<span class="token-string">'产品名称'</span>, <span class="token-string">'Yoya.Basic DSL 库'</span>);
  d.<span class="token-function">item</span>(<span class="token-string">'版本号'</span>, <span class="token-string">'v1.0.0'</span>);
});`
);

// ============================================
// Field 可编辑字段组件演示
// ============================================
export const fieldDemo = demoWithCode(
  'VField 可编辑字段',
  div(content => {
    // 动态设置值演示
    content.child(h3(h => h.text('动态设置值')));
    content.child(div(row => {
      row.styles({ marginBottom: '20px', alignItems: 'center', gap: '12px' });

      // 可设置值的字段
      const nameField = vField(f => {
        f.showContent((container, value) => {
          container.text(value || '张三');
        });
        f.editContent((container, setValue) => {
          container.child(vInput(i => {
            i.placeholder('请输入用户名');
            i.value('张三');
            i.onInput((input) => {
              setValue(input.value());
            });
          }));
        });
        f.onSave((newValue) => {
          toast.success(`名字已更新为：${newValue}`);
          return Promise.resolve();
        });
      });
      row.child(nameField);

      // 设置值按钮
      row.child(vButton('设置为 "李四"', b => {
        b.type('primary');
        b.size('small');
        b.on('click', () => {
          nameField.setValue('李四');
          toast.info('值已设置为 "李四"');
        });
      }));

      row.child(vButton('设置为 "王五"', b => {
        b.type('default');
        b.size('small');
        b.on('click', () => {
          nameField.setValue('王五');
          toast.info('值已设置为 "王五"');
        });
      }));
    }));

    // 基础编辑字段（手动保存）
    content.child(h3(h => h.text('手动保存模式')));
    content.child(div(row => {
      row.styles({ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' });

      // 用户名字段
      row.child(vField(f => {
        f.showContent((container, value) => {
          
          container.text(value || '张三');
        });
        f.editContent((container, setValue) => {
          container.child(vInput(i => {
            i.placeholder('请输入用户名');
            i.value('张三');
            i.onInput((input) => {
              console.log(input.value())
              setValue(input.value());
            });
          }));
        });
        f.onSave((newValue) => {
          toast.success(`名字已更新为：${newValue}`);
          return Promise.resolve();
        });
      }));

      // 价格字段
      row.child(vField(f => {
        f.showContent((container, value) => {
          container.text('¥ ' + (value || '199.00'));
        });
        f.editContent((container, setValue) => {
          container.child(vInput(i => {
            i.placeholder('请输入价格');
            i.value('199.00');
            i.type('number');
            i.onInput((input) => {
              setValue(input.value());
            });
          }));
        });
        f.onSave(() => {
          toast.success('价格已更新');
        });
      }));
    }));

    // 自动保存模式
    content.child(h3(h => h.text('自动保存模式（无按钮）')));
    content.child(div(row => {
      row.styles({ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' });

      // 自动保存字段
      const autoField = vField(f => {
        f.autoSave(true);  // 开启自动保存
        f.showContent((container, value) => {
          container.text(value || '点击编辑...');
        });
        f.editContent((container, setValue) => {
          container.child(vInput(i => {
            i.placeholder('请输入内容');
            i.value('');
            i.onInput(e=>{
              setValue(e.target.value)
            })
          }));
        });
        f.onSave((newValue) => {
          toast.success(`自动保存：${newValue}`);
          return Promise.resolve();
        });
      });
      row.child(autoField);

      // 设置值按钮
      row.child(div(btnRow => {
        btnRow.styles({ display: 'flex', gap: '8px' });
        btnRow.child(vButton('设置值 A', b => {
          b.type('primary');
          b.size('small');
          b.on('click', () => {
            autoField.setValue('内容 A');
            toast.info('值已设置为 "内容 A"');
          });
        }));
        btnRow.child(vButton('设置值 B', b => {
          b.type('default');
          b.size('small');
          b.on('click', () => {
            autoField.setValue('内容 B');
            toast.info('值已设置为 "内容 B"');
          });
        }));
      }));
    }));

    // 多行文本编辑
    content.child(h3(h => h.text('多行文本编辑')));
    content.child(div(row => {
      row.styles({ marginBottom: '20px' });
      row.child(vField(f => {
        f.styles({ width: '400px', display: 'inline-block' });
        f.showContent((container, value) => {
          container.text(value || '点击编辑个人简介...');
        });
        f.editContent((container, setValue) => {
          container.child(vTextarea(t => {
            t.placeholder('请输入个人简介...');
            t.value('');
            t.rows(3);
            t.onInput((textarea) => {
              setValue(textarea.value());
            });
          }));
        });
        f.onSave(() => {
          toast.success('简介已更新');
          return Promise.resolve();
        });
      }));
    }));

    // 禁用状态
    content.child(h3(h => h.text('禁用状态')));
    content.child(div(row => {
      row.styles({ marginBottom: '20px' });
      row.child(vField(f => {
        f.showContent((container, value) => {
          container.text('此字段不可编辑');
        });
        f.disabled();
      }));
    }));
  }),
  `
<span class="token-comment">// 动态设置值</span>
<span class="token-keyword">const</span> field = <span class="token-function">vField</span>(f => {
  f.<span class="token-function">showContent</span>((container, value) => {
    container.<span class="token-function">text</span>(value || <span class="token-string">'张三'</span>);
  });
  f.<span class="token-function">editContent</span>((container, setValue) => {
    container.<span class="token-function">child</span>(<span class="token-function">vInput</span>(i => {
      i.<span class="token-property">placeholder</span>(<span class="token-string">'请输入用户名'</span>);
      i.<span class="token-function">onInput</span>(() => {
        <span class="token-function">setValue</span>(i.<span class="token-function">value</span>());
      });
    }));
  });
  f.<span class="token-function">onSave</span>((newValue) => {
    <span class="token-function">toast</span>.<span class="token-function">success</span>(<span class="token-string">'名字已更新'</span>);
  });
});

<span class="token-comment">// 设置值</span>
field.<span class="token-function">setValue</span>(<span class="token-string">'李四'</span>);

<span class="token-comment">// 手动保存模式</span>
<span class="token-function">vField</span>(f => {
  f.<span class="token-function">showContent</span>((container, value) => {
    container.<span class="token-function">text</span>(value || <span class="token-string">'张三'</span>);
  });
  f.<span class="token-function">editContent</span>((container, setValue) => {
    container.<span class="token-function">child</span>(<span class="token-function">vInput</span>(i => {
      i.<span class="token-property">placeholder</span>(<span class="token-string">'请输入用户名'</span>);
      i.<span class="token-function">onInput</span>(() => {
        <span class="token-function">setValue</span>(i.<span class="token-function">value</span>());
      });
    }));
  });
  f.<span class="token-function">onSave</span>((newValue, oldValue) => {
    <span class="token-function">toast</span>.<span class="token-function">success</span>(<span class="token-string">'保存成功'</span>);
    <span class="token-keyword">return</span> Promise.<span class="token-function">resolve</span>();
  });
});

<span class="token-comment">// 自动保存模式（无按钮）</span>
<span class="token-function">vField</span>(f => {
  f.<span class="token-function">autoSave</span>(<span class="token-keyword">true</span>);
  f.<span class="token-function">showContent</span>((container, value) => {
    container.<span class="token-function">text</span>(value || <span class="token-string">'点击编辑...'</span>);
  });
  f.<span class="token-function">editContent</span>((container, setValue) => {
    container.<span class="token-function">child</span>(<span class="token-function">vInput</span>(i => {
      i.<span class="token-property">placeholder</span>(<span class="token-string">'请输入内容'</span>);
      i.<span class="token-function">onInput</span>(() => {
        <span class="token-function">setValue</span>(i.<span class="token-function">value</span>());
      });
    }));
  });
  f.<span class="token-function">onSave</span>((newValue) => {
    <span class="token-function">toast</span>.<span class="token-function">success</span>(<span class="token-string">'自动保存成功'</span>);
  });
});

<span class="token-comment">// 多行文本编辑</span>
<span class="token-function">vField</span>(f => {
  f.<span class="token-function">showContent</span>((container, value) => {
    container.<span class="token-function">text</span>(value || <span class="token-string">'点击编辑...'</span>);
  });
  f.<span class="token-function">editContent</span>((container, setValue) => {
    container.<span class="token-function">child</span>(<span class="token-function">vTextarea</span>(t => {
      t.<span class="token-property">rows</span>(<span class="token-number">3</span>);
      t.<span class="token-function">onInput</span>(() => {
        <span class="token-function">setValue</span>(t.<span class="token-function">value</span>());
      });
    }));
  });
  f.<span class="token-function">onSave</span>(() => {
    <span class="token-function">toast</span>.<span class="token-function">success</span>(<span class="token-string">'简介已更新'</span>);
  });
});`
);

// ============================================
// 合同详情演示（使用 VField）
// ============================================
export const contractDemo = demoWithCode(
  '合同详情（VField）',
  div(content => {
    content.styles({ maxWidth: '800px' });

    // 合同基本信息
    content.child(h3(h => h.text('合同基本信息')));
    content.child(div(row => {
      row.styles({ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' });

      // 合同编号（不可编辑 - disabled）
      row.child(vField(f => {
        f.styles({ width: '100%', maxWidth: '600px' });
        f.showContent((container, value) => {
          container.text(value || 'HT-2024-001234');
        });
        f.editContent((container, setValue) => {
          container.child(vInput(i => {
            i.placeholder('合同编号不可编辑');
            i.value('HT-2024-001234');
            i.disabled();
          }));
        });
        f.disabled(true);  // 禁用编辑
        f.setValue('HT-2024-001234');
      }));

      // 合同名称（可编辑）
      row.child(vField(f => {
        f.styles({ width: '100%', maxWidth: '600px' });
        f.showContent((container, value) => {
          container.text(value || '软件开发服务合同');
        });
        f.editContent((container, setValue) => {
          container.child(vInput(i => {
            i.placeholder('请输入合同名称');
            i.value('软件开发服务合同');
            i.styles({ width: '100%' });
            i.onInput(() => setValue(i.value()));
          }));
        });
        f.onSave((newValue) => {
          toast.success('合同名称已更新：' + newValue);
          return Promise.resolve();
        });
        f.setValue('软件开发服务合同');
      }));

      // 合同类型（下拉选择）
      row.child(vField(f => {
        f.styles({ width: '100%', maxWidth: '600px' });
        const initialValue = 'development';
        f.showContent((container, value) => {
          const typeMap = {
            'development': '软件开发合同',
            'service': '技术服务合同',
            'maintenance': '系统维护合同',
            'consulting': '技术咨询合同',
            'other': '其他合同',
          };
          container.text(typeMap[value] || '请选择合同类型');
        });
        f.editContent((container, setValue) => {
          container.child(vSelect(s => {
            s.styles({ width: '100%' });
            s.options([
              { value: '', label: '请选择合同类型' },
              { value: 'development', label: '软件开发合同' },
              { value: 'service', label: '技术服务合同' },
              { value: 'maintenance', label: '系统维护合同' },
              { value: 'consulting', label: '技术咨询合同' },
              { value: 'other', label: '其他合同' },
            ]);
            s.value(initialValue);
            s.onChange(() => setValue(s.value()));
          }));
        });
        f.onSave((newValue) => {
          toast.success('合同类型已更新：' + newValue);
          return Promise.resolve();
        });
        f.setValue(initialValue);
      }));

      // 合同金额
      row.child(vField(f => {
        f.styles({ width: '100%', maxWidth: '600px' });
        f.showContent((container, value) => {
          container.text('¥ ' + (value || '100000.00'));
        });
        f.editContent((container, setValue) => {
          container.child(div(wrapper => {
            wrapper.styles({ display: 'flex', alignItems: 'center', gap: '8px' });
            wrapper.child(vInput(i => {
              i.placeholder('请输入金额');
              i.value('100000.00');
              i.type('number');
              i.styles({ width: '200px' });
              i.onInput(() => setValue(i.value()));
            }));
            wrapper.child(span(unit => {
              unit.styles({ color: '#666', fontSize: '14px' });
              unit.text('元');
            }));
          }));
        });
        f.onSave((newValue) => {
          toast.success('合同金额已更新：¥' + newValue);
          return Promise.resolve();
        });
        f.setValue('100000.00');
      }));
    }));

    // 合同双方信息
    content.child(h3(h => h.text('合同双方信息')));
    content.child(div(row => {
      row.styles({ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' });

      // 甲方单位
      row.child(vField(f => {
        f.styles({ width: '100%', maxWidth: '600px' });
        f.showContent((container, value) => {
          container.text(value || '北京某某科技有限公司');
        });
        f.editContent((container, setValue) => {
          container.child(vInput(i => {
            i.placeholder('请输入甲方单位名称');
            i.value('北京某某科技有限公司');
            i.styles({ width: '100%' });
            i.onInput(() => setValue(i.value()));
          }));
        });
        f.onSave((newValue) => {
          toast.success('甲方单位已更新：' + newValue);
          return Promise.resolve();
        });
        f.setValue('北京某某科技有限公司');
      }));

      // 甲方联系人
      row.child(vField(f => {
        f.styles({ width: '100%', maxWidth: '600px' });
        f.showContent((container, value) => {
          container.text(value || '张三');
        });
        f.editContent((container, setValue) => {
          container.child(vInput(i => {
            i.placeholder('请输入联系人姓名');
            i.value('张三');
            i.styles({ width: '200px' });
            i.onInput(() => setValue(i.value()));
          }));
        });
        f.onSave((newValue) => {
          toast.success('甲方联系人已更新：' + newValue);
          return Promise.resolve();
        });
        f.setValue('张三');
      }));

      // 甲方联系电话
      row.child(vField(f => {
        f.styles({ width: '100%', maxWidth: '600px' });
        f.showContent((container, value) => {
          container.text(value || '13800138000');
        });
        f.editContent((container, setValue) => {
          container.child(vInput(i => {
            i.placeholder('请输入联系电话');
            i.value('13800138000');
            i.styles({ width: '200px' });
            i.onInput(() => setValue(i.value()));
          }));
        });
        f.onSave((newValue) => {
          toast.success('联系电话已更新：' + newValue);
          return Promise.resolve();
        });
        f.setValue('13800138000');
      }));

      // 乙方单位
      row.child(vField(f => {
        f.styles({ width: '100%', maxWidth: '600px' });
        f.showContent((container, value) => {
          container.text(value || '上海某某网络科技公司');
        });
        f.editContent((container, setValue) => {
          container.child(vInput(i => {
            i.placeholder('请输入乙方单位名称');
            i.value('上海某某网络科技公司');
            i.styles({ width: '100%' });
            i.onInput(() => setValue(i.value()));
          }));
        });
        f.onSave((newValue) => {
          toast.success('乙方单位已更新：' + newValue);
          return Promise.resolve();
        });
        f.setValue('上海某某网络科技公司');
      }));

      // 乙方联系人
      row.child(vField(f => {
        f.styles({ width: '100%', maxWidth: '600px' });
        f.showContent((container, value) => {
          container.text(value || '李四');
        });
        f.editContent((container, setValue) => {
          container.child(vInput(i => {
            i.placeholder('请输入联系人姓名');
            i.value('李四');
            i.styles({ width: '200px' });
            i.onInput(() => setValue(i.value()));
          }));
        });
        f.onSave((newValue) => {
          toast.success('乙方联系人已更新：' + newValue);
          return Promise.resolve();
        });
        f.setValue('李四');
      }));

      // 乙方联系电话
      row.child(vField(f => {
        f.styles({ width: '100%', maxWidth: '600px' });
        f.showContent((container, value) => {
          container.text(value || '13900139000');
        });
        f.editContent((container, setValue) => {
          container.child(vInput(i => {
            i.placeholder('请输入联系电话');
            i.value('13900139000');
            i.styles({ width: '200px' });
            i.onInput(() => setValue(i.value()));
          }));
        });
        f.onSave((newValue) => {
          toast.success('联系电话已更新：' + newValue);
          return Promise.resolve();
        });
        f.setValue('13900139000');
      }));
    }));

    // 合同期限
    content.child(h3(h => h.text('合同期限')));
    content.child(div(row => {
      row.styles({ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' });

      // 合同期限（日期范围）
      row.child(vField(f => {
        f.styles({ width: '100%', maxWidth: '600px' });
        const initialValue = { startDate: '2024-01-01', endDate: '2024-12-31', months: '12' };
        let currentValue = { ...initialValue };  // 使用闭包变量跟踪当前值

        f.showContent((container, value) => {
          const startDate = value?.startDate || '2024-01-01';
          const endDate = value?.endDate || '2024-12-31';
          const months = value?.months || '12';
          container.text(startDate + ' 至 ' + endDate + '（共 ' + months + ' 个月）');
        });
        f.editContent((container, setValue) => {
          container.child(div(wrapper => {
            wrapper.styles({ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' });

            wrapper.child(vInput(i => {
              i.type('date');
              i.value(currentValue.startDate);
              i.styles({ width: '150px' });
              i.onInput(() => {
                currentValue.startDate = i.value();
                setValue({ ...currentValue });
              });
            }));

            wrapper.child(span(to => {
              to.styles({ color: '#666' });
              to.text('至');
            }));

            wrapper.child(vInput(i => {
              i.type('date');
              i.value(currentValue.endDate);
              i.styles({ width: '150px' });
              i.onInput(() => {
                currentValue.endDate = i.value();
                setValue({ ...currentValue });
              });
            }));

            wrapper.child(span(unit => {
              unit.styles({ color: '#666' });
              unit.text('共');
            }));

            wrapper.child(vInput(i => {
              i.type('number');
              i.value(currentValue.months);
              i.styles({ width: '80px' });
              i.onInput(() => {
                currentValue.months = i.value();
                setValue({ ...currentValue });
              });
            }));

            wrapper.child(span(unit => {
              unit.styles({ color: '#666' });
              unit.text('个月');
            }));
          }));
        });
        f.onSave((newValue) => {
          toast.success('合同期限已更新：' + newValue.startDate + ' 至 ' + newValue.endDate);
          return Promise.resolve();
        });
        f.setValue(initialValue);
      }));
    }));

    // 合同条款选项（使用 VCheckboxes）
    content.child(h3(h => h.text('合同条款选项')));
    content.child(div(row => {
      row.styles({ marginBottom: '20px' });

      row.child(vField(f => {
        f.styles({ width: '100%' });
        const initialValue = ['confidential', 'ip', 'breach', 'dispute'];

        // 选项定义
        const clauseOptions = [
          { value: 'confidential', label: '包含保密条款' },
          { value: 'ip', label: '包含知识产权条款' },
          { value: 'breach', label: '包含违约责任条款' },
          { value: 'dispute', label: '包含争议解决条款' },
          { value: 'legal', label: '需要法律审核' },
          { value: 'archived', label: '已归档' },
        ];

        // 显示模式：显示已选中的条款
        f.showContent((container, value) => {
          const selectedLabels = clauseOptions
            .filter(opt => value && value.includes(opt.value))
            .map(opt => '✓ ' + opt.label);
          if (selectedLabels.length === 0) {
            container.text('未选择任何条款');
          } else {
            container.child(div(list => {
              list.styles({ display: 'flex', flexWrap: 'wrap', gap: '8px' });
              selectedLabels.forEach(label => {
                list.child(span(item => {
                  item.styles({
                    background: '#e8f5e9',
                    color: '#2e7d32',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '14px',
                  });
                  item.text(label);
                }));
              });
            }));
          }
        });

        // 编辑模式：使用 VCheckboxes
        f.editContent((container, setValue) => {
          container.child(vCheckboxes(cb => {
            cb.options(clauseOptions);
            cb.multiple(true);
            cb.value(initialValue);
            cb.layout('grid');
            cb.columns(2);
            cb.onChange((values) => {
              console.log(values)
              setValue(values);
            });
          }));
        });

        f.onSave((newValue) => {
          const selectedLabels = clauseOptions
            .filter(opt => newValue && newValue.includes(opt.value))
            .map(opt => opt.label);
          toast.success('已更新条款：' + (selectedLabels.length > 0 ? selectedLabels.join('、') : '无'));
          return Promise.resolve();
        });

        f.setValue(initialValue);
      }));
    }));

    // 合同描述（多行文本 - VTextarea）
    content.child(h3(h => h.text('合同描述')));
    content.child(div(row => {
      row.styles({ marginBottom: '20px' });
      row.child(vField(f => {
        f.styles({ width: '100%', maxWidth: '700px', display: 'inline-block' });
        const initialValue = '本合同用于约定软件开发服务的相关条款，包括软件需求分析、设计、编码、测试、部署及后期维护等内容。服务方应按照合同约定的时间和质量要求完成软件开发工作。';
        f.showContent((container, value) => {
          const text = value || '本合同用于约定软件开发服务的相关条款...';
          container.text(text.length > 50 ? text.substring(0, 50) + '...' : text);
        });
        f.editContent((container, setValue) => {
          container.child(vTextarea(t => {
            t.placeholder('请输入合同详细描述...');
            t.value(initialValue);
            t.rows(5);  // VTextarea 默认占用更大范围
            t.styles({ width: '100%' });
            t.onInput(() => setValue(t.value()));
          }));
        });
        f.onSave((newValue) => {
          toast.success('合同描述已更新');
          return Promise.resolve();
        });
        f.setValue(initialValue);
      }));
    }));

    // 付款方式
    content.child(h3(h => h.text('付款方式')));
    content.child(div(row => {
      row.styles({ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' });

      // 付款方式（下拉选择）
      row.child(vField(f => {
        f.styles({ width: '100%', maxWidth: '600px' });
        const initialValue = 'installment';
        f.showContent((container, value) => {
          const typeMap = {
            'lump': '一次性付款',
            'installment': '分期付款',
            'milestone': '按里程碑付款',
            'monthly': '按月付款',
          };
          container.text(typeMap[value] || '请选择付款方式');
        });
        f.editContent((container, setValue) => {
          container.child(vSelect(s => {
            s.styles({ width: '100%' });
            s.options([
              { value: '', label: '请选择付款方式' },
              { value: 'lump', label: '一次性付款' },
              { value: 'installment', label: '分期付款' },
              { value: 'milestone', label: '按里程碑付款' },
              { value: 'monthly', label: '按月付款' },
            ]);
            s.value(initialValue);
            s.onChange(() => setValue(s.value()));
          }));
        });
        f.onSave((newValue) => {
          toast.success('付款方式已更新：' + newValue);
          return Promise.resolve();
        });
        f.setValue(initialValue);
      }));

      // 付款说明（多行文本 - VTextarea 占用更大范围）
      row.child(vField(f => {
        f.styles({ width: '100%', maxWidth: '600px' });
        const initialValue = '首付款 30%，项目中期验收后支付 40%，项目最终验收合格后支付尾款 30%。';
        f.showContent((container, value) => {
          const text = value || '首付款 30%，项目中期验收后支付 40%...';
          container.text(text.length > 40 ? text.substring(0, 40) + '...' : text);
        });
        f.editContent((container, setValue) => {
          container.child(vTextarea(t => {
            t.placeholder('请输入付款说明...');
            t.value(initialValue);
            t.rows(3);  // VTextarea 占用更大的编辑范围
            t.styles({ width: '100%' });
            t.onInput(() => setValue(t.value()));
          }));
        });
        f.onSave((newValue) => {
          toast.success('付款说明已更新');
          return Promise.resolve();
        });
        f.setValue(initialValue);
      }));
    }));
  }),
  `
<span class="token-comment">// 合同编号（不可编辑 - disabled）</span>
<span class="token-function">vField</span>(f => {
  f.<span class="token-function">disabled</span>(<span class="token-keyword">true</span>);  <span class="token-comment">// 禁用编辑</span>
  f.<span class="token-function">value</span>(<span class="token-string">'HT-2024-001234'</span>);
  f.<span class="token-function">showContent</span>((container, value) => {
    container.<span class="token-function">text</span>(value);
  });
  f.<span class="token-function">editContent</span>((container, setValue) => {
    container.<span class="token-function">child</span>(<span class="token-function">vInput</span>(i => {
      i.<span class="token-function">disabled</span>();  <span class="token-comment">// 内部输入框也禁用</span>
    }));
  });
});

<span class="token-comment">// 合同名称（可编辑）</span>
<span class="token-function">vField</span>(f => {
  f.<span class="token-function">value</span>(<span class="token-string">'软件开发服务合同'</span>);
  f.<span class="token-function">showContent</span>((container, value) => {
    container.<span class="token-function">text</span>(value);
  });
  f.<span class="token-function">editContent</span>((container, setValue) => {
    container.<span class="token-function">child</span>(<span class="token-function">vInput</span>(i => {
      i.<span class="token-property">value</span>(value);
      i.<span class="token-function">onInput</span>(() => <span class="token-function">setValue</span>(i.<span class="token-function">value</span>()));
    }));
  });
  f.<span class="token-function">onSave</span>((newValue) => {
    <span class="token-function">toast</span>.<span class="token-function">success</span>(<span class="token-string">'名称已更新：' + newValue</span>);
  });
});

<span class="token-comment">// 合同类型（VSelect 下拉选择）</span>
<span class="token-function">vField</span>(f => {
  f.<span class="token-function">editContent</span>((container, setValue) => {
    container.<span class="token-function">child</span>(<span class="token-function">vSelect</span>(s => {
      s.<span class="token-function">options</span>([
        { <span class="token-property">value</span>: <span class="token-string">'development'</span>, <span class="token-property">label</span>: <span class="token-string">'软件开发合同'</span> },
        { <span class="token-property">value</span>: <span class="token-string">'service'</span>, <span class="token-property">label</span>: <span class="token-string">'技术服务合同'</span> },
      ]);
      s.<span class="token-function">onChange</span>(() => <span class="token-function">setValue</span>(s.<span class="token-function">value</span>()));
    }));
  });
});

<span class="token-comment">// 合同描述（VTextarea 多行文本，占用更大范围）</span>
<span class="token-function">vField</span>(f => {
  f.<span class="token-function">editContent</span>((container, setValue) => {
    container.<span class="token-function">child</span>(<span class="token-function">vTextarea</span>(t => {
      t.<span class="token-property">rows</span>(<span class="token-number">5</span>);  <span class="token-comment">// 5 行，比 VInput 占用更大</span>
      t.<span class="token-function">onInput</span>(() => <span class="token-function">setValue</span>(t.<span class="token-function">value</span>()));
    }));
  });
});

<span class="token-comment">// 合同条款选项（VCheckboxes 多选框组）</span>
<span class="token-function">vField</span>(f => {
  f.<span class="token-function">editContent</span>((container, setValue) => {
    container.<span class="token-function">child</span>(<span class="token-function">vCheckboxes</span>(cb => {
      cb.<span class="token-function">options</span>([
        { <span class="token-property">value</span>: <span class="token-string">'confidential'</span>, <span class="token-property">label</span>: <span class="token-string">'包含保密条款'</span> },
        { <span class="token-property">value</span>: <span class="token-string">'ip'</span>, <span class="token-property">label</span>: <span class="token-string">'包含知识产权条款'</span> },
        { <span class="token-property">value</span>: <span class="token-string">'breach'</span>, <span class="token-property">label</span>: <span class="token-string">'包含违约责任条款'</span> },
        { <span class="token-property">value</span>: <span class="token-string">'dispute'</span>, <span class="token-property">label</span>: <span class="token-string">'包含争议解决条款'</span> },
        { <span class="token-property">value</span>: <span class="token-string">'legal'</span>, <span class="token-property">label</span>: <span class="token-string">'需要法律审核'</span> },
        { <span class="token-property">value</span>: <span class="token-string">'archived'</span>, <span class="token-property">label</span>: <span class="token-string">'已归档'</span> },
      ]);
      cb.<span class="token-function">multiple</span>(<span class="token-keyword">true</span>);  <span class="token-comment">// 多选模式</span>
      cb.<span class="token-function">layout</span>(<span class="token-string">'grid'</span>);      <span class="token-comment">// 网格布局</span>
      cb.<span class="token-function">columns</span>(<span class="token-number">2</span>);        <span class="token-comment">// 2 列显示</span>
      cb.<span class="token-function">onChange</span>((values) => <span class="token-function">setValue</span>(values));
    }));
  });
});`
);

// ============================================
// 初始化应用
// ============================================
export function initApp() {
  const app = document.getElementById('app');

  if (!app) {
    console.error('未找到 #app 元素');
    return;
  }

  // 渲染所有演示区域
  const container = div(c => {
    c.child(buttonDemo);
    c.child(formDemo);
    c.child(detailDemo);
    c.child(fieldDemo);
    c.child(contractDemo);
  });
  container.bindTo('#app');
}

// 自动初始化
initApp();
