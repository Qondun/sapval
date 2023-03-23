import { WarningInfo } from './PatientWarnings.json';
import { PatientAlertDrug } from './patientInformation.json'

export function getCategoryData(categoryName) {
    var dataList = [];
//1. catch PersonID's (filter json)
//2. get all alerts for PersonID (filter json)

    var patientIDSet = new Set();
    WarningInfo.filter(obj=> obj.Regelkategori==categoryName).forEach((patient) =>{
        patientIDSet.add(patient.PersonID);
    });

    patientIDSet.forEach((patient) =>{
        dataList.push(WarningInfo.filter(obj=> obj.PersonID==patient));
    });
    //console.table(dataList)
    //console.log("length: " + dataList.length)
    //return dataList;
    return [patientIDSet,dataList];
}

export function getPatientInformation(patientID) {
    return PatientAlertDrug.filter(obj=> obj['Person ID']==patientID)[0];
}