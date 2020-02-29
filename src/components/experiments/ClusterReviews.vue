<template>
    <v-container fluid>
        <ExperimentsBrowse></ExperimentsBrowse>
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
                <v-row>
                    <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                    >
                      <v-select
                      v-model="embedding_type_select"
                      :items="embedding_type_items"
                      :rules="[v => !!v || 'Item is required']"
                      label="Embedding method"
                      required
                    ></v-select>
                    <v-select
                      v-model="embedding_method_select"
                      :items="embedding_method_items"
                      :rules="[v => !!v || 'Item is required']"
                      label="Cluster method"
                      required
                    ></v-select>
                    <v-text-field
                      v-model="clusters_count_select"
                      hide-details
                      single-line
                      type="number"
                      label="Count of clusters"
                      :rules="[ clusters_count_rules ]"
                    />
                     <v-text-field
                      v-model="topics_per_cluster_select"
                      hide-details
                      single-line
                      type="number"
                      label="Topics per cluster"
                      :rules="[ topics_per_cluster_rules ]"
                    />
                    <v-checkbox
                      v-model="save_data_checkbox"
                      label="Save data"
                    ></v-checkbox>

                    </v-form>
                </v-row>
                <v-row>
                    <v-btn
                    dark
                    class="cyan"
                    :disabled="!valid"
                    @click="onSimilarityClicked">
                    Generate
                  </v-btn>
                </v-row>
            </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>

<script>
    import ProductService from "../../services/ProductService"
    import Experiment_service from "../../services/Experiment_service"
    import ExperimentsBrowse from "./ExperimentsBrowse"

    export default {
        components: {ExperimentsBrowse},
        data: () => ({
            categories: [],
            breadcrumbs: [],
            valid: false,
            embedding_type_select: 'sent2vec_dist',
            embedding_type_items: [
                'sent2vec_dist',
                'sent2vec_sim',
                'sent2vec_vec'
            ],
            embedding_method_select: 'kmeans',
            embedding_method_items: [
                'kmeans'
            ],
            clusters_count_select: 7,
            topics_per_cluster_select: 3,
            save_data_checkbox: false


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
            clusters_count_rules (value) {
                if (value == null) {
                    return "Invalid value"
                }
                else if (value > 2 && value < 20){
                    return true
                }
                else {
                    return "Invalid value"
                }
            },
            topics_per_cluster_rules (value) {
                if (value == null) {
                    return "Invalid value"
                }
                else if (value > 1 && value < 6){
                    return true
                }
                else {
                    return "Invalid value"
                }
            },
            async onSimilarityClicked () {
                const config = {
                    embedding_method: this.embedding_method_select,
                    cluster_method: this.cluster_method_select,
                    clusters_count: this.clusters_count_select,
                    save_data: this.save_data_checkbox,
                    topics_per_cluster: this.topics_per_cluster_select,
                    categories: this.categories
                }
                const response = await Experiment_service.cluster_sentences(config)
                console.log(response.data)
            }
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
