

<template>
  <!-- Call To Order -->
  <!-- <div class="hideMe">{{modelValue}}</div> -->
  <!-- <div class="hideMe">{{oData.ncMembers[0]}}</div> -->
  <div class="item">
    <div class="itemRow">
      <div class="itemTitle">
        <input v-if="!isPrint" type="text" class="itemNo" v-model="modelValue.itemIndex" />
        <div v-if="isPrint" class="itemNo">{{modelValue.itemIndex}}</div>
        <span class="itemTitle">Call To Order</span>
      </div>
      <div v-if="showDelBtn" class="itemTimeDiv" ref="itemTimeDiv">
          <button class="btnDelItem" @click="deleteMe(modelValue.guid)">
              <img src="../assets/delete-bin-2-line.svg" alt="X" title="Delete this Item" />
          </button>
      </div>
      <div>
        <div v-if="isPrint && modelValue.timeEnd!=''" class="timeEnded">{{$moment(modelValue.timeEnd).format('hh:mm')}}</div>
      </div>      
      <div v-if="showTimerBtn" class="timeClockContainer">
          <div v-if="modelValue.timeEnd.length>0" class="timeEnded">{{$moment(modelValue.timeEnd).format('hh:mm')}}</div>
          <button :class="timeClock" class="btnTimeClock" ref="timeClock" @click="store.methods.updateTimeClock( _this, $refs, modelValue )" type="button">
              <img :class="timeClock" ref="timeClockImg" :src="getTimeClockImage" />
          </button>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, computed } from "vue";
export default {
  name: "template2",
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
  data() {
    let oAgenda = this.store.state.oData.agenda;
    let oMembers = this.store.state.oData.members;
    let oTemplates = this.store.state.oData.templates;
    let _this = this
    let timeClock = 'timeClock'
    let showDelBtn = this.store.state.showDelBtn
    let showTimerBtn = this.store.state.showTimerBtn
    let isPrint = this.store.state.isPrint
    return {
      oAgenda,
      oMembers,
      oTemplates,
      _this,
      timeClock,
      showDelBtn,
      showTimerBtn,
      isPrint
    };
  },
  mounted() {
    // console.log(this.oData)
  },
  computed:{
      getTimeClockImage(){
        // setup dynamic timeClockImg
        let tcImg = "time-line.svg"
        return require(`../assets/${tcImg}`);
      }
  },
  methods: {
    testMe: function () {
      console.log(this.oData);
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
</style>
