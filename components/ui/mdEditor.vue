<!-- mavon-editorプラグインを利用したマークダウンエディター -->
<template>
  <div>
    <!-- プレビュー表示 -->
    <mavon-editor
      v-if="displayMode=='viewMode'"
      :value="memoDetail"
      :language="'ja'"
      :subfield="false"
      :default-open="'preview'"
      :editable="false"
      :toolbars-flag="false"
    />
    <!-- 編集表示 -->
    <mavon-editor
      v-if="displayMode=='editMode'"
      ref="md"
      :value="memoDetail"
      :language="'ja'"
      @imgAdd="$imgAdd"
      @change="$change"
    />
    <!-- 成功/失敗 メッセージ表示 -->
    <v-alert
      v-if="isImageUploadError"
      prominent
      dense
      dismissible
      type="error"
      style="position:absolute;bottom:0;left: 50%;transform: translateX(-50%);"
    >
      <v-row align="center">
        <v-col class="grow">
          ファイルアップロードに失敗しました。<br>再度、お試しください。
        </v-col>
      </v-row>
    </v-alert>
  </div>
</template>
<script>
export default {
  // 親コンポーネントからの引継ぎ値
  props: {
    displayMode: { // 表示モード（プレビュー/編集）
      type: String,
      required: true
    },
    memoDetail: { // 内容
      type: String,
      required: true
    }
  },
  data () {
    return {
      // コンポーネント内状態変数
      isImageUploadError: false
    }
  },
  methods: {
    /** 画像ファイルの追加イベント */
    async $imgAdd (pos, $file) {
      // ファイルアップロード+画像パス取得
      try {
        const params = new FormData()
        params.append('file', $file)
        const res = await this.$axios.post('/api/v1/upload', params)
        // 画像パス更新
        this.$refs.md.$img2Url(pos, res.data.imagePath)
      } catch (err) { this.isImageUploadError = true }
    },
    /** エディター入力値で親コンポーネント値を更新 */
    $change (val, render) {
      this.$emit('change', val)
    }
  }
}
</script>
