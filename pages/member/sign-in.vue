<template>
  <v-card style="height: calc(100vh - 48px);">
    <v-carousel height="100%" cycle vertical vertical-delimiters="true">
      <v-carousel-item
        v-for="image in imageList"
        :key="image"
        style="height: calc(100vh - 48px);"
      >
        <v-img
          :src="image"
          style="height: calc(100vh - 48px);"
        />
      </v-carousel-item>
      <v-overlay z-index="5">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-avatar
            style="background-color:rgba(104,169,255,0.3);"
            size="550"
          >
            <v-container>
              <v-col class="mx-auto px-5 text-center black--text">
                <v-row justify="center" class="mb-2">
                  <p class="display-1 font-weight-bold white--text text-decoration-underline">
                    Member Sign In
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
                <v-row justify="center" class="mx-5">
                  <v-text-field
                    v-model="password"
                    label="Password"
                    :rules="passwordRules"
                    :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="passwordShow ? 'text' : 'password'"
                    outlined
                    filled
                    @click:append="passwordShow = !passwordShow"
                  />
                </v-row>
                <v-row justify="center" class="my-3">
                  <v-btn
                    color="white"
                    class="black--text"
                    x-large
                    :loading="signInLoading"
                    :disabled="signInLoading"
                    @click="signIn()"
                  >
                    サインイン
                  </v-btn>
                </v-row>
                <v-row justify="center">
                  <nuxt-link to="/member/sign-up" class="white--text">
                    サインアップ
                  </nuxt-link>
                </v-row>
                <v-row justify="center">
                  <nuxt-link to="/member/password-reset" class="white--text">
                    パスワード再設定
                  </nuxt-link>
                </v-row>
              </v-col>
            </v-container>
          </v-avatar>
        </v-form>
        <v-alert
          v-model="isSignInError"
          prominent
          dense
          dismissible
          type="error"
          style="position:fixed;bottom:0;left: 50%;transform: translateX(-50%);"
        >
          <v-row align="center">
            <v-col class="grow">
              サインインに失敗しました。再度、お試しください。
            </v-col>
          </v-row>
        </v-alert>
      </v-overlay>
    </v-carousel>
  </v-card>
</template>

<script>

export default {
  data () {
    return {
      // ユーザー情報
      email: '',
      password: '',
      // ページ内状態変数
      valid: false,
      passwordShow: false,
      signInLoading: false,
      isSignInError: false,
      // バリデーション
      emailRules: [
        v => !!v || 'E-mail は必須項目です。',
        v => /.+@.+\..+/.test(v) || 'E-mail の形式が違います。'
      ],
      passwordRules: [v => !!v || 'Password は必須項目です。'],
      // カルーセル画像リスト
      imageList: [
        'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
        'https://cdn.vuetifyjs.com/images/carousel/planet.jpg'
      ]
    }
  },
  methods: {
    /** サインイン */
    async signIn () {
      // バリデーションチェック
      if (!(await this.$refs.form.validate())) { return false }
      // ローディング開始
      this.signInLoading = true
      // ユーザーサインイン
      let res
      try {
        // eslint-disable-next-line no-unused-vars
        res = await this.$auth.login({
          data: {
            userEmail: this.email,
            userPassword: this.password
          }
        })
        // サインイン処理成功時
        // ToDo デフォルトプロジェクトページへ飛ばす
        if (res.data.result === 'success') { this.$router.push('/') }
        // サインイン処理失敗時
        this.isSignInError = (res.data.result === 'error')
      } catch (err) { this.isSignInError = true }
      // ローディング終了
      this.signInLoading = false
    }
  }
}
</script>
