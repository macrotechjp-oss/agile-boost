<template>
  <v-card style="height: calc(100vh - 48px);">
    <template v-if="!isLoading && isProjectExist && isProjectAccess">
      <!-- プロジェクト存在 かつ アクセス可能 -->
      <v-toolbar>
        <v-tabs v-model="selectedTab" color="deep-purple accent-4" left>
          <v-tab v-if="tabInfoList.home.isVisible" :key="tabInfoList.home.name">
            <v-badge color="green" :content="tabInfoList.home.notice" :value="tabInfoList.home.notice">
              ホーム
            </v-badge>
          </v-tab>
          <v-tab v-if="tabInfoList.info.isVisible" :key="tabInfoList.info.name">
            <v-badge color="green" :content="tabInfoList.info.notice" :value="tabInfoList.info.notice">
              お知らせ
            </v-badge>
          </v-tab>
          <v-tab v-if="tabInfoList.memo.isVisible" :key="tabInfoList.memo.name">
            <v-badge color="green" :content="tabInfoList.memo.notice" :value="tabInfoList.memo.notice">
              メモ帳
            </v-badge>
          </v-tab>
          <v-tab v-if="tabInfoList.Choice.isVisible" :key="tabInfoList.Choice.name">
            <v-badge color="green" :content="tabInfoList.Choice.notice" :value="tabInfoList.Choice.notice">
              Choice
            </v-badge>
          </v-tab>
          <v-tab v-if="tabInfoList.Calendar.isVisible" :key="tabInfoList.Calendar.name">
            <v-badge color="green" :content="tabInfoList.Calendar.notice" :value="tabInfoList.Calendar.notice">
              Calendar
            </v-badge>
          </v-tab>
          <v-tab v-if="tabInfoList.Storage.isVisible" :key="tabInfoList.Storage.name">
            <v-badge color="green" :content="tabInfoList.Storage.notice" :value="tabInfoList.Storage.notice">
              Storage
            </v-badge>
          </v-tab>
          <v-tab v-if="tabInfoList.store.isVisible" :key="tabInfoList.store.name">
            <v-badge color="green" :content="tabInfoList.store.notice" :value="tabInfoList.store.notice">
              <v-icon>
                mdi-sticker-plus
              </v-icon>
            </v-badge>
          </v-tab>
          <v-tabs-items v-model="selectedTab">
            <v-tab-item v-if="tabInfoList.home.isVisible" :key="tabInfoList.home.name">
              <PagesTabMenuHome />
            </v-tab-item>
            <v-tab-item v-if="tabInfoList.info.isVisible" :key="tabInfoList.info.name">
              <PagesTabMenuInfo :project-id="$route.params.id" />
            </v-tab-item>
            <v-tab-item v-if="tabInfoList.memo.isVisible" :key="tabInfoList.memo.name">
              <PagesTabMenuMemo :project-id="$route.params.id" />
            </v-tab-item>
            <v-tab-item v-if="tabInfoList.Choice.isVisible" :key="tabInfoList.Choice.name">
              <PagesTabMenuBoostChoice :project-id="$route.params.id" />
            </v-tab-item>
            <v-tab-item v-if="tabInfoList.Calendar.isVisible" :key="tabInfoList.Calendar.name">
              <PagesTabMenuBoostCalendar :project-id="$route.params.id" />
            </v-tab-item>
            <v-tab-item v-if="tabInfoList.Storage.isVisible" :key="tabInfoList.Storage.name">
              <PagesTabMenuBoostStorage :project-id="$route.params.id" />
            </v-tab-item>
            <v-tab-item v-if="tabInfoList.store.isVisible" :key="tabInfoList.store.name">
              <PagesTabMenuBoostStore :project-id="$route.params.id" @updateTabInfo="initialPageInfo()" />
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-toolbar>
    </template>
    <template v-if="!isLoading && !isProjectExist">
      <!-- プロジェクトが存在しない -->
      <v-col style="height:100%;">
        <v-row justify="center" align-content="center" style="height:100%;">
          <v-alert border="left" colored-border type="info" elevation="2">
            プロジェクトIDが存在しません。<br>
            右上「プロジェクト追加」より、プロジェクトの追加を行ってください。
          </v-alert>
        </v-row>
      </v-col>
    </template>
    <template v-if="!isLoading && isProjectExist && !isProjectAccess">
      <!-- プロジェクト存在 かつ アクセス不可 -->
      <v-col style="height:100%;">
        <v-row justify="center" align-content="center" style="height:100%;">
          <v-alert border="left" colored-border type="error" elevation="2">
            プロジェクトへのアクセス権限がありません。
          </v-alert>
        </v-row>
      </v-col>
    </template>
    <template v-if="isLoading">
      <!-- 読み込み中 -->
      <v-col style="height:100%;">
        <v-skeleton-loader
          style="height:100%;"
          type="card-heading,image,list-item,image,list-item,image"
        />
      </v-col>
    </template>
  </v-card>
</template>

<script>
export default {
  layout: 'default-mypage',
  data: () => ({
    // 各タブ情報
    tabInfoList: {
      home: {
        name: 'ホーム',
        isVisible: true,
        isStoreExist: false,
        notice: 0
      },
      info: {
        name: 'お知らせ',
        isVisible: true,
        isStoreExist: false,
        notice: 0
      },
      memo: {
        name: 'メモ',
        isVisible: true,
        isStoreExist: false,
        notice: 0
      },
      Choice: {
        name: '抽選',
        isVisible: false,
        isStoreExist: true,
        notice: 0
      },
      Calendar: {
        name: 'カレンダー',
        isVisible: false,
        isStoreExist: true,
        notice: 0
      },
      Storage: {
        name: 'ストレージ',
        isVisible: false,
        isStoreExist: true,
        notice: 0
      },
      store: {
        name: 'ストア',
        isVisible: true,
        isStoreExist: false,
        notice: 0
      }
    },
    // ページ内状態変数
    selectedTab: null,
    isLoading: true,
    isProjectExist: null,
    isProjectAccess: null
  }),
  async created () {
    if (this.$route.params.id) {
      // プロジェクトIDが存在する
      this.isProjectExist = true
      // アクセス認可検証
      let res
      try {
        const projectId = this.$route.params.id
        res = await this.$axios.get('/api/v1/users/projects/' + projectId)
        // アクセス認可成功時
        this.isProjectAccess = (res.data.result === 'success' && res.data.userProject != null)
      } catch (err) { this.isProjectAccess = false }
    } else {
      // プロジェクトIDが存在しない
      this.isProjectExist = false
    }
    // ローディング終了
    this.isLoading = false
    // ページ内タブ情報初期化
    this.initialPageInfo()
  },
  methods: {
    mock () {
      alert(12)
    },
    /** ページ内タブ情報初期化 */
    async initialPageInfo () {
      // ユーザープロジェクトストア情報取得
      let res
      try {
        const projectId = this.$route.params.id
        res = await this.$axios.get('/api/v1/users/projects/' + projectId + '/stores')
      } catch (err) { alert('ユーザープロジェクトストア情報取得失敗') }
      // ユーザープロジェクトストア情報取得成功
      if (res.data.result === 'success') {
        const tabInfoList = this.tabInfoList
        Object.keys(tabInfoList).forEach((key) => {
          if (tabInfoList[key].isStoreExist) {
            tabInfoList[key].isVisible = false
            res.data.userProjectStores.forEach(function (userProjectStore, index) {
              tabInfoList[userProjectStore.Store.name].isVisible = true
            })
          }
        })
        this.tabInfoList = tabInfoList
      }
      // ユーザープロジェクトストア情報取得失敗
      if (res.data.result === 'error') { alert('ユーザープロジェクトストア情報取得失敗') }
    }
  }
}
</script>
