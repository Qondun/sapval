<script setup>

import { Bar } from 'vue-chartjs'
import TheWelcome from './components/TheWelcome.vue'
import SortingMenu from './components/SortingMenu.vue'
import RuleCategories from './components/RuleCategories.vue'
import WardCategories from './components/WardCategories.vue'
import PatientCircle from './components/PatientCircle.vue'
import MiniMenu from './components/MiniMenu.vue'
import History from './components/History.vue'
import AppAdmin from './components/AppAdmin.vue'
import { reactive, ref } from 'vue';
import WardOverviewChart from './components/WardOverviewChart.vue';
import SelectionPage from './components/SelectionPage.vue'
import WarningValueOverviewChart from './components/WarningValueOverviewChart.vue'
import { Chart } from 'chart.js'
import AllWarningChart from './components/AllWarningChart.vue'

let state = reactive({ count: 0 })

const layout = 0;
const layoutState = ref(layout);

const selectionPage = "Ward";
const selectionPageState = ref(selectionPage);

const selectionValue = "";
const selectionStateVal = ref(selectionValue);

// This is a function to decrease by 1 a 2d array for updating the warningValueOverviewChart Chart. Array[[severityLevel-1][RuleNumber - 1]] 
const warningNumberArray = [];
//const decreaseWarningNumberArray = ref(WarningValueOverviewChart);
const xxxWarning = ref(warningNumberArray);


</script>

<template>
  <!-- OVERVIEW PAGE -->
  <div v-if="layoutState == 0" id="overviewGrid">
    <header class="overviewGridItem">
      <WardOverviewChart />
      <WarningValueOverviewChart ref="mywarnings" />
      <MiniMenu v-model="layoutState" />
    </header>

    <main class="overviewGridItem">


      <SortingMenu v-model:selectionPageState="selectionPageState" />

    </main>

    <div id="dynamicBottom" class="overviewGridItem">
      <WardCategories v-if="selectionPageState=='Ward'" v-model:layoutState="layoutState" v-model:selectionPageState=selectionPageState v-model:selectionStateVal=selectionStateVal />
      <RuleCategories v-if="selectionPageState=='Rule'" v-model:layoutState="layoutState" v-model:selectionPageState=selectionPageState v-model:selectionStateVal=selectionStateVal />
    </div>
  </div>

  <!-- HISTORY PAGE -->
  <div v-else-if="layoutState == 1" id="historyGrid">
    <header class="overviewGridItem">
      <History />
      <MiniMenu v-model="layoutState" />
    </header>
  </div>


  <!-- Admin PAGE -->
  <div v-else-if="layoutState == 99" id="adminGrid">
    <header class="overviewGridItem">
      <AppAdmin />
      <MiniMenu v-model="layoutState" />
    </header>
  </div>


  <!-- SELECTION PAGE -->
  <div v-else id="selectionView">
    <!-- <MiniMenu @clickedHistory="updateLayoutState" :layoutState="layout.state"/> -->
    <!-- <button style="height: 50px" @click="layoutState = 0">Backa</button> -->
    <SelectionPage v-model:layoutState="layoutState" v-model:selectionPageState=selectionPageState
      v-model:selectionStateVal=selectionStateVal />
  </div>
</template>

<style>
:root {
  --background-color: #f3f3f3;
  --sectionBackground: #e1e1e1;
  --severity1: #eca28a;
  --severity2: #cf4c22;
  --severity3: #772c14;
  --severity4: #741b47;
  --severity5: #190263;
  --resolution1: #1B4774;
  --resolution2: #741b47;
  --resolution3: #47741B;
  --buttonBorderRadius: 10px;
  --buttonColor: #aeaeae;
  --buttonColorHover: #d8d5d5;
  --buttonSelected: #cecece;
  --buttonSelectedHover: #e0dddd;
  --generalBorders: 2px solid #000;
  --unavailableButton: #dedede;
}

a {
  color: black;
  text-decoration: none;
}
a:hover {
  color: #444;
}

#overviewGrid {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}

.overviewGridItem {
  width: 100%;
}

header {
  background-color: var(--background-color);
  line-height: 1.5;
  height: 45vh;
  overflow: scroll;
}

.logo {
  display: block;
}

main {
  background-color: var(--background-color);
  height: 10vh;
}

#dynamicBottom {
  display: flex;
  background-color: #cecece;
  height: 45vh;
  overflow: scroll;
  justify-content: center;
  align-items: center;
  position: relative;
  border: var(--generalBorders);
  border-right: 0;
  border-left: 0;
}

.botDiv {
  width: 200px;
  height: 200px;
}

footer {
  height: 5vh;
  background-color: #f3f3f3;
  text-align: center;
  color: #000;
}

footer p {
  vertical-align: middle;
}

#historyGrid {
  width: 100%;
  height: 100vh;
  background-color: var(--background-color);
}



#selectionView {
  width: 100%;
  height: 100vh;
}
</style>
