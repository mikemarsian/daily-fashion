<template>
  <div>
    <DFProductsList></DFProductsList>
  </div>
</template>

<script>
import DFProductsList from '@/components/products_list/ProductsListContainer';
import "@storefront-ui/vue/styles.scss";


export default {
  name: 'index',
  components: {
    DFProductsList
  }
}
</script>
