<template>
<div class="pageBackContent">
      <h3>Member</h3>

<div class="contactContainer">
    <label>First:</label><input type="text" v-model="modelValue.firstName" />
    <label>Last:</label><input type="text" v-model="modelValue.lastName" />
</div>


<div class="rollContainer">
    <label>Roll: </label>
    <select v-model="modelValue.roll">
        <option v-for="(roll,index) in oRolls" :key="index">{{roll.roll}}</option>
    </select>
</div>


<div class="trainingContainer">
    <div style="center"><h4>Required Trainings</h4></div>
    <div class="trainingInner">
    <label>Ethics: </label><input type="text" v-model="modelValue.ethics" />
    <label>Funding: </label><input type="text" v-model="modelValue.funding" />
    </div>
    <div class="trainingInner">
    <label>Conduct: </label><input type="text" v-model="modelValue.conduct" />
    <label>Bias: </label><input type="text" v-model="modelValue.bias" />
    </div>
</div>
</div>

</template>

<script>
import { computed, ref, provide} from 'vue'
import store from "@/store"

export default {
    name:"tplMember",
    props: {
        modelValue: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['update:modelValue'],
    setup(){
        provide("store", store)
        const oRolls = ref([])
        return {store, oRolls}
    },
    mounted(){
        const unique = [...new Map(this.store.state.defaults.ncMembers.map(item => [item['roll'], item])).values()]

        // const unique = [...new Map(this.store.state.oData.members.map(item => [item['roll'], item])).values()]

        this.oRolls = unique.map(({ conduct,eligible,ethics,finding,firstName,id,lastName, ...roll}) => roll)
        console.log(JSON.parse(JSON.stringify(this.oRolls)))
    },
    methods:{

    } // end methods
}
</script>

<style>
.contactContainer{
    display:flex;
    margin:10px;
}
input{
    background-color:white;
    margin:5px 5px 5px 5px;
}
.rollContainer{
    display:flex;
    margin:10px;
}
.trainingContainer{
    display:flex;
    flex-direction: column;
    margin:10px;
}
.trainingInner{
    display:flex;
    flex-direction: row;
}
.trainingInner label{
    font-weight:bold;
    width:100px;
    margin:5px 0 5px 15px;
    text-align: end;
}
.trainingContainer label{
    font-weight:bold;
    width:100px;
    margin:5px 0 5px 15px;
    text-align: end;
}
.rollContainer label{
    font-weight:bold;
    width:100px;
    margin:5px 0 5px 15px;
    text-align: end;
}
.contactContaine label{
    font-weight:bold;
    width:100px;
    margin:5px 0 5px 15px;
    text-align: end;
}


</style>