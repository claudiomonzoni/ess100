// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
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
  site: "http://esscrans-montana.ch",
  //site: "https://ess100.netlify.app/",
  base: "/100/", // Ruta relativa de la subcarpeta

  // Add astro-icon integration with mdi icon set included
  integrations: [
    react(),
    icon({
      include: {
        mdi: ["*"],
      },
    }),
  ],
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
