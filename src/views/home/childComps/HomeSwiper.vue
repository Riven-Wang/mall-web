<template>
  <div class="block">
    <el-carousel height="180px">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <a :href="item.link">
          <img :src="item.image" height="100%" width="100%" alt />
        </a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: 'Swiper',
  props: {
    banners: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>
