import { WarningInfo } from './PatientWarnings.json';
import { PatientAlertDrug } from './patientInformation.json'
import { WarningInfo as WarningData } from './warningList.json'
import { wardsInfo } from './inpatientWards.json'

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
    console.log("running getFilteredData")
    console.log("wardName: " + wardName + " categoryID: " + categoryID + " ruleNr: " + ruleNr);
    var dataList = [];
    var patientIDSet = new Set();
    var ruleNumberSet =[];

    WarningInfo.filter(obj=> (categoryID==0 || obj.RegelkategoriID+1==categoryID) && (ruleNr==0 || obj.Regel==ruleNr)).forEach((alert) =>{
        let patientData = PatientAlertDrug.filter(obj=> obj['Person ID']==alert.PersonID)[0];
        if(wardName=="All" || patientData.PatientLocation==wardName) {
            patientIDSet.add(alert.PersonID);
            if(!ruleNumberSet.includes(alert.Regel)) {
                ruleNumberSet.push(alert.Regel);
            }
        }
    });

    patientIDSet.forEach((patient) =>{
        dataList.push(WarningInfo.filter(obj=> obj.PersonID==patient));
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
    return ["Riskprofil", "Interaktioner", "Njurfunktion", "Läkemedel och äldre", "Läkemedel och labvärden", "Läkemedel och diagnos", "Läkemedel och status", "Övriga läkemedelskombinationer", "Övrigt"];
}