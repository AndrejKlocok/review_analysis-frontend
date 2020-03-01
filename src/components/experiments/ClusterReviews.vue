<template>
    <v-container fluid>
        <v-col>
            <ExperimentsBrowse></ExperimentsBrowse>
            <h1>Cluster simillar sentences</h1>
            <v-card
            class="mx-auto"
            max-height="800"
            tile>
                <v-row>
                    <v-col>
                      <v-treeview
                        v-model="categories"
                        dense
                        :items="breadcrumbs"
                        activatable
                        item-key="name"
                        open-on-click
                        selectable
                        class="ml-4 scroll-y"
                        style="overflow-y: auto;max-height: 700px"
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
                          v-model="cluster_method_select"
                          :items="cluster_method_items"
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
            <v-row>
                <v-col>
                    <v-card
                        max-width="600"
                    >
                        <v-card-title class="indigo white--text headline">
                          Positive reviews clusters,
                        </v-card-title>
                        <h2>Sentences: {{pos.sentences_count}}</h2>
                        <v-col>
                            <v-data-table
                            :hide-default-footer="true"
                            :headers="headers"
                            :items="pos.clusters"
                            @click:row="onClusterClicked"
                            class="elevation-1"
                            >
                          <template v-slot:item.topics="{ item }" >
                              <template v-for="topic in item.topics">
                                <div v-bind:key="topic"> {{topic}} </div>
                              </template>
                          </template>
                        </v-data-table>
                        </v-col>
                        <v-divider vertical></v-divider>
                         <GChart
                             type="ColumnChart"
                             :data="chartData"
                             :options="chartOptions"
                         />

                    </v-card>

                </v-col>

            </v-row>
        </v-col>
        <v-dialog
          v-model="alert"
          max-width="300"
        >
           <v-card>
             <v-card-title class="red white--text headline">
              API Error - {{alert_code}}
            </v-card-title>
             <v-card-text>
                 <h3>{{alert_text}}</h3>
             </v-card-text>
           </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import ProductService from "../../services/ProductService"
    import Experiment_service from "../../services/Experiment_service"
    import ExperimentsBrowse from "./ExperimentsBrowse"
    import { GChart } from 'vue-google-charts'

    export default {
        components: {ExperimentsBrowse, GChart},
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
            cluster_method_select: 'kmeans',
            cluster_method_items: [
                'kmeans'
            ],
            clusters_count_select: 7,
            topics_per_cluster_select: 3,
            save_data_checkbox: false,
            alert: false,
            alert_text: '',
            alert_code: 200,

            headers:[
                {
                    text: 'Cluster_number',
                    value: 'cluster_number',
                },
                {
                    text: 'Sentences count',
                    value: 'cluster_sentences_count'
                },
                {
                    text: 'Topics',
                    value: 'topics'
                }
            ],
            pos: [

            ],
            con: [

            ],
            chartData: [],
            chartOptions: {
                legend: { position: 'none' },
                title: 'Sentences per cluster',
          }


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
                    embedding_method: this.embedding_type_select,
                    cluster_method: this.cluster_method_select,
                    clusters_count: this.clusters_count_select,
                    save_data: this.save_data_checkbox,
                    topics_per_cluster: this.topics_per_cluster_select,
                    categories: this.categories
                };
                try {
                    const response = await Experiment_service.cluster_sentences(config)

                    var arr = [['Cluster', 'sentences_count']]
                    this.pos = response.data.pos
                    this.pos.clusters.forEach(function (item) {
                        arr.push(['Cluster_'+ item.cluster_number, item.cluster_sentences_count])
                    })
                    console.log(arr)
                    this.chartData = arr
                    this.con = response.data.con
                }
                catch (error) {
                    if (error.response){
                        // other then 2xx
                        this.alert_text = error.response.data.error
                        this.alert_code = error.response.data.error_code
                        this.alert = true
                        console.log(error.response.data)
                        console.log(error.response.status)
                        console.log(error.response.headers)
                    }
                    else if (error.request) {
                        //timeout
                        console.log(error.request);
                    } else {
                        // Something happened in setting up the request and triggered an Error
                        console.log('Error', error.message);
                    }
                }
            },
            onClusterClicked (value) {
                console.log(value)
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
