/**
 * Rollup 配置文件 - 用于打包 Yoya.Echart 模块
 *
 * 输出文件：dist/yoya.echart.esm.js (压缩版)
 * 输出文件：dist/yoya.echart.esm.min.js (未压缩，保留注释)
 * 格式：ESM (ES Modules)
 * 用途：供业务项目使用，需要业务项目自行引入 echarts 库
 */

import { defineConfig } from 'rollup';
import terser from '@rollup/plugin-terser';

export default defineConfig([
  {
    // 未压缩版本（保留注释）
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
  },
  {
    // 压缩版本
    input: 'src/yoya/yoya.echart.js',
    output: {
      file: 'dist/yoya.echart.esm.min.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
    external: [],
    treeshake: true,
    plugins: [
      terser({
        format: {
          comments: false, // 移除所有注释
        },
        compress: {
          drop_console: false, // 保留 console
          drop_debugger: false, // 保留 debugger
        },
      }),
    ],
    onwarn: (warning, warn) => {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        return;
      }
      warn(warning);
    },
  },
]);
