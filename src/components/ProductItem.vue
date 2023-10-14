<template>
  <li class="catalog__item">
           <router-link class="catalog__pic" href="#" :to="{name: 'product', params: {id: product.id}}">
             <img v-for="(color, index) in colorsData" :src="images(color.gallery)" :alt="product.title" :hidden="checkedColor !== index">
           </router-link>

           <h3 class="catalog__title">
             <a href="#">
           {{ product.title }}
             </a>
           </h3>

           <span class="catalog__price">
            {{ product.price | numberFormat }} ₽
           </span>

           <ul class="colors colors--black">
             <li class="colors__item" v-for="(color, index) in colorsData" :key=color.id>
               <label class="colors__label">
                 <input class="colors__radio sr-only" type="radio" name="color" :value="color.color.id" @change="checkedColor = index">
                 <span class="colors__value" :style="{'background-color': color.color.code}">
                 </span>
               </label>
             </li>
            </ul>
    </li>

</template>

<script>

import numberFormat from '@/helpers/numberFormat.js'
import { API_BASE_URL } from '../config.js'
import axios from 'axios'

export default {
  data () {
    return {
      colorsData: null,

      checkedColor: 0
    }
  },
  props: ['product'],
  filters: {
    numberFormat
  },
  methods: {
    loadColors () {
      axios.get(API_BASE_URL + `/api/products/${this.product.id}`)
        .then((response) => this.colorsData = response.data.colors)
    },
    images (value) {
      if (value === null) {
        return value = 'img/default.png'
      }
      return value.map(gallery => gallery.file.url)
    }
  },
  created () {
    this.loadColors()
  }

}
</script>
