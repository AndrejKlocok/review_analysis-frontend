import axios from 'axios'

//const ax = axios.create({baseURL: `http://localhost:42024/generate`})
const ax = axios.create({baseURL: `http://pcknot5.fit.vutbr.cz:42024/generate`})

export default {
  generate_dataset (config, jwt) {
    return ax.post('data', config, {
      responseType: 'blob', timeout: 6000000, headers:{Authorization:jwt}})
  }

}
