<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import SortingMenu from './components/SortingMenu.vue'
import RuleCategories from './components/RuleCategories.vue'
import PatientCircle from './components/PatientCircle.vue'
import MiniMenu from './components/MiniMenu.vue'
import WardView from './components/WardView.vue'
import { reactive } from 'vue'
let state = reactive({ count: 0 })
let layout = reactive({ state: 0 })
let dynamicBot = reactive ({ state: 0 }) //TODO: change the names

console.log(layout.state)
function increment() {
  state.count++
}
function updateLayoutState(e) {
  layout.state = !layout.state;
}

function updateBotState(e) {
  dynamicBot.state = e
}
</script>

<template>
  <!-- OVERVIEW PAGE -->
  <div v-if="layout.state==0" id="overviewGrid">
    <header class="overviewGridItem">
      <WardView/>
      <MiniMenu @clickedHistory="updateLayoutState(layoutState)" :layoutState="layout.state"/>
    </header>

    <main class="overviewGridItem">
      <SortingMenu @clickedMenu="updateBotState" :botState="dynamicBot.state"/>
    </main>

    <div id="dynamicBottom" class="overviewGridItem">
      <TheWelcome v-if="dynamicBot.state==0" @clicked="increment" :count="state.count"/>
      <RuleCategories v-else-if="dynamicBot.state==1"/>
      <div v-else-if="dynamicBot.state==2" class="botDiv" style="background-color: green">
        <h1>3</h1>
      </div>
      <PatientCircle v-else/>
    </div>
  </div>

  <!-- HISTORY PAGE -->
  <div v-else id="historyGrid">
    <h1>Historik</h1>
    <MiniMenu @clickedHistory="updateLayoutState(layoutState)" :layoutState="layout.state" />
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
</style>
