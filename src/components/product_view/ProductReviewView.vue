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
        </v-data-table>
        <v-dialog
        v-model="dialog"
        max-width="700"
        >
      <v-card>
        <v-card-title class="headline">Review for '{{review.product_name}}'</v-card-title>

        <v-container>
              <v-row justify="space-between">
                <v-col>
                  <v-row>
                      {{review.author}}
                  </v-row>
                  <v-row>
                      {{review.date_str}}
                  </v-row>
                  <v-row>
                      Recommends: {{review.recommends}}
                  </v-row>
                </v-col>
                <v-col
                  class="text-center pl-0"
                >
                  <v-row>
                      <v-col>
                              Review rating: {{review.rating}}
                      </v-col>
                      <v-col>
                          Model prediction: None
                      </v-col>
                  </v-row>
                  <v-row>
                      <v-simple-table>
                          <thead>
                            <tr>
                                <th class="text-left">Pros</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="item in review.pros" :key="item.name">
                              <td>
                                  <v-icon
                                large
                                  >
                                    mdi-plus
                                  </v-icon>
                              </td>
                              <td>{{ item }}</td>
                            </tr>
                          </tbody>
                      </v-simple-table>
                  </v-row>
                  <v-row>
                      <v-simple-table>
                          <thead>
                            <tr>
                                <th class="text-left">Cons</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="item in review.cons" :key="item.name">
                              <td>
                                  <v-icon
                                large
                                  >
                                    mdi-minus
                                  </v-icon>
                              </td>
                              <td>{{ item }}</td>
                            </tr>
                          </tbody>
                      </v-simple-table>
                  </v-row>
                  <v-row>
                        {{review.summary}}
                  </v-row>
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
                    text: 'Rating',
                    value: 'rating ',
                    sortable: false
                }]
            }
          },
        methods:{
            async getProductReviews (){
                if (this.product){
                    const response = await ProductService.get_reviews_by_product_name(this.product.product_name)
                    //const revs = response.data
                    //for (var i = 0; i < revs.length; i++) {
                    //    revs[i].rating_number = parseFloat(revs[i].rating) / 100.0
                    //}
                    this.reviews = response.data
                    console.log(this.reviews[0])
                }
            },
            onReviewClicked (review) {
                this.review = review
                this.dialog=true
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

</style>
