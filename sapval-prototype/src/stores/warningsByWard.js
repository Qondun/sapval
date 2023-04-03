import { defineStore } from 'pinia';
import wardsdata from '../records/inpatientWards.json';
import patientWarnings from '../records/PatientWarnings.json';
import warningList from '../records/warningList.json';
import patientInformation from '../records/patientInformation.json';

export const useWarningsByWardStore = defineStore('wardWarnings', {
    state: () => ({
        wardWarningArray: [],
        patientLocationList: [],
        sumWarningArray: [],
        wardNameList: [],
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
                },
                {
                    label: '4',
                    data: [],
                    backgroundColor: '#741b47',
                    borderColor: 'rgb(201, 203, 207)',
                    borderWidth: 1
                },
                {
                    label: '5',
                    data: [],
                    backgroundColor: '#190263',
                    borderColor: 'rgb(201, 203, 207)',
                    borderWidth: 1
                },
                {
                    label: 'd1',
                    data: [],
                    backgroundColor: '#fff2cc',
                    borderColor: 'rgb(201, 203, 207)',
                    borderWidth: 1
                }, {
                    label: 'd2',
                    data: [],
                    backgroundColor: '#93c47d',
                    borderColor: 'rgb(201, 203, 207)',
                    borderWidth: 1
                }, {
                    label: 'd3',
                    data: [],
                    backgroundColor: '#cf4c22',
                    borderColor: 'rgb(201, 203, 207)',
                    borderWidth: 1


                }, {
                    label: 'd4',
                    data: [],
                    backgroundColor: '#741b47',
                    borderColor: 'rgb(201, 203, 207)',
                    borderWidth: 1

                }, {
                    label: 'd5',
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
        // sumWarningArray: []

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
            this.sumWarningArray = Array(5).fill(0);
            this.wardNameList = [];
            var value = 0;
            let warningValueList = [];
            let len = wardsdata.wardsInfo.length + 1;
            this.patientLocationList = Array.apply(null, Array(1500)).map(function () { });

            //wardList in order for graph
            this.ward.map((item) => {
                this.chartData.labels.push(item.Address)
                this.wardNameList.push(item.Address)
            })

            let wardWarningArray = [...Array(10)].map(e => Array(len).fill(1));

            //list, in order of alerts, value saved is severity level
            this.warnings.map((item) => {
                warningValueList.push(item.severityLevel)
            })

            for (let i = 0; i < this.patientInfo.length; i++) {
                let obj = this.patientInfo[i]
                this.patientLocationList[obj['Person ID']] = obj.PatientLocation
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

                this.sumWarningArray[severityLevel] += 1;
                //      console.log('warningarray from byward' + sumWarningArray)

                //console.log(`regel: ${obj.Regel} sev level: ${severityLevel}`)
                let personNumber = obj.PersonID;
                let personLocation = this.patientLocationList[personNumber];
                let locationIndex = this.wardNameList.indexOf(personLocation)
                // console.log(locationIndex)
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
            this.wardWarningArray = wardWarningArray

            // this.chartData.datasets[1].data.push(parseInt(wardWarningArray[0]))
            this.chartData.datasets[0].data = wardWarningArray[2].map(x => x);
            // console.log(wardWarningArray)
            //console.log(this.chartData.datasets[0])


            this.chartData.datasets[1].data = wardWarningArray[3].map(x => x);
            //console.log(wardWarningArray)
            //console.log(this.chartData.datasets[3])

            this.chartData.datasets[2].data = wardWarningArray[4].map(x => x);
            //console.log(wardWarningArray)
            //console.log(this.chartData.datasets[4])

            this.chartData.datasets[3].data = wardWarningArray[5].map(x => -x);
            //console.log(wardWarningArray)
            //console.log(this.chartData.datasets[1])

            this.chartData.datasets[4].data = wardWarningArray[6].map(x => -x);
            //console.log(wardWarningArray)
            //console.log(this.chartData.datasets[2])

            this.chartData.datasets[5].data = wardWarningArray[7].map(x => -x);
            //console.log(wardWarningArray)
            //console.log(this.chartData.datasets[1])

            this.chartData.datasets[6].data = wardWarningArray[8].map(x => -x);
            //console.log(wardWarningArray)
            //console.log(this.chartData.datasets[2])

            this.chartData.datasets[7].data = wardWarningArray[9].map(x => -x);
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
            let newSeverity = newSeverityLevel + 2;
            severityLevel = severityLevel - 3;
            console.log(severityLevel);
            console.log(newSeverityLevel);
            console.log(personID)
            // let obj = patientWarnings.WarningInfo[i];
            //console.log(obj.PersonID)

            this.sumWarningArray[severityLevel] += 1;
            console.log('warningarray from byward: ' + this.sumWarningArray[severityLevel])

            //console.log(`regel: ${obj.Regel} sev level: ${severityLevel}`)
            let personNumber = personID;
            let personLocation = this.patientLocationList[personNumber];
            let locationIndex = this.wardNameList.indexOf(personLocation)
            // console.log(len)
            //TODO why did I do this check like this?  Was it a typo?
            if (locationIndex < 0) {
                // console.log(locationIndex)
                console.log('Location index not found so using the top location...')
                locationIndex = Number(len - 1)
                //console.log(locationIndex)

            }
            console.log(this.chartData.datasets);
            console.log('Prev Values: ' + this.wardWarningArray[severityLevel][locationIndex] + ' : ' + this.wardWarningArray[newSeverity][locationIndex])
            this.chartData.datasets[severityLevel].data[locationIndex] -= 1;
            this.chartData.datasets[newSeverity].data[locationIndex] -= 1;

            //this.wardWarningArray[severityLevel][locationIndex] += 1
            //this.wardWarningArray[newSeverity][locationIndex] += 1





        },
    },
})