<template>
  <v-app>
    <v-navigation-drawer
      permanent
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
      >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Review Analysis
          </v-list-item-title>
          <v-list-item-subtitle>
            [{{user_id}} &nbsp; &nbsp;]
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          @click="drawerClick (item.path)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <router-view/>
    </v-content>
        <v-dialog
          v-model="alert"
          max-width="300"
        >
           <v-card>
             <v-card-title class="red white--text headline">
              API Error - {{alert_code}}
            </v-card-title>
             <v-card-text>
                 <h3>{{alert_text}}</h3>
             </v-card-text>
           </v-card>
        </v-dialog>
    <v-footer app>
      <v-layout>
        <span>
          &copy; 2020 Andrej Klocok &nbsp; &nbsp;
        </span>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import EventBus from '@/services/events'
export default {
  data () {
    return {
      drawer: false,
      items: [],
      items_not_logged:[
        { icon: 'home', title: 'Home', path: 'not_logged_home' },
        { icon: 'vpn_key', title: 'Login', path: 'login' },
      ],
      items_user: [
        { icon: 'home', title: 'Home', path: 'user_home' },
        { icon: 'shop', title: 'Product view', path: 'product_tree_view' },
        { icon: 'show_chart', title: 'Elastic actualization', path: 'actualize_es' },
        { icon: 'emoji_people', title: 'Demo', path: 'demo' },
        { icon: 'exit_to_app', title: 'Logout', path: 'logout' },
      ],
      items_analyst:[
        { icon: 'home', title: 'Home', path: 'user_home' },
        { icon: 'cloud_circle', title: 'Elastic indexes', path: 'indexes_view' },
        //{ icon: 'crop_din', title: 'browse_data', path: 'browse_data' },
        { icon: 'shop', title: 'Product view', path: 'product_tree_view' },
        { icon: 'cloud_download', title: 'Dataset generation', path: 'generate_dataset' },
        { icon: 'show_chart', title: 'Elastic actualization', path: 'actualize_es' },
        { icon: 'assignment', title: 'Review clustering', path: 'cluster_reviews' },
        { icon: 'emoji_people', title: 'Demo', path: 'demo' },
        { icon: 'exit_to_app', title: 'Logout', path: 'logout' },

      ],
      items_administrator:[

      ],
      title: 'Review Analysis',
      indexes_table: {},
      user_id: 'user: not logged',
      alert: false,
      alert_text: '',
      alert_code: 200,
    }
  },
  methods: {
   /**
    * Handle for user an event USER_LOGGED.
    * @param user
    */
    userLogged(user){
      if (user.level === 'user'){
        this.items = this.items_user
        this.user_id = 'user: ' + user.name
      }
      else if (user.level === 'analyst'){
        this.items = this.items_analyst
        this.user_id = 'user: ' + user.name
      }
    },
    /**
     * Route to path.
     * @param path
     */
    drawerClick (path) {
      // eslint-disable-next-line no-unused-vars
      this.$router.push({name: path}).catch(err => {})
    },
   /**
    * Logout handle for an event USER_LOGGED_OUT.
    * @param data
    */
    loggedOut(data){
      if(data!==null){
        this.alert_text = data.error
        this.alert_code = data.error_code
        this.alert = true
      }
      this.user_id = 'user: not logged'
      this.items = this.items_not_logged
      this.$store.commit('REM_USER_DATA')
      this.$store.commit('REM_JWT_TOKEN')
      if (this.$route.path !== '/') {
          this.$router.push({name: 'not_logged_home'})
      }
    }
  },
    beforeMount () {
    /**
     * Get user.
     */
    var user = this.$store.state.user
    if (user) {
      this.userLogged(user)
    }
    else {
      this.items = this.items_not_logged
    }
    EventBus.$on('USER_LOGGED', this.userLogged)
    EventBus.$on('USER_LOGGED_OUT', this.loggedOut)
    }
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
