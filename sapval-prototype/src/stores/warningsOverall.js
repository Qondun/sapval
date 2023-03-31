import { defineStore } from 'pinia'
import wardsdata from '../records/inpatientWards.json';
import patientWarnings from '../records/PatientWarnings.json';
import warningList from '../records/warningList.json';
import patientInformation from '../records/patientInformation.json';
//import { useWarningsByWardStore } from '../stores/warningsByWard'

export const useOverallWarningsStore = defineStore('overallWarnings', {
    state: () => ({
        initialized: false,
        chartData: {
            labels: [],
            datasets: [
                {
                    label: '1',
                    data: Int16Array,
                    backgroundColor: '#fff2cc',
                    borderColor: 'rgb(201, 203, 207)',
                    borderWidth: 1
                }, {
                    label: '2',
                    data: Int16Array,
                    backgroundColor: '#93c47d',
                    borderColor: 'rgb(201, 203, 207)',
                    borderWidth: 1
                }, {
                    label: '3',
                    data: Int16Array,
                    backgroundColor: '#cf4c22',
                    borderColor: 'rgb(201, 203, 207)',
                    borderWidth: 1


                }, {
                    label: '4',
                    data: Int16Array,
                    backgroundColor: '#741b47',
                    borderColor: 'rgb(201, 203, 207)',
                    borderWidth: 1

                }, {
                    label: '5',
                    data: Int16Array,
                    backgroundColor: '#190263',
                    borderColor: 'rgb(201, 203, 207)',
                    borderWidth: 1

                }]
        },
        ward: wardsdata.wardsInfo,
        patient: patientWarnings.WarningInfo,
        warnings: warningList.WarningInfo,
        patientInfo: patientInformation.PatientAlertDrug
    }),
    getters: {
        getChartData: (state) => state.chartData,
        //  summary(state) { 
        //    const data = useWarningsByWardStore()

        //},
    },
    actions: {
        initialize() {
            if (this.initialized) {
                console.log("already initialized")
                return
            }
            console.log("initializing the overallWarnings data")
            console.log("wtf")
            this.initialized = true
            let totalWarningNumberArray = [0, 0, 0, 0, 0];
            let warningValueList = [];


            this.warnings.map((item) => {
                warningValueList.push(item.severityLevel)
            })

            this.chartData.labels = "Overall"

            for (let i = 0; i < patientWarnings.WarningInfo.length; i++) {
                let obj = patientWarnings.WarningInfo[i];
                console.log(obj.PersonID)

                let severityLevel

                if (obj.Regel == null) {
                    severityLevel = 0
                } else {
                    severityLevel = Number(warningValueList[obj.Regel - 1]) - 1;
                }

                totalWarningNumberArray[severityLevel] += 1;
            }
            console.log('warningNumberArray' + totalWarningNumberArray)


            this.chartData.datasets[0].data = totalWarningNumberArray[0]
            this.chartData.datasets[1].data = totalWarningNumberArray[1]
            this.chartData.datasets[2].data = totalWarningNumberArray[2]
            this.chartData.datasets[3].data = totalWarningNumberArray[3]
            this.chartData.datasets[4].data = totalWarningNumberArray[4]


            console.log('chartdatawarningNumberArray: ' + this.chartData.datasets.data)

            // this.chartData.datasets[0].data = totalWarningNumberArray[0].map(x => x);
            // // console.log(wardWarningArray)
            // console.log('chartdata[0]' + this.chartData.datasets[0].data)

            // this.chartData.datasets[1].data = totalWarningNumberArray[1].map(x => x);
            // //console.log(wardWarningArray)
            // console.log(this.chartData.datasets[1])

            // this.chartData.datasets[2].data = totalWarningNumberArray[2].map(x => x);
            // //console.log(wardWarningArray)
            // console.log(this.chartData.datasets[2])

            // this.chartData.datasets[3].data = totalWarningNumberArray[3].map(x => x);
            // //console.log(wardWarningArray)
            // console.log(this.chartData.datasets[3])

            // this.chartData.datasets[4].data = totalWarningNumberArray[4].map(x => x);
            // //console.log(wardWarningArray)
            // console.log(this.chartData.datasets[4])
        },

        decreaseWarningNumberArray(severityLevel) {
            console.log('decrease warning level for sev: ' + severityLevel)
            let s = Number(severityLevel)
            console.log(this.chartData.datasets[s - 1].data)
            if (this.chartData.datasets[s - 1] > 0) {
                this.chartData.datasets[s - 1] = this.chartData.datasets[s - 1] - 1
            }
        },
    },
})