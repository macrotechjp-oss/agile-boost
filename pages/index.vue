<template>
  <v-card style="height: calc(100vh - 48px);">
    <v-carousel height="100%" cycle vertical vertical-delimiters="true">
      <v-carousel-item style="height: calc(100vh - 48px);">
        <v-img
          src="https://www.agile.co.jp/images/omm2.jpg"
          style="height: calc(100vh - 48px);"
        />
      </v-carousel-item>
      <v-carousel-item style="height: calc(100vh - 48px);">
        <v-img
          src="https://www.agile.co.jp/images/omm.jpg"
          style="height: calc(100vh - 48px);"
        />
      </v-carousel-item>
      <v-overlay z-index="5">
        <v-container>
          <v-col class="mx-auto px-5 text-center black--text">
            <v-row justify="center" class="my-3">
              <v-img src="/logo-l.png" contain />
            </v-row>
            <v-row justify="center" class="my-3">
              <v-img src="/icon.png" height="50" width="50" contain />
            </v-row>
            <v-row justify="center" class="my-5">
              <v-subheader>
                Agile Boost はAJP内の業務一連化をサポートするPWA付のWEBアプリケーションです。
              </v-subheader>
            </v-row>
            <!-- 【START】始めよう -->
            <v-row justify="center" class="mt-3 mb-10">
              <v-btn
                color="info"
                class="white--text"
                x-large
                @click="nextPage()"
              >
                始めよう
              </v-btn>
            </v-row>
            <!-- 【END】始めよう -->
            <!-- 【START】Github クライアント/サーバー リポジトリ -->
            <v-row justify="center" class="my-3">
              <v-btn
                color="black"
                class="white--text mx-1"
                x-large
                rounded
                href="https://github.com/AgileJP/AgileBoost"
                target="_blank"
              >
                <v-icon left>
                  mdi-github
                </v-icon>
                Github-ClientSide
              </v-btn>
              <v-btn
                color="black"
                class="white--text mx-1"
                x-large
                rounded
                href="https://github.com/AgileJP/AgileBoostApi"
                target="_blank"
              >
                <v-icon left>
                  mdi-github
                </v-icon>
                Github-ServerSide
              </v-btn>
            </v-row>
            <!-- 【END】Github クライアント/サーバー リポジトリ -->
            <!-- 【START】Contributor -->
            <v-row justify="center" class="my-3">
              <v-dialog max-width="800px">
                <template #activator="{ on, attrs }">
                  <v-btn
                    color="black"
                    class="white--text"
                    x-large
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon left>
                      mdi-book-open-page-variant-outline
                    </v-icon>
                    Contributor
                  </v-btn>
                </template>
                <v-card>
                  <v-toolbar color="black" dark>
                    使い方
                  </v-toolbar>
                  <v-card-text>
                    <v-treeview :items="contributorList" item-key="name">
                      <template slot="label" slot-scope="{ item }">
                        <span v-if="item.children">{{ item.name }}</span>
                        <a v-else @click="openContributor(item.mdPath)">{{ item.name }}</a>
                      </template>
                    </v-treeview>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-row>
            <!-- 【END】Contributor -->
            <!-- 【START】Contributorの詳細ダイアログ -->
            <v-dialog
              v-model="contributorDialog"
              fullscreen
              hide-overlay
              transition="dialog-bottom-transition"
            >
              <v-card>
                <v-toolbar dark color="black">
                  <v-btn icon @click="contributorDialog = !contributorDialog">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-toolbar-title>{{ contributorTitle }}</v-toolbar-title>
                </v-toolbar>
                <v-card-text />
                <article class="py-2 px-4">
                  <nuxt-content :document="contributorDetail" />
                </article>
              </v-card>
            </v-dialog>
            <!-- 【END】Contributorの詳細ダイアログ -->
            <!-- 【START】Contributorのアイコン一覧 -->
            <v-row justify="center" class="mt-5">
              <v-avatar>
                <a href="https://github.com/tanakakoyo" target="_blank"><img
                  src="https://avatars.githubusercontent.com/u/56991147?s=60&v=4"
                  alt="John"
                ></a>
              </v-avatar>
            </v-row>
            <!-- 【END】Contributorのアイコン一覧 -->
          </v-col>
        </v-container>
      </v-overlay>
    </v-carousel>
  </v-card>
</template>

<script>
export default {
  auth: false,
  data () {
    return {
      // Contributor情報
      contributorTitle: null,
      contributorDetail: null,
      // Contributor情報状態変数
      contributorDialog: false,
      // Contributor情報定数
      contributorList: [
        {
          name: 'Contributorについて',
          children: [
            { name: 'Contributorとは', mdPath: 'contributor/contributor/contributor' }
          ]
        }, {
          name: '全体概要',
          children: [
            { name: '機能', mdPath: 'contributor/overviews/function' },
            { name: 'システムアーキテクト', mdPath: 'contributor/overviews/architect' },
            { name: 'プログラミング', mdPath: 'contributor/overviews/programming' },
            { name: 'テスト', mdPath: 'contributor/overviews/test' },
            { name: 'デプロイ', mdPath: 'contributor/overviews/deploy' },
            { name: '運用', mdPath: 'contributor/overviews/operation' }
          ]
        }, {
          name: '開発について',
          children: [
            { name: '開発環境', mdPath: 'contributor/develop/environment' },
            { name: 'DB構成', mdPath: 'contributor/develop/dbSchema' },
            { name: '命名規約', mdPath: 'contributor/develop/terms' }
          ]
        }, {
          name: 'Q & A',
          mdPath: 'contributor/Q&A'
        }
      ]
    }
  },
  methods: {
    /** 「始める」押下処理 */
    nextPage () {
      if (this.$store.state.auth.loggedIn) {
        // ログイン状態
        this.$router.push('/project')
      } else {
        // 未ログイン状態
        this.$router.push('/member/sign-in')
      }
    },
    /** Contributorの詳細ダイアログをオープン */
    async openContributor (mdPath) {
      // ContributorのMarkdown情報取得
      const contributor = await this.$content(mdPath).fetch()
      // Contributorの詳細情報セット
      this.contributorTitle = contributor.title
      this.contributorDetail = contributor
      // Contributorの詳細ダイアログオープン
      this.contributorDialog = true
    }
  }
}
</script>
