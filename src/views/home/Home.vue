<template>
  <div id="home">
    <nav-bar class="home-nav">
      <template v-slot:center>购物街</template>
    </nav-bar>
    <tab-control
      class="tab-control"
      :titles="['流行', '新款', '精选']"
      @change="change"
      v-show="isShowTabCtrl"
      ref="tabControl1"
    />
    <scroll
      class="content"
      ref="scroll"
      :probeType="3"
      @scroll="contentScroll"
      @pullingUp="loadMore"
      :pullUpLoad="true"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommend="recommend" />
      <feature-view />
      <tab-control
        :titles="['流行', '新款', '精选']"
        @change="change"
        ref="tabControl2"
      />
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

import { getHomeMultiData, getHomeGoods } from 'network/home'
import { debounce } from 'common/utils'
import { itemListenerMixin, BackTopMixin } from 'common/mixin.js'

export default {
  name: 'Home',
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll
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
      pages: [],
      currentType: 'pop',
      isShowTabCtrl: false,
      tabOffsetTop: 0,
      saveY: 0,
      once: false
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
  mixins: [itemListenerMixin, BackTopMixin],
  mounted() {},
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY)
    this.$refs.scroll.refresh()
    this.$bus.$on('imageLoad', this.imgListener)
  },
  deactivated() {
    this.saveY = this.$refs.scroll.getY()
    this.$bus.$off('imageLoad', this.imgListener)
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
      const y = this.$refs.scroll.getY()
      if (-y >= this.tabOffsetTop) {
        const preIndex = this.$refs.tabControl1.currentIndex
        this.pages[preIndex] = y
        this.$refs.scroll.scrollTo(0, this.pages[index])
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    contentScroll(position) {
      this.showBackTop(position)
      this.isShowTabCtrl = -position.y > this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad() {
      if (!this.once) {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
        for (let item in this.goods) {
          this.pages.push(-this.tabOffsetTop)
        }
        this.once = true
      }
    }
  }
}
</script>

<style scoped>
#home {
  height: 100vh;
}

.home-nav {
  background-color: var(--color-tint);
  color: #ffffff;
}

.tab-control {
  position: relative;
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
