import { WarningInfo } from './PatientWarnings.json';
import { PatientAlertDrug } from './patientInformation.json'
import { WarningInfo as WarningData } from './warningList.json'

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

export function getPatientInformation(patientID) {
    return PatientAlertDrug.filter(obj=> obj['Person ID']==patientID)[0];
}

export function getRuleInformation(ruleNr) {
    return WarningData.filter(obj=> obj.warningNumber==ruleNr)[0].warningName;
}

export function numberForRule(ruleNr) {
    return[WarningInfo.filter(obj=> obj.Regel==ruleNr).length]
}