<script setup>
    import { computed, onMounted } from 'vue';
    //import SelectionPageList from './SelectionPageList.vue'
    const props = defineProps({ modelValue: Number });
    const emit = defineEmits(['update:modelValue']);

    const val = computed({
        get() {
            return props.modelValue;
        },
        set(newVal) {
            emit('update:modelValue', parseInt(newVal));
        },
    });

    const list = [["Jenn", [4,3,1]], ["Mats", [3]], ["Ulrika", [5,4,4,1]], ["Celina", [3,2,2,1,1]]];
    onMounted(() => {
        let listDiv = document.getElementById("listDiv");
        list.forEach((patient) =>{
            /* Bounding box for each patient */
            let patientBox = document.createElement('div')
            patientBox.classList.add("patientBox");
            let headerText = document.createElement("h1");
            headerText.innerHTML = patient[0];
            patientBox.appendChild(headerText);

            /* Add all alerts into bounding box for alerts */ 
            let alertList = patient[1];
            let alertBox = document.createElement('div');
            alertBox.classList.add("alertBox");
            alertList.forEach((alert) =>{
                let singleAlertBox = document.createElement('div');
                singleAlertBox.classList.add("singleAlert")
                let singleAlertText = document.createElement('p');
                singleAlertText.innerHTML = alert;
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
                        updateInfoDiv(singleAlertText.innerHTML);
                    } else {
                        cleanInfoDiv();
                    }

                });
            });

            /* Event listener to header (top part of card) for expanding a patient */
            headerText.addEventListener("click", function() {
                let alreadySelected = patientBox.children[1].classList.contains("selected");
                listDiv.childNodes.forEach((patient) =>{
                    patient.childNodes.forEach((item) => {
                        item.classList.remove("selected");
                        console.log(item.childNodes);
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
                        updatePatientDiv(patient[0]);
                    });
                }
            });

            patientBox.appendChild(alertBox);
            listDiv.appendChild(patientBox)
        });
    }) 

    function cleanInfoDiv() {
        let infoDiv = document.getElementById("infoDiv");
        while(infoDiv.firstChild) {
            infoDiv.removeChild(infoDiv.firstChild);
        }
    }

    function updateInfoDiv(alertInfo) {
        cleanInfoDiv();
        let infoDiv = document.getElementById("infoDiv");
        let headerText = document.createElement("h1");
        headerText.innerHTML = "Alert information";
        infoDiv.appendChild(headerText);

        let alertText = document.createElement("p");
        alertText.innerHTML = "This will show information for alert " + alertInfo;
        infoDiv.appendChild(alertText);
    }

    function cleanPatientDiv() {
        let infoDiv = document.getElementById("patientDiv");
        while(infoDiv.firstChild) {
            infoDiv.removeChild(infoDiv.firstChild);
        }
    }

    function updatePatientDiv(patientInfo) {
        cleanPatientDiv();
        let patientDiv = document.getElementById("patientDiv");
        let headerText = document.createElement("h1");
        headerText.innerHTML = "Patient information";
        patientDiv.appendChild(headerText);

        let alertText = document.createElement("p");
        alertText.innerHTML = "This will show information for patient " + patientInfo;
        patientDiv.appendChild(alertText);
    }
</script>

<template>
    <div id="selectionGrid">
        <button style="height: 50px; position: absolute; left: 10px; top: 10px" @click="val=0">Backa</button>
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
        background-color: var(--background-color);
    }

    .selectionGridItem {
        width: 30%;
        height: 85%;
        margin-top: 100px;
        background-color: var(--sectionBackground);
        border: var(--buttonBorderRadius);
        overflow: scroll;
    }

    .patientBox {
        width: 100%;
        height: auto;
    }
    .patientBox h1 {
        width: 100%;
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
</style>