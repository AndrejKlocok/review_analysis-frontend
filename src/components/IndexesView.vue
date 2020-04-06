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
    async loadMenuItems () {
      try {
        const response = await DataService.get_indexes_health()
        this.indexes = response.data
      } catch (error) {
        if (error.response) {
          console.log(error.response)
        }
      }
    }
  },
  beforeMount () {
    this.loadMenuItems()
  }
}
</script>
