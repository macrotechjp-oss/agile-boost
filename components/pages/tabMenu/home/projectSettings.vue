<template>
  <z-view image-path="/space/jupiter.png" style="border:none; background-color: rgba(0,0,0,0)!important;">
    <v-overlay style="border-radius: 100%;">
      <h1>プロジェクト設定</h1>
    </v-overlay>
    <z-spot
      slot="extension"
      button
      :angle="45"
      :distance="75"
      size="s"
      label="公開状態の変更"
      style="color:white;background-color: rgba(255, 255, 255, 0.5)!important;border-color: #ffffff !important;"
      @click.native="changeProjecOpenStatusDialog=true"
    >
      <v-icon color="green">
        mdi-lock-open-alert
      </v-icon>
    </z-spot>
    <z-spot
      slot="extension"
      button
      :angle="135"
      :distance="75"
      size="s"
      label="プロジェクト脱退"
      style="color:white;background-color: rgba(255, 255, 255, 0.5)!important;border-color: #ffffff !important;"
      @click.native="projectWithdrawalDialog=true"
    >
      <v-icon color="error">
        mdi-home-export-outline
      </v-icon>
    </z-spot>
    <z-spot
      slot="extension"
      button
      :angle="270"
      :distance="75"
      size="s"
      label="プロジェクト名の変更"
      style="color:white;background-color: rgba(255, 255, 255, 0.5)!important;border-color: #ffffff !important;"
      @click.native="changeProjecNameDialog=true"
    >
      <v-icon color="blue">
        mdi-rename-box
      </v-icon>
    </z-spot>
    <!-- 【START】プロジェクト脱退 -->
    <v-dialog v-model="projectWithdrawalDialog" transition="dialog-top-transition" max-width="600">
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
            このアクションは元に戻せません。<br>
            これにより、{{ $auth.user.userName }} とプロジェクトの関連付けが完全に削除され、再び参加することが出来なくなります。<br>
          </p>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn block color="error" @click="projectWithdrawal()">
            理解しました。プロジェクトを脱退します。
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 【END】プロジェクト脱退 -->
    <!-- 【START】プロジェクト名の変更 -->
    <v-dialog v-model="changeProjecNameDialog" transition="dialog-top-transition" max-width="600">
      <v-card>
        <v-toolbar color="primary" dark>
          プロジェクト名の変更
        </v-toolbar>
        <v-divider class="my-2" />
        <v-card-text>
          <v-subheader>プロジェクト名</v-subheader>
          <v-text-field
            v-model="projectInfo.projectName"
            solo
            dense
            hide-details="false"
          />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn block color="success" @click="updateProjectInfo()">
            更新
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 【END】プロジェクト名の変更 -->
    <!-- 【START】公開状態の変更 -->
    <v-dialog v-model="changeProjecOpenStatusDialog" transition="dialog-top-transition" max-width="600">
      <v-card>
        <v-toolbar color="primary" dark>
          公開状態の変更
        </v-toolbar>
        <v-divider class="my-2" />
        <v-card-text>
          <v-subheader>公開状態</v-subheader>
          <v-btn-toggle v-model="projectInfo.isPrivate" color="primary" dense group>
            <v-btn text :value="false">
              <v-icon>mdi-cloud</v-icon>&nbsp;
              <span>公開</span>
            </v-btn>
            <v-btn text :value="true">
              <v-icon>mdi-cloud-lock</v-icon>&nbsp;
              <span>非公開</span>
            </v-btn>
          </v-btn-toggle>
          <template v-if="projectInfo.isPrivate">
            <v-subheader>認証コード</v-subheader>
            <v-text-field
              v-model="projectInfo.seacretCode"
              solo
              dense
              hide-details="false"
            />
          </template>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn block color="success" @click="updateProjectInfo()">
            更新
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 【END】公開状態の変更 -->
  </z-view>
</template>

<script>
export default {
  data: () => ({
    // プロジェクト情報
    projectInfo: {
      projectName: '',
      isPrivate: null,
      seacretCode: ''
    },
    // ページ内状態定数
    projectId: '',
    projectWithdrawalDialog: null,
    changeProjecNameDialog: null,
    changeProjecOpenStatusDialog: null,
    isProjectUpdateSuccess: true,
    originalStoreList: ['Choice', 'Chat', 'Task', 'Settings', 'Calendar', 'Storage', 'Questionnaire'],
    addImpossibleStoreList: ['Chat', 'Task', 'Settings', 'Calendar', 'Storage', 'Questionnaire', 'Google Drive', '人事労務フリー', 'Q & A', 'Zoom']
  }),
  async created () {
    this.projectId = this.$route.params.id
    // プロジェクト情報取得
    try {
      const projectId = this.projectId
      const res = await this.$axios.get('/api/v1/users/projects/' + projectId)
      if (res.data.result === 'success') {
        this.projectInfo.projectName = res.data.userProject.Project.projectName
        this.projectInfo.isPrivate = res.data.userProject.Project.isPrivate
        this.projectInfo.seacretCode = res.data.userProject.Project.seacretCode
      }
      if (res.data.result === 'error') { alert('ユーザープロジェクト削除失敗') }
    } catch (err) { alert('ユーザープロジェクト削除失敗') }
  },
  methods: {
    /** プロジェクト脱退 */
    async projectWithdrawal () {
      // ユーザープロジェクト削除
      try {
        const projectId = this.projectId
        const res = await this.$axios.delete('/api/v1/users/projects/' + projectId)
        if (res.data.result === 'success') { this.$router.push('/') }
        if (res.data.result === 'error') { alert('ユーザープロジェクト削除失敗') }
      } catch (err) { alert('ユーザープロジェクト削除失敗') }
    },
    /** プロジェクト情報の更新 */
    async updateProjectInfo () {
      // プロジェクト情報更新
      try {
        const projectId = this.projectId
        const res = await this.$axios.patch('/api/v1/projects/' + projectId, {
          projectName: this.projectInfo.projectName,
          isPrivate: this.projectInfo.isPrivate,
          seacretCode: this.projectInfo.seacretCode
        })
        if (res.data.result === 'success') {
          this.changeProjecNameDialog = false
          this.changeProjecOpenStatusDialog = false
        }
        if (res.data.result === 'error') { alert('プロジェクト更新失敗') }
      } catch (err) { alert('プロジェクト更新失敗') }
    }
  }
}
</script>
