<template>
  <v-container fluid>
      <v-tabs
      v-model="tab"
      background-color="primary"
      dark
    >
      <v-tab to='/demo/demo'>Overview</v-tab>
      <v-tab to='/demo/pos_con'>Positive/Negative</v-tab>
      <v-tab to='/demo/text_rating'>Text rating</v-tab>
      <v-tab to='/demo/irrelevant'>Irrelevant sentences</v-tab>
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
