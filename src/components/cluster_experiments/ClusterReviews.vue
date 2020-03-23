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
          max-width="600"
          class="ml-4"
        >
        <v-card>
            <v-card-title class="blue white--text headline">
              Cluster menu
            </v-card-title>
            <div>
                Selected category <b>{{cluster_category}}</b>
            </div>

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
            search: null,
            cluster_dialog_menu: null,
            cluster_category: null,
            caseSensitive: false,
            products: [],
            breadcrumbs: [],
            active: [],
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
            ],
            peek_sentences_alert: false


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
               async loadProducts (category) {
                const response =  await ProductService.get_products(category)
                this.products = response.data

            },
            onClusterDialogMenuClicked (category,){
                this.cluster_category = category
                this.cluster_dialog_menu = true
            },
            async onSimilarityClicked () {
                const config = {
                    embedding_method: this.embedding_type_select,
                    cluster_method: this.cluster_method_select,
                    clusters_pos_count: Number(this.clusters_pos_count_select),
                    clusters_con_count: Number(this.clusters_con_count_select),
                    save_data: this.save_data_checkbox,
                    topics_per_cluster: Number(this.topics_per_cluster_select),
                    category: this.cluster_category
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
                    category: this.cluster_category
                };
                try {
                    this.cluster_dialog_menu = false
                    const response = await Experiment_service.peek_sentences(config)
                    console.log(response.data)
                    this.con = response.data.con
                    this.pos = response.data.pos
                    this.peek_sentences_alert = true
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
          },
        computed: {
          filter () {
            return this.caseSensitive
              ? (item, search, textKey) => item[textKey].indexOf(search) > -1
              : undefined
          },
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

</style>
