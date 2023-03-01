<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import { reactive } from 'vue'
let state = reactive({ count: 0 })

function increment() {
      state.count++
}
</script>

<template>  
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld v-if="state.count>2" msg="You did it!" />
      <HelloWorld v-else msg="Någonting annat" />
    </div>
  </header>

  <main>
    {{state.count}}
    <TheWelcome @clicked="increment" :count="state.count"/>
  </main>
</template>

<style>
:root{
  --background-color: blue;
  --severity_1: #fff2cc;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
