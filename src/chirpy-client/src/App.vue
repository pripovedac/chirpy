<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
    export default {
        name: 'app',
        components: {
        }
    }
</script>

<style>
  html {
    height: 100%;
  }
  body {
    background: rgb(87,9,255);
    background: linear-gradient(to bottom right, rgba(145,8,137,1), rgba(18,0,19,1));
    background-repeat: no-repeat;
    background-attachment: fixed;
  }

</style>
