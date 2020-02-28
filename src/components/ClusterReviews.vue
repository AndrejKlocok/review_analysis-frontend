<template>
    <v-container fluid>
        <h1>Cluster simillar sentences</h1>
        <v-card
        class="mx-auto"

        tile>
            <v-row>
                <v-col>
                  <v-treeview
                    v-model="categories"
                    dense
                    class="ml-4"
                    :items="breadcrumbs"
                    activatable
                    item-key="name"
                    open-on-click
                    selectable
                  >
              </v-treeview>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col>
                <v-row>
                    <template v-if="!categories.length">
                      No categories selected.
                    </template>
                    <template v-else>
                      Selected {{categories.length}} categories
                    </template>
                </v-row>
            </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
    import ProductService from "../services/ProductService";

    export default {
        data: () => ({
            categories: [],
            breadcrumbs: [],
        }),
        methods: {
            async loadBreadCrumbs () {
              try {
                const response = await ProductService.get_index_categories()
                this.breadcrumbs = response.data
                this.$store.commit('SET_INDEX_CATs', response.data)
                console.log('done')
              } catch (error) {
                if (error.response) {
                  console.log(error.response)
                }
              }
            },
        },
          beforeMount () {
            if (this.$store.state.index_categories[0]) {
              console.log('store')
              this.breadcrumbs = this.$store.state.index_categories
              console.log(this.breadcrumbs)
            } else {
              console.log('loadBreadCrumbs')
              this.loadBreadCrumbs()
            }
          }
    }
</script>

<style scoped>

</style>
