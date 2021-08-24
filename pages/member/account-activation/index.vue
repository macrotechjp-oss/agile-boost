<template>
  <v-card style="height: calc(100vh - 48px);">
    <v-carousel height="100%" cycle vertical vertical-delimiters="true">
      <v-carousel-item v-for="image in imageList" :key="image" style="height: calc(100vh - 48px);">
        <v-img :src="image" style="height: calc(100vh - 48px);" />
      </v-carousel-item>
      <v-overlay z-index="5">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-avatar style="background-color:rgba(104,169,255,0.3);" size="550">
            <v-container>
              <v-col class="mx-auto px-5 text-center black--text">
                <template v-if="!isSendMailSuccess">
                  <v-row justify="center" class="mb-2">
                    <p class="display-1 font-weight-bold white--text text-decoration-underline">
                      アカウント有効化
                    </p>
                  </v-row>
                  <v-row justify="center" class="mx-5">
                    <v-text-field
                      v-model="email"
                      label="E-mail"
                      outlined
                      :rules="emailRules"
                      filled
                    />
                  </v-row>
                  <v-row justify="center" class="my-3">
                    <v-btn
                      color="white"
                      class="black--text"
                      x-large
                      :loading="sendMailLoading"
                      :disabled="sendMailLoading"
                      @click="accountACtivation()"
                    >
                      送信
                    </v-btn>
                  </v-row>
                </template>
                <template v-else>
                  <v-row justify="center" class="mb-2">
                    <p class="display-1 font-weight-bold white--text text-decoration-underline">
                      Please Check Your E-mail
                    </p>
                  </v-row>
                  <v-row justify="center" class="mb-2">
                    <v-subheader>アカウント有効化のメールが送信されました。</v-subheader>
                    <v-subheader>送信されたメールをご確認ください。</v-subheader>
                  </v-row>
                </template>
              </v-col>
            </v-container>
          </v-avatar>
        </v-form>
        <v-alert
          v-model="isSendMailError"
          prominent
          dense
          dismissible
          type="error"
          style="position:fixed;bottom:0;left: 50%;transform: translateX(-50%);"
        >
          <v-row align="center">
            <v-col class="grow">
              アカウント有効化メール送信処理に失敗しました。再度、お試しください。
            </v-col>
          </v-row>
        </v-alert>
      </v-overlay>
    </v-carousel>
  </v-card>
</template>

<script>

export default {
  auth: false,
  data () {
    return {
      // ユーザー情報
      email: '',
      // ページ内状態変数
      valid: false,
      sendMailLoading: false,
      isSendMailSuccess: false,
      isSendMailError: false,
      // バリデーション
      emailRules: [
        v => !!v || 'E-mail は必須項目です。',
        v => /.+@.+\..+/.test(v) || 'E-mail の形式が違います。'
      ],
      // カルーセル画像リスト
      imageList: [
        'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
        'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
        'https://cdn.vuetifyjs.com/images/carousel/planet.jpg'
      ]
    }
  },
  methods: {
    /** アカウント有効化処理 */
    async accountACtivation () {
      // バリデーションチェック
      if (!(await this.$refs.form.validate())) { return false }
      // ローディング開始
      this.sendMailLoading = true
      // アカウント有効化メール送信
      let res
      try {
        res = await this.$axios.post('/api/v1/auth/send-account-activation', { userEmail: this.email })
        // アカウント有効化メール送信処理成功時
        this.isSendMailSuccess = (res.data.result === 'success')
        // アカウント有効化メール送信処理失敗時
        this.isSendMailError = (res.data.result === 'error')
      } catch (err) { this.isSendMailError = true }
      // ローディング終了
      this.sendMailLoading = false
    }
  }
}
</script>
