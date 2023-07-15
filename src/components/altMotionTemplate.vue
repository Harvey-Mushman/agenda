<template>
    <div class="item altMotion" :style="Boolean(modelValue.idx % 2) ? {'background-color':'#d4c6c6'}:{'background-color':'lightgray'}">
        <!-- <span class="itemFmt">-template:{{modelValue.itemFmt}}-</span> -->
        <div class="itemRow">
            <div class="altMotionHeading">
                Alternate Motion #{{ modelValue.idx }}
                <button v-show="!isPrint" class="btnCopyMotion" @click="copyMotion">Copy Original Motion</button>
            </div>
             <div>
                <button class="btnDelItem" @click="deleteMe(modelValue.idx)">
                    X
                </button>
            </div>
        </div>
        <div class="content">
            <editor-template ref="editor" v-model="editorContent"></editor-template>
        </div>
        <div class="voterContainer">
            <select v-if="!isPrint" v-model="modelValue.maker">
                <option value="" disabled>Maker</option>
                <option :value="member.id" v-for="(member, index) in eligibleMembers" :key="index">
                    {{ member.firstName }} {{ member.lastName }}
                </option>
            </select>
            <div class="maker" v-if="isPrint">
                <b>Maker: </b>
                {{ getMotionMaker( modelValue.maker ) }} 
            </div>
            <select v-if="!isPrint" v-model="modelValue.second">
                <option value="" disabled>Second</option>
                <option :value="member.id" v-for="(member, index) in eligibleMembers" :key="index">
                    {{ member.firstName }} {{ member.lastName }}
                </option>
            </select>
            <div class="maker" v-if="isPrint">
                <b>Second: </b>
                {{ getMotionMaker( modelValue.second ) }} 
            </div>
            <button v-show="!isPrint" class="btn btnLoad btnCallVote" @click="callVote">
                Call for the Vote
            </button>
            <div :class="divAttendence" v-if="callForVote">
                <ol class="attendence">
                    <li v-for="(member, index) in modelValue.members" :key="index">
                        <!-- bind checked to oItem.itemData.members -->
                        <select v-if="!isPrint" class="castVote" v-model="member.voted" @change="castVote()" :disabled="!member.eligible">
                            <option disabled value=""></option>
                            <option value="y">Y &nbsp; Yea</option>
                            <option value="n">N &nbsp; Nay</option>
                            <option value="a">A &nbsp; Abstain</option>
                            <option value="r">R &nbsp; Recuse</option>
                            <option value="i">I &nbsp; Ineligible</option>
                        </select>
                        <div class="castVoteIsPrint" v-if="isPrint && member.voted"><b>{{member.voted.toUpperCase()}}</b></div>
                        <div class="castVoteIsPrint" v-if="isPrint && !member.voted"></div>
                        <label class="member">{{ member.firstName }} {{ member.lastName }}</label
                        >
                    </li>
                </ol>
            </div>

            <div class="tallyVote">
                <div>
                    <b>Voter Tally
                        <span ref="votesCast" class="votesCast">( {{ votesCast }} )</span>:</b>
                    Yea:<span class="yea">{{ yea }}</span> / Nay:<span class="nay">{{ nay }}</span>
                    / Abstain:<span class="abstain">{{ abstain }}</span> /
                    Recuse:<span class="recuse">{{ recuse }}</span> /
                    Ineligible:<span class="ineligible">{{ ineligible }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { inject, computed } from "vue";
import editorTemplate from './editorTemplate.vue'

export default {
    name: "altMotionTemplate",
    components: { editorTemplate },
    props: {
        modelValue: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
        const oAltMotion = computed({
            get: () => props.modelValue,
            set: (value) => emit("update:modelValue", value),
        });

        const store = inject("store");

        return { store, oAltMotion };
    },
    data() {
        let callForVote = false;
        let yea = 0;
        let nay = 0;
        let abstain = 0;
        let recuse = 0;
        let ineligible = 0;
        let votesCast = 0;
        let editorContent = {"content": this.oAltMotion.body } 
        let isPrint = this.store.state.isPrint
        let divAttendence = 'divAttendence'
        return {
            callForVote,
            yea,
            nay,
            abstain,
            recuse,
            ineligible,
            votesCast,
            editorContent,
            isPrint,
            divAttendence
        };
    },
    computed:{

        eligibleMembers(){
        let members = []
        for(var i=0; i< this.oAltMotion.members.length; i++){
            if(this.oAltMotion.members[i].eligible){
            members.push(this.oAltMotion.members[i])
            }
        }
        return members
        }

    },
    watch: {
      editorContent: {
        handler(newValue){
          // console.log(newValue)
            this.oAltMotion.body = newValue.content
        },
        deep: true,
        immediate: true
      },
    },
    // updated(){
    //     // voter tally must be reset when data is loaded
    //     if(this.store.state.voterReset){
    //         this.yea = 0;
    //         this.nay = 0;
    //         this.abstain = 0;
    //         this.recuse = 0
    //         this.ineligible = 0
    //         this.votesCast=0
    //     }
    // },
    mounted() {
        // console.log(this.oData)
        //this.store.methods.TextAreaAdjust(this.$refs.motionText);
        //this.callForVote
        for(var i=0;i<this.oAltMotion.members.length; i++){
            if(this.oAltMotion.members[i].voted !==null){
                this.callForVote = true
                break
            }
        }
        if(this.callForVote){
            this.castVote()
            this.divAttendence = 'divAttendenceImportant'
        }

    },
    methods: {

        getMotionMaker(makerId){
            let maker = this.eligibleMembers.find(x => x.id == makerId)
            if(maker){
                return maker.firstName +' '+ maker.lastName
            }
        },
        copyMotion(){
            // console.log(this.oAltMotion)
            let oTempAgenda = this.store.state.oData.agenda.agendaItems
            for(var i=0; i< oTempAgenda.length; i++){
if(oTempAgenda[i].guid==this.oAltMotion.itemGUID){
    // found original item, copy original motion

                                let oEditor = this.$refs.editor
                                this.oAltMotion.body = oTempAgenda[i].itemData.motion[0].body
                                oEditor.editor.commands.setContent(this.oAltMotion.body)
                                break
}

                // if(oTempAgenda[i].itemFmt == 6 || oTempAgenda[i].itemFmt == 7){
                //     if(oTempAgenda[i].itemData.motion.length > 1){
                //         for(var j=1; j<oTempAgenda[i].itemData.motion.length; j++){
                //             if(oTempAgenda[i].itemData.motion[j].itemGUID == oTempAgenda[i].guid){
                //                 // copy the original motion from here
                //                 let oEditor = this.$refs.editor
                //                 this.oAltMotion.body = oTempAgenda[i].itemData.motion[j].body
                //                 oEditor.editor.commands.setContent(this.oAltMotion.body)
                //                 return
                //             }
                //         }
                //     }
                // }
            }
        },
        callVote() {
            // voters attendance tied to primary motion

            this.castVote();
            this.callForVote = true;
            console.log("members copied");
        },
        castVote() {
            this.yea = 0;
            this.nay = 0;
            this.abstain = 0;
            this.recuse = 0;
            this.ineligible = 0;
            for (var i = 0; i < this.oAltMotion.members.length; i++) {
                switch (this.oAltMotion.members[i].voted) {
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
            for (var i = 0; i < this.oAltMotion.members.length; i++) {
                if (
                    this.oAltMotion.members[i].voted != null &&
                    this.oAltMotion.members[i].voted != ""
                ) {
                    this.votesCast++;
                }
            }

            let eligibleVoters = 0;
            for (var i = 0; i < this.oAltMotion.members.length; i++) {
                if (this.oAltMotion.members[i].eligible) {
                    eligibleVoters++;
                }
            }

            if (this.votesCast == eligibleVoters) {
                this.$refs.votesCast.style.backgroundColor = "green";
                this.$refs.votesCast.style.color = "white";
            }
        },
        deleteMe(oMotionIdx){
            console.log(oMotionIdx)
            for(var i=0; i<this.store.state.oData.agenda.agendaItems.length; i++){
                if(this.store.state.oData.agenda.agendaItems[i].guid==this.oAltMotion.itemGUID){
                    for(var j=0;j<this.store.state.oData.agenda.agendaItems[i].itemData.motion.length; j++){
                        if(this.store.state.oData.agenda.agendaItems[i].itemData.motion[j].idx==oMotionIdx){
                            this.store.state.oData.agenda.agendaItems[i].itemData.motion.splice(j,1)
                        }
                    }
                }
            }

        }
    },
};
</script>