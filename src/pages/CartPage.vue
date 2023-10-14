<template>
  <main class="content container" v-if="$store.state.cartLoading"><img style="position:relative;left:50%;top:50%" src="../../public/img/loader.gif" alt="load"></main>
  <main class="content container" v-else-if="$store.state.cartLoadingFailed">Не удалось загрузить корзину</main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" href="#" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Корзина
        </h1>
        <span class="content__info">
          {{ $store.state.cartProducts.length }} товара
        </span>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem v-for="item in products" :key="item.id" :item="item"/>
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{ totalPrice | numberFormat }} ₽</span>
          </p>

          <router-link tag="button" class="cart__button button button--primery" type="submit" :to="{name: 'order'}" v-show="products.length > 0">
            Оформить заказ
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>

import CartItem from '@/components/CartItem'
import numberFormat from '@/helpers/numberFormat.js'
import { mapGetters } from 'vuex'
export default {

  filters: {
    numberFormat
  },
  components: { CartItem },
  computed: {
    ...mapGetters({ products: 'cartDetailProducts', totalPrice: 'cartTotalPrice' })
  }

}
</script>
