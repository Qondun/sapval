<script setup>

import { Bar } from 'vue-chartjs'
import TheWelcome from './components/TheWelcome.vue'
import SortingMenu from './components/SortingMenu.vue'
import RuleCategories from './components/RuleCategories.vue'
import PatientCircle from './components/PatientCircle.vue'
import MiniMenu from './components/MiniMenu.vue'
import { reactive, ref } from 'vue';
import WardOverviewChart from './components/WardOverviewChart.vue';

let state = reactive({ count: 0 })

const layout = 0;
const layoutState = ref(layout);

var dynamicBot = 0;
var dynamicBotState = ref(dynamicBot)







</script>

<template>
  <!-- OVERVIEW PAGE -->
  <div v-if="layoutState==0" id="overviewGrid">
    <header class="overviewGridItem">
      <MiniMenu v-model="layoutState"/>
      <WardOverviewChart/>
    </header>

    <main class="overviewGridItem">
      <SortingMenu :botState="dynamicBot.state" v-model="dynamicBotState"/>
    </main>

    <div id="dynamicBottom" class="overviewGridItem">
      <TheWelcome v-if="dynamicBotState==0" @clicked="increment" :count="state.count"/>
      <RuleCategories v-else-if="dynamicBotState==1" v-model="layoutState"/>
      <div v-else-if="dynamicBotState==2" class="botDiv" style="background-color: green">
        <h1>3</h1>
      </div>
      <PatientCircle v-else/>
    </div>
  </div>

  <!-- HISTORY PAGE -->
  <div v-else-if="layoutState==1" id="historyGrid">
    <h1>Historik</h1>
    <MiniMenu @clickedHistory="updateLayoutState" v-model="layoutState" />
    {{ layout.state }}
  </div>

  <!-- SELECTION PAGE -->
  <div v-else id="selectionGrid">
    <!-- <MiniMenu @clickedHistory="updateLayoutState" :layoutState="layout.state"/> -->
    <button style="height: 50px" @click="layoutState = 0">Backa</button>
    <div class="selectionGridItem">
      
    </div>
    <div class="selectionGridItem">
      
    </div>
    <div class="selectionGridItem">
      
    </div>
  </div>
  
</template>

<style>
:root{
  --background-color: #f3f3f3;
  --severity1: #fff2cc;
  --severity2: #93c47d;
  --severity3: #cf4c22;
  --severity4: #741b47;
  --severity5: #190263;
  --buttonBorderRadius: 10px;
  --buttonColor: #aeaeae;
  --buttonColorHover: #555;
  --generalBorders: 2px solid #000;
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
  border-right: 0
  ;
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

#selectionGrid {
  width: 100%;
  height: 100vh;
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
}
</style>
