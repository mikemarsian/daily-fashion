<template>
  <div class="columns is-centered is-multiline">
    <div class="card column is-one-third" v-for="product in products" :key="product.id">
      <DFProducts :product="product"></DFProducts>
    </div>
    <div class="section" v-if="products.length === 0">
      <p>{{ noProductLabel }}</p>
    </div>
  </div>
</template>

<script>
import DFProducts from '../Products';
import ProductService from '@/services/ProductService.js';
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'productsList',

  components: { DFProducts },

  data () {
    return {
      id: '',
      noProductLabel: 'No product found'
    };
  },

  computed: {
    ...mapState(['products'])
  },

  methods: {
    ...mapMutations(['loadProducts']),
  },

  created() {
    if (this.products.length == 0) {
      ProductService.getProducts()
        .then(response => {
          console.log('Committing products...');
          this.loadProducts(response.data);
        })
        .catch(error => {
          console.log('Error:' + error.response)
        })
    }
  }
};
</script>

<style lang="scss" scoped>
  .card {
    margin: 10px;
  }
</style>
