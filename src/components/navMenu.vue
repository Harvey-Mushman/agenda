<template>
  <div class="nav">
    <div>
      <button class="btnAdd" @click="addItem" ref="btnAdd" :disabled="true==false">Add</button>
      <span>Item:</span>
      <select
        class="formatCbo"
        v-model="selectedFormat"
        ref="fmtOpt"
        @change="selectedFormatChanged"
      >
        <option ref="optX" disabled value="">Select Format</option>
        <option
          v-for="(fmt, index) in this.oTemplates"
          :key="fmt.itemFmt"
          :value="fmt.itemFmt"
          :ref="'opt' + index"
        >
          {{ fmt.itemFmtName }}
        </option>
      </select>

    </div>
    <div>
      <!-- code activated hidden elements  -->
      <input class="btnFileLoad" type="file" ref="oFileHandler" @change="store.state.LoadAgenda($event)" />
      <input class="btnFileLoad" type="file" ref="oFileHandlerItems" @change="ImportAgendaItems($event)" />
      <!-- <input class="btnFileLoad" type="file" ref="oFileHandlerCNC" @change="store.state.ExtractCNC($event)" /> -->


      <!-- exposied menu choises -->
      <button class="btnNav btnLoad" @click="fileLoad()">Load</button>
      <button class="btnNav btnSort" @click="store.methods.SortAgendaItems">Sort</button>
      <button class="btnNav btnRenumber" @click="store.methods.RenumberAgendaItems">Renumber</button>
      <button class="btnNav btnImport" @click="importItems">Import Items</button>
      <!-- <button class="btnNav btnImport" @click="testMe">Prior Minutes</button> -->
      <button class="btnNav btnSave" @click="saveFile()">Save</button>
    </div>
    <div>
      <router-link to="/"><button class="btnHome btnNav">Home</button></router-link>
    </div>
  </div>
</template>
<script>
import { v4 as uuidv4 } from "uuid";
import { inject, ref, reactive } from "vue";
import SaveAgenda from '../composables/SaveAgenda'
//import loadFile from '../composables/loadFile'



// import VuePapaParse from 'vue-papa-parse'

export default {
  name: "navMenu",
  setup() {
    const store = inject("store");
    const hiddenFileElement = ref({})
        return { 
          store,
          hiddenFileElement
        }

  },
  data() {
    let oAgenda = this.store.state.oData.agenda;
    let oMembers = this.store.state.oData.members;
    let oTemplates = this.store.state.oData.templates;
	const oAgendaItems = ref([])
    return {
      oAgenda,
      oMembers,
      oTemplates,
      selectedFormat: "",
      fileinput: "",
      oDummy: {},
	  oAgendaItems,
    };
  },
  mounted() {
    // global expose the addItem options
    console.log(this.store)
    //this.store.addItemRefs = [];
    for (var i = 0; i < this.oTemplates.length; i++) {
      //let x = 'opt'.concat(i)
      let y = "this.$refs.opt".concat(i);
      let z = eval(y);
      //var a = { [x] : z}
      this.store.addItemRefs.push(z);
    }
    this.store.addItemRefs.push(this.$refs.optX);
    //console.log(this.store.addItemRefs);
  },
  methods: {
    selectedFormatChanged() {
      //  let opt = this.$refs.fmtOpt
       this.store.state.fmtOpt = this.$refs.fmtOpt
       this.store.state.btnAdd = this.$refs.btnAdd
      // console.log('selected format changed')

      // selected option not disabled
      this.$refs.btnAdd.disabled = false;
    },

    addItem() {
      // trap unselected format error
      if (this.selectedFormat === "") {
        alert("invalid selection, try again");
        return false;
      }
      // get the data format for selected item
      //var oItem = null
      for (var i = 0; i < this.oTemplates.length; i++) {
        if (this.oTemplates[i].itemFmt === this.selectedFormat) {
          //console.log(this.oData.templateFormats[this.data.selectedFormat])
          // create a deep copy
          this.oItem = JSON.parse(JSON.stringify(this.oTemplates[i]));
          break;
        }
      }
      
      // does new item require dependencies
      for (var i = 0; i < this.oItem.dependsOn.length; i++) {
        let depend = this.oItem.dependsOn[i];
        // do dependencies exist on agenda
        let found = false;
        for (var j = 0; j < this.oAgenda.agendaItems.length; j++) {
          // does match equal dependent
          if (this.oAgenda.agendaItems[j].itemFmt == this.oItem.dependsOn[i]) {
            found = true;
          }
        }
        if (!found) {
          // todo: make a text message list of missing dependices
          alert("dependencies required (" + this.oItem.dependsOn + ")");
          return;
        }
      }

      // restrict the occurance of items on agenda
      // to limit the MaxCt of items that can only be
      // aded a limited number of times
      this.store.methods.restrictAddingItems(this)

      // here is the old restriction code
      // the following code was moved into index.js so it could be called after LoadAgenda()
      // if (this.oItem.maxCt != 0) {
      //   // does template exist on agenda
      //   let useCt = 0;
      //   for (var i = 0; i < this.oAgenda.agendaItems.length; i++) {
      //     console.log(i);
      //     if (this.oAgenda.agendaItems[i].itemFmt == this.oItem.itemFmt) {
      //       useCt++;
      //     }
      //   }
      //   if (useCt < this.oItem.maxCt) {
      //     if (useCt + 1 == this.oItem.maxCt) {
      //       let selectedOption = this.$refs.fmtOpt.value;
      //       selectedOption--;
      //       let oOpt = eval("this.$refs.opt" + selectedOption);
      //       oOpt.disabled = true;
      //       // console.log(oOpt)
      //       // console.log('option disabled')
      //       this.$refs.btnAdd.disabled = true;
      //     }

      //     // usect < maxct
      //     // append item
      //     // test is useCt + 1 = maxct
      //     // if yes, disable option

      //     // if (useCt > this.oItem.maxCt) {
      //     // }
      //   }
      // }

      // assign unique index to item
      // oItem.itemIndex=this.data.agenda.agendaItems.length
      // all items must be unique
      this.oItem.guid = uuidv4();
      // item key index number must be increamented
      var nLastIndex = 0;
      for (var i = 0; i < this.oAgenda.agendaItems.length; i++) {
        if (nLastIndex < this.oAgenda.agendaItems[i].itemIndex) {
          nLastIndex = this.oAgenda.agendaItems[i].itemIndex;
        }
      }
      // increment itemIndex higher than last item
      this.oItem.itemIndex = nLastIndex + 1;

      if (this.oItem.itemData.init.length) {
        // execuite initialize
        try {
          //console.log(this.oItem.itemData.init);
          eval(this.oItem.itemData.init);
          console.log("init completed");
        } catch {
          console.log("init failed");
        }
      }

      // for(var i=0; i< this.oMembers.length; i++){this.oItem.itemData.members.push( this.oMembers[i]) }

      // append item to array of items
      this.oAgenda.agendaItems.push(this.oItem);
      // console.log(this.store.agenda.agendaItems[this.store.agenda.agendaItems.length -1]);
    },
    saveFile() {
		SaveAgenda(this)
	  //this.store.state.SaveAgenda();
      console.log("agenda saved");
    },
    // load local file
    fileLoad() {
      this.hiddenFileElement = this.$refs.oFileHandler;
      // this.store.state.voterReset = true
      this.hiddenFileElement.click();
    },

    importItems() {
      this.hiddenFileElement = this.$refs.oFileHandlerItems;
      // always reset the value to allow same file to be reopened
      this.hiddenFileElement.value=''
      this.hiddenFileElement.click();
    },

     ImportAgendaItems(oEvent) {
          // assume agenda with dependicies is loaded
          // what if any items exist
          let nLastIndex = 0
          for (var i = 0; i < this.oData.agenda.agendaItems.length; i++) {
            if (nLastIndex < this.oData.agenda.agendaItems[i].itemIndex) {
              nLastIndex = this.oData.agenda.agendaItems[i].itemIndex;
            }
          }

          var file = oEvent.target.files
          if (!file.length) return
          // expose oDummy and oAgenda for use within the promise
          this.oDummy = this.oData.agenda
          this.oAgenda = this.oData.agenda
          this.importFile(file[0])
     },

	importFile(file){
			// localize this scope
			let vm = this
			this.oAgendaItems=[]
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
					let oItems = JSON.parse(this.fileinput)
					// convert objects into array
					// but only agenda tiems (trap import of agenda)
					for (var key in oItems) {
						var obj = oItems[key];
						//console.log(obj)
						if(typeof obj=='string'){
							// assume this is an agenda import, not interested in header strings
						//console.log('string: ' + obj)
						continue
						}
						// importing cncItems and Agenda Request items as objects
						if(typeof obj=='object' && !Array.isArray(obj)){
							let oJson = JSON.parse(JSON.stringify(obj))
							this.oAgendaItems.push(oJson)
							continue
						}
						// importing existing agenda, must strip out all but agenda items
						if(Array.isArray(obj)){
							for(var i=0; i<obj.length; i++){
								if(obj[i].hasOwnProperty('itemIndex')){
									let oJson = JSON.parse(JSON.stringify(obj[i]))
									this.oAgendaItems.push(oJson)
								}
							}
						}
					}
					console.log('imported items: ' + this.oAgendaItems.length)
					this.AppendImportedItems()
					console.log('processing completed')
			},
			error => {
				/* handle an error */
				console.log(error);
			})
	},

	AppendImportedItems(){

    // assuming at this point only oAgenda.agendaItems exist in array
		// motions require dependencies
		console.log(this.oAgendaItems)

		// what import item dependencies are required
		let foundItemTemplates=[]
		for(var i=0; i<this.oAgendaItems.length; i++){
			// motions formats require member init to vote
			// what items formats exist on loaded agenda
			// are required dependencies for import items included
			// currently only templates 6 and 7 have voting
			let formatWithDependancies = [6,7]
			let found = formatWithDependancies.find(element => element == this.oAgendaItems[i].itemFmt)
			switch(found){
				case 6:
					if(undefined == foundItemTemplates.find(element => element == 6)){
						foundItemTemplates.push(6)
					}
					break
				case 7:
					if(undefined == foundItemTemplates.find(element => element == 7)){
						foundItemTemplates.push(7)
					}				
					break
			}
		}
		console.log('existing templates: ' + foundItemTemplates)

		// what is the last itemIndex number
		let nLastIndex=0
		for(var i=0; i<this.store.state.oData.agenda.agendaItems.length; i++){
			if(this.store.state.oData.agenda.agendaItems[i].itemIndex>nLastIndex){
				nLastIndex = this.store.state.oData.agenda.agendaItems[i].itemIndex
			}
		}
		console.log('last index: ' + nLastIndex)

		// based on templates imported, find template dependancies
		const requiredDependancines = []
		for(var j=0; j<foundItemTemplates.length; j++){
			// lookup item templates
			for(var i=0; i<this.oTemplates.length; i++){
				if(this.oTemplates[i].itemFmt == foundItemTemplates[j]){
					// append to the list of required dependencies if not existing
					for(var k=0; k<this.oTemplates[i].dependsOn.length; k++){
						if(undefined == requiredDependancines.find(element => element == this.oTemplates[i].dependsOn[k])){
							requiredDependancines.push(this.oTemplates[i].dependsOn[k])
						}
					}
					break
				}
			}
		}
		console.log('dependency required templates: ' + requiredDependancines)
		// self used to scope eval() later in process
		let self = this

		// redefine members to match the agenda members
		let idFilter=[]
		for(var i=0; i<this.store.state.oData.committees.length; i++){
			if(this.store.state.oData.committees[i].name==this.store.state.oData.agenda.body){
				let bodyId = this.store.state.oData.committees[i].id
				idFilter = this.store.state.oData.committees[i].members
				break
			}
		}
		let result = this.oMembers.filter(member => idFilter.includes(member.id) )
		// reassign result to oMembers to expose within eval( init ) below
		this.oMembers = result

		// never import templates that are agenda specific
		// where 1=introduction, 2=call to order, 3=roll call, 8=closing
		if(requiredDependancines){
			for(var i=0; i<requiredDependancines.length; i++){
				// does requiredDependancines exist on agenda
				let isTemplate=false
				for(var j=0; j<this.store.state.oData.agenda.agendaItems.length; j++){
					if(this.store.state.oData.agenda.agendaItems[j].itemFmt==requiredDependancines[i]){
						isTemplate = true
					}
				}
				if(!isTemplate){
					// add template to agenda
					for(var k=0; k<this.oTemplates.length; k++){
						if(this.oTemplates[k].itemFmt==requiredDependancines[i]){
							// deep copy temmplate item
							this.oItem = JSON.parse(JSON.stringify(this.oTemplates[k]))
							//assign item number one greater than prior item
							this.oItem.itemIndex = ++nLastIndex
							this.oItem.guid = uuidv4()
							// execute the init
							if (this.oItem.itemData.init) {
								//setup for initialization
								// eval() scope does not reconize "this"
								let regX = /this/gi;
								let cmd = this.oItem.itemData.init.replace(regX, 'self');
								//console.log(cmd);  
								// execuite initialization
								try {
									eval(cmd)
									// console.log("init completed");
								} catch {
									console.log("init failed");
								}
							}
							console.log(this.oItem)
							this.store.state.oData.agenda.agendaItems.push(this.oItem)
							break
						}

					}
				}
			}
		}

		// append the imported items to the agenda
		for(var i=0; i<this.oAgendaItems.length; i++){
			if(requiredDependancines.find(element => element == this.oAgendaItems[i].itemFmt) ){continue}
          // deep copy item
					this.oItem = JSON.parse(JSON.stringify(this.oAgendaItems[i]))
          console.log(this.oItem)
					//assign item number one greater than prior item
					this.oItem.itemIndex = ++nLastIndex
					this.oItem.guid = uuidv4()
					// execute the init
					if (this.oItem.itemData.init) {
						// init expects agenda as this.oAgenda
						this.oAgenda = this.store.state.oData.agenda
						//setup for initialization
            // prior motion(s) and member voting must be reset on import
            this.oItem.itemData.callForVote=''
            this.oItem.itemData.motionCt=0
            // what is the imported motion
            let motionBody = this.oItem.itemData.motion[0].body
            this.oItem.itemData.motion=[{"idx": 0,"body":motionBody,"maker": "","second": "","members": []}]
						// eval() scope does not reconize "this"
						let regX = /this/gi;
						let cmd = this.oItem.itemData.init.replace(regX, 'self');
						//console.log(cmd);  
						// execuite initialization
						try {
							eval(cmd)
							// console.log("init completed");
						} catch {
							console.log("init failed");
						}
					}
					console.log(this.oItem)
					this.store.state.oData.agenda.agendaItems.push(this.oItem)

		} // outside loop

	}, // end AppendImportItems()



	testMe2(){
		console.log(this)
	},



  } // close methods
} // close default exports
</script>