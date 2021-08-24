import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - AgileBoost',
    title: 'AgileBoost',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios.js',
    '~plugins/vue-clock.js',
    '~plugins/mavon-editor.js',
    '~plugins/diff2html.js',
    { src: '~plugins/zircle.js', mode: 'client' }, // window is not defined 回避
    { src: '~plugins/vueWinwheel.js', mode: 'client' },
    { src: '~plugins/vue2-dropzone.js', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    // custom
    '@nuxtjs/onesignal',
    '@nuxtjs/auth-next'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'http://localhost:4200',
    credentials: true
  },

  // Router
  router: {
    middleware: ['auth']
  },

  // Auth
  auth: {
    redirect: {
      login: '/member/sign-in',
      logout: '/',
      callback: false,
      home: false
    },
    localStorage: false,
    cookie: {
      prefix: 'auth.',
      options: {
        path: '/'
      }
    },
    strategies: {
      cookie: {
        user: {
          property: '',
          autoFetch: true
        },
        endpoints: {
          login: { url: '/api/v1/auth/sign-in', method: 'post' },
          logout: { url: '/api/v1/auth/sign-out', method: 'delete' },
          user: { url: '/api/v1/auth/me', method: 'get' }
        }
      }
    }
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    icon: {
      source: '/icon.png',
      fileName: 'icon.png',
      sizes: [64, 120, 144, 152, 192, 384, 512],
      targetDir: 'icons',
      plugin: true
    },
    manifest: {
      name: 'Agile Boost',
      short_name: 'Agile Boost',
      description: 'サイトの説明',
      lang: 'ja'
    },
    workbox: { // ワークボックスを使用して完全なオフラインサポートを追加
      dev: false
    }
  },

  // OneSignal
  oneSignal: {
    init: {
      appId: 'd30aae8d-18fd-41ec-821f-464da251cb3e',
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
        disable: true
      }
    }
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-vsc-dark-plus.css'
      }
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
