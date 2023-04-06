<script setup>
import { isInDestructureAssignment } from '@vue/compiler-core';
import { computed, onMounted } from 'vue';
import { getCategoryData, getRuleData, getPatientInformation, getRuleInformation, numberForRule, getFilteredData, getWardNames } from '../records/dataFunctions';
import { storeToRefs } from 'pinia'
import { useWarningsByWardStore } from '../stores/warningsByWard';
import { useWarningsByRuleStore } from '../stores/warningsByRule';

let filterRange = []; // [Lower bound, Upper bound]
let dataList = [];
let patientIDSet = new Set();
let ruleNumberSet = [];

let wardName = "All";
let categoryID = 0;
let ruleNr = 0;

const wardStore = useWarningsByWardStore()
wardStore.initialize()

const wardStoreRef = storeToRefs(wardStore)

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
    [patientIDSet, dataList, ruleNumberSet] = getFilteredData(wardName, categoryID, ruleNr);
    setCategoryRange();
    createFilterDropdowns();
    createAvailableRuleBoxes();
    setUp();
})

function setUp() {
    setCategoryRange();
    [patientIDSet, dataList, ruleNumberSet] = getFilteredData(wardName, categoryID, ruleNr);
    createLayout();
}

function setCategoryRange() {
    switch (categoryID) {
        case 1:
            filterRange = [1, 9];
            break;
        case 2:
            filterRange = [10, 15];
            break;
        case 3:
            filterRange = [16, 33];
            break;
        case 4:
            filterRange = [34, 40];
            break;
        case 5:
            filterRange = [41, 49];
            break;
        case 6:
            filterRange = [50, 51];
            break;
        case 7:
            filterRange = [52, 55];
            break;
        case 8:
            filterRange = [56, 58];
            break;
        case 9:
            filterRange = [59, 63];
            break;
        default:
            filterRange = [1, 63];
        //filterRange = [1,9];  
    }
}

function createFilterDropdowns() {
    let selectionGrid = document.getElementById("selectionGrid")
    let filterDropdownBoundingBox = document.createElement('div');
    filterDropdownBoundingBox.setAttribute('id','filterDropdownBoundingBox');

    if(selectionPageState.value!="Ward") {
        let wardBox = document.createElement('div');
        let wardLegend = document.createElement('legend');
        wardLegend.innerHTML = "Avdelningar";
        wardBox.appendChild(wardLegend);

        let wardSelect = document.createElement('select');
        wardSelect.setAttribute('id','wardSelect');
        wardSelect.addEventListener('change', (event) =>{
            wardName = event.target.value;
            setUp();
        });

        let allOption = document.createElement('option');
        allOption.innerHTML = "Alla";
        allOption.setAttribute('value', 0)
        wardSelect.appendChild(allOption);

        let wardNames = getWardNames();
        wardNames.forEach((ward) =>{
            // let wardData = numberForRule(ruleNr);
            let wardOption = document.createElement('option');
            wardOption.setAttribute('value', ward);
            wardOption.innerHTML = "Avdelning " + ward;
            wardSelect.appendChild(wardOption);
        });
        wardBox.appendChild(wardSelect);
        filterDropdownBoundingBox.appendChild(wardBox);
    } 
    if (selectionPageState.value!="Category") {
        let categoryBox = document.createElement('div');
        let categoryLegend = document.createElement('legend');
        categoryBox.appendChild(categoryLegend);
        categoryLegend.innerHTML = "Kategorier";

        let categorySelect = document.createElement('select');
        categorySelect.setAttribute('id','ruleSelect');
        categorySelect.setAttribute('onChange', 'updateFilter()')
        let allOption = document.createElement('option');
        allOption.innerHTML = "Alla";
        categorySelect.appendChild(allOption);
        categoryBox.appendChild(categorySelect);
        filterDropdownBoundingBox.appendChild(categoryBox);
    } 
    if(selectionPageState.value!="Rule") {
        let ruleBox = document.createElement('div');
        let ruleLegend = document.createElement('legend');
        ruleLegend.innerHTML = "Regler";
        ruleBox.appendChild(ruleLegend);

        let ruleSelect = document.createElement('select');
        ruleSelect.setAttribute('id','ruleSelect');
        ruleSelect.addEventListener('change', (event) =>{
            console.log("rulenr before: " + ruleNr);
            ruleNr = event.target.value;
            console.log("rulenr after: " + ruleNr);
            setUp();
        });

        let allOption = document.createElement('option');
        allOption.innerHTML = "Alla";
        allOption.setAttribute('value', 0)
        ruleSelect.appendChild(allOption);

        for (var ruleNum = filterRange[0]; ruleNum <= filterRange[1]; ruleNum++) {
            let ruleData = numberForRule(ruleNum);
            let ruleOption = document.createElement('option');
            ruleOption.setAttribute('value', ruleNum);
            ruleOption.innerHTML = "Regel " + ruleNum + ": " + ruleData + " st";
            ruleSelect.appendChild(ruleOption);
        }
        ruleBox.appendChild(ruleSelect);
        filterDropdownBoundingBox.appendChild(ruleBox);
    }

    selectionGrid.appendChild(filterDropdownBoundingBox);
}

function createAvailableRuleBoxes() {
    let selectionGrid = document.getElementById("selectionGrid");
    let availableRuleBoundingBox = document.createElement("div");
    availableRuleBoundingBox.setAttribute("id", "availableRuleBoundingBox");
    for (var ruleNr = filterRange[0]; ruleNr <= filterRange[1]; ruleNr++) {
        let ruleData = numberForRule(ruleNr);
        let availableRuleBox = document.createElement("div");
        availableRuleBox.classList.add("availableRuleBox");
        availableRuleBox.setAttribute("id", ruleNr);
        let availableRuleBoxText = document.createElement("p");
        availableRuleBoxText.innerHTML = "Regel " + ruleNr + "<br>" + ruleData + " st";
        availableRuleBox.appendChild(availableRuleBoxText);
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
        let patientData = getPatientInformation(patientID);
        let alertList = dataList[patientIndex];
        let headerText = document.createElement("h3");
        headerText.innerHTML = patientData['First Name'] + " " + patientData['Last Name'] + ", " + patientData['Age'];
        let noAlerts = document.createElement('h3');
        noAlerts.innerHTML = "Antal varningar: " + alertList.length
        patientHeaderBox.appendChild(headerText);
        patientHeaderBox.appendChild(noAlerts);
        patientBox.appendChild(patientHeaderBox);

        /* Add all alerts into bounding box for alerts */
        let alertBox = document.createElement('div');
        alertBox.classList.add("alertBox");
        let alertIndex = 0;
        alertList.forEach((alert) => {
            let ruleInfo = getRuleInformation(alert.Regel);
            let singleAlertBox = document.createElement('div');
            singleAlertBox.classList.add("singleAlert");
            singleAlertBox.setAttribute("id", alertIndex);
            let singleAlertText = document.createElement('p');

            // Remake getRuleInformation to give alert name and severity level
            singleAlertText.innerHTML = "Regel " + alert.Regel + ": " + ruleInfo.warningName;
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
                } else {
                    cleanInfoDiv();
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
    while (listDiv.firstChild) {
        listDiv.removeChild(listDiv.firstChild);
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
    let infoDiv = document.getElementById("infoDiv");
    let alertInfo = dataList[patientIndex][alertIndex];
    let ruleInfo = getRuleInformation(alertInfo.Regel);

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

    // Drug information
    mainInfoBox.appendChild(createDividingLine("Läkemedel"));

    let drugInfoBox = document.createElement("div");
    drugInfoBox.setAttribute("id", "drugInfoBox");
    drugInfoBox.classList.add("infoBoxes");
    let drugList = document.createElement("ul");

    alertInfo["RiskLM"].split(", ").forEach((drug) => {
        let singleDrug = document.createElement("li");
        singleDrug.innerHTML = drug;
        drugList.appendChild(singleDrug);
    })
    drugInfoBox.appendChild(drugList);
    mainInfoBox.appendChild(drugInfoBox);

    // Dosing information
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

    if(ruleInfo.CentralApotekarenToDo!="") {
        mainInfoBox.appendChild(createDividingLine("Åtgärd"));

        let toDoBox = document.createElement("div");
        toDoBox.setAttribute("id", "toDoBox");
        toDoBox.classList.add("infoBoxes");
        let toDoText = document.createElement("p");
        toDoText.innerHTML = ruleInfo.CentralApotekarenToDo;
        toDoBox.appendChild(toDoText);
        mainInfoBox.appendChild(toDoBox);
    }

    //JENNS BUTTON STUFF
    console.log(wardStoreRef)
    // mainInfoBox.appendChild(createActionBox(patientIndex, alertIndex));
    //mainInfoBox.appendChild(createDividingLine("Update Alert Jenn"));
    mainInfoBox.appendChild(createDataUpdateButton("Jenn Button", 'JennID'));
    infoDiv.appendChild(mainInfoBox);
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
    patientAge.innerHTML = patientData["Birthday"]+ "-" + patientData["RandomFourDigitCode"] + " (" + patientData["Age"] + " år)";
    patientDiv.appendChild(patientAge);

    // Ward information for patient
    let wardInfoBox = document.createElement("div");
    wardInfoBox.classList.add("infoBoxes");
    patientDiv.appendChild(createDividingLine("Avdelningsinformation"));
    let wardInfo = document.createElement("p");
    wardInfo.innerHTML = "<b>Avdelning:</b> " + patientData["OA enhet"];
    wardInfoBox.appendChild(wardInfo);
    let patientInfo = document.createElement("p");
    patientInfo.innerHTML = "<b>Typ av verksamhet:</b> " + patientData["MA verksamhet"];
    wardInfoBox.appendChild(patientInfo);
    patientDiv.appendChild(wardInfoBox);

    // Comments for patient

    let commentBox = document.createElement("div");
    commentBox.classList.add("infoBoxes");
    patientDiv.appendChild(createDividingLine("Tidigare kommentarer"));
    dataList[patientIndex].forEach((alert) => {
        let comment = document.createElement("p");
        comment.innerHTML = alert["Kommentar"];
        commentBox.appendChild(comment);
    });
    patientDiv.appendChild(commentBox);
}

function createDividingLine(label) {
    let fieldset = document.createElement("fieldset");
    let legend = document.createElement("legend");
    legend.innerHTML = label
    fieldset.appendChild(legend);
    return fieldset;
}

function createDataUpdateButton(label, id) {
    let filterButton = document.createElement("div");
    filterButton.classList.add("filterButton");
    filterButton.setAttribute("id", id);
    let filterButtonText = document.createElement("p");
    filterButtonText.innerHTML = "Jenn Button";
    filterButton.appendChild(filterButtonText);
    console.log("Creating the button...")
    console.log(wardStoreRef)
    filterButton.addEventListener("click", function () {

        console.log("clicked");
        let wardsStore = useWarningsByWardStore()
        let warningStore = useWarningsByRuleStore()
        wardStore.initialize()
        //console.log(this.wardStore);
        //wardsStore.testButton(id, 0, 1);
        wardsStore.completedWarningWardChartUpdate(4, 5, 15);
        warningStore.completedWarningWardChartUpdate(3, 4, 5)


    });

    return filterButton
}

</script>

<template>
    <div id="selectionGrid">
        <!-- <h1 class="listHeader">{{ selectionStateVal.value }}</h1>    -->
        <div id="backButton" @click="layoutState = 0">
            <p>Backa</p>
        </div>
        <div id="listGridItem" class="selectionGridItem">
            <div class="headerBox">
                <!-- <p v-if="selectionPageState == 'Category' && selectionStateVal.value=0" id="patientListHeader" class="listHeader">Kategori: {{ selectionStateVal.substring(selectionStateVal.indexOf(' ') + 1) }}</p> -->
            </div>
            <div id="listDiv"></div>
        </div>
        
        <div id="alertGridItem" class="selectionGridItem">
            <div class="headerBox">
                <p class="listHeader">Varningsinformation</p>
            </div>
            <div id="infoDiv">
                <div id="actionBox">
                    <div id="optionButtonBox">
                        <div id="dismissOptionButton" class="optionTab" :class="{ selected: selectedTab==0 }">
                            <p>Dismiss</p>
                        </div>
                    </div>
                </div>
            </div>
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
}

#backButton {
    height: 40px;
    width: 60px;
    text-align: center;
    border-radius: var(--buttonBorderRadius);
    padding: 6px;
    background-color: var(--buttonColor);
    position: absolute;
    left: 32px;
    top: 10px;
}

#backButton:hover {
    cursor: pointer;
    background-color: var(--buttonColorHover);
}

#filterDropdownBoundingBox {
    width: 10%;
    height: auto;
    top: 10px;
    /* right: calc(30% + 33px + 64px); */
    left: 15.5%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    position: absolute;
}
#filterDropdownBoundingBox div {
    display: flex;
    margin-left: 15px;
    flex-direction: row;
    justify-content: start;
}

select {
    width: auto;
}

#availableRuleBoundingBox {
    width: 63.4%;
    height: auto;
    top: 10px;
    right: 33px;
    display: flex;
    flex-wrap: wrap;
    /* justify-content: space-between; */
    position: absolute;
}

.availableRuleBox {
    width: 66px;
    height: 50px;
    margin: 3px;
    /* margin-right: 10px;
    margin-left: 10px; */
    padding: 3px;
    background-color: var(--sectionBackground);
    /* border-radius: var(--buttonBorderRadius); */
    text-align: center;
}
/* 
.availableRuleBox.selected {
    background-color: var(--buttonSelected);
    border: var(--generalBorders);
}

.availableRuleBox.unavailable {
    background-color: var(--unavailableButton);
    cursor: default;
    color: #999;
} */
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


.selectionGridItem {
    width: 30%;
}

#patientGridItem, #alertGridItem {
    height: 80%;
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
    display: flex;
    flex-flow: row;
    justify-content: space-between;
}
.patientHeaderBox:hover {
    background-color: var(--buttonColorHover);
}

.patientHeaderBox.selected {
    background-color: var(--buttonSelected);
    border: var(--generalBorders);
}
.patientHeaderBox.selected:hover {
    background-color: var(--buttonSelectedHover)
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
    height: calc(100% - 56px);;
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
#infoDiv ul {
    columns: 2;
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

#drugInfoBox {}

#drugInfoBox p {
    font-weight: bold;
}

#drugInfoBox ul {
    margin-top: -10px;
    margin-left: -15px;
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