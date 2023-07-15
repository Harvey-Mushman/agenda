<template>
<div class="pageBack">
            <div class="navBar">
            <router-link to="/"><button type="button" class="btn btnHome">Home</button></router-link>
        </div>
    <div class="pageBackContent">

        <h1>Membership</h1>


        <p class="intro">
            The routines on this page will effect the system global default values.  But the system
            only has access to the "download" folder and before changes made here will be active, the
            download file when save is pressed must be copied into the system /store folder and imported
            into the system.  The import option is available on the Home page immediately after starting
            the system.  Before
            overwriting the existing default.json file, it is recomended to rename the defaults.old.
        </p>

        <div v-if="!actionSelected">
            <div class="modCouncil">
                <h3>Council Description</h3>
                <!-- <div><b>NC Logo:</b><img v-src="oDescript.ncName" alt="ncLogo"></div> -->
                <div><b>Name:</b>{{ oDescript.ncName}}</div>
                <div><b>Website:</b>{{ oDescript.ncWebsite}}</div>
                <div><b>Email:</b>{{ oDescript.ncEmailAddr}}</div>
                <div><b>Contact:</b>{{ oDescript.ncContact}}</div>
                <div><b>Postal:</b>{{ oDescript.ncPostalAddr}}</div>
                <br>
                <button class="btn btnAdd btnLg120" style="width:200px !important;" type="button" @click="modCouncil">Modify Description</button>
                <br /><hr class="intro" /><br>
            </div>
            <div class="navBar1">
                <button class="btn btnAdd btnLg120" type="button" @click="addMember">Add Member</button>
                <button class="btn btnAdd btnLg120" type="button" @click="addCommittee">Add Committee</button>
            </div>
            <div class="modMember">
                <h3>Modify Member</h3>
                <select v-model="selectedMember">
                    <option :value="member.id" v-for="(member, index) in oMembers" :key="index">{{member.firstName}} {{member.lastName}}</option>
                </select>
                <button class="btn btnEdit btnLg120" type="button" @click="modMember">Edit Member</button>
            </div>
            <div class="modCommittee">
                <h3>Modify Committee</h3>
                <select v-model="selectedCommittee">
                    <option :value="committee.id" v-for="(committee, index) in oCommittees" :key="index">{{committee.name}}</option>
                </select>
                <button class="btn btnEdit btnLg120" type="button" @click="modCommittee">Edit Committee</button>
            </div>
        </div>
    </div>

    <div class="councilContainer" v-if="councilSelected">
        <tplCouncil v-model="oDescript"></tplCouncil>
        <div class="controls">
            <button class="btn btnCancel" type="button" @click="cancel">Cancel</button>
            <!-- <button class="btn btnDelete" type="button" @click="deleteMember">Delete</button> -->
            <button class="btn btnSave" type="button" @click="saveCouncil">Save</button>
        </div>
    </div>

    <div class="memberContainer" v-if="memberSelected">
        <tplMember v-model="oSelectedMember"></tplMember>
        <div class="controls">
            <button class="btn btnCancel" type="button" @click="cancel">Cancel</button>
            <button class="btn btnDelete" type="button" @click="deleteMember">Delete</button>
            <button class="btn btnSave" type="button" @click="saveMember">Save</button>
        </div>
    </div>

    <div class="committeeContainer" v-if="committeeSelected">
        <tplCommittee v-model="oSelectedCommittee"></tplCommittee>
        <div class="controls">
            <button class="btn btnCancel" type="button" @click="cancel">Cancel</button>
            <button class="btn btnDelete" type="button" @click="deleteCommittee">Delete</button>
            <button class="btn btnSave" type="button" @click="saveCommittee">Save</button>
        </div>
    </div>
</div>
</template>

<script>
import {provide, computed, ref, reactive} from 'vue'
import store from "@/store"
import tplMember from '../components/tplMember'
import tplCommittee from '../components/tplCommittee'
import tplCouncil from '../components/tplCouncil'
import SaveDefaults from '../composables/SaveDefaults'

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import router from '@/router'

export default {
    name: "membership",
    components:{
        tplCouncil,
        tplMember,
        tplCommittee
    },
    setup() {
        provide("store", store);
        //console.log(store)
        let displayMessage = ref(null)

        const {saveDefaults}=SaveDefaults()

        return { store, displayMessage, saveDefaults}
    },
    data() {
        let oDescript = this.store.state.defaults.ncDescription
        let oMembers = reactive(this.store.state.defaults.ncMembers.sort((a, b) => a.firstName.localeCompare(b.firstName) ) )
        let oCommittees = reactive(this.store.state.defaults.ncCommittees.sort((a, b) => a.name.localeCompare(b.name) ) )
        // working with defaults now 7/2023
        // let oMembers = this.store.state.oData.members.sort((a, b) => a.firstName.localeCompare(b.firstName) )
        // let oCommittees = this.store.state.oData.committees.sort((a, b) => a.name.localeCompare(b.name) )
        //let oTemplates = this.store.state.oData.templates;
        let selectedMember = 0
        let selectedCommittee= 0
        let councilSelected=false
        let memberSelected=false
        let committeeSelected=false
        let actionSelected=false
        let oSelectedMember=ref({})
        let oSelectedCommittee=ref({})
        return {
            oDescript,
            oMembers,
            oCommittees,
            selectedMember,
            selectedCommittee,
            fileinput: "",
            councilSelected,
            memberSelected,
            committeeSelected,
            actionSelected,
            oSelectedMember,
            oSelectedCommittee
        };
    },
    beforeCreate(){
        // load the default data members
        this.store.state.LoadDefaults(this.store.state.defaults)
        console.log('defaults loaded')


        // if( this.store.state.LoadDefaults() ){
        //     console.log('defaults loaded')
        // } else {
        //     toast.error('Error: Defaults Not Imported',{autoClose:false})
        //        router.push({path:'/'})
        //        return false
        // }

    },
    methods:{
        addMember(){
            // let oNewMember =
            this.actionSelected=true
            this.memberSelected=true
            this.oSelectedMember = this.initObjectClone(this.oMembers[0])
            console.log('add member')
        },
        addCommittee(){
            this.actionSelected=true
            this.committeeSelected=true
            console.log('add committee')

            this.oSelectedCommittee = this.initObjectClone(this.oCommittees[0])

        },

        modCouncil(){
            this.actionSelected=true
            this.councilSelected=true
            console.log('modify council')
        },


        modMember(){
            if(this.selectedMember==0){alert('must select member to modify'); return }
            let found = this.oMembers.find(member => member.id === this.selectedMember)
            this.oSelectedMember = JSON.parse(JSON.stringify(found))
            console.log(this.oSelectedMember)

            this.actionSelected=true
            this.memberSelected=true
            console.log('modify member')
        },
        modCommittee(){
            if(this.selectedCommittee==0){alert('must select committee to modify'); return }
            let found = this.oCommittees.find(element => element.id === this.selectedCommittee)
            this.oSelectedCommittee = JSON.parse(JSON.stringify(found))
            console.log(this.oSelectedCommittee)
            this.actionSelected=true
            this.committeeSelected=true
            console.log('modify committee')
        },
        deleteMember(){
            // locate member from id
            for(var i=0; i< this.oCommittees.length; i++){
                for(var j=0; j<this.oCommittees[i].members.length; j++){
                    if(this.oCommittees[i].members[j]==this.oSelectedMember.id){
                        // remove member from all committees
                        this.oCommittees[i].members.splice(j,1)
                        break
                    }
                }
            }
            console.log(this.oCommittees)
            // remove from members
            for(var i=0; i<this.oMembers.length; i++){
                if(this.oMembers[i].id == this.oSelectedMember.id){
                    this.oMembers.splice(i,1)
                }
            }
            console.log(this.oMembers)
            console.log('save to defaults')
            // save defaults
            // save defaults.json
            this.saveDefaults()
            console.log(this.store.state.oData)
            this.memberSelected=false
            this.actionSelected=false
        },
        deleteCommittee(){
            for(var i=0; i<this.oCommittees.length; i++){
                if(this.oCommittees[i].id==this.oSelectedCommittee.id){
                    this.oCommittees.splice(i,1)
                }
            }
            this.saveDefaults()
            this.committeeSelected=false
            this.actionSelected=false
            console.log(this.store.state.oData)
        },
        cancel(){
            this.councilSelected=false
            this.memberSelected=false
            this.committeeSelected=false
            this.actionSelected=false

        },
        saveCouncil(){
            console.log(this)
            this.saveDefaults()
        },
        saveMember(){
            console.log(this.oSelectedMember)
            this.memberSelected=false
            this.actionSelected=false
            // validate not empty first or last name
            if(this.oSelectedMember.firstName.length==0 && this.oSelectedMember.lastName.length==0 ){
                this.oSelectedMember.firstName='myDefault'
                this.oSelectedMember.lastName='Temp Name'
            }
            // modify existing member or add new
            if(this.oSelectedMember.id==0){
                // assume this is a new member
                let lastId = 0
                for(var i=0; i<this.oMembers.length; i++){
                    if(this.oMembers[i].id > lastId){
                        lastId = this.oMembers[i].id
                    }
                }
                this.oSelectedMember.id = ++lastId
                this.oMembers.push(this.oSelectedMember)
            } else {
                // must locate the member to update
                for(var i=0; i<this.oMembers.length; i++){
                    if(this.oMembers[i].id == this.oSelectedMember.id){
                        this.oMembers[i] = this.oSelectedMember
                    }
                }
            }

            // update the global array of members
            // save defaults.jon
            this.saveDefaults()
            //console.log(this.store.state.defaults)

        },
        saveCommittee(){
            console.log(this.oSelectedCommittee)
            this.committeeSelected=false
            this.actionSelected=false

            // validate not empty field
            if(this.oSelectedCommittee.name.length==0){
                this.oSelectedCommittee.name='Name Blank Error'
            }
            if(this.oSelectedCommittee.shortName.length==0){
                this.oSelectedCommittee.shortName='NameErr'
            }
            if(this.oSelectedCommittee.id==0){
                // assume this is a new member
                let lastId = 0
                for(var i=0; i<this.oCommittees.length; i++){
                    if(this.oCommittees[i].id > lastId){
                        lastId = this.oCommittees[i].id
                    }
                }
                this.oSelectedCommittee.id = ++lastId
                // append the global array of committees
                this.oCommittees.push(this.oSelectedCommittee)
            } else {
                for(var i=0; i<this.oCommittees.length; i++){
                    if(this.oCommittees[i].id==this.oSelectedCommittee.id){
                        // update existing committee
                        this.oCommittees[i]=this.oSelectedCommittee
                        break
                    }
                }
            }
            // save defaults.json
            this.saveDefaults()
            console.log(this.store.state.defaults)
            // defaults must be pushed back into oData
            console.log(this.store.state.oData)


        },

        initObjectClone(obj){
            let newObj = JSON.parse(JSON.stringify(obj))
            let objProps = Object.getOwnPropertyNames(obj)
            let cmd = ''
            for(var i=0; i<objProps.length; i++){
                // what is the property typeof
                let cmdValue = eval('typeof obj.' + objProps[i])
                // create a property of save varType
                switch(cmdValue){
                    case 'undefined':
                        cmd = "newObj." + objProps[i] + " = undefined"
                        eval(cmd)
                        break
                    case 'boolean':
                        cmd = "newObj." + objProps[i] + " = false"
                        eval(cmd)
                        break
                    case 'number':
                        cmd = "newObj." + objProps[i] + " = 0"
                        eval(cmd)
                        break
                    case 'bigint':
                        break
                    case 'string':
                        cmd = "newObj." + objProps[i] + " = ''"
                        eval(cmd)
                        break
                    case 'symbol':
                        break
                    case 'function':
                        break
                    case 'object':
                        if(Array.isArray( eval('obj.' + objProps[i]) )){
                            cmd = "newObj." + objProps[i] + " = []"
                        } else {
                            cmd = "newObj." + objProps[i] + " = {}"
                        }
                        eval(cmd)
                        break
                }
            }
            console.log(newObj)
            return newObj
        },

    }, // end methods
}
</script>

<style lang="scss">
.pageBack{
    background-color:rgb(166, 189, 166);
    height:100vh;
    width:100vw;

}
.pageBack, .navBar{
    padding:5px 0 5px 0;
    // align-items: flex-end;
}
.pageBackContent, .councilContainer{
    padding-left:15px;
}
.pageBack, .btnHome{
    margin-right:25px;
}
.intro{
    width:450px;
    margin:15px 0 15px 10px;
}
input select{
    background-color:white;
}
.controls{
    display: flex;
    width: 300px;
    margin: 15px auto 0 25px;
    justify-content: center;
    width: 700px;
    }
.controls button{
    width:100px
}
.modMember{
    margin:10px 0 5px 0;
}
</style>