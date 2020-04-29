<template>
  <div id="app">
    
    <HelloWorld msg="HARBOUR TODAY"/>
    <AllShips msg6="Vessels called to Port" />
    <mapVUE msg8="MapVUE" />
   
    
    
  </div>
</template>

<script>

import HelloWorld from './components/HelloWorld.vue'
import AllShips from './components/AllShips.vue'
import MapVUE from './components/MapVUE.vue'


export default {
  name: 'App',
  components: {
    HelloWorld,
    AllShips,
    MapVUE,
    
    
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
