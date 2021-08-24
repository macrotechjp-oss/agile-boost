<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    clipped
    mobile-breakpoint="960"
    :mini-variant.sync="mini"
    permanent
  >
    <v-list-item class="px-2">
      <v-list-item-avatar>
        <v-img :src="userIconPath" />
      </v-list-item-avatar>
      <v-list-item-title>{{ userName }}</v-list-item-title>
      <v-btn
        icon
        @click.stop="mini = !mini"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>
    <v-divider />
    <v-list dense>
      <v-list-item-group color="blue">
        <v-list-item
          v-for="(projectInfo, i) in projectInfoList"
          :key="i"
          link
          :to="'/project/'+projectInfo.id"
        >
          <v-list-item-icon style="position: relative;">
            <v-badge
              color="green"
              :content="projectInfo.notice"
              :value="projectInfo.notice"
              offset-x="10"
              offset-y="10"
              style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);"
            >
              <v-avatar width="30" height="30" min-width="30">
                <img :src="projectInfo.iconPath">
              </v-avatar>
            </v-badge>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ projectInfo.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <template #append>
      <v-list>
        <!-- 【START】使い方 -->
        <v-dialog max-width="800px">
          <template #activator="{ on, attrs }">
            <v-list-item link v-bind="attrs" v-on="on">
              <v-list-item-icon>
                <v-icon>mdi-book-open-page-variant-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>使い方</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-card>
            <v-toolbar color="primary" dark>
              使い方
            </v-toolbar>
            <v-card-text>
              <v-treeview :items="howToUseList" item-key="name">
                <template slot="label" slot-scope="{ item }">
                  <span v-if="item.children">{{ item.name }}</span>
                  <a v-else @click="openHowToUse(item.mdPath)">{{ item.name }}</a>
                </template>
              </v-treeview>
            </v-card-text>
          </v-card>
        </v-dialog>
        <!-- 【END】使い方 -->
        <!-- 【START】使い方の詳細ダイアログ -->
        <v-dialog
          v-model="howToUseDialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon @click="howToUseDialog = !howToUseDialog">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>{{ howToUseTitle }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text />
            <article class="pa-2">
              <nuxt-content :document="howToUseDetail" />
            </article>
          </v-card>
        </v-dialog>
        <!-- 【END】使い方の詳細ダイアログ -->
        <!-- 【START】プロフィール設定 -->
        <v-list-item link to="/setting/profile">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>プロフィール設定</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- 【END】プロフィール設定 -->
        <!-- 【START】サイト設定 -->
        <v-list-item link to="/setting/site">
          <v-list-item-icon>
            <v-icon>mdi-cog-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>サイト設定</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- 【END】サイト設定 -->
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  data () {
    return {
      // ユーザー情報
      userName: '',
      userIconPath: '',
      // プロジェクト情報
      projectInfoList: [
        {
          id: '',
          name: '',
          iconPath: '',
          notice: 1
        }
      ],
      // 使い方情報
      howToUseTitle: null,
      howToUseDetail: null,
      // 使い方情報状態変数
      howToUseDialog: false,
      // 使い方情報定数
      howToUseList: [
        {
          name: 'Agile Boostについて',
          children: [
            { name: 'Agile Boostとは', mdPath: 'how-to-use/agile-boost/agile-boost' },
            { name: 'Contributorについて', mdPath: 'how-to-use/agile-boost/contributor' }
          ]
        }, {
          name: '会員について',
          children: [
            { name: '新規会員登録', mdPath: 'how-to-use/member/regist-member' },
            { name: 'ログイン', mdPath: 'how-to-use/member/login' },
            { name: 'アカウント有効化について', mdPath: 'how-to-use/member/account-activation' },
            { name: 'パスワードを忘れた場合', mdPath: 'how-to-use/member/forget-password' }
          ]
        }, {
          name: 'プロジェクトについて',
          children: [
            { name: 'プロジェクトとは', mdPath: 'how-to-use/project/project' },
            { name: 'ホームについて', mdPath: 'how-to-use/project/home' },
            { name: 'お知らせについて', mdPath: 'how-to-use/project/info' },
            { name: 'メモ帳について', mdPath: 'how-to-use/project/memo' },
            { name: 'Boost Store について', mdPath: 'how-to-use/project/boost-store' }
          ]
        }, {
          name: 'プロフィール設定について',
          children: [
            { name: 'ユーザープロフィール更新', mdPath: 'how-to-use/profile-setting/profile-update' }
          ]
        }, {
          name: 'サイト設定について',
          children: [
            { name: '一般設定', mdPath: 'how-to-use/site-setting/general' }
          ]
        }, {
          name: 'Boost Store',
          children: [
            { name: 'Choice', mdPath: 'how-to-use/boost-store/choice' },
            { name: 'Storage', mdPath: 'how-to-use/boost-store/storage' }
          ]
        }, {
          name: 'Q & A',
          mdPath: 'how-to-use/Q&A'
        }
      ],
      // ページ内状態変数
      drawer: true,
      mini: true
    }
  },
  async created () {
    // ユーザー情報セット
    try {
      const res = await this.$axios.get('/api/v1/auth/me')
      this.userName = res.data.userName
      this.userIconPath = res.data.userIconPath
    } catch (err) { alert('ユーザー情報取得失敗') }
    // プロジェクト情報取得
    let res
    try {
      res = await this.$axios.get('/api/v1/users/projects')
    } catch (err) { alert('プロジェクト情報取得失敗') }
    // プロジェクト情報取得成功時
    if (res.data.result === 'success') {
      const projectInfoList = []
      res.data.userProject.forEach(function (userProject, index) {
        const projectInfo = {
          id: userProject.Project.id,
          name: userProject.Project.projectName,
          iconPath: userProject.Project.projectIconPath,
          notice: index
        }
        projectInfoList.push(projectInfo)
      })
      this.projectInfoList = projectInfoList
    }
    // プロジェクト情報取得失敗時
    if (res.data.result === 'error') { return false }
  },
  methods: {
    /** 使い方の詳細ダイアログをオープン */
    async openHowToUse (mdPath) {
      // 使い方のMarkdown情報取得
      const howToUse = await this.$content(mdPath).fetch()
      // 使い方の詳細情報セット
      this.howToUseTitle = howToUse.title
      this.howToUseDetail = howToUse
      // 使い方の詳細ダイアログオープン
      this.howToUseDialog = true
    }
  }
}
</script>
