<template>
    <v-container fluid>
        <DemoBrowse/>
        <h1>Interactive demos</h1>
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
