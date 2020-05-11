<template>
  <v-container fluid>
  <v-btn
        dark
        class="cyan"
        @click="reloadBreadCrumbs">
        Reload
  </v-btn>
  <v-card>
    <div @click.capture="onListClick($event)">
      <v-treeview
        dense
        class="ml-4"
        :items="breadcrumbs"
        activatable
        item-key="name"
        open-on-click
        @update:active="test"
      >
      </v-treeview>
    </div>
  </v-card>
  </v-container>
</template>

<script>
import DataService from '../services/DataService'
import EventBus from "../services/events";

export default {
  data: () => ({
    breadcrumbs: [],
    active: ''
  }),
  methods: {
    test (items) {
      console.log('TEST', items)
    },
    onListClick ($event) {
      console.log($event.target);
    },
    async loadBreadCrumbs () {
      try {
        const response = await DataService.get_breadcrumbs(this.$store.state.jwt)
        this.breadcrumbs = response.data
        this.$store.commit('SET_BREADCRUMBS', response.data)
        console.log('done')
      } catch (error) {
        if (error.response) {
          if(error.response.status === 401){
                EventBus.$emit('USER_LOGGED_OUT', error.response.data)
              }
        }
      }
    },
    async reloadBreadCrumbs () {
      console.log('Reload')
      this.$store.commit('REM_BREADCRUMBS')
      this.loadBreadCrumbs()
    }
  },
  beforeMount () {
    if (this.$store.state.breadcrumbs[0]) {
      console.log('store')
      this.breadcrumbs = this.$store.state.breadcrumbs
      console.log(this.breadcrumbs)
    } else {
      console.log('loadBreadCrumbs')
      this.loadBreadCrumbs()
    }
  }
}
</script>
