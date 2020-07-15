<template>
  <div id="home">
    <nav-bar class="home-nav">
      <template v-slot:center>购物街</template>
    </nav-bar>
    <scroll
      class="content"
      ref="scroll"
      :probeType="3"
      @scroll="contentScroll"
      @pullingUp="loadMore"
      :pullUpLoad="true"
    >
      <home-swiper :banners="banners" />
      <recommend-view :recommend="recommend" />
      <feature-view />
      <tab-control class="tab-control" :titles="['流行', '新款', '精选']" @change="change" />
      <goods-list :goods="showGoods" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import HomeSwiper from './childcomps/HomeSwiper'
import RecommendView from './childcomps/RecommendView'
import FeatureView from './childcomps/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabcontrol/TabControl'
import GoodsList from 'components/content/goodslist/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backtop/BackTop'

import { getHomeMultiData, getHomeGoods } from 'network/home'
import { debounce } from 'common/utils'

export default {
  name: 'Home',
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data() {
    return {
      banners: [],
      recommend: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: 'pop',
      isShowBackTop: false
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  created() {
    this.getHomeMultiData()
    this.getHomeGoods('pop', 0)
    this.getHomeGoods('new', 0)
    this.getHomeGoods('sell', 0)
    this.goodList = this.goods['pop'].list
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll, 200)
    this.$bus.$on('imageLoaded', () => {
      refresh()
      console.log('-----')
    })
  },
  methods: {
    getHomeMultiData() {
      getHomeMultiData().then(res => {
        this.banners = res.data.banner.list
        this.recommend = res.data.recommend.list
      })
    },
    getHomeGoods(type) {
      const page = ++this.goods[type].page
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.$refs.scroll.finishPullUp()
      })
    },
    change(index) {
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    contentScroll(position) {
      this.isShowBackTop = -position.y > 1000
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    }
  }
}
</script>

<style scoped>
#home {
  padding-top: 44px;
  height: 100vh;
}

.home-nav {
  background-color: var(--color-tint);
  color: #ffffff;

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}

.tab-control {
  position: sticky;
  top: 40px;
  z-index: 9;
}

.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
</style>
