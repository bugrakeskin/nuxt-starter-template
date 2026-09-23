// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['./layers/base'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/supabase'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      appName: 'Unfogy Starter'
    }
  },

  compatibilityDate: '2026-06-30',

  nitro: process.env.UNFOGY_NITRO_OUTPUT_DIR
    ? {
        output: { dir: process.env.UNFOGY_NITRO_OUTPUT_DIR },
        externals: { inline: ['tslib'] }
      }
    : {
        externals: { inline: ['tslib'] }
      },

  vite: {
    resolve: {
      dedupe: ['vue']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  supabase: {
    useSsrCookies: true,
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/login', '/confirm'],
      saveRedirectToCookie: true
    },
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    },
    types: '~/types/database.types.ts'
  }
})
