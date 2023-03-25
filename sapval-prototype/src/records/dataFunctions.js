import { WarningInfo } from './PatientWarnings.json';
import { PatientAlertDrug } from './patientInformation.json'

export function getCategoryData(categoryName) {
    console.log("category name: " + categoryName)
    var dataList = [];
    var patientIDSet = new Set();
    WarningInfo.filter(obj=> obj.Regelkategori==categoryName).forEach((patient) =>{
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