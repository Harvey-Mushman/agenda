<template>
  <div class="about">
    <div class="aboutNav"><router-link to="/"><button type="button" class="btn btnNav btnHome">Home</button></router-link></div>
    <div class="aboutLogo"><img alt="VNC logo" src="../assets/vncLogo.png" style="height:100px;"></div>
    <HelloWorld msg="Welcome to Meeting Manager"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'About',
  components: {
    HelloWorld
  }
}
</script>
<style>
.aboutNav{
  display:flex;
  justify-content: flex-end;
  width:100vw;
}
.aboutNav a button{
     margin: 15px 40px;
}
.aboutLogo{
  width:100vw;
  display:flex;
  justify-content: center;
}
</style>