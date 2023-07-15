<template>
  <div class="importRequests">
    <h3>Import Agenda Requests</h3>

    <input class="btnFileLoad" type="file" ref="oFileHandler"  @change="loadRequests($event)" />

    <p class="arInstruct">This import routine is used to convert a downloaded Agenda Request JSON file into this system.  Onced
      imported and converted, the saved file then be imported onto an Agenda in the Agenda Creation option.</p>
    <div class="navBar">
      <button class="btn btnNav btnLoad btnLg120" @click="fileLoad()">Import File</button>
      <router-link to="/"><button class="btn btnNav btnHome" type="button">Home</button></router-link>
    </div>

    <div v-if="oAgenda.length" class="importListContainer">
      <ol>
        <li :class="{'importListItem': index % 2 === 0, 'importListItemAlt': index % 2 !== 0 }" v-for="(item,index) in oAgenda" :key="index">{{item.title}}</li>
      </ol>
      <div class="importSaveContainer">
        <button class="btn btnNav btnSave btnLg120" type="button" @click="SaveImports">Save Requests</button>
      </div>
    </div>
    <h3 class="blink_me" v-if="displayMessage">{{displayMessage}}</h3>
  </div>
</template>

<script>

import { v4 as uuidv4 } from "uuid"
import { provide, ref, reactive } from "vue";
import store from "@/store";
//import defaults from '../store/defaults.json'

export default {
  name: "ImportRequests",
  setup() {
    provide("store", store);
	const oAgenda = ref([])
  const hiddenFileElement = ref({})
	let displayMessage=ref('')
    return { store, oAgenda, displayMessage, hiddenFileElement };
  },
  data() {
    //let oAgenda = this.store.state.oData.agenda
    let fileInput=""
    let oDummy=ref([])

    return {
     // oAgenda,
      fileInput,
      oDummy,
    };
  },

mounted(){
    console.log( this.store )
},
methods:{

    // load local file
    fileLoad() {
      this.hiddenFileElement = this.$refs.oFileHandler;
      this.hiddenFileElement.click();
    },
    // hidden input type=file click exent lands here
    loadRequests(oEvent) {
      var file = oEvent.target.files;
      if (!file.length) return;
      this.oDummy = this.oData;
      this.createInput(file[0]);
    },
    createInput(file) {
      let promise = new Promise((resolve, reject) => {
        var reader = new FileReader();
        var vm = this;
        reader.onload = (e) => {
          resolve((vm.fileinput = reader.result));
        };
        reader.readAsText(file);
      })

      promise.then(
        (result) => {
          // handle a successful result
          //console.log(this.fileinput);
          var oData = JSON.parse(this.fileinput);
            for(var i=0; i<oData.length; i++){

              var submittedBy = ''
              if(oData[i].meeting_date==null){oData[i].meeting_date=''}
              // webcorner added committee submitted by
              if(oData[i].request_from=='committee'){
                submittedBy = '<b>Committee: </b>' + oData[i].committee_from_title + ' <b>On: </b>' + oData[i].meeting_date +' <b>Vote: </b>'+ oData[i].vote_count
              } else {
                submittedBy = '<b>Stakeholder: </b>' + oData[i].first_name +' '+ oData[i].last_name +' <b>Dated: </b>' + oData[i].meeting_date
              }

                // webcorner now outputs name of committee selected, this is old code no longer needed
                // for(var j=0; j< this.state.store.oData.twcCommittees.length; j++){
                //     if(oData[i].committee_from_id== this.state.store.oData.twcCommittees[j].id){
                //         submittedBy=this.state.store.oData.twcCommittees[j].committee
                //         break
                //     }
                // }
                // web corner does not always export oData[i].distribution and if null creates an error
                if(oData[i].distribution==undefined){
                  oData[i].distribution=''
                } else {
                  // webCorner outputs python new lines encoded as \r\n
                  var regEx = /\r?\n|\r/gi
                  var laDistribution = ["Secratary@VeniceNC.org, "] + oData[i].distribution.replace(regEx,', ')
               }
              // setup dor supporting documents, not always present
              let oDocs = []
              if(oData[i].document){
                for(var j=0; j<oData[i].document.length; j++){
                  oDocs.push({"title":"untitled","link":oData[i].document[j]})
                }
              }
              var oItem = {
                  "itemIndex": 0,
                  "itemFmt": 6,
                  "itemFmtName":"Title/Discussion/Motion",
                  "guid":uuidv4(),
                  "maxCt":0,
                  "dependsOn":[2,3],
                  "title":oData[i].title,
                  "time": 0,
                  "timeStart": "",
                  "timeEnd": "",
                  "duration": "",
                  "itemData": {
                      "init":"for(var i=0; i< this.oAgenda.members.length; i++){this.oItem.itemData.motion[0].members.push( {'id': this.oAgenda.members[i].id, 'firstName':this.oAgenda.members[i].firstName, 'lastName':this.oAgenda.members[i].lastName, 'eligible':null,'voted':null} ) }",
                      "paragraph":  submittedBy +'<br/><br/>' + oData[i].description,
                      "supportDocs": oDocs,
                      "distribution": laDistribution,
                      "email":oData[i].email,
                      "phone":oData[i].phone,
                      "scheduleDeadline": oData[i].schedule_dead_line,
                      "scheduleIndicator": oData[i].schedule_indicator,
                      "callForVote":"",
                      "motionCt":0,
                      "motion": [{"idx":0, "body":oData[i].motion_language,"maker":"", "second":"", "members":[] }]
                  }
              }
				//console.log(oItem)
                this.oAgenda.push(oItem)
            }
            //console.log(this.oAgenda)
        },
        (error) => {
          /* handle an error */
          console.log(error);
        },
      );
    },
	SaveImports(){
		          // convert json into text string



          // var target = JSON.stringify(Object.assign({}, this.store.state.oData.agenda))
           var target = JSON.stringify(Object.assign({}, this.oAgenda))
          // Convert the text string to BLOB.
          const textToBLOB = new Blob([target], { type: 'text/plain' });
          // set the output fileName to save
          const sFileName = 'AgendaRequestImports_' + this.$moment().format('YYYYMMDD_hhMM-SS')  +'.json';
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
		  this.displayMessage = 'Imports Saved: ' + sFileName
		setTimeout(() => {this.displayMessage=null}, 5000);
	},


}, // end methods
}
</script>

<style lang="scss">
.importRequests{
  display:flex;
  flex-direction: column;
  align-items: center;
}
.importRequests .navBar{
  flex-direction: row;
  justify-content: center;
  height:40px;
}
.arInstruct{
	margin:10px;
	width:600px;
}
.importListItem{
	margin:5px;
}
.importListItemAlt{
	margin:5px;
	background-color:rgba(0, 0, 0, 0.1);
}
.importSaveContainer{
  display:flex;
  justify-content: center;
  width:100vw;
  margin-top:15px;
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
</style>