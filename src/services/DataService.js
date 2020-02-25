import axios from 'axios'

const ax = axios.create({baseURL: `http://localhost:8081/data`})

export default {
  get_indexes_health () {
    return ax.get('indexes_health')
  },
  get_breadcrumbs () {
    return ax.get('breadcrumbs')
  },
  get_index_categories () {
    return ax.get('index_breadcrumbs')
  }
}
