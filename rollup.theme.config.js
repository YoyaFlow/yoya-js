/**
 * Rollup 配置文件 - 用于打包 Yoya.Theme CSS
 *
 * 输出文件：dist/yoya.theme.css (完整主题样式)
 * 输出文件：dist/yoya.theme.min.css (压缩版)
 * 用途：供业务项目通过 CDN 引入或本地引用，支持自定义主题
 */

import { defineConfig } from 'rollup';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';

export default defineConfig([
  {
    // 完整版（未压缩）
    input: 'src/yoya/theme/css/index.js',
    output: {
      file: 'dist/yoya.theme.css',
      format: 'esm',
    },
    plugins: [
      postcss({
        extract: true, // 提取 CSS 到单独文件
        minimize: false,
        sourceMap: true,
        plugins: [],
      }),
    ],
    onwarn: (warning, warn) => {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        return;
      }
      warn(warning);
    },
  },
  {
    // 压缩版
    input: 'src/yoya/theme/css/index.js',
    output: {
      file: 'dist/yoya.theme.min.css',
      format: 'esm',
    },
    plugins: [
      postcss({
        extract: true, // 提取 CSS 到单独文件
        minimize: true,
        sourceMap: false,
        plugins: [
          cssnano({
            preset: 'default',
          }),
        ],
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
