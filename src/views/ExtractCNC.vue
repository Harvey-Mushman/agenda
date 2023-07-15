<template>
     <div class="extractCNC">
          <h2>Import Early Notifications (CNC Report)</h2>
          <h3>( Filetype = .CSV )</h3>
          <input class="btnFileLoad" type="file" ref="oFileHandlerCNC" @change="ExtractCNC($event)" />
          <div class="navButtons">
               <button class="btn btnLg120 btnExtractCNC" @click="openCNC">Open CSV File</button>
               <router-link to="/"><button class="btn btnHome">Home</button></router-link>
          </div>

          <div v-if="uniqueNC">
               <p>Select Neighborhood Council</p>
          <select v-model="selectedNC" @change="ncFilter">
               <option v-for="(nc, index) in uniqueNC" :key="index">{{nc}}</option>
          </select>
          </div>
          <div v-if="ncCases" class="ncCases">
               <p>Check cases to convert and import to Agenda format</p>
               <div class="chkAll">
                    <input class="chkAllItems" id="chkAll" type="checkbox" @click="toggleAllItems" /><label for="chkAll">Toggle All Items</label>
               </div>
               <ol>
                    <li v-for="(ncCase, index) in ncCases" :key="index" :class="{'oddRow': index % 2 === 0, 'evenRow': index % 2 !== 0 }">
                         <input type="checkbox" class="chkCNC" v-model="ncCase.index" />
                         {{ncCase.Address}} , {{ncCase[`Case Number`]}}
                    </li>
               </ol>
               <div class="btnSaveContainer">
                    <button class="btn btnSaveItems" @click="generateAgenda">Save as Agenda Items</button>
               </div>
               <h3 class="blink_me" v-if="displayMessage">{{displayMessage}}</h3>
          </div>
     </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import { provide, ref, reactive } from "vue";
import VuePapaParse from 'vue-papa-parse'
import store from "@/store";

export default {
	name: "ExtractCNC",
	setup(){
		provide("store", store)
		const uniqueNC = ref(null)
		let selectedNC=ref(null)
		let ncCases = ref(null)
		let ncCase = ref(null)
		let nLastIndex = 0
		let displayMessage = ref(null)
          const oAgendaItems = []
		return{
			store, uniqueNC, selectedNC, ncCases, ncCase, nLastIndex, displayMessage, oAgendaItems
		}
	},
	data() {
		this.store.state.LoadDefaults()
		let oAgenda = this.store.state.oData.agenda;
		let oMembers = this.store.state.oData.members;
		let oTemplates = this.store.state.oData.templates;
		return {
			oAgenda,
			oMembers,
			oTemplates,
		}
	},
	mounted(){

	},
    methods:{
		toggleAllItems(){
			for(var i=0; i<this.ncCases.length; i++){
				this.ncCases[i].index = !this.ncCases[i].index
			}
		},

        openCNC(){
			console.log(this.store.state.oData)
        // we need an inpot file to convert
        // for now always assume nc=vneice
        console.log('time to get cnc file')
        let hiddenFileElement = this.$refs.oFileHandlerCNC;
        hiddenFileElement.click();
        },
		// now process the selected file
    	ExtractCNC(oEvent) {

        // file passed in handler event
        var file = oEvent.target.files
        if (!file.length) return
        // expose oDummy and oAgenda for use within the promise

         // const {$papa} = VuePapaParse()

        // this.oDummy = this.oData.agenda
        // this.oAgenda = this.oData.agenda
        this.extractCNC(file[0])




        console.log('Agenda Requests Imported')

        // convert csv to json

        // extract target NC (venice)

        // append to agenda

   },

     extractCNC(file){
           let promise = new Promise((resolve, reject) => {
                var reader = new FileReader()
             reader.onload = e => {
                  resolve((this.fileinput = reader.result))
             };
             reader.readAsText(file);
        });
        promise.then( result => {
             // handle a successful result
             //console.log(this.fileinput);
             let csvImport = this.fileinput
            // console.log(csvImport)

			// define csv file format has a header row
               let papaConfig = {
                    delimiter: "",	// auto-detect
                    newline: "",	// auto-detect
                    quoteChar: '"',
                    escapeChar: '"',
                    header: true,
                    transformHeader: undefined,
                    dynamicTyping: false,
                    preview: 0,
                    encoding: "",
                    worker: false,
                    comments: false,
                    step: undefined,
                    complete: undefined,
                    error: undefined,
                    download: false,
                    downloadRequestHeaders: undefined,
                    downloadRequestBody: undefined,
                    skipEmptyLines: false,
                    chunk: undefined,
                    chunkSize: undefined,
                    fastMode: undefined,
                    beforeFirstChunk: undefined,
                    withCredentials: undefined,
                    transform: undefined,
                    delimitersToGuess: [',', '\t', '|', ';']
               }
				// these delimitersToGuess have been omited to runtime error
				//, Papa.RECORD_SEP, Papa.UNIT_SEP

				this.store.state.csvJson = this.$papa.parse( csvImport, papaConfig )
				// https://www.papaparse.com/docs#results
				// oJson = {
					// date[{ rows of properties : values }],
					// errors[{ last row of data might be imcomplete}],
					// meta[{ describes config including fields row}]
				// }
				console.log(this.store.state.csvJson)
				// set filter to selected neighborhood council
				this.uniqueNC = [...new Set(this.store.state.csvJson.data.map(item => item[`Neighborhood Council`]))]
				// for(var i=0; i<this.uniqueNC.length; i++){
				// 	console.log(this.uniqueNC[i].length==0)
				// }
				for(var i=0; i<this.uniqueNC.length; i++){
					if(this.uniqueNC[i].length==0){
						this.uniqueNC.splice(i,1)
					}
				}

        },
        error => {
             /* handle an error */
             console.log(error);
        })
   },

	ncFilter(){
		// only process selected neighborhood council
		this.ncCases = this.store.state.csvJson.data.filter(obj => {
			return obj[`Neighborhood Council`] == this.selectedNC
		})
		// sort by property address to get duplicates grouped
		this.ncCases.sort((a, b) => a.Address.localeCompare(b.Address));
		// console.log(this.ncCases)
		// console.log('cases filtered and sorted')
	},


	generateAgenda(){
		// assume currently selected default agenda
		// convert imported CNC Case files to agenda items
		// within eval() command this scope required to be a variable
		const self=this
		// process cases within csvJson
		//console.log(self.store.state.csvJson)
		// restrice to checked items
		self.ncCasesChecked = self.store.state.csvJson.data.filter(obj => {
			return obj.index == true
		})



          // agenda now exists, test for dependancies
          // open selected file

          // test for valid json format
          //
          //
          //
          //
          //
          //


        //   // assume agenda with dependicies is loaded
        //   // setup next item number
           let nLastIndex = 0
        //   for (var i = 0; i < self.oAgenda.agendaItems.length; i++) {
        //     if (nLastIndex < self.oAgenda.agendaItems[i].itemIndex) {
        //       nLastIndex = self.oAgenda.agendaItems[i].itemIndex;
        //     }
        //   }
        //   let callToOrder=false
        //   let rollCallTemplate=false
        //   // console.log(this.oData.agenda)
        //   if(self.oAgenda.agendaItems){
        //        for(var i=0; i<self.oAgenda.agendaItems.length; i++){
        //             if(self.oAgenda.agendaItems[i].itemFmt==2){
        //                  callToOrder=true
        //             }
        //             if(self.oAgenda.agendaItems[i].itemFmt==3){
        //                  rollCallTemplate=true
        //             }
        //        }
        //   }
        //   if(!callToOrder){
        //        for (var i = 0; i < self.oTemplates.length; i++) {
        //             if (self.oTemplates[i].itemFmt === 2) {
        //             //console.log(this.oData.templateFormats[this.data.selectedFormat])
        //             // create a deep copy
        //             this.oItem = JSON.parse(JSON.stringify(self.oTemplates[i]));
        //             break;
        //             }
        //        }
        //        self.oItem.guid = uuidv4();
        //        // increment itemIndex higher than last item
        //        nLastIndex = ++nLastIndex
        //        self.oItem.itemIndex = nLastIndex
        //        if (self.oItem.itemData.init.length) {
        //             // execuite initialize
        //             try {
        //                  //console.log(this.oItem.itemData.init);
        //                  eval(self.oItem.itemData.init);
        //                  //console.log("init completed");
        //             } catch {
        //                  console.log("init failed");
        //             }
        //        }
        //        // append item to array of items
        //        self.store.state.oData.agenda.agendaItems.push(this.oItem)
        //   }
        //   if(!rollCallTemplate){
        //        for (var i = 0; i < self.oTemplates.length; i++) {
        //             if (self.oTemplates[i].itemFmt == "3") {
        //             //console.log(this.oData.templateFormats[this.data.selectedFormat])
        //             // create a deep copy
        //             self.oItem = JSON.parse(JSON.stringify(self.oTemplates[i]));
        //             break;
        //             }
        //        }
        //        self.oItem.guid = uuidv4();
        //        // increment itemIndex higher than last item
        //        nLastIndex = ++nLastIndex
        //        self.oItem.itemIndex = nLastIndex++
        //        if (self.oItem.itemData.init.length) {
        //             // execuite initialize
        //             try {
        //                  //console.log(this.oItem.itemData.init);
        //                  eval(self.oItem.itemData.init);
        //                  //console.log("init completed");
        //             } catch {
        //                  console.log("init failed");
        //             }
        //        }
        //        // append item to array of items
        //        self.store.state.oData.agenda.agendaItems.push(self.oItem)
        //   }

		//this.oDummy.agenda = this.oAgenda
             for(var i=0; i<self.ncCasesChecked.length; i++){
                  // rewrite after webcorner adds submitted by
                  //     for(var j=0; j< this.state.store.oData.twcCommittees.length; j++){
                  //         if(oData[i].committee== this.state.store.oData.twcCommittees[j].id){
                  //             submittedBy=this.state.store.oData.twcCommittees[j].committee
                  //             break
                  //         }
                  //     }

                //  var submittedBy = oData[i].first_name +' '+ oData[i].last_name

				let lcDescript = self.ncCasesChecked[i][`Project Description`].toLowerCase()

				lcDescript = lcDescript.substring(0,1).toUpperCase() + lcDescript.substring(1)
				lcDescript = lcDescript + "(" + self.ncCasesChecked[i]['Request Type'] +")"

                    let lcApplicantName = self.ncCasesChecked[i][`Applicant Contact`].substring(0, self.ncCasesChecked[i][`Applicant Contact`].indexOf("(")-1)
                    let lcApplicantPhone = self.ncCasesChecked[i][`Applicant Contact`].substring(self.ncCasesChecked[i][`Applicant Contact`].indexOf("("))
                  nLastIndex= ++nLastIndex
                  self.oItem = {
						"itemIndex": 0,
						"itemFmt": 7,
						"itemFmtName":"LUPC Case/Motion",
						"guid":uuidv4(),
						"maxCt":0,
						"dependsOn":[2,3],
						"title": self.ncCasesChecked[i].Address +" (by: LUPC)",
						"time": 0,
                              "timeStart": "",
                              "timeEnd": "",
                              "duration": "",
						"itemData": {
							"projectAddress":self.ncCasesChecked[i].Address,
							"description":lcDescript,
							"lupcReportURL":"",
							"applicantName":lcApplicantName,
							"representative":"",
							"applicantPhone":lcApplicantPhone,
							"applicantEmail":"",
							"HearingDate":"",
							"appliactionDate":self.ncCasesChecked[i][`App. date`],
							"cityPlanner":"",
							"lupcMember":"",
							"lupcHearing":"",
							"lupcVote":"",
							"caseNumbers":self.ncCasesChecked[i][`Case Number`],
							"vncSubarea":"",
							"init":"for(var i=0; i< this.oAgenda.members.length; i++){this.oItem.itemData.motion[0].members.push( {'id': this.oAgenda.members[i].id, 'firstName':this.oAgenda.members[i].firstName, 'lastName':this.oAgenda.members[i].lastName, 'eligible':null,'voted':null} ) }",
							"paragraph": lcDescript,
							"supportDocs":[],
							"distribution": ["Secratary@VeniceNC.org"],
							"callForVote":"",
							"motionCt":0,
							"motion": [{"idx":0, "body":"","maker":"", "second":"", "members":[] }]
						}
					}
                  // execute the init
                //   if (self.oItem.itemData.init) {
                //        //setup for initialization
                //        // eval() scope does not reconize "this"
                //        let regX = /this/gi;
                //        let cmd = self.oItem.itemData.init.replace(regX, 'self');
                //        //console.log(cmd);
                //        // execuite initialization
                //        try {
                //             eval(cmd)
                //             // console.log("init completed");
                //        } catch {
                //             console.log("init failed");
                //        }
                //   }
				//   self.store.state.oData.agenda.agendaItems.push(self.oItem)
                    self.oAgendaItems.push(self.oItem)
                  //console.log(self.oItem)
				  //console.log(self.oAgenda)


             }

this.SaveCNC()

	},


     SaveCNC() {
          // convert json into text string



          // var target = JSON.stringify(Object.assign({}, this.store.state.oData.agenda))
           var target = JSON.stringify(Object.assign({}, this.oAgendaItems))
          // Convert the text string to BLOB.
          const textToBLOB = new Blob([target], { type: 'text/plain' });
          // set the output fileName to save
          const sFileName = 'cncItems_' + this.$moment().format('YYYYMMDD_hhMMSS')  +'.json';
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
          console.log('cnc items saved')
		  this.displayMessage = 'CNC Items Saved: ' + sFileName
		setTimeout(() => {this.displayMessage=null}, 5000);
	},


}


    }



</script>

<style lang="scss">
.extractCNC{
     display: flex;
     flex-direction: column;
     align-items: center;
}
.extractCNC .navButtons{
margin:15px 0 15px 0;
}
.btnExtractCNC{
	background-color:lightblue;
	color:black;
}
.extractCNC .ncCases{
     display: flex;
     flex-direction: column;
     justify-content: flex-start;
     width: 100vw;
     margin-left: 50px;
}
.extractCNC .btnSaveContainer{
     display:flex;
     justify-content: center;
     width:100vw;
     margin:15px 0 15px 0;
}
.extractCNC .btnSaveItems{
	width:170px;
	color:black;
	background-color:lightseagreen;
}
.extractCNC .chkAll{
	height:25px;
	padding:5px;
	margin:10px;
	/* background-color:lightgray; */
}
.extractCNC .chkAllItems{
	margin-right:10px;
}
.extractCNC p{
	padding:15px 0 5px 0;
}
.extractCNC li{
	margin:3px 0 0 10px;
     max-width:80%
}
.extractCNC .evenRow{
     background-color:#ffa5003b;
}
.extractCNC .oddRow{
     background-color: #98fb9859;
}
.blink_me {
	color:green;
     animation: blinker 1s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>>

