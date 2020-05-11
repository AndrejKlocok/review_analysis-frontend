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
                        <v-sheet class="pa-4 primary lighten-2">
                            <v-text-field
                            v-model="search"
                            label="Search Category"
                            dark
                            flat
                            solo-inverted
                            hide-details
                            clearable
                            clear-icon="mdi-close-circle-outline"
                          ></v-text-field>
                          <v-checkbox
                            v-model="caseSensitive"
                            dark
                            hide-details
                            label="Case sensitive search"
                          ></v-checkbox>
                        </v-sheet>
                          <v-treeview
                          dense
                          :active.sync="active"
                          :search="search"
                          :filter="filter"
                          :items="breadcrumbs"
                          activatable
                          item-key="name"
                          open-on-click
                          transition
                          color="warning"
                          class="ml-4 scroll-y"
                          style="overflow-y: auto;max-height: 600px"
                        >
                        <template v-slot:prepend="{item}">
                        <v-icon v-if="!item.children">mdi-account</v-icon>
                      </template>
                  </v-treeview>
                </v-col>
                <v-divider vertical></v-divider>
                <v-divider vertical></v-divider>
        <v-col
            class="d-flex text-center"
            >
            <v-scroll-y-transition mode="out-in">
                <div
                    v-if="!selected"
                    class="title grey--text text--lighten-1 font-weight-light"
                    style="align-self: center;"
                  >
                    Select category
                </div>
                <v-card
                    v-else
                    :key="selected.name"
                    flat
                    max-width="400"
                    class="pt-6 mx-auto scroll-y"
                    style="overflow-y: auto;max-height: 750px"
                >
                    <v-card-text>
                        <h2 class="headline mb-2"> Category: {{ selected.name }}</h2>
                        <h2 class="headline mb-2"> Count of products: {{ products.total_products }}</h2>
                        <h2 class="headline mb-2"> Count of reviews: {{ products.total_reviews }}</h2>
                    </v-card-text>
                    <v-btn
                        dark
                        class="cyan"
                        @click="onClusterDialogMenuClicked(selected.name)">
                        Cluster category
                      </v-btn>
                    <v-list subheader>
                      <v-subheader>Products </v-subheader>

                      <v-list-item two-line
                        v-for="item in products.products"
                        :key="item.product_name"
                        @click="onClusterDialogMenuClicked(item.product_name)"
                      >
                        <v-list-item-content>
                          <div v-if="item.product_name">
                              <v-list-item-title v-text="item.product_name"></v-list-item-title>
                          </div>
                          <div v-else>
                              <v-list-item-title v-text="item.name"></v-list-item-title>
                          </div>
                          <v-list-item-subtitle> reviews: {{item.reviews_len}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                </v-card>
            </v-scroll-y-transition>
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
        <v-dialog
          v-model="cluster_dialog_menu"
          max-width="400"
          class="mx-4"
          style="overflow-y: unset"
        >
        <v-card
        style="overflow-y: unset"
            >
            <v-card-title class="blue white--text headline">
              Cluster menu
            </v-card-title>
            <div>
                Selected category <b>{{cluster_category}}</b>
            </div>
            <v-flex shrink class="select">
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
                  v-model="embedding_model_select"
                  :items="embedding_model_items"
                  :rules="[v => !!v || 'Item is required']"
                  label="Embedding model"
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
                    </v-form>
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
            </v-flex>
        </v-card>
        </v-dialog>
        <v-dialog
          v-model="peek_sentences_alert"
          max-width="300"
        >
           <v-card>
             <v-card-title class="blue white--text headline">
              Peek sentences
             </v-card-title>
             <v-simple-table
              >
               <template v-slot:default>
                <tbody>
                  <tr>
                    <td><h3>Positive sentences count</h3></td>
                    <td>{{pos.sentences_count}}</td>
                  </tr>
                  <tr>
                    <td><h3>Negative sentences count</h3></td>
                    <td>{{con.sentences_count}}</td>
                  </tr>
                </tbody>
              </template>
          </v-simple-table>
           </v-card>
        </v-dialog>
        <v-dialog
          v-model="loading_data"
          max-width="600"
            >
           <v-card>
             <v-card-title class="blue white--text headline">
              Clustering of {{cluster_category}} in progress
            </v-card-title>
               <v-progress-circular
              :size="70"
              :width="7"
              color="purple"
              indeterminate
            ></v-progress-circular>
               <v-card-text>
                   <div>
                        Clustering is performed on backend site. Unfortunately it takes time.
                   </div>
               </v-card-text>
               <v-simple-table
                  >
                   <template v-slot:default>
                    <tbody>
                      <tr>
                        <td>Positive sentences</td>
                        <td>{{peek_pos_cnt}}</td>
                      </tr>
                      <tr>
                        <td>Negative sentences</td>
                        <td>{{peek_con_cnt}}</td>
                      </tr>
                      <tr>
                        <td>Embedding method</td>
                        <td>{{embedding_type_select}}</td>
                      </tr>
                      <tr>
                        <td>Cluster method</td>
                        <td>{{cluster_method_select}}</td>
                      </tr>
                      <tr>
                        <td>Positive clusters selected</td>
                        <td>{{clusters_pos_count_select}}</td>
                      </tr>
                      <tr>
                        <td>Negative clusters selected</td>
                        <td>{{clusters_con_count_select}}</td>
                      </tr>
                    </tbody>
                  </template>
              </v-simple-table>
           </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import ProductService from "../../services/ProductService"
    import Experiment_service from "../../services/Experiment_service"
    import ExperimentsBrowse from "./ExperimentsBrowse"
    import { GChart } from 'vue-google-charts'
    import EventBus from "../../services/events";

    export default {
        components: {ExperimentsBrowse, GChart},
        data: () => ({
            search: null,
            cluster_dialog_menu: null,
            cluster_category: null,
            caseSensitive: false,
            products: [],
            breadcrumbs: [],
            active: [],
            valid: false,
            embedding_type_select: 'fse_dist',
            embedding_type_items: [
                'fse_dist',
                'fse_sim',
                'fse_vec'
            ],
            embedding_model_select: 'FastText_300d',
            embedding_model_items: [
                'FastText_pretrained',
                'FastText_300d',
            ],
            cluster_method_select: 'kmeans',
            cluster_method_items: [
                'kmeans'
            ],
            clusters_pos_count_select: 7,
            clusters_con_count_select: 4,
            topics_per_cluster_select: 3,
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
            ],
            peek_sentences_alert: false,
            loading_data: false,
            peek_pos_cnt: 0,
            peek_con_cnt: 0,
        }),
        methods: {
            async loadBreadCrumbs () {
              /**
               Get breadcrumb path for products/shops
               */
              try {
                const response = await ProductService.get_index_categories(this.$store.state.jwt)
                this.breadcrumbs = response.data
                // save data to store
                this.$store.commit('SET_INDEX_CATs', response.data)

              } catch (error) {
                if (error.response) {
                  if(error.response.status === 401){
                    EventBus.$emit('USER_LOGGED_OUT', error.response.data)
                  }
                }
              }
            },
            /**
             * Defined rules for count of clusters.
             * @param value input data
             */
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
            /**
             * Defined rules for count of topics per cluster.
             * @param value
             */
            topics_per_cluster_rules (value) {
                if (value == null) {
                    return "Invalid value"
                }
                else if (value >= 1 && value < 6){
                    return true
                }
                else {
                    return "Invalid value"
                }
            },
            /**
             * Load products of category.
             * @param category name of category
             */
            async loadProducts (category) {
                try{
                    const response =  await ProductService.get_products(category, this.$store.state.jwt)
                    this.products = response.data
                } catch (error) {
                    if (error.response){
                        // other then 2xx
                        if(error.response.status === 401){
                            EventBus.$emit('USER_LOGGED_OUT', error.response.data)
                        }
                    }
                }
            },
            /**
             * Handler for opening cluster dialog
             * @param category category object
             */
            onClusterDialogMenuClicked (category){
                this.cluster_category = category
                this.cluster_dialog_menu = true
            },
            /**
             * Perform similarity clustering on backend site.
             * @returns {Promise<void>}
             */
            async onSimilarityClicked () {
                // configuration object that will be sent
                const config = {
                    embedding_method: this.embedding_type_select,
                    embedding_model: this.embedding_model_select,
                    cluster_method: this.cluster_method_select,
                    clusters_pos_count: Number(this.clusters_pos_count_select),
                    clusters_con_count: Number(this.clusters_con_count_select),
                    topics_per_cluster: Number(this.topics_per_cluster_select),
                    category: this.cluster_category
                };
                this.cluster_dialog_menu = false

                try {
                    // peek for sentences of clustering similarity
                    const response_peek = await Experiment_service.peek_sentences({
                        category: this.cluster_category
                    }, this.$store.state.jwt)
                    this.peek_con_cnt = response_peek.data.con.sentences_count
                    this.peek_pos_cnt = response_peek.data.pos.sentences_count

                    // show loading data dialog
                    this.loading_data = true
                    try {
                        // wait for clustering to be done
                        const response = await Experiment_service.cluster_sentences(config, this.$store.state.jwt)

                        // show statistics of clustering after
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
                        this.loading_data = false
                    } catch (error) {
                        // handle errors
                        if (error.response){
                          if(error.response.status === 401){
                            EventBus.$emit('USER_LOGGED_OUT', error.response.data)
                          }
                        }
                    }
                }
                catch (error) {
                    // peek sentences error handle
                    this.loading_data = false
                    if (error.response) {
                        // other then 2xx
                        this.alert_text = error.response.data.error
                        this.alert_code = error.response.data.error_code
                        this.alert = true
                        console.log(error.response.data)
                        console.log(error.response.status)
                        console.log(error.response.headers)
                    } else if (error.request) {
                        //timeout
                        console.log(error.request);
                    } else {
                        // Something happened in setting up the request and triggered an Error
                        console.log('Error', error.message);
                    }
                }
                this.peek_pos_cnt = 0
                this.peek_con_cnt = 0
            },
            /**
             * Peek for sentences of similarity clustering.
             * @returns {Promise<void>}
             */
            async onPeekCount () {
                const config = {
                    category: this.cluster_category
                }
                try {
                    // close clustering dialog and wait for data
                    this.cluster_dialog_menu = false
                    const response = await Experiment_service.peek_sentences(config, this.$store.state.jwt)
                    console.log(response.data)
                    this.con = response.data.con
                    this.pos = response.data.pos
                    this.peek_sentences_alert = true
                }
                catch (error) {
                    // error handle
                    if (error.response){
                        if(error.response.status === 401) {
                            EventBus.$emit('USER_LOGGED_OUT', error.response.data)
                        } else{
                            this.alert_text = error.response.data.error
                            this.alert_code = error.response.data.error_code
                            this.alert = true
                        }
                    }
                    else {
                        // Something happened in setting up the request and triggered an Error
                        console.log('Error', error.message);
                    }
                }

            },
            /**
             * Cluster click handle shows sentences of cluster
             * @param value
             */
            onClusterClicked (value) {
                this.cluster_dialog_data = value
                this.cluster_items_per_page=value.sentences.length
                this.cluster_dialog = true
            }
        },
          beforeMount () {
            // load breadcrumbs from store
            if (this.$store.state.index_categories[0]) {
              console.log('store')
              this.breadcrumbs = this.$store.state.index_categories
              console.log(this.breadcrumbs)
            } else {
              console.log('loadBreadCrumbs')
              this.loadBreadCrumbs()
            }
          },
        computed: {
            /**
             * Filter for breadcrumbs
             * @returns {*}
             */
            filter () {
                return this.caseSensitive
                  ? (item, search, textKey) => item[textKey].indexOf(search) > -1
                  : undefined
              },
            /**
             * Select
             * @returns {{name: *}|undefined}
             */
            selected () {
                 const name = this.active[0]
                 if(name == null) return undefined
                 var l = name.split(' ')
                 this.loadProducts(name)

                 var o = {
                     name: l[0]
                 }
                 return o
            },
        }
    }
</script>

<style scoped>
.v-select__selections input {
    display: none;
    width: 0;
    max-width: none;
}
.select {
    min-width: 100px;
}
.v-select.v-input--is-dirty input {
  display: none;
}
</style>
