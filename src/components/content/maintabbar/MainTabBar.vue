<template>
  <tab-bar>
    <tab-bar-item v-for="item in items" :key="item.path" :path="item.path">
      <img slot="item-icon" :src="getImgURL(item.path)" alt />
      <img slot="item-icon-active" :src="getImgURL(item.path + '_active')" alt />
      <div slot="item-text">{{ item.text }}</div>
    </tab-bar-item>
  </tab-bar>
</template>

<script>
import TabBar from 'components/common/tabbar/TabBar'
import TabBarItem from 'components/common/tabbar/TabBarItem'
export default {
  name: 'MainTabBar',
  data() {
    return {
      items: [
        {
          path: '/home',
          text: '首页'
        },
        {
          path: '/category',
          text: '分类'
        },
        {
          path: '/cart',
          text: '购物车'
        },
        {
          path: '/profile',
          text: '我的'
        }
      ]
    }
  },
  methods: {
    getImgURL(path) {
      return require('@/assets/img/tabbar' + path + '.svg')
    }
  },
  components: {
    TabBar,
    TabBarItem
  }
}
</script>
