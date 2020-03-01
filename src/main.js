import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './services/store'
import vuetify from './plugins/vuetify';
import moment from 'moment'
import { GChart } from 'vue-google-charts'

Vue.config.productionTip = false
Vue.prototype.moment = moment

new Vue({
  vuetify,
  router,
  store,
  GChart,
  render: h => h(App)
}).$mount('#app')
