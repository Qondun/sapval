
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
    name: "WarningValueOverviewChart",
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


    created: function () {
        // Checking if everything works, delete this right after you see that everything works
        // console.log(this.ward);  

        let wardNameList = [];
        var value = 0;
        let warningValueList = [];
        let len = wardsdata.wardsInfo.length + 1;

        //let warningValueList = {Array.apply(null, Array(65)).map(function () {})}
        let patientLocationList = Array.apply(null, Array(1500)).map(function () { })
        //var wardWarningArray = [...Array(1500)].map(e => Array(6).fill(0));
        //let wardWarningArray = [...Array(5)].map(e => Array(len).fill(1));




        //wardList in order for graph
        this.ward.map((item) => {
            // console.log(item.Avdelning + " : " + item.numPlatser);
            // this.chartData.labels.push(item.Address)
            wardNameList.push(item.Address)
            //console.log(wardNameList)
            //this.chartData.datasets[0].data.push(parseInt(item.numPlatser))
        })


        let wardWarningArray = [...Array(5)].map(e => Array(len).fill(1));
        // console.log(wardWarningArray)


        //list, in order of alerts, value saved is severity level
        this.warnings.map((item) => {
            warningValueList.push(item.severityLevel)
        })


        for (let i = 0; i < this.patientInfo.length; i++) {
            let obj = this.patientInfo[i]
            patientLocationList[obj['Person ID']] = obj.PatientLocation
        }
        //console.log(patientLocationList)
        let numRulesLength = warningValueList.length;
        let numRules = Array.apply(null, Array(numRulesLength)).map(function (x, i) { return i; })
        console.log("numRules", numRules)
        for (let i = 0; i < numRules.length; i++) {
            numRules[i] += 1
        }
        this.chartData.labels = numRules.map(x => x)
        console.log(numRules)

        let warningNumberArray = [...Array(5)].map(e => Array(numRulesLength).fill(0));
        for (let i = 0; i < patientWarnings.WarningInfo.length; i++) {
            let obj = patientWarnings.WarningInfo[i];
            let severityLevel = 0
            if (obj.Regel == null) {
                severityLevel = 1
            } else {
                severityLevel = Number(warningValueList[obj.Regel - 1]) - 1;
            }
            warningNumberArray[severityLevel][obj.Regel - 1] += 1

        }



        this.chartData.datasets[0].data = warningNumberArray[0].map(x => x);
        // console.log(wardWarningArray)
        //console.log(this.chartData.datasets[0])

        this.chartData.datasets[1].data = warningNumberArray[1].map(x => x);
        //console.log(wardWarningArray)
        //console.log(this.chartData.datasets[1])

        this.chartData.datasets[2].data = warningNumberArray[2].map(x => x);
        //console.log(wardWarningArray)
        //console.log(this.chartData.datasets[2])

        this.chartData.datasets[3].data = warningNumberArray[3].map(x => x);
        //console.log(wardWarningArray)
        //console.log(this.chartData.datasets[3])

        this.chartData.datasets[4].data = warningNumberArray[4].map(x => x);
        //console.log(wardWarningArray)
        //console.log(this.chartData.datasets[4])


    },
    //components: { BarController }
    persist: true
};
</script>

<template>
    <Bar id="warning-value-overview-chart" :options="chartOptions" :data="chartData" />
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

