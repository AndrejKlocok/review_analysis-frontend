<template>
    <v-container fluid>
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
                          height=300
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
                          height=300
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
        <ExperimentClusterView v-bind:experiment="experiment" />
    </v-container>
</template>

<script>
    import ProductBrowse from "./ProductBrowse"
    import ProductService from "../../services/ProductService"
    import Experiment_service from "../../services/Experiment_service";
    import ExperimentClusterView from "../cluster_experiments/ExperimentClusterView";
    export default {
        components: {ExperimentClusterView, ProductBrowse},
        data () {
            return {
              product: null,
              image_link: '',
              experiment: null
            }
          },
        methods: {
            async getProductImage (){
                if (this.product.domain ==='shop'){
                    return
                }
                const config = {
                        url: this.product.url
                    }

                const response = await ProductService.get_image(config)
                this.image_link = response.data.src
            },
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
                    const response = await Experiment_service.get_experiment_sentences(config)
                    console.log(response.data)
                    this.experiment = response.data
                    this.experiment.category = this.category
                }
                catch (error) {
                    if (error.response){
                        // other then 2xx
                        console.log(error.response.data)
                        console.log(error.response.status)
                        console.log(error.response.headers)
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
            openHeureka (){
                if(this.product.domain === 'shop'){
                    window.open(this.product.url_review, "_blank")
                }
                else{
                    window.open(this.product.url, "_blank")
                }
            },
            openShopPage (){
                window.open(this.product.url_shop, "_blank")
            },
            onSeeReviewsBtnClicked() {
                this.$router.push({name: 'review_view', params: {product: this.product}})
            }
        },
        beforeMount () {
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
            this.getProductImage()
            this.getExperimentSentences()
        }
    }
</script>

<style scoped>

</style>
