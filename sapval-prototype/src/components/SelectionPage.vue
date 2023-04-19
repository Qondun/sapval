<script setup>
import { isInDestructureAssignment } from '@vue/compiler-core';
import { computed, onMounted, createVNode, render, watch } from 'vue';
import { getPatientInformation, getRuleInformation, noAlertsForRule, getFilteredData, getWardNames, getCategoryNames, getDrugFassName, getCategoryRange } from '../records/dataFunctions';
import { storeToRefs } from 'pinia'
import { useWarningsByWardStore } from '../stores/warningsByWard';
import { useWarningsByRuleStore } from '../stores/warningsByRule';
import { useSelectionDataStore } from '../stores/selectionData'

import AlertForm from './AlertForm.vue';
import { useActivityLogStore } from '../stores/logger';

let filterRange = []; // [Lower bound, Upper bound]
let dataList = [];
// let patientIDSet = new Set();
let patientIDSet = [];
let ruleNumberSet = [];

let wardName = "All";
let categoryID = 0;
let ruleNr = 0;

let currentAlert = null;
let formState = 0;

const wardStore = useWarningsByWardStore()
const wardStoreRef = storeToRefs(wardStore)

const activityLog = useActivityLogStore()
const activityLogRef = storeToRefs(activityLog)

const selectionData = useSelectionDataStore()
const categoryNames = selectionData.getCategoryNames()

const { updated } = storeToRefs(selectionData)

watch(updated, () => {
    cleanInfoDiv();
    clearFilterDropdowns();
    // setUp()
})

const props = defineProps({
    layoutState: Number,
    selectionPageState: String,
    selectionStateVal: String
});
const emit = defineEmits(['update:layoutState', 'update:selectionPageState', 'update:selectionStateVal']);

const layoutState = computed({
    get() {
        return props.layoutState;
    },
    set(newVal) {
        emit('update:layoutState', parseInt(newVal));
    },
});

const selectionPageState = computed({
    get() {
        return props.selectionPageState;
    },
    set(newVal) {
        emit('update:selectionPageState', (newVal));
    },
});

const selectionStateVal = computed({
    get() {
        return props.selectionStateVal;
    },
    set(newVal) {
        emit('update:selectionStateVal', (newVal));
    },
});

onMounted(() => {
    switch (selectionPageState.value) {
        case "Ward":
            wardName = selectionStateVal.value;
            break;
        case "Category":
            categoryID = selectionStateVal.value;
            break;
        case "Rule":
            ruleNr = selectionStateVal.value;
    }
    setUp();
})

function setUp() {
    [patientIDSet, dataList, ruleNumberSet] = selectionData.getFilteredData(wardName, categoryID, ruleNr);
    filterRange = selectionData.getCategoryRange(Number(categoryID));
    // setCategoryRange();
    createFilterDropdowns();
    createAvailableRuleBoxes();
    createLayout();
}

function clearFilterDropdowns() {
    let boundingBox = document.getElementById('filterDropdownBoundingBox');
    while (boundingBox.firstChild) {
        boundingBox.removeChild(boundingBox.firstChild);
    }
}

function createFilterDropdowns() {
    let selectionGrid = document.getElementById("selectionGrid");
    clearFilterDropdowns();

    let filterDropdownBoundingBox = document.getElementById('filterDropdownBoundingBox');

    if (selectionPageState.value != "Ward") {
        let wardBox = document.createElement('div');
        let wardLegend = document.createElement('legend');
        wardLegend.innerHTML = "Avdelningar";
        wardBox.appendChild(wardLegend);

        let wardSelect = document.createElement('select');
        wardSelect.setAttribute('id', 'wardSelect');
        wardSelect.addEventListener('change', (event) => {
            wardName = event.target.value;
            setUp();
        });

        let allOption = document.createElement('option');
        allOption.innerHTML = "Alla";
        allOption.setAttribute('value', "All")
        wardSelect.appendChild(allOption);

        let wardNames = selectionData.getWardNames();
        wardNames.forEach((ward) => {
            // let counter = selectionData.noAlertsWardFiltered(patientIDSet, ward, selectionPageState, selectionStateVal);
            // if(counter) {
            let wardOption = document.createElement('option');
            wardOption.setAttribute('value', ward);
            wardOption.innerHTML = ward;

            wardSelect.appendChild(wardOption);
            // }
        });
        wardSelect.value = wardName;
        wardBox.appendChild(wardSelect);
        filterDropdownBoundingBox.appendChild(wardBox);
    }
    if (selectionPageState.value == "Ward") {
        let categoryBox = document.createElement('div');
        let categoryLegend = document.createElement('legend');
        categoryLegend.innerHTML = "Kategorier";
        categoryBox.appendChild(categoryLegend);

        let categorySelect = document.createElement('select');
        categorySelect.setAttribute('id', 'categorySelect');
        categorySelect.addEventListener('change', (event) => {
            categoryID = event.target.value;
            ruleNr = 0;
            setUp();
        });

        let allOption = document.createElement('option');
        allOption.innerHTML = "Alla";
        allOption.setAttribute('value', 0)
        categorySelect.appendChild(allOption);

        var catVal = 1;
        let categoryNames = selectionData.getCategoryNames();
        categoryNames.forEach((category) => {
            // let wardData = numberForRule(ruleNr);
            let categoryOption = document.createElement('option');
            categoryOption.setAttribute('value', catVal);
            categoryOption.innerHTML = category;
            categorySelect.appendChild(categoryOption);
            catVal++;
        });
        categorySelect.value = categoryID;
        categoryBox.appendChild(categorySelect);
        filterDropdownBoundingBox.appendChild(categoryBox);
    }
    if (selectionPageState.value != "Rule") {
        let ruleBox = document.createElement('div');
        let ruleLegend = document.createElement('legend');
        ruleLegend.innerHTML = "Regler";
        ruleBox.appendChild(ruleLegend);

        let ruleSelect = document.createElement('select');
        ruleSelect.setAttribute('id', 'ruleSelect');
        ruleSelect.addEventListener('change', (event) => {
            ruleNr = event.target.value;
            setUp();
        });

        let allOption = document.createElement('option');
        allOption.innerHTML = "Alla";
        allOption.setAttribute('value', 0)
        ruleSelect.appendChild(allOption);

        for (var ruleNum = filterRange[0]; ruleNum <= filterRange[1]; ruleNum++) {
            let ruleOption = document.createElement('option');
            ruleOption.setAttribute('value', ruleNum);
            ruleOption.innerHTML = "Regel " + ruleNum;
            ruleSelect.appendChild(ruleOption);
        }
        ruleSelect.value = ruleNr;
        ruleBox.appendChild(ruleSelect);
        filterDropdownBoundingBox.appendChild(ruleBox);
    }

    selectionGrid.appendChild(filterDropdownBoundingBox);
}

function updateAvailableBoxes(ruleNumber) {
    let availableRuleBoundingBox = document.getElementById('availableRuleBoundingBox');
    availableRuleBoundingBox.childNodes.forEach((ruleBox) => {
        if (ruleBox.id == ruleNumber) {
            let boxText = ruleBox.firstChild;
            let splitText = boxText.innerHTML.split('<br>')[1];
            let oldCount = parseInt(splitText.split(' '));
            let newCount = oldCount - 1;
            if (newCount) {
                boxText.innerHTML = "Regel " + ruleNumber + "<br>" + newCount + " st";
            } else {
                availableRuleBoundingBox.removeChild(ruleBox);
            }
        }
    });
}

function createAvailableRuleBoxes() {
    let selectionGrid = document.getElementById("selectionGrid");
    let availableRuleBoundingBox = document.getElementById('availableRuleBoundingBox');
    let ruleNumbers = ruleNumberSet.sort(function (a, b) { return a - b });

    for (var rule in ruleNumbers) {
        let counter = 0;
        dataList.forEach((patient) => {
            patient.forEach((alert) => {
                if (alert.Regel == ruleNumbers[rule]) {
                    counter++;
                }
            });
        });
        let availableRuleBox = document.createElement("div");
        availableRuleBox.classList.add("availableRuleBox");
        availableRuleBox.setAttribute("id", ruleNumbers[rule]);
        let availableRuleBoxText = document.createElement("p");
        availableRuleBoxText.innerHTML = "Regel " + ruleNumbers[rule] + "<br>" + counter + " st";
        availableRuleBox.appendChild(availableRuleBoxText);

        let severityLevelBox = document.createElement('div');
        severityLevelBox.classList.add('availableBoxSeverity');
        let boxSevClassName = "sev" + selectionData.getRuleInformation(ruleNumbers[rule]).severityLevel;
        severityLevelBox.classList.add(boxSevClassName);
        availableRuleBox.appendChild(severityLevelBox);

        availableRuleBoundingBox.appendChild(availableRuleBox);
    };
    selectionGrid.appendChild(availableRuleBoundingBox);
}

function createLayout() {
    cleanListDiv();
    cleanInfoDiv();
    cleanPatientDiv();

    let listDiv = document.getElementById("listDiv");
    let patientIndex = 0; // not accessing all alerts

    patientIDSet.forEach((patientID) => {

        /* Bounding box for each patient */
        let patientBox = document.createElement('div')
        patientBox.classList.add("patientBox");
        patientBox.setAttribute("id", patientIndex);

        let patientHeaderBox = document.createElement('div');
        patientHeaderBox.classList.add("patientHeaderBox");
        let patientData = selectionData.getPatientInformation(patientID);
        let alertList = dataList[patientIndex];
        let headerText = document.createElement("h3");
        headerText.innerHTML = patientData['First Name'] + " " + patientData['Last Name'] + ", " + patientData['Age'];
        let noAlerts = document.createElement('h3');
        noAlerts.setAttribute('id','noAlerts'+patientIndex);
        noAlerts.innerHTML = alertList.length;

        let highestSeverity = selectionData.getHighestSeverity(alertList[0].PersonID);
        let highestSeverityDiv = document.createElement('div');
        highestSeverityDiv.classList.add('patientSeverityBox');
        highestSeverityDiv.classList.add('sev'+highestSeverity)
        highestSeverityDiv.setAttribute('id','patientSeverityBox'+patientIndex);

        patientHeaderBox.appendChild(headerText);
        patientHeaderBox.appendChild(noAlerts);
        patientHeaderBox.appendChild(highestSeverityDiv);
        patientBox.appendChild(patientHeaderBox);

        /* Add all alerts into bounding box for alerts */
        let alertBox = document.createElement('div');
        alertBox.classList.add("alertBox");
        let alertIndex = 0;
        alertList.forEach((alert) => {
            let ruleInfo = selectionData.getRuleInformation(alert.Regel);
            let singleAlertBox = document.createElement('div');
            singleAlertBox.classList.add("singleAlert");
            singleAlertBox.setAttribute("id", alertIndex);
            let singleAlertText = document.createElement('p');

            // Remake getRuleInformation to give alert name and severity level
            singleAlertText.innerHTML = "Regel " + alert.Regel + ": " + ruleInfo.warningShortText;
            singleAlertBox.appendChild(singleAlertText);
            alertBox.appendChild(singleAlertBox);

            let severityClassName = "sev" + ruleInfo.severityLevel.toString();
            let severityLevelBox = document.createElement('div');
            severityLevelBox.classList.add("severityBox");
            severityLevelBox.classList.add(severityClassName);
            singleAlertBox.appendChild(severityLevelBox);

            /* Send information/id for alert */
            singleAlertBox.addEventListener("click", function () {
                let alertBoxList = document.getElementsByClassName("alertBox");
                let alreadySelected = singleAlertBox.classList.contains("selected");
                for (var i = 0; i < alertBoxList.length; i++) {
                    alertBoxList[i].childNodes.forEach((singleAlert) => {
                        singleAlert.classList.remove("selected");
                    });
                }
                if (!alreadySelected) {
                    singleAlertBox.classList.add("selected");
                    updateInfoDiv(patientBox.id, singleAlertBox.id);
                    currentAlert = alert;
                } else {
                    cleanInfoDiv();
                    currentAlert = null;
                }

            });
            alertIndex++;
        });

        /* Event listener to header (top part of card) for expanding a patient */
        patientHeaderBox.addEventListener("click", function () {
            let alreadySelected = patientBox.children[1].classList.contains("selected");
            listDiv.childNodes.forEach((patient) => {
                patient.childNodes.forEach((item) => {
                    item.classList.remove("selected");
                });
            });

            /* Unselect alerts when closing patient */
            let alertBoxList = document.getElementsByClassName("alertBox");
            for (var i = 0; i < alertBoxList.length; i++) {
                alertBoxList[i].childNodes.forEach((singleAlert) => {
                    singleAlert.classList.remove("selected");
                });
            }
            cleanInfoDiv();
            cleanPatientDiv();

            if (!alreadySelected) {
                patientBox.childNodes.forEach((item) => {
                    item.classList.add("selected");
                    updatePatientDiv(patientData, patientBox.id);
                });
            }
        });

        patientBox.appendChild(alertBox);
        listDiv.appendChild(patientBox);
        patientIndex++;
    });
}

function cleanListDiv() {
    let listDiv = document.getElementById("listDiv");
    if (listDiv) {
        while (listDiv.firstChild) {
            listDiv.removeChild(listDiv.firstChild);
        }
    }
}

function cleanInfoDiv() {
    let infoDiv = document.getElementById("infoDiv");
    while (infoDiv.firstChild) {
        infoDiv.removeChild(infoDiv.firstChild);
    }
}

function updateInfoDiv(patientIndex, alertIndex) {
    cleanInfoDiv();
    let alertInfo = dataList[patientIndex][alertIndex];
    let infoDiv = document.getElementById("infoDiv");
    let ruleInfo = selectionData.getRuleInformation(alertInfo.Regel);


    let alertText = document.createElement("h1");
    alertText.innerHTML = "Regel " + alertInfo.Regel;
    infoDiv.appendChild(alertText);

    let alertInfoText = document.createElement("p");
    alertInfoText.innerHTML = ruleInfo.warningName;
    infoDiv.appendChild(alertInfoText);

    let severityLevelBox = document.createElement("div");
    severityLevelBox.classList.add("severityLevelBox");
    let severityClassName = "sev" + ruleInfo.severityLevel.toString();
    severityLevelBox.classList.add(severityClassName);
    let severityLevelText = document.createElement("p");
    severityLevelText.innerHTML = ruleInfo.severityLevel;
    severityLevelBox.appendChild(severityLevelText);
    infoDiv.appendChild(severityLevelBox);

    // Patient values
    let mainInfoBox = document.createElement("div");
    mainInfoBox.setAttribute("id", "mainInfoBox");
    let patientValueBox = document.createElement("div");
    patientValueBox.setAttribute("id", "patientValueBox");
    patientValueBox.classList.add("infoBoxes");

    mainInfoBox.appendChild(createDividingLine("Patientvärden"));

    let patientValueArray = ["GFR", "K", "Ca", "Puls"];
    patientValueArray.forEach((info) => {
        let patientInfo = document.createElement("p");
        patientInfo.innerHTML = "<b>" + info + "</b>" + ": " + alertInfo[info];
        patientValueBox.appendChild(patientInfo);
    });
    mainInfoBox.appendChild(patientValueBox);

    mainInfoBox.appendChild(createDividingLine("Dosering"));

    let dosingInfoBox = document.createElement("div");
    dosingInfoBox.setAttribute("id", "dosingInfoBox");
    dosingInfoBox.classList.add("infoBoxes");
    let dosingText = document.createElement("p");
    let dosingTextValue = alertInfo["Dosering"];
    if (dosingTextValue) {
        dosingText.innerHTML = dosingTextValue;
    } else {
        dosingText.innerHTML = "Ingen doseringsinformation."
    }

    dosingInfoBox.appendChild(dosingText);
    mainInfoBox.appendChild(dosingInfoBox);
    mainInfoBox.appendChild(document.createElement('alert-form'));

    infoDiv.appendChild(mainInfoBox);

    mainInfoBox.appendChild(createDividingLine("Hantera varning"))
    createAlertForm(alertInfo, ruleInfo.severityLevel, patientIndex, alertIndex);
}

function cleanPatientDiv() {
    let infoDiv = document.getElementById("patientDiv");
    while (infoDiv.firstChild) {
        infoDiv.removeChild(infoDiv.firstChild);
    }
}

function updatePatientDiv(patientData, patientIndex) {
    cleanPatientDiv();
    let patientDiv = document.getElementById("patientDiv");

    let alertText = document.createElement("h1");
    alertText.innerHTML = patientData["First Name"] + " " + patientData["Last Name"];
    patientDiv.appendChild(alertText);
    let patientAge = document.createElement("p");
    patientAge.innerHTML = patientData["Birthday"] + "-" + patientData["RandomFourDigitCode"] + " (" + patientData["Age"] + " år)";
    patientDiv.appendChild(patientAge);

    // Ward information for patient(
    let wardInfoBox = document.createElement('div');
    wardInfoBox.classList.add("infoBoxes");
    patientDiv.appendChild(createDividingLine("Avdelningsinformation"));
    let wardInfo = document.createElement("p");
    wardInfo.innerHTML = "<b>Avdelning:</b> " + patientData["OA enhet"];
    wardInfoBox.appendChild(wardInfo);
    let patientInfo = document.createElement("p");
    patientInfo.innerHTML = "<b>Typ av verksamhet:</b> " + patientData["MA verksamhet"];
    wardInfoBox.appendChild(patientInfo);
    patientDiv.appendChild(wardInfoBox);

    // Drug list for patient
    let drugInfoBox = document.createElement('div');
    drugInfoBox.classList.add('infoBoxes');
    drugInfoBox.setAttribute('id','drugInfoBox')
    patientDiv.appendChild(createDividingLine('Läkemedelslista'));

    let [drugNameList,fassList] = selectionData.getDrugListForPatient(patientData['Person ID']);
    let drugList = document.createElement('ul');
    for (var drug in drugNameList) {
        let singleDrug = document.createElement('li');
        let singleDrugHyperlink = document.createElement('a');
        singleDrugHyperlink.setAttribute('target', '_blank');
        singleDrugHyperlink.textContent = drugNameList[drug];
        singleDrugHyperlink.href = 'https://www.fass.se/LIF/atcregister?atcCode=' + fassList[drug];
        singleDrug.appendChild(singleDrugHyperlink);
        drugList.appendChild(singleDrug);
    };
    drugInfoBox.appendChild(drugList);
    patientDiv.appendChild(drugInfoBox);

    // Comments for patient
    let commentsExist = false;
    let commentBox = document.createElement("div");
    commentBox.classList.add("infoBoxes");
    dataList[patientIndex].forEach((alert) => {
        console.log(alert.Kommentar)
        let comment = document.createElement("p");
        comment.innerHTML = alert["Kommentar"];
        if(comment.innerHTML!='') {
            commentsExist = true;
        }
        commentBox.appendChild(comment);
    });
    if(commentsExist) {
        patientDiv.appendChild(createDividingLine("Viktig information från journal"));
        patientDiv.appendChild(commentBox);
    }
}

function createDividingLine(label) {
    let fieldset = document.createElement("fieldset");
    let legend = document.createElement("legend");
    legend.innerHTML = label
    fieldset.appendChild(legend);
    return fieldset;
}

function createDataUpdateButton(label, id, severityLevel, newSeverity, personID, ruleNumber, warningId, patientIndex, alertIndex) {
    let filterButton = document.createElement('button');

    // Setup the attributes for the button that we need in the callback
    filterButton.personID = personID
    filterButton.severityLevel = severityLevel
    filterButton.newSeverity = newSeverity
    filterButton.ruleNumber = ruleNumber
    filterButton.warningId = warningId
    filterButton.innerHTML = 'OK';

    // // Set the class of the button
    // filterButton.classList.add("filterButton");
    // filterButton.setAttribute("id", id);

    // Make it look like a button and set the text
    // let filterButtonText = document.createElement("button");
    // filterButtonText.innerHTML = label;
    // filterButton.appendChild(filterButtonText);

    // Our on click event
    filterButton.addEventListener("click", function (evt) {
        let radioButtons = document.getElementsByName('actionOptions');
        let commentBox = document.getElementById('commentLeftByUser');
        let mandatoryTextOptions = ['Brådskande','Vanligt','Annan']
        let radioValue = "";

        let warningTextArea = document.getElementById('warningTextArea');
        let warningText1 = document.getElementById('warningText1');
        let warningText2 = document.getElementById('warningText2');
        let warningText3 = document.getElementById('warningText3');
        let radioChecked = false;

        warningTextArea.classList.remove('visible');
        warningText1.classList.remove('visible');
        warningText2.classList.remove('visible');
        warningText3.classList.remove('visible');

        radioButtons.forEach((button) =>{
            // console.log(button.value)
            if(button.checked) {
                radioChecked = true;
                radioValue = button.value;
                console.log("the selected radio button is: " + button.value);
                console.log("text area: " + commentBox.value);
                if(mandatoryTextOptions.includes(radioValue) && commentBox.value.length==0) {
                    warningTextArea.classList.add('visible')
                    warningText2.classList.add('visible')
                } else if(mandatoryTextOptions.includes(radioValue) && commentBox.value.length<3) {
                    console.log("textarea is not long enough")
                    warningTextArea.classList.add('visible')
                    warningText3.classList.add('visible')
                } else {
                    let personID = evt.currentTarget.personID
                    let severityLevel = evt.currentTarget.severityLevel
                    //let newSeverity = evt.currentTarget.newSeverity
                    let newSeverity = 3
                    let ruleNumber = evt.currentTarget.ruleNumber
                    let warningId = evt.currentTarget.warningId

                    let wardsStore = useWarningsByWardStore()
                    let warningStore = useWarningsByRuleStore()
                    let selectionDataStore = useSelectionDataStore()
                    let act = useActivityLogStore()

                    let msg = 'personID[' + personID + '] severityLevel[' + severityLevel + '] message[' + commentBox.value + ']' + ' chosen option[' + radioValue + ']';
                    //this.chartData.datasets[severityLevel].data[locationIndex] -= 1;
                    //this.chartData.datasets[newSeverity].data[locationIndex] += 1;
                    // console.log("commentByUSER" + x)
                    act.logAppend(msg);
                    console.log(msg)

                    wardsStore.completedWarningWardChartUpdate(severityLevel, newSeverity, personID);
                    warningStore.completedWarningWardChartUpdate(severityLevel, newSeverity, ruleNumber);

                    selectionDataStore.clearWarning(warningId)
                    removeAlertFromPatient(patientIndex, alertIndex);
                    updateAvailableBoxes(ruleNumber);

                }
            }
        });

        if(!radioChecked) {
            warningTextArea.classList.add('visible')
            warningText1.classList.add('visible')
        }
        
        // Might need to disable the button or reset some page state here
    });

    return filterButton
}

function createAlertForm(alert, severityLevel, patientIndex, alertIndex) {
    let warningId = alert['ID för alert']
    formState = 0;
    let infoDiv = document.getElementById('infoDiv');
    let formBoundingBox = document.createElement('div');
    formBoundingBox.setAttribute('id', 'formBoundingBox')
    let form = document.createElement('form');
    form.setAttribute('action', 'javascript:void(0);')

    let actionCategories = ["Skicka", "Avvisa", "Spara tillsvidare"];
    let actionOptions = [["Brådskande", "Vanligt"], ["Redan minskad risk", "Palliativ vård", "Engångsdos", "Annan"], ["Inte viktigt", "Potentiellt farligt"]]
    let actionCategoryBoundingBox = document.createElement('div');
    actionCategoryBoundingBox.classList.add('actionCategoryBoundingBox');

    let commentBoxLabel = document.createElement('label');
    commentBoxLabel.setAttribute('id','commentBoxLabel');
    commentBoxLabel.innerHTML = "Kommentar (* - kommentar krävs)<br>"

    let commentBox = document.createElement('textarea');
    commentBox.setAttribute('placeholder', 'Skriv en kommentar');
    commentBox.setAttribute('id', 'commentLeftByUser');
    // commentBox.setAttribute('minlength','3')

    commentBox.required = false;

    for (var category in actionCategories) {
        let actionCategoryDiv = document.createElement('div');
        actionCategoryDiv.classList.add('actionCategoryDiv');

        let categoryHeader = document.createElement('p');
        categoryHeader.classList.add('formCategoryHeader');
        categoryHeader.innerHTML = actionCategories[category];
        actionCategoryDiv.appendChild(categoryHeader)

        let categoryOptions = actionOptions[category];
        let optionDiv = document.createElement('div');

        for (var action in categoryOptions) {
            let radioButton = document.createElement('input');
            radioButton.setAttribute('type', 'radio');
            radioButton.setAttribute('id', ('radioButton_' + categoryOptions[action]));
            radioButton.setAttribute('name', 'actionOptions');
            radioButton.setAttribute('value', categoryOptions[action]);
            radioButton.required = true;

            let radioLabel = document.createElement('label');
            radioLabel.setAttribute('for', ('radioButton_' + categoryOptions[action]));

            if (actionCategories[category] == 'Skicka' || categoryOptions[action] == 'Annan') {
                radioButton.addEventListener('change', () => {
                    commentBox.required = true;
                });
                radioLabel.innerHTML = categoryOptions[action] + " (*)<br>";

            } else {
                radioButton.addEventListener('change', () => {
                    commentBox.required = false;
                });
                radioLabel.innerHTML = categoryOptions[action] + "<br>";
            }

            optionDiv.appendChild(radioButton);
            optionDiv.appendChild(radioLabel);
        }

        actionCategoryDiv.appendChild(optionDiv);

        // Creating the recipient dropdown
        if (actionCategories[category] == actionCategories[0]) {
            let recipientLegend = document.createElement('legend')
            recipientLegend.setAttribute('id', 'recipientLegend');
            recipientLegend.setAttribute('for','recipientSelect')
            recipientLegend.innerHTML = 'Mottagare';
            actionCategoryDiv.appendChild(recipientLegend);

            let recipientDropdown = document.createElement('select');
            recipientDropdown.setAttribute('id', 'recipientSelect');
            selectionData.getWardList().forEach((ward) => {
                let wardGroup = document.createElement('optgroup');
                wardGroup.setAttribute('label', ward.KeyNamn);

                let wardPharmacistOption = document.createElement('option');
                wardPharmacistOption.innerHTML = ward.WardContactPharmacistFirstName.substring(0,1) + ". " + ward.WardContactPharmacistLastName + " (apot. " + ward.KeyNamn + ")";

                let wardDoctorOption = document.createElement('option')
                wardDoctorOption.innerHTML = ward.WardContactDoctorFirstName.substring(0,1) + ". " + ward.WardContactDoctorLastName + " (dokt. " + ward.KeyNamn + ")";

                if (ward.KeyNamn == selectionData.getPatientInformation(alert.PersonID).PatientLocation) {
                    if (wardPharmacistOption.innerHTML == '') {
                        wardDoctorOption.selected = true;
                    } else {
                        wardPharmacistOption.selected = true;
                    }
                }
                if (ward.WardContactPharmacistFirstName) {
                    wardGroup.appendChild(wardPharmacistOption);
                }
                wardGroup.appendChild(wardDoctorOption);
                recipientDropdown.appendChild(wardGroup);
            });
            actionCategoryDiv.appendChild(recipientDropdown);
        }

        actionCategoryBoundingBox.appendChild(actionCategoryDiv);
        form.appendChild(actionCategoryBoundingBox);
    }

    form.appendChild(commentBoxLabel);

    // Warning text when incorrect input
    let warningTextArea = document.createElement('div');
    warningTextArea.setAttribute('id','warningTextArea');
    let warningText1 = document.createElement('p');
    warningText1.classList.add('warningText');
    warningText1.setAttribute('id','warningText1');
    warningText1.innerHTML = "Hanteringsalternativ måste väljas."
    warningTextArea.appendChild(warningText1);
    let warningText2 = document.createElement('p');
    warningText2.classList.add('warningText');
    warningText2.setAttribute('id','warningText2');
    warningText2.innerHTML = "Kommentar krävs."
    warningTextArea.appendChild(warningText2);
    let warningText3 = document.createElement('p');
    warningText3.classList.add('warningText');
    warningText3.setAttribute('id','warningText3');
    warningText3.innerHTML = "Kommentar för kort"
    warningTextArea.appendChild(warningText3);
    form.appendChild(warningTextArea);

    form.appendChild(commentBox);

    formBoundingBox.appendChild(form);

    formBoundingBox.appendChild(createDataUpdateButton("OK", "dis1", severityLevel, 1, alert.PersonID, alert.Regel, warningId, patientIndex, alertIndex))
    let cancelButton = document.createElement('button');
    cancelButton.innerHTML = 'Avbryt';
    cancelButton.addEventListener('click', function() {
        let radioButtons = document.getElementsByName('actionOptions');
        let commentBox = document.getElementById('commentLeftByUser');
        radioButtons.forEach((radioButton) =>{
            radioButton.checked = false;
        });
        commentBox.value = '';
        let warningTextArea = document.getElementById('warningTextArea');
        let warningText1 = document.getElementById('warningText1');
        let warningText2 = document.getElementById('warningText2');
        let warningText3 = document.getElementById('warningText3');

        warningTextArea.classList.remove('visible');
        warningText1.classList.remove('visible');
        warningText2.classList.remove('visible');
        warningText3.classList.remove('visible');
    })
    formBoundingBox.appendChild(cancelButton);
    infoDiv.appendChild(formBoundingBox);
}

function removeAlertFromPatient(patientIndex, alertIndex) {
    let listDiv = document.getElementById('listDiv');
    let patient = null;
    let noAlertsForPatient = document.getElementById('noAlerts'+patientIndex);
    noAlertsForPatient.innerHTML = parseInt(noAlertsForPatient.innerHTML)-1;

    let highestSeverityDiv = document.getElementById('patientSeverityBox'+patientIndex);
    highestSeverityDiv.classList.remove(highestSeverityDiv.classList[1]);
    let alertList = dataList[patientIndex];
    highestSeverityDiv.classList.add('sev'+selectionData.getHighestSeverity(alertList[0].PersonID));

    listDiv.childNodes.forEach((patientDiv) => {
        if (patientDiv.id == patientIndex) {
            patient = patientDiv;
        }
    });
    let alertDiv = null;
    patient.childNodes.forEach((currDiv) => {
        if (currDiv.classList.contains('alertBox')) {
            alertDiv = currDiv;
        }
    })
    alertDiv.childNodes.forEach((singleAlertDiv) => {
        if (singleAlertDiv.id == alertIndex) {
            alertDiv.removeChild(singleAlertDiv);
            if (!alertDiv.firstChild) {
                listDiv.childNodes.forEach((patientDiv) => {
                    if (patientDiv.id == patientIndex) {
                        listDiv.removeChild(patientDiv);
                    }
                });
                cleanPatientDiv();
            }
        }
    })
}
</script>

<template>
    <div id="selectionGrid">
        <!-- <h1 class="listHeader">{{ selectionStateVal.value }}</h1>    -->
        <div id="backButton" @click="layoutState = 0">
            <!-- <p>Backa</p> -->
        </div>
        <div id="filterDropdownBoundingBox"></div>
        <div id="availableRuleBoundingBox"></div>
        <div id="listGridItem" class="selectionGridItem">
            <div class="headerBox">
                <p v-if="selectionPageState == 'Category'" id="patientListHeader" class="listHeader">Kategori: {{
                    categoryNames[selectionStateVal - 1] }}</p>
                <p v-else-if="selectionPageState == 'Ward'" id="patientListHeader" class="listHeader">Avdelning {{
                    selectionStateVal }}</p>
                <p v-else id="patientListHeader" class="listHeader">Regel {{ selectionStateVal }}</p>
                <p id="noAlertsText">Antal varningar</p>
            </div>
            <div id="listDiv"></div>
        </div>

        <div id="alertGridItem" class="selectionGridItem">
            <div class="headerBox">
                <p class="listHeader">Varningsinformation {{ currentAlert }}</p>
            </div>
            <div id="infoDiv"></div>
        </div>

        <div id="patientGridItem" class="selectionGridItem">
            <div class="headerBox">
                <p class="listHeader">Patientinformation</p>
            </div>
            <div id="patientDiv"></div>
        </div>
    </div>
</template>

<style>
b {
    font-weight: bold;
    font-size: 12pt;
}

#selectionGrid {
    background-color: var(--background-color);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-end;
    padding-bottom: 20px;
    z-index: 0;
}

#backButton {
    height: 40px;
    width: 40px;
    text-align: center;
    border-radius: var(--buttonBorderRadius);
    /* padding: 6px; */
    background-color: var(--buttonColor);
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 1;
    font-size: 40pt;
}

#backButton:before,
#backButton:after {
    position: absolute;
    left: 18.5px;
    top: 3.2px;
    content: ' ';
    height: 33px;
    width: 2px;
    background-color: #333;
}

#backButton:before {
    transform: rotate(45deg);
}

#backButton:after {
    transform: rotate(-45deg);
}

#backButton:hover {
    cursor: pointer;
    background-color: var(--buttonColorHover);
}

#filterDropdownBoundingBox {
    width: 30%;
    height: auto;
    top: 40px;
    /* right: calc(30% + 33px + 64px); */
    left: 70px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    position: absolute;
}

#filterDropdownBoundingBox div {
    display: flex;
    flex-direction: column;
    justify-content: start;
    margin-right: 10px;
}

select {
    width: auto;
}

#availableRuleBoundingBox {
    width: 1200px;
    height: auto;
    top: 10px;
    right: 25px;
    display: flex;
    flex-wrap: wrap;
    position: absolute;
}

.availableRuleBox {
    width: 69px;
    height: 60px;
    margin: 3px;
    padding: 3px 3px 0 3px;
    background-color: var(--sectionBackground);
    text-align: center;
}

.availableBoxSeverity {
    height: 10px;
    width: 100%;
    position: absolute;
    bottom: 0;
    margin-left: -3px;
    /* margin: -1px; */
}

#listGridItem {
    height: 95.5%;
}

#listDiv {
    height: calc(100% - 56px);
    width: 100%;
    background-color: var(--sectionBackground);
    border: var(--buttonBorderRadius);
    overflow: scroll;
}

.headerBox {
    height: 45px;
    width: 100%;
    background-color: transparent;
    overflow-x: visible;
}

.listHeader {
    color: #999;
    font-size: 22pt;
    white-space: nowrap;
}

#noAlertsText {
    color: #999;
    position: absolute;
    top: 10px;
    right: 0;
    font-size: 18pt;
}

.selectionGridItem {
    width: 30%;
}

#patientGridItem,
#alertGridItem {
    height: 70%;
}

.patientBox {
    width: 100%;
    height: auto;
}

.patientHeaderBox {
    width: 98%;
    height: 35px;
    /* height: 80px; */
    background-color: var(--buttonColor);
    border-radius: var(--buttonBorderRadius);
    cursor: pointer;
    padding: 3px 10px 3px 10px;
    /* display: flex; */
    /* flex-flow: row; */
    /* justify-content: space-between; */
}
.patientHeaderBox:hover {
    background-color: var(--buttonColorHover);
}
.patientHeaderBox.selected {
    background-color: var(--buttonSelected);
    border: var(--generalBorders);
    padding: 1px 8px 1px 8px
}
.patientHeaderBox.selected:hover {
    background-color: var(--buttonSelectedHover)

}
.patientHeaderBox h3:first-child {
    float: left;
}
.patientHeaderBox h3:nth-child(2) {
    font-weight: bold;
    font-size: 16pt;
    margin-top: -2px;
    float: right;
    position: relative;
    right: 20px;
    width: 10px;
}

.patientSeverityBox {
    height: inherit;
    width: 13px;
    float: right;
    margin: -10px;
    position: relative;
    right: -10px;
    top: 7px;
    border-radius: inherit;
    border: 1px black solid;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    z-index: 1;
}

#patientListHeader {
    position: absolute;
    top: -50px;
    left: 40px;
}

.alertBox {
    width: 80%;
    height: 0;
    opacity: 0;
    transform: scaleY(0);
    transform-origin: top;
    transition: transform 0.2s ease;
    margin-bottom: 10px;
}

.alertBox.selected {
    height: auto;
    transform: scaleY(1);
    opacity: 1;
}

.singleAlert {
    width: 100%;
    min-height: 50px;
    height: auto;
    background-color: var(--buttonColor);
    border-radius: var(--buttonBorderRadius);
    /* border-top-right-radius: 0;
        border-bottom-right-radius: 0; */
    cursor: pointer;
    padding: 10px;
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
}

.singleAlert p {
    width: 90%;
}

.singleAlert:hover {
    background-color: var(--buttonColorHover);
}

.singleAlert.selected {
    background-color: var(--buttonSelected);
    border: var(--generalBorders);
    padding: 9px;
}

.severityBox {
    /* height: 100%; */
    width: 13px;
    float: right;
    margin: -10px;
    position: relative;
    border-radius: inherit;
    border: 1px black solid;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
}

.sev1 {
    background-color: var(--severity1);
}

.sev2 {
    background-color: var(--severity2);
}

.sev3 {
    background-color: var(--severity3);
    color: white;
}

.sev4 {
    background-color: var(--severity4);
    color: white;
}

.sev5 {
    background-color: var(--severity5);
    color: white;
}

#infoDiv,
#patientDiv {
    height: calc(100% - 56px);
    width: 100%;
    background-color: var(--sectionBackground);
    border: var(--buttonBorderRadius);
    overflow: scroll;
    padding: 10px;
}

#infoDiv p,
#patientDiv p {
    margin-bottom: 10px;
}


.severityLevelBox {
    width: 40px;
    height: 40px;
    border: var(--generalBorders);
    position: absolute;
    top: 10px;
    right: 10px;
    text-align: center;
    font-size: calc(1vw + 1vh);
    line-height: 40px;
}
.severityLevelBox p {
    margin-top: -2px;
}

.infoBoxes {
    border-bottom: 2px solid;
    border-color: #aeaeae;
    padding: 10px;
}

#patientValueBox {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: -10px;
}

#drugInfoBox p {
    font-weight: bold;
}

#drugInfoBox ul {
    margin-top: -10px;
    margin-left: -15px;
    columns: 2;
}

#formBoundingBox {
    width: 95%;
    margin: auto;
    margin-top: 10px;
}

.formCategoryHeader {
    font-size: 12pt;
}

#formBoundingBox textarea {
    width: 100%;
    height: 150px;
}
#formBoundingBox button {
    width: 55px;
    height: 30px;
    float: right;
    background-color: var(--buttonColor);
    border-radius: var(--buttonBorderRadius);
    border: 0;
    position: absolute;
    bottom: -30px;
    right: 0;
}
#formBoundingBox button:last-child {
    right: 60px;
}
#formBoundingBox button:hover {
    cursor: pointer;
    background-color: var(--buttonColorHover);
}

.actionCategoryBoundingBox {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
}

.actionCategoryDiv {
    padding: 0 5px 5px;
    display: flex;
    flex-flow: column wrap;
    width: calc(100% / 3);
    margin-bottom: 20px;
}

.actionCategoryDiv:nth-child(odd) {
    border-left: 2px #aeaeae solid;
    border-right: 2px #aeaeae solid;
}

.actionCategoryDiv input {
    margin-right: 5px;
}

.actionCategoryDiv select {
    width: 100%;
}

#recipientLegend {
    font-size: 10pt;
}

#warningTextArea {
    display: none;
}
#warningTextArea.visible {
    display: block;
}

.warningText {
    display: none;
    color: red;
}

.visible {
    display: block;
}

fieldset {
    border: 2px solid transparent;
    border-top-color: #aeaeae;
    box-sizing: border-box;
    margin-bottom: -20px;
}

legend {
    font-size: calc(0.6vw + 0.6vh);
    color: #333;
}
</style>