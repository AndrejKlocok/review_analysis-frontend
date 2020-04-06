<template>
  <v-container fluid>
    <v-card class="d-inline-block mx-auto">
      <v-card-title class="indigo white--text headline">
                          Actualize reviews
      </v-card-title>
      <v-row>
        <v-col>
        <v-list subheader>
            <v-subheader>Product categories </v-subheader>
            <v-list-item
              v-for="item in categories"
              :key="item"
              @click="onCategoryClicked(item)"
            >
              <v-list-item-content>
                <v-list-item-title v-text="item"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col class="d-flex text-center">
        <v-card width="700">
          <v-card-title class="headline">
            Graphs {{selected_category}}
          </v-card-title>
          <GChart
             type="LineChart"
             :data="chart_review"
             :options="chartOptions_review"
         />
          <GChart
             type="LineChart"
             :data="chart_new_products"
             :options="chartOptions_new_products"
         />
          <GChart
             type="LineChart"
             :data="chart_new_product_reviews"
             :options="chartOptions_new_product_reviews"
         />
          <GChart
             type="LineChart"
             :data="chart_affected_products"
             :options="chartOptions_affected_products"
         />
        </v-card>
      </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import DataService from "../../services/DataService";
import {GChart} from "vue-google-charts";

export default {
    components: {GChart},
    data: () => ({
      selected_category: 'All product domains',
      categories: [
        'All product domains',
        'Elektronika',
        'Bile zbozi',
        'Dum a zahrada',
        'Chovatelstvi',
        'Auto-moto',
        'Detske zbozi',
        'Obleceni a moda',
        'Filmy knihy hry',
        'Kosmetika a zdravi',
        'Sport',
        'Hobby',
        'Jidlo a napoje',
        'Stavebniny',
        'Sexualni a eroticke pomucky'
      ],
      alert:false,
      alert_text: '',
      alert_code: 200,
      chart_review: [],
      chartOptions_review: {
        legend: { position: 'none' },
        title: 'Reviews in time',
      },
      chart_affected_products: [],
      chartOptions_affected_products: {
        legend: { position: 'none' },
        title: 'Affected_products in time',
      },
      chart_new_product_reviews: [],
      chartOptions_new_product_reviews: {
        legend: { position: 'none' },
        title: 'New products reviews in time',
      },
      chart_new_products: [],
      chartOptions_new_products: {
        legend: { position: 'none' },
        title: 'New products in time',
      },

  }),
  methods: {
      onCategoryClicked (category){
          console.log(category)
          this.selected_category = category
          this.getCategoryStatistics(category)
      },
      async getCategoryStatistics(category){

        const config = {
            category: category
        }
        try {
            const response = await DataService.category_statistics(config)
            console.log(response.data)
            var chart_data = [['Time', 'review count']]
            response.data.review_count.forEach(function (item) {
                chart_data.push([item[0], item[1]])
            })
            this.chart_review = chart_data

            chart_data = [['Time', 'new product count']]
            response.data.new_products.forEach(function (item) {
                chart_data.push([item[0], item[1]])
            })
            this.chart_new_products = chart_data

            chart_data = [['Time', 'new product review count']]
            response.data.new_product_reviews.forEach(function (item) {
                chart_data.push([item[0], item[1]])
            })
            this.chart_new_product_reviews = chart_data

            chart_data = [['Time', 'Affected products review count']]
            response.data.affected_products.forEach(function (item) {
                chart_data.push([item[0], item[1]])
            })
            this.chart_affected_products = chart_data

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
        this.onCategoryClicked('All product domains')
  },
    computed: {
    }
}
</script>

<style scoped>

</style>
