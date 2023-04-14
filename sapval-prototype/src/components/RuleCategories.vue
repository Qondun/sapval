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
    let ruleGrid = document.getElementById("ruleGrid");
    let catNames = selectionDataStore.getCategoryNames();
    for(var cat in catNames) {
        let categoryBoundingBox = document.createElement('div');
        categoryBoundingBox.classList.add('categoryBoundingBox')
        let categoryDiv = document.createElement('div');
        categoryDiv.classList.add('categoryDiv');
        categoryDiv.classList.add('gridButton');
        categoryDiv.setAttribute('id',parseInt(cat)+1)
        
        let categoryText = document.createElement('p');
        categoryText.innerHTML = catNames[cat];
        categoryDiv.appendChild(categoryText);
        
        let categoryCount = document.createElement('p');
        categoryCount.innerHTML = selectionDataStore.noAlertsForCategory(parseInt(cat)+1);
        categoryDiv.appendChild(categoryCount);

        categoryDiv.addEventListener('click', function() {
            layoutState.value = 3;
            selectionPageState.value = "Category";
            selectionStateVal.value = categoryDiv.id;
            console.log("selectionPageState: " + selectionPageState.value);
        });

        categoryBoundingBox.appendChild(categoryDiv);

        let ruleRange = selectionDataStore.getCategoryRange(parseInt(cat)+1)
        for(var i=ruleRange[0]; i<=ruleRange[1]; i++) {
            let ruleInfo = selectionDataStore.getRuleInformation(i);

            let ruleDiv = document.createElement('div');
            ruleDiv.classList.add('ruleDiv');
            ruleDiv.classList.add('gridButton');
            ruleDiv.setAttribute('id',i);

            let ruleText = document.createElement('p');
            ruleText.innerHTML = "<b>" + i + ":</b> " + ruleInfo.warningShortText;
            ruleDiv.appendChild(ruleText);

            let ruleCountText = document.createElement('p');
            ruleCountText.innerHTML = selectionDataStore.noAlertsForRule(i);
            ruleDiv.appendChild(ruleCountText);

            let severityLevelBox = document.createElement('div');
            let severityClass = "sev" + ruleInfo.severityLevel;
            severityLevelBox.classList.add(severityClass);
            severityLevelBox.classList.add('ruleSeverityBox');
            ruleDiv.appendChild(severityLevelBox);

            ruleDiv.addEventListener('click', function() {
                layoutState.value = 3;
                selectionPageState.value = "Rule";
                selectionStateVal.value = ruleDiv.id;
            });

            categoryBoundingBox.appendChild(ruleDiv);
        }
        ruleGrid.appendChild(categoryBoundingBox);
    }
}
</script>

<template>
    <div id="ruleGrid"></div>
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

#ruleGrid {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column wrap;
    padding: 7px 0 0 60px;
    overflow: auto;
    justify-content: flex-start; 
    column-gap: 10px;
}

.categoryBoundingBox {
    max-height: 95%;
    display: flex;
    flex-flow: column wrap;
    column-gap: 65px;
    row-gap: 3px;
    margin-bottom: 20px;
}

.categoryBoundingBox:first-child {
    width: calc(400px + 65px);
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