<template>
    <v-container fluid>
    <ProductBrowse></ProductBrowse>
    <h2>Product tree view</h2>
      <v-card
        class="mx-auto"
        tile>
          <v-card-title class="indigo white--text headline">
          Domain categories
        </v-card-title>
          <v-row
          class="pa-4"
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
              class="ml-4"
              :items="breadcrumbs"
              activatable
              item-key="name"
              open-on-click
              transition
              color="warning"
            >
                <template v-slot:prepend="{item}">
                <v-icon v-if="!item.children">mdi-account</v-icon>
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
                    class="pt-6 mx-auto"
                    flat
                    max-width="400"
                >
                    <v-card-text>
                        <h2 class="headline mb-2"> Category: {{ selected.name }}</h2>
                        <h2 class="headline mb-2"> Count of products: {{ products.total_products }}</h2>
                        <h2 class="headline mb-2"> Count of reviews: {{ products.total_reviews }}</h2>
                    </v-card-text>
                    <v-list subheader>
                      <v-subheader>Products </v-subheader>

                      <v-list-item
                        v-for="item in products.products"
                        :key="item.product_name"
                        @click="onProductClicked(item)"
                      >

                        <v-list-item-content>
                          <v-list-item-title v-text="item.product_name"></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                </v-card>
            </v-scroll-y-transition>
        </v-col>
        </v-row>

      </v-card>
  </v-container>
</template>

<script>
import ProductBrowse from "./ProductBrowse";
import DataService from '../../services/DataService'
import ProductService from "../../services/ProductService";

export default {
    components: {ProductBrowse},
  data: () => ({
    breadcrumbs: [],
    search: null,
    caseSensitive: false,
    active: [],
    products: [],
    product_count: 0,
    product_review_cnt: 0
  }),
  methods: {
    async loadBreadCrumbs () {
      try {
        const response = await DataService.get_index_categories()
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

    },
    async reloadBreadCrumbs () {
      console.log('Reload')
      this.$store.commit('REM_INDEX_CATs')
      this.loadBreadCrumbs()
    },
      onProductClicked (product){
          this.$store.commit('SET_CLICKED_PRODUCT', product)
          this.$router.push({name: 'product_view', params: {product: product}})
      }
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
