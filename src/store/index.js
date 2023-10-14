import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { API_BASE_URL } from '../config.js'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    cartProducts: [],

    userAccessKey: null,
    orderInfo: null,
    cartLoading: false,
    cartLoadingFailed: false,
    cartProductsData: [],
    orderInfoLoading: false,
    orderInfoLoadingFailed: false
  },
  mutations: {
    updateOrderInfo (state, orderInfo) {
      state.orderInfo = orderInfo
    },
    resetCart (state) {
      state.cartProducts = [],
      state.cartProductsData = []
    },
    updateCartProductAmount (state, { productId, colorId, sizeId, amount }) {
      const item = state.cartProducts.find(item => item.id === productId)
      if (item) {
        item.id = productId,
        item.amount = amount,
        item.color = colorId,
        item.size = sizeId
      }
    },
    deleteCartProduct (state, productId) {
      state.cartProducts = state.cartProducts.filter(item => item.id !== productId)
    },
    updateUserAccessKey (state, accessKey) {
      state.userAccessKey = accessKey
    },
    updateCartProductsData (state, items) {
      state.cartProductsData = items
    },
    syncCartProducts (state) {
      state.cartProducts = state.cartProductsData.map(item => {
        return {
          id: item.id,
          productId: item.product.id,
          color: item.color,
          size: item.size,
          amount: item.quantity
        }
      })
    }
  },
  getters: {
    cartDetailProducts (state) {
      return state.cartProducts.map(item => {
        const product = state.cartProductsData.find(p => p.id === item.id).product
        return {
          ...item,
          product: {
            ...product
          }
        }
      })
    },
    cartTotalPrice (state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0)
    }
  },
  actions: {
    loadOrderInfo (context, orderId) {
      context.state.orderInfoLoading = true
      context.state.orderInfoLoadingFailed = false
      clearTimeout('loadorderInfoTimer')
      this.loadorderInfoTimer = setTimeout(() => {
        return axios.get(API_BASE_URL + '/api/orders/' + orderId, {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
          .then(response => {
            context.commit('updateOrderInfo', response.data)
          })
          .catch(() => context.state.orderInfoLoadingFailed = true)
          .then(() => context.state.orderInfoLoading = false)
      }, 0)
    },
    loadCart (context) {
      context.state.cartLoading = true
      context.state.cartLoadingFailed = false
      clearTimeout('loadCartTimer')
      this.loadCartTimer = setTimeout(() => {
        axios.get(API_BASE_URL + '/api/baskets', {
          params: {
            userAccessKey: context.state.userAccessKey
          }
        })
          .then((response) => {
            if (!context.state.userAccessKey) {
              localStorage.setItem('userAccessKey', response.data.user.accessKey)
              context.commit('updateUserAccessKey', response.data.user.accessKey)
            }
            context.commit('updateCartProductsData', response.data.items)
            context.commit('syncCartProducts')
          })
          .catch(() => context.state.cartLoadingFailed = true)
          .then(() => context.state.cartLoading = false)
      }, 0)
    },
    addProductToCart (context, { productId, colorId, sizeId, amount }) {
      return axios.post(API_BASE_URL + '/api/baskets/products', {
        productId: productId,
        colorId: colorId,
        sizeId: sizeId,
        quantity: amount

      }, {
        params: {
          userAccessKey: context.state.userAccessKey
        }
      })
        .then(response => {
          context.commit('updateCartProductsData', response.data.items)
          context.commit('syncCartProducts')
        })
    },
    updateCartProductAmount (context, { productId, colorId, sizeId, amount }) {
      context.commit('updateCartProductAmount', { productId, colorId, sizeId, amount })
      if (amount < 1) {
        return
      }
      return axios.put(API_BASE_URL + '/api/baskets/products', {
        basketItemId: productId,
        quantity: amount

      }, {
        params: {
          userAccessKey: context.state.userAccessKey
        }
      })
        .then(response => {
          context.commit('updateCartProductsData', response.data.items)
        })
        .catch(() => {
          context.commit('syncCartProducts')
        })
    },
    deleteCartProduct (context, productId) {
      context.commit('deleteCartProduct', productId)
      return axios.delete(API_BASE_URL + '/api/baskets/products', {
        params: {
          userAccessKey: context.state.userAccessKey
        },
        data: {
          basketItemId: productId
        }
      })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items)
        })
        .catch(() => {
          context.commit('syncCartProducts')
        })
    }

  }
})
