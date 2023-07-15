<template>
<div class="setupMeetingsPage">
	<div class="navBar">
		<router-link to="/"><button class="btn btnHome btnNav">Home</button></router-link>
	</div>
	<div class="setupMeetingContainer">
		<h1>Setup Meeting</h1>
		<p>
		The first step to setting up a new agenda is selecting the committee for which the agenda will serve.
		</p>
		<tplCommittees @onSaveAgenda="onSaveAgenda"></tplCommittees>
		<!-- <tplMembers></tplMembers> -->
		<h3 style="color:green;" class="blink_me" v-if="displayMessage != null">{{displayMessage}}</h3>
	</div>
</div>
</template>

<script>
import {provide, computed, ref} from 'vue'
import store from "@/store";
import tplCommittees from '../components/tplCommittees.vue'
import tplMembers from '../components/tplMembers.vue'

export default {
	name:"SetupMeeting",
	components: {tplCommittees, tplMembers},

  setup() {
    provide("store", store);
    //console.log(store)
	let displayMessage = ref(null)
    return { store, displayMessage }
  },
    data(){
        let oAgenda=this.store.state.oData.agenda
        let oMembers=this.store.state.oData.members
        let oTemplates=this.store.state.oData.templates
        let oCommittees=this.store.state.oData.ncCommittees

        return {

            oAgenda, oMembers, oTemplates, oCommittees
       }
    },

  beforeCreate(){
    console.log('app.vue before created')
    // load the default data members
    this.store.state.LoadDefaults()
    console.log('defaults loaded')

  },
methods:{

	onSaveAgenda(oPassed){
 		console.log(oPassed)
    // oPassed is the return from tmpCommittees where all properties are first defined
		var newAgenda = {
      "isAgenda":oPassed.isAgenda,
			"body": oPassed.body,
			"updated": oPassed.updated,
			"scheduled": oPassed.scheduled,
      "adjourned": "",
			"callToOrder":"",
			"location": oPassed.location,
			"title": oPassed.title,
			"members":oPassed.members,
			"joint":oPassed.joint,
			"inAttendance":0,
			"agendaItems": []
		}

	    // convert json into text string
          var target = JSON.stringify(Object.assign({}, newAgenda))
          // Convert the text string to BLOB.
          const textToBLOB = new Blob([target], { type: 'text/plain' });
          // set the output fileName to save
          const sFileName = 'Agenda_' + oPassed.shortName +'_' + this.$moment().format('YYYYMMDD-HHmmss')  +'.json';
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
          console.log('agenda saved')
        this.displayMessage = 'File saved as: ' + sFileName
		setTimeout(() => {this.displayMessage=null}, 5000);
	},

		testMe(){
			console.log(store)
		}

	}
}
</script>

<style lang="scss">
.blink_me {
  animation: blinker 1s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
.setupMeetingsPage p{
	width:400px;
	margin:15px
}
.setupMeetingContainer{
	margin-left:25px;
}
</style>

