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
              <v-icon large color="black">account_circle</v-icon>
            <v-simple-table
                          height=100
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
              <v-card-text>
                  <span v-if="user.level==='user'">
                      Basic User gets partial functionality like product searching and simple demo
                      for model testing.
                  </span>
                  <span v-else>
                      User analyst gets all access to review analyst functionality like: indexes view,
                  product searching, generating specific datasets (reusability of Review analysis),
                  actualization statics, clustering interface, simple demo for model testing.
                  </span>
              </v-card-text>
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
