import { useActivityLogStore } from '../stores/logger';
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from 'pinia'

import { WarningInfo } from '../records/PatientWarnings.json';
import { PatientAlertDrug } from '../records/patientInformation.json'
import { WarningInfo as WarningData } from '../records/warningList.json'
import { wardsInfo } from '../records/inpatientWards.json'

export const useSelectionDataStore = defineStore('selectionData', {
    state: () => ({
        WarningInfo: useLocalStorage('WarningInfo', {}),
        PatientAlertDrug: useLocalStorage('PatientAlertDrug', {}),
        WarningData: useLocalStorage('WarningData', {}),
        wardsInfo: useLocalStorage('wardsInfo', {}),
        updated: 0
    }),
    actions: {
        getCategoryData(filterRange) {
            var dataList = [];
            var patientIDSet = new Set();
            var ruleNumberSet = [];
            console.log(filterRange)
            for (var ruleNr = filterRange[0]; ruleNr <= filterRange[1]; ruleNr++) {
                this.WarningInfo.filter(obj => obj.Regel == ruleNr).forEach((patient) => {
                    patientIDSet.add(patient.PersonID);
                    if (!ruleNumberSet.includes(patient.Regel)) {
                        ruleNumberSet.push(patient.Regel);
                    }
                });
            }

            patientIDSet.forEach((patient) => {
                dataList.push(this.WarningInfo.filter(obj => obj.PersonID == patient));
            });
            return [patientIDSet, dataList, ruleNumberSet];
        },
        getRuleData(ruleNumber) {
            var dataList = [];
            var patientIDSet = new Set();
            this.WarningInfo.filter(obj => obj.Regel == ruleNumber).forEach((patient) => {
                patientIDSet.add(patient.PersonID);
            });

            patientIDSet.forEach((patient) => {
                dataList.push(this.WarningInfo.filter(obj => obj.PersonID == patient));
            });

            return [patientIDSet, dataList];
        },
        getFilteredData(wardName, categoryID, ruleNr) {
            // console.log("running getFilteredData")
            // console.log("wardName: " + wardName + " categoryID: " + categoryID + " ruleNr: " + ruleNr);
            var dataList = [];
            var patientIDSet = new Set();
            var ruleNumberSet = [];

            this.WarningInfo.filter(obj => (categoryID == 0 || obj.RegelkategoriID + 1 == categoryID) && (ruleNr == 0 || obj.Regel == ruleNr)).forEach((alert) => {
                let patientData = this.PatientAlertDrug.filter(obj => obj['Person ID'] == alert.PersonID)[0];
                if (wardName == "All" || patientData.PatientLocation == wardName) {
                    patientIDSet.add(alert.PersonID);
                }
            });

            patientIDSet.forEach((patient) => {
                let patientList = this.WarningInfo.filter(obj => obj.PersonID == patient)
                dataList.push(patientList);
                patientList.forEach((alert) => {
                    if (!ruleNumberSet.includes(alert.Regel)) {
                        ruleNumberSet.push(alert.Regel);
                    }
                });
            });
            return [patientIDSet, dataList, ruleNumberSet];
        },
        getPatientInformation(patientID) {
            return this.PatientAlertDrug.filter(obj => obj['Person ID'] == patientID)[0];
        },
        getRuleInformation(ruleNr) {
            return this.WarningData.filter(obj => obj.warningNumber == ruleNr)[0];
        },
        getWardNames() {
            let wardNameArray = [];
            this.wardsInfo.forEach((ward) => {
                wardNameArray.push(ward.KeyNamn);
            });
            return wardNameArray;
        },
        getCategoryRange(categoryID) {
            switch (categoryID) {
                case 1:
                    return [16, 33];
                case 2:
                    return [1, 9];
                case 3:
                    return [41, 49];
                case 4:
                    return [34, 40];
                case 5:
                    return [50, 51];
                case 6:
                    return [10, 15];
                case 7:
                    return [56, 58];
                case 8:
                    return [52, 55];
                case 9:
                    return [59, 62];
                default:
                    return [1, 62];
            }
        },
        getRuleNumbers() {
            let ruleArr = []
            for(var i=1; i<=62; i++) {
                ruleArr.push(i);
            }
            return ruleArr;
        },
        noAlertsForWard(wardName) {
            let patientList = this.PatientAlertDrug.filter(obj => obj['PatientLocation'] == wardName);
            let alertCounter1 = 0;
            let alertCounter2 = 0;
            let alertCounter3 = 0;
            patientList.forEach((patient) => {
                this.WarningInfo.filter(obj => obj.PersonID == patient['Person ID']).forEach((alert) =>{
                    let alertSeverityLevel = this.WarningData.filter(obj => obj.warningNumber==alert.Regel)[0].severityLevel;
                    switch(alertSeverityLevel) {
                        case 1:
                            alertCounter1++;
                            break;
                        case 2:
                            alertCounter2++;
                            break;
                        case 3:
                            alertCounter3++;
                            break;
                    }
                });
            })
            let counterArray = [alertCounter1,alertCounter2,alertCounter3];
            return counterArray;
        },
        noAlertsForCategory(categoryID) {
            return this.WarningInfo.filter(obj => obj.RegelkategoriID == categoryID - 1).length;
        },
        noAlertsForRule(ruleNr) {
            return this.WarningInfo.filter(obj => obj.Regel == ruleNr).length;
        },
        getWardList() {
            return wardsInfo;
        },
        initialize() {
            this.WarningInfo = WarningInfo
            this.PatientAlertDrug = PatientAlertDrug
            this.WarningData = WarningData
            this.wardsInfo = wardsInfo
        },
        getCategoryNames() {
            return ["Njurfunktion", "Riskprofil", "LM och labvärden", "LM och äldre", "LM och diagnos", "Interaktioner", "Övriga LM-komb.", "LM och status", "Övrigt"];
        },
        getWardCategoryNames() {
            return ["Psykiatri", "Blod och tumörsjukd.", "Neuro", "Hjärt- lungmedicin", "Ortopedi", "Kirurgi", "Akut- och internmedicin", "Infektionssjukdomar", "Geriatrik", "Specialmedicin hur reumatol" ,"Ögonsjukdomar", "Öron näs hals", "Plastik- och kärlkirurgi", "Thoraxkirurgi", "Urologi", "Rehabilitering och smärtcentr", "Kvinnosjukvård"];
        },
        clearWarning(AlertID) {
            const logger = useActivityLogStore()
            let items = this.WarningInfo.filter(obj => obj['ID för alert'] == AlertID)
            if (items.length != 1) {
                console.log("Error!!!! " + AlertID + " Found multiple records")
                console.log(items)
            } else {
                let index = this.WarningInfo.findIndex(obj => obj['ID för alert'] == AlertID)
                console.log('index of item is: ' + index + ' will be deleted');
                let item = this.WarningInfo.splice(index, 1)
                console.log(JSON.stringify(JSON.stringify(item, null, 2), null, 2))
                logger.logAppend('Cleared Item: ' + JSON.stringify(item, null, 2))
                this.updated++
            }
        }
    }
})