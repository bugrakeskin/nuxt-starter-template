// https://nuxt.com/docs/api/configuration/nuxt-config
import packageJson from './package.json' with { type: 'json' }

export default defineNuxtConfig({
  extends: ['./layers/base'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@nuxtjs/supabase'
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    buildRevision: process.env.NUXT_BUILD_REVISION || 'development',
    public: {
      appName: 'Unfogy Starter',
      appVersion: process.env.NUXT_PUBLIC_APP_VERSION || packageJson.version,
      releaseChannel: process.env.NUXT_PUBLIC_RELEASE_CHANNEL || 'development'
    }
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    externals: {
      inline: ['tslib']
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

  fonts: {
    defaults: {
      weights: [400, 500, 600, 700, 800],
      styles: ['normal']
    },
    families: [
      { name: 'Public Sans', provider: 'google', global: true },
      { name: 'Geist', provider: 'google', global: true },
      { name: 'Geist Mono', provider: 'google', global: true },
      { name: 'Roboto', provider: 'google', global: true },
      { name: 'Figtree', provider: 'google', global: true },
      { name: 'Nunito', provider: 'google', global: true },
      { name: 'Manrope', provider: 'google', global: true },
      { name: 'Inter', provider: 'google', global: true },
      { name: 'Plus Jakarta Sans', provider: 'google', global: true },
      { name: 'Bricolage Grotesque', provider: 'google', global: true },
      { name: 'Outfit', provider: 'google', global: true },
      { name: 'Poppins', provider: 'google', global: true },
      { name: 'DM Sans', provider: 'google', global: true },
      { name: 'Source Serif 4', provider: 'google', global: true }
    ]
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
