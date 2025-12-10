import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import strip from '@rollup/plugin-strip';
import { configDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = process.env.VITE_NETLIFY_CONTEXT === 'production';
  
  return {
  plugins: [
    react(), 
    {
      name: "markdown-loader",
      transform(code, id) {
        if (id.slice(-3) === ".md") {
          // For .md files, get the raw content
          return `export default ${JSON.stringify(code)};`;
        }
      }
    },
    {
      name: "conditional-ga",
      transformIndexHtml(html) {
        if (isProduction) {
          // Keep GA scripts in production
          return html
            .replace('<!-- VITE_GA_ENABLED_START -->', '')
            .replace('<!-- VITE_GA_ENABLED_END -->', '');
        } else {
          // Remove GA scripts in development
          const gaStart = html.indexOf('<!-- VITE_GA_ENABLED_START -->');
          const gaEnd = html.indexOf('<!-- VITE_GA_ENABLED_END -->') + '<!-- VITE_GA_ENABLED_END -->'.length;
          if (gaStart !== -1 && gaEnd !== -1) {
            return html.slice(0, gaStart) + '<!-- GA disabled in development -->' + html.slice(gaEnd);
          }
        }
        return html;
      }
    }
  ],
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
  // server: {
  //   allowedHosts: [
      
  //   ]
  // },
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
}});
