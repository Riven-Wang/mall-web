import { debounce } from './utils'

import BackTop from 'components/content/backtop/BackTop'

export const itemListenerMixin = {
  data() {
    return {
      imgListener: null
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 100)
    this.imgListener = () => {
      refresh()
    }
    this.$bus.$on('imageLoad', this.imgListener)
  }
}

export const BackTopMixin = {
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    showBackTop(position) {
      this.isShowBackTop = -position.y > 1000
    }
  },
  components: {
    BackTop
  }
}
