import { defineStore } from 'pinia';
import wardsdata from '../records/inpatientWards.json';
import patientWarnings from '../records/PatientWarnings.json';
import warningList from '../records/warningList.json';
import patientInformation from '../records/patientInformation.json';
import { useActivityLogStore } from '../stores/logger';
import { useLocalStorage } from "@vueuse/core";


export const useWarningsByWardStore = defineStore('wardWarnings', {
    state: () => ({
        chartData: useLocalStorage('warningsByWardChartData', {}),
        sumWarningArray: useLocalStorage('sumWarningArray', []),
        wardWarningArray: useLocalStorage('wardWarningArray', []),
        patientLocationList: useLocalStorage('patientLocationList', []),
        wardNameList: useLocalStorage('wardNameList', []),

        // Do I need this in both places? 
        ward: wardsdata.wardsInfo,
        patient: patientWarnings.WarningInfo,
        warnings: warningList.WarningInfo,
        patientInfo: patientInformation.PatientAlertDrug,
        // sumWarningArray: []

    }),
    getters: {
        getChartData: (state) => state.chartData,
        getSumWarningArray: (state) => state.sumWarningArray,
    },
    actions: {
        initialize() {
            this.chartData = {
                labels: [],
                datasets: [
                    {
                        label: '1',
                        data: [],
                        backgroundColor: '#eca28a'
                    }, {
                        label: '2',
                        data: [],
                        backgroundColor: '#cf4c22'
                    }, {
                        label: '3',
                        data: [],
                        backgroundColor: '#772c14'
                    },
                    {
                        label: '1',
                        data: [],
                        backgroundColor: '#1B4774'
                    }, {
                        label: '2',
                        data: [],
                        backgroundColor: '#741b47'
                    }, {
                        label: '3',
                        data: [],
                        backgroundColor: '#47741B'
                    }]

            }

            console.log("initializing wardwarningsData")
            this.sumWarningArray = Array(5).fill(0);
            this.wardNameList = [];
            //var value = 0;
            let warningValueList = [];
            let len = wardsdata.wardsInfo.length + 1;
            this.patientLocationList = Array.apply(null, Array(1500)).map(function () { });

            //wardList in order for graph
            this.ward.map((item) => {
                this.chartData.labels.push(item.KeyNamn)
                this.wardNameList.push(item.KeyNamn)
            })
            //console.log(this.wardNameList)

            let wardWarningArray = [...Array(6)].map(e => Array(len).fill(0));


            //list, in order of alerts, value saved is severity level
            this.warnings.map((item) => {
                warningValueList.push(item.severityLevel)
            })
            // console.log(warningValueList + 'warningvaluelist')

            for (let i = 0; i < this.patientInfo.length; i++) {
                let obj = this.patientInfo[i]
                this.patientLocationList[obj['Person ID']] = obj.PatientLocation
                console.log('Setting patient: ' + obj['Person ID'] + ' to ' + obj.PatientLocation)
            }
            //console.log(this.patientLocationList + 'patientlocationlist')

            for (let i = 0; i < patientWarnings.WarningInfo.length; i++) {
                let obj = patientWarnings.WarningInfo[i];
                // console.log(obj.Regel + 'PersonID')

                let severityLevel

                if (obj.Regel == null) {
                    severityLevel = 0
                } else {
                    severityLevel = Number(warningValueList[obj.Regel - 1]) - 1;
                }
                // console.log(severityLevel)
                //  this.sumWarningArray[severityLevel] += 1;
                // console.log(this.sumWarningArray)
                //      console.log('warningarray from byward' + sumWarningArray)

                //console.log(`regel: ${obj.Regel} sev level: ${severityLevel}`)
                let personNumber = obj.PersonID;
                let personLocation = this.patientLocationList[personNumber].toUpperCase();

                let locationIndex = this.wardNameList.indexOf(personLocation)
                //console.log(personNumber + 'personNumber ')
                //console.log(locationIndex + 'locaitonindex')
                //console.log(personLocation + 'personLocation')
                //console.log(this.wardNameList + 'warndnamelist')
                // console.log(len)
                if (locationIndex < 0) {
                    // console.log(locationIndex)

                    locationIndex = Number(len - 1)
                    //console.log(locationIndex)

                }
                if (isNaN(severityLevel)) {
                    console.log("This alert at index i[" + i + "] is NaN[" + severityLevel + "]")
                    severityLevel = 1
                }

                //console.log('severityLevel: ' + severityLevel)
                //console.log('locationIndex: ' + locationIndex)
                //console.log(wardWarningArray)


                wardWarningArray[severityLevel][locationIndex] += 1

            }
            this.wardWarningArray = wardWarningArray

            // this.chartData.datasets[1].data.push(parseInt(wardWarningArray[0]))
            this.chartData.datasets[0].data = wardWarningArray[0].map(x => x);
            // console.log(wardWarningArray)
            //console.log(this.chartData.datasets[0])


            this.chartData.datasets[1].data = wardWarningArray[1].map(x => x);
            //console.log(wardWarningArray)
            //console.log(this.chartData.datasets[3])

            this.chartData.datasets[2].data = wardWarningArray[2].map(x => x);
            //console.log(wardWarningArray)
            //console.log(this.chartData.datasets[4])

            this.chartData.datasets[3].data = wardWarningArray[3].map(x => -x);
            //console.log(wardWarningArray)
            //console.log(this.chartData.datasets[1])

            this.chartData.datasets[4].data = wardWarningArray[4].map(x => -x);
            //console.log(wardWarningArray)
            //console.log(this.chartData.datasets[2])

            this.chartData.datasets[5].data = wardWarningArray[5].map(x => -x);
            //console.log(wardWarningArray)
            //console.log(this.chartData.datasets[1])

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
        testButton(a, b, c) {
            console.log('test button: ' + a);
        },

        // needs error checking -> if no error to clear then don't add solved errors 
        completedWarningWardChartUpdate(severityLevel, newSeverityLevel, personID) {
            let newSeverity = newSeverityLevel;
            severityLevel = severityLevel - 1;
            //console.log(severityLevel);
            //console.log(newSeverityLevel);
            //console.log(personID)
            // let obj = patientWarnings.WarningInfo[i];
            //console.log(obj.PersonID)

            this.sumWarningArray[severityLevel] += 1;
            console.log('warningarray from byward: ' + this.sumWarningArray[severityLevel])

            //console.log(`regel: ${obj.Regel} sev level: ${severityLevel}`)
            let personNumber = parseInt(personID);
            //console.log('Hi there: ' + this.patientLocationList)

            //console.log('Hi there: ' + personNumber + ' : ' + this.patientLocationList[personNumber])
            let personLocation = this.patientLocationList[personNumber].toUpperCase();
            let locationIndex = this.wardNameList.indexOf(personLocation)
            // console.log(len)
            //TODO why did I do this check like this?  Was it a typo?
            if (locationIndex < 0) {
                // console.log(locationIndex)
                console.log('Location index not found so using the top location...')
                locationIndex = Number(len - 1)
                //console.log(locationIndex)

            }
            console.log('location index: ' + locationIndex)
            console.log('severityLevel: ' + severityLevel)

            //console.log(this.chartData.datasets);
            let msg = 'personNumber[' + personNumber + '] location[' + personLocation + '] location index[' + locationIndex + '] severityLevel[' + severityLevel + '] newSeverity[' + newSeverity + '] Prev Values: ' + this.chartData.datasets[severityLevel].data[locationIndex] + ' : ' + this.chartData.datasets[newSeverity].data[locationIndex];
            this.chartData.datasets[severityLevel].data[locationIndex] -= 1;
            this.chartData.datasets[newSeverity].data[locationIndex] -= 1;

            let act = useActivityLogStore()
            act.logAppend(msg);
            console.log(msg)
            //this.wardWarningArray[severityLevel][locationIndex] += 1
            //this.wardWarningArray[newSeverity][locationIndex] += 1





        },
    },
})