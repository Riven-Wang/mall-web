<template>
  <div id="cart">
    <nav-bar>
      <template v-slot:center> 购物车({{ length }}) </template>
    </nav-bar>
    <cartList />
    <cart-bottom-bar />
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'

import CartList from './childcomps/CartList'
import CartBottomBar from './childcomps/CartBottomBar'

import { mapGetters } from 'vuex'

export default {
  name: 'Cart',
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    // ...mapGetters(['cartLength'])
    ...mapGetters({
      length: 'cartLength'
    })
  }
}
</script>

<style scoped>
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
}
</style>
