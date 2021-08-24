<template>
  <v-card>
    <v-toolbar>
      <v-tabs
        v-model="tab"
        color="deep-purple accent-4"
        left
      >
        <v-tab key="0">
          一般
        </v-tab>
        <v-tabs-items v-model="tab">
          <v-tab-item key="0">
            <v-container
              id="scroll-target"
              fluid
              style="height: calc(100vh - 112px);
        background-image:url(https://thumb.photo-ac.com/ca/ca2e9a6bf34c22ba33811cd00398b7ab_w.jpeg);
        background-size:cover;"
              class="overflow-y-auto"
            >
              <v-alert
                v-if="!userInfo.isActive"
                border="left"
                colored-border
                type="warning"
                elevation="2"
              >
                アカウントが有効化されておりません。アカウント有効化は<nuxt-link to="/member/account-activation">
                  こちら
                </nuxt-link> 。
              </v-alert>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-card>
                  <v-card-title>Profile</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="3">
                        <v-subheader>ユーザーアイコン</v-subheader>
                        <v-row justify="center">
                          <v-hover v-slot="{ hover }">
                            <v-avatar class="ma-1" width="200" height="200">
                              <img :src="userInfo.userIconPath">
                              <v-overlay v-if="hover || imageUploadLoading" absolute>
                                <v-progress-circular
                                  v-if="imageUploadLoading"
                                  :size="50"
                                  color="primary"
                                  indeterminate
                                />
                                <v-btn
                                  v-else
                                  color="primary"
                                  @click="$refs.userIconInput.click()"
                                >
                                  変更する
                                </v-btn>
                              </v-overlay>
                              <input ref="userIconInput" type="file" accept=".jpeg,.jpg,.png" style="display:none;" @change="setUserIconPath()">
                            </v-avatar>
                          </v-hover>
                        </v-row>
                        <small>*jpeg/jpg/png Only</small>
                        <v-subheader>アカウント有効化状態</v-subheader>
                        <v-row justify="end" class="mx-2">
                          <span v-if="userInfo.isActive" class="subtitle-1 green--text font-weight-bold">有効化済み</span>
                          <span v-else class="subtitle-1 red--text font-weight-bold">未有効化</span>
                        </v-row>
                      </v-col>
                      <v-divider vertical />
                      <v-col cols="12" md="9">
                        <v-subheader>ユーザー名</v-subheader>
                        <v-text-field
                          v-model="userInfo.userName"
                          solo
                          :rules="nameRules"
                        />
                        <v-subheader>メールアドレス<small>&nbsp;&nbsp;*メールアドレスは変更対応しておりません</small></v-subheader>
                        <v-text-field
                          v-model="userInfo.userEmail"
                          solo
                          disabled
                          :rules="emailRules"
                        />
                        <v-subheader>パスワード</v-subheader>
                        <p>
                          パスワード変更は <nuxt-link target="_blank" to="/member/password-reset">
                            こちら
                          </nuxt-link>
                        </p>
                        <v-divider class="my-2" />
                        <v-btn
                          color="white"
                          class="black--text mr-2"
                          x-large
                          :loading="userUpdateLoading"
                          :disabled="userUpdateLoading"
                          @click="profileUpdate()"
                        >
                          保存
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-title>Demilitarized Zone</v-card-title>
                  <v-card-text>
                    <v-btn
                      color="white"
                      class="black--text mr-2"
                      x-large
                      :loading="logoutLoading"
                      :disabled="logoutLoading"
                      @click="logout()"
                    >
                      ログアウト
                    </v-btn>
                    <v-dialog transition="dialog-top-transition" max-width="600">
                      <template #activator="{ on, attrs }">
                        <v-btn
                          color="white"
                          class="black--text mr-2"
                          x-large
                          v-bind="attrs"
                          v-on="on"
                        >
                          アカウント削除
                        </v-btn>
                      </template>
                      <v-card>
                        <v-toolbar color="primary" dark>
                          本当によろしいですか?
                        </v-toolbar>
                        <v-card-text>
                          <v-alert
                            dense
                            class="mt-2"
                            border="left"
                            type="warning"
                          >
                            これを読まないと、思いがけない悪いことが起こります！
                          </v-alert>
                          <p>
                            このアクションは元に戻せません。
                            これにより、{{ $auth.user.userName }} が完全に削除され、すべてのプロジェクトの関連付けが削除されます。<br>
                            {{ $auth.user.userName }} と入力して確認してください。
                          </p>
                          <v-text-field
                            v-model="userNameForDelete"
                            solo
                            dense
                            :label="$auth.user.userName"
                            hide-details="false"
                          />
                        </v-card-text>
                        <v-card-actions class="justify-end">
                          <v-btn
                            block
                            color="error"
                            :disabled="!(userNameForDelete==$auth.user.userName) || userDeleteLoading"
                            :loading="userDeleteLoading"
                            @click="accountDeletion()"
                          >
                            理解しました。削除を実行します。
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-card-text>
                </v-card>
              </v-form>
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-toolbar>
    <v-alert
      v-model="isInitialDispError"
      prominent
      dense
      dismissible
      type="error"
      style="position:fixed;bottom:0;left: 50%;transform: translateX(-50%);"
    >
      <v-row align="center">
        <v-col class="grow">
          ユーザー情報取得に失敗しました。再度、お試しください。
        </v-col>
      </v-row>
    </v-alert>
    <v-alert
      v-model="isImageUploadError"
      prominent
      dense
      dismissible
      type="error"
      style="position:fixed;bottom:0;left: 50%;transform: translateX(-50%);"
    >
      <v-row align="center">
        <v-col class="grow">
          画像取得に失敗しました。対応拡張子を確認頂き、再度お試しください。
        </v-col>
      </v-row>
    </v-alert>
    <v-alert
      v-model="isUserUpdateSuccess"
      prominent
      dense
      dismissible
      type="success"
      style="position:fixed;bottom:0;left: 50%;transform: translateX(-50%);"
    >
      <v-row align="center">
        <v-col class="grow">
          プロフィール更新に成功しました。
        </v-col>
      </v-row>
    </v-alert>
    <v-alert
      v-model="isUserUpdateError"
      prominent
      dense
      dismissible
      type="error"
      style="position:fixed;bottom:0;left: 50%;transform: translateX(-50%);"
    >
      <v-row align="center">
        <v-col class="grow">
          プロフィール更新に失敗しました。再度、お試しください。
        </v-col>
      </v-row>
    </v-alert>
    <v-alert
      v-model="isUserDeleteError"
      prominent
      dense
      dismissible
      type="error"
      style="position:fixed;bottom:0;left: 50%;transform: translateX(-50%);"
    >
      <v-row align="center">
        <v-col class="grow">
          アカウント削除処理に失敗しました。再度、お試しください。
        </v-col>
      </v-row>
    </v-alert>
  </v-card>
</template>

<script>
export default {
  layout: 'default-mypage',
  data: () => ({
    // ユーザー情報
    userInfo: {
      isActive: null,
      userName: '',
      userEmail: '',
      userIconPath: ''
    },
    // ページ内状態変数
    tab: '1',
    valid: false,
    isInitialDispError: false,
    imageUploadLoading: false,
    isImageUploadError: false,
    userUpdateLoading: false,
    isUserUpdateSuccess: false,
    isUserUpdateError: false,
    logoutLoading: false,
    userNameForDelete: null,
    userDeleteLoading: false,
    isUserDeleteError: false,
    // バリデーション
    nameRules: [
      v => !!v || 'ユーザー名 が入力されていません。'
    ],
    emailRules: [
      v => !!v || 'メールアドレス が入力されていません。',
      v => /.+@.+\..+/.test(v) || 'メールアドレス の形式が違います。'
    ]
  }),
  async created () {
    // プロフィール情報取得
    try {
      const res = await this.$axios.get('/api/v1/auth/me')
      this.userInfo.isActive = res.data.isActive
      this.userInfo.userName = res.data.userName
      this.userInfo.userEmail = res.data.userEmail
      this.userInfo.userIconPath = res.data.userIconPath
    } catch (err) { this.isInitialDispError = true }
  },
  methods: {
    /** ユーザーアイコンをセット ※ファイル選択で発火 */
    async setUserIconPath () {
      // 更新対象画像
      const file = this.$refs.userIconInput.files[0]
      // ローディング開始
      this.imageUploadLoading = true
      // ファイルアップロード+画像パス取得
      try {
        const params = new FormData()
        params.append('file', file)
        const res = await this.$axios.post('/api/v1/upload', params)
        // ユーザーアイコンセット
        this.userInfo.userIconPath = res.data.imagePath
      } catch (err) { this.isImageUploadError = true }
      // ローディング終了
      this.imageUploadLoading = false
    },
    /** プロフィール更新 */
    async profileUpdate () {
      // バリデーションチェック
      if (!(await this.$refs.form.validate())) { return false }
      // ローディング開始
      this.userUpdateLoading = true
      // ユーザー情報更新処理
      let res
      try {
        res = await this.$axios.patch('/api/v1/users', {
          userName: this.userInfo.userName,
          userIconPath: this.userInfo.userIconPath
        })
      } catch (err) { this.isUserUpdateError = true }
      // プロフィール更新処理成功時
      this.isUserUpdateSuccess = (res.data.result === 'success')
      // プロフィール更新失敗時
      this.isUserUpdateError = (res.data.result === 'error')
      // ローディング終了
      this.userUpdateLoading = false
    },
    /** ログアウト */
    async logout () {
      // ローディング開始
      this.logoutLoading = true
      // ログアウト処理
      await this.$auth.logout()
    },
    /** アカウント削除 */
    async accountDeletion () {
      // ローディング開始
      this.userDeleteLoading = true
      // アカウント削除処理
      let res
      try {
        res = await this.$axios.delete('/api/v1/users')
      } catch (err) { this.isUserDeleteError = true }
      // アカウント削除処理失敗時
      this.isUserDeleteError = (res.data.result === 'error')
      // アカウント削除処理成功時
      if (res.data.result === 'success') { await this.$auth.logout() }
    }
  }
}
</script>
