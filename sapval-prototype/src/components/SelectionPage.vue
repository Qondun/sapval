<script setup>
    import { computed, onMounted } from 'vue';
    import { getCategoryData, getRuleData, getPatientInformation } from '../records/dataFunctions';

    let filterRange = []; // [Lower bound, Upper bound]
    let filteredList = [];
    let filteredIDSet = new Set();
    let filterState = 0;

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

    let [patientIDSet,dataList,ruleNumberSet] = getCategoryData(selectionStateVal.value);

    onMounted(() => {
        //setCategoryRange();
        createFilterButtons();
        setUp();
    }) 

    function setUp() {
        createFilteredList();
        createLayout();        
    }

    // function setCategoryRange() {
    //     switch (selectionStateVal.value) {
    //         case "A. Riskprofil":
    //             filterRange = [1,9];
    //             break;
    //         case "B. Interaktioner":
    //             filterRange = [10,15];
    //             break;
    //         case "C. Njurfunktion":
    //             filterRange = [16,33];
    //             break;
    //         case "D. Läkemedel och äldre":
    //             filterRange = [34,40];
    //             break;
    //         case "E. Läkemedel och labvärden":
    //             filterRange = [41,49];
    //             break;
    //         case "F. Läkemedel och diagnos":
    //             filterRange = [50,51];
    //             break;
    //         case "G. Läkemedel och status":
    //             filterRange = [52,55];
    //             break;
    //         case "H. Övriga läkemedelskombinationer":
    //             filterRange = [56,58];
    //             break;
    //         case "I. Övrigt":
    //             filterRange = [59,63];
    //             break;
    //         default:
    //             //filterRange = [1,63];
    //             filterRange = [1,9];
    //     }
    // }

    function createFilteredList() {
        filteredList = [];
        console.log("filterState: " + filterState)
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
        ruleNumberSet.forEach((number) =>{
            let filterButton = document.createElement("div");
            filterButton.classList.add("filterButton");
            filterButton.setAttribute("id",number);
            let filterButtonText = document.createElement("p");
            filterButtonText.innerHTML = "Regel " + number;
            filterButton.appendChild(filterButtonText);
            filterButtonBox.appendChild(filterButton);
            
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
        });
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
            let headerText = document.createElement("h1");

            let patientData = getPatientInformation(patientID);
            headerText.innerHTML = patientData['First Name'] + " " + patientData['Last Name'] + ", " + patientData['Age'];
            patientBox.appendChild(headerText);
            
            /* Add all alerts into bounding box for alerts */ 
            let alertList = filteredList[patientIndex];
            let alertBox = document.createElement('div');
            alertBox.classList.add("alertBox");
            let alertIndex = 0;
            alertList.forEach((alert) =>{
                let singleAlertBox = document.createElement('div');
                singleAlertBox.classList.add("singleAlert");
                singleAlertBox.setAttribute("id",alertIndex);
                let singleAlertText = document.createElement('p');
                singleAlertText.innerHTML = "Regel " + alert.Regel + ": " + alert.Regelkategori.substr(3,alert.Regelkategori.length);
                singleAlertBox.appendChild(singleAlertText);
                alertBox.appendChild(singleAlertBox);

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
                        updatePatientDiv(patientData);
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

        let alertText = document.createElement("p");
        alertText.innerHTML = "Här visas information för regel " + filteredList[patientIndex][alertIndex].Regel;
        infoDiv.appendChild(alertText);

        let alert = filteredList[patientIndex][alertIndex];

        for(var info in alert) {
            let infoValue = alert[info];
            if(infoValue){
                let alertInfo = document.createElement("p");
                alertInfo.innerHTML = info + ": " + infoValue;
                infoDiv.appendChild(alertInfo);
            }
        }
    }

    function cleanPatientDiv() {
        let infoDiv = document.getElementById("patientDiv");
        while(infoDiv.firstChild) {
            infoDiv.removeChild(infoDiv.firstChild);
        }
    }

    function updatePatientDiv(patientData) {
        cleanPatientDiv();
        let patientDiv = document.getElementById("patientDiv");

        for(var info in patientData) {
            let infoValue = patientData[info]
            if(infoValue){
                let patientInfo = document.createElement("p");
                patientInfo.innerHTML = info + ": " + infoValue;
                patientDiv.appendChild(patientInfo);
            }
        }
    }
</script>

<template>
    <div id="selectionGrid">
        <!-- <h1 class="listHeader">{{ selectionStateVal.value }}</h1>    -->
        <div id="backButton" @click="layoutState=0">
            <p>Backa</p>
        </div>
        <div class="headerBox">
            <p class="listHeader">{{ selectionStateVal.substr(2,selectionStateVal.length) }}</p>
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
        height: 70px;
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
    .patientBox h1 {
        width: 98%;
        height: 80px;
        background-color: var(--buttonColor);
        border-radius: var(--buttonBorderRadius);
        cursor: pointer;
        padding: 10px;
    }

    .patientBox h1:hover {
        background-color: var(--buttonColorHover);
    }

    .patientBox h1.selected {
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
        height: 50px;
        background-color: var(--buttonColor);
        border-radius: var(--buttonBorderRadius);
        cursor: pointer;
        padding: 10px;
        margin-top: 5px;
    }

    .singleAlert:hover {
        background-color: var(--buttonColorHover);
    }

    .singleAlert.selected {
        background-color: var(--buttonSelected);
        border: var(--generalBorders);
    }

    #infoDiv, #patientDiv {
        padding: 10px;
    }

    #infoDiv p, #patientDiv p {
        margin-bottom: 10px;
    }
</style>