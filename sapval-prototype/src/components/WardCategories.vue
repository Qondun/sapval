<script setup>
import { computed, watch, onMounted, nextTick } from 'vue';
import { useSelectionDataStore } from '../stores/selectionData'
import { storeToRefs } from 'pinia'

import { wardsInfo } from '../records/inpatientWards.json';
import { WarningInfo } from '../records/warningList.json';
const props = defineProps({
    layoutState: Number,
    selectionPageState: String,
    selectionStateVal: String
});

const selectionDataStore = useSelectionDataStore()

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

const selectionData = useSelectionDataStore()
const categoryNames = selectionData.getCategoryNames()

const { updated } = storeToRefs(selectionData)

watch(updated, () => {
    createWardBottom();
})
onMounted(() => { // TODO: Find way to create different layouts. Easiest way is to do seperate components
    createWardBottom();    
})

function createWardBottom() {
    let wardGrid = document.getElementById("wardGrid");
    let catNames = selectionDataStore.getCategoryNames();
    wardsInfo.forEach((ward) =>{
        let wardHeader = document.createElement('h2');
        console.log("ward: " + ward)
        wardHeader.innerHTML = ward.KeyNamn;
        wardGrid.appendChild(wardHeader);
    });
}
</script>

<template>
    <div v-if="selectionPageState == 'Ward'" id="wardGrid">
        <!-- <h1>Akut- och internmedicin</h1>
        <template v-for="ward in wardsInfo" :key="ward">
            <div v-if="ward.wardType=='Akut- och internmedicin'" class="wardDiv gridButton">
                <p>{{ ward.KeyNamn }} </p>
                <div v-if="ward.WardContactPharmacistFirstName != ''" class="pharmacistDiv">
                    <span class="pharmacistTooltip">{{ ward.WardContactPharmacistFirstName + ' ' +
                        ward.WardContactPharmacistLastName }}</span>
                </div>
                <p class="noAlertText"> {{ selectionDataStore.noAlertsForWard(ward.KeyNamn) }} </p>
            </div>
            
        </template> -->
    </div>
</template>

<style>
.gridButton {
    background-color: var(--buttonColor);
    border-radius: var(--buttonBorderRadius);
    padding: 5px;
    font-size: 100%;
}

.gridButton:hover {
    background-color: var(--buttonColorHover);
    cursor: pointer;
}

.gridButton p:first-child {
    font-weight: bold;
    font-size: 107%;
}

.gridButton p:last-child {
    float: right;
    font-size: 130%;
}

.noAlertText {
    position: absolute;
    bottom: 0;
    right: 5px;
}

.wardTypeText {
    margin-top: -9px;
}

#wardGrid {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding: 5px;
}

#wardGrid .gridButton {
    display: flex;
    flex-direction: column;
}

.wardDiv {
    margin: 5px;
}

.pharmacistDiv {
    width: 15px;
    height: 15px;
    background-image: url("./icons/pharmacistIcon.png");
    background-size: 20px 20px;
    position: absolute;
    display: inline-block;
    top: 10px;
    right: 10px;
    z-index: 1;
}

.pharmacistTooltip {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    top: -20px;
    right: 100%;
    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
}
.pharmacistDiv:hover .pharmacistTooltip {
    visibility: visible;
}


#ruleGrid {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column wrap;
    padding: 10px;
    overflow: auto;
    column-gap: 10px; 
}
.categoryDiv, .ruleDiv {
    width: 200px;
}

.categoryDiv {
    font-size: 105%;
    text-decoration: underline;
    margin-top: 34px;
    border: var(--generalBorders)
}
.categoryDiv:first-child{
    margin-top: 2px;
}
#ruleGrid > div:nth-child(20), #ruleGrid > div:nth-child(30), #ruleGrid > div:nth-child(55), #ruleGrid > div:nth-child(69) {
    margin-top: 0px;
}
#ruleGrid > div:nth-child(19), #ruleGrid > div:nth-child(54){
    margin-bottom: 50px;
}
#ruleGrid > div:nth-child(68) {
    margin-bottom: 70px;
}

.categoryDiv p, .ruleDiv p {
    display: inline;
}
.categoryDiv p:first-child {
    margin-right: 10px;
}

.ruleDiv {
    margin-top: 4px;
    font-weight: normal;
}

</style>