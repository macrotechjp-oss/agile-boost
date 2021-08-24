<template>
  <v-app-bar app dense clipped-left color="white" style="z-index:10;">
    <v-row class="mx-2" justify="space-between">
      <div>
        <router-link to="/">
          <v-img src="/logo.png" max-height="40" contain position="left left" />
        </router-link>
      </div>
      <div>
        <v-btn class="mr-2" @click="requestDefectDialog=true;requestDefectSuccess=false;">
          要望・不具合
        </v-btn>
        <v-btn class="mr-2" @click="displayAddProjectDialog()">
          プロジェクト追加
          <v-icon right>
            mdi-plus-circle
          </v-icon>
        </v-btn>
        <vue-clock style="margin-bottom:0px;border:none;" />
      </div>
      <!-- 【START】要望・不具合ダイアログ -->
      <v-dialog v-model="requestDefectDialog" max-width="600px">
        <v-card>
          <v-toolbar color="primary" class="white--text">
            要望・不具合
          </v-toolbar>
          <template v-if="requestDefectSuccess">
            <v-img src="https://i.giphy.com/media/W03BErOHKRCt3xVHzs/giphy.webp" contain />
          </template>
          <template v-else>
            <v-card-text class="py-2">
              <v-textarea v-model="requestDefectDetail" solo label="入力内容" hide-details />
            </v-card-text>
            <v-card-actions>
              <v-btn color="success" block :loading="requestDefectLoading" :disabled="requestDefectLoading" @click="sendRequestDefect()">
                送信
              </v-btn>
            </v-card-actions>
          </template>
        </v-card>
      </v-dialog>
      <!-- 【END】要望・不具合ダイアログ -->
      <!-- 【START】プロジェクト追加ダイアログ -->
      <v-dialog v-model="addProjectDialog" max-width="600px">
        <v-card>
          <v-toolbar color="primary" class="white--text">
            プロジェクトの追加
          </v-toolbar>
          <v-card-text>
            <v-col>
              <v-alert v-model="errorMessageAlert" prominent dense dismissible type="error">
                <v-row align="center">
                  <v-col class="grow">
                    {{ errorMessageAlertText }}
                  </v-col>
                </v-row>
              </v-alert>
              <v-text-field
                v-model="projectId"
                flat
                hide-details
                label="プロジェクトID"
                solo-inverted
                append-icon="mdi-magnify"
                @click:append="searchProjectId(projectId)"
              />
              <v-divider class="my-2" />
              <template v-if="isLoading">
                <v-skeleton-loader type="list-item-avatar" />
                <v-skeleton-loader type="list-item-avatar" />
              </template>
              <template v-else>
                <template v-for="projectInfo in projectInfoList">
                  <v-list-item :key="projectInfo.id">
                    <v-list-item-avatar>
                      <v-img :src="projectInfo.iconPath" />
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ projectInfo.name }}&nbsp;<span class="caption grey--text">&lt;{{ projectInfo.id }}&gt;</span></v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip v-for="tag in projectInfo.tags" :key="tag" x-small class="mx-1">
                          {{ tag }}
                        </v-chip>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn rounded color="primary" dark @click="addProject(projectInfo)">
                        追加
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                  <v-expand-transition v-if="projectInfo.isPrivate" :key="projectInfo.id">
                    <div v-if="projectInfo.isPrivateOpen">
                      <v-list-item>
                        <v-list-item-avatar />
                        <v-list-item-content>
                          <v-text-field
                            v-model="projectInfo.seacretCode"
                            label="認証コード"
                            filled
                            rounded
                            hide-details
                            dense
                            :disabled="projectInfo.seacretCodeStatus==seacretCodeStatus.loading"
                            @input="judgmentProjectSeacretCode(projectInfo)"
                          >
                            <template #append>
                              <v-icon v-if="projectInfo.seacretCodeStatus==seacretCodeStatus.success" color="green">
                                mdi-check-bold
                              </v-icon>
                              <v-icon v-if="projectInfo.seacretCodeStatus==seacretCodeStatus.error" color="red">
                                mdi-close
                              </v-icon>
                              <v-progress-circular
                                v-if="projectInfo.seacretCodeStatus==seacretCodeStatus.loading"
                                size="24"
                                color="info"
                                indeterminate
                              />
                            </template>
                          </v-text-field>
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                  </v-expand-transition>
                </template>
              </template>
            </v-col>
            <small>*プロジェクトの新規作成は管理者へご連絡ください。</small>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- 【END】プロジェクト追加ダイアログ -->
    </v-row>
  </v-app-bar>
</template>

<script>
export default {
  data () {
    return {
      // 要望・不具合ダイアログ内の状態変数
      requestDefectDialog: false,
      requestDefectDetail: '',
      requestDefectLoading: false,
      requestDefectSuccess: false,
      // プロジェクト追加ダイアログ内の状態変数
      addProjectDialog: false,
      errorMessageAlert: false,
      errorMessageAlertText: '',
      projectId: '',
      projectInfoList: [
        {
          id: 'dummy',
          name: 'AJP-Dummy',
          iconPath: 'dummy',
          isPrivate: false,
          isPrivateOpen: false,
          tags: ['dummy'],
          seacretCode: null,
          seacretCodeStatus: null
        }
      ],
      isLoading: true,
      seacretCodeStatus: {
        success: 1,
        error: 2,
        loading: 3
      }
    }
  },
  methods: {
    /** 【OBJアクション】要望・不具合送信 */
    async sendRequestDefect () {
      this.requestDefectLoading = true // 要望・不具合送信ローディング表示
      try {
        const response = await this.$axios.post('/api/v1/request-defect', { detail: this.requestDefectDetail })
        if (response.data.result === 'success') { this.requestDefectSuccess = true }
        if (response.data.result === 'error') { alert('送信失敗') }
      } catch (err) { alert('送信失敗') }
      this.requestDefectLoading = false // 要望・不具合送信ローディング非表示
    },
    /** 【OBJアクション】プロジェクト追加ダイアログ表示 */
    async displayAddProjectDialog () {
      this.errorMessageAlert = false // エラーMSGアラート非表示
      this.addProjectDialog = true // プロジェクト追加ダイアログ表示
      await this.initialComponentInfo('') // コンポーネント内プロジェクト情報初期化
      this.isLoading = false // スケルトンローダー終了
    },
    /** 【OBJアクション】プロジェクト追加ダイアログのプロジェクトID検索 */
    searchProjectId (projectId) {
      this.isLoading = true // スケルトンローダー開始
      this.initialComponentInfo(projectId) // コンポーネント内プロジェクト情報初期化
      this.isLoading = false // スケルトンローダー終了
    },
    /** 【OBJアクション】プロジェクト追加ダイアログの追加押下 */
    async addProject (projectInfo) {
      // 未ログイン時は追加不可
      if (!this.$store.state.auth.loggedIn) { return this.displayErrorMessage('未ログインな為、追加不可') }
      // プロジェクト公開状態別の処理
      if (projectInfo.isPrivate) { // 非公開プロジェクトの場合
        projectInfo.isPrivateOpen = !projectInfo.isPrivateOpen
      } else { // 公開プロジェクトの場合
        const result = await this.createUserProject(projectInfo.id, projectInfo.seacretCode)
        if (result) { window.location = '/project/' + projectInfo.id }
        if (!result) { this.displayErrorMessage('プロジェクト追加に失敗しました') }
      }
    },
    /** 【OBJアクション】プロジェクト追加ダイアログの認証コード判定 */
    async judgmentProjectSeacretCode (projectInfo) {
      projectInfo.seacretCodeStatus = this.seacretCodeStatus.loading
      await new Promise(resolve => setTimeout(resolve, 1500)) // ローディング表示の為スリープ
      const result = await this.createUserProject(projectInfo.id, projectInfo.seacretCode)
      if (result) {
        projectInfo.seacretCodeStatus = this.seacretCodeStatus.success
        await new Promise(resolve => setTimeout(resolve, 500)) // 成功表示の為スリープ
        window.location = '/project/' + projectInfo.id
      }
      if (!result) { projectInfo.seacretCodeStatus = this.seacretCodeStatus.error }
    },
    /** 【汎用メソッド】コンポーネント内プロジェクト情報初期化 */
    async initialComponentInfo (projectId) {
      const projectList = await this.getProjectList(projectId)
      if (!projectList) { return this.displayErrorMessage('プロジェクト情報取得に失敗しました') }
      for (const project of projectList) { // プロジェクト追加情報セット
        const tags = []
        const projectTagList = await this.getProjectTagList(project.id)
        if (!projectTagList) { return this.displayErrorMessage('プロジェクト情報取得に失敗しました') }
        projectTagList.forEach((projectTag, index) => tags.push(projectTag.Tag.tagName))
        project.tags = tags
      }
      const projectInfoList = []
      projectList.forEach(function (project, index) {
        projectInfoList.push({
          id: project.id,
          name: project.projectName,
          iconPath: project.projectIconPath,
          isPrivate: project.isPrivate,
          isPrivateOpen: false,
          tags: project.tags,
          seacretCode: null,
          seacretCodeStatus: null
        })
      })
      this.projectInfoList = projectInfoList
    },
    /** 【汎用メソッド】エラーMSG表示 */
    displayErrorMessage (msg) {
      this.errorMessageAlert = true
      this.errorMessageAlertText = msg
    },
    /** 【APIメソッド】プロジェクトリスト取得 */
    async getProjectList (projectId) {
      try {
        const query = (projectId) ? '?projectId=' + projectId : ''
        const response = await this.$axios.get('/api/v1/projects' + query)
        if (response.data.result === 'success') { return response.data.projects }
        if (response.data.result === 'error') { return false }
      } catch (err) { return false }
    },
    /** 【APIメソッド】プロジェクトタグリスト取得 */
    async getProjectTagList (projectId) {
      try {
        const response = await this.$axios.get('/api/v1/projects/' + projectId + '/tags')
        if (response.data.result === 'success') { return response.data.projectTags }
        if (response.data.result === 'error') { return false }
      } catch (err) { return false }
    },
    /** 【APIメソッド】ユーザープロジェクト追加 */
    async createUserProject (projectId, seacretCode) {
      try {
        const response = await this.$axios.post('/api/v1/users/projects', { projectId, seacretCode })
        if (response.data.result === 'success') { return true }
        if (response.data.result === 'error') { return false }
      } catch (err) { return false }
    }
  }
}
</script>
<style>
.clock__hours,.clock__minutes,.clock__seconds{
  background: linear-gradient(to bottom, #4270a4 50%, #5385c3 50%)!important;
  font-size: 1rem!important;
}
.clock__hourtime{
  display:none;
}
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(5px);
  opacity: 0;
}
</style>
