
<script>
import { Bar } from 'vue-chartjs'
import { defineStore } from "pinia"
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, BarController } from 'chart.js'
import wardsdata from '../records/inpatientWards.json';
import patientWarnings from '../records/PatientWarnings.json';
import warningList from '../records/warningList.json';
import patientInformation from '../records/patientInformation.json';



ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


export default {
  name: "WardOverviewChart",
  components: { Bar },
  data: function () {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            label: '1',
            data: [],
            backgroundColor: '#fff2cc',
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
          }]
      },
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
  //not using this..
  // created: function severityLevelReturn(warningNumberToFind) {
  //  warning = warnings.find(warnings.warningNumber(warningNumberToFind))
  //  return warning.getElementById("severityLevel")
  //},

  created: function () {
    // Checking if everything works, delete this right after you see that everything works
    // console.log(this.ward);  

    let wardNameList = [];
    var value = 0;
    let warningValueList = [];
    let len= wardsdata.wardsInfo.length +1;

    //let warningValueList = {Array.apply(null, Array(65)).map(function () {})}
    let patientLocationList = Array.apply(null, Array(1500)).map(function () { })
    //var wardWarningArray = [...Array(1500)].map(e => Array(6).fill(0));
    //let wardWarningArray = [...Array(5)].map(e => Array(len).fill(1));



    //wardList in order for graph
    this.ward.map((item) => {
      // console.log(item.Avdelning + " : " + item.numPlatser);
      this.chartData.labels.push(item.Address)
      wardNameList.push(item.Address)
      //console.log(wardNameList)
      //this.chartData.datasets[0].data.push(parseInt(item.numPlatser))
    })

    //let len = wardNameList.length;
    
    let wardWarningArray = [...Array(5)].map(e => Array(len).fill(1));
    console.log(wardWarningArray)


    //list, in order of alerts, value saved is severity level
    this.warnings.map((item) => {
      warningValueList.push(item.severityLevel)
    })


    for (let i = 0; i < this.patientInfo.length; i++) {
      let obj = this.patientInfo[i]
      patientLocationList[obj['Person ID']]=obj.PatientLocation
    }
    //console.log(patientLocationList)


    for (let i = 0; i < patientWarnings.WarningInfo.length; i++) {
      let obj = patientWarnings.WarningInfo[i];
      //console.log(obj.PersonID)

      let severityLevel

      if ( obj.Regel == null ) {
        severityLevel = 0
      } else {
        severityLevel = Number(warningValueList[obj.Regel - 1]) - 1;
      }

      //console.log(`regel: ${obj.Regel} sev level: ${severityLevel}`)
      let personNumber = obj.PersonID;
      let personLocation = patientLocationList[personNumber];
      let locationIndex = wardNameList.indexOf(personLocation)
     // console.log(len)
      if (locationIndex < 0){
       // console.log(locationIndex)

        locationIndex = Number(len -1)
        //console.log(locationIndex)

      }
      if (severityLevel == NaN){
        console.print("This alert is NaN")
        severityLevel = 1
      }

      //console.log(wardWarningArray[0][0])
      //wardWarningArray[severityLevel-1][0]+=1
      //console.log(wardWarningArray) 
      //console.log(`s:${severityLevel} i:${locationIndex}`)
      wardWarningArray[severityLevel][locationIndex] +=  1

      

      //console.log(severityLevel);
      //console.log(personNumber)

      
      //let patientLocationID = this.ward.getElementByID("Address").value;


      //  for (let j = 0; j < patientInformation.PatientAlertDrug.length; j++) {
      //   let sub = patientInformation.PatientAlertDrug[j];

      // if (sub['Person ID']==obj.PersonID){
      //  for (let k = 0; k < wardNameList.length; k++) {

      //  if (wardNameList[k] == sub.PatientLocation){
      //    wardWarningArray[k][warningValueList[obj.Regel - 1]]=wardWarningArray[k][warningValueList[obj.Regel - 1]]+1
      //    break
      //  }
      //   }
    }

    //console.log(sub['Person ID']);
    //console.log(wardWarningArray)
    //console.log(obj.PersonID);
    //}
  //}
     // wardWarningArray[obj.PersonID][warningValueList[obj.Regel - 1]] = wardWarningArray[obj.PersonID][warningValueList[obj.Regel - 1]] + 1;

      //console.log(wardWarningArray)
      // console.log(obj.PersonID);



    // patient.forEach(function(obj) { console.log(obj.); });


  // console.log(len);
  //let wardWarningArrayList = [len][wardWarningsArr]
  // var wardWarningArray = [...Array(len)].map(e => Array(5).fill(1));


  // this.chartData.datasets[1].data.push(parseInt(wardWarningArray[0]))
  this.chartData.datasets[0].data = wardWarningArray[0].map(x => -x);
 // console.log(wardWarningArray)
    //console.log(this.chartData.datasets[0])

    this.chartData.datasets[1].data = wardWarningArray[1].map(x => -x);
  //console.log(wardWarningArray)
  //console.log(this.chartData.datasets[1])

  this.chartData.datasets[2].data = wardWarningArray[2].map(x => -x);
  //console.log(wardWarningArray)
  //console.log(this.chartData.datasets[2])

  this.chartData.datasets[3].data = wardWarningArray[3].map(x => x);
  //console.log(wardWarningArray)
  //console.log(this.chartData.datasets[3])

  this.chartData.datasets[4].data = wardWarningArray[4].map(x => x);
  //console.log(wardWarningArray)
  //console.log(this.chartData.datasets[4])


},
//components: { BarController }
persist: true
};
</script>

<template>
  <Bar id="ward-warning-chart" :options="chartOptions" :data="chartData" />
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

