import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import strip from '@rollup/plugin-strip';
import { configDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), {
    name: "markdown-loader",
    transform(code, id) {
      if (id.slice(-3) === ".md") {
        // For .md files, get the raw content
        return `export default ${JSON.stringify(code)};`;
      }
    }
  }],
  // server: {
  //   hmr: {
  //     overlay: true,
  //   }
  // },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
  build: {
    sourcemap: command === "serve",
    rollupOptions: {
      plugins: [
        // @ts-ignore
        strip({
          functions: ['console.debug'],
          include: '**/*.(ts|tsx)',
        }),
      ],
    },
  },
  test: {
    globals: true,
    include: [...configDefaults.include, 'src/__tests/**/*.test.ts'],
    environment: "node", // reconfigure later to include browser tests
  }
}));
