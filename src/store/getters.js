export default {
  cartLength(state) {
    return state.cartList.length
  },
  cartList(state) {
    return state.cartList
  },
  cartCount(state) {
    return state.cartList
      .filter(item => item.isChecked)
      .reduce((preValue, item) => {
        return preValue + item.count
      }, 0)
  }
}
