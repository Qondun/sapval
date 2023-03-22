

<script>
import { Bar } from 'vue-chartjs'
import {defineStore} from "pinia"
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, BarController } from 'chart.js'
import wardsdata from '../records/inpatientWards.json';
import patientWarnings from '../records/PatientWarnings.json';
import warningList from '../records/warningList.json';



ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


export default {
    name: "WardOverviewChart",
       components: { Bar },
      data: function () {
        return {
      chartData: {
        labels: [ ],
        datasets: [ 
          { label: '1',
            data: [], 
            backgroundColor: '#fff2cc'
          }, {
            label: '2',
            data: [],
            backgroundColor: '#93c47d'
          }, {
            label: '3',
            data: [],
            backgroundColor: '#cf4c22'
          },
          {
            label: '4',
            data: [],
            backgroundColor: '#741b47'
          },
          {
            label: '5',
            data: [],
            backgroundColor: '#190263'
          } ]
      },
      chartOptions: {
        responsive: true
      },
      
      ward: wardsdata.wardsInfo,
      patient: patientWarnings.WarningInfo,
      warnings: warningList.WarningInfo

    }
    
    },
      created: function severityLevelReturn(warningNumberToFind) {
        warning = warnings.find(warnings.warningNumber(warningNumberToFind))
        return warning.getElementById("severityLevel")

    },

      created: function () {
        // Checking if everything works, delete this right after you see that everything works
       // console.log(this.ward);  

        let wardNameList = []
        let wardWarningsArr = [0,0,0,0,0]
        var value = 0
        console.log(wardWarningsArr)



        console.log("printmenow!")      
        this.ward.map((item) => {
         // console.log(item.Avdelning + " : " + item.numPlatser);
          this.chartData.labels.push(item.Address)
          wardNameList.push(item.Address)
          console.log(wardNameList)
          this.chartData.datasets[0].data.push(parseInt(item.numPlatser))
        })
        let len = wardNameList.length;
        console.log(len);
        //let wardWarningArrayList = [len][wardWarningsArr]
       // var wardWarningArray = [...Array(len)].map(e => Array(5).fill(1));
        var wardWarningArray = [...Array(5)].map(e => Array(len).fill(1));


       // this.chartData.datasets[1].data.push(parseInt(wardWarningArray[0]))
        this.chartData.datasets[1].data = wardWarningArray[0].map(x => x);
        console.log(wardWarningArray)
        console.log(this.chartData.datasets[1])


    },
    //components: { BarController }
    persist: true
};
</script>

<template>      
  <Bar
      id="ward-warning-chart"
      :options="chartOptions"
      :data="chartData"
    />
    
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
</style>

