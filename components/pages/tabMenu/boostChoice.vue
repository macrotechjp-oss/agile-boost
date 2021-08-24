<template>
  <v-container
    id="scroll-target"
    fluid
    style="height: calc(100vh - 112px);
        background-image:url(https://thumb.photo-ac.com/ca/ca2e9a6bf34c22ba33811cd00398b7ab_w.jpeg);
        background-size:cover;"
    class="overflow-y-auto red"
  >
    <v-card>
      <v-card-title>
        <span><v-img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ27G5XWIDUe31RlFFqNKL-FNa3XWAj_IrRHg&usqp=CAU" height="50" width="50" contain /></span>&nbsp;
        Boost Choice
      </v-card-title>
      <v-card-text class="scroll-y">
        <v-item-group active-class="primary" class="scroll-y">
          <v-row class="scroll-y">
            <v-col cols="12" md="6">
              <v-item>
                <v-card color="pink lighten-4">
                  <div class="d-flex flex-no-wrap justify-space-between">
                    <div>
                      <v-card-title class="text-h5">
                        ルーレット
                      </v-card-title>
                      <v-card-text>複数の選択肢よりランダム抽選が可能。</v-card-text>
                      <v-card-actions>
                        <v-btn
                          class="ml-2"
                          outlined
                          rounded
                          @click="rouletteDialog=!rouletteDialog"
                        >
                          選択
                        </v-btn>
                      </v-card-actions>
                    </div>
                    <v-avatar class="ma-3" size="125" tile>
                      <v-img src="https://www.silhouette-illust.com/wp-content/uploads/2016/12/18913-300x300.jpg" contain />
                    </v-avatar>
                  </div>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
      </v-card-text>
    </v-card>
    <!-- 【START】ルーレットダイアログ -->
    <v-dialog v-model="rouletteDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon @click="rouletteDialog = !rouletteDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>ルーレット</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <VueWinwheel v-if="rouletteComponent" :segments="choices" />
            </v-col>
            <v-divider vertical />
            <v-col cols="12" md="6">
              <v-container style="text-align: left;">
                <v-btn color="success" dark @click="addChoice()">
                  追加
                </v-btn>
                <v-btn color="warning" dark @click="initialPageInfo()">
                  リセット
                </v-btn>
                <v-btn color="error" dark @click="deleteAllChoice()">
                  全て削除
                </v-btn>
                <v-divider class="my-2" />
                <v-text-field
                  v-for="(choice, index) in choices"
                  :key="index"
                  v-model="choice.text"
                  :label="'選択肢'+(index+1)"
                  @change="updateRoulette()"
                >
                  <template #append-outer>
                    <v-btn icon color="error" @click="deleteChoice(index)">
                      <v-icon>
                        mdi-delete-empty
                      </v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-container>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- 【END】ルーレットダイアログ -->
  </v-container>
</template>

<script>
export default {
  // 親コンポーネントからの引継ぎ値
  props: {
    projectId: { // プロジェクトID
      type: String,
      required: true
    }
  },
  data: () => ({
    // 選択肢情報リスト
    choices: [
      {
        textFillStyle: '#fff',
        fillStyle: '#000',
        text: ''
      }
    ],
    // ページ内容状態変数
    rouletteComponent: true,
    rouletteDialog: false
  }),
  created () {
    //  ページ内選択肢情報初期化
    this.initialPageInfo()
  },
  methods: {
    /** ページ内選択肢情報初期化 */
    async initialPageInfo () {
      // プロジェクトメンバー情報リスト取得
      let res1
      try {
        const projectId = this.projectId
        res1 = await this.$axios.get('/api/v1/projects/' + projectId + '/users')
      } catch (err) { alert('プロジェクトメンバー情報取得失敗') }
      // 取得成功 + ページ内のメンバー情報作成
      if (res1.data.result === 'success') {
        const choices = []
        res1.data.userProjects.forEach(function (userProject, index) {
          const choice = {
            textFillStyle: (index % 2 === 1) ? '#000' : '#fff',
            fillStyle: (index % 2 === 1) ? '#fadede' : '#000',
            text: userProject.User.userName
          }
          choices.push(choice)
        })
        this.choices = choices
        // ルーレット再読み込み
        this.updateRoulette()
      }
      // 取得失敗
      if (res1.data.result === 'error') { alert('プロジェクトメンバー情報取得失敗') }
    },
    /** 選択肢追加 */
    addChoice () {
      const choice = {
        textFillStyle: (this.choices.length % 2 === 1) ? '#000' : '#fff',
        fillStyle: (this.choices.length % 2 === 1) ? '#fadede' : '#000',
        text: 'New ' + (this.choices.length + 1)
      }
      this.choices.push(choice)
      // ルーレット再読み込み
      this.updateRoulette()
    },
    /** 指定の選択肢削除 */
    deleteChoice (index) {
      this.choices.splice(index, 1)
      // ルーレット再読み込み
      this.updateRoulette()
    },
    /** 全ての選択肢を削除 */
    deleteAllChoice () {
      this.choices = []
      // ルーレット再読み込み
      this.updateRoulette()
    },
    /** ルーレット情報更新 */
    updateRoulette () {
      this.rouletteComponent = false
      this.$nextTick(() => (this.rouletteComponent = true))
    }
  }
}
</script>
