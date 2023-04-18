import { WarningInfo } from './PatientWarnings.json';
import { PatientAlertDrug } from './patientInformation.json'
import { WarningInfo as WarningData } from './warningList.json'
import { wardsInfo } from './inpatientWards.json'
import { PatientAlertDrug as DrugList } from './patientDrugAlerts.json'

export function getCategoryData(filterRange) {
    var dataList = [];
    var patientIDSet = new Set();
    var ruleNumberSet =[];
    console.log(filterRange)
    for(var ruleNr=filterRange[0]; ruleNr<=filterRange[1]; ruleNr++){
        WarningInfo.filter(obj=> obj.Regel==ruleNr).forEach((patient) =>{
            patientIDSet.add(patient.PersonID);
            if(!ruleNumberSet.includes(patient.Regel)) {
                ruleNumberSet.push(patient.Regel);
            }
        });
    }

    patientIDSet.forEach((patient) =>{
        dataList.push(WarningInfo.filter(obj=> obj.PersonID==patient));
    });
    return [patientIDSet,dataList,ruleNumberSet];
}

export function getRuleData(ruleNumber) {
    var dataList = [];
    var patientIDSet = new Set();
    WarningInfo.filter(obj=> obj.Regel==ruleNumber).forEach((patient) =>{
        patientIDSet.add(patient.PersonID);
    });

    patientIDSet.forEach((patient) =>{
        dataList.push(WarningInfo.filter(obj=> obj.PersonID==patient));
    });

    return [patientIDSet,dataList];
}

export function getFilteredData(wardName, categoryID, ruleNr) {
    // console.log("running getFilteredData")
    // console.log("wardName: " + wardName + " categoryID: " + categoryID + " ruleNr: " + ruleNr);
    var dataList = [];
    var patientIDSet = new Set();
    var ruleNumberSet =[];

    WarningInfo.filter(obj=> (categoryID==0 || obj.RegelkategoriID+1==categoryID) && (ruleNr==0 || obj.Regel==ruleNr)).forEach((alert) =>{
        let patientData = PatientAlertDrug.filter(obj=> obj['Person ID']==alert.PersonID)[0];
        if(wardName=="All" || patientData.PatientLocation==wardName) {
            patientIDSet.add(alert.PersonID);
        }
    });

    patientIDSet.forEach((patient) =>{
        let patientList = WarningInfo.filter(obj=> obj.PersonID==patient)
        dataList.push(patientList);
        patientList.forEach((alert) =>{
            if(!ruleNumberSet.includes(alert.Regel)) {
                ruleNumberSet.push(alert.Regel);
            }
        });
    });
    return [patientIDSet,dataList,ruleNumberSet];
}

export function getPatientInformation(patientID) {
    return PatientAlertDrug.filter(obj=> obj['Person ID']==patientID)[0];
}

export function getRuleInformation(ruleNr) {
    return WarningData.filter(obj=> obj.warningNumber==ruleNr)[0];
}

export function getWardNames() {
    let wardNameArray = [];
    wardsInfo.forEach((ward) =>{
        wardNameArray.push(ward.KeyNamn);
    });
    return wardNameArray;
}

export function noAlertsForWard(wardName) {
    let patientList = PatientAlertDrug.filter(obj=> obj['PatientLocation']==wardName);
    let alertCounter = 0;
    patientList.forEach((patient) => {
        alertCounter += WarningInfo.filter(obj=> obj.PersonID==patient['Person ID']).length;       
    })
    return alertCounter;
}

export function noAlertsForCategory(categoryID) {
    return WarningInfo.filter(obj=> obj.RegelkategoriID==categoryID-1).length;
}

export function noAlertsForRule(ruleNr) {
    return WarningInfo.filter(obj=> obj.Regel==ruleNr).length;
}

export function getCategoryNames() {
    return ["Njurfunktion", "Riskprofil", "Läkemedel och labvärden", "Läkemedel och äldre", "Interaktioner", "Läkemedel och status", "Övrigt", "Övriga läkemedelskombinationer", "Läkemedel och diagnos"];
}

export function getCategoryRange(categoryID) {
    switch (categoryID) {
        case 1:
            return [1, 9];
        case 2:
            return [10, 15];
        case 3:
            return [16, 33];
        case 4:
            return [34, 40];
        case 5:
            return [41, 49];
        case 6:
            return [50, 51];
        case 7:
            return [52, 55];
        case 8:
            return [56, 58];
        case 9:
            return [59, 62];
        default:
            return [1, 62];
    }
}

export function getDrugFassName(drugName) {
    return DrugList.filter(obj=> obj['RiskLM']==drugName)[0].FassName;
}