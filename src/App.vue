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
            menu
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
// import store from '@/services/store'
// import EventBus from '@/services/events'
import DataService from '@/services/DataService'
export default {
  data () {
    return {
      drawer: false,
      items: [],
      itemsUser: [{ icon: 'crop_din', title: 'Home', path: 'main' },
        { icon: 'crop_din', title: 'indexes_view', path: 'indexes_view' },
        { icon: 'crop_din', title: 'browse_data', path: 'browse_data' },
        { icon: 'crop_din', title: 'product_view', path: 'product_tree_view' },
        { icon: 'crop_din', title: 'generate_dataset', path: 'generate_dataset' },
        { icon: 'crop_din', title: 'actualize_es', path: 'actualize_es' },
        { icon: 'crop_din', title: 'cluster_reviews', path: 'cluster_reviews' },
        { icon: 'crop_din', title: 'demo', path: 'demo' }
      ],
      title: 'Review Analysis',
      indexes_table: {}
    }
  },
  methods: {
    drawerClick (path) {
      // eslint-disable-next-line no-unused-vars
      this.$router.push({name: path}).catch(err => {})
    },
    async loadIndexesHealth () {
      try {
        const response = await DataService.get_indexes_health()
        console.log(response.data)
        this.data = response.data
      } catch (error) {
        if (error.response) {
          console.log(error.response)
        }
      }
    }
  },
  beforeMount () {
    this.items = this.itemsUser
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
