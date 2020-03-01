import axios from 'axios'

const ax = axios.create({baseURL: `http://localhost:8081/experiment`})

export default {
  cluster_sentences (config) {
    return ax.post('cluster', config, {timeout: 600000})
  }

}
