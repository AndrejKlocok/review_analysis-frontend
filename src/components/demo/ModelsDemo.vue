<template>
    <v-container fluid>
        <DemoBrowse/>
        <v-card
            class="mx-auto"
            max-height="800"
            width="500"
            tile>
            <v-card-title class="indigo white--text headline">
                Interactive demos
            </v-card-title>
            <v-card-text>
                This demo show all models trained within review analysis. Total outcome of trained models is 16 models
                bipolar classification and one regression model.
            </v-card-text>
            <v-card>
                <v-card-title class="headline">
                    Positive/Negative classification
                </v-card-title>
                <v-card-text>
                    Heureka contains 15 domains of products. For each domain there is one trained model, which can
                    determine polarity of sentences based on data on which it was trained. Architecture of models
                    consists of Bert trained networks. Models are used in product review view, to show how different
                    models evaluate given +/- sentences.
                </v-card-text>
            </v-card>
            <v-card>
                <v-card-title class="headline">
                    Text Rating
                </v-card-title>
                <v-card-text>
                    Each review has authors rating. For text rating there is trained model, which predicts texts rating.
                    This model also consists of Bert networks and is trained all product dataset. It is used to determine
                    review relevance in product review view.
                </v-card-text>
            </v-card>
            <v-card>
                <v-card-title class="headline">
                    Irrelevant sentences
                </v-card-title>
                <v-card-text>
                    There are relevant sentences, which addresses key aspects of products and give authors opinion. And then,
                    there are reviews which does tell nothing, these reviews are filtered out during actualization. Model
                    for classification of relevant sentences consists of SVM classifier with FSE embeddings used with it.
                </v-card-text>
            </v-card>
    </v-card>
    </v-container>
</template>

<script>
    import DemoBrowse from "./DemoBrowse";
    export default {
        name: "models_demo",
        components: {DemoBrowse}
    }
</script>

<style scoped>

</style>
