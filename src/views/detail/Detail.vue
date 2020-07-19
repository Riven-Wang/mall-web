<template>
  <div id="detail">
    <detail-nav-bar @itemClick="titleClick" :scrollIndex="scrollIndex" />
    <scroll class="content" ref="scroll" @scroll="scroll" :probeType="3">
      <detail-swiper :topImages="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detailInfo="detailInfo" @imgLoad="imgLoad" />
      <detail-param-info ref="param" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :commentInfo="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <detail-bottom-bar @addToCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import DetailNavBar from './childcomps/DetailNavBar'
import DetailSwiper from './childcomps/DetailSwiper'
import DetailBaseInfo from './childcomps/DetailBaseInfo'
import DetailShopInfo from './childcomps/DetailShopInfo'
import DetailGoodsInfo from './childcomps/DetailGoodsInfo'
import DetailParamInfo from './childcomps/DetailParamInfo'
import DetailCommentInfo from './childcomps/DetailCommentInfo'
import DetailBottomBar from './childcomps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goodslist/GoodsList'

import { itemListenerMixin, BackTopMixin } from 'common/mixin'
import { debounce } from 'common/utils'

import { mapActions } from 'vuex'

import {
  getDetails,
  getRecommends,
  Goods,
  Shop,
  GoodsParam
} from 'network/detail'

export default {
  name: 'Detail',
  props: {},
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopYs: null,
      scrollIndex: 0
    }
  },
  created() {
    this._getDetailData()
    this._getDetailRecommends()
    this.getThemeTopYs = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.param.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
    })
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList
  },
  mixins: [itemListenerMixin, BackTopMixin],
  mounted() {},
  destroyed() {
    this.$bus.$off('imageLoad', this.imgListener)
  },
  computed: {},
  methods: {
    _getDetailData() {
      this.iid = this.$route.params.id
      getDetails(this.iid).then(res => {
        console.log(res)
        const data = res.result
        this.topImages = data.itemInfo.topImages
        this.goods = new Goods(
          data.itemInfo,
          data.columns,
          data.shopInfo.services
        )
        this.shop = new Shop(data.shopInfo)
        this.detailInfo = data.detailInfo
        this.paramInfo = new GoodsParam(
          data.itemParams.info,
          data.itemParams.rule
        )
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
      })
    },
    _getDetailRecommends() {
      getRecommends().then(res => {
        this.recommends = res.data.list
      })
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500)
    },
    imgLoad() {
      this.imgListener()
      this.getThemeTopYs()
    },
    scroll(position) {
      this.showBackTop(position)
      const y = -position.y
      if (y >= this.themeTopYs[3]) {
        this.scrollIndex = 3
      } else if (y >= this.themeTopYs[2]) {
        this.scrollIndex = 2
      } else if (y >= this.themeTopYs[1]) {
        this.scrollIndex = 1
      } else {
        this.scrollIndex = 0
      }
    },
    ...mapActions(['addCart']),
    addToCart() {
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid
      product.isChecked = true

      this.addCart(product).then(res => {
        console.log(res)
        this.$toast.show(res)
      })
    }
  }
}
</script>

<style scoped>
#detail {
  height: 100vh;
  position: relative;
  z-index: 9;
  background-color: #fff;
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
