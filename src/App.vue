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
        { icon: 'crop_din', title: 'Home', path: 'not_logged_home' },
        { icon: 'crop_din', title: 'Login', path: 'login' },
      ],
      items_user: [
        { icon: 'crop_din', title: 'Home', path: 'user_home' },
        { icon: 'crop_din', title: 'product_view', path: 'product_tree_view' },
        { icon: 'crop_din', title: 'demo', path: 'demo' },
        { icon: 'crop_din', title: 'logout', path: 'logout' },
      ],
      items_analyst:[
        { icon: 'crop_din', title: 'Home', path: 'user_home' },
        { icon: 'crop_din', title: 'indexes_view', path: 'indexes_view' },
        { icon: 'crop_din', title: 'browse_data', path: 'browse_data' },
        { icon: 'crop_din', title: 'product_view', path: 'product_tree_view' },
        { icon: 'crop_din', title: 'generate_dataset', path: 'generate_dataset' },
        { icon: 'crop_din', title: 'actualize_es', path: 'actualize_es' },
        { icon: 'crop_din', title: 'cluster_reviews', path: 'cluster_reviews' },
        { icon: 'crop_din', title: 'demo', path: 'demo' },
        { icon: 'crop_din', title: 'logout', path: 'logout' },

      ],
      items_administrator:[

      ],
      title: 'Review Analysis',
      indexes_table: {},
      user_id: 'user: not logged'
    }
  },
  methods: {
    userLogged(user){
      console.log('Using user')
      console.log(user)
      if (user.level === 'user'){
        this.items = this.items_user
        this.user_id = 'user: ' + user.name
      }
      else if (user.level === 'analyst'){
        this.items = this.items_analyst
        this.user_id = 'user: ' + user.name
      }
    },
    drawerClick (path) {
      // eslint-disable-next-line no-unused-vars
      this.$router.push({name: path}).catch(err => {})
    },
    loggedOut(){
      this.user_id = 'user: not logged'
      this.items = this.items_not_logged
    }
  },
  beforeMount () {
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
