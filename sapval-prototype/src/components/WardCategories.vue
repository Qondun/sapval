<script setup>
import { computed, watch, onMounted, nextTick } from 'vue';
import { useSelectionDataStore } from '../stores/selectionData'
import { storeToRefs } from 'pinia'

import { wardsInfo } from '../records/inpatientWards.json';
import { WarningInfo } from '../records/warningList.json';
import { getRuleInformation } from '../records/dataFunctions';
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
    createRuleBottom();
})
onMounted(() => { // TODO: Find way to create different layouts. Easiest way is to do seperate components
    console.log("in ruleCategories")
    createRuleBottom();    
})

function createRuleBottom() {
    let ruleGrid = document.getElementById("wardGrid");
    let catNames = selectionDataStore.getWardCategoryNames();
    for(var cat in catNames) {
        let categoryBoundingBox = document.createElement('div');
        categoryBoundingBox.classList.add('wardGroupBoundingBox')
        let categoryHeader = document.createElement('p');
        categoryHeader.classList.add('categoryHeader');
        categoryHeader.innerHTML = catNames[cat];
        
        categoryBoundingBox.appendChild(categoryHeader);

        let wardList = selectionDataStore.getWardList();
        for(var ward in wardList){
            let currentWard = wardList[ward];
            if(currentWard.wardType==catNames[cat]) {
                let ruleDiv = document.createElement('div');
                ruleDiv.classList.add('ruleDiv');
                ruleDiv.classList.add('gridButton');
                ruleDiv.setAttribute('id', ward+1);

                let ruleText = document.createElement('p');
                ruleText.innerHTML = "<b>" + currentWard.KeyNamn + ":</b> ";
                ruleDiv.appendChild(ruleText);
                

                if(currentWard.WardContactPharmacistFirstName!='') {
                    let pharmacistDiv = document.createElement('div');
                    pharmacistDiv.classList.add('pharmacistDiv');

                    let pharmacistTooltip = document.createElement('span');
                    pharmacistTooltip.classList.add('pharmacistTooltip');
                    pharmacistTooltip.innerHTML = currentWard.WardContactPharmacistFirstName + ' ' + currentWard.WardContactPharmacistLastName;
                    pharmacistDiv.appendChild(pharmacistTooltip);
                    ruleDiv.appendChild(pharmacistDiv);
                }
                categoryBoundingBox.appendChild(ruleDiv);
            }
        }
        ruleGrid.appendChild(categoryBoundingBox);
    }
}
</script>

<template>
    <div id="wardGrid"></div>
</template>

<style>
b {
    font-weight: bold;
    font-size: 107%;
}
.gridButton {
    background-color: var(--buttonColor);
    border-radius: var(--buttonBorderRadius);
    padding: 3px;
    font-size: 100%;
    height: 37px;
}

.gridButton:hover {
    background-color: var(--buttonColorHover);
    cursor: pointer;
}

.categoryDiv p:last-child, .ruleDiv p:nth-child(2) {
    float: right;
    font-size: 130%;
}

#wardGrid {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column wrap;
    padding: 7px 0 0 60px;
    overflow: auto;
    justify-content: flex-start; 
    column-gap: 10px;
}

.wardGroupBoundingBox {
    max-height: 95%;
    display: flex;
    flex-flow: column wrap;
    column-gap: 65px;
    row-gap: 3px;
    margin-bottom: 20px;
}

.categoryHeader {
    font-size: 14pt;
}

.categoryDiv, .ruleDiv {
    width: 200px;
}

.categoryDiv {
    font-size: 105%;
    text-decoration: underline;
    border: var(--generalBorders)
}

.categoryDiv p, .ruleDiv p {
    display: inline;
}
.categoryDiv p:first-child {
    margin-right: 20px;
}

.ruleDiv p:nth-child(2) {
    margin-right: 20px;
}

.ruleSeverityBox {
    width: 10px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    text-align: center;
    font-size: calc(1vw + 1vh);
    line-height: 40px;
    border-radius: var(--buttonBorderRadius);
    border-bottom-left-radius: 0px;
    border-top-left-radius: 0;
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
</style>