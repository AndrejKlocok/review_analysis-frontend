<template>
  <v-container fluid>
      <h2>Generate Dataset</h2>
  <v-card
    class="mx-auto"

    tile>
      <v-row>
          <v-col>
              <v-treeview
                v-model="categories"
                dense
                class="ml-4"
                :items="breadcrumbs"
                activatable
                item-key="name"
                open-on-click
                selectable
              >
              </v-treeview>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col>
            <v-row>
                <template v-if="!categories.length">
              No categories selected.
            </template>
            <template v-else>
              Selected {{categories.length}} categories
            </template>
            </v-row>
            <v-row>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                  >
                   <v-select
                      v-model="task_type_select"
                      :items="task_type_items"
                      :rules="[v => !!v || 'Item is required']"
                      label="Type of task"
                      required
                    ></v-select>
                    <v-select
                      v-model="model_type_select"
                      :items="model_type_items"
                      :rules="[v => !!v || 'Item is required']"
                      label="model type"
                      required
                    ></v-select>
                    <v-select
                      v-model="sentence_type_select"
                      :items="sentence_type_items"
                      :rules="[v => !!v || 'Item is required']"
                      label="sentence type"
                      required
                    ></v-select>
                    <v-checkbox
                      v-model="equal_checkbox"
                      label="Equal dataset"
                    ></v-checkbox>
                    <v-text-field
                      v-model="min_sentence_len"
                      hide-details
                      single-line
                      type="number"
                      label="Min sentence length"
                      :rules="[ min_sentence_rules ] "
                    />
                    <v-text-field
                      v-model="max_sentence_len"
                      hide-details
                      single-line
                      type="number"
                      label="Max sentence length"
                      :rules="[ max_sentence_rules ]"
                    />
                </v-form>
            </v-row>
            <v-row>
              <v-btn
                dark
                class="cyan"
                :disabled="!valid"
                @click="onGenerateDatasetClicked">
                Generate
              </v-btn>
            </v-row>

        </v-col>
      </v-row>
  </v-card>
      <v-dialog
      v-model="alert"
      max-width="300"
    >
       <v-card>
         <v-card-text>
          {{alert_text}}
         </v-card-text>
       </v-card>
   </v-dialog>
  </v-container>
</template>

<script>
import DataService from '../services/DataService'
import GenerateDataService from "../services/GenerateDataService"

export default {
  data: () => ({
    breadcrumbs: [],
    active: '',
    alert: false,
    alert_text: '',
    categories: [],
    selectionType: 'leaf',
    valid: false,
    select: null,
    task_type_select: null,
    model_type_select: null,
    sentence_type_select: null,
    task_type_items: [
        'embeddings',
        'bipolar classification',
        'regression on rating'
    ],
    model_type_items: [
        'general',
         'bert'
    ],
    sentence_type_items: [
        'sentence = row',
        'section of +/- = row',
        'whole section of +/- = row',
        'whole review = row'
    ],
     equal_checkbox: false,
     min_sentence_len: 3,
     max_sentence_len: 24,

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
    async reloadBreadCrumbs () {
      console.log('Reload')
      this.$store.commit('REM_INDEX_CATs')
      this.loadBreadCrumbs()
    },
      min_sentence_rules (value ){
        if (value == null) {
            return "Invalid value"
        }
        else if (value > 1 && value < this.max_sentence_len){
            return true
        }
        else {
            return "Invalid value"
        }
      },
      max_sentence_rules (value ){
        if (value == null) {
            return "Invalid value"
        }
        else if (value > this.max_sentence_len && value < 50){
            return true
        }
        else {
            return "Invalid value, max: 50"
        }
      },
      async onGenerateDatasetClicked () {

        const config = {
            task_type: this.task_type_select,
            model_type: this.model_type_select,
            sentence_type: this.sentence_type_select,
            equal: this.equal_checkbox,
            sentence_min_len: this.min_sentence_len,
            sentence_max_len: this.max_sentence_len,
            categories: this.categories
        }
        const response = await GenerateDataService.generate_dataset(config)
        var fileURL = window.URL.createObjectURL(new Blob([response.data]))
        var fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', 'data.zip');
        document.body.appendChild(fileLink);
        fileLink.click();
      }
  },
  beforeMount () {
    if (this.$store.state.index_categories[0]) {
      console.log('store')
      this.breadcrumbs = this.$store.state.index_categories
      console.log(this.breadcrumbs)
    } else {
      console.log('loadBreadCrumbs')
      this.loadBreadCrumbs()
    }
  }
}
</script>
