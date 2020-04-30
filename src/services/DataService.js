import axios from 'axios'

//const ax = axios.create({baseURL: `http://localhost:8081/data`})
const ax = axios.create({baseURL: `http://pcknot5.fit.vutbr.cz:42069/data`})
//const ax = axios.create({baseURL: `http://athena18.fit.vutbr.cz:42069/data`})

export default {
  get_indexes_health () {
    return ax.get('indexes_health')
  },
  get_breadcrumbs () {
    return ax.get('breadcrumbs')
  },
  category_statistics (content) {
    return ax.post('actualization_statistics', content)
  }
}
