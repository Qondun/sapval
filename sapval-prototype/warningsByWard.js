import { defineStore } from 'pinia'
import wardsdata from '../records/inpatientWards.json';
import patientWarnings from '../records/PatientWarnings.json';
import warningList from '../records/warningList.json';
import patientInformation from '../records/patientInformation.json';

export const useWarningsByWardStore = defineStore('wardWarnings', {
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
        // Do I need this in both places? 
        ward: wardsdata.wardsInfo,
        patient: patientWarnings.WarningInfo,
        warnings: warningList.WarningInfo,
        patientInfo: patientInformation.PatientAlertDrug,
        sumWarningArray: []

    }),
    getters: {
        getChartData: (state) => state.chartData,

        getSumWarningArray: (state) => state.sumWarningArray,
    },
    actions: {
        initialize() {
            if (this.initialized) {
                console.log("already initialized")
                return
            }
            console.log("initializing wardwarningsData")
            this.initialized = true;
            sumWarningArray = [0, 0, 0, 0, 0];
            let wardNameList = [];
            var value = 0;
            let warningValueList = [];
            let len = wardsdata.wardsInfo.length + 1;
            let patientLocationList = Array.apply(null, Array(1500)).map(function () { })

            //wardList in order for graph
            this.ward.map((item) => {
                this.chartData.labels.push(item.Address)
                wardNameList.push(item.Address)
            })

            let wardWarningArray = [...Array(5)].map(e => Array(len).fill(0));

            //list, in order of alerts, value saved is severity level
            this.warnings.map((item) => {
                warningValueList.push(item.severityLevel)
            })

            for (let i = 0; i < this.patientInfo.length; i++) {
                let obj = this.patientInfo[i]
                patientLocationList[obj['Person ID']] = obj.PatientLocation
            }
            //console.log(patientLocationList)

            for (let i = 0; i < patientWarnings.WarningInfo.length; i++) {
                let obj = patientWarnings.WarningInfo[i];
                //console.log(obj.PersonID)

                let severityLevel

                if (obj.Regel == null) {
                    severityLevel = 0
                } else {
                    severityLevel = Number(warningValueList[obj.Regel - 1]) - 1;
                }

                sumWarningArray[severityLevel] += 1;
                // console.log(sumWarningArray)

                //console.log(`regel: ${obj.Regel} sev level: ${severityLevel}`)
                let personNumber = obj.PersonID;
                let personLocation = patientLocationList[personNumber];
                let locationIndex = wardNameList.indexOf(personLocation)
                // console.log(len)
                if (locationIndex < 0) {
                    // console.log(locationIndex)

                    locationIndex = Number(len - 1)
                    //console.log(locationIndex)

                }
                if (severityLevel == NaN) {
                    // console.print("This alert is NaN")
                    severityLevel = 1
                }

                wardWarningArray[severityLevel][locationIndex] += 1

            }

            // this.chartData.datasets[1].data.push(parseInt(wardWarningArray[0]))
            this.chartData.datasets[2].data = wardWarningArray[0].map(x => -x);
            // console.log(wardWarningArray)
            //console.log(this.chartData.datasets[0])

            this.chartData.datasets[1].data = wardWarningArray[1].map(x => -x);
            //console.log(wardWarningArray)
            //console.log(this.chartData.datasets[1])

            this.chartData.datasets[0].data = wardWarningArray[2].map(x => -x);
            //console.log(wardWarningArray)
            //console.log(this.chartData.datasets[2])

            this.chartData.datasets[3].data = wardWarningArray[3].map(x => x);
            //console.log(wardWarningArray)
            //console.log(this.chartData.datasets[3])

            this.chartData.datasets[4].data = wardWarningArray[4].map(x => x);
            //console.log(wardWarningArray)
            //console.log(this.chartData.datasets[4])

        },
        //TODO: need to move location array so the index can be sent to this function (it is above)
        decreaseWarningNumberArray(severityLevel, locationCode) {
            console.log('decrease warning level for sev: ' + severityLevel + ' location: ' + locationCode)
            let s = Number(severityLevel)

            let l = Number(locationCode)

            if (s < 4 && this.chartData.datasets[s - 1].data[l - 1] < 0) {
                this.chartData.datasets[s - 1].data[l - 1] = this.chartData.datasets[s - 1].data[l - 1] + 1
            }
            if (s > 3 && this.chartData.datasets[s - 1].data[l - 1] > 0) {
                this.chartData.datasets[s - 1].data[l - 1] = this.chartData.datasets[s - 1].data[l - 1] - 1
            }
            console.log(this.chartData.datasets[s - 1].data)
            //if (this.chartData.datasets[severityLevel - 1].data[locationCode - 1] > 1) {
            //this.chartData.datasets[severityLevel - 1].data[locationCode - 1] = this.chartData.datasets[severityLevel - 1].data[locationCode - 1] - 1
            //}
        },
    },
})