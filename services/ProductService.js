import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.baseUrl,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  getProducts() {
    return apiClient.get('/products')
  },
  getProduct(id) {
    return apiClient.get('/products/' + id)
  },
  getGeneralProductData() {
    return apiClient.get('/productData')
  },
  getProductQuantities(productId) {
    return apiClient.get('/productQuantities/' + productId)
  },
  getProductSKUs() {
    return apiClient.get('/productSKUs/')
  },
}
