<template>
  <main class="content container">
    <div class="content__top">

      <div class="content__row">
        <h1 class="content__title">
          Каталог
        </h1>
        <span class="content__info">
          152 товара
        </span>
      </div>
    </div>

    <div class="content__catalog">

      <ProductFilter :price-from.sync="filterPriceFrom" :price-to.sync="filterPriceTo" :category-id.sync="filterCategoryId" :color-id.sync="filterColorId" :material-id.sync="filterMaterialId" :season-id.sync="filterSeasonId"/>
      <section class="catalog">
        <div v-if="productsLoading"><img style="position: absolute; left:60%;top:50%" class="preload" src="../../public/img/loader.gif" alt="load"></div>
        <div v-if="productsLoadingFailed">Произошла ошибка при загрузке товаров <button @click.prevent="loadProducts()">Попробовать еще раз</button></div>
<ProductList :products='products' />
<BasePagination v-model="page" :count="countProducts" :per-page="productsPerPage"/>
 </section>

    </div>
  </main>

</template>

<script>

import ProductList from '@/components/ProductList'
import BasePagination from '@/components/BasePagination'
import ProductFilter from '@/components/ProductFilter'
import axios from 'axios'
import { API_BASE_URL } from '../config.js'

export default {
  components: { ProductList, BasePagination, ProductFilter },
  data () {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterColorId: [],
      filterMaterialId: [],
      filterSeasonId: [],
      page: 1,
      productsPerPage: 12,

      productsData: null,

      productsLoading: false,
      productsLoadingFailed: false
    }
  },
  computed: {
    products () {
      return this.productsData
        ? this.productsData.items.map((product) => {
          return {
            ...product,
            image: product.colors[0].gallery
          }
        })
        : []
    },
    countProducts () {
      return this.productsData ? this.productsData.pagination.total : 0
    }
  },
  methods: {
    loadProducts () {
      this.productsLoading = true
      this.productsLoadingFailed = false
      clearTimeout(this.loadProductsTimer)
      this.loadProductsTimer = setTimeout(() => {
        axios.get(API_BASE_URL + '/api/products', {
          params: {
            page: this.page,
            limit: this.productsPerPage,
            categoryId: this.filterCategoryId,
            minPrice: this.filterPriceFrom,
            maxPrice: this.filterPriceTo,
            materialIds: this.filterMaterialId,
            seasonIds: this.filterSeasonId,
            colorIds: this.filterColorId
          }
        })
          .then(response => this.productsData = response.data)
          .catch(() => this.productsLoadingFailed = true)
          .then(() => this.productsLoading = false)
      }, 0)
    }
  },
  watch: {
    page () {
      this.loadProducts()
    },
    filterCategoryId () {
      this.loadProducts()
    },
    filterPriceFrom () {
      this.loadProducts()
    },

    filterPriceTo () {
      this.loadProducts()
    },
    filterMaterialId () {
      this.loadProducts()
    },
    filterSeasonId () {
      this.loadProducts()
    }
  },
  created () {
    this.loadProducts()
  }
}
</script>
