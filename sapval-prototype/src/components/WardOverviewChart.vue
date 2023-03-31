
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
import { useWarningsByWardStore } from '../stores/warningsByWard';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: "WardOverviewChart",
  components: { Bar },
  watch: {
    chartData: {
      handler(newData, oldData) {
        console.log("data updated..")
      },
      deep: true,
    },
  },
  data: function () {
    const wardsStore = useWarningsByWardStore()
    wardsStore.initialize()
    const wardsStoreRef = storeToRefs(useWarningsByWardStore())
    console.log("allocated wardsStore")
    return {
      storeData: wardsStore,
      chartData: wardsStoreRef.getChartData,
      chartOptions: {
        responsive: false,
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

  computed: {
    //getter
    warningsChartData() {
      return this.storeData.getChartData
    },
    chartOptionsComputed() {
      return this.chartOptions
    }
  },
  created: function () {

  },
  persist: true
};
</script>

<template>
  <!-- <Bar id="ward-warning-chart" :options="chartOptions" :data="chartData" />  -->
  <Bar ref="theChart" id="ward-warning-chart" :options="chartOptionsComputed" :data="chartData" />

  <button @click="this.storeData.decreaseWarningNumberArray(2, 4)" type="button">test</button>

  <!-- <Bar ref="theChart" id="ward-warning-chart" :options="chartOptionsComputed" :data="chartData" />  -->
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
#ward-warning-chart {
  width: 48%;
  float: left;
  top: 33px;
}
</style>

