import axios from 'axios'

const ax = axios.create({baseURL: `http://pcknot5.fit.vutbr.cz:42024/product`})

export default {
  get_products (cat_name, jwt) {
    const o = {category_name: cat_name, jwt}
    return ax.post('/', o, {headers: {Authorization:jwt}})
  },
  get_reviews_by_product_name (config, jwt) {
    return ax.post('review', config, {headers: {Authorization:jwt}})
  },
  get_image (config, jwt) {
    return ax.post('image', config, {headers: {Authorization:jwt}})
  },
  get_index_categories (jwt) {
    return ax.get('breadcrumbs', {headers: {Authorization:jwt}})
  },
  get_statistics (config, jwt) {
    return ax.post('statistics', config, {headers: {Authorization:jwt}})
  },
}
