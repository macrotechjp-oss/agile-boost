<template>
  <v-app>
    <div>
      <PagesDrawerMenu />
      <LayoutsHeader />
    </div>
    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  // async asyncData ({ $content }) {
  //   const news = await $content('use', 'sample').fetch()
  //   // eslint-disable-next-line no-console
  //   console.log('内容2')
  //   return { news }

  //   // const page = await $content('use/sample').fetch()
  //   // // eslint-disable-next-line no-console
  //   // console.log('内容')
  //   // // eslint-disable-next-line no-console
  //   // console.log(page)

  //   // return {
  //   //   page
  //   // }
  // },

  data () {
    return {
      dialog: true,
      tes: false,
      tes2: false,
      drawer: true,
      items: [
        { title: 'AJP', icon: 'mdi-home-city' },
        { title: 'タカラ案件', icon: 'mdi-account' },
        { title: '京大案件', icon: 'mdi-account-group-outline' }
      ],
      // itemss: [
      //   {
      //     id: 1,
      //     name: 'ユーザー関連',
      //     children: [
      //       {
      //         id: 2,
      //         name: 'Core team',
      //         children: [
      //           {
      //             id: 201,
      //             name: 'John'
      //           },
      //           {
      //             id: 202,
      //             name: 'Kael'
      //           },
      //           {
      //             id: 203,
      //             name: 'Nekosaur'
      //           },
      //           {
      //             id: 204,
      //             name: 'Jacek'
      //           },
      //           {
      //             id: 205,
      //             name: 'Andrew'
      //           }
      //         ]
      //       },
      //       {
      //         id: 3,
      //         name: 'Administrators',
      //         children: [
      //           {
      //             id: 301,
      //             name: 'Mike'
      //           },
      //           {
      //             id: 302,
      //             name: 'Hunt'
      //           }
      //         ]
      //       },
      //       {
      //         id: 4,
      //         name: 'Contributors',
      //         children: [
      //           {
      //             id: 401,
      //             name: 'Phlow'
      //           },
      //           {
      //             id: 402,
      //             name: 'Brandon'
      //           },
      //           {
      //             id: 403,
      //             name: 'Sean'
      //           }
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     id: 2,
      //     name: 'プロジェクトについて',
      //     children: [
      //       {
      //         id: 2,
      //         name: 'Core team',
      //         children: [
      //           {
      //             id: 201,
      //             name: 'ユーザー'
      //           },
      //           {
      //             id: 202,
      //             name: 'Kael'
      //           },
      //           {
      //             id: 203,
      //             name: 'Nekosaur'
      //           },
      //           {
      //             id: 204,
      //             name: 'Jacek'
      //           },
      //           {
      //             id: 205,
      //             name: 'Andrew'
      //           }
      //         ]
      //       },
      //       {
      //         id: 3,
      //         name: 'Administrators',
      //         children: [
      //           {
      //             id: 301,
      //             name: 'Mike'
      //           },
      //           {
      //             id: 302,
      //             name: 'Hunt'
      //           }
      //         ]
      //       },
      //       {
      //         id: 4,
      //         name: 'Contributors',
      //         children: [
      //           {
      //             id: 401,
      //             name: 'Phlow'
      //           },
      //           {
      //             id: 402,
      //             name: 'Brandon'
      //           },
      //           {
      //             id: 403,
      //             name: 'Sean'
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // ],
      initiallyOpen: ['public'],
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-code-json',
        md: 'mdi-language-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel'
      },
      tree: [],
      items1: [
        {
          name: '.git'
        },
        {
          name: 'node_modules'
        },
        {
          name: 'public',
          children: [
            {
              name: 'static',
              children: [{
                name: 'logo.png',
                file: 'png'
              }]
            },
            {
              name: 'favicon.ico',
              file: 'png'
            },
            {
              name: 'index.html',
              file: 'html'
            }
          ]
        },
        {
          name: '.gitignore',
          file: 'txt'
        },
        {
          name: 'babel.config.js',
          file: 'js'
        },
        {
          name: 'package.json',
          file: 'json'
        },
        {
          name: 'README.md',
          file: 'md'
        },
        {
          name: 'vue.config.js',
          file: 'js'
        },
        {
          name: 'yarn.lock',
          file: 'txt'
        }
      ],
      open: [1, 2],
      search: null,
      caseSensitive: false,
      mini: true

    }
  },
  methods: {
    alert () {
      alert(1111)
      // this.tes = !this.tes
    }
  }
}
</script>
<style>
.clock__hours,.clock__minutes,.clock__seconds{
  background: linear-gradient(to bottom, #4270a4 50%, #5385c3 50%)!important;
  font-size: 1rem!important;
}
.clock__hourtime{
  display:none;
}
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(5px);
  opacity: 0;
}
</style>
