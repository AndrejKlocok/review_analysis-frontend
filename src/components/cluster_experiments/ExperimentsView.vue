<template>
<v-container fluid>
    <section class="hero is-primary">
        <v-card
            class="mx-auto"
            max-width="1200"
            >
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
        max-width="1100"
        >
          <v-card>
            <v-card-title class="indigo white--text headline">Experiment</v-card-title>
            <v-simple-table

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
                        <td>

                        </td>
                        <td>
                            <v-btn rounded color="error"
                                 dark
                                 @click="onDeleteExperimentClicked()"
                                  >
                              Delete Experiment
                          </v-btn>
                        </td>
                    </tr>
                    </tbody>
                  </template>
                  </v-simple-table>
                  <ExperimentClusterEditView v-bind:category_prop="category" />
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
     </v-card>
</section>
</v-container>
</template>

<script>
    import ExperimentsBrowse from "./ExperimentsBrowse"
    import Experiment_service from "../../services/Experiment_service";
    import ExperimentClusterEditView from "./ExperimentClusterEditView";
    import EventBus from "../../services/events";
    export default {
        components: {ExperimentClusterEditView, ExperimentsBrowse},
        name: "ExperimentsView",
        data: () => ({
                experiments: [],
                experiment: {},
                category: '',
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
                    text: 'Category',
                    value: 'category'
                },
                {
                    text: 'Date',
                    value: 'date',
                }]
            }),
            methods:{
                /**
                 * Show part of experiment dialog with meta data.
                 * @param value
                 */
                onExperimentClicked (value) {
                        this.experiment = value
                        console.log(value)
                        this.category= this.experiment.category
                        EventBus.$emit('RELOAD_EXPERIMENT', this.category)
                        this.dialog = true
                },
                /**
                 * Get experiment list from API
                 * @returns {Promise<void>}
                 */
                async getExperiments () {
                    try{
                        // perform request
                        const response = await Experiment_service.get_experiments(this.$store.state.jwt)
                        this.experiments = response.data
                    } catch (error) {
                    if (error.response){
                      if(error.response.status === 401){
                        EventBus.$emit('USER_LOGGED_OUT', error.response.data)
                      }
                    }
                  }
                },
                /**
                 * Perform removal of experiment on API.
                 * @returns {Promise<void>}
                 */
                async onDeleteExperimentClicked () {
                    // object to be sent to API
                    const req = {
                        experiment_id:this.experiment._id
                    }

                    try {
                        // perform requests
                        const response = await Experiment_service.delete_experiment(req, this.$store.state.jwt)
                        // set up data
                        this.experiments = null
                        this.experiments = response.data
                        // close dialog
                        this.dialog = false
                    }
                    catch (error) {
                        // error handler
                        if (error.response){
                            // unauthorized
                            if(error.response.status === 401){
                              EventBus.$emit('USER_LOGGED_OUT', error.response.data)
                            }
                            else{
                                // err show dialog
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
                }
            },
            beforeMount() {
            // reload experiments from store or perform api request
            if (this.$store.state.experiments[0]) {
                this.product = this.$store.state.experiments
            }
            else {
                this.getExperiments()
            }

        }
    }
</script>

<style scoped>
.space {
    margin: 10px;
}
</style>
