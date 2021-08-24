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
              class="overflow-y-auto red"
            >
              <v-subheader>現在、サイト設定にて設定可能な値は存在しません。</v-subheader>
            </v-container>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-toolbar>
  </v-card>
</template>

<script>
export default {
  layout: 'default-mypage',
  data: () => ({
    tab: '1'
  }),
  computed: {
  },
  methods: {
  }
}
</script>
