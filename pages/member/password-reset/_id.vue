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
          <v-avatar style="background-color:rgba(104,169,255,0.3);" size="550">
            <v-container>
              <v-col class="mx-auto px-5 text-center black--text">
                <template v-if="!isUpdatePasswordSuccess">
                  <v-row justify="center" class="mb-2">
                    <p class="display-1 font-weight-bold white--text text-decoration-underline">
                      Password Reset
                    </p>
                  </v-row>
                  <v-row justify="center" class="mx-5">
                    <v-text-field
                      v-model="password"
                      label="New Password"
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
                      label="New Password Confirm"
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
                      :loading="updatePasswordLoading"
                      :disabled="updatePasswordLoading"
                      @click="updatePassword()"
                    >
                      再設定
                    </v-btn>
                  </v-row>
                </template>
                <template v-else>
                  <v-row justify="center" class="mb-2">
                    <p class="display-1 font-weight-bold white--text text-decoration-underline">
                      Password has been reset
                    </p>
                  </v-row>
                  <v-row justify="center" class="mb-2">
                    <v-subheader>パスワード再設定が完了しました。</v-subheader>
                  </v-row>
                  <v-row justify="center">
                    <v-btn color="white" class="black--text" x-large to="/member/sign-in">
                      サインイン
                    </v-btn>
                  </v-row>
                </template>
              </v-col>
            </v-container>
          </v-avatar>
        </v-form>
        <v-alert
          v-model="isUpdatePasswordError"
          prominent
          dense
          dismissible
          type="error"
          style="position:fixed;bottom:0;left: 50%;transform: translateX(-50%);"
        >
          <v-row align="center">
            <v-col class="grow">
              パスワード再設定に失敗しました。パスワード再設定URLを確認頂き、再度お試しください。
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
      password: '',
      passwordConfirm: '',
      // ページ内状態変数
      valid: false,
      passwordShow: false,
      passwordConfirmShow: false,
      updatePasswordLoading: false,
      isUpdatePasswordSuccess: false,
      isUpdatePasswordError: false,
      // バリデーション
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
      return () => (this.password === this.passwordConfirm) || 'New Password が New Password Confirm と一致していません'
    }
  },
  methods: {
    /** パスワード再設定処理 */
    async updatePassword () {
      // バリデーションチェック
      if (!(await this.$refs.form.validate())) { return false }
      // ローディング開始
      this.updatePasswordLoading = true
      // パスワード更新
      let res
      try {
        res = await this.$axios.post('/api/v1/auth/begin-password-reset', {
          resetPasswordToken: this.$route.params.id,
          userPassword: this.password
        })
        // パスワード更新成功時
        this.isUpdatePasswordSuccess = (res.data.result === 'success')
        // パスワード更新失敗時
        this.isUpdatePasswordError = (res.data.result === 'error')
      } catch (err) { this.isUpdatePasswordError = true }
      // ローディング終了
      this.updatePasswordLoading = false
    }
  }
}
</script>
