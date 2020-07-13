<template>
  <div id="home">
    <nav-bar class="home-nav">
      <template v-slot:center>购物街</template>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import { getHomeMultiData } from 'network/home'

export default {
  name: 'Home',
  components: {
    NavBar
  },
  data() {
    return {
      banner: [],
      dKeyword: [],
      keywords: [],
      recommend: []
    }
  },
  created() {
    getHomeMultiData().then(res => {
      this.banner = res.data.banner.list
      this.recommend = res.data.recommend.list
    })
  }
}
</script>

<style scoped>
.home-nav {
  background-color: var(--color-tint);
  color: #ffffff;
}
</style>
