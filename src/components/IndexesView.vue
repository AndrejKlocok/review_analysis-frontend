<template>
  <v-container fluid>
    <h1>Elasticsearch indexes view</h1>
    <v-data-table
      :headers="headers"
      :items="indexes"
      :sort-by="['Index', 'Count of documents', 'Size']"
      :sort-desc="[false, true]"
      multi-sort
      :items-per-page="20"
      :hide-default-footer="true"
      class="elevation-1"
    ></v-data-table>
  </v-container>
</template>

<script>
import DataService from '../services/DataService'
import EventBus from "../services/events";
export default {
  data () {
    return {
      headers: [
        { text: 'Index', align: 'left', value: 'index' },
        { text: 'Count of documents', value: 'docs.count' },
        { text: 'Health', value: 'health' },
        { text: 'Size', value: 'store.size' }
      ],
      indexes: [
      ]
    }
  },
  methods: {
    /**
     * Get index health status.
     * @returns {Promise<void>}
     */
    async loadMenuItems () {
      try {
        // send request and display data
        const response = await DataService.get_indexes_health(this.$store.state.jwt)
        this.indexes = response.data
      } catch (error) {
        if (error.response){
          if(error.response.status === 401){
            EventBus.$emit('USER_LOGGED_OUT', error.response.data)
          }
        }
      }
    }
  },
  beforeMount () {
    this.loadMenuItems()
  }
}
</script>
