<template>
  <div id="detail">
    <detail-nav-bar />
    <scroll class="content">
      <detail-swiper :topImages="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detailInfo="detailInfo" />
      <detail-param-info ref="param" :param-info="paramInfo" />
      <detail-comment-info :commentInfo="commentInfo" />
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

import { getDetails, Goods, Shop, GoodsParam } from 'network/detail'

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
      commentInfo: {}
    }
  },
  created() {
    this._getDetailData()
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    Scroll
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
