<template>
  <!-- closing template -->
  <div class="item">
    <div class="itemRow">
      <div class="itemTitle">
        <input class="itemNo" v-if="!isPrint" v-model="modelValue.itemIndex" />
        <div class="itemNo" v-if="isPrint">{{ modelValue.itemIndex }}</div>

        <!-- <span class="itemTitle noGrow">Adjournment</span> -->
        <input id="itemTitleText"  v-if="!isPrint" class="itemTitleText" type="text" maxlength="80" v-on:keydown="keyPressed" v-model="modelValue.title" placeholder="specify if desired, hard end time here" />
        <div class="itemTitleText" v-if="isPrint">{{ modelValue.title }}</div>

        <button v-if="!isPrint" class="btn btnSave btnLg120 btnSaveMinutes" @click="saveMinutes('Final')" title="Save as final draft Minutes">Save Minutes</button>
      </div>
      <div class="endTime">
        <div v-show="!adjourn">Approximate Ending: {{this.$moment(this.store.state.meetingEndTime).format("hh:mm")}}</div>
        <div v-show="adjourn">Concluded At: {{this.$moment(this.oAgenda.adjourned).format("hh:mm A")}}</div>
      </div>
      <div v-if="showDelBtn" class="itemTimeDiv">
        <!-- (<input class="itemTime" v-model.trim="modelValue.duration" placeholder="minutes" />minutes) -->
        <button class="btnDelItem" @click="deleteMe(modelValue.guid)">
          <img src="../assets/delete-bin-2-line.svg" alt="X" title="Delete this Item" />
        </button>
      </div>
    </div>
    <div class="content">
      <doneFooter></doneFooter>
      <!-- <div v-html="require('!raw-loader!@/assets/doneFooter.html').default"></div> -->
      <!-- <p class="content" v-html="modelValue.itemData.paragraph"></p> -->
    </div>
  </div>
</template>

<script>
import { inject, computed } from "vue";
import doneFooter from "./doneFooter"
import SaveMinutes from '../composables/SaveMinutes'

export default {
  name: "template1",
  components:{
    doneFooter,
  },
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const oItem = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });
    const store = inject("store");
    return { store, oItem };
  },
  mounted() {
    // console.log(this.oData)
    this.UpdateEndTime()
  },
  data() {
    let oAgenda = this.store.state.oData.agenda;
    let oMembers = this.store.state.oData.members;
    let oTemplates = this.store.state.oData.templates;
    let showDelBtn = this.store.state.showDelBtn
    let showTimerBtn = this.store.state.showTimerBtn
    let isPrint = this.store.state.isPrint
    let adjourn = false
    if( oAgenda.adjourned != ""){
      adjourn = true
    }
    return {
      oAgenda,
      oMembers,
      oTemplates,
      showDelBtn,
      showTimerBtn,
      adjourn,
      isPrint
    };
  },
  methods: {

    UpdateEndTime(){
      // tally based on last callForVote time plus remaining item minutes
      console.log(this.$moment(this.oAgenda.scheduled))
      console.log(this.$moment(this.oAgenda.adjourned))
      var sumTime = 0
      for(var i=0; i<this.oAgenda.agendaItems.length; i++){
        var parsed = parseInt(this.oAgenda.agendaItems[i].duration)
        if(isNaN(parsed)){ parsed = 0}
        sumTime = sumTime + parsed
      }
      this.store.state.meetingEndTime = this.$moment(this.oAgenda.scheduled).add(sumTime,'m')
    },
    saveMinutes(suffix){
      // this.$moment('2022-01-18 20:38:00').format('YYYY-MM-DDTHH:mm:ss.000')+'Z'
      this.store.state.meetingEndTime = this.$moment()
      this.modelValue.timeEnd = this.store.state.meetingEndTime
      if(suffix=="Final"){
        this.oAgenda.adjourned = this.store.state.meetingEndTime
      }
      this.adjourn = true
      SaveMinutes(this, suffix)
    },
    deleteMe(lcGUID) {
      console.log(lcGUID);
      // search the agenda stack for item to be deleted
      for (var i = 0; i < this.oAgenda.agendaItems.length; i++) {
        if (this.oAgenda.agendaItems[i].guid === lcGUID) {
          // item found by GUID
          console.log(this.store.addItemRefs);
          // search navMenu, addItem dropdown options for item format
          for (var j = 0; j < this.store.addItemRefs.length; j++) {
            console.log(
              this.store.addItemRefs[j].innerHTML +
                "  '" +
                this.store.addItemRefs[j].value +
                "' 'J:'" +
                j
            );
            if (
              this.store.addItemRefs[j].value ==
              this.oAgenda.agendaItems[i].itemFmt
            ) {
              // item format option found, insure item can be readded
              this.store.addItemRefs[j].disabled = false;
              // force "please select one" option to release disabled add button
              this.store.addItemRefs[
                this.store.addItemRefs.length - 1
              ].selected = true;
            }
          }
          // delete this agenda item
          console.log(this.oAgenda.agendaItems[i]);
          var oDeleted = this.oAgenda.agendaItems.splice(i, 1);
          console.log("delete item completed");
        }
      }
    },
  },
};
</script>
<style>
.hideMe {
  display: none;
}
.noGrow{
  flex-grow:0
}
.doneFooter{
  margin: 0 25px 0 25px;
}
.doneFooter p{
  margin: 10px 0 10px 0;
}
</style>
