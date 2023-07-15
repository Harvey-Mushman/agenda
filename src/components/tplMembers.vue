<template>
  
    <div>
        <h3>Committee:</h3>
        <!-- <select v-model="committeeIndex">
            <option value="">select committee</option>
            <option v-for="{committee,index} in oCommittees" :key="index">{{committee.name}}</option>
        </select> -->
    </div>
    <h3>Committee Membership:</h3>
    <!-- <ol>
        <li v-for="{memberIndex, index} in oCommittees[committeeIndex].members" :key="index">{{oMembers[memberIndex].firstName}}</li>
    </ol> -->

</template>

<script>
import {inject, computed, ref} from 'vue'
export default {
    name:'template5',

    props: {
        modelValue: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['update:modelValue'],
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
        let oCommittees=this.store.state.oData.ncCommittees
        
        return {
            oMembers, oCommittees
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
    },
}
</script>

<style>

</style>