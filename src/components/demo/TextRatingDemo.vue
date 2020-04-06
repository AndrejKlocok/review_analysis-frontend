<template>
    <v-container fluid>
        <demo-browse/>
        <h1>Text rating </h1>
        <v-card
            class="mx-auto"
            max-height="800"
            width="300"
            tile>
            <v-card-title class="indigo white--text headline">
                Write some text
            </v-card-title>
            <v-form
                ref="form"
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
                class="cyan"
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
    </v-container>
</template>

<script>
    import DemoBrowse from "./DemoBrowse"
    import Experiment_service from "../../services/Experiment_service"
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
            async onCheckSentence () {
                const data = {
                    text: this.text
                }
                try {
                    console.log(data)
                    const response = await Experiment_service.check_rating(data)
                    console.log(response.data)
                    this.rating = response.data.rating
                } catch (error) {
                    if (error.response){
                        // other then 2xx
                        this.alert_text = error.response.data.error
                        this.alert_code = error.response.data.error_code
                        this.alert = true
                    }
                }
            },
        }
    }
</script>

<style scoped>

</style>
