<script setup>

import { useActivityLogStore } from '../stores/logger';
import { useWarningsByRuleStore } from '../stores/warningsByRule';
import { useWarningsByWardStore } from '../stores/warningsByWard';
import { useSelectionDataStore } from '../stores/selectionData';


const props = defineProps({ modelValue: Number });
const emit = defineEmits(['update:modelValue']);
const activityLog = useActivityLogStore();
const warningsByRule = useWarningsByRuleStore();
const warningsByWard = useWarningsByWardStore();
const selectionDataStore = useSelectionDataStore();

function createDataUpdateButton(label, id) {
    let filterButton = document.createElement("div");
    filterButton.classList.add("filterButton");
    filterButton.setAttribute("id", id);
    let filterButtonText = document.createElement("p");
    filterButtonText.innerHTML = "Jenn Button";
    filterButton.appendChild(filterButtonText);
    // console.log("Creating the button...")
    // console.log(wardStoreRef)


    filterButton.addEventListener("click", function () {

        console.log("clicked");
        let wardsStore = useWarningsByWardStore()
        let warningStore = useWarningsByRuleStore()
        let act = useActivityLogStore()

        act.initialize()
        wardStore.initialize()
        //console.log(this.wardStore);
        //wardsStore.testButton(id, 0, 1);
        act.logAppend('hewwo');
        act.logConsole();
        wardsStore.completedWarningWardChartUpdate(4, 5, 15);
        warningStore.completedWarningWardChartUpdate(3, 4, 5);

        const blob = act.logDump()
        //   const e = document.createEvent('MouseEvents'),
        //      a = document.createElement('a');
        //  a.download = "test.json";
        //  a.href = window.URL.createObjectURL(blob);
        //  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        //  e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        //  a.dispatchEvent(e);
    });

    return filterButton
}

function logReset() {
    activityLog.initialize()
    warningsByRule.initialize()
    warningsByWard.initialize()
    selectionDataStore.initialize()
    console.log("log resetstarted")
}

function logDump() {
    const blob = activityLog.logDump()
    const e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
    a.download = "sapval.json";
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
    //activityLog.logDump()
    console.log("log dump started")
}
</script>

<template>
    <div>
        <br>
        <h1>Admin Page</h1>
        <h2>Please Don't Use Except at Beginning and End of Test!</h2>
    </div>
    <div>

        <button @click="logReset">Start/Clear</button>
    </div>
    <div>

        <button @click="logDump">Done/Submit</button>


    </div>
</template>

<style>
#miniMenuBounding {
    width: 250px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 10px;
    right: 10px;
}

.miniMenuButton {
    height: 50px;
    width: auto;
    padding: 6px;
    text-align: center;
    background-color: var(--buttonColor);
    border-radius: var(--buttonBorderRadius);
}

.miniMenuButton:hover {
    background-color: var(--buttonColorHover);
    cursor: pointer;
}
</style>
