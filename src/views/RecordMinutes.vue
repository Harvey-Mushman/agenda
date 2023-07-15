<template>
    <div class="navBar">
        <div><h1>Record Minutes</h1></div>
        <div class="actionButtons">
        <!-- code activated hidden elements  -->
        <input class="btnFileLoad" type="file" ref="oFileHandler" @change="store.state.LoadAgenda($event)" />
        <button class="btn btnLoad" @click="fileLoad">Load</button>
        <!-- <button class="btn btnSort" @click="store.methods.SortAgendaItems">Sort</button> -->
        <!-- <button class="btn btnPrint" @click="printMeTest">Print</button>
        <button class="btn btnPrint" v-print="printObj">PrintObj</button> -->
        <button class="btn btnNav btnSave" @click="saveFile()">Save</button>
        <router-link to="/"><button type="button" class="btn btnHome">Home</button></router-link>
    </div>
    <hr />
  </div>

    <div v-if="oAgenda">
		<div ref="printMe" class="recordMeeting" id="printMe">
            <div class="pageBackground">
                <div class="pageLogo">
                <div>
                    <img class="vncLogo" src="@/assets/vncLogo.png" />
                </div>
                <div class="logoText">
                    <span style="font-size: 14pt">Venice Neighborhood Council</span>
                    <span>P.O.Box 550, Venice, CA 90294 / www.VeniceNC.org</span>
                    <span>Email: Info@VeniceNC.org</span>
                </div>
                <div>
                    <img class="cityLogo" src="@/assets/cityLogo.png" />
                </div>
                </div>
                <div class="committeeHeading">
                    <h3>{{ oAgenda.body }}</h3>
                </div>
                <div v-if="oAgenda.joint.length>0" class="committeeHeadingJoint">
                    <h4>Joint With</h4>
                    <div v-for="(jointWith,index) in oAgenda.joint" :key="index">
                        <h3>{{jointWith}}</h3>
                    </div>
                </div>
                <div class="committeeHeading">
                    <h3>{{ oAgenda.title }} {{oAgenda.isAgenda ? 'Agenda':'Minutes'}}</h3>
                </div>
                <div class="committeeHeading">
                    <h3>{{ this.$moment(oAgenda.scheduled).format("dddd MMMM DD, YYYY") }}</h3>
                </div>
                <div class="committeeHeading">
                    <h3>Start Time: {{ this.$moment(oAgenda.scheduled).format("hh:mm A") }}</h3>
                </div>
                <div class="committeeLocation" v-html="oAgenda.location"></div>
                <div v-for="(item, index) in oAgenda.agendaItems" :key="item.guid">
                    <!-- loop agenda items outputting in array order -->
                    <template1 v-if="item.itemFmt === 1" v-model="oAgenda.agendaItems[index]"></template1>
                    <template2 v-if="item.itemFmt === 2" v-model="oAgenda.agendaItems[index]"></template2>
                    <template3 v-if="item.itemFmt === 3" v-model="oAgenda.agendaItems[index]"></template3>
                    <template4 v-if="item.itemFmt === 4" v-model="oAgenda.agendaItems[index]"></template4>
                    <template5 v-if="item.itemFmt === 5" v-model="oAgenda.agendaItems[index]"></template5>
                    <template6 v-if="item.itemFmt === 6" v-model="oAgenda.agendaItems[index]"></template6>
                    <template7 v-if="item.itemFmt === 7" v-model="oAgenda.agendaItems[index]"></template7>
                    <template8 v-if="item.itemFmt === 8" v-model="oAgenda.agendaItems[index]"></template8>
                </div>
            </div>
 		</div>
	</div>

</template>

<script>

import {ref, provide, reactive, inject } from "vue";
import store from "@/store";
// import SaveAgenda from '../composables/SaveAgenda'
import SaveMinutes from '../composables/SaveMinutes'
// import navMenu from "@/components/navMenu";
import template1 from "@/components/template1";
import template2 from "@/components/template2";
import template3 from "@/components/template3";
import template4 from "@/components/template4";
import template5 from "@/components/template5";
import template6 from "@/components/template6";
import template7 from "@/components/template7";
import template8 from "@/components/template8";

import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg'

//import myAgenda from 'C:/Users/john doe/Downloads/Agenda_PrintTest.json'

// import printCSS from '!raw-loader!@/assets/printerStyles.css'

export default {
    name: 'PrintAgenda',
	components: {
		// navMenu,
		template1,
		template2,
		template3,
		template4,
		template5,
		template6,
		template7,
		template8,
	},

    setup() {
        provide("store", store);
        let oAgenda = ref({})
		const indexKey=0
		let printMe = ref(null)
		const hiddenFileElement = ref({})
		return { store, indexKey, oAgenda, hiddenFileElement, printMe}
	},
	data(){
    let oAgenda=this.store.state.oData.agenda
    let oMembers=this.store.state.oData.members
    let oTemplates=this.store.state.oData.templates
    this.store.state.isPrint=false
    // forse any saves from here on to be recorded as minutes

//oAgenda = JSON.parse(JSON.stringify(myAgenda))

        return {
            oAgenda, oMembers, oTemplates, remixiconUrl,

			// print function is returned as an object
           	printLoading: true,
            printObj: {
				id: "printMe",
				popTitle: 'good print',
				// extraCss: "@/assest/printerStyles.css",
				// extraCss: "https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css",
				extraHead: '<meta http-equiv="Content-Language"content="en-us"/>',
				beforeOpenCallback (vue) {
					vue.printLoading = true
					console.log('before open callback fired')
				},
				openCallback (vue) {
					vue.printLoading = false
					console.log('open callback fired')
				},
				closeCallback (vue) {
					console.log('close callback fired')
				}
            }
			// print func end
		// okay, now return
        }
    },

	beforeCreate(){
        // load the default data members
        this.store.state.LoadDefaults(this)
        console.log('defaults loaded')
        this.store.state.showTimerBtn = true
        this.store.state.showDelBtn = false
		this.oAgenda = this.store.state.oData.agenda
    },
	updated(){
		console.log("app.vue updated")
		// disable addItemRefs based on newly loaded agenda
		this.store.methods.restrictAddingItems(this)
        this.store.methods.initMeetingEndTime(this)

  	},
    mounted(){

    },
    methods: {
		// load local file
		fileLoad() {
		this.hiddenFileElement = this.$refs.oFileHandler;
		this.hiddenFileElement.click();
		},
        saveFile() {
            SaveMinutes(this,"Draft")
            console.log("minutes draft saved");
        },
        // // this print test does not render vue bindings
        // printMeTest() {
        //     let content = this.$refs.printMe.outerHTML
        //     let myWindow = window.open('', '', '');
        //     myWindow.document.write('<html><head><title>Form</title>');
        //     myWindow.document.write('<style>');
        //     // import print stryle from external file required
        //     // import printCSS from '!raw-loader!@/assets/printerStyles.css'
        //     myWindow.document.write(printCSS)
        //     myWindow.document.write('</style>');
        //     myWindow.document.write('</head><body>');
        //     myWindow.document.write(content);
        //     myWindow.document.write('</body></html>');
        //     myWindow.document.close();
        //     myWindow.focus();
        //     // This is the place where we need to wait for the new window to be loaded
        //     myWindow.onload = function() {
        //         myWindow.print();
        //         myWindow.close();
        //     }
		// }, // end printMeTest
        // updateTimeClock(){
        //     console.log('timeClockUpdate fired')
        // },
        testMe(){
			console.log(this)
		},
	},

}




</script>

<style lang="scss">
.btn{
	width:70px;
}
.actionButtons{
	/* width:350px; */
	padding:0 auto 0 auto;
}
hr{
    border: solid 1px black;
    height: 3px;
    width: 90%;
    margin-top: 10px;
    background-color: lightgray;
}
/* required for printing */
/* css scoped to recordMeeting class */
.recordMeeting{
	background-color:lightgray;
	width:8.5in;
}
/* individual subclasses start here */
.recordMeeting input{
	border:none !important;
}
.recordMeeting textarea{
	border:none;
}
.recordMeeting .pageBackground{
	background-color: white;
	border:none;
}
.recordMeeting .btnDelItem{
	display:none !important;
	background-color: white;
}
// .recordMeeting .chkShowAll{
// 	display:none;
// }
.recordMeeting .item{
	border:rgb(200, 200, 200) solid 1px;
	background-color: white;
}
.recordMeeting .motion{
	font-size:18px !important;
}
.recordMeeting .voterContainer{
	display:block !important;
}
.recordMeeting .alternateMotion{
	display:block !important;
}


input[type=checkbox] {
    accent-color: black !important;
}

.timeClockContainer{
    display:flex;
    justify-content: flex-end;
    align-items: center;
    margin-left:5px;
}
.timeClock{
    display:inline-block !important;
}
.btnTimeClock{
    border:solid 1px black;
    border-radius: 25px;
    height:26px;
    width:26px;
}
/* defining filler colors at https://isotropic.co/hex-color-to-css-filter/ */
/* and color picker https://www.google.com/search?q=css+color+picker&oq=css+color+picker */

.timeClock img{
    border-radius: 25px;;
    /* was green filler */
    /* filter: invert(29%) sepia(63%) saturate(3516%) hue-rotate(110deg) brightness(98%) contrast(106%); */
}
.timeClockRed{
      filter: invert(25%) sepia(96%) saturate(6523%) hue-rotate(357deg) brightness(90%) contrast(126%);
}
.timeClockNone{
    /* very light gray */
    filter: invert(83%) sepia(0%) saturate(0%) hue-rotate(250deg) brightness(113%) contrast(94%);
}

</style>




