<template>
  <article>
    <h1>{{ news.title }}</h1>
    <dl>
      <dt>date</dt>
      <dd>{{ news.date }}</dd>
    </dl>
    <!-- <div><img :src="news.image" /></div> -->
    <!-- <div v-for="tag in news.tags" :key="tag">{{tag}}</div> -->

    <nuxt-content :document="news" />
  </article>
</template>

<script>
export default {
  async asyncData ({ $content, params }) {
    const news = await $content('use', 'sample').fetch()
    return { news }
  }
}
</script>
