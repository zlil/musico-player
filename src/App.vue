<template>
  <div id="app">
    <i class="material-icons center-align musicLogo">music_note</i>
    <router-view></router-view>
  </div>
</template>

<script>
  import './filters/filter'

  export default {
  name: 'App'
}
</script>

<style>
  #app {
    margin-top: 0px !important;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    background-color: #f9f9f9;
    background-image: linear-gradient(90deg, #faf0cd, #fab397);
    height: 100%;
  }

  .musicLogo{
    font-size: 100px;
    color: #212121;
  }
</style>


