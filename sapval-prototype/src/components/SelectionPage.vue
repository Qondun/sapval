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

    const list = [[1, [4,3,1]], [2, [3]], [3, [5,4,4,1]], [41, [3,2,2,1,1]]];
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
            // alertBox.setAttribute("id","alertBox");
            alertList.forEach((alert) =>{
                let singleAlertBox = document.createElement('div');
                singleAlertBox.classList.add("singleAlert")
                let singleAlertText = document.createElement('p');
                singleAlertText.innerHTML = alert;
                singleAlertBox.appendChild(singleAlertText);
                alertBox.appendChild(singleAlertBox);
            });

            /* Event listener for expanding a patient */
            patientBox.addEventListener("click", function() {
                if(!patientBox.children[1].classList.contains("active")){
                    listDiv.childNodes.forEach((patient) =>{
                        patient.childNodes.forEach((item) => {
                            item.classList.remove("active");
                        });
                    });

                    patientBox.childNodes.forEach((item) =>{
                        item.classList.toggle("active");
                    });
                } else {
                    listDiv.childNodes.forEach((patient) =>{
                        patient.childNodes.forEach((item) => {
                            item.classList.remove("active");
                        });
                    });    
                }
            });

            patientBox.appendChild(alertBox);
            listDiv.appendChild(patientBox)
        });
    }) 
</script>

<template>
    <div id="selectionGrid">
        <button style="height: 50px; position: absolute; left: 10px; top: 10px" @click="val=0">Backa</button>
        <div id="listDiv" class="selectionGridItem"></div>
        <div id="alertDiv" class="selectionGridItem"></div>
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
        background-color: var(--buttonColor);
        border: var(--buttonBorderRadius);
        color: white;
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
    }

    .patientBox h1:hover {
        background-color: var(--buttonColorHover);
    }

    .patientBox h1.active {
        background-color: var(--buttonSelected);
    }
    
    .alertBox {
        width: 80%;
        height: 0;
        /*max-height: 0;
        transition: max-height 1s ease-out;*/
        opacity: 0;
        /*display: none;*/
        transform: scaleY(0);    
        transform-origin: top;
        transition: transform 0.2s ease;
    }

    .alertBox.active {
        height: auto;
        transform: scaleY(1);
        /*max-height: 2000px;
        transition: max-height 1.5s ease-in;*/
        opacity: 1;
        /*display: block;*/
    }

    .singleAlert {
        width: 100%;
        height: 50px;
        background-color: var(--buttonColor);
        border: var(--generalBorders);
        border-radius: var(--buttonBorderRadius);
    }
</style>