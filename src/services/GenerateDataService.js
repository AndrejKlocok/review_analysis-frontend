import axios from 'axios'

const ax = axios.create({baseURL: `http://localhost:8081/generate`})

export default {
  generate_dataset (config) {
    return ax.post('data', config, {responseType: 'blob', timeout: 6000000})
  }

}
