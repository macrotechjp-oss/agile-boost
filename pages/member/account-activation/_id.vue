<template>
  <v-card style="height: calc(100vh - 48px);">
    <v-carousel height="100%" cycle vertical vertical-delimiters="true">
      <v-carousel-item v-for="image in imageList" :key="image" style="height: calc(100vh - 48px);">
        <v-img :src="image" style="height: calc(100vh - 48px);" />
      </v-carousel-item>
      <v-overlay z-index="5">
        <v-avatar style="background-color:rgba(104,169,255,0.3);" size="550">
          <v-container>
            <v-row justify="center" class="mb-2">
              <p class="display-1 font-weight-bold white--text text-decoration-underline">
                アカウント有効化
              </p>
            </v-row>
            <template v-if="isProgress">
              <v-progress-circular indeterminate />
            </template>
            <template v-if="isSuccessAccountActivation">
              <v-row justify="center" class="mb-2">
                <v-subheader>アカウント有効化に成功しました。</v-subheader>
              </v-row>
              <v-row justify="center">
                <v-btn color="white" class="black--text" x-large to="/">
                  HOME
                </v-btn>
              </v-row>
            </template>
            <template v-if="isErrorAccountActivation">
              <v-row justify="center" class="mb-2">
                <v-subheader class="red--text">
                  アカウント有効化に失敗しました。
                </v-subheader>
              </v-row>
              <v-row justify="center" class="mb-2">
                <small>以下の可能性が考えられます。</small>
              </v-row>
              <v-row justify="center" class="mb-2">
                <small>* アカウント有効化コードが間違っている</small>
              </v-row>
              <v-row justify="center" class="mb-2">
                <small>* アカウント有効化コードの有効期限が切れている</small>
              </v-row>
            </template>
          </v-container>
        </v-avatar>
      </v-overlay>
    </v-carousel>
  </v-card>
</template>

<script>

export default {
  auth: false,
  data () {
    return {
      // ページ内状態変数
      isProgress: true,
      isSuccessAccountActivation: false,
      isErrorAccountActivation: false,
      // カルーセル画像リスト
      imageList: [
        'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
        'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
        'https://cdn.vuetifyjs.com/images/carousel/planet.jpg'
      ]
    }
  },
  async created () {
    // アカウント有効化処理
    let res
    try {
      const activeTokenCode = this.$route.params.id
      res = await this.$axios.post('/api/v1/auth/begin-account-activation', { activeTokenCode })
      // アカウント有効化メール送信処理成功時
      this.isSuccessAccountActivation = (res.data.result === 'success')
      // アカウント有効化メール送信処理失敗時
      this.isErrorAccountActivation = (res.data.result === 'error')
    } catch (err) { this.isErrorAccountActivation = true }
    this.isProgress = false // プログレス終了
  }
}
</script>
