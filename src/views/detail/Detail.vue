<template>
  <div id="detail">
    <detail-nav-bar @itemClick="titleClick" />
    <scroll class="content" ref="scroll">
      <detail-swiper :topImages="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detailInfo="detailInfo" @imgLoad="imgLoad" />
      <detail-param-info ref="param" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :commentInfo="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
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

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goodslist/GoodsList'

import { itemListenerMixin } from 'common/mixin'
import { debounce } from 'common/utils'

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
      getThemeTopYs: null
    }
  },
  created() {
    this._getDetailData()
    this._getDetailRecommends()
    this.getThemeTopYs = debounce(() => {
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.param.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      console.log('+++++')
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
    Scroll,
    GoodsList
  },
  // mixins: [itemListenerMixin],
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 100)
    this.imgListener = () => {
      refresh()
      this.getThemeTopYs()
    }
    this.$bus.$on('imageLoad', this.imgListener)
  },
  updated() {
    this.imgListener()
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
        this.$nextTick(() => {})
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
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
