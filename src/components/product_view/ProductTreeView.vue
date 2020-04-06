<template>
    <v-container fluid>
    <ProductBrowse></ProductBrowse>
    <h2>Product tree view</h2>
      <v-card
        class="mx-auto"
        max-height="900"
        tile>
          <v-card-title class="indigo white--text headline">
          Domain product categories
        </v-card-title>
          <v-row
          justify="space-between"
          >
            <v-col cols="5">
            <v-sheet class="pa-4 primary lighten-2">
                <v-text-field
                v-model="search"
                label="Search Category"
                dark
                flat
                solo-inverted
                hide-details
                clearable
                clear-icon="mdi-close-circle-outline"
              ></v-text-field>
              <v-checkbox
                v-model="caseSensitive"
                dark
                hide-details
                label="Case sensitive search"
              ></v-checkbox>
            <v-btn
                dark
                class="cyan"
                @click="reloadBreadCrumbs">
                Reload
            </v-btn>
            </v-sheet>
              <v-treeview
              dense
              :active.sync="active"
              :search="search"
              :filter="filter"
              :items="breadcrumbs"
              activatable
              item-key="name"
              open-on-click
              transition
              color="warning"
              class="ml-4 scroll-y"
              style="overflow-y: auto;max-height: 600px"
            >
                <template v-slot:prepend="{item}">
                <v-icon v-if="!item.children">shopping_basket</v-icon>
              </template>
          </v-treeview>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col
            class="d-flex text-center"
            >
            <v-scroll-y-transition mode="out-in">
                <div
                    v-if="!selected"
                    class="title grey--text text--lighten-1 font-weight-light"
                    style="align-self: center;"
                  >
                    Select category
                </div>
                <v-card
                    v-else
                    :key="selected.name"
                    flat
                    max-width="400"
                    class="pt-6 mx-auto scroll-y"
                    style="overflow-y: auto;max-height: 750px"
                >
                    <v-card-text>
                        <h2 class="headline mb-2"> Category: {{ selected.name }}</h2>
                        <h2 class="headline mb-2"> Count of products: {{ products.total_products }}</h2>
                        <h2 class="headline mb-2"> Count of reviews: {{ products.total_reviews }}</h2>
                    </v-card-text>
                    <v-btn
                        dark
                        class="cyan"
                        @click="getExperiment">
                        Cluster experiment
                    </v-btn>
                    <v-list subheader>
                      <v-subheader>Products </v-subheader>

                      <v-list-item two-line
                        v-for="item in products.products"
                        :key="item.product_name"
                        @click="onProductClicked(item)"
                      >
                        <v-list-item-content>
                          <div v-if="item.product_name">
                              <v-list-item-title v-text="item.product_name"></v-list-item-title>
                          </div>
                          <div v-else>
                              <v-list-item-title v-text="item.name"></v-list-item-title>
                          </div>
                          <v-list-item-subtitle> reviews: {{item.reviews_len}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                </v-card>
            </v-scroll-y-transition>
        </v-col>
        </v-row>

      </v-card>
    <v-dialog
      v-model="cluster_dialog"
      max-width="1200"
      class="ml-4 scroll-y"
      style="overflow-y: auto;max-height: 700px"
    >
        <ExperimentClusterView v-bind:experiment="experiment"/>
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
  </v-container>
</template>

<script>
import ProductBrowse from "./ProductBrowse";
import ProductService from "../../services/ProductService";
import Experiment_service from "../../services/Experiment_service";
import ExperimentClusterView from "../cluster_experiments/ExperimentClusterView";

export default {
    components: {ProductBrowse, ExperimentClusterView},
  data: () => ({
    breadcrumbs: [],
    search: null,
    caseSensitive: false,
    active: [],
    products: [],
    experiment: {
        pos:{
            clusters: []
        },
        con:{
            clusters:[]
        }
    },
    product_count: 0,
    product_review_cnt: 0,
    cluster_experiment: null,
    experiment_sentences: null,
    cluster_dialog: false,
    alert:false,
    alert_text: '',
    alert_code: 200,
  }),
  methods: {
    async loadBreadCrumbs () {
      try {
        const response = await ProductService.get_index_categories()
        this.breadcrumbs = response.data
        this.$store.commit('SET_INDEX_CATs', response.data)
        console.log('done')
      } catch (error) {
        if (error.response) {
          console.log(error.response)
        }
      }
    },
       async loadProducts (category) {
        const response =  await ProductService.get_products(category)
        this.products = response.data
        console.log(response.data)

    },
    async reloadBreadCrumbs () {
      console.log('Reload')
      this.$store.commit('REM_INDEX_CATs')
      this.loadBreadCrumbs()
    },
      onProductClicked (product){
          this.$store.commit('SET_CLICKED_PRODUCT', product)
          this.$router.push({name: 'product_view', params: {product: product}})
      },
      getExperiment(){
        this.getExperimentSentences(this.active[0])
      },
      async getExperimentSentences(category){

        const config = {
            category: category
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
            this.cluster_dialog = true
        }
        catch (error) {
            if (error.response){
                // other then 2xx
                this.alert_text = error.response.data.error
                this.alert_code = error.response.data.error_code
                this.alert = true
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

  },
  beforeMount () {
    if (this.$store.state.index_categories[0]) {
      console.log('store')
      this.breadcrumbs = this.$store.state.index_categories
    } else {
      console.log('loadBreadCrumbs')
      this.loadBreadCrumbs()
    }
  },
    computed: {
      filter () {
        return this.caseSensitive
          ? (item, search, textKey) => item[textKey].indexOf(search) > -1
          : undefined
      },
      selected () {
        const name = this.active[0]
        if(name == null) return undefined
        var l = name.split(' ')
        this.loadProducts(name)

        var o = {
            name: l[0]
        }
        return o
      },
    }
}
</script>
