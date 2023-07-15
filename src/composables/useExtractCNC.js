
import { v4 as uuidv4 } from "uuid";
import { inject, ref } from "vue";
import store from "@/store";
import VuePapaParse from 'vue-papa-parse'


const useExtractCNC = (oEvent) => {
// export default function useExtractCNC(oEvent){
    //const oItem = ref(oData)

        

    const ExtractCNC = (oEvent) =>{

       
        const setup = () => {
        const store = inject("store");

        return{
            store
        }
        }
        // file passed in handler event
        var file = oEvent.target.files
        if (!file.length) return
        // expose oDummy and oAgenda for use within the promise
        
    console.log(this)
       
        
    let oAgenda = this.store.state.oData.agenda

   
        // const {$papa} = VuePapaParse()

        // this.oDummy = this.oData.agenda
        // this.oAgenda = this.oData.agenda
        extractCNC(file[0])

        this.$papa.parse(ths.fileinput)


        console.log('Agenda Requests Imported')

        // convert csv to json

        // extract target NC (venice)

        // append to agenda
   }

    const extractCNC = (file) => {
       console.log(this)

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
            // return

            console.log(csvImport)

            // jsonData = $papa.parse(csvImport)
            // console.log(jsonData)
    return

//                let papaConfig = {
//                     delimiter: "",	// auto-detect
//                     newline: "",	// auto-detect
//                     quoteChar: '"',
//                     escapeChar: '"',
//                     header: true,
//                     transformHeader: undefined,
//                     dynamicTyping: false,
//                     preview: 0,
//                     encoding: "",
//                     worker: false,
//                     comments: false,
//                     step: undefined,
//                     complete: undefined,
//                     error: undefined,
//                     download: false,
//                     downloadRequestHeaders: undefined,
//                     downloadRequestBody: undefined,
//                     skipEmptyLines: false,
//                     chunk: undefined,
//                     chunkSize: undefined,
//                     fastMode: undefined,
//                     beforeFirstChunk: undefined,
//                     withCredentials: undefined,
//                     transform: undefined,
//                     delimitersToGuess: [',', '\t', '|', ';']
//                }

// console.log(this)
// console.log(this.$papa)

//                var oJson = this.$papa.parse( oData, papaConfig )

//, Papa.RECORD_SEP, Papa.UNIT_SEP

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
   }

   return {
       ExtractCNC
   }

}

export default useExtractCNC