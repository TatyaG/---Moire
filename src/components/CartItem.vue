<template>
  <li class="cart__item product">
              <div class="product__pic">
                <img :src="images(item.color.gallery)" width="120" height="120" :alt="item.product.title">
              </div>
              <h3 class="product__title">
                {{ item.product.title }}
              </h3>
              <p class="product__info product__info--color" style="margin-bottom:50px">
                Цвет:
                <span>
                  <i :style="{'background-color': item.color.color.code}"></i>
                  {{ item.color.color.title }}
                </span>
              </p>

              <p class="product__info product__info--size">
                Размер:
                <span>
                {{ item.size.title }}
              </span>
              </p>

              <span class="product__code">
                {{ item.id }}
              </span>

              <div class="product__counter form__counter">
                <button type="button" aria-label="Убрать один товар" @click.prevent="decrementProduct()">
                  <svg width="10" height="10" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" v-model.number="amount" name="count">

                <button type="button" aria-label="Добавить один товар" @click.prevent="incrementProduct()">
                  <svg width="10" height="10" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <b class="product__price">
                {{ (item.amount * item.product.price) | numberFormat }} ₽
              </b>

              <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины" @click.prevent="deleteProduct(item.id)">
                <svg width="20" height="20" fill="currentColor">
                  <use xlink:href="#icon-close"></use>
                </svg>
              </button>
            </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat.js'
export default {
  props: ['item'],
  filters: {
    numberFormat
  },
  computed: {
    amount: {
      get () {
        return this.item.amount
      },
      set (value) {
        this.$store.dispatch('updateCartProductAmount', { productId: this.item.id, colorId: this.item.color, sizeId: this.item.size, amount: value })
      }
    }
  },
  methods: {
    deleteProduct () {
      this.$store.dispatch('deleteCartProduct', this.item.id)
    },
    incrementProduct () {
      this.amount += 1
    },
    decrementProduct () {
      if (this.amount > 1) {
        this.amount -= 1
      }
    },
    images (value) {
      if (value === null) {
        return value = 'img/default.png'
      }
      return value.map(gallery => gallery.file.url)
    }
  }
}
</script>
