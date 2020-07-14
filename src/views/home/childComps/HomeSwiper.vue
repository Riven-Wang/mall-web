<template>
  <div class="block">
    <el-carousel trigger="click" height="150px">
      <el-carousel-item v-for="(item, index) in items" :key="index">
        <a :href="item.link">
          <img :src="item.image" alt />
        </a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: 'Swiper',
  props: {
    items: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>
