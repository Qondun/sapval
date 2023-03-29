import { defineStore } from 'pinia'
import wardsdata from '../records/inpatientWards.json';
import patientWarnings from '../records/PatientWarnings.json';
import warningList from '../records/warningList.json';
import patientInformation from '../records/patientInformation.json';
import { useWarningsByWardStore } from '../stores/warningsByWard'

export const useOverallWarningsStore = defineStore('overallWarnings', {
    state: () => ({
        initialized: false,
        chartData: {
            labels: [],
            datasets: [
                {
                    label: '3',
                    data: [],
                    backgroundColor: '#cf4c22',
                    borderColor: 'rgb(201, 203, 207)',
                    borderWidth: 1

                }, {
                    label: '2',
                    data: [],
                    backgroundColor: '#93c47d',
                    borderColor: 'rgb(201, 203, 207)',
                    borderWidth: 1
                }, {
                    label: '1',
                    data: [],
                    backgroundColor: '#fff2cc',
                    borderColor: 'rgb(201, 203, 207)',
                    borderWidth: 1
                }, {
                    label: '4',
                    data: [],
                    backgroundColor: '#741b47',
                    borderColor: 'rgb(201, 203, 207)',
                    borderWidth: 1

                }, {
                    label: '5',
                    data: [],
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
            console.log("initializing the data")
            this.initialized = true
            // Checking if everything works, delete this right after you see that everything works
            // console.log(this.ward);  
            const wardData = useWarningsByWardStore();
            warningNumberArray = wardData.getSumWarningArray();

            this.chartData.datasets[0].data = warningNumberArray[0].reduce((sum, num) => sum + num, 0);
            // console.log(wardWarningArray)
            console.log('chartdata[0]' + this.chartData.datasets[0])

            this.chartData.datasets[1].data = warningNumberArray[1].reduce((sum, num) => sum + num, 0);
            //console.log(wardWarningArray)
            console.log(this.chartData.datasets[1])

            this.chartData.datasets[2].data = warningNumberArray[2].reduce((sum, num) => sum + num, 0);
            //console.log(wardWarningArray)
            console.log(this.chartData.datasets[2])

            this.chartData.datasets[3].data = warningNumberArray[3].reduce((sum, num) => sum + num, 0);
            //console.log(wardWarningArray)
            console.log(this.chartData.datasets[3])

            this.chartData.datasets[4].data = warningNumberArray[4].reduce((sum, num) => sum + num, 0);
            //console.log(wardWarningArray)
            console.log(this.chartData.datasets[4])
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