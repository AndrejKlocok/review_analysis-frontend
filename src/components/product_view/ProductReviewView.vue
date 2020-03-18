<template>
    <v-container fluid>
        <ProductBrowse></ProductBrowse>
        <v-data-table
            :headers="headers"
            :items="reviews"
            @click:row="onReviewClicked"
            class="elevation-1"
        >
          <template v-slot:item.date="{ item }">
              <span>{{moment(item.date).format('DD-MM-YYYY')}}</span>
          </template>
          <template v-slot:item.rating="{ item }">
              <span>{{item.rating}}</span>
          </template>
          <template v-slot:item.items="{ item }">
              <span v-if="item.items.pros"><v-icon large color="green">add_circle</v-icon></span>
              <span v-if="item.items.cons"><v-icon large color="red">remove_circle</v-icon></span>
              <span v-if="item.items.sum"><v-icon large color="orange">reorder</v-icon></span>
          </template>
        </v-data-table>
        <v-dialog
        v-model="dialog"
        max-width="800"
        >
          <v-card>
            <v-card-title class="headline">Review for '{{review.product_name}}'</v-card-title>

            <v-container>
                  <v-row justify="space-between">
                    <v-col>
                        <v-card max-width="300">
                            <v-card-title>
                                Review informations
                            </v-card-title>
                            <v-simple-table
                                  height=300
                                  >
                                   <template v-slot:default>
                                    <tbody>
                                        <tr>
                                            <td>Author</td>
                                            <td>{{review.author}}</td>
                                        </tr>
                                        <tr>
                                            <td>Date posted</td>
                                            <td>{{review.date_str}}</td>
                                        </tr>
                                        <tr>
                                            <td>Recommends</td>
                                            <td>{{review.recommends}}</td>
                                          </tr>
                                    </tbody>
                                  </template>
                            </v-simple-table>
                        </v-card>
                    </v-col>
                    <v-col
                      class="text-center pl-0"
                    >
                      <v-row>
                          <v-card>
                              <v-card-title>
                                Review rating
                            </v-card-title>
                              <v-simple-table
                                  >
                                   <template v-slot:default>
                                    <tbody>
                                        <tr>
                                            <td>Author`s rating</td>
                                            <td>{{review.rating}}</td>
                                        </tr>
                                        <tr>
                                            <td>Model rating</td>
                                            <td>{{rating_experiment}}</td>
                                        </tr>
                                    </tbody>
                                  </template>
                            </v-simple-table>
                          </v-card>
                      </v-row>
                      <v-row>
                          <v-card>
                              <v-card-title>
                                Author`s summary
                            </v-card-title>

                              <div align="left"
                                  v-for="(sum_d, i) in summary_experiment"
                                  :key="i">
                                <span v-if="sum_d.label==='+'" v-html="sum_d.sentence" class="pos_sentence"></span>
                                <span v-else v-html="sum_d.sentence" class="neg_sentence"></span>

                              </div>
                          </v-card>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row>
                      <v-col>
                              <v-card>
                              <v-card-title>
                                  Positive
                              </v-card-title>
                                <v-data-table
                                :headers="headers_pros_con_experiment"
                                :items="pros_experiment"
                                class="elevation-1"
                                :hide-default-footer="true"
                                >
                                </v-data-table>
                          </v-card>
                          </v-col>
                          <v-col>
                              <v-card>
                                  <v-card-title>
                                      Negative
                                  </v-card-title>
                                  <v-data-table
                                    :headers="headers_pros_con_experiment"
                                    :items="cons_experiment"
                                    class="elevation-1"
                                    :hide-default-footer="true"
                                  >
                                  </v-data-table>
                            </v-card>
                          </v-col>
                  </v-row>
                </v-container>
            </v-card>
    </v-dialog>
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
                reviews: [],
                product: null,
                review: {},
                dialog: false,
                headers: [{
                    text: 'Author',
                    value: 'author',
                    sortable: false,
                },
                {
                    text: 'Date',
                    value: 'date'
                },
                 {
                    text: 'Items',
                    value: 'items',
                    sortable: false
                },
                {
                    text: 'Rating',
                    value: 'rating',
                    sortable: false
                }],
                headers_pros_con_experiment:[
                    {
                        text: 'Text',
                        value: 'sentence',
                    },
                    {
                        text: 'Model polarity',
                        value: 'label'
                    }
                ],
                pros_experiment: [],
                cons_experiment: [],
                summary_experiment: [],
                rating_experiment: ''
            }
          },
        methods:{
            async getProductReviews (){
                if (this.product){
                    const response = await ProductService.get_reviews_by_product_name(this.product.product_name)
                    const revs = response.data
                    for (var i = 0; i < revs.length; i++) {
                        revs[i].items = {
                            pros: revs[i].pros.length > 0,
                            cons: revs[i].cons.length > 0,
                            sum: revs[i].summary.length > 0,
                        }
                    }
                    this.reviews = revs
                }
            },
            async getReviewExperiment (review){
              const data = {
                    pos: review.pros,
                    con: review.cons,
                    summary: review.summary,
                    category: review.category
                }
                try {
                    const response = await Experiment_service.check_review(data)
                    console.log(response.data)
                    //const review_res = response.data
                    this.pros_experiment = response.data.pos_labels
                    this.cons_experiment = response.data.con_labels
                    this.rating_experiment = response.data.rating
                    this.summary_experiment = response.data.summary_labels

                } catch (error) {
                    if (error.response){

                        // 400 is empty review
                        if (error.response.data.error_code !== 400) {
                            this.alert_text = error.response.data.error
                            this.alert_code = error.response.data.error_code
                            this.alert = true
                        }

                    }
                }
            },
            onReviewClicked (review) {
                this.review = review
                this.pros_experiment = []
                this.cons_experiment = []
                this.rating_experiment = []
                this.summary_experiment = ''
                this.getReviewExperiment(review)
                this.dialog=true
                console.log(review)
            }
        },
        beforeMount() {
            if (this.$route.params.product) {
                this.product = this.$route.params.product
                console.log('route')
            }
            else if (this.$store.state.clicked_product ) {
                this.product = this.$store.state.clicked_product
                console.log('store')
            }
            else {
                this.$router.push({name: 'product_view'})
                return
            }
            this.getProductReviews()
        }
    }
</script>

<style scoped>
.pos_sentence {
    text-decoration: underline;
    text-decoration-color:green;
}
.neg_sentence {
    text-decoration: underline;
    text-decoration-color:red;
}
</style>
