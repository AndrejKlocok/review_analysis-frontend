<template>
    <v-container fluid>
        <ProductBrowse></ProductBrowse>
        <v-card>
            <v-card-title class="headline">
                <span v-if="product.domain === 'shop'">Reviews for '{{product.name}}'</span>
                <span v-else>Reviews for '{{product. product_name}}'</span>
                <v-icon @click="onHelpClicked()">
                info
                </v-icon>

            </v-card-title>
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
              <span v-if="item.items.pros_label"><v-icon large color="green">add_circle</v-icon></span>
              <span v-if="item.items.cons_label"><v-icon large color="red">remove_circle</v-icon></span>
              <span v-if="item.items.sum_label"><v-icon large color="orange">reorder</v-icon></span>
              <span v-if="item.items.rat_diff_label > 20"><v-icon large color="yellow">bug_report</v-icon></span>
              <span v-else-if="0 > item.items.rat_diff_label"><v-icon large color="red">bug_report</v-icon></span>
          </template>
        </v-data-table>
        </v-card>

        <v-dialog
        v-model="dialog"
        max-width="800"
        >
          <v-card>
            <v-card-title class="headline">
                Review for '{{review.product_name}}'
                <v-icon @click="onHelpReveiwClicked()">
                info
                </v-icon>
            </v-card-title>

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
                          <v-col>
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
                                        <tr>
                                            <td>Difference</td>
                                            <td>{{rating_diff}}</td>
                                        </tr>
                                    </tbody>
                                  </template>
                            </v-simple-table>
                          </v-card>
                          </v-col>
                      </v-row>
                      <v-row>
                          <v-card>
                              <v-card-title>
                                Author`s summary
                            </v-card-title>

                              <div align="left"
                                  v-for="(sum_d, i) in summary_experiment"
                                  :key="i">
                                <span v-if="sum_d.label==='0'" v-html="sum_d.sentence" class="pos_sentence"></span>
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
                               <div
                                  v-for="(item, i) in pros_experiment"
                                  :key="i">
                                    <v-simple-table dense
                                    >
                                    <tbody>
                                        <tr>
                                            <td width="30">
                                                <div v-if="item.label === '0'">
                                                    <v-icon large color="green"
                                                    @click="onPosConClicked('pos', i, item)">
                                                    add_circle
                                                    </v-icon>
                                                </div>
                                                <div v-else>
                                                    <v-icon large color="red"
                                                    @click="onPosConClicked('pos', i, item)">
                                                        add_circle
                                                    </v-icon>
                                                </div>

                                            </td>
                                            <td>
                                                <span v-html="item.sentence"/>
                                            </td>
                                        </tr>
                                    </tbody>
                                    </v-simple-table>
                               </div>
                          </v-card>
                      </v-col>
                      <v-col>
                          <v-card>
                              <v-card-title>
                                  Negative
                              </v-card-title>
                              <div
                                  v-for="(item, i) in cons_experiment"
                                  :key="i">
                                    <v-simple-table dense
                                    >
                                    <tbody>
                                        <tr>
                                            <td width="30">
                                                <div v-if="item.label === '1'">
                                                    <v-icon large color="red"
                                                    @click="onPosConClicked('con', i, item)">
                                                    remove_circle
                                                    </v-icon>
                                                </div>
                                                <div v-else>
                                                    <v-icon large color="green"
                                                    @click="onPosConClicked('con', i, item)">
                                                        remove_circle
                                                    </v-icon>
                                                </div>
                                                </td>
                                            <td>
                                                <span v-html="item.sentence"/>
                                            </td>
                                        </tr>
                                    </tbody>
                                    </v-simple-table>
                               </div>
                          </v-card>
                      </v-col>
                  </v-row>
                </v-container>
            </v-card>
    </v-dialog>
    <v-dialog
      v-model="pos_con"
      max-width="400"
      class="mx-4"
      style="overflow-y: unset"
        >
           <v-card >
             <v-card-title class="blue white--text headline">
              Details of sentence
           </v-card-title>
           <v-card-text>
              <v-layout justify-center>
                    <span v-html="pos_con_data.sentence"/>
              </v-layout>
           </v-card-text>
               <div
                  v-for="(item, i) in pos_con_data.sentences"
                  :key="i">
                    <v-simple-table dense
                    >
                    <tbody>
                        <tr>
                             <td width="30">
                                 <div v-if="pos_con_data.type === 'con'">
                                     <div v-if="item[0] === '1'">
                                        <v-icon large color="red">
                                            remove_circle
                                        </v-icon>
                                     </div>
                                     <div v-else>
                                         <v-icon large color="green">
                                             remove_circle
                                         </v-icon>
                                     </div>
                                 </div>
                                 <div v-else>
                                    <div v-if="item[0] === '0'">
                                        <v-icon large color="green">
                                        add_circle
                                        </v-icon>
                                    </div>
                                    <div v-else>
                                        <v-icon large color="red">
                                            add_circle
                                        </v-icon>
                                    </div>
                                 </div>
                             </td>
                            <td>
                                {{item[1]}}
                            </td>
                        </tr>
                </tbody>
                </v-simple-table>
               </div>
           </v-card>
        </v-dialog>
        <v-dialog
          v-model="help_review_table"
          max-width="300"
            >
           <v-card>
             <v-card-title class="blue white--text headline">
              Help for review table
            </v-card-title>
            <v-simple-table
              height=350
              >
               <template v-slot:default>
                <tbody>
                  <tr>
                    <td><v-icon large color="green">add_circle</v-icon></td>
                    <td>Review contains positive sections </td>
                  </tr>
                  <tr>
                    <td><v-icon large color="red">remove_circle</v-icon></td>
                    <td>Review contains negative sections </td>
                  </tr>
                  <tr>
                    <td><v-icon large color="orange">reorder</v-icon></td>
                    <td>Review contains summary sections</td>
                  </tr>
                  <tr>
                    <td><v-icon large color="yellow">bug_report</v-icon></td>
                    <td>Difference between author rating and model rating is greater than 20%</td>
                  </tr>
                  <tr>
                    <td><v-icon large color="red">bug_report</v-icon></td>
                    <td>Models rating is lower than autors rating</td>
                  </tr>
                </tbody>
              </template>
          </v-simple-table>
           </v-card>
        </v-dialog>

        <v-dialog
          v-model="help_review"
          max-width="300"
            >
           <v-card>
             <v-card-title class="blue white--text headline">
              Help for review
            </v-card-title>
            <v-simple-table
              height=350
              >
               <template v-slot:default>
                <tbody>
                  <tr>
                    <td><v-icon large color="green">add_circle</v-icon></td>
                    <td>Model classified section form + as positive</td>
                  </tr>
                  <tr>
                    <td><v-icon large color="red">add_circle</v-icon></td>
                    <td>Model classified section form + as negative</td>
                  </tr>
                  <tr>
                    <td><v-icon large color="red">remove_circle</v-icon></td>
                    <td>Model classified section form - as negative</td>
                  </tr>
                  <tr>
                    <td><v-icon large color="green">remove_circle</v-icon></td>
                    <td>Model classified section form - as positive</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
           </v-card>
        </v-dialog>
        <v-dialog
          v-model="loading_data"
          max-width="600"
            >
           <v-card>
             <v-card-title class="blue white--text headline">
              Executing analysis of review
            </v-card-title>
               <v-progress-circular
              :size="70"
              :width="7"
              color="purple"
              indeterminate
            ></v-progress-circular>
               <v-card-text>
                   Not all reviews are preprocessed. Every part of +/- is analyzed with all models:
                <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>15 models for bipolar classification.</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>Model for prediction of rating of review.</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                            If clustering experiment was conducted, mark salient words
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                </v-list>
               </v-card-text>
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
                pos_con: false,
                pos_con_data: {},
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
                rating_experiment: '',
                rating_diff: 0,
                rating_diff_large: false,
                pos_model: [],
                con_model: [],
                help_review_table:false,
                help_review:false,
                loading_data:false,
            }
          },
        methods:{
            async getProductReviews (){
                if (this.product){
                    const config = {
                        domain: this.product.domain
                    }
                    if (this.product.domain ==='shop'){
                        config.name = this.product.name
                    }
                    else {
                          config.name = this.product.product_name
                    }
                    const response = await ProductService.get_reviews_by_product_name(config)
                    const revs = response.data
                    for (var i = 0; i < revs.length; i++) {
                        revs[i].items = {
                            pros_label: revs[i].pros.length > 0,
                            cons_label: revs[i].cons.length > 0,
                            sum_label: revs[i].summary.length > 0,
                            rat_diff_label: revs[i].rating_diff,
                        }
                    }
                    this.reviews = revs
                }
            },
            async getReviewExperiment (review){
              const data = {
                    _id: review._id,
                    category: review.category,
                }
                if (this.product.domain === 'shop') {
                    data.category = review.shop_name
                }
                try {
                    const response = await Experiment_service.check_review(data)
                    console.log(response.data)
                    this.loading_data = false
                    this.pros_experiment = response.data.pos_labels
                    this.cons_experiment = response.data.con_labels
                    this.rating_experiment = response.data.rating_model
                    this.summary_experiment = response.data.summary_labels
                    this.pos_model = response.data.pos_model
                    this.con_model = response.data.con_model

                    this.rating_diff_int = parseInt(this.review.rating) - parseInt(this.rating_experiment)
                    this.rating_diff = this.rating_diff_int.toFixed(0)+'%'
                    this.dialog=true
                } catch (error) {
                    this.loading_data = false
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
            onHelpClicked () {
                this.help_review_table = true
            },
            onHelpReveiwClicked () {
                this.help_review = true
            },
            onReviewClicked (review) {
                this.review = review
                this.pros_experiment = []
                this.cons_experiment = []
                this.rating_experiment = []
                this.pos_con_data = {}
                this.summary_experiment = ''
                this.rating_diff = 0
                this.pos_model = []
                this.con_model = []
                this.getReviewExperiment(review)
                this.loading_data = true
                console.log(review)
            },
            onPosConClicked (type, index, item){
             if (type==='pos'){
                 this.pos_con_data.sentences = this.pos_model[index]
             }
             else {
                 this.pos_con_data.sentences = this.con_model[index]
             }
             this.pos_con_data.sentence = item.sentence
             this.pos_con_data.type = type

             console.log(this.pos_con_data)
             this.pos_con = true
            },
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
    background-color:#9fed8a;
    #text-decoration-color:#9fed8a;
}
.neg_sentence {
    #text-decoration: underline;
    #text-decoration-color:red;
    background-color: #f26166;
}
</style>
