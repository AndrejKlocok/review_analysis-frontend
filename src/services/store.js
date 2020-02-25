import Vue from 'vue'
import Vuex from 'vuex'

// import VueLocalStorage from 'vue-localstorage'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    breadcrumbs: [],
    index_categories : [],
    clicked_product:{}
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
    }
  }
})
export default store
