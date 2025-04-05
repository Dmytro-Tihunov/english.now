// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: false,
  nitro: {
    preset: "cloudflare-pages"
  },
  runtimeConfig: {
    NOTION_SECRET: process.env.NOTION_SECRET,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts"],
  googleFonts: {
    families: { 
      Roboto: true,
      "Dela Gothic One": true,
    },
    download: true,
  }
})