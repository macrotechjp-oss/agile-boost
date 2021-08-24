<template>
  <z-view image-path="/space/earch.png" style="border:none; background-color: rgba(0,0,0,0)!important;">
    <v-overlay style="border-radius: 100%;">
      <h1>外部アプリ情報</h1>
      <p class="py-2">
        外部アプリのリンク設定が可能です
      </p>
      <v-divider class="py-2" />
      <v-btn
        class="mx-2"
        fab
        dark
        large
        color="cyan"
        @click="addExternalLinkDialog = true"
      >
        <v-icon dark>
          mdi-plus
        </v-icon>
      </v-btn>
      <v-dialog v-model="addExternalLinkDialog" transition="dialog-bottom-transition" max-width="600">
        <v-card>
          <v-toolbar color="primary" dark>
            外部アプリリンクの追加
          </v-toolbar>

          <v-card-text>
            <v-divider class="my-2" />
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-select
                v-model="newExternalAppInfo.iconName"
                :items="iconNameList"
                :rules="iconRules"
                label="アイコン"
                style="position:relative;"
                @change="newExternalAppInfo.imagePath = iconNamePathMap[newExternalAppInfo.iconName]"
              >
                <template #prepend style="margin:0;">
                  <v-avatar style="top: -10px;">
                    <template v-if="iconNamePathMap[newExternalAppInfo.iconName]">
                      <img :src="iconNamePathMap[newExternalAppInfo.iconName]">
                    </template>
                    <template v-else>
                      <img src="/no-image.png">
                    </template>
                  </v-avatar>
                </template>
              </v-select>
              <v-text-field
                v-model="newExternalAppInfo.serviceName"
                :rules="serviceNameRules"
                label="サービス名"
                required
              />
              <v-text-field
                v-model="newExternalAppInfo.accessUrl"
                :rules="accessUrlRules"
                label="アクセスURL"
                required
              />
              <v-btn
                :disabled="!valid"
                color="success"
                @click="addExternalLink()"
              >
                追加
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-overlay>
    <z-spot
      v-for="(externalAppInfo, index) in externalAppInfos"
      :key="index"
      slot="extension"
      :angle="externalAppInfo.angle"
      button
      :image-path="externalAppInfo.imagePath"
      style="border:none; background-color: rgba(0,0,0,0)!important;"
      @click.native="toLink(externalAppInfo.accessUrl)"
    >
      <v-overlay style="border-radius: 45px;">
        {{ externalAppInfo.name }}
      </v-overlay>
    </z-spot>
  </z-view>
</template>

<script>
export default {
  data () {
    return {
      // 外部アプリ情報
      externalAppInfos: [
        {
          name: '',
          imagePath: '',
          accessUrl: '',
          angle: 45 + (180)
        }
      ],
      // NEW外部アプリ情報
      newExternalAppInfo: {
        serviceName: '',
        iconName: '',
        imagePath: '',
        accessUrl: ''
      },
      // ページ内状態変数
      projectId: '',
      valid: true,
      addExternalLinkDialog: false,
      // バリデーション
      iconRules: [v => !!v || 'アイコン は必須項目です。'],
      serviceNameRules: [v => !!v || 'サービス名 は必須項目です。'],
      accessUrlRules: [
        v => !!v || 'アクセスURL は必須項目です。',
        v => /https:\/\/.*/.test(v) || 'アクセスURL の形式が間違っています。'
      ],
      // ページ内状態定数
      iconNameList: ['ZOOM', 'Github', 'Gitlab', 'Chatwork', 'Slack', 'Other'],
      iconNamePathMap: {
        ZOOM: '/zoom.png',
        Github: '/github.png',
        Gitlab: '/gitlab.png',
        Chatwork: '/chatwork.jpg',
        Slack: '/slack.png',
        Other: '/other.png'
      }
    }
  },
  created () {
    this.projectId = this.$route.params.id
    // ページ内外部アプリリンク情報初期化
    this.initialPageInfo()
  },
  methods: {
    /** ページ内外部アプリリンク情報初期化 */
    async initialPageInfo () {
      // プロジェクト外部アプリ情報取得
      let res
      try {
        const projectId = this.projectId
        res = await this.$axios.get('/api/v1/projects/' + projectId + '/external-links')
      } catch (err) { alert('外部アプリ情報取得失敗') }
      // 取得成功 + ページ内外部アプリリンク情報作成
      if (res.data.result === 'success') {
        const externalAppInfos = []
        const angleValue = 45
        const addValue = 360 / res.data.projectExternalLinks.length
        res.data.projectExternalLinks.forEach(function (projectExternalLink, index) {
          const externalAppInfo = {
            name: projectExternalLink.serviceName,
            imagePath: projectExternalLink.iconPath,
            accessUrl: projectExternalLink.accessUrl,
            angle: angleValue + (180) + (addValue * index)
          }
          externalAppInfos.push(externalAppInfo)
        })
        this.externalAppInfos = externalAppInfos
      }
      // 取得失敗
      if (res.data.result === 'error') { alert('外部アプリ情報取得失敗') }
    },
    /** 外部アプリリンクの追加 */
    async addExternalLink () {
      // バリデーションチェック
      if (!(await this.$refs.form.validate())) { return false }
      // データチェック
      if (this.externalAppInfos.length >= 10) { alert('10件以上は登録出来ません'); return false }
      // 外部アプリリンク追加
      let res
      try {
        const projectId = this.projectId
        res = await this.$axios.post('/api/v1/projects/' + projectId + '/external-links', {
          serviceName: this.newExternalAppInfo.serviceName,
          iconPath: this.newExternalAppInfo.imagePath,
          accessUrl: this.newExternalAppInfo.accessUrl
        })
      } catch (err) { alert('外部アプリリンク追加失敗') }
      // 追加成功
      if (res.data.result === 'success') {
        alert('外部アプリリンク追加成功')
        // NEW外部アプリダイアログ非表示
        this.addExternalLinkDialog = false
        // NEW外部アプリ情報初期化
        this.newExternalAppInfo = {
          serviceName: '',
          iconName: '',
          imagePath: '',
          accessUrl: ''
        }
        // ページ内外部アプリリンク情報初期化
        this.initialPageInfo()
      }
      // 追加失敗
      if (res.data.result === 'error') { alert('外部アプリリンク追加失敗') }
    },
    /** 外部アプリリンクの削除 */
    deleteExternalLink () {
      // TODO：削除処理
    },
    /** 汎用メソッド：新規ウィンドウオープン */
    toLink (url) {
      return window.open(url, '_blank')
    }
  }
}
</script>
