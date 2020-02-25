import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './services/store'
import vuetify from './plugins/vuetify';
import moment from 'moment'

Vue.config.productionTip = false
Vue.prototype.moment = moment

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
