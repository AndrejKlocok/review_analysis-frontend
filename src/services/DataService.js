import axios from 'axios'

const ax = axios.create({baseURL: `http://pcknot5.fit.vutbr.cz:42024/data`})

export default {
  get_indexes_health (jwt) {
    return ax.get('indexes_health', {headers: {Authorization:jwt}})
  },
  get_breadcrumbs (jwt) {
    return ax.get('breadcrumbs', {headers: {Authorization:jwt}})
  },
  category_statistics (content, jwt) {
    return ax.post('actualization_statistics', content, {headers: {Authorization:jwt}})
  }
}
