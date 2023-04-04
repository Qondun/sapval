
<script>
import { Bar, getElementAtEvent } from 'vue-chartjs'
import { defineStore } from "pinia"
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, BarController } from 'chart.js'
import wardsdata from '../records/inpatientWards.json';
import patientWarnings from '../records/PatientWarnings.json';
import warningList from '../records/warningList.json';
import patientInformation from '../records/patientInformation.json';
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useWarningsByRuleStore } from '../stores/warningsByRule'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: "WarningValueOverviewChart",
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
        const warningsStore = useWarningsByRuleStore()
        warningsStore.initialize()
        const warningsStoreRef = storeToRefs(useWarningsByRuleStore())
        console.log("allocated warningsStore")
        return {
            storeData: warningsStore,
            chartData: warningsStoreRef.getChartData, // This should keep it responsive since its a reference?
            chartOptions: {
                responsive: false,
                scales: {
                    x: {
                        stacked: true,

                    },
                    y: {
                        stacked: true,
                        //max: 200,
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                    }
                },
                onClick: (event, item) => {
                    console.table(event);
                    // const idx = this.getElementAtEvent(event)[0]._index;
                    // console.log(idx);
                }
            },

            ward: wardsdata.wardsInfo,
            patient: patientWarnings.WarningInfo,
            warnings: warningList.WarningInfo,
            patientInfo: patientInformation.PatientAlertDrug

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
    <Bar ref="theChart" id="warning-value-overview-chart" :options="chartOptionsComputed" :data="chartData" />
    <!-- <button @click="this.storeData.decreaseWarningNumberArray(3, 2)" type="button">Test</button> -->
</template>

<style>
/* chart {
    background-color: #c41a1a;
    background: #FFFFFF;
    border: none;
    border-radius: 2px;
    box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);
    width: "640";
    height: "480";
} */
#warning-value-overview-chart {
    width: 48%;
    float: left;
    top: 33px;
}
</style>

