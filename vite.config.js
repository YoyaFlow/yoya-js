import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  server: {
    port: 3001,
    open: '/examples/yoya.example.html',
    host: true
  },
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: 'src/examples/yoya.example.html',
        demo: 'src/examples/yoya.basic.example.html'
      }
    }
  },
  clearScreen: true,
  logLevel: 'info'
});
