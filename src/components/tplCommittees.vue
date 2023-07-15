<template>
<div class="setupMeetingContainer">
	<div class="setupOption">
		<h3>Meeting Classification:</h3>
		<input class="rdoBtn" type="radio" name="meetingType" id="meet_1" v-model="meetingType" :value="oMeetingTypes[0].id"><label class="btnLbl" for="meet_1">{{oMeetingTypes[0].name}} </label>
		<input class="rdoBtn" type="radio" name="meetingType" id="meet_2" v-model="meetingType" :value="oMeetingTypes[1].id"><label class="btnLbl" for="meet_2"> {{oMeetingTypes[1].name}}  </label>
		<input class="rdoBtn" type="radio" name="meetingType" id="meet_3" v-model="meetingType" :value="oMeetingTypes[2].id"><label class="btnLbl" for="meet_3"> {{oMeetingTypes[2].name}} </label>
	</div>
    <div class="setupOption">
        <h3>Committee:</h3>
        <select v-model="committeeIndex" @change="lookupMembers">
            <!-- <option value="">select committee</option> -->
            <option v-for="(committee) in oCommittees" :value="committee.id" :key="committee.id">{{committee.name}}</option>
        </select>
    </div>

    <div class="setupOption comMembers" v-if="committeeIndex">
        <h3>Committee Membership:</h3>
        <ol class="columns3" :style="'height:' + ((this.oSelectedMembers.length/3) +1) +'em;'">
            <li v-for="(member,index) in this.oSelectedMembers" :key="index">{{member.firstName}} {{member.lastName}}</li>
        </ol>
    </div>

<div class="setupOption">
    <h3>Joint With:</h3>
    <select multiple=true v-model="jointWith">
        <option disabled value="">select one or more</option>
        <option v-for="committee in oCommittees" :value="committee.name" :key="committee.id">{{committee.name}}</option>
    </select>
</div>

    <div class="setupOption">
        <h3>Date &amp; Time:</h3>
        <input type="datetime-local" v-model="dateTime">
    </div>

    <div class="setupOption"> 
        <editor-template v-model="editorContent"></editor-template>
    </div>

<div v-if="committeeIndex">
    <button class="btn btnSave" @click="SaveAgenda">Save</button>
</div>
</div>
</template>

<script>
import {inject, computed, ref, reactive} from 'vue'
import editorTemplate from '@/components/editorTemplate.vue'

export default {
    name:"tplCommittees",
    components:{editorTemplate},
    props: {
        modelValue: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['update:modelValue','onSaveAgenda'],
    setup(props, { emit }) {

        // const oItem = computed({
        //     get: () => props.modelValue,
        //     set: (value) => emit('update:modelValue', value),
        // })
        const store = inject("store")
        return { store } //, oItem }
    },
    data(){
        //let oAgenda=this.store.state.oData.agenda
        let oMembers=this.store.state.oData.members
        //let oTemplates=this.store.state.oData.templates
        let oMeetingTypes = this.store.state.oData.meetingTypes
        let oCommittees=this.store.state.oData.committees
        let committeeIndex=''
        let oSelectedMembers = reactive([])
        let dateTime = this.$moment().format('YYYY-MM-DDTHH:mm')
        let location =''
        let jointWith=[]
        let meetingType="0"
        let editorContent = {"content": "<b>Location:</b><p> </p>" } 

        return {
            oMembers, oCommittees, oMeetingTypes, committeeIndex, oSelectedMembers, dateTime, location, jointWith, meetingType, editorContent
            //oAgenda, oMembers, oTemplates, editorContent
        }
    },
    // watch: {
    //   editorContent: {
    //     handler(newValue){
    //       // console.log(newValue)
    //         this.oItem.itemData.paragraph = newValue.content
    //     },
    //     deep: true,
    //     immediate: true
    //   },
    // },
    mounted(){
    },
    methods:{
        SaveAgenda(){
            for(var i=0; i<this.oCommittees.length; i++){
                if(this.oCommittees[i].id==this.committeeIndex){
                    var tCommitteeName = this.oCommittees[i].name
                    var tShortName = this.oCommittees[i].shortName
                    break
                }
            }
            for(var i=0; i<this.oMeetingTypes.length; i++){
                if(this.oMeetingTypes[i].id==this.meetingType){
                    var tMeetingType = this.oMeetingTypes[i].name
                    break
                }
            }

            //this.oData.agenda.members.push({ "id": this.oData.committees[tCommittee].members[i], "firstName": fName, "lastName": lName, "eligible": false, "attendance": [initTime]
            var newAgenda = {
                "isAgenda":true,
                "shortName":tShortName,
                "body": tCommitteeName,
                "updated": this.$moment(),
                "scheduled": this.dateTime,
                "callToOrder":"",
                "location": this.editorContent.content,
                "title": tMeetingType,
                "members":this.oSelectedMembers,
                "joint":this.jointWith,
                "inAttendance":0,
                "agendaItems": [],
                "committeeIndex":this.committeeIndex
            }
            this.$emit("onSaveAgenda",newAgenda)

        },
        testMe(){
            console.log(this.store)
        },
        lookupMembers(){
            // committee selected, now find the membership
            this.oSelectedMembers=[]
            for(var i=0; i<this.oCommittees.length; i++){
                if(this.oCommittees[i].id==this.committeeIndex){
                    for(var j=0; j<this.oCommittees[i].members.length; j++){
                        for(var k=0; k<this.oMembers.length; k++){
                           // console.log(this.oMembers[k].id===this.oCommittees[i].members[j])
                            if(this.oMembers[k].id===this.oCommittees[i].members[j]){
                                var tmpMember = {
                                    "attendance":[{"init":this.$moment().format()}],
                                    "id":this.oMembers[k].id,
                                    "firstName": this.oMembers[k].firstName,
                                    "lastName": this.oMembers[k].lastName,
                                    "eligible":false
                                }
                                this.oSelectedMembers.push(tmpMember)
                                break
                            }
                        }
                    }
                }
            }
        },
//         Save(){
//             for(var i=0; i<this.oCommittees.length; i++){
//             if(this.oCommittees[i].id==this.committeeIndex){
//                 var tCommitteeName = this.oCommittees[i].name
//                 break
//                 }
//             }
//             for(var i=0; i<this.oMeetingTypes.length; i++){
//                 if(this.oMeetingTypes[i].id==this.meetingType){
//                     var tMeetingType = this.oMeetingTypes[i].name
//                     break
//                 }
//             }

// //this.oData.agenda.members.push({ "id": this.oData.committees[tCommittee].members[i], "firstName": fName, "lastName": lName, "eligible": false, "attendance": [initTime]

//             var newAgenda = {
//                 "body": tCommitteeName,
//                 "updated": this.$moment(),
//                 "scheduled": this.dateTime,
//                 "callToOrder":"",
//                 "location": this.editorContent.content,
//                 "title": tMeetingType,
//                 "members":this.oSelectedMembers,
//                 "joint":this.jointWith,
//                 "inAttendance":0,
//                 "agendaItems": []
//             }

//             this.store.state.oData.agenda = newAgenda
//             this.store.state.SaveAgenda()
//             console.log('agenda saved')

//             // for(var i=0; i< this.oMembers.length; i++){
//             //     this.oItem.itemData.motion[0].members.push( 
//             //         {
//             //             'id': this.oMembers[i].id, 
//             //         'firstName':this.oMembers[i].firstName,
//             //          'lastName':this.oMembers[i].lastName,
//             //           'eligible':null,'voted':null
//             //         } 
//             //     )
//             //  }


//         },
    }
}
</script>

<style scoped>
.setupMeetingContainer{
    margin-left:15px;
}
.setupOption{
    margin:5px 0 10px 0;
}
.rdoBtn{
    margin-right:5px;
}
.btnLbl{
    margin-right:15px;
}
.comMembers{
    display:flex;
    flex-direction: column;
    width:800px;
}
.btnSave{
    width: 100px;
}
</style>
<style lang="scss">
.ProseMirror {
    width: 600px !important;
}
</style>
