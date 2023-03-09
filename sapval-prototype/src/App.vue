<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import SortingMenu from './components/SortingMenu.vue'
import RuleCategories from './components/RuleCategories.vue'
import PatientCircle from './components/PatientCircle.vue'
import Footer from './components/Footer.vue'
import { reactive } from 'vue'
let state = reactive({ count: 0 })
let overviewLayout = reactive({ state: 0 })
let dynamicBot = reactive ({ state: 0 }) //TODO: change the names

function increment() {
  state.count++
}
function updateOverviewState() {
  overviewLayout.state = !overviewLayout.state;
}

function updateBotState(e) {
  dynamicBot.state = e
}
</script>

<template>
  <div v-if="overviewLayout.state==0" id="mainGrid">
    <header class="gridItem">
      <iframe style="background: #FFFFFF;border: none;border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);" width="640" height="480" src="https://charts.mongodb.com/charts-project-0-qnuvu/embed/charts?id=6406017d-e7f9-4b4e-8ab8-04cbc03ba696&maxDataAge=3600&theme=light&autoRefresh=true"></iframe>
      <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

      <div class="wrapper">
        <HelloWorld v-if="state.count>2" msg="You did it!" />
        <HelloWorld v-else msg="Någonting annat" />
      </div>
    </header>

    <main class="gridItem">
      {{ dynamicBot.state }}
      <SortingMenu @clickedMenu="updateBotState" :botState="dynamicBot.state"/>
    </main>
    <div class="gridItem" id="dynamicBottom">
      <TheWelcome v-if="dynamicBot.state==0" @clicked="increment" :count="state.count"/>
      <!--<div v-if="dynamicBot.state==1" class="botDiv" style="background-color: blue">
        <h1>1</h1>
      </div>-->
      <RuleCategories v-else-if="dynamicBot.state==1"/>
      <!--<div v-else-if="dynamicBot.state==2" class="botDiv" style="background-color: red">
        <h1>2</h1>
      </div>-->
      <div v-else-if="dynamicBot.state==2" class="botDiv" style="background-color: green">
        <h1>3</h1>
      </div>
      <PatientCircle v-else/>
    </div>
    <footer class="gridItem">
      <Footer @clickedHistory="updateOverviewState" :overviewState="overviewLayout.state"/>
    </footer>
  </div>
  <div v-else id="historyLayout">
    <h1>HISTORIK</h1>
    <Footer @clickedHistory="updateOverviewState" :state="overviewLayout.state"/> <!-- TEMPORARY -->
  </div>
</template>

<style>
:root{
  --background-color: blue;
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

#mainGrid {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}

.gridItem {
  width: 100%;
}

header {
  line-height: 1.5;
  background-color: #f3f3f3;
  height: 40vh;
}

.logo {
  display: block;
}

main {
  background-color: #f3f3f3;
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

#historyLayout {
  width: 100%;
  height: 100%;
  background-color: green;
}
</style>
