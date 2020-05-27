<template>
    <v-container fluid>
        <demo-browse/>
        <h1>Irrelevant sentences </h1>
        <v-card
            class="mx-auto space"
            max-height="800"
            width="400"
            tile>
            <v-card-title class="indigo white--text headline">
                Write sentence
            </v-card-title>
            <v-form
                ref="form"
                class="space"
                v-model="valid"
                lazy-validation
                >
                <v-textarea
                  v-model="text"
                  counter
                  label="Text"
                  :rules="rules"
                ></v-textarea>
            </v-form>
            <h2>Label: {{irrelevant_label}}</h2>
            <v-btn
                dark
                class="cyan space"
                :disabled="!valid"
                @click="onCheckSentence">
                Check sentence
              </v-btn>
        </v-card>

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
    import DemoBrowse from "./DemoBrowse"
    import Experiment_service from "../../services/Experiment_service"
    import EventBus from "../../services/events";
    export default {
        components: {DemoBrowse},
        data: () => ({
            rules: [v => v.length <= 128 || 'Max 128 characters'],
            text: 'Zatím nic',
            irrelevant_label: '',
            alert: false,
            alert_code: 200,
            alert_text: '',
            valid: false,
        }),
        methods:{
            /**
             * Perform api request on sentence/text relevant state.
             * @returns {Promise<void>}
             */
            async onCheckSentence () {
                // data to be sent over to API
                const data = {
                    text: this.text
                }
                try {
                    // perform request and set up data
                    const response = await Experiment_service.check_irrelevant(data, this.$store.state.jwt)
                    this.irrelevant_label = response.data.label
                } catch (error) {
                    // error handle
                    if (error.response){
                        if(error.response.status === 401){
                            EventBus.$emit('USER_LOGGED_OUT', error.response.data)
                        } else {
                            this.alert_text = error.response.data.error
                            this.alert_code = error.response.data.error_code
                            this.alert = true
                        }
                    }
                }
            },
        }
    }
</script>

<style scoped>
.space {
    margin: 10px;
}
</style>
