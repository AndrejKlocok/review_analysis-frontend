<template>
    <v-container fluid>
        <v-card>
            <v-card-title class="indigo white--text headline">
                Properties
            </v-card-title>
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
                                            @click="onTopicClicked(item, j)">{{topic}}</v-btn>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            </v-simple-table>
                        </div>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card max-width="550">
                        <v-card-title class="red white--text headline">
                        Negative
                        </v-card-title>
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
                                            @click="onTopicClicked(item, j)">{{topic}}</v-btn>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            </v-simple-table>
                        </div>
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
            <v-card-title class="blue white--text headline">
              Sentences view
            </v-card-title>
           <v-col>
               <v-data-table
                 :headers="cluster_headers"
                 :items="sentences"
                 class="elevation-1"
                 :hide-default-footer="true"
                >
           </v-data-table>
           </v-col>
        </v-dialog>
    </v-container>
</template>

<script>

    export default {
        name: "ExperimentClusterView",
        props: ['experiment'],
        data: () => ({
            sentences: [],
            sentence_dialog: false,
            cluster_headers:[
                {
                    text: 'Sentences',
                    value: 'sentence',
                }
            ],
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
                this.sentences = sentences
                this.sentence_dialog = true
            },
            onClusterClicked(value) {
                console.log(value)
                this.sentences = value.sentences
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
