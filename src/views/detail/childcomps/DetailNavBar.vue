<template>
  <div class="detail-nav-bar">
    <nav-bar>
      <template #left>
        <div class="back" @click="backClick">
          <img src="~assets/img/common/back.svg" alt />
        </div>
      </template>
      <template #center>
        <div class="title">
          <div
            v-for="(title, index) in titles"
            :key="index"
            class="title-item"
            :class="{active: index === currentIndex}"
            @click="itemClick(index)"
          >{{ title }}</div>
        </div>
      </template>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'

export default {
  name: 'DetailNavBar',
  props: {},
  data() {
    return {
      titles: ['商品', '参数', '评论', '推荐'],
      currentIndex: 0
    }
  },
  components: {
    NavBar
  },
  computed: {},
  methods: {
    itemClick(index) {
      this.currentIndex = index
      this.$emit('itemClick', index)
    },
    backClick() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.title {
  display: flex;
  font-size: 13px;
}

.title-item {
  flex: 1;
}

.active {
  color: var(--color-high-text);
}

.back img {
  width: 40%;
  height: 40%;
  margin-top: 10px;
}
</style>
