import axios from 'axios'

const ax = axios.create({baseURL: `http://localhost:8081/experiment`})
//const ax = axios.create({baseURL: `http://pcknot5.fit.vutbr.cz:42069/experiment`})
//const ax = axios.create({baseURL: `http://athena18.fit.vutbr.cz:42069/experiment`})

export default {
  cluster_sentences (config, jwt) {
    return ax.post('/', config, {timeout: 600000, headers: {Authorization:jwt}})
  },
  get_experiments(jwt) {
    return ax.get('/', {headers: {Authorization:jwt}})
  },
  delete_experiment(config, jwt) {
    return ax.delete('/', { data: config, headers: {Authorization:jwt} })
  },
  update_cluster_name(config, jwt) {
    return ax.put('cluster', config, {headers: {Authorization:jwt}})
  },
  create_cluster(config, jwt) {
    return ax.post('cluster', config,{headers: {Authorization:jwt}})
  },
  cluster_merge(config, jwt) {
    return ax.post('cluster_merge', config, {headers: {Authorization:jwt}})
  },
  peek_sentences (config, jwt) {
    return ax.post('cluster_peek', config, {timeout: 600000, headers: {Authorization:jwt}})
  },
  update_topic_name(config, jwt) {
    return ax.put('topic', config, {headers: {Authorization:jwt}})
  },
    merge_topic(config, jwt) {
    return ax.post('topic', config,{headers: {Authorization:jwt}})
  },
  get_experiment_sentences (config, jwt) {
    return ax.post('sentences', config, {timeout: 600000, headers: {Authorization:jwt}})
  },
  check_review (config, jwt) {
    return ax.post('review', config, {headers: {Authorization:jwt}})
  },
  check_polarity (config, jwt) {
    return ax.post('sentence_pos_con', config, {headers: {Authorization:jwt}})
  },
  check_rating (config, jwt) {
    return ax.post('text_rating', config, {headers: {Authorization:jwt}})
  },
  check_irrelevant (config, jwt) {
    return ax.post('text_irrelevant', config, {headers: {Authorization:jwt}})
  },
  update_sentence(config, jwt) {
    return ax.put('sentence', config, {headers: {Authorization:jwt}})
  },
  update_topics(config, jwt) {
    return ax.put('experiment_cluster_topics', config, {headers: {Authorization:jwt}})
  }
}
