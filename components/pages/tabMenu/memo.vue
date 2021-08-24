<template>
  <v-container
    id="scroll-target"
    fluid
    style="height: calc(100vh - 112px);
        background-image:url(https://thumb.photo-ac.com/ca/ca2e9a6bf34c22ba33811cd00398b7ab_w.jpeg);
        background-size:cover;overflow-y: scroll;"
  >
    <v-tabs v-model="selectedTab" vertical slider-color="blue" color="blue">
      <!-- メモ帳一覧<サイドメニュー> -->
      <v-btn elevation="2" class="ma-2" @click="addNewMemo()">
        新規作成
      </v-btn>
      <v-divider />
      <template v-for="memoInfo in memoInfoList">
        <v-tab :key="memoInfo.memoId" style="justify-content: start;">
          <v-icon left>
            mdi-{{ memoInfo.memoIcon }}
          </v-icon>
          {{ memoInfo.memoTitle }}
        </v-tab>
      </template>
      <!-- メモ帳詳細 -->
      <template v-for="memoInfo in memoInfoList">
        <v-tab-item :key="memoInfo.memoId" style="height: calc(100vh - 112px);" class="overflow-y-auto">
          <v-container fluid>
            <v-toolbar dense>
              <v-btn-toggle v-model="memoInfo.displayMode" color="primary" dense group>
                <v-btn text value="viewMode">
                  <v-icon>mdi-file-document</v-icon>&nbsp;
                  <span>閲覧モード</span>
                </v-btn>
                <v-btn text value="editMode">
                  <v-icon>mdi-file-document-edit</v-icon>&nbsp;
                  <span>編集モード</span>
                </v-btn>
              </v-btn-toggle>
              <v-divider vertical class="mx-2" />
              <!-- TODO：バージョンリスト処理は後回し -->
              <!-- <v-dialog v-model="dialog" width="80vw">
                <template #activator="{ on, attrs }">
                  <v-btn text color="primary" v-bind="attrs" v-on="on">
                    バージョンリスト
                  </v-btn>
                </template>
                <v-card>
                  <v-toolbar color="primary" dark flat>
                    <v-icon>mdi-silverware</v-icon>
                    <v-toolbar-title>Local hotspots</v-toolbar-title>
                  </v-toolbar>
                  <v-row>
                    <v-col>
                      <v-card-text>
                        <v-treeview
                          v-model="tree"
                          :load-children="fetch"
                          :items="items"
                          selected-color="indigo"
                          open-on-click
                          selectable
                          return-object
                          expand-icon="mdi-chevron-down"
                          on-icon="mdi-bookmark"
                          off-icon="mdi-bookmark-outline"
                          indeterminate-icon="mdi-bookmark-minus"
                        />
                      </v-card-text>
                    </v-col>
                    <v-divider vertical />
                    <v-col cols="12" md="8">
                      <div v-html="prettyHtml" />
                    </v-col>
                  </v-row>
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn class="white--text" color="green darken-1" depressed>
                      このバージョンに戻す
                      <v-icon right>
                        mdi-backup-restore
                      </v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-divider vertical class="mx-2" /> -->
              <template v-if="memoInfo.displayMode=='editMode'">
                <v-checkbox
                  label="自動保存"
                  color="blue"
                  value="自動保存"
                  hide-details
                />
                <v-divider vertical class="mx-2" />
                <v-btn text color="error" @click="deleteMemo(memoInfo)">
                  <v-icon> mdi-trash-can-outline </v-icon>
                </v-btn>
                <v-divider vertical class="mx-2" />
                <v-spacer />
                <v-progress-circular
                  indeterminate
                  color="primary"
                />
                <v-btn
                  class="ma-2"
                  text
                  icon
                  color="success"
                >
                  <v-icon>mdi-check-bold</v-icon>
                </v-btn>
                <v-btn v-if="memoInfo.displayMode=='editMode'" elevation="2" @click="saveMemo(memoInfo)">
                  保存
                </v-btn>
              </template>
            </v-toolbar>
            <v-divider class="my-2" />
            <template v-if="memoInfo.displayMode=='viewMode'">
              <UiMdEditor :display-mode="'viewMode'" :memo-detail="memoInfo.memoDetail" />
            </template>
            <template v-if="memoInfo.displayMode=='editMode'">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="memoInfo.memoTitle"
                    outlined
                    dense
                    label="タイトル"
                    hide-details="false"
                  >
                    <template #prepend class="ma-0" style="margin:0!important;">
                      <v-dialog max-width="600px">
                        <template #activator="{ on }">
                          <v-btn
                            text
                            style="margin-top:-8px;"
                            v-on="on"
                          >
                            <v-icon>
                              mdi-{{ memoInfo.memoIcon }}
                            </v-icon>
                          </v-btn>
                        </template>
                        <v-card>
                          <v-toolbar color="primary" dark>
                            アイコン選択
                            <v-spacer />
                          </v-toolbar>
                          <v-card-text>
                            <v-btn-toggle
                              v-model="memoInfo.memoIcon"
                              tile
                              color="deep-purple accent-3"
                              group
                            >
                              <v-col cols="12">
                                <v-btn v-for="icon in iconList" :key="icon" :value="icon" text @click="memoInfo.memoIcon = icon">
                                  <v-icon>
                                    mdi-{{ icon }}
                                  </v-icon>
                                </v-btn>
                              </v-col>
                            </v-btn-toggle>
                            <small>*追加要望は管理者へご連絡ください。</small>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-divider class="my-2" />
              <div>
                <UiMdEditor :display-mode="'editMode'" :memo-detail="memoInfo.memoDetail" @change="memoInfo.memoDetail = $event" />
              </div>
            </template>
          </v-container>
        </v-tab-item>
      </template>
    </v-tabs>
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
    // メモ帳情報
    memoInfoList: [
      {
        memoId: 0,
        memoTitle: 'dummy',
        memoDetail: 'dummy',
        memoIcon: 'dummy',
        displayMode: 'viewMode'
      }
    ],
    // ページ内状態変数
    selectedTab: null,
    // ページ内定数
    iconList: [
      'account', 'account-box', 'alarm-light', 'alarm-check', 'alert',
      'alert-octagon', 'align-horizontal-right', 'api', 'apple-icloud',
      'application', 'book-open', 'blur', 'bookmark-plus', 'briefcase-check'
    ],

    // isLoading: false,
    tree: [],
    types: [],
    diffs:
        '--- a/server/vendor/golang.org/x/sys/unix/zsyscall_linux_mipsle.go\n+++ b/server/vendor/golang.org/x/sys/unix/zsyscall_linux_mipsle.go\n@@ -1035,6 +1035,17 @@ func Prctl(option int, arg2 uintptr, arg3 uintptr, arg4 uintptr, arg5 uintptr) (\n \n // THIS FILE IS GENERATED BY THE COMMAND AT THE TOP; DO NOT EDIT\n \n+func Pselect(nfd int, r *FdSet, w *FdSet, e *FdSet, timeout *Timespec, sigmask *Sigset_t) (n int, err error) {\n+\tr0, _, e1 := Syscall6(SYS_PSELECT6, uintptr(nfd), uintptr(unsafe.Pointer(r)), uintptr(unsafe.Pointer(w)), uintptr(unsafe.Pointer(e)), uintptr(unsafe.Pointer(timeout)), uintptr(unsafe.Pointer(sigmask)))\n+\tn = int(r0)\n+\tif e1 != 0 {\n+\t\terr = errnoErr(e1)\n+\t}\n+\treturn\n+}\n+\n+// THIS FILE IS GENERATED BY THE COMMAND AT THE TOP; DO NOT EDIT\n+\n func read(fd int, p []byte) (n int, err error) {\n \tvar _p0 unsafe.Pointer\n \tif len(p) > 0 {\n'
  }),

  async created () {
    // プロジェクトメモ情報取得
    let res
    try {
      const projectId = this.projectId
      res = await this.$axios.get('/api/v1/users/projects/' + projectId + '/memos')
    } catch (err) { alert('プロジェクトメモ情報取得失敗') }
    // 取得成功
    if (res.data.result === 'success') {
      const memoInfoList = []
      res.data.projectMemos.reverse().forEach(function (projectMemo, index) {
        const memoInfo = {
          memoId: projectMemo.Memo.id,
          memoTitle: projectMemo.Memo.memoTitle,
          memoDetail: projectMemo.Memo.memoDetail,
          memoIcon: projectMemo.Memo.memoIcon,
          displayMode: 'viewMode'
        }
        memoInfoList.push(memoInfo)
      })
      this.memoInfoList = memoInfoList
    }
    // 取得失敗
    if (res.data.result === 'error') { alert('プロジェクトメモ情報取得失敗') }
  },
  methods: {
    /** 新規メモ作成 */
    async addNewMemo () {
      let res
      try {
        const projectId = this.projectId
        res = await this.$axios.post('/api/v1/users/projects/' + projectId + '/memos')
      } catch (err) { alert('プロジェクトメモ情報取得失敗') }
      // 取得成功
      if (res.data.result === 'success') {
        const memoInfo = {
          memoId: res.data.memo.id,
          memoTitle: res.data.memo.memoTitle,
          memoDetail: res.data.memo.memoDetail,
          memoIcon: res.data.memo.memoIcon,
          displayMode: 'viewMode'
        }
        this.memoInfoList.unshift(memoInfo)
      }
      // 取得失敗
      if (res.data.result === 'error') { alert('プロジェクトメモ情報取得失敗') }
    },
    /** メモ保存 */
    async saveMemo (memoInfo) {
      // プロジェクトメモ更新
      let res
      try {
        const projectId = this.projectId
        const memoId = memoInfo.memoId
        res = await this.$axios.patch('/api/v1/users/projects/' + projectId + '/memos/' + memoId, {
          memoTitle: memoInfo.memoTitle,
          memoDetail: memoInfo.memoDetail,
          memoIcon: memoInfo.memoIcon
        })
      } catch (err) { alert('更新失敗') }
      // 取得成功
      if (res.data.result === 'success') { alert('更新成功') }
      // 更新失敗
      if (res.data.result === 'error') { alert('更新失敗') }
    },
    /** メモ削除 */
    async deleteMemo (memoInfo) {
      let res
      try {
        const projectId = this.projectId
        const memoId = memoInfo.memoId
        res = await this.$axios.delete('/api/v1/users/projects/' + projectId + '/memos/' + memoId)
      } catch (err) { alert('更新失敗') }
      // 取得成功
      if (res.data.result === 'success') {
        this.memoInfoList.splice(this.memoInfoList.indexOf(memoInfo), 1)
      }
      // 取得失敗
      if (res.data.result === 'error') { alert('プロジェクトメモ情報取得失敗') }
    }
  }
}
</script>

<style>
html {
  overflow: hidden !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
