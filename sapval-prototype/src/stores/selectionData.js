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
        noAlertsForWard(wardName) {
            let patientList = this.PatientAlertDrug.filter(obj => obj['PatientLocation'] == wardName);
            let alertCounter = 0;
            patientList.forEach((patient) => {
                alertCounter += this.WarningInfo.filter(obj => obj.PersonID == patient['Person ID']).length;
            })
            return alertCounter;
        },
        noAlertsForCategory(categoryID) {
            return this.WarningInfo.filter(obj => obj.RegelkategoriID == categoryID - 1).length;
        },
        noAlertsForRule(ruleNr) {
            return this.WarningInfo.filter(obj => obj.Regel == ruleNr).length;
        },
        initialize() {
            this.WarningInfo = WarningInfo
            this.PatientAlertDrug = PatientAlertDrug
            this.WarningData = WarningData
            this.wardsInfo = wardsInfo
        },
        getCategoryNames() {
            return ["Riskprofil", "Interaktioner", "Njurfunktion", "Läkemedel och äldre", "Läkemedel och labvärden", "Läkemedel och diagnos", "Läkemedel och status", "Övriga läkemedelskombinationer", "Övrigt"];
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