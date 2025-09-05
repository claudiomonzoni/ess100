// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: ["en", "de"],
    defaultLocale: "en",
    fallback: {
      de: "en",
    },
    routing: {
      fallbackType: "rewrite"
    }
  },
  site: "https://ess100.vercel.app",
//   trailingSlash: "always",
//   build: {
//     format: "directory",
//   },
  // vite: {
  //     ssr: {
  //         noExternal: ['@astrojs/image', 'astro-icon'],
  //     },
  // },
});
