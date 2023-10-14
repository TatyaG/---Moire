<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'cart'}">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Оформление заказа
        </h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">

            <BaseFormText title="ФИО" :error="formError.name" placeholder="Введите ваше полное имя" v-model="formData.name" type="text"></BaseFormText>

            <BaseFormText title="Адрес доставки" :error="formError.address" placeholder="Введите ваш адрес" v-model="formData.address" type="text"></BaseFormText>

            <BaseFormText title="Телефон" :error="formError.phone" placeholder="Введите ваш телефон" v-model="formData.phone" type="tel"></BaseFormText>

            <BaseFormText title="Email" :error="formError.email" placeholder="Введи ваш Email" v-model="formData.email" type="email"></BaseFormText>

            <BaseFormTextarea title="Комментарий к заказу" :error="formError.comment" placeholder="Ваши пожелания" v-model="formData.comment"/>

          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options" v-if="deliveriesLoading">Загрузка...</ul>
            <ul class="cart__options options" v-else-if="deliveriesLoadingFailed">Не удалось загрузить способы доставки</ul>
            <ul class="cart__options options" v-else>
              <li class="options__item" v-for="delivery in deliveries" :key="delivery.id">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" :value="delivery" v-model="deliveryTypeId" required>
                  <span class="options__value" v-if="delivery.price == 0">
                    {{delivery.title}} <b>бесплатно</b>
                  </span>
                  <span class="options__value" v-else>
                    {{delivery.title}} <b>{{ delivery.price }} ₽</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options" v-if="paymentsLoading">Загрузка...</ul>
            <ul class="cart__options options" v-else-if="paymentsLoadingFailed">Не удалось загрузить способы оплаты</ul>
            <ul class="cart__options options" v-else>
              <li class="options__item" v-for="payment in payments" :key="payment.id">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" :value="payment" v-model="paymentTypeId" required>
                  <span class="options__value">
                    {{ payment.title }}
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="product in products" :key="product.id">
              <h3>{{ product.product.title }}</h3>
              <b>{{ product.product.price | numberFormat }} ₽</b>
              <span>Артикул: {{ product.id }}</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>{{ deliveryTypeId.price }}</b></p>
            <p v-if="deliveryTypeId">Итого: <b>{{ products.length }}</b> товара на сумму <b>{{ Number(deliveryTypeId.price) + totalPrice | numberFormat }} ₽</b></p>
            <p v-else>Итого: <b>{{ products.length }}</b> товара на сумму <b>{{ totalPrice | numberFormat }} ₽</b></p>
          </div>

          <button class="cart__button button button--primery" type="submit" :disabled="orderProcessing">
            Оформить заказ
          </button>
          <div v-show="orderIsProcessed">Заказ оформлен</div>
            <div v-show="orderProcessing">Оформляем заказ...</div>
        </div>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormText from '@/components/BaseFormText'
import BaseFormTextarea from '@/components/BaseFormTextarea'
import axios from 'axios'
import { API_BASE_URL } from '../config.js'
import { mapGetters } from 'vuex'
import numberFormat from '@/helpers/numberFormat'

export default {
  data () {
    return {
      formData: {},
      formError: {},
      formErrorMessage: '',
      deliveryTypeId: 0,
      paymentTypeId: 0,
      paymentsData: [],
      deliveriesData: [],
      deliveriesLoading: false,
      deliveriesLoadingFailed: false,
      paymentsLoading: false,
      paymentsLoadingFailed: false,
      orderLoading: false,
      orderLoadingFailed: false,
      orderProcessing: false,
      orderIsProcessed: false
    }
  },
  filters: { numberFormat },
  computed: {
    deliveries () {
      return this.deliveriesData
    },
    payments () {
      return this.paymentsData
    },
    ...mapGetters({ products: 'cartDetailProducts', totalPrice: 'cartTotalPrice' })
  },

  components: { BaseFormText, BaseFormTextarea },
  methods: {
    loadDeliveries () {
      this.deliveriesLoading = true
      this.deliveriesLoadingFailed = false
      clearTimeout(this.loadDeliveriesTimer)
      this.loadDeliveriesTimer = setTimeout(() => {
        axios.get(API_BASE_URL + '/api/deliveries')
          .then(response => this.deliveriesData = response.data)
          .catch(() => this.deliveriesLoadingFailed = true)
          .then(() => this.deliveriesLoading = false)
      }, 0)
    },
    loadPayments () {
      this.paymentsLoading = true
      this.paymentsLoadingFailed = false
      clearTimeout(this.loadPaymentsTimer)
      this.loadPaymentsTimer = setTimeout(() => {
        axios.get(API_BASE_URL + '/api/payments', {
          params: {
            deliveryTypeId: this.deliveryTypeId.id
          }
        })
          .then(response => this.paymentsData = response.data)
          .catch(() => this.paymentsLoadingFailed = true)
          .then(() => this.paymentsLoading = false)
      }, 0)
    },
    order () {
      this.formError = {}
      this.formErrorMessage = ''
      this.orderLoading = true
      this.orderLoadingFailed = false
      clearTimeout(this.loadOrderTimer)
      this.loadOrderTimer = setTimeout(() => {
        axios.post(API_BASE_URL + '/api/orders', {
          name: this.formData.name,
          address: this.formData.address,
          phone: this.formData.phone,
          email: this.formData.email,
          deliveryTypeId: this.deliveryTypeId.id,
          paymentTypeId: this.paymentTypeId.id,
          comment: this.formData.comment

        }, {
          params: {
            userAccessKey: this.$store.state.userAccessKey
          }
        })
          .then((response) => {
            this.orderProcessing = true
            this.orderIsProcessed = true
            this.$store.commit('resetCart')
            this.$store.commit('updateOrderInfo', response.data)
            this.$router.push({ name: 'orderInfo', params: { id: response.data.id } })
          })
          .catch((error) => {
            this.orderProcessing = false
            this.orderLoadingFailed = true
            this.formError = error.response.data.error.request || {}
            this.formErrorMessage = error.response.data.error.message
          })
          .then(() => this.orderLoading = false)
      }, 0)
    }
  },
  created () {
    this.loadDeliveries()
  },
  watch: {
    deliveryTypeId () {
      this.loadPayments()
    }
  }

}
</script>
