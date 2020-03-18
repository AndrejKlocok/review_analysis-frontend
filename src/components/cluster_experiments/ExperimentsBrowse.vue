<template>
  <v-container fluid>
      <v-tabs
      v-model="tab"
      background-color="primary"
      dark
    >
      <v-tab to='/experiment/cluster_reviews'>Cluster reviews</v-tab>
      <v-tab to='/experiment/view'>Experiments</v-tab>
        <router-view></router-view>
    </v-tabs>
  </v-container>
</template>

<script>
export default {
    components: {},
    data: () => ({
      tab: null
    }),
  methods: {

  },
  beforeMount () {

  },
    computed: {

    }
}
</script>

