import axios from 'axios'

const ax = axios.create({baseURL: `http://localhost:8081/experiment`})

export default {
  cluster_sentences (config) {
    return ax.post('cluster', config, {timeout: 600000})
  },
  peek_sentences (config) {
    return ax.post('cluster_peek', config, {timeout: 600000})
  },
  get_experiments() {
    return ax.get('/')
  },
  delete_experiment(config) {
    return ax.delete('/', { data: config })
  },
  ger_experiment_sentences (config) {
    return ax.post('sentences', config, {timeout: 600000})
  },

}
