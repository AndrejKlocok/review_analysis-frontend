<template>
    <v-container fluid>
        <v-card>
            <v-card-title class="indigo white--text headline">
               <span>Similarity clustering for '{{ experiment.category }}'</span>
                <v-icon @click="onHelpClicked()"
                color="white"
                >
                info
                </v-icon>
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
                                        color="brown"
                                        >
                                    edit
                                  </v-icon>
                                  <v-icon
                                    @click="onSentencesEdit(item)"
                                    color="orange"
                                    >
                                  settings
                                  </v-icon>
                              </template>
                              <template v-slot:item.topics="{ item }" >
                                  <template v-for="(topic, index) in item.topics">
                                    <div v-bind:key="index">
                                        {{topic.name}}
                                        <v-icon
                                            @click="onTopicClicked(item, topic)"
                                            >
                                        link
                                        </v-icon>
                                        <v-icon
                                            @click="onClusterTopicEdit(item, topic, index)"
                                            color="brown"
                                        >
                                        edit
                                        </v-icon>
                                    </div>
                                  </template>
                              </template>
                        </v-data-table>
                        <v-btn rounded color="green"
                             dark
                             @click="onCreateClusterDialogClicked('pos')"
                              >
                          Create Cluster
                        </v-btn>
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
                                        color="brown"
                                        >
                                    edit
                                  </v-icon>
                                  <v-icon
                                    @click="onSentencesEdit(item)"
                                    color="orange"
                                    >
                                  settings
                                  </v-icon>
                              </template>
                              <template v-slot:item.topics="{ item }" >
                                  <template v-for="(topic, index) in item.topics">
                                    <div v-bind:key="index">
                                        {{topic.name}}
                                        <v-icon
                                            @click="onTopicClicked(item, topic)"
                                            >
                                        link
                                        </v-icon>
                                        <v-icon
                                            @click="onClusterTopicEdit(item, topic, index)"
                                            color="brown"
                                        >
                                        edit
                                        </v-icon>
                                    </div>
                                  </template>
                              </template>
                        </v-data-table>
                        <v-btn rounded color="red"
                             dark
                             @click="onCreateClusterDialogClicked('con')"
                              >
                          Create Cluster
                        </v-btn>
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
            <v-card>
            <v-card-title class="blue white--text headline">
              Sentences view
            </v-card-title>
            <v-card-text>
                    <div>
                        Cluster <h2><b>{{cluster_edit_data.cluster_name}}</b></h2>
                    </div>
                    <div>
                        Topic <h3><b>{{cluster_topic_name}}({{cluster_items_per_page}})</b></h3>
                    </div>
                </v-card-text>
               <v-data-table
                 :items-per-page="cluster_items_per_page"
                 :headers="cluster_headers"
                 :items="cluster_dialog_data_sentences"
                 class="elevation-1"
                 :hide-default-footer="true"
                >
           </v-data-table>

            </v-card>
        </v-dialog>
        <v-dialog
          v-model="cluster_edit_dialog"
          max-width="300"
          class="ml-4"
          style="overflow-y: auto;max-height: 700px"
        >
            <v-card>
                <v-card-title class="blue white--text headline">
                    Edit cluster
                </v-card-title>
                <v-card-text>
                    <h2>
                        {{cluster_edit_data.cluster_name}}
                    </h2>
                </v-card-text>
                <v-card>
                    <v-card-title>
                        Rename cluster
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
                            :disabled="!cluster_topics"
                            @click="onClusterSaveClicked">
                            Rename
                        </v-btn>
                    </v-form>
                </v-card>
                <v-card>
                    <v-card-title>
                        Append topics
                    </v-card-title>
                    <v-form
                    ref="form"
                    v-model="cluster_edit_valid_save_topics"
                    lazy-validation
                    >
                    <h4>Topics to be added</h4>
                    <div
                        v-for="(item, i) in cluster_topics"
                        :key="i">
                        <v-simple-table>
                            <template v-slot:default>
                                <tbody>
                                  <tr>
                                    <td>Topic:</td>
                                    <td>{{item}}</td>
                                  </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </div>
                    <v-row>
                        <v-col>
                        <v-text-field
                          v-model="topic_name"
                          label="Topic_name"
                        />
                        </v-col>
                        <v-col>
                           <v-btn rounded color="primary"
                                 dark
                                 @click="addClusterTopic"
                                  >
                              Add topic
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-btn
                        dark
                        class="cyan"
                        :disabled="!cluster_edit_valid_save_topics"
                        @click="onClusterSaveTopicsClicked">
                        Save Topics
                    </v-btn>
                </v-form>
                </v-card>
                <v-card>
                <v-card-title>
                    <div>
                        Merge cluster
                    </div>
                </v-card-title>
                <v-form
                    ref="form"
                    v-model="cluster_edit_valid_merge_cluster"
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
                        :disabled="!cluster_edit_valid_merge_cluster"
                        @click="onClusterMergeClicked">
                        Merge
                      </v-btn>
                </v-form>
            </v-card>
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
                    Edit
                </v-card-title>
                <v-card-text>
                    <div>
                        Cluster <h2><b>{{cluster_edit_data.cluster_name}}</b></h2>
                    </div>
                    <div>
                        Edit topic <h3><b>{{cluster_topic_name}}</b></h3>
                    </div>
                </v-card-text>
                <v-card>
                    <v-card-title>
                        <div>
                            Topic name
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
                          :rules="[ topic_name_rules ]"
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
                <v-card>
                    <v-card-title>
                        <div>
                            Merge Topic
                        </div>
                    </v-card-title>
                    <v-form
                        ref="form"
                        v-model="cluster_topic_merge"
                        lazy-validation
                        >
                        <v-select
                          v-model="merge_cluster_selected"
                          :items="merge_cluster_items"
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
                        <v-select
                          v-model="merge_topic_selected"
                          :items="merge_cluster_selected.topics"
                          :rules="[ clusters_topic_rules ]"
                          label="Select topic"
                          required
                        >
                            <template v-slot:selection="{ item }" >
                            {{item.name}}
                          </template>
                        <template v-slot:item="{ item }" >
                            {{item.name}}
                        </template>
                        </v-select>
                        <v-btn
                            dark
                            class="cyan"
                            :disabled="!cluster_topic_merge"
                            @click="onClusterTopicMergeClicked">
                            Merge
                          </v-btn>
                    </v-form>
                </v-card>
            </v-card>
        </v-dialog>

        <v-dialog
          v-model="cluster_sentences_edit"
          class="ml-4"
          max-width="600"
        >
            <v-card>
                <v-card-title class="blue white--text headline">
                    <div>
                        Edit sentences in cluster
                    </div>
                </v-card-title>
                <v-card-text>
                    <h2>
                        {{cluster_edit_data.cluster_name}}
                    </h2>
                </v-card-text>
                   <v-data-table
                     :items-per-page="cluster_items_per_page"
                     :headers="cluster_headers_edit"
                     :items="cluster_edit_data.sentences"
                     class="elevation-1"
                     :hide-default-footer="true"
                    >
                    <template v-slot:item.sentence="{ item }" >
                      {{item.sentence}}
                      <v-icon
                            @click="onSentenceMergeDialogClicked(item)"
                        color="blue"
                      >
                        merge_type
                      </v-icon>
                  </template>
                </v-data-table>
            </v-card>
        </v-dialog>
        <v-dialog
          v-model="sentence_merge_dialog"
          class="ml-4"
          max-width="300"
        >
            <v-card>
                <v-card-title class="blue white--text headline">
                    <div>
                        Merge sentence
                    </div>
                </v-card-title>
                <v-card-text>
                    {{sentence_merge_data.sentence}}
                </v-card-text>
                <v-form
                    ref="form"
                    v-model="sentence_edit_valid"
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
                    <v-select
                      v-model="merge_topic_selected"
                      :items="merge_cluster_selected.topics"
                      :rules="[v => !!v || 'Item is required']"
                      label="Select topic"
                      required
                    >
                        <template v-slot:selection="{ item }" >
                            {{item.name}}
                          </template>
                        <template v-slot:item="{ item }" >
                            {{item.name}}
                        </template>
                    </v-select>
                    <v-btn
                        dark
                        class="cyan"
                        :disabled="!sentence_edit_valid"
                        @click="onSentenceMerge">
                        Merge
                      </v-btn>
                </v-form>
            </v-card>
        </v-dialog>
        <v-dialog
          v-model="create_cluster_dialog"
          max-width="300"
          class="ml-4"
        >
            <v-card>
               <v-card-title class="blue white--text headline">
              Create cluster
            </v-card-title>
                <v-form
                        ref="form"
                        v-model="create_cluster_form"
                        lazy-validation
                        >
                    <v-text-field
                          v-model="cluster_name"
                          label="Cluster_name"
                          :rules="[v => !!v || 'Item is required']"
                        />
                    <v-simple-table>
                            <template v-slot:default>
                                <tbody>
                                  <tr>
                                    <td>Cluster type:</td>
                                    <td>{{cluster_type_select}}</td>
                                  </tr>
                                </tbody>
                            </template>
                    </v-simple-table>
                    <div
                        v-for="(item, i) in cluster_topics"
                        :key="i">
                        <v-simple-table>
                            <template v-slot:default>
                                <tbody>
                                  <tr>
                                    <td>Topic:</td>
                                    <td>{{item}}</td>
                                  </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </div>
                    <v-row>
                        <v-col>
                        <v-text-field
                          v-model="topic_name"
                          label="Topic_name"
                        />
                        </v-col>
                        <v-col>
                           <v-btn rounded color="primary"
                                 dark
                                 @click="addClusterTopic"
                                  >
                              Add topic
                            </v-btn>
                        </v-col>
                    </v-row>


                    <v-btn rounded color="primary"
                         dark
                         @click="onCreateClusterClicked"
                          >
                      Create Cluster
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
        <v-dialog
          v-model="help_cluster"
          max-width="300"
            >
           <v-card>
             <v-card-title class="blue white--text headline">
              Help for clustering interface
            </v-card-title>
            <v-simple-table
              height=350
              >
               <template v-slot:default>
                <tbody>
                  <tr>
                    <td><v-icon large color="brown">edit</v-icon></td>
                    <td>Edit cluster/topic instance dialog</td>
                  </tr>
                  <tr>
                    <td><v-icon large color="orange">settings</v-icon></td>
                    <td>Move sentences between clusters and topics</td>
                  </tr>
                  <tr>
                    <td><v-icon large>link</v-icon></td>
                    <td>Show all sentences in topic of cluster</td>
                  </tr>
                  <tr>
                    <td><v-icon large color="blue">merge_type</v-icon></td>
                    <td>Open dialog to move sentence to other cluster and topic</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
           </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import { GChart } from 'vue-google-charts'
    import Experiment_service from "../../services/Experiment_service";
    import EventBus from "../../services/events";
    export default {
        components: {GChart},
        name: "ExperimentClusterEditView",
        props: ['category_prop'],
        data: () => ({
            experiment: {
                pos : {
                    sentences_count: []
                },
                con : {
                    sentences_count: []
                }
            },
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
            cluster_headers_edit:[
                {
                    text: 'Sentences',
                    value: 'sentence',
                },
                {
                    text: 'Topic',
                    value: 'topic_number',
                }
            ],
            cluster_edit_dialog: false,
            cluster_edit_data: {},
            cluster_edit_valid: false,
            cluster_topic_merge:false,
            cluster_edit_valid_save_topics: false,
            cluster_edit_valid_merge_cluster: false,
            cluster_topic_edit_valid: false,
            cluster_topic_name: '',
            cluster_topic_index: 0,
            alert:false,
            alert_text: '',
            alert_code: 200,
            cluster_merge_dialog: false,
            merge_cluster_selected: {},
            merge_cluster_items: [],
            cluster_sentences_edit: false,
            sentence_merge_dialog: false,
            sentence_edit_valid: false,
            sentence_merge_data: '',
            merge_topic_selected: '',
            create_cluster_dialog: false,
            create_cluster_form: false,
            form:false,
            cluster_name: '',
            topic_name: '',
            cluster_topics: [],
            cluster_topic_data: {},
            cluster_type_select: '',
            category: '',
            help_cluster: false,
        }),
        methods: {
            onCreateClusterDialogClicked (type) {
                    this.cluster_name = ''
                    this.cluster_topics = []
                    this.cluster_type_select = type
                    this.create_cluster_dialog = true
                },
                async onCreateClusterClicked () {
                        var cluster_number = this.experiment.pos.clusters.length + 1
                        if (this.cluster_type_select === 'con') {
                            cluster_number = this.experiment.con.clusters.length + 1
                        }
                        const req = {
                            experiment_id:this.experiment._id,
                            cluster_number: cluster_number,
                            type: this.cluster_type_select,
                            cluster_name: this.cluster_name,
                            topics: this.cluster_topics,
                        }

                        try {
                            const response = await Experiment_service.create_cluster(req)
                            console.log(response.data)
                            this.getExperimentSentences()
                            this.create_cluster_dialog=false
                        }
                        catch (error) {
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
                },
            addClusterTopic(){
              if (this.topic_name) {
                 this.cluster_topics.push(this.topic_name)
              this.topic_name = ''
              }
            },
            async onClusterSaveTopicsClicked() {
                const req = {
                    cluster_number: this.cluster_edit_data._id,
                    experiment_id: this.experiment._id,
                    topics: this.cluster_topics,
                }

                try {
                    const response = await Experiment_service.update_topics(req)
                    console.log(response.data)
                    this.getExperimentSentences()
                    this.cluster_edit_dialog = false
                }
                catch (error) {
                    this.cluster_edit_dialog = false
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
            },
            onTopicClicked (cluster, topic) {
                this.cluster_topic_data = topic
                this.cluster_topic_name = topic.name
                this.cluster_edit_data = cluster

                const sentences = []
                try {
                    cluster.sentences.forEach(function (item) {
                        if (item.topic_id === topic._id) {
                             sentences.push(item)
                        }
                    })
                }
                catch (e) {
                    console.log('Empty topic')
                }

                this.cluster_dialog_data_sentences = sentences
                this.cluster_items_per_page=sentences.length
                this.cluster_dialog = true
            },
            onClusterEdit(value) {
                console.log(value)
                this.cluster_edit_data = value
                this.cluster_topics = []

                this.merge_cluster_items = []
                if (value['type'] === "pos") {
                    this.merge_cluster_items = this.experiment.pos.clusters
                }
                else {
                    this.merge_cluster_items = this.experiment.con.clusters
                }

                this.cluster_edit_dialog = true
            },
            onClusterTopicEdit(cluster, topic, index) {
                this.cluster_topic_name = topic.name
                this.cluster_topic_data = topic
                this.cluster_topic_index = index
                this.cluster_edit_data = cluster

                this.merge_cluster_items = []
                if (cluster['type'] === "pos") {
                    this.merge_cluster_items = this.experiment.pos.clusters
                }
                else {
                    this.merge_cluster_items = this.experiment.con.clusters
                }

                this.cluster_topic_edit_valid = true
            },
            onSentencesEdit(cluster) {
                this.cluster_edit_data = cluster
                this.cluster_items_per_page = cluster.sentences.length
                this.cluster_sentences_edit = true

                console.log(cluster)
            },
            onSentenceMergeDialogClicked(sentence) {
              console.log(sentence)
              this.sentence_merge_data = sentence

                this.merge_cluster_items = []
                if (this.cluster_edit_data['type'] === "pos") {
                    this.merge_cluster_items = this.experiment.pos.clusters
                }
                else {
                    this.merge_cluster_items = this.experiment.con.clusters
                }

              this.sentence_merge_dialog = true
            },
            async onSentenceMerge() {
                const req = {
                    sentence_id: this.sentence_merge_data._id,
                    cluster_id: this.merge_cluster_selected._id,
                    topic_number: this.merge_topic_selected.topic_number,
                    topic_id: this.merge_topic_selected._id
                 }
                console.log(req)
                try {
                    await Experiment_service.update_sentence(req)
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

                this.sentence_merge_dialog = false
                this.cluster_sentences_edit = false
            },
            onHelpClicked () {
                this.help_cluster = true
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
                const config = {
                    topic_id: this.cluster_topic_data._id,
                    topic_name: this.cluster_topic_name
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
            async onClusterTopicMergeClicked() {

                const config = {
                    cluster_from_id: this.cluster_edit_data._id,
                    cluster_to_id: this.merge_cluster_selected._id,
                    topic_from_number: Number(this.cluster_topic_data.topic_number),
                    topic_to_number: Number(this.merge_topic_selected.topic_number),
                    topic_to_id: this.merge_topic_selected._id,
                    topic_from_id: this.cluster_topic_data._id,
                }

                try {
                    console.log(config)
                    await Experiment_service.merge_topic(config)
                    this.cluster_topic_edit_valid = false
                    this.getExperimentSentences()
                }
                catch (error) {
                    this.cluster_topic_edit_valid = false``
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
                    this.cluster_edit_dialog = false
                    this.getExperimentSentences()
                }
                catch (error) {
                    this.cluster_edit_dialog = false
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
            clusters_topic_rules(item) {
                if (item == null) {
                    return "Invalid value"
                }
                else if (item === this.cluster_topic_name){
                    return "The same Topic"
                }
                else {
                    return true
                }
            },
            topic_name_rules(item){

                if (item == null) {
                    return "Invalid value"
                }
                else if ( this.cluster_edit_data.topics.includes(item)){
                    return "The name of topic already exists"
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
                console.log(response.data)
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
            reloadCategoryExperiment(value){
                this.category = value
                this.getExperimentSentences()
            }
        },
        beforeMount() {
            if (!this.category){
                this.category = this.category_prop
            }
            this.getExperimentSentences()
            EventBus.$on('RELOAD_EXPERIMENT', this.reloadCategoryExperiment)

        },
        mounted() {
        }
    }
</script>

<style scoped>
</style>
