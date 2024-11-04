import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
    terserOptions: false,
  },
  rollupOptions: {
    // 配置输出格式，'es' 为 ES module，'cjs' 为 CommonJS
    output: {
      format: "es",
      // 不生成sourcemap
      sourcemap: false,
    },
  },
});
