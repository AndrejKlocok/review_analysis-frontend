<template>
    <v-container fluid>
        <section class="hero is-primary">
        <v-card
        class="mx-auto"
        max-width="1200"
        >
        <ProductBrowse></ProductBrowse>
        <v-card
            class="space">
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
              <span v-if="item.items.filter_model"><v-icon large color="blue">label</v-icon></span>
              <span v-if="item.items.data_processed"><v-icon large color="grey">build</v-icon></span>
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
                <v-icon @click="onHelpReviewClicked()">
                info
                </v-icon>
            </v-card-title>

            <v-container>
                  <v-row justify="space-between">
                    <v-col>
                        <v-card max-width="300">
                            <v-card-title>
                                Review details

                            </v-card-title>
                            <v-simple-table
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
                <v-row>
                  <v-card class="space">
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
              height=380
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
                    <td>Models rating is lower than authors rating</td>
                  </tr>
                  <tr>
                    <td><v-icon large color="blue">label</v-icon></td>
                    <td>Review was processed by irrelevant model</td>
                  </tr>
                  <tr>
                    <td><v-icon large color="grey">build</v-icon></td>
                    <td>Review was processed by bipolar models</td>
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
        <v-dialog
          v-model="empty_review"
          max-width="300"
            >
           <v-card>
             <v-card-title class="red white--text headline">
              Error - empty review
             </v-card-title>

               <v-card-text>
                   Review is empty, it can be caused by filter model, which filtered out all irrelevant sentences
                   and thus review is empty. Pick another one please.
               </v-card-text>
           </v-card>
        </v-dialog>
        <v-dialog
          v-model="alert"
          max-width="300"
        >
           <v-card>
             <v-card-title class="red white--text headline">
              API Error - {{alert_code}}
            </v-card-title>
             <v-card-text>
                 <h3>{{alert_text}}</h3>
             </v-card-text>
           </v-card>
        </v-dialog>
    </v-card>
    </section>
    </v-container>
</template>

<script>
    import ProductBrowse from "./ProductBrowse"
    import ProductService from "../../services/ProductService"
    import Experiment_service from "../../services/Experiment_service";
    import EventBus from "../../services/events";

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
                empty_review: false,
                alert: false,
                alert_text: '',
                alert_code: 200,
            }
          },
        methods:{
            /**
             * Retrieve product reviews from back end with meta data about evaluation of text.
             * @returns {Promise<void>}
             */
            async getProductReviews (){
                // if product is selected
                if (this.product){
                    // set up object, that will be sent over to API
                    const config = {
                        domain: this.product.domain
                    }
                    // domain shop, the name of shop is indexed as name
                    if (this.product.domain ==='shop'){
                        config.name = this.product.name
                    }
                    // the name of product is indexed as product_name
                    else {
                          config.name = this.product.product_name
                    }
                    try {
                        // send request
                        const response = await ProductService.get_reviews_by_product_name(config, this.$store.state.jwt)
                        const revs = response.data
                        // for each review add items meta data object as follows
                        for (var i = 0; i < revs.length; i++) {
                            var processed = false
                            if (revs[i].pos_model || revs[i].con_model) {
                                processed = true
                            }
                            revs[i].items = {
                                pros_label: revs[i].pros.length > 0,
                                cons_label: revs[i].cons.length > 0,
                                sum_label: revs[i].summary.length > 0,
                                rat_diff_label: revs[i].rating_diff,
                                filter_model: revs[i].filter_model,
                                data_processed: processed
                            }
                        }
                        this.reviews = revs
                    }catch (error) {
                        if (error.response){
                          // other then 2xx
                          if(error.response.status === 401){
                            EventBus.$emit('USER_LOGGED_OUT', error.response.data)
                          }
                        }
                      }
                }
            },
            /**
             * Show review details and perform analysis on backend site, which can take a time so the new dialog
             * shows about evaluation information.
             * @param review review object
             * @returns {Promise<void>}
             */
            async getReviewExperiment (review){
                // object that will be sent over to API
                const data = {
                    _id: review._id,
                    category: review.category,
                }
                // changes for shop domain
                if (this.product.domain === 'shop') {
                    data.category = review.shop_name
                }
                try {
                    // send request to API
                    const response = await Experiment_service.check_review(data, this.$store.state.jwt)
                    // close loading dialog and set up data
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
                    // error handle
                    this.loading_data = false
                    if (error.response){
                        // 404 is empty review
                        if (error.response.data.error_code === 404) {
                            this.empty_review = true
                        }
                        // unauthorized
                        else if(error.response.status === 401){
                            EventBus.$emit('USER_LOGGED_OUT', error.response.data)
                        }
                        // API error
                        else {
                            this.alert_text = error.response.data.error
                            this.alert_code = error.response.data.error_code
                            this.alert = true
                        }

                    }
                }
            },
            /**
             * Show help dialog for review table.
             */
            onHelpClicked () {
                this.help_review_table = true
            },
            /**
             * Show help dialog for review detail.
             */
            onHelpReviewClicked () {
                this.help_review = true
            },
            /**
             * Handle for onClick on review item in products review table shows review detail dialog after loading data.
             * @param review
             */
            onReviewClicked (review) {
                // setup review object and clear other
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
            },
            /**
             * Shows closer look on sentence analysis by all bipolar models.
             * @param type type of sentence pos/con
             * @param index index of sentence in review pos or con array
             * @param item  analysed sentence
             */
            onPosConClicked (type, index, item){
             if (type==='pos'){
                 this.pos_con_data.sentences = this.pos_model[index]
             }
             else {
                 this.pos_con_data.sentences = this.con_model[index]
             }
             this.pos_con_data.sentence = item.sentence
             this.pos_con_data.type = type

             this.pos_con = true
            },
        },
        beforeMount() {
            // load product information from route
            if (this.$route.params.product) {
                this.product = this.$route.params.product
            }
            // use store
            else if (this.$store.state.clicked_product ) {
                this.product = this.$store.state.clicked_product
            }
            // otherwise return to product view
            else {
                this.$router.push({name: 'product_view'})
                return
            }
            // request for product reviews
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
.space {
    margin: 10px;
}
</style>
