

import { reactive, ref, inject } from 'vue'
import { v4 as uuidv4 } from "uuid"
import defaults from '../store/defaults.json'
import SaveMinutes from '../composables/SaveMinutes'

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import router from '@/router'

const addItemRefs = reactive([])

const state = reactive({
     name:"state",
     //  self :this,
     // voterReset:false,
     isPrint:false,
     showDelBtn:false,
     showTimerBtn:false,
     currentState: 0,
     addBtn:{},
     fmtOpt:{},
     meetingEndTime:"",
     // added defaults and ncDescription 6/2023
     defaults:defaults,
     oData: { "agenda": {}, "members": {}, "committees": {}, "templates": {}, "ncDescription": {} },
     isQuorum: 'background-color:gray;',

     test1: () => {
          // this is isolated and not exposed in this scope
          console.log(this)
     },
     test2() {
          // this is exposed in this scope
          console.log(this)
     },
     // setup(){
     //      console.log('index fired once')
     //      console.log(this.defaults)
     //      //this.defaults = this.$defaults
     // },
     methods:{

          // method(){
          //      console.log('fired once')
          //      return this.defaults = this.$defaults
          // }
     },

     LoadDefaults() {
          let tData = JSON.parse(JSON.stringify(this.defaults))
          this.oData.agenda = tData.agenda
          this.oData.members = tData.ncMembers
          this.oData.committees = tData.ncCommittees
          this.oData.templates = tData.templateFormats
          this.oData.subareas = tData.ncSubAreas
          this.oData.meetingTypes = tData.meetingTypes
          //this.oData.twcCommittees = tData.twcCommittees
          // added ncDescription 6/2023
          this.oData.ncDescription = tData.ncDescription
          if (this.oData.agenda.members.length == 0) {
               // set the committee members into the agenda
               // ToDo:change this to a dropdown of committees
               // 0 = assume board of directors
               let tCommittee = 0
               for(var i=0; i<this.oData.committees.length; i++){
                    if(this.oData.committees[i].id==1){
                         tCommittee = i
                         break
                    }
               }
               let initTime = { "init": new Date() } // JSON.stringify({'in': new Date()})
               for (var i = 0; i < this.oData.committees[tCommittee].members.length; i++) {
                    for(var j=0; j< this.oData.members.length; j++){
                         if(this.oData.committees[tCommittee].members[i]==this.oData.members[j].id){
                              let fName = this.oData.members[j].firstName
                              let lName = this.oData.members[j].lastName
                              this.oData.agenda.members.push({ "id": this.oData.members[j].id, "firstName": fName, "lastName": lName, "eligible": false, "attendance": [initTime] })
                              break
                         }
                    }
               }
          }
          console.log(this.oData)
          console.log(this.defaults)
     },

     LoadAgenda(oEvent) {
          // hidden input type=file click exent lands here

          var file = oEvent.target.files
          if (!file.length) return
          this.oDummy = this.oData.agenda
          this.createInput(file[0])
          // proxy not available until after return
     },
     createInput(file) {
          var vm = this;
          let promise = new Promise((resolve, reject) => {
               var reader = new FileReader();

               reader.onload = e => {
                    resolve((vm.fileinput = reader.result));
               };
               reader.readAsText(file);
          });
          promise.then(
               result => {
                    /* handle a successful result */
                    //console.log(this.fileinput);
                    var oFileInput = JSON.parse(this.fileinput)
                    //this.oDummy = reactive(this.oFileInput) // this did not work, the main loop does not update
                    // this.oDummy.agenda = reactive(this.oFileInput.agenda)
                    this.oDummy.agenda = this.oAgenda
                    //console.log('promised completed')

                    // maintain reactive state of properties
                    var aProperties = Object.getOwnPropertyNames(this.oData.agenda)
                    for (var i = 0; i < aProperties.length; i++) {
                         // prevent processing arrays till later
                         var cSource = 'oFileInput.' + aProperties[i]
                         if (Object.prototype.toString.call(eval(cSource)) === '[object Array]') {
                              continue
                         }
                         var cTarget = 'vm.oData.agenda.' + aProperties[i]
                         var lcCmd = cTarget + ' = ' + cSource
                         let vm = this
                         try {
                              // assume default file format and test field compatibility
                              eval(lcCmd)
                         } catch {
                              alert('invalid file, where: ' + lcCmd)
                         }
                    }
                    // sort agendaItems by index number
                    if(oFileInput.agendaItems.length>1){

                         //oFileInput.agendaItems.sort(Function.prototype.call.bind(String.prototype.localeCompare))

                         //oFileInput.agendaItems.sort((a, b) => a.itemIndex.localeCompare(b.itemIndex))

                         // oFileInput.agendaItems.sort((a,b) => (a.itemIndex > b.itemIndex) ? 1 : ((b.itemIndex > a.itemIndex) ? -1 : 0))
                         oFileInput.agendaItems.sort((a,b) => (parseFloat( a.itemIndex) > parseFloat(b.itemIndex) ) ? 1 : (( parseFloat(b.itemIndex) > parseFloat(a.itemIndex) ) ? -1 : 0))

                         console.log('items sorted')
                    }

                    // now apply process to arrays

                    // the array joint committee must be pushed now
                    this.oData.agenda.joint = reactive([])
                    for (var i = 0; i < oFileInput.joint.length; i++) {
                         this.oData.agenda.joint.push(oFileInput.joint[i])
                    }

                    // the array must be pushed to force update
                    this.oData.agenda.agendaItems = reactive([])
                    for (var i = 0; i < oFileInput.agendaItems.length; i++) {
                         this.oData.agenda.agendaItems.push(oFileInput.agendaItems[i])
                    }

                    // this members must be pushed to force the update
                    let tCommittee = 0
                    let initTime = { "load": new Date() } // JSON.stringify({'in': new Date()})
                    this.oData.agenda.members = []
                    for (var i = 0; i < oFileInput.members.length; i++) {
                         this.oData.agenda.members.push(oFileInput.members[i])
                    }
                    // // calculate quorum
                    // if(this.oData.agenda.eligible >= Math.ceil(this.oData.agenda.members.length/2)){
                    //      this.store.state.isQuorum = 'background-color:green;'
                    //  } else {
                    //      this.store.state.isQuorum = 'background-color:gray;'
                    //  }
                    console.log('agenda loaded')
               },
               error => {
                    /* handle an error */
                    console.log(error);
               }
          );
     },

     // SaveAgenda() {
     //      // convert json into text string

     //      let lcCommittee=this.oData.agenda.body

     //      var target = JSON.stringify(Object.assign({}, this.oData.agenda))
     //      // Convert the text string to BLOB.
     //      const textToBLOB = new Blob([target], { type: 'text/plain' });
     //      // set the output fileName to save
     //      const sFileName = 'Agenda_' + lcCommittee +'_' + this.$moment().format('MM/dd/YYYY-HH:MM:SS')  +'.json';
     //      // create a dummy anchor element
     //      let oTempAnchor = document.createElement("a");
     //      oTempAnchor.download = sFileName;
     //      if (window.webkitURL != null) {
     //           oTempAnchor.href = window.webkitURL.createObjectURL(textToBLOB);
     //      }
     //      else {
     //           oTempAnchor.href = window.URL.createObjectURL(textToBLOB);
     //           oTempAnchor.style.display = "none";
     //           document.body.appendChild(oTempAnchor);
     //      }
     //      // invoke the click event on the anchor element to write the file
     //      oTempAnchor.click();
     //      // end save file
     //      console.log('agenda saved')
     // },

     LoadMembers() {
          this.agenda.test++

          console.log('members loaded')
     },
     SaveMembers() {

          console.log('members saved')
     },
     LoadTemplates() {
          this.agenda.test++

          console.log('templated loaded')
     },
     SaveTemplates() {

          console.log('templates saved')
     },

     ImportAgendaRequests(oEvent) {
          // assume agenda with dependicies is loaded
          // setup next item number
          let nLastIndex = 0
          for (var i = 0; i < this.oData.agenda.agendaItems.length; i++) {
            if (nLastIndex < this.oData.agenda.agendaItems[i].itemIndex) {
              nLastIndex = this.oData.agenda.agendaItems[i].itemIndex;
            }
          }
          let callToOrder=false
          let rollCallTemplate=false
          // console.log(this.oData.agenda)
          if(this.oData.agenda.agendaItems){
               for(var i=0; i<this.oData.agenda.agendaItems.length; i++){
                    if(this.oData.agenda.agendaItems[i].itemFmt==2){
                         callToOrder=true
                    }
                    if(this.oData.agenda.agendaItems[i].itemFmt==3){
                         rollCallTemplate=true
                    }
               }
          }
          if(!callToOrder){
               for (var i = 0; i < this.oData.templates.length; i++) {
                    if (this.oData.templates[i].itemFmt === 2) {
                    //console.log(this.oData.templateFormats[this.data.selectedFormat])
                    // create a deep copy
                    this.oItem = JSON.parse(JSON.stringify(this.oData.templates[i]));
                    break;
                    }
               }
               this.oItem.guid = uuidv4();
               // increment itemIndex higher than last item
               nLastIndex = ++nLastIndex
               this.oItem.itemIndex = nLastIndex
               if (this.oItem.itemData.init.length) {
                    // execuite initialize
                    try {
                         //console.log(this.oItem.itemData.init);
                         eval(this.oItem.itemData.init);
                         //console.log("init completed");
                    } catch {
                         console.log("init failed");
                    }
               }
               // append item to array of items
               this.oData.agenda.agendaItems.push(this.oItem)
          }
          if(!rollCallTemplate){
               for (var i = 0; i < this.oData.templates.length; i++) {
                    if (this.oData.templates[i].itemFmt == "3") {
                    //console.log(this.oData.templateFormats[this.data.selectedFormat])
                    // create a deep copy
                    this.oItem = JSON.parse(JSON.stringify(this.oData.templates[i]));
                    break;
                    }
               }
               this.oItem.guid = uuidv4();
               // increment itemIndex higher than last item
               nLastIndex = ++nLastIndex
               this.oItem.itemIndex = nLastIndex++
               if (this.oItem.itemData.init.length) {
                    // execuite initialize
                    try {
                         //console.log(this.oItem.itemData.init);
                         eval(this.oItem.itemData.init);
                         //console.log("init completed");
                    } catch {
                         console.log("init failed");
                    }
               }
               // append item to array of items
               this.oData.agenda.agendaItems.push(this.oItem)
          }
          // agenda now exists, test for dependancies
          // open selected file

          // test for valid json format
          //
          //
          //
          //
          //
          //
          var file = oEvent.target.files
          if (!file.length) return
          // expose oDummy and oAgenda for use within the promise
          this.oDummy = this.oData.agenda
          this.oAgenda = this.oData.agenda
          this.importAR(file[0])
          console.log('Agenda Requests Imported')
     },
     importAR(file) {
          // localize this scope
          let vm = this
          var nLastIndex = 0;
          for (var i = 0; i < this.oData.agenda.agendaItems.length; i++) {
               if (nLastIndex < this.oData.agenda.agendaItems[i].itemIndex) {
               nLastIndex = this.oData.agenda.agendaItems[i].itemIndex;
               }
          }
          let promise = new Promise((resolve, reject) => {
            var reader = new FileReader();
            //var vm = this;
            reader.onload = e => {
              resolve((vm.fileinput = reader.result));
            };
            reader.readAsText(file);
          });
          promise.then( result => {
              // handle a successful result
              //console.log(this.fileinput);
              var oData = JSON.parse(this.fileinput)
              console.log(oData)
               //this.oDummy.agenda = this.oAgenda
               for(var i=0; i<oData.length; i++){
                    // rewrite after webcorner adds submitted by
                    //     for(var j=0; j< this.state.store.oData.twcCommittees.length; j++){
                    //         if(oData[i].committee== this.state.store.oData.twcCommittees[j].id){
                    //             submittedBy=this.state.store.oData.twcCommittees[j].committee
                    //             break
                    //         }
                    //     }

                    var submittedBy = oData[i].first_name +' '+ oData[i].last_name
                    nLastIndex= ++nLastIndex
                    this.oItem = {
                        "itemIndex": nLastIndex,
                        "itemFmt": 6,
                        "itemFmtName":"Title/Discussion/Motion",
                        "guid":uuidv4(),
                        "maxCt":0,
                        "dependsOn":[2,3],
                        "title": oData[i].title +' By: '+ submittedBy,
                        "time": 0,
                        "itemData": {
                            "init":"for(var i=0; i< this.oAgenda.members.length; i++){this.oItem.itemData.motion[0].members.push( {'id': this.oAgenda.members[i].id, 'firstName':this.oAgenda.members[i].firstName, 'lastName':this.oAgenda.members[i].lastName, 'eligible':null,'voted':null} ) }",
                            "paragraph": oData[i].description +'<br/><b>Dated:</b> '+ oData[i].meeting_date +'<b>Vote: '+ oData[i].vote_count,
                            "distribution": ["Secratary@VeniceNC.org"],
                            "callForVote":"",
                            "motionCt":0,
                            "motion": [{"idx":0, "body":"","maker":"", "second":"", "members":[] }]
                        }
                    }
                    // execute the init
                    if (this.oItem.itemData.init) {
                         //setup for initialization
                         // eval() scope does not reconize "this"
                         let regX = /this/gi;
                         let cmd = this.oItem.itemData.init.replace(regX, 'vm');
                         //console.log(cmd);
                         // execuite initialization
                         try {
                              eval(cmd)
                              // console.log("init completed");
                         } catch {
                              console.log("init failed");
                         }
                    }
                    // console.log(this.oItem)
                    this.oDummy.agendaItems.push(this.oItem)
               }
          },
          error => {
               /* handle an error */
               console.log(error);
          })
     },



}) // end of state

const methods = {

     testMe(){
          console.log(state)
          console.log(addItemRefs)

     },

     restrictAddingItems(vm){
          // restrict the occurance of items on agenda
          // console.log(vm)
          // console.log(addItemRefs)
          if(!vm.oAgenda.agendaItems){return}
          for(var ii=0; ii< vm.oAgenda.agendaItems.length; ii++){
               let oItem=vm.oAgenda.agendaItems[ii]
               let useCt = 0;
               if (oItem.maxCt != 0) {
                    // does template exist on agenda
                    for (var i = 0; i < vm.oAgenda.agendaItems.length; i++) {
                         //console.log('agenda item format:' + vm.oAgenda.agendaItems[i].itemFmt);
                         if (vm.oAgenda.agendaItems[i].itemFmt == oItem.itemFmt) {
                              useCt++;
                         }
                    }
                    //console.log('item format useCt:' + useCt)
                    if( useCt >= oItem.maxCt){
                         //console.log('useCt >= item maxCt: true')
                         // lookup addFormat option and disaable
                         for(var j=0; j< addItemRefs.length; j++){
                              if(addItemRefs[j].value == oItem.itemFmt){
                                   //console.log('disable addItemRefs:' +oItem.itemFmt)
                                   addItemRefs[j].disabled = true
                                   if(state.fmtOpt.value == oItem.itemFmt){
                                        // disable the add button
                                        state.btnAdd.disabled = true
                                   }
                              }
                         }
                    }
               }
               //console.log('finished item:' +ii)
          }
          //console.log('completed disable addItemRefs')
          return true
     },

     SortAgendaItems(){
          if(state.oData.agenda.agendaItems.length>1){
          state.oData.agenda.agendaItems.sort((a, b) => parseFloat(a.itemIndex) - parseFloat(b.itemIndex) )
          console.log('agenda sorted')
          }
     },
     RenumberAgendaItems(){

          for(var i=0; i<state.oData.agenda.agendaItems.length; i++){
               state.oData.agenda.agendaItems[i].itemIndex =  (i+1).toString()
          }
     },
     TextAreaAdjust(element) {
          element.style.height = "1px"
          element.style.height = (16 + element.scrollHeight)+"px"
     },

     updateTimeClock(_this,btnRef,oItem){

          let currentTime = _this.$moment().toISOString()

          if(_this.$refs.timeClock.style.borderColor=='' || _this.$refs.timeClock.style.borderColor=='red' ){
               let tcImg = 'time-lineFillGreen.svg'
               _this.$refs.timeClockImg.src = require(`../assets/${tcImg}`)
               _this.$refs.timeClock.style.borderColor='green'
               oItem.timeStart = currentTime
          } else if(_this.$refs.timeClock.style.borderColor=='green'){
               let tcImg = 'time-lineFillRed.svg'
               _this.$refs.timeClockImg.src = require(`../assets/${tcImg}`)
               _this.$refs.timeClock.style.borderColor='red'
               //_this.$refs.itemTimeDiv.style.display='none'
               oItem.timeEnd = currentTime
               // now save minutes a temp version
               SaveMinutes(_this,'temp')
          }
          let newEndTime = 0
          for(var i=0; i<_this.store.state.oData.agenda.agendaItems.length; i++){
               if(typeof _this.store.state.oData.agenda.agendaItems[i].timeEnd.length>0){
                    console.log(state.oData.agenda.agendaItems[i])
                    continue
               }
               if( isNaN(parseInt(_this.store.state.oData.agenda.agendaItems[i].duration)) ){
                    continue
               }
               newEndTime = newEndTime + parseInt( _this.store.state.oData.agenda.agendaItems[i].duration )
          }
          _this.store.state.meetingEndTime = _this.$moment().add(newEndTime,'minutes').format()
          console.log('timeClockUpdated')
      },

     initMeetingEndTime(_this){
          let oAgenda = _this.store.state.oData.agenda
          let sumMinutes = 0
          for(var i=0; i<oAgenda.agendaItems.length; i++){
               if(isNaN(parseInt(oAgenda.agendaItems[i].duration))){
                    continue
               }
               sumMinutes = sumMinutes + parseInt(oAgenda.agendaItems[i].duration)
          }
          _this.store.state.meetingEndTime = _this.$moment(oAgenda.scheduled).add(sumMinutes,'minutes').format()
          console.log('Projected End Time:' + _this.store.state.meetingEndTime)
     },
     decodeCaseNo(caseNo){
          // caseNo: 'DIR-2021-10506-CDP-MEL-SPP-SPPA'





     },
     stripHTML(value) {
          const div = document.createElement('div')
          div.innerHTML = value
          const text = div.textContent || div.innerText || ''
          return text
        }
     // end of methods
}

export default {
     setup() {
          const store = inject("store")
          //store.state.defaults = this.$defaults
          return { store }
     },
     state,
     methods,
     addItemRefs,
     // methods:(

     // )
}

//  SaveData(){

//      // save the ucrrent agenda seems to be another issue of exposing store with store ... here!


//           let newLink = {}
//           const saveFile = (loData) =>{
//                // start save file
//                // extract data from Proxy and convert into text string
//                var target = JSON.stringify(Object.assign({},loData))
//                // Convert the text string to BLOB.
//                const textToBLOB=  new Blob([target], { type: 'text/plain' });
//                // set the output fileName to save
//                const sFileName = 'Agenda.json';
//                // create a dummy anchor element
//                newLink = document.createElement("a");
//                newLink.download = sFileName;
//                if (window.webkitURL != null) {
//                     newLink.href = window.webkitURL.createObjectURL(textToBLOB);
//                }
//                else {
//                     newLink.href = window.URL.createObjectURL(textToBLOB);
//                     newLink.style.display = "none";
//                     document.body.appendChild(newLink);
//                }
//                // invoke the click event on the anchor element to write the file
//                     newLink.click();
//                // end save file
//           }
//           return { saveFile }
//           }