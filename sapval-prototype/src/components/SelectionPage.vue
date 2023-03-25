<script setup>
    import { computed, onMounted } from 'vue';
    import { getCategoryData, getPatientInformation } from '../records/dataFunctions';

    let filterRange = []; // [Lower bound, Upper bound]
    let filteredList = [];
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

    let [patientIDSet,dataList] = getCategoryData(selectionStateVal.value);

    onMounted(() => {
        setCategoryRange();
        createFilteredList();
        createFilterButtons();
        createLayout();        
    }) 

    function setCategoryRange() {
        switch (selectionStateVal.value) {
            case "A. Riskprofil":
                filterRange = [1,9];
                break;
            default:
                //filterRange = [1,63];
                filterRange = [1,9];
        }
    }

    function createFilteredList() {
        filteredList = [];
        switch (filterState) {
            case "1":
                for(var patient in dataList) {
                    for(var alert in patient) {
                        if(alert.regel==filterState){
                            filteredList.push(patient);
                            break;
                        }
                    }
                }
                break;
            default:
                filteredList = dataList;
        }
    };

    function createFilterButtons() {
        let selectionGrid = document.getElementById("selectionGrid");
        let filterButtonBox = document.createElement("div");
        filterButtonBox.setAttribute("id","filterBox");
        for(var i=filterRange[0]; i<=filterRange[1]; i++) {
            let filterButton = document.createElement("div");
            filterButton.classList.add("filterButton");
            let filterButtonText = document.createElement("p");
            filterButtonText.innerHTML = "Regel " + i;
            filterButton.appendChild(filterButtonText);
            filterButtonBox.appendChild(filterButton);
        }
        selectionGrid.appendChild(filterButtonBox);
    }

    function createLayout() {
        cleanListDiv();
        cleanListDiv();
        cleanPatientDiv();
        
        let listDiv = document.getElementById("listDiv");
        let patientIndex = 0; // not accessing all alerts

        // let headerText = document.createElement("h1");
        // headerText.innerHTML = selectionStateVal.value;
        // headerText.classList.add("listHeader");
        // listDiv.appendChild(headerText);

        patientIDSet.forEach((patientID) =>{
            
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
        let headerText = document.createElement("h1");
        headerText.innerHTML = "Varningsinformation";
        headerText.classList.add("listHeader");
        infoDiv.appendChild(headerText);

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
        let headerText = document.createElement("h1");
        headerText.innerHTML = "Patientinformation";
        headerText.classList.add("listHeader")
        patientDiv.appendChild(headerText);

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
            <h1 class="listHeader">{{ selectionStateVal.substr(2,selectionStateVal.length) }}</h1>
        </div>
        <div class="headerBox">
            <h1 class="listHeader">Varningsinformation</h1>
        </div>
        <div class="headerBox">
            <h1 class="listHeader">Patientinformation</h1>
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
        height: auto;
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

    .listHeader {
        position: absolute;
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

    .headerBox { 
        height: 20px;
        width: 30%;
        background-color: transparent;
        bottom: -100px;
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
        border: var(--generalBorders);
        border-radius: var(--buttonBorderRadius);
        cursor: pointer;
    }

    .patientBox h1:hover {
        background-color: var(--buttonColorHover);
    }

    .patientBox h1.selected {
        background-color: var(--buttonSelected);
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
        /*max-height: 2000px;
        transition: max-height 1.5s ease-in;*/
        opacity: 1;
        /*display: block;*/
    }

    .alertBox.selected:hover {
        background-color: var(--buttonSelectedHover);
    }

    .singleAlert {
        width: 100%;
        height: 50px;
        background-color: var(--buttonColor);
        border: var(--generalBorders);
        border-radius: var(--buttonBorderRadius);
        cursor: pointer;
    }

    .singleAlert:hover {
        background-color: var(--buttonColorHover);
    }

    .singleAlert.selected {
        background-color: var(--buttonSelected);
    }

    #infoDiv, #patientDiv {
        padding: 10px;
    }

    #infoDiv p, #patientDiv p {
        margin-bottom: 10px;
    }
</style>