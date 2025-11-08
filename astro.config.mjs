// @ts-check
import { defineConfig } from "astro/config";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    fallback: {
      fr: "en",
    },
    routing: {
      fallbackType: "rewrite"
    }
  },
  site: "https://ess100.netlify.app/",
//   trailingSlash: "always",
//   build: {
//     format: "directory",
//   },
  // Add astro-icon integration with mdi icon set included
  integrations: [icon({
    include: {
      // Load all Material Design Icons (mdi) – you can restrict to specific icons if desired
      mdi: ["*"],
    },
  })],
  // Ensure astro-icon is not externalized during SSR
  vite: {
    ssr: {
      noExternal: ["astro-icon"],
    },
  },
});
