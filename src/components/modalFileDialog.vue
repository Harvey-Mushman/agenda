<template>
<!-- {{modelValue}}  {{chkFilterEmptyFields || modelValue.length>0}} -->
<!-- <div class="itemRowDeatils" v-show="(chkFilterEmptyFields && !oItem.itemData.supportDocs.length>0) || oItem.itemData.supportDocs.length>0"> -->
    <div class="itemRowDeatils" v-show="chkEmpty || modelValue.length>0">
        <div class="itemChildLabel">
            Attachments:
            <div v-show="!isPrint">
                <svg @click="getDoc" class="remix riFile">
                    <use :xlink:href="`${remixiconUrl}#ri-file-add-line`"></use>
                </svg>

                <svg @click="delDoc" class="remix riFile">
                    <use :xlink:href="`${remixiconUrl}#ri-file-reduce-line`"></use>
                </svg>
            </div>
        </div>
        <ul>
            <li class="titleUrl" v-for="(urlFile,index) in modelValue" :key="index">
                {{urlFile.title}}: <a :href="urlFile.link" target="_blank">{{urlFile.link}}</a>
            </li>
        </ul>
    </div>

    <div>
        <transition name="modal-animation">
            <div v-show="modalActive" class="modal">
                <transition name="modal-animation-inner">
                    <div v-show="modalActive" class="modal-inner">
                        <div class="modal-inner-fmt">
                            <!-- <img @click="close" src="@/assets/close-circle-line.png" alt="close" /> -->
                            <div class="modalHeader">
                                <div class="modalHeaderInner">
                                    <div name="header">
                                        <h3>Specify Document Label &amp; Location</h3>
                                        <p v-show="deleteDoc" style="color:red; font-weight:bold; margin:5px 0 5px 0;">Check all to be deleted</p>
                                    </div>
                                </div>
                                <!-- <h3>Specify Document Label &amp; Location</h3> -->
                                <svg @click="close" class="remix">
                                    <use :xlink:href="`${remixiconUrl}#ri-close-circle-line`"></use>
                                </svg>
                            </div>
                            <div name="list" v-if="deleteDoc">
                                <!-- modal content -->
                                <ul>
                                    <li class="titleUrl" v-for="(urlFile,index) in modelValue" :key="index">
                                        <input type="checkbox" v-model="urlFile.index" style="height:18px; margin: 0 5px;"/> {{urlFile.title}}: {{urlFile.link}}
                                    </li>
                                </ul>
                            </div>

                            <div class="modal-content" v-if="!deleteDoc">
                                <div class="slotInput">
                                    <div class="inpFld">
                                        <div class="modalFldTitle">Label:</div>
                                        <div class="modalFldImp">
                                            <input class="modalFld" v-model="slotTitle" placeholder="application, drawings, letter, etc."/>
                                        </div>
                                    </div>
                                    <div class="inpFld">
                                        <div class="modalFldTitle">File URL:</div>
                                        <div class="modalFldImp">
                                            <input class="modalFld" v-model="slotFileURL" placeholder="http://www.WebSite.com/file" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="modalFooter">
                                <div class="modalActionButtons">
                                    <button class="btnCancel" @click="close" type="button">Cancel</button>
                                    <button v-show="deleteDoc" type="button" class="btn btnDelete"  @click="delFileEntries">Delete</button>
                                    <button v-show="!deleteDoc" type="button" class="btn btnAdd" @click="setDoc(slotHeader)">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
    </div>

    <!-- <modal @close="modalActive=false" @setDoc="setDoc" :modalActive="modalActive" :oItem="oItem"> </modal> -->

</template>

<script>
import { inject, computed, ref } from "vue"
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'
export default {

    name: "modalFileDialog",
    components: {},
    props: {
        modelValue: {
            type: Object,
            default: () => ({}),
        },
        chkEmpty:{
            type:Boolean,
            default:() => (false),
        }
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
        const toggleModal = () => { modalActive.value = !modalActive.value }
        let slotHeader = ref('Append Application')
        let slotTitle = ref('')
        let slotFileURL = ref('')

        return { store, oItem, modalActive, toggleModal, slotHeader, slotTitle, slotFileURL };
    },
    data(){
        let deleteDoc=false
        let isPrint = this.store.state.isPrint
        return{
            deleteDoc, remixiconUrl, isPrint
        }
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

            // var parser = document.createElement('a');
            // parser.href = "http://example.com:3000/pathname/?search=test#hash";

            // parser.protocol; // => "http:"
            // parser.hostname; // => "example.com"
            // parser.port;     // => "3000"
            // parser.pathname; // => "/pathname/"
            // parser.search;   // => "?search=test"
            // parser.hash;     // => "#hash"
            // parser.host;     // => "example.com:3000"

            var a  = document.createElement('a')
            a.href = this.slotFileURL
            if( !(a.protocol+'//' == 'https://' || a.protocol+'//' == 'http://') ){
                alert('Error: Fully Qualified URL must include protocol (HTTP:// or HTTPS://), retry' )
                return
            }
            var regX =/^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.(?:com|net|org|gov)$/i
            var hostName = a.hostname.split('.')
            if(hostName.length<2){
                alert('Error: domain name is invalid')
                    return
            }
            var tld = hostName[hostName.length -2] +'.'+ hostName[hostName.length -1]
            if( !regX.test(tld) ){
                alert('Error: Fully Qualified URL must include TLD (.com, .org, .gov, etc.), retry' )
                return
            }
            this.modalActive = false
            this.deleteDoc=false
            this.modelValue.push({"title":this.slotTitle,"link":this.slotFileURL})
        },
        delDoc(){
            for(var i=0; i<this.modelValue.length; i++){
                if(this.modelValue[i].hasOwnProperty('index')){
                    //console.log(this.oItem.itemData.supportDocs[i].link)
                    delete this.modelValue[i].index
                }
            }
            this.modalActive = true
            this.deleteDoc=true
        },
        delFileEntries(){
            //console.log(this)
            for(var i=this.modelValue.length -1 ; i>-1 ; i--){
                if(this.modelValue[i].index){
                    //console.log(this.oItem.itemData.supportDocs[i].link)
                    this.modelValue.splice(i,1)
                }
            }
            this.modalActive = false
            this.deleteDoc=false

        },
    }


}
</script>



<style  lang="scss">
/* modal styles */
.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 99999;

    .modal-inner {
        position: relative;
        max-width: 600px;
        width: 80%;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        background-color: rgb(145, 143, 143);
        padding: 16px;
        .remix {
            // position: absolute;
            top: 15px;
            right: 15px;
            cursor: pointer;
        }
        svg{
            width: 1.5em;
            height: 1.5em;
            fill: black;
        }
        svg:hover{
            fill:red;
        }
        .modalActionButtons {
            position: absolute;
            bottom: 15px;
            right: 0px;
            width:200px;
        }
        button {
            width:70px;
            margin: 3px 10px 3px 15px;
            padding: 3px 5px 3px 3px;
        }
        .modalHeaderInner{
            display:flex;
            flex-direction: column;
        }
    }
}
.modal-content {
    display: flex;
    flex-direction: column;
}
.modal-content h1 {
    font-size: 32px;
}
.modal-content p {
    font-size: 18px;
}
.modalHeader{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* height:75px; */
    margin-bottom:10px;
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
    /* margin:10px 0 0 0; */
    height:30px;
}

.modal-animation-enter-active,
.modal-animation-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-animation-enter-from,
.modal-animation-leave-to {
  opacity: 0;
}
.modal-animation-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}
.modal-animation-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-animation-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.modal-animation-inner-leave-to {
  transform: scale(0.8);
}
</style>