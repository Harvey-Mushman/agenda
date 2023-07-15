<template>
	<div class="navBar">
		<div><h3>Print Preview</h3></div>
		<div class="actionButtons">
			<!-- <button @click="testMe">Test</button> -->
			<!-- code activated hidden elements  -->
			<input class="btnFileLoad" type="file" ref="oFileHandler" @change="store.state.LoadAgenda($event)" />
			<button class="btn btnLoad" @click="fileLoad" title="Load Agenda to preview for printing.">Load</button>

			<button class="btn btnPrint" @click="print">Print</button>
			<router-link to="/"><button type="button" class="btn btnHome">Home</button></router-link>
		</div>
		<hr />
	</div>
    <div v-if="oAgenda">
		<div ref="printMe" class="printArea" id="printMe">
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
		</div><!-- printMe -->
	</div><!-- if agenda -->
</template>

<script>
import {ref, provide, reactive, inject } from "vue";
import store from "@/store";
import template1 from "@/components/template1";
import template2 from "@/components/template2";
import template3 from "@/components/template3";
import template4 from "@/components/template4";
import template5 from "@/components/template5";
import template6 from "@/components/template6";
import template7 from "@/components/template7";
import template8 from "@/components/template8";

import printCSS from '!raw-loader!@/assets/styles.css'


// import printCSS from '!raw-loader!@/assets/printerStyles.css'


export default {
    name: 'PrintAgenda',
	components: {

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

store.state.isPrint=true

//oAgenda = JSON.parse(JSON.stringify(myAgenda))

        return {
            oAgenda, oMembers, oTemplates, 
		// okay, now return
        }
    },

	beforeCreate(){
        // load the default data members
        this.store.state.LoadDefaults()
        console.log('defaults loaded')
        this.store.state.showTimerBtn = false
        this.store.state.showDelBtn = false
		this.oAgenda = this.store.state.oData.agenda
},
	updated(){
		console.log("print preview updated")
		// disable addItemRefs based on newly loaded agenda
		this.store.methods.restrictAddingItems(this)

  	},
mounted(){
	// this.$nextTick(function () {
	// 	// Code that will run only after the
	// 	// entire view has been rendered
	// 	this.store.state.voterReset=false
	// })
},
    methods: {
		// load local file
		fileLoad() {
		this.hiddenFileElement = this.$refs.oFileHandler;
		// this.store.state.voterReset=true
		this.hiddenFileElement.click();
		},
		testMe(){
			console.log(this)
		},

		print() {
			let content = this.$refs.printMe
			let myWindow = window.open('', '', '');
			myWindow.document.write('<html><head><title>Form</title>');
			myWindow.document.write('<style>');
			// import print stryle from external file required
			myWindow.document.write(printCSS)
			myWindow.document.write('</style>');


			// myWindow.document.write('<style>input[type="text"] { display: block !important;</style>');


			myWindow.document.write('</head><body>');
			myWindow.document.write(content.innerHTML);
			myWindow.document.write('</body></html>');
			myWindow.document.close();
			myWindow.focus();

			// This is the place where we need to wait for the new window to be loaded
			myWindow.onload = function() { 
			myWindow.print(); 
			myWindow.close();
			};
		}, // end print



	},

}






</script>

<style lang="scss" >
   input[type="text"] { display: block !important; }

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
/* css scoped to printArea class */
.printArea{
	background: none !important;
	width:8.5in;
}
/* individual subclasses start here */
.printArea input{
	border:none !important;
}
.printArea textarea{
	border:none !important;
}
.printArea .pageBackground{
	background:none !important;
	border:none !important;
}
.printArea .timeClock{
  display:none !important;
}
.printArea .btnDelItem{
	display:none !important;
	background:none !important;
}
.printArea .chkShowAll{
	display:none !important;
}
.printArea .item{
	border:rgb(200, 200, 200) solid 1px !important;
	background:none !important;
}
.printArea .motion{
	font-size:18px !important;
}
// .printArea .voterContainer{
// 	display:none !important;
// }
// .printArea .alternateMotion{
// 	display:none !important;
// }
.printArea .btnSaveMinutes{
	display:none !important;
}
// .printArea .ProseMirror p{
// 	padding:0
// }
</style>



