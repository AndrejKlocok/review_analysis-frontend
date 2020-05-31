<template>
    <v-container fluid>

        <section class="hero is-primary">
          <v-card
            class="mx-auto"
            max-height="800"
            width="300"
            tile
            >
            <v-card-title class="indigo white--text headline">
                Login
            </v-card-title>
            <v-form
                ref="form"
                class="space"
                v-model="valid"
                lazy-validation
                >
                <v-text-field
                  v-model="name"
                  type="text"
                  label="name"
                  :rules="[v => !!v || 'Item is required']"
                  required
                />
                <v-text-field
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                label="Password"
                hint="At least 5 characters"
                counter
                @click:append="show1 = !show1"
              />
               <v-row>
                   <v-col>
                       <v-btn
                        dark
                        class="cyan"
                        :disabled="!valid"
                        @click="login">
                        login
                      </v-btn>
                   </v-col>
               </v-row>
            </v-form>
          </v-card>
        </section>
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
import EventBus from "../../services/events";
import UserService from "../../services/UserService"

export default {
    data () {
        return {
            valid: false,
            alert: false,
            alert_text: '',
            alert_code: 401,
            name: '',
            password: '',
            show1: false,
            rules: {
              required: value => !!value || 'Required.',
              min: v => v.length >= 5 || 'Min 5 characters',
            }
        }
    },
    methods: {
        /**
         * Perform login task to get JWT authorization token
         * @returns {Promise<void>}
         */
        async login () {
            try{
                const config = {
                    name: this.name,
                    password: this.password
                }
                const response = await UserService.login(config)
                const jwt_token = response.data.token
                const user = response.data.user
                // save token to storage
                this.$store.commit('SET_USER_DATA', user)
                this.$store.commit('SET_JWT_TOKEN', jwt_token)
                EventBus.$emit('USER_LOGGED', user)
                await this.$router.push({name: 'user_home'})
            }
            catch (error) {
                // error handle
                if (error.response){
                    // other then 2xx
                    this.alert_text = error.response.data.error
                    this.alert_code = error.response.data.error_code
                    this.alert = true
                }
                else {
                    // Something happened in setting up the request and triggered an Error
                    console.log('Error', error.message);
                }
            }
        },
        register () {
        }
    },
    mounted () {
        /**
         * Event handlers
         */
        EventBus.$on('loginFailed', (msg) => {
            this.alert_text = msg
            this.alert = true
        })
        EventBus.$on('registerFailed', (msg) => {
            this.alert_text = msg
            this.alert = true
        })
    },
    beforeDestroy () {
        EventBus.$off('failedRegistering')
        EventBus.$off('failedAuthentication')
    }
}
</script>

<style scoped>
.space {
    margin: 10px;
}
</style>
