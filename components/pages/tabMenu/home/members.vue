<template>
  <z-view image-path="/space/sun.png" style="border:none; background-color: rgba(0,0,0,0)!important;">
    <v-overlay style="border-radius: 100%;">
      <h1>所属メンバーリスト</h1>
      <p class="py-2">
        所属メンバーの閲覧及び追加が可能です
      </p>
      <p class="py-2">
        Total：{{ memberInfos.length }} members
      </p>
      <v-dialog v-model="addMemberDialog" transition="dialog-bottom-transition" max-width="80%">
        <v-card>
          <v-toolbar color="primary" dark>
            メンバー招待
          </v-toolbar>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-container style="text-align: center;">
                  <template v-if="projectInfo.isPrivate">
                    <img src="/private.png" height="90%" width="90%" class="mb-2">
                    <p class="ma-0 title font-weight-bold">
                      非公開プロジェクト
                    </p>
                  </template>
                  <template v-else>
                    <img src="/public.png" height="90%" width="90%" class="mb-2">
                    <p class="ma-0 title font-weight-bold">
                      公開プロジェクト
                    </p>
                  </template>
                </v-container>
              </v-col>
              <v-divider vertical />
              <v-col cols="12" md="6">
                <template v-if="projectInfo.isPrivate">
                  <v-container style="text-align: right;">
                    <v-subheader>認証コード</v-subheader>
                    <h2>
                      {{ projectInfo.seacretCode }}
                    </h2>
                    <v-subheader>有効期限</v-subheader>
                    <h2> {{ projectInfo.seacretCodeExpair }} </h2>
                    <v-subheader>その他</v-subheader>
                    <!-- TODO：認証コード更新処理 -->
                    <!-- <v-btn color="primary">
                      認証コード更新
                    </v-btn> -->
                  </v-container>
                </template>
                <template v-else>
                  <v-container>
                    <v-subheader>誰でも追加可能なプロジェクトです。</v-subheader>
                  </v-container>
                </template>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-overlay>
    <z-spot
      v-for="(memberInfo, index) in memberInfos"
      :key="index"
      slot="extension"
      :angle="memberInfo.angle"
      button
      :distance="memberInfo.distance"
      :image-path="memberInfo.userIconPath"
      style="border:none; background-color: rgba(0,0,0,0)!important;"
    >
      <v-overlay style="border-radius: 45px;" opacity="0.3">
        <h3>{{ memberInfo.userName }}</h3>
      </v-overlay>
    </z-spot>
    <z-spot
      slot="extension"
      button
      :angle="45"
      size="s"
      style="color: white;font-size:20px;"
      label="招待"
      @click.native="addMemberDialog = true"
    >
      <v-icon>
        mdi-account-plus
      </v-icon>
    </z-spot>
  </z-view>
</template>

<script>
export default {
  data () {
    return {
      // プロジェクトメンバー情報
      memberInfos: [
        {
          userName: '',
          userIconPath: '',
          angle: 20,
          distance: 100
        }
      ],
      // プロジェクト情報
      projectInfo: {
        isPrivate: true,
        seacretCode: '',
        seacretCodeExpair: ''
      },
      // ページ内状態変数
      projectId: '',
      addMemberDialog: false
    }
  },
  created () {
    this.projectId = this.$route.params.id
    //  ページ内メンバー情報初期化
    this.initialPageInfo()
  },
  methods: {
    /** ページ内メンバー情報初期化 */
    async initialPageInfo () {
      // プロジェクトメンバー情報リスト取得
      let res1
      try {
        const projectId = this.projectId
        res1 = await this.$axios.get('/api/v1/projects/' + projectId + '/users')
      } catch (err) { alert('プロジェクトメンバー情報取得失敗') }
      // 取得成功 + ページ内のメンバー情報作成
      if (res1.data.result === 'success') {
        const memberInfos = []
        let angleValue = 45
        const changeAngle = -35
        let distanceValue = 100
        res1.data.userProjects.forEach(function (userProject, index) {
          if (index === 10) {
            angleValue = 40
            distanceValue = 140
          }
          angleValue = angleValue + changeAngle
          const memberInfo = {
            userName: userProject.User.userName,
            userIconPath: userProject.User.userIconPath,
            angle: angleValue,
            distance: distanceValue
          }
          memberInfos.push(memberInfo)
        })
        this.memberInfos = memberInfos
      }
      // 取得失敗
      if (res1.data.result === 'error') { alert('プロジェクトメンバー情報取得失敗') }
      // プロジェクト情報取得
      let res2
      try {
        const projectId = this.projectId
        res2 = await this.$axios.get('/api/v1/projects/' + projectId)
      } catch (err) { alert('プロジェクト情報取得失敗') }
      // 取得成功 + ページ内のプロジェクト情報作成
      if (res2.data.result === 'success') {
        this.projectInfo.isPrivate = res2.data.project.isPrivate
        this.projectInfo.seacretCode = res2.data.project.seacretCode
        this.projectInfo.seacretCodeExpair = (res2.data.project.seacretCodeExpair) ? res2.data.project.seacretCodeExpair : '-'
      }
      // 取得失敗
      if (res2.data.result === 'error') { alert('プロジェクト情報取得失敗') }
    }
  }
}
</script>
