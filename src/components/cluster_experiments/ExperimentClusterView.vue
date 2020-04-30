<template>
    <v-container fluid>
        <v-card>
                <v-row>
                    <v-col>
                        <v-card max-width="550">
                        <v-card-title class="green white--text headline">
                        Positive
                        </v-card-title>
                        <div
                          v-for="(item, i) in experiment.pos.clusters"
                          :key="i">
                            <v-simple-table dense
                            >
                            <tbody>
                                <tr>
                                    <td width="30">
                                        <v-icon large color="green">add_circle</v-icon>
                                    </td>
                                    <td width="150">
                                        <v-btn text small color="green"
                                            @click="onClusterClicked(item)">
                                            {{item.cluster_name}}
                                        </v-btn>
                                    </td>
                                    <td>
                                        <div align="left"
                                            v-for="(topic, j) in item.topics"
                                            :key="j">
                                            <v-btn text small
                                            @click="onTopicClicked(item, topic)">{{topic.name}}</v-btn>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            </v-simple-table>
                        </div>
                            <v-card>
                                <div>
                                    <h3>Salient words</h3>
                                </div>
                                <span
                                  v-for="(item, i) in experiment.sal_pos"
                                  :key="i">
                                    {{item}}
                                </span>
                            </v-card>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card max-width="550">
                            <v-card-title class="red white--text headline">
                            Negative
                            </v-card-title>
                            <v-card>
                                <div
                                  v-for="(item, i) in experiment.con.clusters"
                                  :key="i">
                                    <v-simple-table dense
                                    >
                                    <tbody>
                                        <tr>
                                            <td width="50">
                                                <v-icon large color="red">remove_circle</v-icon>
                                            </td>
                                            <td width="150">
                                                <v-btn text small color="red"
                                                    @click="onClusterClicked(item)">
                                                    {{item.cluster_name}}
                                                </v-btn>
                                            </td>
                                            <td>
                                                <div align="left"
                                                    v-for="(topic, j) in item.topics"
                                                    :key="j">
                                                    <v-btn text small
                                                    @click="onTopicClicked(item, topic)">{{topic.name}}</v-btn>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                    </v-simple-table>
                                </div>
                            </v-card>
                            <v-card>
                                <div>
                                    <h3>Salient words</h3>
                                </div>
                                <span
                                  v-for="(item, i) in experiment.sal_con"
                                  :key="i">
                                    {{item}}
                                </span>
                            </v-card>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card>
    <v-dialog
          v-model="sentence_dialog"
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
                    <div v-if="cluster_topic_name">
                        Topic <h3><b>{{cluster_topic_name}}</b></h3>
                    </div>
                </v-card-text>
               <v-data-table
                 :headers="cluster_headers"
                 :items-per-page="cluster_items_per_page"
                 :items="sentences"
                 class="elevation-1"
                 :hide-default-footer="true"
                >
                </v-data-table>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>

    export default {
        name: "ExperimentClusterView",
        props: ['experiment'],
        data: () => ({
            sentences: [],
            cluster_edit_data: {},
            cluster_topic_name: '',
            sentence_dialog: false,
            cluster_items_per_page: 10,
            cluster_headers:[
                {
                    text: 'Sentences',
                    value: 'sentence',
                }
            ],
        }),
        methods: {
            onTopicClicked (cluster, topic) {
                this.cluster_topic_name = topic.name
                this.cluster_edit_data = cluster
                const sentences = []
                cluster.sentences.forEach(function (item) {
                    if (item.topic_id === topic._id) {
                         sentences.push(item)
                    }
                })
                this.sentences = sentences
                this.cluster_items_per_page = sentences.length
                this.sentence_dialog = true
            },
            onClusterClicked(cluster) {
                this.cluster_topic_name = ''
                this.cluster_edit_data = cluster

                this.sentences = cluster.sentences
                this.cluster_items_per_page = cluster.sentences.length
                this.sentence_dialog = true
            },
        },
        beforeMount() {
        },
        mounted() {
        }
    }
</script>

<style scoped>
</style>
