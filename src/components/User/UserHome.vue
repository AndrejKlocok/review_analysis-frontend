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
            <v-simple-table
                          height=300
                          >
                           <template v-slot:default>
                            <tbody>
                              <tr>
                                <td>Name</td>
                                <td>{{user.name}}</td>
                              </tr>
                              <tr>
                                <td>User level</td>
                                <td>{{user.level}}</td>
                              </tr>

                            </tbody>
                          </template>
                      </v-simple-table>
          </v-card>
        </section>
    </v-container>
</template>

<script>
export default {
    data () {
        return {
            user: {}
        }
    },
    methods: {
        logout () {
        }
    },
    beforeMount () {
        var user = this.$store.state.user
        if(user){
            this.user = user
        }
    }

}
</script>

<style scoped>

</style>
