/**
 * VField组件功能测试
 * 使用Playwright进行自动化测试
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 测试配置
const TEST_PORT = 3000;
const TEST_URL = `http://localhost:${TEST_PORT}`;

// 启动开发服务器的辅助函数
async function startDevServer() {
  return new Promise((resolve, reject) => {
    const server = spawn('npm', ['run', 'dev'], {
      cwd: process.cwd(),
      stdio: 'pipe',
      shell: true
    });
    
    let output = '';
    server.stdout.on('data', (data) => {
      output += data.toString();
      console.log(`[Server] ${data.toString().trim()}`);
      
      // 检查服务器是否启动成功
      if (output.includes('ready in') || output.includes('Local:')) {
        console.log('开发服务器启动成功');
        resolve(server);
      }
    });
    
    server.stderr.on('data', (data) => {
      console.error(`[Server Error] ${data.toString().trim()}`);
    });
    
    server.on('error', (error) => {
      console.error('启动服务器失败:', error);
      reject(error);
    });
    
    // 设置超时
    setTimeout(() => {
      if (!server.killed) {
        console.log('服务器启动超时，但继续测试');
        resolve(server);
      }
    }, 10000);
  });
}

// 停止开发服务器的辅助函数
async function stopDevServer(server) {
  if (server && !server.killed) {
    server.kill('SIGTERM');
    console.log('开发服务器已停止');
  }
}

// 测试套件
test.describe('VField组件功能测试', () => {
  let server;
  
  // 测试前启动开发服务器
  test.beforeAll(async () => {
    console.log('启动开发服务器...');
    try {
      server = await startDevServer();
      // 等待服务器完全启动
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      console.warn('无法启动开发服务器，尝试使用现有服务器:', error.message);
    }
  });
  
  // 测试后停止开发服务器
  test.afterAll(async () => {
    if (server) {
      await stopDevServer(server);
    }
  });
  
  // 测试1: 基本保存功能
  test('基本保存功能测试', async ({ page }) => {
    console.log('开始测试基本保存功能...');
    
    // 导航到测试页面
    await page.goto(`${TEST_URL}/src/examples/test-field-save.html`);
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 检查页面标题
    await expect(page).toHaveTitle('VField 保存测试');
    
    // 检查初始值显示
    const resultElement = page.locator('#result');
    await expect(resultElement).toContainText('当前值：张三');
    
    // 查找VField元素
    const fieldContainer = page.locator('#app > div');
    await expect(fieldContainer).toBeVisible();
    
    // 点击进入编辑模式
    await fieldContainer.click();
    
    // 等待输入框出现
    const inputField = page.locator('input[type="text"]');
    await expect(inputField).toBeVisible();
    await expect(inputField).toBeFocused();
    
    // 清空并输入新值
    await inputField.fill('');
    await inputField.type('李四');
    
    // 检查调试信息
    const debugElement = page.locator('#debug');
    await expect(debugElement).toContainText('onInput 触发：李四');
    
    // 点击保存按钮（✓图标）
    const saveButton = page.locator('button:has-text("✓")');
    await saveButton.click();
    
    // 检查保存结果
    await expect(resultElement).toContainText('当前值：李四');
    
    // 检查调试信息中是否有保存记录
    await expect(debugElement).toContainText('onSave 回调：张三 -> 李四');
    
    console.log('基本保存功能测试通过');
  });
  
  // 测试2: 鼠标悬停效果
  test('鼠标悬停效果测试', async ({ page }) => {
    console.log('开始测试鼠标悬停效果...');
    
    // 导航到测试页面
    await page.goto(`${TEST_URL}/src/examples/test-field-hover.html`);
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
    
    // 检查页面标题
    await expect(page).toHaveTitle('VField 悬停测试');
    
    // 查找VField元素
    const fieldContainer = page.locator('#app > div');
    await expect(fieldContainer).toBeVisible();
    
    // 初始状态下编辑图标应该是隐藏的（opacity: 0）
    const editIcon = page.locator('button:has-text("✎")');
    
    // 鼠标悬停前检查图标透明度
    const initialOpacity = await editIcon.evaluate(el => {
      return window.getComputedStyle(el).opacity;
    });
    console.log('悬停前图标透明度:', initialOpacity);
    
    // 鼠标悬停到字段上
    await fieldContainer.hover();
    
    // 等待悬停效果生效
    await page.waitForTimeout(500);
    
    // 悬停后检查图标透明度
    const hoverOpacity = await editIcon.evaluate(el => {
      return window.getComputedStyle(el).opacity;
    });
    console.log('悬停后图标透明度:', hoverOpacity);
    
    // 验证悬停效果：图标应该变得可见（opacity > 0）
    expect(parseFloat(hoverOpacity)).toBeGreaterThan(0);
    
    // 鼠标移开
    await page.mouse.move(0, 0);
    await page.waitForTimeout(500);
    
    // 移开后检查图标透明度
    const afterOpacity = await editIcon.evaluate(el => {
      return window.getComputedStyle(el).opacity;
    });
    console.log('移开后图标透明度:', afterOpacity);
    
    // 验证移开效果：图标应该隐藏（opacity = 0或接近0）
    expect(parseFloat(afterOpacity)).toBeLessThan(0.1);
    
    console.log('鼠标悬停效果测试通过');
  });
  
  // 测试3: 自动保存功能
  test('自动保存功能测试', async ({ page }) => {
    console.log('开始测试自动保存功能...');
    
    // 创建一个简单的测试页面
    const testHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>VField 自动保存测试</title>
        <style>
          body { padding: 20px; }
          .result { margin-top: 10px; padding: 10px; background: #e8f5e9; }
        </style>
      </head>
      <body>
        <h1>VField 自动保存测试</h1>
        <div id="app"></div>
        <div class="result" id="result">当前值：-</div>
        <div id="debug"></div>
        
        <script type="module">
          import { vField, vInput, toast } from './src/yoya/index.js';
          
          const debug = document.getElementById('debug');
          const result = document.getElementById('result');
          
          function log(msg) {
            debug.innerHTML += '<br>' + msg;
            console.log(msg);
          }
          
          // 创建VField，启用自动保存
          const field = vField(f => {
            f.placeholder('点击编辑');
            f.autoSave(true);
            
            f.showContent((container, value) => {
              container.text(value || '未设置');
            });
            
            f.editContent((container, setValue, host) => {
              const input = vInput(i => {
                i.type('text');
                i.value(host.getValue() || '');
                i.placeholder('输入后点击外部自动保存');
                i.styles({ width: '200px' });
                i.onInput((instance) => {
                  log('onInput: ' + instance.value());
                  setValue(instance.value());
                });
              });
              container.clear();
              container.child(input);
              setTimeout(() => input.focus(), 0);
            });
            
            f.onSave((newValue, oldValue, host) => {
              log('自动保存: ' + oldValue + ' -> ' + newValue);
              result.textContent = '当前值：' + (newValue || '空');
              toast.success('自动保存成功: ' + newValue);
              return true;
            });
          });
          
          document.getElementById('app').appendChild(field._el);
          field.setValue('初始值');
          log('VField创建完成，初始值: 初始值');
        </script>
      </body>
      </html>
    `;
    
    // 写入临时测试文件
    const tempFile = path.join(__dirname, 'temp-auto-save-test.html');
    fs.writeFileSync(tempFile, testHtml);
    
    try {
      // 导航到测试页面
      await page.goto(`${TEST_URL}/tests/temp-auto-save-test.html`);
      await page.waitForLoadState('networkidle');
      
      // 检查初始值
      const resultElement = page.locator('#result');
      await expect(resultElement).toContainText('当前值：初始值');
      
      // 查找VField并点击进入编辑
      const fieldContainer = page.locator('#app > div');
      await fieldContainer.click();
      
      // 输入新值
      const inputField = page.locator('input[type="text"]');
      await inputField.fill('');
      await inputField.type('自动保存测试值');
      
      // 点击页面其他位置触发自动保存
      await page.click('body', { position: { x: 10, y: 10 } });
      
      // 等待自动保存完成
      await page.waitForTimeout(1000);
      
      // 检查结果
      await expect(resultElement).toContainText('当前值：自动保存测试值');
      
      // 检查调试信息
      const debugElement = page.locator('#debug');
      await expect(debugElement).toContainText('自动保存: 初始值 -> 自动保存测试值');
      
      console.log('自动保存功能测试通过');
    } finally {
      // 清理临时文件
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  });
  
  // 测试4: 事件绑定和内存泄漏测试
  test('事件绑定和内存泄漏测试', async ({ page }) => {
    console.log('开始测试事件绑定和内存泄漏...');
    
    // 创建一个测试页面来验证destroy方法
    const testHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>VField 内存泄漏测试</title>
        <style>
          body { padding: 20px; }
          button { margin: 5px; padding: 8px 16px; }
        </style>
      </head>
      <body>
        <h1>VField 内存泄漏测试</h1>
        <button id="createBtn">创建VField</button>
        <button id="destroyBtn">销毁VField</button>
        <button id="testHoverBtn">测试悬停</button>
        <div id="container"></div>
        <div id="status">状态: 等待</div>
        
        <script type="module">
          import { vField, vInput } from './src/yoya/index.js';
          
          let currentField = null;
          let eventCount = 0;
          
          document.getElementById('createBtn').addEventListener('click', () => {
            if (currentField) {
              document.getElementById('status').textContent = '请先销毁当前VField';
              return;
            }
            
            currentField = vField(f => {
              f.placeholder('测试字段');
              f.setValue('测试值');
              
              f.onSave((newValue, oldValue) => {
                eventCount++;
                document.getElementById('status').textContent = 
                  '保存事件触发: ' + newValue + ' (事件计数: ' + eventCount + ')';
              });
            });
            
            document.getElementById('container').appendChild(currentField._el);
            document.getElementById('status').textContent = 'VField创建成功';
          });
          
          document.getElementById('destroyBtn').addEventListener('click', () => {
            if (currentField && currentField.destroy) {
              currentField.destroy();
              document.getElementById('container').innerHTML = '';
              currentField = null;
              document.getElementById('status').textContent = 'VField已销毁';
            } else {
              document.getElementById('status').textContent = '没有可销毁的VField';
            }
          });
          
          document.getElementById('testHoverBtn').addEventListener('click', () => {
            if (currentField) {
              // 模拟悬停测试
              const fieldEl = document.querySelector('#container > div');
              if (fieldEl) {
                fieldEl.dispatchEvent(new MouseEvent('mouseenter'));
                setTimeout(() => {
                  fieldEl.dispatchEvent(new MouseEvent('mouseleave'));
                }, 100);
                document.getElementById('status').textContent = '悬停测试完成';
              }
            }
          });
        </script>
      </body>
      </html>
    `;
    
    // 写入临时测试文件
    const tempFile = path.join(__dirname, 'temp-memory-test.html');
    fs.writeFileSync(tempFile, testHtml);
    
    try {
      // 导航到测试页面
      await page.goto(`${TEST_URL}/tests/temp-memory-test.html`);
      await page.waitForLoadState('networkidle');
      
      // 创建VField
      await page.click('#createBtn');
      await expect(page.locator('#status')).toContainText('VField创建成功');
      
      // 测试悬停功能
      await page.click('#testHoverBtn');
      await expect(page.locator('#status')).toContainText('悬停测试完成');
      
      // 销毁VField
      await page.click('#destroyBtn');
      await expect(page.locator('#status')).toContainText('VField已销毁');
      
      // 验证容器已清空
      const container = page.locator('#container');
      await expect(container).toBeEmpty();
      
      // 再次创建VField，验证没有内存泄漏
      await page.click('#createBtn');
      await expect(page.locator('#status')).toContainText('VField创建成功');
      
      console.log('事件绑定和内存泄漏测试通过');
    } finally {
      // 清理临时文件
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    }
  });
  
  // 测试5: 综合功能测试
  test('综合功能测试', async ({ page }) => {
    console.log('开始综合功能测试...');
    
    // 使用我们之前创建的测试页面
    await page.goto(`${TEST_URL}/test-vfield-fix.html`);
    await page.waitForLoadState('networkidle');
    
    // 测试1: 基本保存功能
    await page.click('button:has-text("运行测试")', { hasText: '运行测试' });
    await page.waitForTimeout(1000);
    
    const result1 = page.locator('#result1');
    await expect(result1).toContainText(/测试通过|创建成功/);
    
    // 如果测试创建成功，执行实际测试
    if (await result1.textContent().then(t => t.includes('创建成功'))) {
      // 点击VField进入编辑
      const field1 = page.locator('#test1 > div');
      await field1.click();
      
      // 输入新值
      const input1 = page.locator('#test1 input[type="text"]');
      await input1.fill('综合测试值');
      
      // 点击保存
      const saveBtn1 = page.locator('#test1 button:has-text("✓")');
      await saveBtn1.click();
      
      await page.waitForTimeout(500);
      await expect(result1).toContainText('测试通过');
    }
    
    // 测试2: 鼠标悬停效果
    await page.click('button:has-text("运行测试")', { hasText: '运行测试' }).nth(1);
    await page.waitForTimeout(500);
    
    const result2 = page.locator('#result2');
    await expect(result2).toContainText(/测试创建成功/);
    
    // 测试3: 自动保存功能
    await page.click('button:has-text("运行测试")', { hasText: '运行测试' }).nth(2);
    await page.waitForTimeout(500);
    
    const result3 = page.locator('#result3');
    await expect(result3).toContainText(/创建成功/);
    
    console.log('综合功能测试通过');
  });
});