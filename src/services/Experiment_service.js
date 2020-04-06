import axios from 'axios'

const ax = axios.create({baseURL: `http://localhost:8081/experiment`})
//const ax = axios.create({baseURL: `http://pcknot5.fit.vutbr.cz:42069/experiment`})

export default {
  cluster_sentences (config) {
    return ax.post('cluster', config, {timeout: 600000})
  },
    get_experiments() {
    return ax.get('cluster')
  },
  update_cluster_name(config) {
    return ax.put('cluster', config, {timeout: 60000})
  },
  delete_experiment(config) {
    return ax.delete('cluster', { data: config })
  },
  cluster_merge(config) {
    return ax.post('cluster_merge', config)
  },
  peek_sentences (config) {
    return ax.post('cluster_peek', config, {timeout: 600000})
  },
  update_topic_name(config) {
    return ax.put('cluster/topic', config,)
  },
    merge_topic(config) {
    return ax.post('cluster/topic', config,)
  },
  get_experiment_sentences (config) {
    return ax.post('sentences', config, {timeout: 600000})
  },
  check_review (config) {
    return ax.post('review', config)
  },
  check_polarity (config) {
    return ax.post('sentence_pos_con', config)
  },
  check_rating (config) {
    return ax.post('text_rating', config)
  },
  check_irrelevant (config) {
    return ax.post('text_irrelevant', config)
  },
  update_sentence(config) {
    return ax.post('update_sentence', config)
  },
  create_cluster(config) {
    return ax.post('experiment_cluster', config,)
  },
  update_topics(config) {
    return ax.put('experiment_cluster_topics', config,)
  }
}
