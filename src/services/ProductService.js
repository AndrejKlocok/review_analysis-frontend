import axios from 'axios'

//const ax = axios.create({baseURL: `http://localhost:8081/product`})
const ax = axios.create({baseURL: `http://pcknot5.fit.vutbr.cz:42069/product`})
//const ax = axios.create({baseURL: `http://athena18.fit.vutbr.cz:42069/product`})

export default {
  get_products (cat_name) {
    const o = {category_name: cat_name}
    return ax.post('/', o)
  },
  get_reviews_by_product_name (config) {
    return ax.post('review', config)
  },
  get_image (config) {
    return ax.post('image', config)
  },
  get_index_categories () {
    return ax.get('breadcrumbs')
  },
  get_statistics (config) {
    return ax.post('statistics', config)
  },
}
