<template>
  <BaseFormField :title="title" :error="error">
              <textarea class="form__input form__input--area" :type="type" v-model="dataValue" :placeholder="placeholder"></textarea>
   </BaseFormField>
</template>

<script>
import formFieldMixin from '@/mixins/formFieldMixin.js'

export default {
  props: ['type'],
  mixins: [formFieldMixin]
}
</script>
