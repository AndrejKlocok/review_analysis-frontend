<template>
    <v-container fluid>
        <section class="hero is-primary">
        <v-card
            class="mx-auto"
            max-width="1200"
        >
        <demo-browse/>
        <h1>Text rating </h1>
        <v-card
            class="mx-auto space"
            max-height="800"
            width="400"
            tile>
            <v-card-title class="indigo white--text headline">
                Write some text
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
            <h2>Rating: {{rating}}/100</h2>
            <v-btn
                dark
                class="cyan space"
                :disabled="!valid"
                @click="onCheckSentence">
                Check Rating
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
        </v-card>
        </section>
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
            text: 'Vynikajíci kvalita výrobku. Chýbí mi ale nástavec na vysavač. Celkove to hodnotim prúmerne',
            rating: '',
            alert: false,
            alert_code: 200,
            alert_text: '',
            valid: false,
        }),
        methods:{
            /**
             * Perform text rating evaluation on backend site.
             * @returns {Promise<void>}
             */
            async onCheckSentence () {
                // object that will be sent over to API
                const data = {
                    text: this.text
                }
                try {
                    // send request and set up result
                    const response = await Experiment_service.check_rating(data, this.$store.state.jwt)
                    this.rating = response.data.rating
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
