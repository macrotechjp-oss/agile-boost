<template>
  <v-container
    id="scroll-target"
    fluid
    style="height: calc(100vh - 112px);
        background-image:url(https://thumb.photo-ac.com/ca/ca2e9a6bf34c22ba33811cd00398b7ab_w.jpeg);
        background-size:cover;"
    class="overflow-y-auto red"
  >
    <v-row class="mt-2 mr-2" justify="space-between">
      <v-subheader>Now</v-subheader>
      <v-btn color="primary" @click="isNewInfoOpen=true">
        お知らせ作成
      </v-btn>
    </v-row>
    <v-timeline dense clipped>
      <!-- 【START】NEWお知らせ -->
      <template v-if="isNewInfoOpen">
        <v-timeline-item class="my-2" color="grey" icon-color="grey lighten-2" small>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="mr-2">
                <v-text-field
                  v-model="newInfo.title"
                  outlined
                  hide-details
                  dense
                />
              </v-list-item-title>
            </v-list-item-content>
            <!-- TODO：詳細設定の実装 -->
            <!-- <v-list-item-action>
              <v-dialog transition="dialog-bottom-transition" max-width="600">
                <template #activator="{ on, attrs }">
                  <v-btn
                    rounded
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                    詳細設定
                  </v-btn>
                </template>
                <v-card>
                  <v-toolbar
                    color="primary"
                    dark
                  >
                    詳細設定
                  </v-toolbar>
                  <v-card-text>
                    <v-subheader>作成者</v-subheader>
                    <v-col cols="12" class="pt-0">
                      <v-tooltip bottom>
                        <template #activator="{ on, attrs }">
                          <span
                            v-bind="attrs"
                            v-on="on"
                          >

                            <v-avatar size="40" class="mx-2 mb-4">
                              <v-img src="http://placeimg.com/350/250/people" />
                            </v-avatar>
                          </span>
                        </template>
                        <span>私</span>
                      </v-tooltip>
                    </v-col>
                    <v-divider />
                    <v-subheader>対象者</v-subheader>
                    <v-col cols="12" class="pt-0">
                      <v-tooltip
                        bottom
                      >
                        <template #activator="{ on, attrs }">
                          <span
                            v-bind="attrs"
                            style="cursor:pointer;"
                            v-on="on"
                            @click="tes = !tes"
                          >
                            <v-badge
                              avatar
                              bordered
                              overlap
                              class="mx-2 mb-4"
                            >
                              <template #badge>
                                <v-avatar v-if="tes" color="success">
                                  <v-icon>mdi-access-point</v-icon>
                                </v-avatar>
                                <v-avatar v-else color="error">
                                  <v-icon>mdi-access-point-off</v-icon>
                                </v-avatar>
                              </template>
                              <v-avatar size="40">
                                <v-img src="http://placeimg.com/350/250/people" />
                              </v-avatar>
                            </v-badge>
                          </span>
                        </template>
                        <span>誰か</span>
                      </v-tooltip>
                    </v-col>
                    <v-divider />
                    <v-col>
                      <v-avatar color="success" size="20">
                        <v-icon color="white" size="10">
                          mdi-access-point
                        </v-icon>
                      </v-avatar>&nbsp;...&nbsp;対象、
                      <v-avatar color="red" size="20">
                        <v-icon color="white" size="10">
                          mdi-access-point-off
                        </v-icon>
                      </v-avatar>&nbsp;...&nbsp;対象外
                    </v-col>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-list-item-action> -->
            <v-list-item-action>
              <v-btn rounded color="primary" dark @click="addInfo()">
                投稿
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider />
          <v-expand-transition>
            <div>
              <v-card class="green">
                <UiMdEditor :display-mode="'editMode'" :memo-detail="newInfo.detail" @change="newInfo.detail = $event" />
              </v-card>
            </div>
          </v-expand-transition>
        </v-timeline-item>
      </template>
      <!-- 【END】NEWお知らせ -->
      <!-- 【START】お知らせ一覧 -->
      <div v-for="(totallInfo, index) in totallInfoList" :key="index">
        <v-timeline-item
          v-for="dayInfo in totallInfo.dayInfoList"
          :key="dayInfo"
          class="my-2"
          color="grey"
          icon-color="grey lighten-2"
          small
        >
          <v-list-item>
            <span v-if="dayInfo.isShowNewLabel"><!--未読は全てNEW表示-->
              <v-chip color="green" label small dark>NEW</v-chip>&nbsp;
            </span>
            <v-list-item-content>
              <v-list-item-title><strong>{{ dayInfo.title }}</strong></v-list-item-title>
            </v-list-item-content>
            <!-- TODO：統計情報表示の実装 -->
            <!-- <v-list-item-action>
              <v-dialog
                transition="dialog-bottom-transition"
                max-width="600"
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    rounded
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                    統計
                  </v-btn>
                </template>
                <v-card>
                  <v-toolbar color="primary" dark>
                    統計
                  </v-toolbar>
                  <v-card-text>
                    <v-subheader>作成者</v-subheader>
                    <v-col cols="12" class="pt-0">
                      <v-tooltip bottom>
                        <template #activator="{ on, attrs }">
                          <span
                            v-bind="attrs"
                            v-on="on"
                          >

                            <v-avatar size="40" class="mx-2 mb-4">
                              <v-img :src="dayInfo.statistics.author.prifilelIcon" />
                            </v-avatar>
                          </span>
                        </template>
                        <span>{{ dayInfo.statistics.author.name }}</span>
                      </v-tooltip>
                    </v-col>
                    <v-divider />
                    <v-subheader>対象者</v-subheader>
                    <v-col cols="12" class="pt-0">
                      <v-tooltip
                        v-for="receiver in dayInfo.statistics.receiver"
                        :key="receiver"
                        bottom
                      >
                        <template #activator="{ on, attrs }">
                          <span
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-badge
                              avatar
                              bordered
                              overlap
                              class="mx-2 mb-4"
                            >
                              <template #badge>
                                <v-avatar v-if="receiver.isRead" color="success">
                                  <v-icon>mdi-check-bold</v-icon>
                                </v-avatar>
                                <v-avatar v-else color="error">
                                  <v-icon>mdi-close-thick</v-icon>
                                </v-avatar>
                              </template>
                              <v-avatar size="40">
                                <v-img :src="receiver.profileIcon" />
                              </v-avatar>
                            </v-badge>
                          </span>
                        </template>
                        <span>{{ receiver.name }}</span>
                      </v-tooltip>
                    </v-col>
                    <v-divider />
                    <v-col>
                      <v-avatar color="success" size="20">
                        <v-icon color="white" size="10">
                          mdi-check-bold
                        </v-icon>
                      </v-avatar>&nbsp;...&nbsp;既読、
                      <v-avatar color="red" size="20">
                        <v-icon color="white" size="10">
                          mdi-close-thick
                        </v-icon>
                      </v-avatar>&nbsp;...&nbsp;未読
                    </v-col>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-list-item-action> -->
            <v-list-item-action>
              <v-btn
                rounded
                color="primary"
                dark
                @click="dayInfo.detailOpen = !dayInfo.detailOpen"
              >
                詳細
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider />
          <v-expand-transition>
            <div v-if="dayInfo.detailOpen">
              <v-card class="green">
                <v-card-subtitle>
                  {{ dayInfo.time }}<v-spacer />
                  <v-btn v-if="dayInfo.isShowDelete" icon color="red" style="position:absolute;top:0;right:0;" @click="deleteInfo(dayInfo)">
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </v-card-subtitle>
                <UiMdEditor :display-mode="'viewMode'" :memo-detail="dayInfo.detail" />
              </v-card>
            </div>
          </v-expand-transition>
        </v-timeline-item>
        <v-subheader>{{ totallInfo.date }}</v-subheader>
      </div>
    </v-timeline>
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
    // お知らせ情報リスト
    totallInfoList: [
      {
        dayInfoList: [
          {
            id: 3,
            time: '2021/07/05 11:00:15',
            title: 'テストテスト2',
            detail: '- 初めまして',
            detailOpen: false,
            isShowDelete: false,
            isShowNewLabel: false,
            statistics: {
              author: {
                name: '次郎',
                prifilelIcon: 'https://picsum.photos/350/250/?random'
              },
              receiver: [
                {
                  name: '山田',
                  profileIcon: 'https://picsum.photos/350/250/?random',
                  isRead: false
                }, {
                  name: '田中',
                  profileIcon: 'https://picsum.photos/350/250/?random',
                  isRead: true
                }
              ]
            }
          }
        ],
        date: '2021/07/05'
      }, {
        dayInfoList: [
          {
            id: 1,
            time: '2021/07/04 10:00:15',
            title: 'サイトオープン',
            detail: '## こんにちは皆さん',
            detailOpen: false,
            statistics: {
              author: {
                name: '次郎',
                prifilelIcon: 'https://picsum.photos/350/250/?random'
              },
              receiver: [
                {
                  name: '山田',
                  profileIcon: 'http://placeimg.com/350/250/people',
                  isRead: false
                }, {
                  name: '田中',
                  profileIcon: 'http://placeimg.com/350/250/people',
                  isRead: false
                }
              ]
            }
          }
        ],
        date: '2021/07/04'
      }
    ],
    // NEWお知らせ情報
    newInfo: {
      title: 'お知らせタイトル',
      detail: 'お知らせ内容'
    },
    // ページ内状態変数
    isNewInfoOpen: false
  }),
  created () {
    // ページ内お知らせ情報初期化
    this.initialPageInfo()
  },
  methods: {
    /** ページ内お知らせ情報初期化 */
    async initialPageInfo () {
      // お知らせ情報リスト取得
      let res
      try {
        const projectId = this.projectId
        res = await this.$axios.get('/api/v1/users/projects/' + projectId + '/infos')
      } catch (err) { alert('プロジェクトお知らせ情報取得失敗') }
      // 取得成功 + ページ内のお知らせ情報作成
      if (res.data.result === 'success') {
        const totallInfoList = []
        const totallInfo = {
          date: '',
          dayInfoList: []
        }
        for (let index = 0; index < res.data.projectInfos.length; index++) {
          const info = res.data.projectInfos[index].Info
          const infoPostTime = this.changeDateFormat(info.infoPostTime, 'yyyy/mm/dd')
          // お知らせDAY情報
          totallInfo.date = infoPostTime
          totallInfo.dayInfoList.push({
            id: info.id,
            time: this.changeDateFormat(info.infoPostTime, 'yyyy/mm/dd HH/MM/SS'),
            title: info.infoTitle,
            detail: info.infoDetail,
            detailOpen: false,
            isShowDelete: (this.$store.state.auth.user.id === info.authorUserId),
            isShowNewLabel: true,
            statistics: {
              author: {
                name: '次郎',
                prifilelIcon: 'https://picsum.photos/350/250/?random'
              },
              receiver: [
                {
                  name: '山田',
                  profileIcon: 'http://placeimg.com/350/250/people',
                  isRead: false
                }, {
                  name: '田中',
                  profileIcon: 'http://placeimg.com/350/250/people',
                  isRead: false
                }
              ]
            }
          })
          // お知らせ情報リストへの追加及びお知らせDAY情報の初期化
          if (index === res.data.projectInfos.length - 1) {
            // プロジェクトお知らせリスト最終 の場合
            const totallInfoForAdd = Object.assign({}, totallInfo)
            totallInfoList.push(totallInfoForAdd)
            totallInfo.dayInfoList = []
          } else {
            const nextInfo = res.data.projectInfos[index + 1].Info
            const nextInfoPostTime = this.changeDateFormat(nextInfo.infoPostTime, 'yyyy/mm/dd')
            if (infoPostTime !== nextInfoPostTime) {
            // プロジェクトお知らせリスト最初 かつ 次お知らせリストのお知らせ投稿日時と相違 の場合
              const totallInfoForAdd = Object.assign({}, totallInfo)
              totallInfoList.push(totallInfoForAdd)
              totallInfo.dayInfoList = []
            }
          }
        }
        this.totallInfoList = totallInfoList
      }
      // 取得失敗
      if (res.data.result === 'error') { alert('プロジェクトお知らせ情報取得失敗') }
    },
    /** お知らせ新規作成 */
    async addInfo () {
      // お知らせ追加
      try {
        const projectId = this.projectId
        const res = await this.$axios.post('/api/v1/users/projects/' + projectId + '/infos', {
          infoTitle: this.newInfo.title,
          infoDetail: this.newInfo.detail
        })
        if (res.data.result === 'success') { alert('追加成功') }
        if (res.data.result === 'error') { alert('追加失敗') }
      } catch (err) { alert('追加失敗') }
      // NEWお知らせ非表示
      this.isNewInfoOpen = false
      // NEWお知らせ情報初期化
      this.newInfo = {
        title: 'お知らせタイトル',
        detail: 'お知らせ内容'
      }
      // ページ内お知らせ情報最新化
      this.initialPageInfo()
    },
    /** お知らせ情報削除 */
    async deleteInfo (dayInfo) {
      // お知らせ削除
      try {
        const projectId = this.projectId
        const infoId = dayInfo.id
        const res = await this.$axios.delete('/api/v1/users/projects/' + projectId + '/infos/' + infoId)
        if (res.data.result === 'success') { alert('削除成功') }
        if (res.data.result === 'error') { alert('削除失敗') }
      } catch (err) { alert('削除失敗') }
      // ページ内お知らせ情報最新化
      this.initialPageInfo()
    },
    /** 日付フォーマット変更 ※文字列日付を `yyyy/mm/dd` に変更 */
    changeDateFormat (dateStr, format) {
      const date = new Date(dateStr)
      const yyyy = date.getFullYear()
      const mm = ('00' + (date.getMonth() + 1)).slice(-2)
      const dd = ('00' + date.getDate()).slice(-2)
      const HH = ('00' + date.getHours()).slice(-2)
      const MM = ('00' + date.getMinutes()).slice(-2)
      const SS = ('00' + date.getSeconds()).slice(-2)
      if (format === 'yyyy/mm/dd') {
        return yyyy + '/' + mm + '/' + dd
      } else if (format === 'yyyy/mm/dd HH/MM/SS') {
        return yyyy + '/' + mm + '/' + dd + ' ' + HH + ':' + MM + ':' + SS
      } else {
        return ''
      }
    }
  }
}
</script>
