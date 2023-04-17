import { defineStore } from 'pinia'
import wardsdata from '../records/inpatientWards.json';
import patientWarnings from '../records/PatientWarnings.json';
import warningList from '../records/warningList.json';
import patientInformation from '../records/patientInformation.json';
import { useLocalStorage } from "@vueuse/core";

export const useWarningsByRuleStore = defineStore('warnings', {
    state: () => ({
        warningValueListWithSpacer: useLocalStorage('warningValueListWithSpacer', []),
        severityLevelListWithSpacer: useLocalStorage('severityLevelListWithSpacer', []),
        chartData: useLocalStorage('warningsByRuleChartData', {}),
        ward: wardsdata.wardsInfo,
        patient: patientWarnings.WarningInfo,
        warnings: warningList.WarningInfo,
        patientInfo: patientInformation.PatientAlertDrug
    }),
    getters: {
        getChartData: (state) => state.chartData,
    },
    actions: {
        initialize() {
            this.chartData = {
                labels: [],
                datasets: [
                    {
                        label: 'Alert 1',
                        data: [],
                        backgroundColor: '#eca28a'
                    }, {
                        label: 'Alert 2',
                        data: [],
                        backgroundColor: '#cf4c22'
                    }, {
                        label: 'Alert 3',
                        data: [],
                        backgroundColor: '#772c14'
                    },
                    {
                        label: 'Assessed',
                        data: [],
                        backgroundColor: '#47741B'
                    }]
            };

            console.log("initializing the data")
            this.initialized = true
            // Checking if everything works, delete this right after you see that everything works
            // console.log(this.ward);  

            let wardNameList = [];
            //var value = 0;
            let warningValueList = [];
            let len = wardsdata.wardsInfo.length + 1;
            let numRulesLength = 0;
            let numRules;

            this.warningValueListWithSpacer = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 10, 11, 12, 13, 14, 15, 0, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 0, 34, 35, 36, 37, 38, 39, 40, 0, 41, 42, 43, 44, 45, 46, 47, 48, 0, 49, 50, 0, 51, 52, 53, 54, 55, 0, 56, 57, 58, 0, 59, 60, 61, 62];
            //let warningListToString = warningValueListWithSpacers.toString();
            this.severityLevelListWithSpacer = [1, 2, 1, 2, 1, 1, 1, 1, 1, 0, 2, 1, 2, 3, 2, 2, 0, 1, 1, 1, 3, 1, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1, 3, 3, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 3, 3, 1, 2, 2, 2, 2, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1];

            // let warningNumberArray;
            // let warningValueListWithSpacer = [];
            //let severityLevelListWithSpacer = [];


            //let warningValueList = {Array.apply(null, Array(65)).map(function () {})}
            let patientLocationList = Array.apply(null, Array(1500)).map(function () { })

            //wardList in order for graph
            this.ward.map((item) => {
                // console.log(item.Avdelning + " : " + item.numPlatser);
                // this.chartData.labels.push(item.Address)
                wardNameList.push(item.Address)
                //console.log(wardNameList)
                //this.chartData.datasets[0].data.push(parseInt(item.numPlatser))
            })

            // console.log(this.warningValueListWithSpacer)
            //list, in order of alerts, value saved is severity level
            this.warnings.map((item) => {
                warningValueList.push(item.severityLevel)
            })


            for (let i = 0; i < this.patientInfo.length; i++) {
                let obj = this.patientInfo[i]
                patientLocationList[obj['Person ID']] = obj.PatientLocation
            }
            //console.log(patientLocationList)
            //numRulesLength = warningValueList.length + 6;
            numRulesLength = this.warningValueListWithSpacer.length;
            // numRules = Array.apply(null, Array(numRulesLength)).map(function (x, i) { return i; })
            //console.log("numRules", numRules)
            //for (let i = 0; i < numRules.length; i++) {
            //    numRules[i] += 1
            //}
            //this.chartData.labels = numRules.map(x => x)
            let chartXAxisLabel = this.warningValueListWithSpacer;
            for (let i = 0; i < chartXAxisLabel.length; i++) {
                if (chartXAxisLabel[i] == 0) {
                    chartXAxisLabel[i] = null
                }

            }
            this.chartData.labels = chartXAxisLabel
            //console.log(numRules)
            // numRules is the numbers 1-63. I need to add in a space after 9-10, 15-16 33-34, 40-41, 48-49, 50-51 and 55-56. This gives the array an extra 7 spaces 
            // required. So I need to create a function that  moves things into the array accordingly. 


            let warningNumberArray = [...Array(10)].map(e => Array(numRulesLength).fill(0));
            // console.log("Warning Number Array", warningNumberArray)
            for (let i = 0; i < patientWarnings.WarningInfo.length; i++) {
                let obj = patientWarnings.WarningInfo[i];
                let severityLevel = 0
                let matchIndex = -1
                if (obj.Regel == null) {
                    severityLevel = 1
                } else {
                    //severityLevel = Number(warningValueList[obj.Regel - 1]) - 1;
                    for (let j = 0; j < this.warningValueListWithSpacer.length; j++) {
                        if (obj.Regel == this.warningValueListWithSpacer[j]) {
                            matchIndex = j;
                            severityLevel = this.severityLevelListWithSpacer[matchIndex];
                        }
                        //if (matchIndex > -1) {
                        //severityLevel = severityLevelListWithSpacer[matchIndex]
                        //   console.log(severityLevel + 'severityLevel')
                        // console.log(matchIndex + 'matchIndex')

                        //warningNumberArray[severityLevel - 1][matchIndex] += 1


                    }
                }
                // console.log(severityLevel + "severityLevel");
                //console.log(matchIndex + 'matchIndex');
                //console.log(i + 'i')
                if (isNaN(matchIndex)) {
                    console.log("This alert at index i[" + i + "] is NaN[" + severityLevel + "]")
                    severityLevel = 1
                }

                if (matchIndex > -1) {
                    warningNumberArray[severityLevel - 1][matchIndex] += 1
                    //  console.log(warningNumberArray)
                }

            }
            // for (let i = 0; i < 71; i++) {
            //    console.log(this.warningValueListWithSpacer[i], this.severityLevelListWithSpacer[i])
            //}



            this.chartData.datasets[0].data = warningNumberArray[0].map(x => x);
            //console.log(warningNumberArray)
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

        },


        decreaseWarningNumberArray(severityLevel, ruleNumber) {
            //console.log('decrease warning level for sev: ' + severityLevel + ' rule: ' + ruleNumber)
            let s = Number(severityLevel)
            //console.log(this.chartData.datasets[s - 1].data)
            if (this.chartData.datasets[severityLevel - 1].data[ruleNumber - 1] > 0) {
                this.chartData.datasets[severityLevel - 1].data[ruleNumber - 1] = this.chartData.datasets[severityLevel - 1].data[ruleNumber - 1] - 1
            }
        },

        completedWarningWardChartUpdate(severityLevel, newSeverityLevel, ruleNumber) {
            //console.log('decrease warning level for sev: ' + severityLevel + ' rule: ' + ruleNumber)
            // due to the array setup, the new severity level will need to be converted to match the array 
            let newSeverity = 3;
            let sevIndex = severityLevel - 1
            // severityLevel = severityLevel - 1;
            //console.log(this.warningValueListWithSpacer)
            for (let j = 0; j < this.warningValueListWithSpacer.length; j++) {
                if (ruleNumber == this.warningValueListWithSpacer[j]) {
                    //console.log('Found rule[' + ruleNumber + '] at index[' + j + ']')
                    let decSeverityLevel = this.severityLevelListWithSpacer[j]
                    //   console.log(severityLevel + 'severityLevel')
                    // console.log(matchIndex + 'matchIndex')
                    // console.log('dec level 0: ' + this.chartData.datasets[0].data[j])
                    // console.log('dec level 1: ' + this.chartData.datasets[1].data[j])
                    //console.log('dec level 2: ' + this.chartData.datasets[2].data[j])
                    //console.log('dec level 3: ' + this.chartData.datasets[3].data[j])

                    //console.log('sev level' + this.chartData.datasets[sevIndex].data[j])

                    this.chartData.datasets[sevIndex].data[j] -= 1;
                    this.chartData.datasets[newSeverity].data[j] += 1;
                    return;
                    //warningNumberArray[severityLevel][matchIndex] -= 1
                    //warningNumberArray[newSeverity][matchIndex] -= 1


                }


            }

            console.log("completedWarningWardChartUpdate: ruleNumber not found")


            // console.log(this.chartData.datasets[s - 1].data)
            //     if (this.chartData.datasets[s - 1].data[ruleNumber - 1] > 0) {
            //        this.chartData.datasets[s - 1].data[ruleNumber - 1] = this.chartData.datasets[severityLevel - 1].data[ruleNumber - 1] - 1
        }
    },
},
)