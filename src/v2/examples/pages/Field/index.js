/**
 * Yoya.Basic V2 - Field Demo Page
 * vField 可编辑字段组件演示，配合 vDetail 展示
 */

import { vstack, div } from '../../../../yoya/index.js';
import { vField, vDetail, toast } from '../../../../yoya/index.js';
import { AppShell } from '../../framework/AppShell.js';
import { CodeDemo } from '../../components/CodeDemo.js';
import { DocSection } from '../../components/DocSection.js';
import { PageHeader } from '../../components/PageHeader.js';

/**
 * 创建 Field 演示页面
 */
export function createFieldPage() {
  const tocItems = [
    { text: '基础用法', href: '#basic', level: 1 },
    { text: '对象配置', href: '#object', level: 1 },
    { text: '配合 Detail 使用', href: '#detail', level: 1 },
    { text: '只读模式', href: '#readonly', level: 1 },
    { text: '自动保存', href: '#autoSave', level: 1 },
  ];

  return AppShell({
    currentPage: 'field.html',
    tocItems,
    content: (content) => {
      content.child(PageHeader({
        title: 'Field 可编辑字段',
        description: 'vField 组件用于创建可编辑的字段，支持点击切换编辑模式，可配合 vDetail 使用。',
      }));

      content.child(DocSection('basic', '基础用法', [
        CodeDemo('基础可编辑字段',
          vstack(s => {
            s.gap('16px');
            s.child(vField(f => {
              f.showContent((c, value) => {
                c.text(value || '张三');
              });
              f.editContent((c, setValue) => {
                c.vInput(i => {
                  i.placeholder('请输入姓名');
                  i.type('text');
                  i.onInput(({ value }) => setValue(value));
                });
              });
              f.onSave(({ value }) => {
                toast.success(`保存成功：${value}`);
              });
            }));
          }),
          `vField(f => {
  f.showContent((c, value) => {
    c.text(value || '张三')
  })
  f.editContent((c, setValue) => {
    c.vInput(i => {
      i.placeholder('请输入姓名')
      i.type('text')
      i.onInput(({ value }) => setValue(value))
    })
  })
  f.onSave(({ value }) => {
    toast.success(\`保存成功：\${value}\`)
  })
})`
        ),
      ]));

      content.child(DocSection('object', '对象配置', [
        CodeDemo('对象配置方式',
          vstack(s => {
            s.gap('16px');
            s.child(vField({
              placeholder: '点击编辑',
              showContent: (c, value) => {
                c.text(value || '李四');
              },
              editContent: (c, setValue) => {
                c.vInput(i => {
                  i.placeholder('请输入姓名');
                  i.type('text');
                  i.onInput(({ value }) => setValue(value));
                });
              },
              onSave: ({ value }) => {
                toast.success(`保存成功：${value}`);
              }
            }));
          }),
          `// 对象配置方式
vField({
  placeholder: '点击编辑',
  showContent: (c, value) => {
    c.text(value || '李四')
  },
  editContent: (c, setValue) => {
    c.vInput(i => {
      i.placeholder('请输入姓名')
      i.type('text')
      i.onInput(({ value }) => setValue(value))
    })
  },
  onSave: ({ value }) => {
    toast.success(\`保存成功：\${value}\`)
  }
})`
        ),
      ]));

      content.child(DocSection('detail', '配合 Detail 使用', [
        CodeDemo('在详情展示中使用可编辑字段',
          vDetail(d => {
            d.column(1);
            d.item('用户名', vField(f => {
              f.showContent((c, value) => {
                c.text(value || 'zhangsan');
              });
              f.editContent((c, setValue) => {
                c.vInput(i => {
                  i.placeholder('请输入用户名');
                  i.type('text');
                  i.onInput(({ value }) => setValue(value));
                });
              });
              f.onSave(({ value }) => {
                toast.success(`用户名已更新：${value}`);
              });
            }));
            d.item('邮箱', vField(f => {
              f.showContent((c, value) => {
                c.text(value || 'zhangsan@example.com');
              });
              f.editContent((c, setValue) => {
                c.vInput(i => {
                  i.placeholder('请输入邮箱');
                  i.type('email');
                  i.onInput(({ value }) => setValue(value));
                });
              });
              f.onSave(({ value }) => {
                toast.success(`邮箱已更新：${value}`);
              });
            }));
            d.item('手机', vField(f => {
              f.showContent((c, value) => {
                c.text(value || '138****1234');
              });
              f.editContent((c, setValue) => {
                c.vInput(i => {
                  i.placeholder('请输入手机号');
                  i.type('text');
                  i.onInput(({ value }) => setValue(value));
                });
              });
              f.onSave(({ value }) => {
                toast.success(`手机号已更新：${value}`);
              });
            }));
          }),
          `vDetail(d => {
  d.column(1)
  d.item('用户名', vField(f => {
    f.showContent((c, value) => {
      c.text(value || 'zhangsan')
    })
    f.editContent((c, setValue) => {
      c.vInput(i => {
        i.placeholder('请输入用户名')
        i.type('text')
        i.onInput(({ value }) => setValue(value))
      })
    })
    f.onSave(({ value }) => {
      toast.success(\`用户名已更新：\${value}\`)
    })
  }))
  d.item('邮箱', vField(f => {
    f.showContent((c, value) => {
      c.text(value || 'zhangsan@example.com')
    })
    f.editContent((c, setValue) => {
      c.vInput(i => {
        i.placeholder('请输入邮箱')
        i.type('email')
        i.onInput(({ value }) => setValue(value))
      })
    })
    f.onSave(({ value }) => {
      toast.success(\`邮箱已更新：\${value}\`)
    })
  }))
})`
        ),
      ]));

      content.child(DocSection('readonly', '只读模式', [
        CodeDemo('只读字段',
          vstack(s => {
            s.gap('16px');
            s.child(vField(f => {
              f.showContent((c, value) => {
                c.text(value || '悬停显示编辑标识');
              });
              f.editContent((c, setValue) => {
                c.vInput(i => {
                  i.placeholder('请输入内容');
                  i.type('text');
                  i.onInput(({ value }) => setValue(value));
                });
              });
              f.placeholder('点击编辑');
            }));
            s.child(vField(f => {
              f.showContent((c, value) => {
                c.text(value || '只读字段，无编辑标识');
              });
              f.editable(false);
            }));
          }),
          `// 可编辑字段（悬停显示编辑标识）
vField(f => {
  f.showContent((c, value) => {
    c.text(value || '悬停显示编辑标识')
  })
  f.editContent((c, setValue) => {
    c.vInput(i => {
      i.placeholder('请输入内容')
      i.type('text')
      i.onInput(({ value }) => setValue(value))
    })
  })
  f.placeholder('点击编辑')
})

// 只读字段（隐藏编辑标识）
vField(f => {
  f.showContent((c, value) => {
    c.text(value || '只读字段，无编辑标识')
  })
  f.editable(false)
})`
        ),
      ]));

      content.child(DocSection('autoSave', '自动保存', [
        CodeDemo('自动保存模式',
          vstack(s => {
            s.gap('16px');
            s.child(vField(f => {
              f.showContent((c, value) => {
                c.text(value || '输入后自动保存...');
              });
              f.editContent((c, setValue) => {
                c.vInput(i => {
                  i.placeholder('请输入内容');
                  i.type('text');
                  i.onInput(({ value }) => setValue(value));
                });
              });
              f.autoSave(true);
              f.onSave(({ value }) => {
                return new Promise(resolve => {
                  setTimeout(() => {
                    toast.info(`自动保存：${value}`);
                    resolve();
                  }, 500);
                });
              });
            }));
          }),
          `vField(f => {
  f.showContent((c, value) => {
    c.text(value || '输入后自动保存...')
  })
  f.editContent((c, setValue) => {
    c.vInput(i => {
      i.placeholder('请输入内容')
      i.type('text')
      i.onInput(({ value }) => setValue(value))
    })
  })
  f.autoSave(true)
  f.onSave(({ value }) => {
    return new Promise(resolve => {
      setTimeout(() => {
        toast.info(\`自动保存：\${value}\`)
        resolve()
      }, 500)
    })
  })
})`
        ),
      ]));
    },
  });
}
