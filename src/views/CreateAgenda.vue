<template>
<div ref="topOfPage"></div>
  <navMenu></navMenu>
  <div class=createAgendaContainer>
    <div class="pageBackground">
      <div class="pageLogo">
        <div>
          <img class="vncLogo" src="@/assets/vncLogo.png" />
        </div>
        <div class="logoText">
          <span style="font-size: 14pt">Venice Neighborhood Council</span>
          <span>P.O.Box 550, Venice, CA 90294 / www.VeniceNC.org</span>
          <span>Email: Info@VeniceNC.org</span>
        </div>
        <div>
          <img class="cityLogo" src="@/assets/cityLogo.png" />
        </div>
      </div>
      <!-- <button @click="testMe">test me</button> -->
      <!-- <button @click="store.methods.testMe">test index</button> -->
      <div class="committeeHeading">
        <h3>{{ oAgenda.body }}</h3>
      </div>
        <div v-if="oAgenda.joint.length>0" class="committeeHeadingJoint">
          <h4>Joint With</h4>
          <div v-for="(jointWith,index) in oAgenda.joint" :key="index">
            <h3>{{jointWith}}</h3>
          </div>
      </div>
      <div class="committeeHeading">
        <h3>{{ oAgenda.title }} {{ oAgenda.isAgenda ? 'Agenda' : 'Minutes' }}</h3>
      </div>
      <div class="committeeHeading">
        <h3>{{ this.$moment(oAgenda.scheduled).format("dddd MMMM DD, YYYY") }}</h3>
      </div>
      <div class="committeeHeading">
        <h3>Start Time: {{ this.$moment(oAgenda.scheduled).format("hh:mm A") }}</h3>
      </div>
      <div class="committeeLocation" v-html="oAgenda.location"></div>

      <div v-for="(item, index) in oAgenda.agendaItems" :key="item.guid">
        <!-- loop agenda items outputting in array order -->
        <template1 v-if="item.itemFmt === 1" v-model="oAgenda.agendaItems[index]"></template1>
        <template2 v-if="item.itemFmt === 2" v-model="oAgenda.agendaItems[index]"></template2>
        <template3 v-if="item.itemFmt === 3" v-model="oAgenda.agendaItems[index]"></template3>
        <template4 v-if="item.itemFmt === 4" v-model="oAgenda.agendaItems[index]"></template4>
        <template5 v-if="item.itemFmt === 5" v-model="oAgenda.agendaItems[index]"></template5>
        <template6 v-if="item.itemFmt === 6" v-model="oAgenda.agendaItems[index]"></template6>    
        <template7 v-if="item.itemFmt === 7" v-model="oAgenda.agendaItems[index]"></template7>
        <template8 v-if="item.itemFmt === 8" v-model="oAgenda.agendaItems[index]"></template8>
      </div>
      <div calss="GoToTop" style="float:right; position: fixed;bottom:10px; right:12px;" @click="GoToTop">
        <img src="@/assets/arrowUp.png" alt="Arrow Up" class="arrowUp" />
        <!-- <button style="background-color:blue; color:white;" @click="GoToTop">Top</button> -->
      </div>
      <!-- <button @click="testMe">test me</button> -->
    </div>
  </div>
</template>

<script>
import {ref, provide, reactive, inject } from "vue";
import store from "@/store";
import navMenu from "@/components/navMenu";
import template1 from "@/components/template1";
import template2 from "@/components/template2";
import template3 from "@/components/template3";
import template4 from "@/components/template4";
import template5 from "@/components/template5";
import template6 from "@/components/template6";
import template7 from "@/components/template7";
import template8 from "@/components/template8";

export default {
  name: "App",
  components: {
    navMenu,
    template1,
    template2,
    template3,
    template4,
    template5,
    template6,
    template7,
    template8,
  },

  setup() {
    provide("store", store);
    const indexKey=0
    //console.log(store)
    return { store, indexKey }
  },
  data(){
    let oAgenda=this.store.state.oData.agenda
    let oMembers=this.store.state.oData.members
    let oTemplates=this.store.state.oData.templates
    this.store.state.isPrint=false  

    

        return {
            oAgenda, oMembers, oTemplates
        }
    },
  mounted() {
    console.log('mounted app')
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      // this.store.state.voterReset=false
	  })
  },
  methods: {
    GoToTop(){
      this.$refs.topOfPage.scrollIntoView({behavior: 'smooth'})
    },
    testMe() {
      console.log(this.store);
    },
  },

  beforeCreate(){
    console.log('app.vue before created')
    // load the default data members
    this.store.state.LoadDefaults()
    this.store.state.showTimerBtn = false
    this.store.state.showDelBtn = true
    console.log('defaults loaded')
  },
  created(){
    console.log("app.vue created")
  },
  updated(){
    console.log("app.vue updated")
    // disable addItemRefs based on newly loaded agenda
    this.store.methods.restrictAddingItems(this)
  }
};
</script>

<style lang="scss">
.timeClockContainer{
    display:none;
}

.btnDelItem{
    display:inline-block;
    border:none;
    background-color:inherit;
    height:29px;
    width:26px;
    margin-left:3px;
}
.btnDelItem:hover{
    border:solid 1px red;
    border-radius: 25px;
    background-color: pink;
}
.btnDelItem img{
    filter: invert(0%) sepia(1%) saturate(7492%) hue-rotate(315deg) brightness(106%) contrast(97%);
    cursor:pointer;
}
.btnDelItem img:hover{
    filter: invert(22%) sepia(98%) saturate(5980%) hue-rotate(356deg) brightness(100%) contrast(117%);
    cursor:pointer;
}
.createAgendaContainer .btnSaveMinutes{
  display:none;
}
</style>
