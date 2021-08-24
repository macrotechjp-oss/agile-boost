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
                <template v-if="!isSignUpSuccess">
                  <v-row justify="center" class="mb-2">
                    <p class="display-1 font-weight-bold white--text text-decoration-underline">
                      Member Sign Up
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
                  <v-row justify="center" class="mx-5">
                    <v-text-field
                      v-model="passwordConfirm"
                      label="Password Confirm"
                      :append-icon="passwordConfirmShow ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="passwordConfirmShow ? 'text' : 'password'"
                      :rules="[passwordConfirmRules, passwordConfirmCustomRules]"
                      outlined
                      filled
                      @click:append="passwordConfirmShow = !passwordConfirmShow"
                    />
                  </v-row>
                  <v-row justify="center" class="my-3">
                    <v-btn
                      color="white"
                      class="black--text"
                      x-large
                      :loading="signUpLoading"
                      :disabled="signUpLoading"
                      @click="signUp()"
                    >
                      サインアップ
                    </v-btn>
                  </v-row>
                  <v-row justify="center">
                    <nuxt-link to="/member/sign-in" class="white--text">
                      サインイン
                    </nuxt-link>
                  </v-row>
                </template>
                <template v-else>
                  <v-row justify="center" class="mb-2">
                    <p class="display-1 font-weight-bold white--text text-decoration-underline">
                      Welcome to Agile Boost
                    </p>
                  </v-row>
                  <v-row justify="center" class="mb-2">
                    <v-subheader>アカウント作成が完了しました。</v-subheader>
                    <v-subheader>アカウント登録確認メールよりアカウント有効化を行ってください。</v-subheader>
                  </v-row>
                  <v-row justify="center">
                    <v-btn
                      color="white"
                      class="black--text"
                      x-large
                      to="/member/sign-in"
                    >
                      サインイン
                    </v-btn>
                  </v-row>
                </template>
              </v-col>
            </v-container>
          </v-avatar>
        </v-form>
        <v-alert
          v-model="isSignUpError"
          prominent
          dense
          dismissible
          type="error"
          style="position:fixed;bottom:0;left: 50%;transform: translateX(-50%);"
        >
          <v-row align="center">
            <v-col class="grow">
              アカウント作成に失敗しました。再度、お試しください。
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
      password: '',
      passwordConfirm: '',
      // ページ内状態変数
      valid: false,
      passwordShow: false,
      passwordConfirmShow: false,
      signUpLoading: false,
      isSignUpSuccess: false,
      isSignUpError: false,
      // バリデーション
      emailRules: [
        v => !!v || 'E-mail は必須項目です。',
        v => /.+@.+\..+/.test(v) || 'E-mail の形式が違います。'
      ],
      passwordRules: [v => !!v || 'Password は必須項目です。'],
      passwordConfirmRules: [v => !!v || 'Password Confirm は必須項目です。'],
      // カルーセル画像リスト
      imageList: [
        'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
        'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
        'https://cdn.vuetifyjs.com/images/carousel/planet.jpg'
      ]
    }
  },
  computed: {
    /** カスタムバリデーション - パスワード確認 */
    passwordConfirmCustomRules () {
      return () => (this.password === this.passwordConfirm) || 'Password が Password Confirm と一致していません'
    }
  },
  created () {
    if (this.$store.state.currentUser != null) { alert('サインイン済みな為HOMEへ') }
  },
  methods: {
    /** サインアップ */
    async signUp () {
      // バリデーションチェック
      if (!(await this.$refs.form.validate())) { return false }
      // ローディング開始
      this.signUpLoading = true
      // ユーザー登録&メール送信
      let res
      try {
        res = await this.$axios.post('/api/v1/auth/sign-up', {
          userEmail: this.email,
          userPassword: this.password
        })
      } catch (err) { this.isSignUpError = true }
      // サインアップ処理成功時
      this.isSignUpSuccess = (res.data.result === 'success')
      // サインアップ処理失敗時
      this.isSignUpError = (res.data.result === 'error')
      // ローディング終了
      this.signUpLoading = false
    }
  }
}
</script>
