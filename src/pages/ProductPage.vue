<template>
  <main class="content container preload" v-if="productLoading"><img style="position: relative; left:50%;top:50%" src="../../public/img/loader.gif" alt="load"></main>
  <main class="content container" v-else-if="!productData">Не удалось загрузить товар</main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" href="#" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" href="#" :to="{name: 'main'}">
            {{ category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics" >
        <div class="pics__wrapper" v-for="(color, index) in colors" :key="color.id">
          <img width="570" height="570" :src="images(color.gallery)" :alt="product.title" :hidden="selectImage !== index">
        </div>
        <ul class="pics__list" >
          <li class="pics__item" v-for="(color, index) in colors" :key="color.id">
            <a href="" class="pics__link" :class="{'pics__link--current': selectImage === index}">
              <img width="98" height="98" :src="images(color.gallery)" :alt="product.title" @click.prevent="selectImage = index">
            </a>
          </li>
        </ul>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">
           {{ product.title }}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST" @submit.prevent="addToCart">
            <div class="item__row item__row--center">
              <div class="form__counter">
                <button type="button" aria-label="Убрать один товар" @click.prevent="decrementProduct()">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" value="1" name="count" v-model.number="productAmount">

                <button type="button" aria-label="Добавить один товар" @click.prevent="incrementProduct()">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <b class="item__price">
                {{ product.price | numberFormat}} ₽
              </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ul class="colors colors--black">
                  <li class="colors__item" v-for="(color,index) in colors" :key="color.color.id">
                    <label class="colors__label" >
                      <input class="colors__radio sr-only" v-model.number="currentColorId" type="radio" name="color-item" :value="color.color.id" required @change="selectImage = index">
                      <span class="colors__value" :style="{'background-color': color.color.code}">
                      </span>
                    </label>
                  </li>

                </ul>
              </fieldset>

              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label class="form__label form__label--small form__label--select">
                  <select class="form__select" type="text" name="category" v-model.number="currentSizeId" required>
                    <option :value="size.id" v-for="size in sizes" :key="size.id">{{ size.title }}</option>
                  </select>
                </label>
              </fieldset>
            </div>

            <button class="item__button button button--primery" type="submit" :disabled="productAddSending">
              В корзину
            </button>

            <div v-show="productAdded">Товар добавлен в корзину</div>
            <div v-show="productAddSending">Добавляем товар в корзину...</div>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item" v-for="(link, index) in links" :key="index">
            <a class="tabs__link" :class="{'tabs__link--current': selectLink === index}" @click.prevent="selectLink = index">
              {{ link.text }}
              <!-- Информация о товаре -->
            </a>

          </li>
        </ul>

        <div class="item__content" v-show="selectLink === 0">
          <h3>Состав:</h3>

          <p v-for="material in productData.materials" :key="material.id">
            {{ material.title }}
          </p>

          <h3>Уход:</h3>

          <p>
            Машинная стирка при макс. 30ºC короткий отжим<br>
            Гладить при макс. 110ºC<br>
            Не использовать машинную сушку<br>
            Отбеливать запрещено<br>
            Не подвергать химчистке<br>
          </p>

        </div>
        <div class="item__content" v-show="selectLink === 1">
          <p v-for="delivery in deliveriesData" :key="delivery.id">
            {{ delivery.title}} - <b>{{ delivery.price | numberFormat }} ₽</b>
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>

import numberFormat from '@/helpers/numberFormat.js'
import axios from 'axios'
import { API_BASE_URL } from '../config.js'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      productAmount: 1,
      productData: null,

      selectLink: 0,
      selectImage: 0,

      links: [
        { text: 'Информация о товаре' },
        { text: 'Доставка и возврат' }
      ],

      currentColorId: 0,
      currentSizeId: 0,

      deliveriesData: [],

      productAdded: false,
      productAddSending: false,

      productLoading: false,
      productLoadingFailed: false
    }
  },
  filters: {
    numberFormat
  },
  computed: {
    product () {
      return this.productData
    },
    category () {
      return this.productData.category
    },
    colors () {
      return this.productData.colors
    },
    sizes () {
      return this.productData.sizes
    },
    deliveries () {
      return this.deliveriesData
    }
  },
  methods: {
    ...mapActions(['addProductToCart']),
    addToCart () {
      this.productAdded = false
      this.productAddSending = true
      this.addProductToCart({ productId: this.product.id, colorId: this.currentColorId, sizeId: this.currentSizeId, amount: this.productAmount })
        .then(() => {
          this.productAdded = true
          this.productAddSending = false
        })
    },
    images (value) {
      if (value === null) {
        return value = 'img/default.png'
      }
      return value.map(gallery => gallery.file.url)
    },

    incrementProduct () {
      this.productAmount += 1
    },

    decrementProduct () {
      if (this.productAmount > 1) {
        this.productAmount -= 1
      }
    },
    loadProduct () {
      this.productLoading = true
      this.productLoadingFailed = false
      axios.get(API_BASE_URL + '/api/products/' + this.$route.params.id)
        .then(response => this.productData = response.data)
        .catch(() => this.productLoadingFailed = true)
        .then(() => this.productLoading = false)
    },
    loadDeliveries () {
      this.deliveriesLoading = true
      this.deliveriesLoadingFailed = false
      axios.get(API_BASE_URL + '/api/deliveries')
        .then(response => this.deliveriesData = response.data)
        .catch(() => this.deliveriesLoadingFailed = true)
        .then(() => this.deliveriesLoading = false)
    }

  },
  created () {
    this.loadProduct()
    this.loadDeliveries()
  },
  watch: {
    '$route.params.id': {
      handler () {
        this.loadProduct()
      }

    },
    colorId (value) {
      this.currentColorId = value
    },
    sizeId (value) {
      this.currentSizeId = value
    }

  }

}
</script>
