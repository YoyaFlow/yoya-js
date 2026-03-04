/**
 * Yoya.Basic - VCode 组件演示
 */

import {
  div, h2, h3, span,
  vCode, vButton,
  toast
} from '../yoya/index.js';

// ============================================
// 辅助函数：创建演示容器
// ============================================
function demoContainer(title, demoContent) {
  return div(section => {
    section.styles({
      background: 'white',
      borderRadius: '12px',
      marginBottom: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      overflow: 'hidden',
    });

    section.child(div(demoArea => {
      demoArea.styles({ padding: '30px' });

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
  });
}

// ============================================
// 基础代码展示
// ============================================
const basicCodeDemo = demoContainer('基础代码展示', div(content => {
  const sampleCode = `// Hello World 示例
function sayHello(name) {
  const message = 'Hello, ' + name + '!';
  console.log(message);
  return message;
}

sayHello('World');`;

  content.child(vCode(c => {
    c.content(sampleCode);
    c.title('💻 JavaScript 示例');
    c.onCopy(() => {
      toast.success('代码已复制到剪贴板');
    });
  }));
}));

// ============================================
// 不带标题栏的代码
// ============================================
const noHeaderCodeDemo = demoContainer('不带标题栏', div(content => {
  const sampleCode = `const sum = (a, b) => {
  return a + b;
};

console.log(sum(1, 2)); // 3`;

  content.child(vCode(c => {
    c.content(sampleCode);
    c.showCopyButton(false);
    c.showLineNumbers(false);
  }));
}));

// ============================================
// 长代码展示
// ============================================
const longCodeDemo = demoContainer('长代码展示（带滚动）', div(content => {
  const longCode = `// 完整的类示例
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return 'Hello, my name is ' + this.name;
  }

  birthday() {
    this.age++;
    return 'Happy birthday! I am now ' + this.age + ' years old.';
  }

  static create(name, age) {
    return new Person(name, age);
  }
}

// 使用示例
const person = Person.create('Alice', 25);
console.log(person.greet());
console.log(person.birthday());

// 继承示例
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }

  study() {
    return this.name + ' is studying in grade ' + this.grade;
  }

  // 重写父类方法
  greet() {
    return super.greet() + ' and I am a student.';
  }
}

const student = new Student('Bob', 20, 3);
console.log(student.study());
console.log(student.greet());`;

  content.child(vCode(c => {
    c.content(longCode);
    c.title('📝 完整类示例');
    c.onCopy(() => {
      toast.success('长代码已复制');
    });
  }));
}));

// ============================================
// 多个代码块组合
// ============================================
const multipleCodeDemo = demoContainer('多个代码块组合', div(content => {
  content.child(h3(h => h.text('ES6 模块导入导出')));

  content.child(vCode(c => {
    c.title('export.js');
    c.content(`// 导出语句
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}
export class Calculator {
  multiply(a, b) {
    return a * b;
  }
}
// 默认导出
export default { PI, add, Calculator };`);
  }));

  content.child(div(spacer => {
    spacer.styles({ height: '20px' });
  }));

  content.child(vCode(c => {
    c.title('import.js');
    c.content(`// 导入语句
import defaultExport, { PI, add, Calculator } from './export.js';

console.log(PI); // 3.14159
console.log(add(1, 2)); // 3

const calc = new Calculator();
console.log(calc.multiply(3, 4)); // 12

// 使用默认导出
console.log(defaultExport.PI);`);
  }));
}));

// ============================================
// 代码高亮效果展示
// ============================================
const highlightDemo = demoContainer('语法高亮效果', div(content => {
  const code = `// 各种语法元素高亮
const obj = {
  name: 'Yoya.Basic',
  version: '1.0.0',
  features: ['DSL', 'Components', 'Theme'],
};

// 箭头函数
const process = (data) => {
  return data.map(item => item.value);
};

// 模板字符串
const desc = \`\${obj.name} v\${obj.version}\`;

// 异步函数
async function fetchData(url) {
  const response = await fetch(url);
  return await response.json();
}

// 解构赋值
const { name, version } = obj;
const [first, second] = obj.features;`;

  content.child(vCode(c => {
    c.content(code);
    c.title('🎨 语法高亮');
  }));
}));

// ============================================
// 配合其他组件使用
// ============================================
const withComponentsDemo = demoContainer('与其他组件配合使用', div(content => {
  content.child(h3(h => h.text('代码示例')));

  const exampleCode = `import { div, button, toast } from '../yoya/index.js';

// 创建按钮
const btn = button(b => {
  b.text('点击我');
  b.type('primary');
  b.on('click', () => {
    toast.success('按钮被点击了！');
  });
});

// 绑定到页面
btn.bindTo('#app');`;

  content.child(vCode(c => {
    c.content(exampleCode);
    c.title('使用示例');
    c.onCopy(() => {
      toast.info('示例代码已复制');
    });
  }));

  content.child(h3(h => h.text('运行结果')));

  content.child(div(result => {
    result.styles({
      padding: '20px',
      background: '#f5f5f5',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
    });

    result.child(vButton(b => {
      b.text('点击我');
      b.type('primary');
      b.on('click', () => {
        toast.success('按钮被点击了！');
      });
    }));
  }));
}));

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
    c.child(basicCodeDemo);
    c.child(noHeaderCodeDemo);
    c.child(longCodeDemo);
    c.child(multipleCodeDemo);
    c.child(highlightDemo);
    c.child(withComponentsDemo);
  });
  container.bindTo('#app');
}

// 自动初始化
initApp();
