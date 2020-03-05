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
                </v-col>
              </v-row>
              <v-row>

              </v-row>
            </v-container>
          </v-card>
    </v-container>
</template>

<script>
    import ProductBrowse from "./ProductBrowse"
    import ProductService from "../../services/ProductService"
    import Experiment_service from "../../services/Experiment_service";
    export default {
        components: {ProductBrowse},
        data () {
            return {
              product: null,
              image_link: '',
              experiment: null
            }
          },
        methods: {
            async getProductImage (){
                const response = await ProductService.get_image(this.product.url)
                this.image_link = response.data.src
            },
            async getExperimentSentences(category){

                this.category = category
                const config = {
                    category: category
                }
                const response = await Experiment_service.ger_experiment_sentences(config)
                this.experiment = response.data
                this.experiment.category = this.product.category
                var arr_pos = [['Cluster', 'sentences_count']]
                var arr_con = [['Cluster', 'sentences_count']]
                this.experiment.pos.clusters.forEach(function (item) {
                    arr_pos.push(['Cluster_'+ item.cluster_number, item.cluster_sentences_count])
                })
                this.experiment.chartData_pos = arr_pos

                this.experiment.con.clusters.forEach(function (item) {
                    arr_con.push(['Cluster_'+ item.cluster_number, item.cluster_sentences_count])
                })
                this.experiment.chartData_con = arr_con
            },
            openHeureka (){
                window.open(this.product.url, "_blank")
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

            this.getExperimentSentences(this.product.category)
        }
    }
</script>

<style scoped>

</style>
