
<script>
import { Bar } from 'vue-chartjs'
import { defineStore } from "pinia"
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, BarController } from 'chart.js'
import wardsdata from '../records/inpatientWards.json';
import patientWarnings from '../records/PatientWarnings.json';
import warningList from '../records/warningList.json';
import patientInformation from '../records/patientInformation.json';
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useOverallWarningsStore } from '../stores/warningsOverall'
//import { useWarningsByWardStore } from '../stores/warningsByWard'


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: "AllWarningChart",
    components: { Bar },
    watch: {
        chartData: {
            handler(newData, oldData) {
                // Maybe force chart to refresh here...?
                // Note: if you resize the window the chart does refresh itself.
                console.log("Data updated..")
            },
            deep: true,
        },
    },
    data: function () {
        const overallWarningsStore = useOverallWarningsStore()
        overallWarningsStore.initialize()
        const warningsStoreRef = storeToRefs(useOverallWarningsStore())
        console.log("allocated warningsStore for allWarningChart")
        return {
            storeData: overallWarningsStore,
            chartData: warningsStoreRef.getChartData,  // This should keep it responsive since its a reference?
            chartOptions: {
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                }
            },

            ward: wardsdata.wardsInfo,
            patient: patientWarnings.WarningInfo,
            warnings: warningList.WarningInfo,
            patientInfo: patientInformation.PatientAlertDrug

        }

    },
    options: {
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false
            },
        }
    },
    computed: {
        // a computed getter
        warningsChartData() {
            // `this` points to the component instance
            return this.storeData.getChartData
        },
        chartOptionsComputed() {
            return this.chartOptions
        }
    },
    created: function () {


    },
    //components: { BarController }
    persist: true
};
</script>

<template>
    <Bar ref="theChart" id="all-warning-chart" :options="chartOptionsComputed" :data="chartData" />
    <button @click="this.storeData.decreaseWarningNumberArray(3)" type="button">TestAllWarningChart</button>
</template>

<style>
chart {

    position: absolute;
    width: 100%;
    height: 100vh;


}
</style>
