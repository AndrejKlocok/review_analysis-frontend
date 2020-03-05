<template>
    <v-container fluid>
        <v-card>
            <v-card-title class="indigo white--text headline">
                Similarity clustering for  '{{ experiment.category }}'
            </v-card-title>
            <v-row>
                <v-col>
                    <v-card
                        max-width="600"
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
                             :data="experiment.chartData_pos"
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
                        <h2>Sentences: {{experiment.con.sentences_count}}</h2>
                        <v-col>
                            <v-data-table
                            :hide-default-footer="true"
                            :headers="headers"
                            :items="experiment.con.clusters"
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
                 :items="cluster_dialog_data.sentences"
                 class="elevation-1"
                >
           </v-data-table>
           </v-col>
        </v-dialog>
    </v-container>
</template>

<script>
    import { GChart } from 'vue-google-charts'

    export default {
        components: {GChart},
        name: "ExperimentClusterView",
        props: ['experiment'],
        data: () => ({
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
            onClusterClicked (value) {
                this.cluster_dialog_data = value
                this.cluster_items_per_page=value.sentences.length
                this.cluster_dialog = true
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
