<template>
	<div class="navBar">
		<div><h3>Export Agenda Motions to CSV</h3></div>
		<div class="actionButtons">
			<!-- <button @click="testMe">Test</button> -->
			<!-- code activated hidden elements  -->
			<input class="btnFileLoad" type="file" ref="oFileHandler" @change="store.state.LoadAgenda($event)" />
			<button class="btn btnLoad" @click="fileLoad" title="Load Agenda to export.">Load</button>

			<button class="btn btnPrint" @click="SaveCSV">Export CSV</button>
			<router-link to="/"><button type="button" class="btn btnHome">Home</button></router-link>
		</div>
		<hr />
	</div>

    <div v-if="oAgenda">
        <div>Item Title</div>
        <ol>
            <li v-for="(oItem,index) in oAgenda.agendaItems" :key="index">{{oItem.itemIndex}} {{oItem.title}}</li>
        </ol>
    </div>
</template>

<script>
import { provide, ref } from "vue";
import store from "@/store";
import VuePapaParse from 'vue-papa-parse'

export default {
    name:'ExportAgendaToCSV',
    components:{
    },
    setup() {
        provide("store", store)
        let oAgenda = ref({})
        return { store, oAgenda }
	},
	data(){
        let oAgenda=this.store.state.oData.agenda
        console.log(oAgenda)
        return {
           oAgenda
        }
    },
 	beforeCreate(){
        // load the default data members
        this.store.state.LoadDefaults()
        this.oAgenda = this.store.state.oData.agenda
     },
    methods:{

        ConvertToCommonFormat(){
let oCommonFormat = []
for(var i=0; i<this.oAgenda.agendaItems.length; i++){

console.log(this.oAgenda.agendaItems[i].itemFmt)

    if(![6,7].includes(this.oAgenda.agendaItems[i].itemFmt) ){continue}

    let oItem = {}


    // moment(scheduled).format('YY-MM-DD'),oItem.itemIndex,oItem.title

    // format 6 or 7 common fields under oItem.itemData...
    //oItem.callForVote=this.oAgenda.agendaItems[i].callForVote
    oItem.distribution=this.oAgenda.agendaItems[i].itemData.distribution
    //init: "for(var i=0; i< this.oAgenda.members.length; i++){this.oItem.itemData.motion[0].members.push( {'id': this.oAgenda.members[i].id, 'firstName':this.oAgenda.members[i].firstName, 'lastName':this.oAgenda.members[i].lastName, 'eligible':null,'voted':null} ) }"
    oItem.motion=''
    for(var j=0; j<this.oAgenda.agendaItems[i].itemData.motion.length; j++){
        oItem.motion = this.store.methods.stripHTML(oItem.motion + this.oAgenda.agendaItems[i].itemData.motion[j].body +'\r\n')
    }
    //motionCt: 0
    oItem.paragraph = this.store.methods.stripHTML(this.oAgenda.agendaItems[i].itemData.paragraph)
    oItem.supportDocs=''
    for(var j=0; j<this.oAgenda.agendaItems[i].itemData.supportDocs.length; j++){
        oItem.supportDocs = oItem.supportDocs + this.oAgenda.agendaItems[i].itemData.supportDocs[j].title +': '+ this.oAgenda.agendaItems[i].itemData.supportDocs[j].link +'\r\n'
    }

    switch(this.oAgenda.agendaItems[i].itemFmt){
        case 6:
            // itemFmt 6 only fields
        oItem.email = this.oAgenda.agendaItems[i].itemData.email
        oItem.phone = this.oAgenda.agendaItems[i].itemData.phone
        oItem.scheduleDeadline = this.oAgenda.agendaItems[i].itemData.scheduleDeadline
        oItem.scheduleIndicator = this.oAgenda.agendaItems[i].itemData.scheduleIndicator
        case 7:
        // oItem.itemFmt 7 only fields
        oItem.HearingDate = this.oAgenda.agendaItems[i].itemData.HearingDate
        oItem.appliactionDate = this.oAgenda.agendaItems[i].itemData.appliactionDate
        oItem.applicantEmail = this.oAgenda.agendaItems[i].itemData.applicantEmail
        oItem.applicantName = this.oAgenda.agendaItems[i].itemData.applicantName
        oItem.applicantPhone = this.oAgenda.agendaItems[i].itemData.applicantPhone
        oItem.vncSubarea = this.oAgenda.agendaItems[i].itemData.vncSubarea
        oItem.caseNumbers = this.oAgenda.agendaItems[i].itemData.caseNumbers
        oItem.cityPlanner = this.oAgenda.agendaItems[i].itemData.cityPlanner
        oItem.description = this.store.methods.stripHTML(this.oAgenda.agendaItems[i].itemData.description)
        oItem.lupcHearing = this.oAgenda.agendaItems[i].itemData.lupcHearing
        oItem.lupcMember = this.oAgenda.agendaItems[i].itemData.lupcMember
        oItem.lupcReportURL = this.oAgenda.agendaItems[i].itemData.lupcReportURL
        oItem.lupcVote = this.oAgenda.agendaItems[i].itemData.lupcVote
        oItem.projectAddress = this.oAgenda.agendaItems[i].itemData.projectAddress
        oItem.representative = this.oAgenda.agendaItems[i].itemData.representative
    }
    console.log(oItem)
    oCommonFormat.push(oItem)
}



return oCommonFormat



        },



        SaveCSV(){
        let oSaveMe = this.ConvertToCommonFormat()

// create the output object
// moment(scheduled).format('YY-MM-DD'),oItem.itemIndex,oItem.title

// format 6 or 7 common fields under oItem.itemData...
// callForVote: ""
// distribution: ['Secratary@VeniceNC.org']
// init: "for(var i=0; i< this.oAgenda.members.length; i++){this.oItem.itemData.motion[0].members.push( {'id': this.oAgenda.members[i].id, 'firstName':this.oAgenda.members[i].firstName, 'lastName':this.oAgenda.members[i].lastName, 'eligible':null,'voted':null} ) }"
// motion: [{…}]
// motionCt: 0
// paragraph: "<p>Consideration of items 9-38</p>"
// supportDocs: []

// // itemFmt 6 only fields
// email: ""
// phone: ""
// scheduleDeadline: ""
// scheduleIndicator: ""

// // itemFmt 7 only fields
// HearingDate: ""
// appliactionDate: "13-Oct-2021"
// applicantEmail: ""
// applicantName: "NICK LEATHERS (301)994-6657"
// applicantPhone: ""
// vncSubarea: ""
// caseNumbers: "DIR-2021-8582-CDP-SPP-MEL"
// cityPlanner: ""
// description: "<p>Construction; use and maintenance of an accessory dwelling unit on top of an existing attached garage in the rear yard(CDP-COASTAL DEVELOPMENT PERMIT)</p>"
// lupcHearing: ""
// lupcMember: ""
// lupcReportURL: ""
// lupcVote: ""
// projectAddress: "24 E 18TH AVE  90291"
// representative: ""

// https://www.papaparse.com/docs#json-to-csv
let papaConfig = {
	quotes: true, //or array of booleans
	quoteChar: '"',
	escapeChar: '"',
	delimiter: ",",
	header: true,
	newline: "\r\n",
	skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
	columns: null //or array of strings
}
let csv = this.$papa.unparse( oSaveMe, papaConfig )


//navigator.clipboard.writeText(csv);

    // lookup short name for export file
    let lcCommittee=''
    for(var i=0; i<this.store.state.oData.committees.length; i++){
        if(this.store.state.oData.committees[i].name == this.store.state.oData.agenda.body){
            lcCommittee = this.store.state.oData.committees[i].shortName
            break
        }
    }
   // convert csv into text string
    
    //var target = JSON.stringify(Object.assign({}, csv))
    // Convert the text string to BLOB.
    const textToBLOB = new Blob([csv], { type: 'text/plain' });
    // set the output fileName to save
    const sFileName = 'Export_' + lcCommittee +'_'+ this.$moment().format('YYYYMMDD-HHmmss')  +'.csv' 
    // create a dummy anchor element
    let oTempAnchor = document.createElement("a");
    oTempAnchor.download = sFileName;
    if (window.webkitURL != null) {
         oTempAnchor.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
         oTempAnchor.href = window.URL.createObjectURL(textToBLOB);
         oTempAnchor.style.display = "none";
         document.body.appendChild(oTempAnchor);
    }
    // invoke the click event on the anchor element to write the file
    oTempAnchor.click();
    // end save file
    console.log(sFileName + ' saved')








        },
        fileLoad() {
            this.hiddenFileElement = this.$refs.oFileHandler;
            this.hiddenFileElement.click();
		},
        testMe(){
			console.log(this)
		},
    }
}
</script>

<style>

</style>