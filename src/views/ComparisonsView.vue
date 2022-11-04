<template>
    <div>
        List of files
    </div>
    <div>
        Selection box
    </div>
    <div>Table with comparisons</div>
    <br>
    <i-table-overview datasets="['3K_2']" />
</template>

<script>
import ITableOverview from '@/components/ITableOverview.vue';
    export default {
        name: "ComparisonsView",
        components: {
            ITableOverview
        }
    }
</script>

<style lang="stylus" scoped>

</style>