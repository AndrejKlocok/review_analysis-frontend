<template>
  <v-container fluid>
      <v-tabs
      v-model="tab"
      background-color="primary"
      dark
    >
      <v-tab to='/product/tree_view'>Tree view</v-tab>
      <v-tab to='/product/product_view'>Product view</v-tab>
       <v-tab to='/product/review_view'>Reviews view</v-tab>
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
