import react from "@vitejs/plugin-react";
import { execSync } from "node:child_process";
import path from "path";
import { defineConfig } from "vite";
import strip from '@rollup/plugin-strip';
import { configDefaults } from 'vitest/config';

type AppVersion = {
  buildId: string;
  commit: string;
  branch: string;
  context: string;
  builtAt: string;
};

const getGitCommit = () => {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
};

const getAppVersion = (): AppVersion => {
  const builtAt = new Date().toISOString();
  const commit =
    process.env.COMMIT_REF ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.CF_PAGES_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    getGitCommit();

  return {
    buildId: process.env.VITE_APP_BUILD_ID || process.env.DEPLOY_ID || `${commit}-${builtAt}`,
    commit,
    branch: process.env.BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_REF_NAME || "",
    context: process.env.CONTEXT || process.env.VITE_NETLIFY_CONTEXT || "",
    builtAt,
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = process.env.VITE_NETLIFY_CONTEXT === 'production';
  const appVersion = getAppVersion();
  
  return {
  define: {
    __PINTO_APP_VERSION__: JSON.stringify(appVersion),
  },
  plugins: [
    react(), 
    {
      name: "app-version",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "version.json",
          source: `${JSON.stringify(appVersion)}\n`,
        });
      },
    },
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
