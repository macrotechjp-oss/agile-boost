<template>
  <z-view style="border:none; background-color: rgba(0,0,0,0)!important;">
    <!-- メインサークル -->
    <img src="/space/earch.png" width="100%" height="100%" style="background-size:cover;" alt="">
    <!-- 周辺のサークル -->
    <div slot="extension">
      <z-spot class="planet" :image-path="'/space/jupiter.png'" size="s" :distance="150" :angle="140" />
      <z-spot class="planet" :image-path="'/space/mars.png'" size="xs" :distance="185" :angle="160" />
      <z-spot class="planet" :image-path="'/space/mercury-0.jpg'" size="xxs" :distance="132" :angle="-82" />
      <z-spot class="planet" :image-path="'/space/mercury-1.png'" size="s" :distance="130" :angle="75" />
      <z-spot class="planet" :image-path="'/space/planet-0.png'" size="xxs" :distance="148" :angle="43" />
      <z-spot class="planet" :image-path="'/space/planet-1.png'" size="xxs" :distance="122" :angle="113" />
      <z-spot class="planet" :image-path="'/space/planet-2.png'" size="xxs" :distance="132" :angle="210" />
      <z-spot class="planet" :image-path="'/space/pluto.png'" size="xs" :distance="160" :angle="-47" />
      <z-spot class="planet" :image-path="'/space/sun.png'" size="s" :distance="160" :angle="-130" />
      <z-spot class="planet" :image-path="'/space/uranus.png'" size="xs" :distance="190" :angle="-160" />
      <z-spot class="planet" :image-path="'/space/venus.png'" size="xs" :distance="148" :angle="0" />
      <z-spot
        class="planet"
        :image-path="'/setting.png'"
        size="s"
        :distance="160"
        :angle="-180"
        label="設定"
        to-view="PagesTabMenuHomeProjectSettings"
      />
      <z-spot
        class="planet"
        :image-path="'/members.jpg'"
        :distance="170"
        :angle="-30"
        label="メンバー"
        to-view="PagesTabMenuHomeMembers"
      />
      <z-spot
        class="planet"
        :image-path="'/external.png'"
        :distance="160"
        :angle="20"
        label="外部アプリ"
        to-view="PagesTabMenuHomeExternalApp"
      />
    </div>
  </z-view>
</template>

<script>
import PagesTabMenuHomeExternalApp from './externalApp.vue'
import PagesTabMenuHomeMembers from './members.vue'
import PagesTabMenuHomeProjectSettings from './projectSettings.vue'
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    PagesTabMenuHomeExternalApp,
    // eslint-disable-next-line vue/no-unused-components
    PagesTabMenuHomeMembers,
    // eslint-disable-next-line vue/no-unused-components
    PagesTabMenuHomeProjectSettings
  },
  data () {
    return {
      time: false,
      collection: [],
      angle: 0,
      dessvs: [],
      devs1: [],
      angle1: 0,
      ani: {},
      hideThis: '',
      colors: [{
        main: '#5484f8',
        sec: 'hsl(222, 92%, 25%)'
      }
      ]
    }
  },
  computed: {
  },
  mounted () {
  }
}
</script>
<style scoped>
.planet{
  color: white;
  border: none;
  background-color: rgba(0,0,0,0)!important;
}
</style>
