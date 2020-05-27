<template>
    <v-container fluid>
        <section class="hero is-primary">
          <v-card
            class="mx-auto"
            max-height="800"
            width="500"
            tile
            >
            <v-card-title class="indigo white--text headline">
                Home
            </v-card-title>
            <v-card-text>
                Review analysis project needs you to login, either as basic_user or analyst.
            </v-card-text>
              <v-card>
                <v-card-title>
                    Basic user
                </v-card-title>
                <v-card-text>
                    Basic user is able to browse product items, where he can see results of classification.
                    Also there is a simple demo for testing classification models. Browse
                    actualization statistics.
                </v-card-text>
              </v-card>
              <v-card>
                <v-card-title>
                    Analyst
                </v-card-title>
                <v-card-text>
                    Analyst is an advanced user, who has privileges of basic user. On top of these he can execute
                    clustering experiments, correct clusters, generate data sets for other experiments.
                </v-card-text>
              </v-card>
          </v-card>
        </section>
    </v-container>
</template>

<script>
    export default {
        name: "NotLoggedHome"
    }
</script>

<style scoped>

</style>
