<template>
<v-container fluid>
        <ExperimentsBrowse></ExperimentsBrowse>
        <h1>Experiment list</h1>
        <v-data-table
            :headers="headers"
            :items="experiments"
            @click:row="onExperimentClicked"
            class="elevation-1"
        >
          <template v-slot:item.date="{ item }">
              <span>{{moment(item.date).format('HH:MM:SS-DD-MM-YYYY')}}</span>
          </template>
        </v-data-table>
        <v-dialog
        v-model="dialog"
        max-width="600"
        >
      <v-card>
        <v-card-title class="indigo white--text headline">Experiment</v-card-title>
        <v-simple-table
                  height=300
                  >
                   <template v-slot:default>
                    <tbody>
                      <tr>
                        <td>Embedding method</td>
                        <td>{{experiment.embedding_method}}</td>
                      </tr>
                      <tr>
                        <td>Cluster method</td>
                        <td>{{experiment.cluster_method}}</td>
                      </tr>
                    <tr>
                        <td>Category</td>
                        <td>{{experiment.category}}</td>
                      </tr>
                    <tr>
                    <tr>
                        <td>Timestamp</td>
                        <td>{{experiment.date}}</td>
                    </tr>
                    <tr>
                        <td>Positive sentences</td>
                        <td>{{experiment.pos_sentences}}</td>

                    </tr>
                    <tr>
                        <td>Positive Clusters</td>
                        <td>{{experiment.clusters_pos_count}}</td>
                    </tr>
                    <tr>
                        <td>Negative sentences</td>
                        <td>{{experiment.con_sentences}}</td>
                    </tr>
                    <tr>
                       <td>Negative Clusters</td>
                       <td>{{experiment.clusters_con_count}}</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <v-btn rounded color="error"
                                 dark
                                 @click="onDeleteExperimentClicked()"
                                  >
                              Delete
                          </v-btn>
                        </td>
                    </tr>
                    </tbody>
                  </template>
                  </v-simple-table>
                  <ExperimentClusterView v-bind:experiment="experiment_sentences" />
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
    import ExperimentsBrowse from "./ExperimentsBrowse"
    import Experiment_service from "../../services/Experiment_service";
    import ExperimentClusterView from "./ExperimentClusterView";
    export default {
        components: {ExperimentClusterView, ExperimentsBrowse},
        name: "ExperimentsView",
        data: () => ({
                experiments: [],
                experiment: null,
                experiment_sentences: null,
                dialog: false,
                alert:false,
                alert_text: '',
                alert_code: 200,
                headers: [{
                    text: 'Embedding type',
                    value: 'embedding_method',
                },
                {
                    text: 'Cluster method',
                    value: 'cluster_method'
                },
                {
                    text: 'Date',
                    value: 'date',
                }]
            }),
            methods:{
                onExperimentClicked (value) {
                        this.experiment = value
                        this.getExperimentSentences(this.experiment.category)
                        this.dialog = true
                },
                async getExperiments () {
                        const response = await Experiment_service.get_experiments()
                        this.experiments = response.data

                },
                async getExperimentSentences(category){
                    this.category = category
                    const config = {
                        category: category
                    }
                    const response = await Experiment_service.ger_experiment_sentences(config)
                    this.experiment_sentences = response.data
                    this.experiment_sentences.category = this.experiment.category
                    var arr_pos = [['Cluster', 'sentences_count']]
                    var arr_con = [['Cluster', 'sentences_count']]
                    this.experiment_sentences.pos.clusters.forEach(function (item) {
                        arr_pos.push(['Cluster_'+ item.cluster_number, item.cluster_sentences_count])
                    })
                    this.experiment_sentences.chartData_pos = arr_pos

                    this.experiment_sentences.con.clusters.forEach(function (item) {
                        arr_con.push(['Cluster_'+ item.cluster_number, item.cluster_sentences_count])
                    })
                    this.experiment_sentences.chartData_con = arr_con
                    },
                async onDeleteExperimentClicked () {

                        const req = {
                                experiment_id:this.experiment._id
                        }

                        try {
                            const response = await Experiment_service.delete_experiment(req)
                            this.experiments = null
                            this.experiments = response.data
                            this.dialog = false

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
                }
            },
            beforeMount() {
            if (this.$store.state.experiments[0]) {
                this.product = this.$store.state.experiments
                console.log('store')
            }
            else {
                this.getExperiments()
            }

        }
    }
</script>

<style scoped>

</style>
