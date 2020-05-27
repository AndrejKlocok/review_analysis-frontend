<template>
    <v-container fluid>
        <section class="hero is-primary">
        <v-card
            class="mx-auto"
            max-width="1200"
            >
        <ProductBrowse></ProductBrowse>
        <v-card class="d-inline-block mx-auto">
            <v-container>
              <v-row class="text-center pl-0">
                  {{product.category_list}}
              </v-row>
              <v-row justify="space-between">
                <v-col cols="auto">
                  <v-img
                    height="200"
                    width="200"
                    :src=image_link
                    alt="avatar"
                  ></v-img>
                </v-col>
                <v-col
                  cols="auto"
                  class="text-center pl-0"
                >
                  <div v-if="product.domain === 'shop'">
                    <v-simple-table
                          height=350
                          >
                           <template v-slot:default>
                            <tbody>
                              <tr>
                                <td>Shop</td>
                                <td>{{product.name}}</td>
                              </tr>
                              <tr>
                                <td>Review count</td>
                                <td>{{product.reviews_len}}</td>
                              </tr>
                            <tr>
                                <td>Info</td>
                                <td>{{product.info}}</td>
                              </tr>
                            <tr>
                            <tr>
                                <td>Average rating</td>
                                <td>{{avg_rev}}</td>
                              </tr>
                            <tr>
                            <tr>
                                <td>Average reccomends</td>
                                <td>{{avg_rec}}</td>
                              </tr>
                            <tr>
                                <td>Heureka</td>
                                <td>
                                    <v-icon
                                        large
                                        @click="openHeureka()"
                                      >
                                        link
                                      </v-icon>
                                </td>
                            </tr>
                            <tr>
                                <td>Shop page</td>
                                <td>
                                    <v-icon
                                        large
                                        @click="openShopPage()"
                                      >
                                        link
                                      </v-icon>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <v-btn rounded color="primary"
                                 dark
                                 @click="onSeeReviewsBtnClicked()"
                                  >
                                      See reviews
                                  </v-btn>
                                </td>
                            </tr>
                            </tbody>
                          </template>
                      </v-simple-table>
                  </div>
                  <div v-else>
                      <v-simple-table
                          height=350
                          >
                           <template v-slot:default>
                            <tbody>
                              <tr>
                                <td>Product</td>
                                <td>{{product.product_name}}</td>
                              </tr>
                              <tr>
                                <td>Review count</td>
                                <td>{{product.reviews_len}}</td>
                              </tr>
                            <tr>
                                <td>Category</td>
                                <td>{{product.category}}</td>
                              </tr>
                            <tr>
                            <tr>
                                <td>Average rating</td>
                                <td>{{avg_rev}}</td>
                              </tr>
                            <tr>
                            <tr>
                                <td>Average reccomends</td>
                                <td>{{avg_rec}}</td>
                              </tr>
                            <tr>
                                <td>Heureka</td>
                                <td>
                                    <v-icon
                                        large
                                        @click="openHeureka()"
                                      >
                                        link
                                      </v-icon>
                                </td>
                              </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <v-btn rounded color="primary"
                                 dark
                                 @click="onSeeReviewsBtnClicked()"
                                  >
                                      See reviews
                                  </v-btn>
                                </td>
                            </tr>
                            </tbody>
                          </template>
                      </v-simple-table>
                  </div>

                </v-col>
              </v-row>
            </v-container>
          </v-card>
        <v-card>

        </v-card>
        <GChart
             type="LineChart"
             :data="chart_data"
             :options="chartOptions"
         />
        <ExperimentClusterView v-bind:experiment="experiment" />
    </v-card>
    </section>
    </v-container>
</template>

<script>
    import ProductBrowse from "./ProductBrowse"
    import ProductService from "../../services/ProductService"
    import Experiment_service from "../../services/Experiment_service";
    import ExperimentClusterView from "../cluster_experiments/ExperimentClusterView";
    import {GChart} from "vue-google-charts";
    import EventBus from "../../services/events";

    export default {
        components: {ExperimentClusterView, ProductBrowse, GChart},
        data () {
            return {
              product: null,
              image_link: '',
              experiment: null,
              avg_rec: '',
              avg_rev: '',
              chartOptions: {
                legend: { position: 'none' },
                title: 'Reviews in time',
              },
              chart_data: []
            }
          },
        methods: {
            /**
             * Get url of products image from API on heureka site
             * @returns {Promise<void>}
             */
            async getProductImage (){
                // image is not available for shops
                if (this.product.domain ==='shop'){
                    return
                }
                const config = {
                        url: this.product.url
                    }
                try{
                    // get image request
                    const response = await ProductService.get_image(config, this.$store.state.jwt)
                    this.image_link = response.data.src
                } catch (error) {
                    // error handle
                    if (error.response) {
                        if (error.response.status === 401) {
                            EventBus.$emit('USER_LOGGED_OUT', error.response.data)
                        }
                    }
                }
            },
            /**
             * Get clustering experiment sentences from clustering category or of the product
             * @returns {Promise<void>}
             */
            async getExperimentSentences(){
                const config = {}

                // shop case
                if (this.product.domain ==='shop'){
                    config.category = this.product.name
                }
                else{
                    config.category = this.product.product_name
                }

                try {
                    this.experiment = {
                        pos:{
                            clusters: []
                        },
                        con:{
                            clusters:[]
                        }
                    }
                    // perform request and save data
                    const response = await Experiment_service.get_experiment_sentences(config, this.$store.state.jwt)

                    this.experiment = response.data
                    this.experiment.category = this.category
                }
                catch (error) {
                    // error handle
                    if (error.response){
                        if(error.response.status === 401){
                            EventBus.$emit('USER_LOGGED_OUT', error.response.data)
                        }
                        else {
                            // other then 2xx
                            console.log(error.response.data)
                            console.log(error.response.status)
                            console.log(error.response.headers)
                        }
                    }
                    else if (error.request) {
                        //timeout
                        console.log(error.request);
                    } else {
                        // Something happened in setting up the request and triggered an Error
                        console.log('Error', error.message);
                    }
                }
            },
            /**
             * Get product statistics from backend API
             * @returns {Promise<void>}
             */
            async getStatistics(){
                // object that will be sent \
                const config = {
                    domain: this.product.domain,
                    name: this.product.product_name
                }
                // shop name has different property
                if (this.product.domain === "shop"){
                    config.name = this.product.name
                }
                try {
                    // send request to api
                    const response = await ProductService.get_statistics(config, this.$store.state.jwt)
                    // gather statistics and graph
                    this.avg_rev = response.data.avg_rating
                    this.avg_rec = response.data.avg_recommends
                    var chart_data = [['Time', 'reviews']]
                    response.data.review_dates.forEach(function (item) {
                        chart_data.push([item[0], item[1]])
                    })
                    this.chart_data = chart_data
                }
                catch (error) {
                    // error handle
                    if (error.response){
                        console.log(error.response.data)
                        console.log(error.response.status)
                        console.log(error.response.headers)
                    }
                    else if (error.request) {
                        console.log(error.request);
                    } else {
                        // Something happened in setting up the request and triggered an Error
                        console.log('Error', error.message);
                    }
                }

            },
            /**
             * Open product/shop on heureka page.
             */
            openHeureka (){
                if(this.product.domain === 'shop'){
                    window.open(this.product.url_review, "_blank")
                }
                else{
                    window.open(this.product.url, "_blank")
                }
            },
            /**
             * Open window to shop page
             */
            openShopPage (){
                window.open(this.product.url_shop, "_blank")
            },
            /**
             * Open product reviews
             */
            onSeeReviewsBtnClicked() {
                this.$router.push({name: 'review_view', params: {product: this.product}})
            }
        },
        beforeMount () {
            /**
             * Load saved product
             */
            if (this.$route.params.product) {
                this.product = this.$route.params.product
                console.log('route')
            }
            else if (this.$store.state.clicked_product ) {
                this.product = this.$store.state.clicked_product
                console.log('store')
            }
            else {
                this.$router.push({name: 'product_tree_view'})
                return
            }
            /**
             * Get data
             */
            this.getProductImage()
            this.getStatistics()
            this.getExperimentSentences()
        }
    }
</script>

<style scoped>

</style>
