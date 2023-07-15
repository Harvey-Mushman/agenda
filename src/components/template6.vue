<template>
  <!-- title / description motion template -->
  <div class="item">
    <div class="itemRow">
      <div class="itemTitle">
        <input class="itemNo" v-if="!isPrint" v-model="modelValue.itemIndex" />
        <div class="itemNo" v-if="isPrint">{{ modelValue.itemIndex }}</div>
        <input id="itemTitleText" v-if="!isPrint" class="itemTitleText" type="text" v-model="modelValue.title" placeholder="title of item" />
        <div class="itemTitleText" v-if="isPrint">{{ modelValue.title }}</div>
      </div>
      <div v-if="showDelBtn" class="itemTimeDiv" ref="itemTimeDiv">
          (<input class="itemTime" v-model.trim="modelValue.duration" v-on:blur="_this.store.methods.initMeetingEndTime(_this)" placeholder="minutes" />minutes)
          <button class="btnDelItem" @click="deleteMe(modelValue.guid)">
              <img src="../assets/delete-bin-2-line.svg" alt="X" title="Delete this Item" />
          </button>
      </div>
      <div>
        <div v-if="isPrint && modelValue.timeEnd!=''" class="timeEnded">{{$moment(modelValue.timeEnd).format('hh:mm')}}</div>
      </div>
              <!-- "typeof modelValue.timeEnd=='object'" -->
      <div v-if="showTimerBtn" class="timeClockContainer">
        <div v-if="modelValue.timeEnd.length>0" class="timeEnded">
          {{ $moment(modelValue.timeEnd).format("hh:mm") }}
        </div>
        <button :class="timeClock" class="btnTimeClock" ref="timeClock" @click="store.methods.updateTimeClock( _this, $refs, modelValue )" type="button">
          <img :class="timeClock" ref="timeClockImg" :src="getTimeClockImage" />
        </button>
      </div>
    </div>
    <div class="content">
        <div class="itemRowDeatils">
            <div class="itemChildLabel editorAdjustment">Description:</div>
            <div class="editorContainer">
                <editor-template  v-model="editorContent1"></editor-template>
            </div>
        </div>

    <!-- file modal import here -->
    <modalFileDialog v-model="modelValue.itemData.supportDocs" :chkEmpty="!isPrint"></modalFileDialog>

        <!-- <div class="itemRowDeatils" v-show="(chkFilterEmptyFields && !oItem.itemData.supportDocs.length>0) || oItem.itemData.supportDocs.length>0">
            <div class="itemChildLabel">
                Supporting<br />Documents:<br />
                    <div class="riControls">
                        <svg @click="getDoc" class="remix riFile">
                            <use :xlink:href="`${remixiconUrl}#ri-file-add-line`"></use>
                        </svg>

                        <svg @click="delDoc" class="remix riFile">
                            <use :xlink:href="`${remixiconUrl}#ri-file-reduce-line`"></use>
                        </svg>
                    </div> -->
            <!-- (<div ref="addAppUrl" @click="getDoc('appUrl')" style="display:inline;cursor:pointer;padding: 0 5px 0 5px;">+</div>): -->
            <!-- </div>
                <ul>
                    <li class="titleUrl" v-for="(urlFile,index) in oItem.itemData.supportDocs" :key="index">
                        {{urlFile.title}}: {{urlFile.link}}
                    </li>
                </ul>
        </div> -->

        <!-- motion starts here -->

        <div class="itemRowDeatils">
            <div class="itemChildLabel editorAdjustment motionDiv">MOTION:</div>
            <div class="editorContainer">
                <editor-template v-model="editorContent2"></editor-template>
            </div>
        </div>
    </div>
    <div class="voterContainer">
      <div class="voterInnerContainer">
        <select v-if="!isPrint" v-model="modelValue.itemData.motion[0].maker">
          <option value="" disabled>Maker</option>
          <!-- modelValue.itemData.motion[0].members -->
          <option :value="member.id" v-for="(member, index) in eligibleMembers" :key="index">
            {{ member.firstName }} {{ member.lastName }}
          </option>
        </select>
        <div class="maker" v-if="isPrint"><b>Maker: </b>
          {{ getMotionMaker( modelValue.itemData.motion[0].maker ) }}
        </div>
        <select v-if="!isPrint" v-model="modelValue.itemData.motion[0].second">
          <option value="" disabled>Second</option>
          <option :value="member.id" v-for="(member, index) in eligibleMembers" :key="index">
            {{ member.firstName }} {{ member.lastName }}
          </option>
        </select>
        <div class="maker" v-if="isPrint"><b>Second: </b>
          {{ getMotionMaker( modelValue.itemData.motion[0].second ) }}
        </div><div v-show="!isPrint">
          <button class="btn btnLoad btnCallVote" @click="callVote">Call for Vote</button>
          <button class="btn btnRefreshVoters" v-show="modelValue.itemData.callForVote !==''" @click="refreshVoters">Refresh Voters</button>
        </div>
      </div>
      <div :class="divAttendence" v-show="callForVote">
        <ol class="attendence">
          <li v-for="(member, index) in modelValue.itemData.motion[0].members" :key="index">
            <!-- bind checked to oItem.itemData.members -->
            <select v-if="!isPrint" class="castVote" v-model="member.voted" @change="castVote()" :disabled="!member.eligible">
              <option v-if="member.eligible" disabled value=""></option>
              <option v-else selected value=""></option>
              <option value="y">Y &nbsp; Yea</option>
              <option value="n">N &nbsp; Nay</option>
              <option value="a">A &nbsp; Abstain</option>
              <option value="r">R &nbsp; Recuse</option>
              <option value="i">I &nbsp; Ineligible</option>
            </select>
            <div class="castVoteIsPrint" v-if="isPrint && member.voted"><b>{{member.voted.toUpperCase()}}</b></div>
            <div class="castVoteIsPrint" v-if="isPrint && !member.voted"></div>
            <label class="member">{{ modelValue.itemData.motion[0].members[index].firstName }} {{ modelValue.itemData.motion[0].members[index].lastName }}</label>
          </li>
        </ol>
      </div>

      <div class="tallyVote">
        <div>
          <b>Voter Tally
            <span ref="votesCast" class="votesCast">( {{ votesCast }} )</span>:</b>
          Yea:<span class="yea">{{ yea }}</span> / Nay:<span class="nay">{{nay}}</span>
          / Abstain:<span class="abstain">{{ abstain }}</span> / Recuse:<span class="recuse">{{ recuse }}</span>
          / Ineligible:<span class="ineligible">{{ ineligible }}</span>
        </div>
      </div>

    </div>
    <div class="alternateMotion" style="margin-top: 20px">
        <button v-show="!isPrint" class="btn btnLoad btnCallVote" @click="AddAlternate(oItem)">Alternate Motion</button>
        <div v-for="(altMotion, index) in oItem.itemData.motion.slice(1)" :key="index">
            <altMotionTemplate v-model="oItem.itemData.motion.slice(1)[index]"></altMotionTemplate>
        </div>
    </div>
  </div>
</template>

<script>
import { inject, computed, ref } from "vue"
import altMotionTemplate from "@/components/altMotionTemplate"
import editorTemplate from './editorTemplate.vue'
import SaveMinutes from '../composables/SaveMinutes'
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
import modalFileDialog from "@/components/modalFileDialog"

export default {
  name: "template6",
  components: {editorTemplate, altMotionTemplate, modalFileDialog},
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    //const attendanceTally = ref(0)
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
    let callForVote = false;
    let yea = 0;
    let nay = 0;
    let abstain = 0;
    let recuse = 0;
    let ineligible = 0;
    let votesCast = 0;
    let editorContent1 = {"content": this.oItem.itemData.paragraph }
    let editorContent2 = {"content": this.oItem.itemData.motion[0].body }
    const _this = this
    let timeClock = "timeClock"
    let showDelBtn = this.store.state.showDelBtn
    let showTimerBtn = this.store.state.showTimerBtn
    let isPrint = this.store.state.isPrint
    let maker = ref('')
    let divAttendence = 'divAttendence'
    return {
      oAgenda,
      oMembers,
      oTemplates,
      callForVote,
      yea,
      nay,
      abstain,
      recuse,
      ineligible,
      votesCast,
      editorContent1,
      editorContent2,
      _this,
      timeClock,
      showDelBtn,
      showTimerBtn,
      isPrint,
      maker,
      divAttendence,
      remixiconUrl
    }
  },
  computed:{
    eligibleMembers(){
      let members = []
      for(var i=0; i< this.oAgenda.members.length; i++){
        if(this.oAgenda.members[i].eligible){
          members.push(this.oAgenda.members[i])
        }
      }
      return members
    },
    getTimeClockImage(){
      // setup dynamic timeClockImg
      let tcImg = "time-line.svg"
      return require(`../assets/${tcImg}`);
    },

  },
    watch: {
      editorContent1: {
        handler(newValue){
          // console.log(newValue)
            this.oItem.itemData.paragraph = newValue.content
        },
        deep: true,
        immediate: true
      },
      editorContent2: {
        handler(newValue){
          // console.log(newValue)
            this.oItem.itemData.motion[0].body = newValue.content
        },
        deep: true,
        immediate: true
      },

  },
updated(){

  // voter tally must be reset when data is loaded
  // if(this.store.state.voterReset){
  //     this.yea = 0;
  //     this.nay = 0;
  //     this.abstain = 0;
  //     this.recuse = 0
  //     this.ineligible = 0
  //     this.votesCast=0
  // }
},
  mounted() {
    // console.log(this.oData)
    // this.store.methods.TextAreaAdjust(this.$refs.motionText);

    // display votes if already cast
    let voted = false
    for(var i=0; i<this.oItem.itemData.motion[0].members.length; i++){
        if(this.oItem.itemData.motion[0].members[i].voted != null){
            voted = true
            break
        }
    }
    if(voted){
        this.callForVote = true
        this.divAttendence = 'divAttendenceImportant'
        this.castVote()
    }
  },
  methods: {

    getMotionMaker(makerId){
      let maker = this.eligibleMembers.find(x => x.id == makerId)
      if(maker){
        return maker.firstName +' '+ maker.lastName
      }
    },

    refreshVoters(){
      // init the voters from current attendance
      this.refreshAttendance()
      // tally votes cast
      this.castVote();
      // timestamp the call for vote
      this.oItem.itemData.callForVote = new Date()
    },
    refreshAttendance(){
      for (var i = 0; i < this.oItem.itemData.motion[0].members.length; i++) {
        for (var j = 0; j < this.oAgenda.members.length; j++) {
          if ( this.oItem.itemData.motion[0].members[i].id == this.oAgenda.members[j].id ) {
            this.oItem.itemData.motion[0].members[i].eligible = this.oAgenda.members[j].eligible;
          }
        }
      }
    },
    callVote() {
      // timestamp the call
      if(this.oItem.itemData.callForVote !== ""){
          alert('vote already called, recall to alter attendance')
          return
      }
      // voting motion[0]members init occurs in navMenu
      // eligiblity of voters occurs from current attendance
      this.refreshAttendance()
      // tally votes cast
      this.castVote();
      this.callForVote = true;
      this.oItem.itemData.callForVote = new Date()
      console.log("members copied");
    },
    castVote() {
      this.yea = 0;
      this.nay = 0;
      this.abstain = 0;
      this.recuse = 0
      this.ineligible = 0
      for (var i = 0; i < this.oItem.itemData.motion[0].members.length; i++) {
        switch (this.oItem.itemData.motion[0].members[i].voted) {
          case "y":
            this.yea++;
            break;
          case "n":
            this.nay++;
            break;
          case "a":
            this.abstain++;
            break;
          case "r":
            this.recuse++;
            break;
          case "i":
            this.ineligible++;
            break;
        }
      }
      this.votesCast = 0;
      for (var i = 0; i < this.oItem.itemData.motion[0].members.length; i++) {
        if (
          this.oItem.itemData.motion[0].members[i].voted != null &&
          this.oItem.itemData.motion[0].members[i].voted != ""
        ) {
          this.votesCast++;
        }
      }

      let eligibleVoters = 0;
      for (var i = 0; i < this.oItem.itemData.motion[0].members.length; i++) {
        if (this.oItem.itemData.motion[0].members[i].eligible) {
          eligibleVoters++;
        }
      }

      if (this.votesCast == eligibleVoters) {
        this.$refs.votesCast.style.backgroundColor = "green";
        this.$refs.votesCast.style.color = "white";
      }
    },
    AddAlternate(oItem) {
      // yea / nay / abstain / recuse / ineligible
        let idx = oItem.itemData.motion.length
        oItem.itemData.motion.push( { "idx":idx,"body":"","maker":"", "second":"", "members":[], itemGUID:oItem.guid } )
        // now append the members from the parent motion members
        for(var i=0; i<oItem.itemData.motion[0].members.length; i++){
            // deep copy members to new motion
            let oMember = JSON.parse(JSON.stringify(oItem.itemData.motion[0].members[i]))
            oMember.voted = null
            oItem.itemData.motion[oItem.itemData.motion.length-1].members.push(oMember)
        }
      console.log("alternate added");
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
<style lang="scss">
.hideMe {
  display: none;
}

</style>
