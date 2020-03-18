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
                          No category selected.
                        </template>
                        <template v-else>
                          Selected category '{{categories[0]}}'
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
                        <v-row>
                            <v-col>
                                <v-text-field
                                  v-model="clusters_pos_count_select"
                                  type="number"
                                  label="Count of positive clusters"
                                  :rules="[ clusters_count_rules ]"
                                />
                            </v-col>
                            <v-col>
                                <v-text-field
                                  v-model="clusters_con_count_select"
                                  type="number"
                                  label="Count of negative clusters"
                                  :rules="[ clusters_count_rules ]"
                                />
                            </v-col>
                        </v-row>

                         <v-text-field
                          v-model="topics_per_cluster_select"
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
                        <v-col>
                            <v-btn
                                dark
                                class="cyan"
                                :disabled="!valid"
                                @click="onSimilarityClicked">
                                Similarity
                              </v-btn>
                        </v-col>
                        <v-col>
                            <v-btn
                                dark
                                class="cyan"
                                :disabled="!valid"
                                @click="onPeekCount">
                                Peek count
                              </v-btn>
                        </v-col>
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
                          Positive reviews clusters
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
                             :data="chartData_pos"
                             :options="chartOptions"
                         />
                    </v-card>

                </v-col>
                <v-col>
                    <v-card
                        max-width="600"
                    >
                        <v-card-title class="indigo white--text headline">
                          Negative reviews clusters
                        </v-card-title>
                        <h2>Sentences: {{con.sentences_count}}</h2>
                        <v-col>
                            <v-data-table
                            :hide-default-footer="true"
                            :headers="headers"
                            :items="con.clusters"
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
                             :data="chartData_con"
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
        <v-dialog
          v-model="cluster_dialog"
          max-width="800"
          class="ml-4 scroll-y"
          style="overflow-y: auto;max-height: 700px"
        >
            <v-card-title class="blue white--text headline">
              Sentences view
            </v-card-title>
           <v-col>
               <v-data-table
                 :items-per-page="cluster_items_per_page"
                 :headers="cluster_headers"
                 :items="cluster_dialog_data.sentences"
                 class="elevation-1"
                >
           </v-data-table>
           </v-col>
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
            clusters_pos_count_select: 7,
            clusters_con_count_select: 4,
            topics_per_cluster_select: 3,
            save_data_checkbox: true,
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
            chartData_pos: [],
            chartData_con: [],
            chartOptions: {
                legend: { position: 'none' },
                title: 'Sentences per cluster',
          },
            cluster_dialog: false,
            cluster_dialog_data: {},
            cluster_items_per_page: 10,
            cluster_headers:[
                {
                    text: 'Sentences',
                    value: 'sentence',
                }
            ]


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
                if (this.categories.length > 1){
                    this.alert_text = "Just one category"
                    this.alert_code = "400"
                    this.alert = true
                    return
                }
                const config = {
                    embedding_method: this.embedding_type_select,
                    cluster_method: this.cluster_method_select,
                    clusters_pos_count: this.clusters_pos_count_select,
                    clusters_con_count: this.clusters_con_count_select,
                    save_data: this.save_data_checkbox,
                    topics_per_cluster: this.topics_per_cluster_select,
                    category: this.categories[0]
                };
                try {
                    const response = await Experiment_service.cluster_sentences(config)

                    var arr_pos = [['Cluster', 'sentences_count']]
                    var arr_con = [['Cluster', 'sentences_count']]
                    this.pos = response.data.pos
                    this.pos.clusters.forEach(function (item) {
                        arr_pos.push(['Cluster_'+ item.cluster_number, item.cluster_sentences_count])
                    })
                    this.chartData_pos = arr_pos

                    this.con = response.data.con
                    this.con.clusters.forEach(function (item) {
                        arr_con.push(['Cluster_'+ item.cluster_number, item.cluster_sentences_count])
                    })
                    this.chartData_con = arr_con
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
            async onPeekCount () {
                const config = {
                    category: this.categories[0]
                };
                if (this.categories.length > 1){
                    this.alert_text = "Just one category"
                    this.alert_code = "400"
                    this.alert = true
                    return
                }
                try {
                    const response = await Experiment_service.peek_sentences(config)
                    this.con = response.data.con
                    this.pos = response.data.pos

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
                this.cluster_dialog_data = value
                this.cluster_items_per_page=value.sentences.length
                this.cluster_dialog = true
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
