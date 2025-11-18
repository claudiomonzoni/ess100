// @ts-check
import { defineConfig } from "astro/config";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
   i18n: {
    locales: ["en", "fr"],
    defaultLocale: "fr",
    fallback: {
      en: "fr",
    },
    routing: {
      fallbackType: "rewrite",
    },
  },
  site: "https://ess100.netlify.app/",
  base: "/", //cambiar en produccion

  // Add astro-icon integration with mdi icon set included
  integrations: [icon({
    include: {
      mdi: ["*"],
    },
  })],
  // Ensure astro-icon is not externalized during SSR
  // vite: {
  //   resolve: {
  //     alias: {
  //       "@components": "/src/components",
  //       "@layouts": "/src/layouts",
  //     },
  //   },
  //   ssr: {
  //     noExternal: ["astro-icon"],
  //   },
  // },
});
