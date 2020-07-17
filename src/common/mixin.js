import { debounce } from './utils'

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
