<script setup>
    import { isInDestructureAssignment } from '@vue/compiler-core';
import { computed, onMounted } from 'vue';
    import { getCategoryData, getRuleData, getPatientInformation, getRuleInformation, numberForRule } from '../records/dataFunctions';

    let filterRange = []; // [Lower bound, Upper bound]
    let dataList = [];
    let filteredList = [];
    let patientIDSet = new Set();
    let filteredIDSet = new Set();
    let filterState = 0;
    let ruleNumberSet = [];

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
        setCategoryRange();
        [patientIDSet,dataList,ruleNumberSet] = getCategoryData(filterRange);
        createFilterButtons();
        setUp();
    }) 

    function setUp() {
        createFilteredList();
        createLayout();        
    }

    function setCategoryRange() {
        console.log("setCategoryRange")
        switch (selectionStateVal.value) {
            case "A. Riskprofil":
                filterRange = [1,9];
                break;
            case "B. Interaktioner":
                filterRange = [10,15];
                break;
            case "C. Njurfunktion":
                filterRange = [16,33];
                break;
            case "D. Läkemedel och äldre":
                filterRange = [34,40];
                break;
            case "E. Läkemedel och labvärden":
                filterRange = [41,49];
                break;
            case "F. Läkemedel och diagnos":
                filterRange = [50,51];
                break;
            case "G. Läkemedel och status":
                filterRange = [52,55];
                break;
            case "H. Övriga läkemedelskombinationer":
                filterRange = [56,58];
                break;
            case "I. Övrigt":
                filterRange = [59,63];
                break;
            default:
                filterRange = [1,63];
                //filterRange = [1,9];
        }
    }

    function createFilteredList() {
        filteredList = [];
        switch(filterState) {
            case 0:
                [filteredIDSet,filteredList] = [patientIDSet,dataList];
                break;
            default:
                [filteredIDSet,filteredList] = getRuleData(filterState);
        }
        
    };

    function createFilterButtons() {
        let selectionGrid = document.getElementById("selectionGrid");
        let filterButtonBox = document.createElement("div");
        filterButtonBox.setAttribute("id","filterBox");
        for(var ruleNr=filterRange[0]; ruleNr <= filterRange[1]; ruleNr++){
            let ruleData = numberForRule(ruleNr);
            let filterButton = document.createElement("div");
            filterButton.classList.add("filterButton");
            filterButton.setAttribute("id",ruleNr);
            let filterButtonText = document.createElement("p");
            filterButtonText.innerHTML = "Regel " + ruleNr + "<br>" + ruleData + " st";
            filterButton.appendChild(filterButtonText);
            filterButtonBox.appendChild(filterButton);
    
            if(ruleNumberSet.includes(parseInt(filterButton.id))){
                filterButton.addEventListener("click", function(){
                    if(filterState == filterButton.id){
                        filterState = 0;
                        filterButtonBox.childNodes.forEach((button) =>{
                            button.classList.remove("selected");
                        });
                    } else {
                        filterState = filterButton.id;
                        filterButtonBox.childNodes.forEach((button) =>{
                            button.classList.remove("selected");
                        });
                        filterButton.classList.add("selected")
                    }
                    setUp();
                });
            } else {
                filterButton.classList.add("unavailable")
            }
        };
        selectionGrid.appendChild(filterButtonBox);
    }

    function createLayout() {
        cleanListDiv();
        cleanInfoDiv();
        cleanPatientDiv();
        
        let listDiv = document.getElementById("listDiv");
        let patientIndex = 0; // not accessing all alerts

        filteredIDSet.forEach((patientID) =>{
            
            /* Bounding box for each patient */
            let patientBox = document.createElement('div')
            patientBox.classList.add("patientBox");
            patientBox.setAttribute("id",patientIndex);
            let headerText = document.createElement("h3");

            let patientData = getPatientInformation(patientID);
            headerText.innerHTML = patientData['First Name'] + " " + patientData['Last Name'] + ", " + patientData['Age'];
            patientBox.appendChild(headerText);
            
            /* Add all alerts into bounding box for alerts */ 
            let alertList = filteredList[patientIndex];
            let alertBox = document.createElement('div');
            alertBox.classList.add("alertBox");
            let alertIndex = 0;
            alertList.forEach((alert) =>{
                let ruleInfo = getRuleInformation(alert.Regel);
                let singleAlertBox = document.createElement('div');
                singleAlertBox.classList.add("singleAlert");
                singleAlertBox.setAttribute("id",alertIndex);
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
                singleAlertBox.addEventListener("click", function() {
                    let alertBoxList = document.getElementsByClassName("alertBox");
                    let alreadySelected = singleAlertBox.classList.contains("selected");
                    for(var i = 0; i < alertBoxList.length; i++){
                        alertBoxList[i].childNodes.forEach((singleAlert) =>{
                            singleAlert.classList.remove("selected");
                        });
                    }
                    if(!alreadySelected) {
                        singleAlertBox.classList.add("selected");
                        updateInfoDiv(patientBox.id,singleAlertBox.id);
                    } else {
                        cleanInfoDiv();
                    }

                });
                alertIndex++;
            });

            /* Event listener to header (top part of card) for expanding a patient */
            headerText.addEventListener("click", function() {
                let alreadySelected = patientBox.children[1].classList.contains("selected");
                listDiv.childNodes.forEach((patient) =>{
                    patient.childNodes.forEach((item) => {
                        item.classList.remove("selected");
                    });
                });

                /* Unselect alerts when closing patient */
                let alertBoxList = document.getElementsByClassName("alertBox");
                for(var i = 0; i < alertBoxList.length; i++){
                    alertBoxList[i].childNodes.forEach((singleAlert) =>{
                        singleAlert.classList.remove("selected");
                    });
                }
                cleanInfoDiv();
                cleanPatientDiv();

                if(!alreadySelected){
                    patientBox.childNodes.forEach((item) =>{
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
        while(listDiv.firstChild) {
            listDiv.removeChild(listDiv.firstChild);
        }
    }

    function cleanInfoDiv() {
        let infoDiv = document.getElementById("infoDiv");
        while(infoDiv.firstChild) {
            infoDiv.removeChild(infoDiv.firstChild);
        }
    }

    function updateInfoDiv(patientIndex, alertIndex) {
        cleanInfoDiv();
        let infoDiv = document.getElementById("infoDiv");
        let alertInfo = filteredList[patientIndex][alertIndex];
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
        mainInfoBox.setAttribute("id","mainInfoBox");
        let patientValueBox = document.createElement("div");
        patientValueBox.setAttribute("id","patientValueBox");
        patientValueBox.classList.add("infoBoxes");

        mainInfoBox.appendChild(createDividingLine("Patientvärden"));

        let patientValueArray = ["GFR", "K", "Ca", "Puls"];
        patientValueArray.forEach((info) =>{
            let patientInfo = document.createElement("p");
            patientInfo.innerHTML = info + ": " + alertInfo[info];
            patientValueBox.appendChild(patientInfo);
        });
        mainInfoBox.appendChild(patientValueBox);

        // Drug information
        mainInfoBox.appendChild(createDividingLine("Läkemedel"));

        let drugInfoBox = document.createElement("div");
        drugInfoBox.setAttribute("id","drugInfoBox");
        drugInfoBox.classList.add("infoBoxes");   
        let drugList = document.createElement("ul");
        
        alertInfo["RiskLM"][0].split(", ").forEach((drug) =>{
            let singleDrug = document.createElement("li");
            singleDrug.innerHTML = drug;
            drugList.appendChild(singleDrug);
        })
        drugInfoBox.appendChild(drugList);
        mainInfoBox.appendChild(drugInfoBox);

        // Dosing information
        mainInfoBox.appendChild(createDividingLine("Dosering"));

        let dosingInfoBox = document.createElement("div");
        dosingInfoBox.setAttribute("id","dosingInfoBox");
        dosingInfoBox.classList.add("infoBoxes");   
        let dosingText = document.createElement("p");
        let dosingTextValue = alertInfo["Dosering"];
        if(dosingTextValue) {
            dosingText.innerHTML = dosingTextValue;
        } else {
            dosingText.innerHTML = "Ingen doseringsinformation."
        }
        
        dosingInfoBox.appendChild(dosingText);
        mainInfoBox.appendChild(dosingInfoBox);

        infoDiv.appendChild(mainInfoBox);
    }

    function cleanPatientDiv() {
        let infoDiv = document.getElementById("patientDiv");
        while(infoDiv.firstChild) {
            infoDiv.removeChild(infoDiv.firstChild);
        }
    }

    function updatePatientDiv(patientData, patientIndex) {
        cleanPatientDiv();
        let patientDiv = document.getElementById("patientDiv");
        

        let alertText = document.createElement("h1");
        alertText.innerHTML = patientData["First Name"] + " " + patientData["Last Name"] + ", " + patientData["Birthday"] + "-" + patientData["RandomFourDigitCode"];
        patientDiv.appendChild(alertText);

        // Ward information for patient
        let wardInfoBox = document.createElement("div");
        wardInfoBox.classList.add("infoBoxes");
        patientDiv.appendChild(createDividingLine("Avdelningsinformation"));
        let wardInfo = document.createElement("p");
        wardInfo.innerHTML = "Avdelning: " + patientData["OA enhet"];
        wardInfoBox.appendChild(wardInfo);

        let patientInfo = document.createElement("p");
        patientInfo.innerHTML = "Typ av verksamhet: " + patientData["MA verksamhet"];
        wardInfoBox.appendChild(patientInfo);
        patientDiv.appendChild(wardInfoBox);

        // Comments for patient
        
        let commentBox = document.createElement("div");
        commentBox.classList.add("infoBoxes");
        patientDiv.appendChild(createDividingLine("Tidigare kommentarer"));
        filteredList[patientIndex].forEach((alert) =>{
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
</script>

<template>
    <div id="selectionGrid">
        <!-- <h1 class="listHeader">{{ selectionStateVal.value }}</h1>    -->
        <div id="backButton" @click="layoutState=0">
            <p>Backa</p>
        </div>
        <div class="headerBox">
            <p v-if="selectionPageState=='Category'" class="listHeader">Kategori: {{ selectionStateVal.substr(2,selectionStateVal.length) }}</p>
        </div>
        <div class="headerBox">
            <p class="listHeader">Varningsinformation</p>
        </div>
        <div class="headerBox">
            <p class="listHeader">Patientinformation</p>
        </div>
        <div id="listDiv" class="selectionGridItem"></div>
        <div id="infoDiv" class="selectionGridItem"></div>
        <div id="patientDiv" class="selectionGridItem"></div>
    </div>
</template>

<style>
    #selectionGrid {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-around;
        flex-direction: row;
        flex-wrap: wrap;
        background-color: var(--background-color);
    }

    #backButton {
        height: 50px;
        width: 70px;
        text-align: center;
        border-radius: var(--buttonBorderRadius);
        padding: 6px;
        background-color: var(--buttonColor);
        position: absolute;
        left: 10px;
        top: 10px;
    }

    #backButton:hover {
        cursor: pointer;
        background-color: var(--buttonColorHover);
    }

    #filterBox {
        width: auto;
        height: auto;
        top: 10px;
        display: flex;
        justify-content: space-between;
        position: absolute;
    }

    .filterButton {
        width: auto;
        height: 70px;
        margin-right: 10px;
        margin-left: 10px;
        padding: 10px;
        background-color: var(--buttonColor);
        border-radius: var(--buttonBorderRadius);
    }
    .filterButton:hover {
        background-color: var(--buttonColorHover);
        cursor: pointer;
    }

    .filterButton.selected {
        background-color: var(--buttonSelected);
        border: var(--generalBorders);
    }
    .filterButton.selected:hover {
        background-color: var(--buttonSelectedHover);
    }

    .filterButton.unavailable {
        background-color: var(--unavailableButton);
        cursor: default;
        color: #999;
    }
    
    .headerBox { 
        height: 20px;
        width: 30%;
        background-color: transparent;
        bottom: -92px;
    }

    .listHeader {
        position: absolute;
        color: #999;
        font-size: 26pt;
    }

    .selectionGridItem {
        width: 30%;
        height: 85%;
        background-color: var(--sectionBackground);
        border: var(--buttonBorderRadius);
        overflow: scroll;
        bottom: -50px;
    }

    .patientBox {
        width: 100%;
        height: auto;
    }
    .patientBox h3 {
        width: 98%;
        height: 35px;
        /* height: 80px; */
        background-color: var(--buttonColor);
        border-radius: var(--buttonBorderRadius);
        cursor: pointer;
        padding: 3px;
    }

    .patientBox h3:hover {
        background-color: var(--buttonColorHover);
    }

    .patientBox h3.selected {
        background-color: var(--buttonSelected);
        border: var(--generalBorders);
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

    #infoDiv, #patientDiv {
        padding: 10px;
    }

    #infoDiv p, #patientDiv p {
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

    #drugInfoBox {
    }
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
    }
    legend {
        font-size: calc(0.6vw + 0.6vh);
        color: #333;
    }
</style>