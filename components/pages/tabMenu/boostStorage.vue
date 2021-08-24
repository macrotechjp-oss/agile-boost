<template>
  <v-container
    id="scroll-target"
    fluid
    style="height: calc(100vh - 112px);
        background-image:url(https://thumb.photo-ac.com/ca/ca2e9a6bf34c22ba33811cd00398b7ab_w.jpeg);
        background-size:cover;"
    class="overflow-y-auto"
  >
    <v-card>
      <v-card-title>
        <span><v-img src="/store/storage.png" height="50" width="50" contain /></span>&nbsp;
        Boost Storage
        <v-chip v-if="storageId" small class="ml-2" outlined color="success">
          {{ storageInfo.size }}
        </v-chip>
      </v-card-title>
      <v-card-text class="scroll-y">
        <template v-if="initialSkeletonLoader">
          <v-skeleton-loader class="mx-auto" type="table" />
        </template>
        <template v-if="!initialSkeletonLoader">
          <template v-if="!storageId">
            <v-btn color="success" outlined :disabled="initialStorageSetupLoading" :loading="initialStorageSetupLoading" @click="initialStorageSetup()">
              初期セットアップ開始
            </v-btn>
          </template>
          <template v-if="storageId">
            <v-item-group active-class="primary" class="scroll-y">
              <v-breadcrumbs :items="pankuzuList">
                <template #divider>
                  <v-icon>mdi-forward</v-icon>
                </template>
                <template #[`item`]="{ item }">
                  <span v-if="item.disabled">
                    {{ item.text }}
                  </span>
                  <a v-else @click="updateCurrentPath(item.prefix)">
                    {{ item.text }}
                  </a>
                </template>
              </v-breadcrumbs>
              <v-card>
                <v-card-title>
                  <v-btn class="mr-2" outlined color="indigo accent-1" @click="folderCreateDialog=true">
                    フォルダ作成
                  </v-btn>
                  <v-btn class="mr-2" outlined color="blue accent-1" @click="fileUploadDialog=true">
                    アップロード
                  </v-btn>
                  <v-spacer />
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="検索"
                    single-line
                    hide-details
                  />
                </v-card-title>
                <v-data-table
                  :headers="storageInfo.headers"
                  :items="storageInfo.dataSet"
                  :search="search"
                  item-key="name"
                >
                  <template #[`item.name`]="{ item }">
                    <template v-if="item.type=='file'">
                      <v-icon class="mr-2" color="blue">
                        mdi-file
                      </v-icon>
                      <v-tooltip v-if="item.isKeepFile" bottom>
                        <template #activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-information
                          </v-icon>
                        </template>
                        <span>「.keep」はフォルダ作成時、必ず作成されます。</span>
                      </v-tooltip>
                      {{ item.name }}
                    </template>
                    <template v-if="item.type=='folder'">
                      <v-icon class="mr-2" color="success">
                        mdi-folder
                      </v-icon>
                      <a @click="updateCurrentPath(item.prefix)">
                        {{ item.name }}
                      </a>
                    </template>
                  </template>
                  <template #[`item.action`]="{ item }">
                    <v-tooltip top>
                      <template #activator="{ on, attrs }">
                        <v-btn
                          :disabled="!item.isShowPreview"
                          icon
                          fab
                          small
                          v-bind="attrs"
                          v-on="on"
                          @click="previewObject(item)"
                        >
                          <v-icon v-if="item.isShowPreview">
                            mdi-file-cloud
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>プレビュー</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template #activator="{ on, attrs }">
                        <v-btn
                          :loading="item.downloadLoding"
                          :disabled="item.downloadLoding||!item.isShowDownload"
                          icon
                          fab
                          small
                          v-bind="attrs"
                          v-on="on"
                          @click="downloadObject(item)"
                        >
                          <v-icon v-if="item.isShowDownload">
                            mdi-cloud-download
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>ダウンロード</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template #activator="{ on, attrs }">
                        <v-btn
                          :loading="item.deleteLoding"
                          :disabled="item.deleteLoding"
                          icon
                          fab
                          small
                          v-bind="attrs"
                          v-on="on"
                          @click="deleteObject(item)"
                        >
                          <v-icon> mdi-delete </v-icon>
                        </v-btn>
                      </template>
                      <span>削除</span>
                    </v-tooltip>
                  </template>
                </v-data-table>
              </v-card>
            </v-item-group>
          </template>
        </template>
      </v-card-text>
      <!-- 【START】フォルダ作成ダイアログ -->
      <v-dialog v-model="folderCreateDialog" transition="dialog-bottom-transition" max-width="60%">
        <v-card>
          <v-toolbar color="primary" dark>
            フォルダ作成
          </v-toolbar>
          <v-card-text>
            <v-text-field v-model="newFolderName" label="フォルダ名" solo hide-details class="my-4" />
            <v-btn block color="success" @click="creatingFolderObject(newFolderName)">
              作成
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- 【END】フォルダ作成ダイアログ -->
      <!-- 【START】ファイルアップロードダイアログ -->
      <v-dialog v-model="fileUploadDialog" transition="dialog-bottom-transition" max-width="60%">
        <v-card>
          <v-toolbar color="primary" dark>
            アップロード
          </v-toolbar>
          <v-card-text class="pa-2">
            <vue-dropzone id="fileUpload" :options="dropzoneOptions" :url="'https://httpbin.org/post'" :use-custom-slot="true">
              <div class="dropzone-custom-content">
                <h2 class="dropzone-custom-title green--text">
                  Drag and drop or select files!
                </h2>
              </div>
            </vue-dropzone>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- 【END】ファイルアップロードダイアログ -->
    </v-card>
  </v-container>
</template>

<script>
// 【ページ内グローバル】プロジェクトID
let projectId = ''
// 【ページ内グローバル】ストレージID
let storageId = ''
// 【ページ内グローバル】カレントパス
let currentPath = ''
export default {
  // 親コンポーネントからの引継ぎ値
  props: {
    projectId: { // プロジェクトID
      type: String,
      required: true
    }
  },
  data: () => ({
    // グローバル変数 <=> 状態変数
    storageId: '',
    currentPath: '',
    // ドロップゾーン情報
    dropzoneOptions: {
      url: 'dummy',
      thumbnailWidth: 200,
      maxFilesize: 1000, // MB
      addRemoveLinks: true,
      createImageThumbnails: true,
      withCredentials: true,
      params () {
        this.options.url = 'http://localhost:4200/api/v1/users/projects/' + projectId + '/storages/' + storageId + '/objects'
        return { currentPath, uploadType: 'file' }
      },
      success (file, response) {
        const previewImageMap = {
          'application/json': '/filetypes/json.png', // .json
          'application/pdf': '/filetypes/pdf.png', // .pdf
          'application/vnd.ms-excel': '/filetypes/csv.png', // .csv
          'application/vnd.openxmlformats-officedocument.presentationml.presentation': '/filetypes/pptx.png', // .pptx
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '/filetypes/xlsx.png', // .xlsx
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '/filetypes/docx.png', // .docx
          'application/x-msdownload': '/filetypes/exe.png', // .exe
          'application/x-zip-compressed': '/filetypes/zip.png', // .zip
          'text/html': '/filetypes/html.png', // .html
          'text/javascript': '/filetypes/js.png', // .js
          'text/plain': '/filetypes/txt.png', // .txt
          'text/xml': '/filetypes/xml.png', // .xml
          'video/mp4': '/filetypes/mp4.png' // .mp4
        }
        if (previewImageMap[file.type]) { // サムネイル画像設定
          file.previewElement.getElementsByClassName('dz-image')[0].getElementsByTagName('img')[0].setAttribute('src', previewImageMap[file.type])
          file.previewElement.getElementsByClassName('dz-details')[0].style.opacity = 0
        }
      }
    },
    // パンくずリスト情報
    pankuzuList: [{
      text: 'HOME',
      prefix: '',
      disabled: true
    }],
    // ストレージ情報
    storageInfo: {
      size: '0KB',
      headers: [
        {
          text: 'フォルダ名/ファイル名',
          align: 'start',
          sortable: false,
          value: 'name'
        },
        { text: 'アクション', value: 'action' },
        { text: 'サイズ', value: 'size' },
        { text: '最終更新日', value: 'createdAt' }
      ],
      dataSet: [
        {
          name: 'Frozen Yogurt',
          action: '',
          size: 159,
          createdAt: '1%',
          type: 'file',
          prefix: ''
        }
      ]
    },
    // NEWフォルダ情報
    newFolderName: '',
    // ページ内状態変数
    search: '',
    folderCreateDialog: false,
    fileUploadDialog: false,
    isShowSkeletonLoader: true,
    initialStorageSetupLoading: false,
    initialSkeletonLoader: true
  }),
  watch: {
    // fileUploadDialog: 監視対象のプロパティ名
    // newValue: 更新後のプロパティの値
    // oldValue: 更新前のプロパティの値
    fileUploadDialog (newValue, oldValue) {
      if (!newValue) { this.initialPageInfo() }
    }
  },
  async created () {
    projectId = this.projectId // ページ内プロジェクトID設定
    try { // ユーザー > プロジェクト > ストレージ取得
      const res = await this.$axios.get('/api/v1/users/projects/' + projectId + '/storages')
      if (res.data.result === 'success' && res.data.projectStorage) {
        storageId = this.storageId = res.data.projectStorage.Storage.id // ページ内ストレージID設定
        this.storageInfo.size = this.changByteFormat(res.data.bucketInfo.size)
        this.initialPageInfo() // ページ内OBJリスト情報初期化
      }
      if (res.data.result === 'error') { alert('ストレージ情報取得失敗') }
    } catch (err) { alert('ストレージ情報取得失敗') }
    this.initialSkeletonLoader = false // スケルトンローダー非表示
  },
  methods: {
    /** 【OBJアクション】初期セットアップ開始押下 */
    async initialStorageSetup () {
      this.initSetupLoading = true // ローディング開始
      try { // プロジェクト > ストレージ追加
        const res = await this.$axios.post('/api/v1/users/projects/' + projectId + '/storages')
        if (res.data.result === 'success') {
          storageId = this.storageId = res.data.storage.id // ページ内ストレージID設定
          this.storageInfo.dataSet = []
        }
        if (res.data.result === 'error') { alert('ストレージ追加失敗') }
      } catch (err) { alert('ストレージ追加失敗') }
      this.initSetupLoading = false // ローディング終了
    },
    /** 【OBJアクション】パンくず押下/フォルダOBJ押下
     *  @param newCurrentPath NEWカレントパス
    */
    updateCurrentPath (newCurrentPath) {
      currentPath = this.currentPath = newCurrentPath // ページ内カレントパス設定
      this.initialPageInfo() // ページ内OBJリスト情報初期化
      this.pankuzuInfoUpdate(newCurrentPath) // パンくずリスト情報更新
    },
    /** 【OBJアクション】フォルダ作成 */
    async creatingFolderObject (newFolderName) {
      try {
        const params = new FormData()
        params.append('currentPath', currentPath + newFolderName + '/')
        params.append('uploadType', 'folder')
        const res = await this.$axios.post('/api/v1/users/projects/' + projectId + '/storages/' + storageId + '/objects', params)
        if (res.data.result === 'success') {
          this.folderCreateDialog = false // フォルダ作成ダイアログ非表示
          this.initialPageInfo() // ページ内OBJリスト情報初期化
        }
        if (res.data.result === 'error') { alert('ストレージ情報取得失敗') }
      } catch (err) { alert('ストレージ情報取得失敗') }
    },
    /** 【OBJアクション】OBJプレビュー */
    previewObject () { alert('Comming soon...') },
    /** 【OBJアクション】OBJダウンロード */
    async downloadObject (data) {
      data.downloadLoding = true // ローディング開始
      try { // ストレージ > オブジェクトダウンロード
        const objectName = encodeURIComponent(data.name)
        await this.$axios.get('/api/v1/users/projects/' + projectId + '/storages/' + storageId + '/objects/' + objectName, {
          responseType: 'blob'
        }).then((response) => {
          const blob = new Blob([response.data])
          const url = (window.URL || window.webkitURL).createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = data.name
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        })
      } catch (err) { alert('ファイルダウンロード失敗') }
      data.downloadLoding = false // ローディング終了
    },
    /** 【OBJアクション】OBJ削除 */
    async deleteObject (data) {
      data.deleteLoding = true // ローディング開始
      try { // ストレージ > オブジェクト削除
        const projectId = this.projectId
        const storageId = this.storageId
        const objectName = data.name
        const res = await this.$axios.delete('/api/v1/users/projects/' + projectId + '/storages/' + storageId + '/objects/' + encodeURIComponent(objectName))
        if (res.data.result === 'success') {
          this.initialPageInfo() // ページ内OBJリスト情報初期化
        }
        if (res.data.result === 'error') { alert('オブジェクト削除失敗') }
      } catch (err) { alert('オブジェクト削除失敗') }
      data.deleteLoding = false // ローディング終了
    },
    /** 【汎用メソッド】パンくずリスト情報更新
     *  @param newCurrentPath NEWカレントパス
    */
    pankuzuInfoUpdate (newCurrentPath) {
      const pankuzuPathList = newCurrentPath.split('/').filter(v => v)
      const pankuzuList = [{
        text: 'HOME',
        prefix: '',
        disabled: (!newCurrentPath)
      }]
      let prefix = ''
      pankuzuPathList.forEach(function (pankuzu, index) {
        const pankuzuInfo = {
          text: pankuzu,
          prefix: prefix += pankuzu + '/',
          disabled: (pankuzuPathList.length === index + 1)
        }
        pankuzuList.push(pankuzuInfo)
      })
      this.pankuzuList = pankuzuList
    },
    /** 【汎用メソッド】ページ内OBJリスト情報初期化 */
    async initialPageInfo () {
      try { // ストレージ > オブジェクトリスト取得
        const res = await this.$axios.get('/api/v1/users/projects/' + projectId + '/storages/' + storageId + '/objects', {
          params: { currentPath }
        })
        if (res.data.result === 'success') {
          // ページ内ストレージ情報作成
          const dataSet = []
          for (let index = 0; index < res.data.objectList.length; index++) {
            const object = res.data.objectList[index]
            if (object.lastModified) {
              const date = new Date(object.lastModified)
              const yyyy = date.getFullYear()
              const mm = ('00' + (date.getMonth() + 1)).slice(-2)
              const dd = ('00' + date.getDate()).slice(-2)
              const HH = ('00' + date.getHours()).slice(-2)
              const MM = ('00' + date.getMinutes()).slice(-2)
              const SS = ('00' + date.getSeconds()).slice(-2)
              object.lastModified = yyyy + '/' + mm + '/' + dd + ' ' + HH + ':' + MM + ':' + SS
            }
            const previewContentType = ['image/png', 'image/jpg', 'image/jpeg']
            const data = (object.prefix)
              ? { // ディレクトリ
                  name: object.prefix,
                  size: '',
                  createdAt: '',
                  type: 'folder',
                  prefix: object.prefix,
                  isKeepFile: false,
                  isShowPreview: false,
                  isShowDownload: false,
                  downloadLoding: false,
                  deleteLoding: false
                }
              : { // ファイル
                  name: object.name,
                  size: this.changByteFormat(object.size),
                  createdAt: object.lastModified,
                  type: 'file',
                  prefix: '',
                  isKeepFile: (object.name.endsWith('.keep')),
                  isShowPreview: (previewContentType.includes(object.metadata['content-type'])),
                  isShowDownload: (!object.name.endsWith('.keep')),
                  downloadLoding: false,
                  deleteLoding: false
                }
            dataSet.push(data)
          }
          this.storageInfo.dataSet = dataSet
        }
        if (res.data.result === 'error') { alert('オブジェクトリスト取得失敗') }
      } catch (err) { alert('オブジェクトリスト取得失敗') }
    },
    /** 【汎用メソッド】日付フォーマット変更 ※文字列日付を `引数形式` に変更
     *  @param dateStr 文字列日付
     *  @param format 日付フォーマット
     *  @returns フォーマット済みの文字列日付
     */
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
    },
    /** 【汎用メソッド】バイト変換（数値 → 文字列） */
    changByteFormat (byteNum) {
      if (String(byteNum).length >= 9) {
        return Math.round((byteNum / 1000000000) * Math.pow(10, 1)) / Math.pow(10, 1) + 'GB'
      } else if (String(byteNum).length >= 6) {
        return Math.round((byteNum / 1000000) * Math.pow(10, 1)) / Math.pow(10, 1) + 'MB'
      } else if (String(byteNum).length >= 3) {
        return Math.round((byteNum / 1000) * Math.pow(10, 1)) / Math.pow(10, 1) + 'KB'
      } else {
        return byteNum + 'B'
      }
    }
  }
}
</script>
