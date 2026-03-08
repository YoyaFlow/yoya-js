/**
 * Rollup 配置文件 - 用于打包 Yoya.Echart 模块
 *
 * 输出文件：dist/yoya.echart.esm.js
 * 格式：ESM (ES Modules)
 * 用途：供业务项目使用，需要业务项目自行引入 echarts 库
 */

import { defineConfig } from 'rollup';

export default defineConfig({
  input: 'src/yoya/yoya.echart.js',
  output: {
    file: 'dist/yoya.echart.esm.js',
    format: 'esm',
    sourcemap: true,
    exports: 'named',
  },
  external: [],
  treeshake: true,
  onwarn: (warning, warn) => {
    // 忽略循环依赖警告（基础模块可能会被多次引用）
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      return;
    }
    warn(warning);
  },
});
