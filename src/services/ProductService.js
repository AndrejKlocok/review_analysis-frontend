import axios from 'axios'

const ax = axios.create({baseURL: `http://localhost:8081/product`})

export default {
  get_products (cat_name) {
    const o = {category_name: cat_name}
    return ax.post('/', o)
  },
  get_reviews_by_product_name (product_name) {
    const o = {product_name: product_name}
    console.log(o)
    return ax.post('review', o)
  },
  get_image (url) {
    const o = {url: url}
    return ax.post('image', o)
  },
  get_index_categories () {
    return ax.get('breadcrumbs')
  }
}
