import Vue from 'vue'
import Vuex from 'vuex'

// import VueLocalStorage from 'vue-localstorage'
import {isValidJwt} from "./events";


Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    breadcrumbs: [],
    index_categories : [],
    clicked_product:{},
    experiments: [],
    user: null,
    jwt: ''
  },
  mutations: { // Mutations are like setters
    SET_BREADCRUMBS: (state, val) => {
      state.breadcrumbs = val
    },
    REM_BREADCRUMBS: (state) => {
      state.breadcrumbs = []
    },
    SET_INDEX_CATs: (state, val) => {
      state.index_categories = val
    },
    REM_INDEX_CATs: (state) => {
      state.index_categories = []
    },
    SET_CLICKED_PRODUCT: (state, val) => {
      state.clicked_product = val
    },
    SET_EXPERIMENTS: (state, val) => {
      state.experiments = val
    },
    REM_EXPERIMENTS: (state) => {
      state.experiments = []
    },
    SET_USER_DATA: (state, val) => {
      state.user = val
    },
    REM_USER_DATA: (state) => {
      state.user = null
    },
    SET_JWT_TOKEN: (state, val) => {
      localStorage.token = val
      state.jwt = val
    },
    REM_JWT_TOKEN: (state) => {
      localStorage.token = ''
      state.jwt = ''
    },

  },
  actions: {
    /*
    login (context, userData) {
      context.commit('SET_USER_DATA', {userData})
      return authenticate(userData)
          .then ( response => context.commit('SET_JWT_TOKEN', {
            jwt: response.data
          }))
          .catch(error => {
            console.log('Error login: ', error)
            EventBus.$emit('loginFailed', error)
          })
    },
    register (context, userData) {
      context.commit('SET_USER_DATA', {userData})
      return register(userData)
          .then(context.dispatch('login', userData))
          .catch(error => {
            console.log('Error register: ', error)
            EventBus.$emit('registerFailed', error)
          })
    }
     */
  },
  getters: {
    isAuthenticated (state) {
      return isValidJwt(state.jwt.token)
    }
  }
})
export default store
