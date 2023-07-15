<template>
    <!-- motion template LUPC  -->
    <div class="item">
        <!-- <span class="itemFmt">-template:{{modelValue.itemFmt}}-</span> -->
        <div class="itemRow">
            <div class="itemTitle">
                <input v-if="!isPrint" class="itemNo" v-model="modelValue.itemIndex" />
                <div class="itemNo" v-if="isPrint">{{ modelValue.itemIndex }}</div>

                <!-- <span class="itemTitleTextLbl" style="padding-top:2px">LUPC</span> -->
                <input type="checkbox" class="chkShowAll" v-model="chkFilterEmptyFields" />
                <input v-if="!isPrint" id="itemTitleText" class="itemTitleText" type="text" v-model="modelValue.title"  placeholder="title of item" />
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
            <div v-if="showTimerBtn" class="timeClockContainer">
                <div v-if="modelValue.timeEnd.length>0" class="timeEnded">{{$moment(modelValue.timeEnd).format('hh:mm')}}</div>
                <button :class="timeClock" class="btnTimeClock" ref="timeClock" @click="store.methods.updateTimeClock( _this, $refs, modelValue )" type="button">
                    <img :class="timeClock" ref="timeClockImg" :src="getTimeClockImage" />
                </button>
            </div>
        </div>

        <div class="itemRowDeatils" v-show="(chkFilterEmptyFields && !modelValue.itemData.projectAddress) || modelValue.itemData.projectAddress">
            <label class="itemChildLabel">Address:</label>
            <input class="itemChildInput" v-if="!isPrint" type="text" v-model="modelValue.itemData.projectAddress" placeholder="enter project address" />
            <div class="itemChildInput" v-if="isPrint">{{ modelValue.itemData.projectAddress }}</div>
        </div>

         <!-- x {{chkFilterEmptyFields}} x {{ !!modelValue.itemData.applicantName}} x {{!modelValue.itemData.applicantName}} X {{ typeof modelValue.applicantName }} y {{ modelValue.itemData.applicantName instanceof String}} V -->

        <div class="itemRowDeatils" v-show="(chkFilterEmptyFields && !modelValue.itemData.applicantName) || modelValue.itemData.applicantName">
            <div class="itemChildLabel">Applicant:</div>
            <input v-if="!isPrint" class="itemChildInput" type="text" v-model="modelValue.itemData.applicantName" placeholder="enter applicant name" />
            <div class="itemChildInput" v-if="isPrint">{{ modelValue.itemData.applicantName }}</div>
        </div>
        <div class="itemRowDeatils" v-show="(chkFilterEmptyFields && !modelValue.itemData.applicantName) || modelValue.itemData.applicantName">
            <div class="itemChildLabel">Contact:</div>

                <label> Email:</label>
                <input v-if="!isPrint" class="itemChildInput" type="text" v-model="modelValue.itemData.applicantEmail" placeholder="applicant email address" />
                <div class="itemChildInput" v-if="isPrint">{{ modelValue.itemData.applicantEmail }}</div>
                <label> Ph:</label>
                <input v-if="!isPrint" class="itemChildInput" type="text" v-model="modelValue.itemData.applicantPhone" placeholder="applicant phone" />
                <div class="itemChildInput" v-if="isPrint">{{ modelValue.itemData.applicantPhone }}</div>
        </div>
        <div class="itemRowDeatils" v-show="(chkFilterEmptyFields && !modelValue.itemData.appliactionDate) || modelValue.itemData.appliactionDate">
            <div class="itemChildLabel">Applied:</div>

                <input v-if="!isPrint" class="itemChildInput" type="text" v-model="modelValue.itemData.appliactionDate" placeholder="applicantion date" />
                <div class="itemChildInput" v-if="isPrint">{{ modelValue.itemData.appliactionDate }}</div>

        </div>
        <div class="itemRowDeatils" v-show="(chkFilterEmptyFields && !modelValue.itemData.cityPlanner) || modelValue.itemData.cityPlanner">
            <div class="itemChildLabel">City Planner:</div>

                <input v-if="!isPrint" class="itemChildInput" type="text" v-model="modelValue.itemData.cityPlanner" placeholder="city planner name" />
                <div class="itemChildInput" v-if="isPrint">{{ modelValue.itemData.cityPlanner }}</div>
        </div>
        <div class="itemRowDeatils" v-show="(chkFilterEmptyFields && !modelValue.itemData.HearingDate) || modelValue.itemData.HearingDate">
            <div class="itemChildLabel">City Hearing:</div>

                <input v-if="!isPrint" class="itemChildInput" type="text" v-model="modelValue.itemData.HearingDate" placeholder="city hearing date" />
                <div class="itemChildInput" v-if="isPrint">{{ modelValue.itemData.HearingDate }}</div>
        </div>

        <div class="itemRowDeatils" v-show="(chkFilterEmptyFields && !modelValue.itemData.lupcMember) || modelValue.itemData.lupcMember">
            <div class="itemChildLabel">LUPC Member:</div>

                <input v-if="!isPrint" class="itemChildInput" type="text" v-model="modelValue.itemData.lupcMember" placeholder="committee member name" />
                <div class="itemChildInput" v-if="isPrint">{{ modelValue.itemData.lupcMember }}</div>
        </div>

        <div class="itemRowDeatils" v-show="(chkFilterEmptyFields && !modelValue.itemData.lupcHearing) || modelValue.itemData.lupcHearing">
            <div class="itemChildLabel">LUPC Hearing:</div>

                <input v-if="!isPrint" class="itemChildInput" type="text" v-model="modelValue.itemData.lupcHearing" placeholder="date heard" />
                <div class="itemChildInput" v-if="isPrint">{{ modelValue.itemData.lupcHearing }}</div>
        </div>

        <div class="itemRowDeatils" v-show="(chkFilterEmptyFields && !modelValue.itemData.lupcVote) || modelValue.itemData.lupcVote">
            <div class="itemChildLabel">LUPC Vote:</div>

                <input v-if="!isPrint" class="itemChildInput" type="text" v-model="modelValue.itemData.lupcVote" placeholder="yea/nay/abstain" />
                <div class="itemChildInput" v-if="isPrint">{{ modelValue.itemData.lupcVote }}</div>
        </div>
        <div class="itemRowDeatils" v-show="(chkFilterEmptyFields && !modelValue.itemData.caseNumbers) || modelValue.itemData.caseNumbers">
            <div class="itemChildLabel">Case Number(s):</div>

                <input v-if="!isPrint" class="itemChildInput" type="text" v-model="modelValue.itemData.caseNumbers" placeholder="city assigned case number" />
                <div class="itemChildInput" v-if="isPrint">{{ modelValue.itemData.caseNumbers }}</div>
        </div>
        <div class="itemRowDeatils" v-show="(chkFilterEmptyFields && !modelValue.itemData.vncSubarea) || modelValue.itemData.vncSubarea">
            <div class="itemChildLabel">Venice Subarea:</div>
                <select v-if="!isPrint" class="itemChildInput" v-model="modelValue.itemData.vncSubarea">
                    <option disabled value="">select Venice Subarea</option>
                    <option v-for="(oSub,index) in this.oSubareas" :value="oSub.name" :key="index">{{oSub.name}}</option>
                </select>
                <!-- <option disabled value="">set subarea</option> -->
                <div class="itemChildInput" v-if="isPrint">{{ modelValue.itemData.vncSubarea }}</div>
        </div>
        <div class="itemRowDeatils" v-show="(chkFilterEmptyFields && !modelValue.itemData.representative) || modelValue.itemData.representative">
            <div class="itemChildLabel">Representative:</div>
                <input v-if="!isPrint" class="itemChildInput" type="text" v-model="modelValue.itemData.representative" placeholder="applicant representative" />
                <div class="itemChildInput" v-if="isPrint">{{ modelValue.itemData.representative }}</div>
        </div>
        <div class="itemRowDeatils">
            <div class="itemChildLabel editorAdjustment">Description:</div>
            <div class="editorContainer">
                <editor-template  v-model="editorContent1"></editor-template>
            </div>
        </div>
        <div class="itemRowDeatils">
            <div class="itemChildLabel">LUPC Report:</div>
                <input v-if="!isPrint" class="itemChildInput" type="text" v-model="modelValue.itemData.lupcReportURL" placeholder="fully qualified URL" />
                <div class="itemChildInput" v-if="isPrint">{{ modelValue.itemData.lupcReportURL }}</div>
        </div>
        <!-- attachment documents  -->
        <modalFileDialog v-model="modelValue.itemData.supportDocs" :chkEmpty="chkFilterEmptyFields"></modalFileDialog>
        <div class="itemRowDeatils">
            <div class="itemChildLabel editorAdjustment motionDiv">MOTION:</div>
            <div class="editorContainer">
                <editor-template v-model="editorContent2"></editor-template>
            </div>
        </div>

<!-- add the isPrint stuff here down -->

        <div class="voterContainer">
            <div class="voterInnerContainer">
                <select v-if="!isPrint" v-model="modelValue.itemData.motion[0].maker">
                    <option value="" disabled>Maker</option>
                    <!-- <option :value="member.id" v-for="(member, index) in modelValue.itemData.motion[0].members" :key="index"> -->
                    <option :value="member.id" v-for="(member, index) in eligibleMembers" :key="index">
                        {{ member.firstName }} {{ member.lastName }}
                    </option>
                </select>
                <div class="maker" v-if="isPrint"><b>Maker: </b>
                {{ getMotionMaker( modelValue.itemData.motion[0].maker ) }}
                </div>
                <select v-if="!isPrint" v-model="modelValue.itemData.motion[0].second">
                    <option value="" disabled>Second</option>
                    <!-- <option :value="member.id" v-for="(member, index) in modelValue.itemData.motion[0].members" :key="index"> -->
                    <option :value="member.id" v-for="(member, index) in eligibleMembers" :key="index">
                        {{ member.firstName }} {{ member.lastName }}
                    </option>
                </select>
                <div class="maker" v-if="isPrint"><b>Second: </b>
                {{ getMotionMaker( modelValue.itemData.motion[0].second ) }}
                </div>
                <div v-show="!isPrint">
                    <button class="btn btnLoad btnCallVote" @click="callVote">Call the Vote</button>
                    <button class="btn btnRefreshVoters" v-show="modelValue.itemData.callForVote !==''" @click="refreshVoters">Refresh Voters</button>
                </div>
            </div>
            <div :class="divAttendence" v-if="callForVote">
                <ol class="attendence">
                    <li v-for="(member, index) in modelValue.itemData.motion[0].members" :key="index">
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
                        <!-- <label class="member">{{ oAgenda.members[index].firstName }} {{ oAgenda.members[index].lastName }}</label> -->
                        <label class="member">{{ modelValue.itemData.motion[0].members[index].firstName }} {{ modelValue.itemData.motion[0].members[index].lastName }}</label>
                    </li>
                </ol>
            </div>

            <div class="tallyVote">
                <div>
                    <b>Voter Tally <span ref="votesCast" class="votesCast">( {{ votesCast }} )</span>:</b>
                    Yea:<span class="yea">{{ yea }}</span> / Nay:<span class="nay">{{ nay }}</span>
                    / Abstain:<span class="abstain">{{ abstain }}</span> /
                    Recuse:<span class="recuse">{{ recuse }}</span> /
                    Ineligible:<span class="ineligible">{{ ineligible }}</span>
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
import { inject, computed, ref } from "vue";
import altMotionTemplate from "@/components/altMotionTemplate";
import editorTemplate from './editorTemplate.vue'
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
import modalFileDialog from "@/components/modalFileDialog"

export default {
    name: "template7",
    components: { editorTemplate, altMotionTemplate, modalFileDialog},
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
        // modal setup
        const modalActive = ref(false)

        return { store, oItem };
    },
    data() {
        let oAgenda = this.store.state.oData.agenda
        let oMembers = this.store.state.oData.members
        let oTemplates = this.store.state.oData.templates
        let oSubareas = this.store.state.oData.subareas
        let callForVote = false
        let yea = 0
        let nay = 0
        let abstain = 0
        let recuse = 0
        let ineligible = 0
        let votesCast = 0
        let __size = 0
        let chkFilterEmptyFields = false
        let editorContent1 = {"content": this.oItem.itemData.description }
        let editorContent2 = {"content": this.oItem.itemData.motion[0].body }
        let deleteDoc = false
        let timeClock = 'timeClock'
        let _this = this
        let showDelBtn = this.store.state.showDelBtn
        let showTimerBtn = this.store.state.showTimerBtn
        let isPrint=this.store.state.isPrint
        let divAttendence = 'divAttendence'
        return {
            oAgenda,
            oMembers,
            oTemplates,
            oSubareas,
            callForVote,
            yea,
            nay,
            abstain,
            recuse,
            ineligible,
            votesCast,
            __size,
            chkFilterEmptyFields,
            editorContent1,
            editorContent2,
            remixiconUrl,
            deleteDoc,
            timeClock,
            _this,
            showDelBtn,
            showTimerBtn,
            isPrint,
            divAttendence
        };
    },
    watch: {
      editorContent1: {
        handler(newValue){
          // console.log(newValue)
            this.oItem.itemData.description = newValue.content
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
    mounted() {
        // console.log(this.oData)
        //this.store.methods.TextAreaAdjust(this.$refs.motionText);

        // display votes it taken
        if (this.oItem.itemData.callForVote !== "") {
            this.callForVote = true;
            this.castVote();
            this.divAttendence = 'divAttendenceImportant'
        }

    },
    computed:{
        getTimeClockImage(){
            // setup dynamic timeClockImg
            let tcImg = "time-line.svg"
            return require(`../assets/${tcImg}`)
        },
        eligibleMembers(){
            let members = []
            for(var i=0; i< this.oAgenda.members.length; i++){
                if(this.oAgenda.members[i].eligible){
                members.push(this.oAgenda.members[i])
                }
            }
            return members
        },
    },
    methods: {
        close(){
            this.modalActive=false
            this.deleteDoc=false
        },
        getDoc(){
            this.slotHeader = 'Append Application'
            this.slotTitle = ''
            this.slotFileURL = ''
            this.modalActive = true
        },
        setDoc(){
            //console.log()
            this.modalActive = false
            this.deleteDoc=false
            this.oItem.itemData.supportDocs.push({"title":this.slotTitle,"link":this.slotFileURL})
        },
        delDoc(){
            for(var i=0; i<this.oItem.itemData.supportDocs.length; i++){
                if(this.oItem.itemData.supportDocs[i].hasOwnProperty('index')){
                    //console.log(this.oItem.itemData.supportDocs[i].link)
                    delete this.oItem.itemData.supportDocs[i].index
                }
            }
            this.modalActive = true
            this.deleteDoc=true
        },
        delFileEntries(){
            //console.log(this)
            for(var i=0; i<this.oItem.itemData.supportDocs.length; i++){
                if(this.oItem.itemData.supportDocs[i].index){
                    //console.log(this.oItem.itemData.supportDocs[i].link)
                    this.oItem.itemData.supportDocs.splice(i,1)
                }
            }
            this.modalActive = false
            this.deleteDoc=false

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
            for (var i = 0;i < this.oItem.itemData.motion[0].members.length;i++) {
                for (var j = 0; j < this.oAgenda.members.length; j++) {
                    if (this.oItem.itemData.motion[0].members[i].id == this.oAgenda.members[j].id) {
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
            // init the voters from current attendance
            this.refreshAttendance()
            // tally votes cast
            this.castVote();
            // display the vote container
            this.callForVote = true;
            // timestamp the call for vote
            this.oItem.itemData.callForVote = new Date()
            console.log("members copied");
        },
        castVote() {
            this.yea = 0;
            this.nay = 0;
            this.abstain = 0;
            (this.recuse = 0), (this.ineligible = 0);
            for (
                var i = 0;
                i < this.oItem.itemData.motion[0].members.length;
                i++
            ) {
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
            for (
                var i = 0;
                i < this.oItem.itemData.motion[0].members.length;
                i++
            ) {
                if (
                    this.oItem.itemData.motion[0].members[i].voted != null &&
                    this.oItem.itemData.motion[0].members[i].voted != ""
                ) {
                    this.votesCast++;
                }
            }

            let eligibleVoters = 0;
            for (
                var i = 0;
                i < this.oItem.itemData.motion[0].members.length;
                i++
            ) {
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
            oItem.itemData.motionCt ++
            let idx = oItem.itemData.motionCt
            oItem.itemData.motion.push({
                idx: idx,
                body: "",
                maker: "",
                second: "",
                members: [],
                itemGUID: oItem.guid,
            });
            // now append the members from the parent motion members
            for (var i = 0; i < oItem.itemData.motion[0].members.length; i++) {
                // deep copy members to new motion
                let oMember = JSON.parse(
                    JSON.stringify(oItem.itemData.motion[0].members[i])
                );
                oMember.voted = null;
                oItem.itemData.motion[
                    oItem.itemData.motion.length - 1
                ].members.push(oMember);
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
        getMotionMaker(makerId){
            let maker = this.eligibleMembers.find(x => x.id == makerId)
            if(maker){
                return maker.firstName +' '+ maker.lastName
            }
        },
    },
};
</script>
<style lang="scss">
.hideMe {
    display: none;
}
/* modal styles */
.modal-content {
    display: flex;
    flex-direction: column;
}
.modalHeader{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* height:75px; */
    margin-bottom:10px;
}
/* .modal-content h1, p {
     margin-bottom: 16px;
 } */

.modal-content h1 {
    font-size: 32px;
}

.modal-content p {
    font-size: 18px;
}
.slotInput{
    display:flex;
    flex-direction:column;
}
.inpFld{
    display:flex;
    margin:5px 0 5px 0;
}
.modalFld{
    width:100%;
    background-color:white;
}
.modalFldTitle{
    font-weight: bold;
    text-align: right;
    width: 100px;
}
.modalFldImp{
    width:100%
}
.modalFooter{
    display:flex;
    justify-content: flex-end;
    margin:10px 0 0 0;
}
.clockRed{
       accent-color:white;
       fill:blue;
       /* filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%); */
    }
</style>
