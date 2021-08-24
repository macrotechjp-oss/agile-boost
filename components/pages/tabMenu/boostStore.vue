<template>
  <v-container
    id="scroll-target"
    fluid
    style="height: calc(100vh - 112px);
        background-image:url(https://thumb.photo-ac.com/ca/ca2e9a6bf34c22ba33811cd00398b7ab_w.jpeg);
        background-size:cover;"
    class="overflow-y-auto"
  >
    <v-card style="background-color:rgba(0,0,0,0);">
      <v-card-title>
        <span><v-img src="https://img.icons8.com/fluent/2x/online-store.png" height="50" width="50" contain /></span>&nbsp;
        Boost Store
      </v-card-title>
      <v-card-subtitle>自由に追加可能な機能一覧</v-card-subtitle>
      <v-card-text class="scroll-y">
        <v-item-group active-class="primary" class="scroll-y">
          <v-row class="scroll-y">
            <v-col v-for="(storeInfo, index) in storeInfos" :key="index" cols="12" md="4">
              <v-item>
                <v-card :class="((index%2==0)?'blue lighten-4':'blue lighten-5')">
                  <div class="d-flex flex-no-wrap justify-space-between">
                    <div>
                      <v-card-title class="text-h5">
                        {{ storeInfo.name }}
                        <v-tooltip bottom>
                          <template #activator="{ on, attrs }">
                            <v-chip
                              v-if="storeInfo.isOriginal"
                              class="ma-2 white--text"
                              small
                              color="blue"
                              v-bind="attrs"
                              v-on="on"
                            >
                              Boost
                            </v-chip>
                          </template>
                          <span>Agile Boostオリジナル機能</span>
                        </v-tooltip>
                      </v-card-title>
                      <v-card-text>{{ storeInfo.description }}</v-card-text>
                      <v-card-actions>
                        <template v-if="!storeInfo.isAdded && storeInfo.isAddPossible">
                          <v-btn outlined color="success" rounded small @click="addStore(storeInfo)">
                            追加
                          </v-btn>
                        </template>
                        <template v-if="storeInfo.isAdded && storeInfo.isAddPossible">
                          <v-btn class="mr-2" outlined rounded small disabled>
                            追加済み
                          </v-btn>
                          <v-dialog transition="dialog-top-transition" max-width="600">
                            <template #activator="{ on, attrs }">
                              <v-btn
                                color="error"
                                outlined
                                rounded
                                small
                                v-bind="attrs"
                                v-on="on"
                              >
                                削除
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
                                  このアクションによりデータが完全に削除されることはありません。<br>
                                  これにより、プロジェクトの関連付けが一時的に削除される為、再び追加することにより以前のデータが復元されます。
                                </p>
                              </v-card-text>
                              <v-card-actions class="justify-end">
                                <v-btn block color="error" @click="deleteStore(storeInfo)">
                                  理解しました。削除を実行します。
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </template>
                        <template v-if="!storeInfo.isAddPossible">
                          <v-btn class="ml-2" outlined rounded small disabled>
                            追加不可
                          </v-btn>
                        </template>
                      </v-card-actions>
                    </div>
                    <v-avatar class="ma-3" size="125" tile>
                      <v-img :src="storeInfo.iconPath" contain />
                    </v-avatar>
                  </div>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
      </v-card-text>
    </v-card>
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
    // ストア情報リスト
    storeInfos: [{
      id: 1,
      name: 'dummy',
      description: 'dummy',
      iconPath: 'dummy',
      isAdded: false,
      isOriginal: true,
      isAddPossible: false
    }],
    // ページ内状態定数
    originalStoreList: ['Choice', 'Chat', 'Task', 'Settings', 'Calendar', 'Storage', 'Questionnaire', 'CI/CD'],
    addImpossibleStoreList: ['Chat', 'Task', 'Settings', 'Questionnaire', 'Google Drive', '人事労務フリー', 'Q & A', 'Zoom', 'Chatwork', 'CI/CD']
  }),
  created () {
    // ページ内ストア情報初期化
    this.initialPageInfo()
  },
  methods: {
    /** ページ内ストア情報初期化 */
    async initialPageInfo () {
      // ストア情報リスト取得
      let res1
      try {
        res1 = await this.$axios.get('/api/v1/stores')
      } catch (err) { alert('ストア情報取得失敗') }
      // ストア情報取得成功
      if (res1.data.result === 'success') { /** */ }
      // ストア情報取得失敗
      if (res1.data.result === 'error') { alert('ストア情報取得失敗') }
      // ユーザープロジェクトストア情報取得
      let res2
      try {
        const projectId = this.projectId
        res2 = await this.$axios.get('/api/v1/users/projects/' + projectId + '/stores')
      } catch (err) { alert('プロジェクトお知らせ情報取得失敗') }
      // ユーザープロジェクトストア情報取得成功
      if (res2.data.result === 'success') { /** */ }
      // ユーザープロジェクトストア情報取得失敗
      if (res2.data.result === 'error') { alert('ストア情報取得失敗') }
      // ページ内ストア情報作成
      const storeInfos = []
      const userStoreList = []
      const originalStoreList = this.originalStoreList
      const addImpossibleStoreList = this.addImpossibleStoreList
      res2.data.userProjectStores.forEach(function (userProjectStore, index) {
        userStoreList.push(userProjectStore.Store.id)
      })
      res1.data.stores.forEach(function (store, index) {
        const storeInfo = {
          id: store.id,
          name: store.name,
          description: store.description,
          iconPath: store.iconPath,
          isAdded: (userStoreList.includes(store.id)),
          isOriginal: (originalStoreList.includes(store.name)),
          isAddPossible: (!addImpossibleStoreList.includes(store.name))
        }
        storeInfos.push(storeInfo)
      })
      this.storeInfos = storeInfos
    },
    /** ユーザープロジェクトへストア追加 */
    async addStore (store) {
      // ストア追加
      try {
        const projectId = this.projectId
        const res = await this.$axios.post('/api/v1/users/projects/' + projectId + '/stores', {
          storeId: store.id
        })
        if (res.data.result === 'success') {
          // ページ内ストア情報初期化
          this.initialPageInfo()
          // プロジェクトタブ情報更新
          this.$emit('updateTabInfo')
        }
        if (res.data.result === 'error') { alert('追加失敗') }
      } catch (err) { alert('追加失敗') }
    },
    /** ユーザープロジェクトのストア削除 */
    async deleteStore (storeInfo) {
      // お知らせ削除
      try {
        const projectId = this.projectId
        const storeId = storeInfo.id
        const res = await this.$axios.delete('/api/v1/users/projects/' + projectId + '/stores/' + storeId)
        // 削除成功
        if (res.data.result === 'success') {
          // ページ内お知らせ情報最新化
          this.initialPageInfo()
          // プロジェクトタブ情報更新
          this.$emit('updateTabInfo')
        }
        // 削除失敗
        if (res.data.result === 'error') { alert('削除失敗') }
      } catch (err) { alert('削除失敗') }
    }
  }
}
</script>
