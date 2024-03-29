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
                let wardDiv = document.createElement('div');
                wardDiv.classList.add('wardDiv');
                wardDiv.classList.add('gridButton');
                wardDiv.setAttribute('id', currentWard.KeyNamn);

                let ruleText = document.createElement('p');
                ruleText.innerHTML = "<b>" + currentWard.KeyNamn + ".</b> ";
                wardDiv.appendChild(ruleText);

                let noAlerts = selectionDataStore.noAlertsForWard(currentWard.KeyNamn);
                let totalAlerts = noAlerts[0] + noAlerts[1] + noAlerts[2];

                
                if(totalAlerts) {
                    let allSeverityLevelBox = document.createElement('div');
                    allSeverityLevelBox.classList.add('allSeverityLevelBox');
                    for(var count in noAlerts) {
                        if(noAlerts[count]) {
                            let sevBoundingBox = document.createElement('div');
                            sevBoundingBox.classList.add('sevBoundingBox');
                            let sevLevelBox = document.createElement('div');
                            sevLevelBox.classList.add('sevLevelBox');
                            sevLevelBox.classList.add('sev' + (parseInt(count)+1));
                            sevBoundingBox.appendChild(sevLevelBox);

                            let sevLevelText = document.createElement('p');
                            sevLevelText.innerHTML = ": " + noAlerts[count];
                            sevBoundingBox.appendChild(sevLevelText);
                            allSeverityLevelBox.appendChild(sevBoundingBox);
                        }
                    }
                    wardDiv.appendChild(allSeverityLevelBox);
                    let wardCountText = document.createElement('p');
                    wardCountText.innerHTML = totalAlerts;
                    wardDiv.appendChild(wardCountText);
                } else {
                    let sevBoundingBox = document.createElement('div');
                    sevBoundingBox.classList.add('sevBoundingBox');
                    let sevLevelBox = document.createElement('div');
                    sevLevelBox.classList.add('assessed');
                    wardDiv.appendChild(sevLevelBox);
                }

                

                if(currentWard.WardContactPharmacistFirstName!='') {
                    let pharmacistDiv = document.createElement('div');
                    pharmacistDiv.classList.add('pharmacistDiv');

                    let pharmacistTooltip = document.createElement('span');
                    pharmacistTooltip.classList.add('pharmacistTooltip');
                    pharmacistTooltip.innerHTML = currentWard.WardContactPharmacistFirstName + ' ' + currentWard.WardContactPharmacistLastName;
                    pharmacistDiv.appendChild(pharmacistTooltip);
                    wardDiv.appendChild(pharmacistDiv);
                }

                wardDiv.addEventListener('click', function(){
                    layoutState.value = 3;
                    selectionPageState.value = "Ward";
                    selectionStateVal.value = wardDiv.id;
                });

                categoryBoundingBox.appendChild(wardDiv);
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

#wardGrid {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column wrap;
    padding: 7px 0 0 30px;
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

.wardDiv {
    width: 250px;
    height: 50px;
    display: flex;
    flex-flow: row wrap;
}

.categoryDiv p, .wardDiv p {
    display: inline;
}
.categoryDiv p:first-child {
    margin-right: 20px;
}

.wardDiv p:nth-child(3) {
    float: right;
    font-size: 130%;
    position: absolute;
    bottom: 0;
    right: 10px;
    font-size: 130%;
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
    width: 13px;
    height: 13px;
    background-image: url("./icons/pharmacistIcon.png");
    background-size: 13px 13px;
    position: relative;
    top: 5px;
    left: 5px;
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

.allSeverityLevelBox {
    width: 80%;
    position: absolute;
    left: 5px;
    bottom: 0px;
    display: flex;
    flex-flow: row wrap;
    column-gap: 12px;
}

.sevBoundingBox {
    width: calc(80% / 3);
    display: flex;
    flex-flow: row wrap;
    font-size: 12pt;
    column-gap: 2px;
} 
.sevBoundingBox p {
    margin-top: -5px;
}

.sevLevelBox {
    width: 17px;
    height: 17px;
    border: 1px black solid;
}

.sev1 {
    background-color: var(--severity1);
}

.sev2 {
    background-color: var(--severity2);
}

.sev3 {
    background-color: var(--severity3);
}

.assessed {
    background-color: var(--resolution3);
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
</style>