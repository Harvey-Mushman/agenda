<template>
    <!-- roll call -->
    <div class="item">
        <div class="itemRow">
            <div class="itemTitle">
                <input v-if="!isPrint" class="itemNo" v-model="modelValue.itemIndex" />
                <div class="itemNo" v-if="isPrint">{{modelValue.itemIndex}}</div>
                <span class="itemTitle">Roll Call:</span>
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
        <div class="divAttendence">
            <ol class="attendence">
                <li v-for="(member,index) in oAgenda.members" :key="index">
                    <!-- bind checked to oItem.itemData.members -->
                    <input v-if="!isPrint" :ref="'mbr'+index" :id="'mbr_'+index" type="checkbox" v-model="member.eligible"  @change="attend(index)" />
                    <div class="rollCallChkBox" v-if="isPrint && !member.eligible">
                        <svg class="remix riFile">
                            <use :xlink:href="`${remixiconUrl}#ri-checkbox-blank-line`"></use>
                        </svg>
                    </div>
                    <div class="rollCallChkBox" v-if="isPrint && member.eligible">
                        <svg class="remix riFile">
                            <use :xlink:href="`${remixiconUrl}#ri-checkbox-fill`"></use>
                        </svg>
                    </div>
                    <label :for="'mbr_'+index" class="member">{{member.firstName}} {{member.lastName}}</label>
                </li>
            </ol>
        </div>
        <div class="saveRoll isQuorum" :style="[oAgenda.inAttendance >= Math.ceil(oAgenda.members.length/2) ? {'background-color':'green'} : {'background-color':'gray'} ]">
            <span>Attendance: {{oAgenda.inAttendance}} </span>
            <span>Quorum: {{Math.ceil(oAgenda.members.length/2)}}</span>
            <!-- <button class="btnSave" ref="saveBtn" @click="save()">SAVE</button> -->
        </div>
   </div>
</template>

<script>
import {computed, ref, inject} from 'vue'
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'

//import saveAgenda from '../composables/saveAgenda'

export default {
    name:'template3',
    props: {
        modelValue: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        //const attendanceTally = ref(0)
        var dirty = false
        const oItem = computed({
            get: () => props.modelValue,
            set: (value) => emit('update:modelValue', value),
        })
        const store = inject("store");
         return { store, oItem, dirty };
    },
    data(){
        let oAgenda=this.store.state.oData.agenda
        let oMembers=this.store.state.oData.members
        let oTemplates=this.store.state.oData.templates
        let _this = this
        let timeClock = 'timeClock'
        let showDelBtn = this.store.state.showDelBtn
        let showTimerBtn = this.store.state.showTimerBtn
        let isPrint = this.store.state.isPrint
        return {
            oAgenda, oMembers, oTemplates, _this, timeClock, showDelBtn, showTimerBtn, remixiconUrl, isPrint
        }
    },
    mounted(){
        // set the attendance
        this.oAgenda.inAttendance=0
        for(var i=0; i < this.oAgenda.members.length; i++){
            if(this.oAgenda.members[i].eligible){
                this.oAgenda.inAttendance ++
            }
        }
    },
    computed:{
        getTimeClockImage(){
        // setup dynamic timeClockImg
        let tcImg = "time-line.svg"
        return require(`../assets/${tcImg}`);
        }
    },
    methods:{


        testMe: function(){
            console.log(this.store)
        },

        attend(lnIndex){
            var dirty = true
            // durty and next two lines existed when rollcall included save button
            // var oBtn=this.$refs.saveBtn
            // oBtn.style.backgroundColor='orange'

            this.oAgenda.inAttendance=0
            for(var i=0; i < this.oAgenda.members.length; i++){
                if(this.oAgenda.members[i].eligible){
                    this.oAgenda.inAttendance ++
                }
            }
            // let oMbr = eval('this.$refs.mbr' + lnIndex)
            // console.log(this.oAgenda.members[lnIndex].inAttendance)
            // console.log(oMbr.value)

            // capture arrival/depart time
            let now = new Date()
            let setTime = {}
            if(this.oAgenda.members[lnIndex].eligible){
                // timestamp arrival
                setTime = {'in': now}
            }else{
                // timestamp departure
                setTime = {'out':now}
            }
            this.oAgenda.members[lnIndex].attendance.push(setTime)


            // // calculate quorum
            // if(this.oAgenda.inAttendance >= Math.ceil(this.oAgenda.members.length/2)){
            //     this.store.state.isQuorum = 'background-color:green;'
            // } else {
            //     this.store.state.isQuorum = 'background-color:gray;'
            // }


            // mark the attendence for this member
            // let lcMember = 'this.$refs.mbr' + lnIndex
            // let llMember = eval(lcMember)
            // this.oItem.itemData.members[lnIndex].attendence = llMember.checked
            //console.log(this.oItem.itemData.members)

        },

        save(){
                this.dirty=false
                var oBtn=this.$refs.saveBtn
                oBtn.style.backgroundColor='mediumseagreen'
               this.store.state.SaveAgenda() //saveFile(this.oData)
            },
        // tallyMe(){
        //     this.attendanceTally = 0
        //     for(var i=0; i< this.oMembers.length; i++){
        //         if( this.oMembers[i].attendance){
        //             this.attendanceTally ++
        //         }
        //     }
        // },
        deleteMe(lcGUID){
            console.log(lcGUID)
            // search the agenda stack for item to be deleted
            for(var i=0; i<this.oAgenda.agendaItems.length; i++){
                if(this.oAgenda.agendaItems[i].guid===lcGUID){
                    // item found by GUID
                    console.log(this.store.addItemRefs)
                    // search navMenu, addItem dropdown options for item format
                    for(var j=0; j<this.store.addItemRefs.length; j++){
                        console.log(this.store.addItemRefs[j].innerHTML + "  '" + this.store.addItemRefs[j].value +"' 'J:'" + j)
                        if(this.store.addItemRefs[j].value == this.oAgenda.agendaItems[i].itemFmt){
                            // item format option found, insure item can be readded
                            this.store.addItemRefs[j].disabled = false
                            // force "please select one" option to release disabled add button
                            this.store.addItemRefs[ this.store.addItemRefs.length-1 ].selected = true
                        }
                    }
                    // delete this agenda item
                    console.log(this.oAgenda.agendaItems[i])
                    var oDeleted = this.oAgenda.agendaItems.splice(i,1)
                    console.log('delete item completed')
                }
            }
        }

    }
};
</script>
<style>
.hideMe{
    display:none;
}
</style>
