<template>
<section class="hero is-primary">
          <v-card
            class="mx-auto"
            max-height="800"
            width="300"
            tile
            >
            <v-card-title class="indigo white--text headline">
                Logout
            </v-card-title>
            <div>
                insert Sad face image
            </div>
           <v-btn
            dark
            class="cyan"
            @click="logout">
            logout
          </v-btn>

          </v-card>
        </section>
</template>

<script>
    import EventBus from "../../services/events";
export default {
    data () {
        return {
        }
    },
    methods: {
        logout () {
            this.$store.commit('REM_USER_DATA')
            this.$store.commit('REM_JWT_TOKEN')
            EventBus.$emit('USER_LOGGED_OUT')
            this.$router.push({name: 'main'})
        }
    },

}
</script>

<style scoped>

</style>
