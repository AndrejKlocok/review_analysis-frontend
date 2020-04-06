<template>
    <v-container fluid>
        <demo-browse/>
        <h1>Positive/Negative senteces</h1>
        <v-card
            class="mx-auto"
            max-height="800"
            width="300"
            tile>
            <v-card-title class="indigo white--text headline">
                Write a sentence
            </v-card-title>
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
                >
                <v-textarea
                  v-model="sentence_text"
                  counter
                  label="Text"
                  :rules="rules"
                ></v-textarea>
                <v-select
                  v-model="model_type"
                  :items="pos_con_models"
                  :rules="[v => !!v || 'Item is required']"
                  label="Bert bipolar model"
                  required
                ></v-select>
            </v-form>
            <h2>Polarity:
                <span v-if="polarity==='0'"> positive</span>
                <span v-else> negative</span>
            </h2>
            <v-btn
                dark
                class="cyan"
                :disabled="!valid"
                @click="onCheckSentence">
                Check Polarity
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
        name: "PosConSentenceDemo",
        components: {DemoBrowse},
        data: () => ({
            rules: [v => v.length <= 128 || 'Max 128 characters'],
            sentence_text: 'Vynikajíci kvalita výrobku.',
            polarity: '',
            alert: false,
            alert_code: 200,
            alert_text: '',
            valid: false,
            model_type: 'general',
            pos_con_models: [
                'general',
                'elektronika',
                'bile_zbozi',
                'dum_a_zahrada',
                'chovatelstvi',
                'auto-moto',
                'detske_zbozi',
                'obleceni_a_moda',
                'filmy_knihy_hry',
                'kosmetika_a_zdravi',
                'sport',
                'hobby',
                'jidlo_a_napoje',
                'stavebniny',
                'sexualni_a_eroticke_pomucky',
            ]
        }),
        methods:{
            async onCheckSentence () {
                const data = {
                    sentence: this.sentence_text,
                    model_type: this.model_type
                }
                try {
                    console.log(data)
                    const response = await Experiment_service.check_polarity(data)
                    console.log(response.data)
                    this.polarity = response.data.polarity
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
