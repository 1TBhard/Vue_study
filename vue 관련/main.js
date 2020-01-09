var app = new Vue({
  el: '#app',
  data: {
    greeting: 'Welcome to your Vue.js app!',
    img: "https://vuejs.org/images/logo.png",
    my_link: "https://www.naver.com",
    inventory: 11,
    cart: 0
  },
  methods: {
    addToCart: function() {
      this.cart += 1
      this.inventory -= 1
    }
  }
})