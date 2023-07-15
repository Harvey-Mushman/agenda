<template>
    <div class="ncInputBlock">
        <div>
            <label>Council Name:</label>
        </div>
        <div class="ncInputBlock">
            <input type="text" v-model="modelValue.ncName" />
        </div>
    </div>
    <div class="ncInputBlock">
        <div>
            <label>Website:</label>
        </div>
        <div>
            <input type="text" v-model="modelValue.ncWebsite" placeholder="www.yourDomain.com"/>
        </div>
    </div>
    <div class="ncInputBlock">
        <div>
            <label>Email:</label>
        </div>
        <div>
            <input type="text" v-model="modelValue.ncEmailAddr" placeholder="yourNC@domain.com"/>
        </div>


    </div>
    <div class="ncInputBlock">
        <div>
            <label>Contact</label>
        </div>
        <div>
            <input type="text" v-model="modelValue.ncContact" placeholder="Mary Jane"/>
        </div>


    </div>
    <div class="ncInputBlock">
        <div>
            <label>Address:</label>
        </div>
        <div>
            <textarea v-model="modelValue.ncPostalAddr" style="height:3em; background-color:white;" placeholder="1234 Main Street&#10;Los Angeles, CA 90001"></textarea>
        </div>
    </div>
    <div class="ncInputBlock">
        <div>
            <label>Logo (Fully Qualified URL)</label>
        </div>
        <div style="display:flex; flex-direction:column;">
            <div  class="ncInputBlock">
                <input type="text" v-model="modelValue.ncLogo" placeholder="https://www.yourDomain.com/files/yourLogo.png" />
            </div>
            <div>
                <!-- https://lacity.gov/sites/g/files/wph1996/themes/site/logo.svg -->
                <div class="pageLogo">
                    <div style="display:flex; background-color:white;">
                        <div><img class="ncLogo" :src="modelValue.ncLogo" alt="Council Logo, Missing" /></div>
                        <div class="logoText">
                            <span>{{ modelValue.ncName }}</span>
                            <span>{{ modelValue.ncPostalAddr }} / {{ modelValue.ncWebsite }}</span>
                            <span>Email: {{ modelValue.ncEmailAddr }}</span>
                        </div>
                        <div><img class="cityLogo" src="https://meeting-manager-2a57a.web.app/img/cityLogo.987cece3.png" alt="Los Angeles City Logo, Missing" /></div>
                    </div>
                </div>
            </div>



        </div>
    </div>


</template>

<script>
import { provide} from 'vue'
import store from "@/store"

export default {
    name:"tplCouncil",
    props: {
        modelValue: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['update:modelValue'],
    setup(modelValue){
        provide("store", store)
         return {store}
    },

    mounted(){
        //console.log(this.modelValue)
        console.log(this.store.state.defaults.ncDescription)
        //console.log(this)
        //console.log(store)
    },
    methods:{

    } // end methods
}
</script>

<style scoped>
/* .councilContainer{
    display:flex;
    flex-direction:column;
    max-width:80%;
} */
.ncInputBlock{
    display: flex;
    flex-direction: column;
    width:100%;
}
label{
    margin:0 5px 0 0;
}
input{
    width:100%
}
</style>