<template>
    <v-container fluid>
        <v-card>
            <v-card-title class="indigo white--text headline">
                <span v-if="experiment.product_name">Similarity clustering for product  '{{ experiment.product_name }}'</span>
                <span v-else>Similarity clustering for category  '{{ experiment.category }}'</span>
            </v-card-title>
            <v-row>
                <v-col>
                    <v-card
                    >
                        <v-card-title class="indigo white--text headline">
                          Positive reviews clusters
                        </v-card-title>
                        <h2>Sentences: {{experiment.pos.sentences_count}}</h2>
                        <v-col>
                            <v-data-table
                            :hide-default-footer="true"
                            :headers="headers"
                            :items="experiment.pos.clusters"
                            class="elevation-1"
                            >
                              <template v-slot:item.cluster_name="{ item }" >
                                  {{item.cluster_name}}
                                  <v-icon
                                        @click="onClusterEdit(item)"
                                        >
                                    edit
                                  </v-icon>
                                  <v-icon
                                        @click="onClusterMerge(item)"
                                        >
                                    merge_type
                                  </v-icon>
                              </template>
                              <template v-slot:item.topics="{ item }" >
                                  <template v-for="(topic, index) in item.topics">
                                    <div v-bind:key="index">
                                        {{topic}}
                                        <v-icon
                                            @click="onTopicClicked(item, index)"
                                            >
                                        link
                                        </v-icon>
                                        <v-icon
                                            @click="onClusterTopicEdit(item, topic, index)"
                                            >
                                        edit
                                        </v-icon>
                                    </div>
                                  </template>
                              </template>
                        </v-data-table>

                        </v-col>
                        <v-divider vertical></v-divider>
                         <GChart
                             type="ColumnChart"
                             :data="experiment.chartData_pos"
                             :options="chartOptions"
                         />
                    </v-card>

                    <v-card
                    >
                        <v-card-title class="indigo white--text headline">
                          Negative reviews clusters
                        </v-card-title>
                        <h2>Sentences: {{experiment.con.sentences_count}}</h2>
                        <v-col>
                            <v-data-table
                            :hide-default-footer="true"
                            :headers="headers"
                            :items="experiment.con.clusters"
                            class="elevation-1"
                            >
                              <template v-slot:item.cluster_name="{ item }" >
                                  {{item.cluster_name}}
                                  <v-icon
                                        @click="onClusterEdit(item)"
                                        >
                                    edit
                                  </v-icon>
                                  <v-icon
                                        @click="onClusterMerge(item)"
                                        >
                                    merge_type
                                  </v-icon>
                              </template>
                              <template v-slot:item.topics="{ item }" >
                                  <template v-for="(topic, index) in item.topics">
                                    <div v-bind:key="index">
                                        {{topic}}
                                        <v-icon
                                            @click="onTopicClicked(item, index)"
                                            >
                                        link
                                        </v-icon>
                                        <v-icon
                                            @click="onClusterTopicEdit(item, topic, index)"
                                            >
                                        edit
                                        </v-icon>
                                    </div>
                                  </template>
                              </template>
                        </v-data-table>
                        </v-col>
                        <v-divider vertical></v-divider>
                         <GChart
                             type="ColumnChart"
                             :data="experiment.chartData_con"
                             :options="chartOptions"
                         />
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
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
                 :items="cluster_dialog_data_sentences"
                 class="elevation-1"
                 :hide-default-footer="true"
                >
           </v-data-table>
           </v-col>
        </v-dialog>
        <v-dialog
          v-model="cluster_edit_dialog"
          max-width="300"
          class="ml-4 scroll-y"
          style="overflow-y: auto;max-height: 700px"
        >
            <v-card>
                <v-card-title class="blue white--text headline">
                Edit cluster {{cluster_edit_data.cluster_name}}
                </v-card-title>
                <v-form
                    ref="form"
                    v-model="cluster_edit_valid"
                    lazy-validation
                    >
                    <v-text-field
                      v-model="cluster_edit_data.cluster_name"
                      type="text"
                      label="cluster_name"
                    />
                    <v-btn
                        dark
                        class="cyan"
                        :disabled="!cluster_edit_valid"
                        @click="onClusterSaveClicked">
                        Rename
                      </v-btn>
                </v-form>
            </v-card>
        </v-dialog>
        <v-dialog
          v-model="cluster_topic_edit_valid"
          max-width="300"
          class="ml-4 scroll-y"
          style="overflow-y: auto;max-height: 700px"
        >
            <v-card>
                <v-card-title class="blue white--text headline">
                    <div>
                        Cluster {{cluster_edit_data.cluster_name}}
                    </div>
                    <div>
                        Edit topic {{cluster_topic_name}}
                    </div>
                </v-card-title>
                <v-form
                    ref="form"
                    v-model="cluster_edit_valid"
                    lazy-validation
                    >
                    <v-text-field
                      v-model="cluster_topic_name"
                      type="text"
                      label="topic name"
                    />
                    <v-btn
                        dark
                        class="cyan"
                        :disabled="!cluster_edit_valid"
                        @click="onSaveClusterTopicClicked">
                        Rename
                      </v-btn>
                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog
          v-model="cluster_merge_dialog"
          class="ml-4"
          max-width="300"
        >
            <v-card>
                <v-card-title class="blue white--text headline">
                    <div>
                        Merge cluster {{cluster_edit_data.cluster_name}}
                    </div>
                </v-card-title>
                <v-form
                    ref="form"
                    v-model="cluster_edit_valid"
                    lazy-validation
                    >
                    <v-select
                      v-model="merge_cluster_selected"
                      :items="merge_cluster_items"
                      :rules="[ clusters_merge_rules ]"
                      label="Select cluster"
                      required
                    >
                      <template v-slot:selection="{ item }" >
                        {{item.cluster_name}}
                      </template>
                        <template v-slot:item="{ item }" >
                            {{item.cluster_name}}
                        </template>
                    </v-select>
                    <v-btn
                        dark
                        class="cyan"
                        :disabled="!cluster_edit_valid"
                        @click="onClusterMergeClicked">
                        Merge
                      </v-btn>
                </v-form>
            </v-card>
        </v-dialog>
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
    import { GChart } from 'vue-google-charts'
    import Experiment_service from "../../services/Experiment_service";

    export default {
        components: {GChart},
        name: "ExperimentClusterEditView",
        props: ['category'],
        data: () => ({
            experiment: null,
            headers:[
                {
                    text: 'Cluster_name',
                    value: 'cluster_name',
                },
                {
                    text: 'Topics',
                    value: 'topics'
                },
                {
                    text: 'Sentences',
                    value: 'cluster_sentences_count'
                }
            ],
            chartOptions: {
                legend: { position: 'none' },
                title: 'Sentences per cluster',
          },
            cluster_dialog: false,
            cluster_dialog_data_sentences: {},
            cluster_items_per_page: 10,
            cluster_headers:[
                {
                    text: 'Sentences',
                    value: 'sentence',
                }
            ],
            cluster_edit_dialog: false,
            cluster_edit_data: {},
            cluster_edit_valid: false,
            cluster_topic_edit_valid: false,
            cluster_topic_name: '',
            cluster_topic_index: 0,
            alert:false,
            alert_text: '',
            alert_code: 200,
            cluster_merge_dialog: false,
            merge_cluster_selected: {},
            merge_cluster_items: []
        }),
        methods: {
            onTopicClicked (value, index) {
                console.log(value)
                console.log(index)
                const sentences = []
                value.sentences.forEach(function (item) {
                    if (item.topic_number === index) {
                         sentences.push(item)
                    }
                })
                this.cluster_dialog_data_sentences = sentences
                this.cluster_items_per_page=sentences.length
                this.cluster_dialog = true
            },
            onClusterEdit(value) {
                console.log(value)
                this.cluster_edit_data = value

                this.cluster_edit_dialog = true
            },
            onClusterTopicEdit(cluster, topic, index) {
                console.log(topic)
                this.cluster_topic_name = topic
                this.cluster_topic_index = index
                this.cluster_edit_data = cluster
                this.cluster_topic_edit_valid = true
            },
            async onClusterSaveClicked() {
                console.log(this.cluster_edit_data)
                const req = {
                    cluster_id: this.cluster_edit_data._id,
                    cluster_name: this.cluster_edit_data.cluster_name,
                    category: this.experiment.category
                 }

                try {
                    await Experiment_service.update_cluster_name(req)
                    this.getExperimentSentences()
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

                this.cluster_edit_dialog = false
            },
            async onSaveClusterTopicClicked() {
                this.cluster_edit_data.topics[this.cluster_topic_index] = this.cluster_topic_name
                const config = {
                    cluster_id: this.cluster_edit_data._id,
                    topics: this.cluster_edit_data.topics,
                    category: this.experiment.category
                }
                try {
                    await Experiment_service.update_topic_name(config)
                    this.getExperimentSentences()
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

                this.cluster_topic_edit_valid = false
            },
            onClusterMerge(cluster) {
                this.cluster_edit_data = cluster
                this.merge_cluster_items = []
                if (cluster['type'] === "pos") {
                    this.merge_cluster_items = this.experiment.pos.clusters
                }
                else {
                    this.merge_cluster_items = this.experiment.con.clusters
                }
                this.cluster_merge_dialog = true
            },
            async onClusterMergeClicked () {
                const config = {
                    cluster_from: {
                        _id: this.cluster_edit_data['_id'],
                        cluster_sentences_count: this.cluster_edit_data['cluster_sentences_count'],
                        topics: this.cluster_edit_data['topics'],
                        cluster_name: this.cluster_edit_data['cluster_name'],
                        type: this.cluster_edit_data['type'],
                        experiment_id: this.cluster_edit_data['experiment_id'],
                    },
                    cluster_to: {
                        _id: this.merge_cluster_selected['_id'],
                        cluster_sentences_count: this.merge_cluster_selected['cluster_sentences_count'],
                        topics: this.merge_cluster_selected['topics'],
                        cluster_name: this.merge_cluster_selected['cluster_name'],
                        type: this.merge_cluster_selected['type'],
                        experiment_id: this.cluster_edit_data['experiment_id'],
                    }
                }

                try {
                    console.log(config)
                    await Experiment_service.cluster_merge(config)
                    this.getExperimentSentences()
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
            clusters_merge_rules(item) {
                if (item == null) {
                    return "Invalid value"
                }
                else if (item.cluster_name === this.cluster_edit_data.cluster_name){
                    return "The same cluster"
                }
                else {
                    return true
                }
            },
            async getExperimentSentences(){
                console.log(this.category)
                const config = {
                    category: this.category
                }
                const response = await Experiment_service.get_experiment_sentences(config)
                this.experiment = response.data
                this.experiment.category = this.category
                var arr_pos = [['Cluster', 'sentences_count']]
                var arr_con = [['Cluster', 'sentences_count']]
                this.experiment.pos.clusters.forEach(function (item) {
                    arr_pos.push([item.cluster_name, item.cluster_sentences_count])
                })
                this.experiment.chartData_pos = arr_pos

                this.experiment.con.clusters.forEach(function (item) {
                    arr_con.push([item.cluster_name, item.cluster_sentences_count])
                })
                this.experiment.chartData_con = arr_con
                },
        },
        beforeMount() {
            this.getExperimentSentences()

        },
        mounted() {
        }
    }
</script>

<style scoped>
</style>
