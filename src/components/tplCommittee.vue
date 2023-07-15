<template>
    <div class="pageBackContent">
        <div class="committeeName">
            <label>Committee Name:</label>
            <input type="text" v-model="modelValue.name" />
        </div>
        <div class="committeeName">
            <label>Short Name (no spaces):</label>
            <input type="text" v-model="modelValue.shortName" />
        </div>
        <div class="committeeMembers">
            <label>Members:</label>
            <select v-model="oSelectedMember">
                <option :value="member.id" v-for="(member,index) in oMembers" :key="index">{{member.firstName}} {{member.lastName}}</option>
            </select>
            <button class="btn btnAdd" type="button" @click="AddMemberToCommittee">Add Member</button>
        </div>
        <div class="committeeList">
            <h3>Committee Members:</h3>
            <p class="deleteNote">Note: to REMOVE a person from the Committee, cick on their name.</p>
            <ol>
            <li v-for="(person,index) in oCommitteeMembers" :key="index" ><a @click="DeleteMember(person.id)">{{person.firstName}} {{person.lastName}}</a></li>
            </ol>
        </div>
    </div>
</template>

<script>
import { computed, ref, provide} from 'vue'
import store from "@/store"

export default {
    name:"tplCommittee",
    props: {
        modelValue: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['update:modelValue'],
    setup(modelValue){
        provide("store", store)
        let oMembers = store.state.defaults.ncMembers

        // let oMembers = store.state.oData.members

        let oSelectedMember = 0

        let oCommitteeMembers = computed(() =>{
            oCommitteeMembers=[]
            for(var i=0; i<oMembers.length; i++){
                for(var j=0; j<modelValue.modelValue.members.length; j++){
                    if(oMembers[i].id==modelValue.modelValue.members[j]){
                        let oTemp = JSON.parse(JSON.stringify(oMembers[i]))
                        oCommitteeMembers.push(oTemp)
                    }
                }
            }
            return oCommitteeMembers
        })
        return {store, oMembers, oSelectedMember, oCommitteeMembers}
    },
    mounted(){
        // this.oMembers=this.store.state.oData.members

        // // create committee members array appending names

        // for(var i=0; i<this.oMembers.length; i++){
        //     for(var j=0; j<this.modelValue.members.length; j++){
        //         if(this.oMembers[i].id==this.modelValue.members[j]){
        //             let oTemp = JSON.parse(JSON.stringify(this.oMembers[i]))
        //             this.oCommitteeMembers.push(oTemp)
        //         }
        //     }
        // }
    },
    methods:{
        AddMemberToCommittee(){
            if(this.oSelectedMember==0){alert('must select existing member to add to committee');return;}
            console.log(this.oSelectedMember)
            let oPerson={}
            for(var i=0; i<this.oMembers.length; i++){
                if(this.oMembers[i].id==this.oSelectedMember){
                    oPerson = JSON.parse(JSON.stringify(this.oMembers[i]))
                    this.modelValue.members.push(oPerson.id)
                }
            }
        },
        DeleteMember(memberId){
            // console.log(memberId)
            for(var i=0; i<this.modelValue.members.length; i++){
                if(this.modelValue.members[i]==memberId){
                    this.modelValue.members.splice(i,1)
                    break
                }
            }
        },

    } // end methods
}
</script>

<style scoped>
label{
    margin:0 5px 0 0;
}
.committeeList{
    margin-top:15px;
}
.committeeList ol{
    display: flex;
    /* width: 600px; */
    max-width:80%;
    flex-direction: column;
    flex-wrap: wrap;
    max-height: 200px;
    background-color:lightseagreen;
    border: solid black 2px;
    border-radius: 5px;
    padding-left:25px;
}
.deleteNote{
    color:maroon;
}
</style>