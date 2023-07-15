<template>
  <div class="home">
	<!-- <userNav></userNav> -->
	<h1>Meeting Manager</h1>
	<div>
		<!-- <b>NC:</b>{{  this.store.defaults.ncDescription.ncName  }} -->
		<b>NC:</b><span v-if="defaultsMissing==false">{{  this.store.state.defaults.ncDescription.ncName  }}</span>
		<input class="btnFileLoad" type="file" ref="oFileHandler"  @change="loadRequests($event)" />
		<button v-if="defaultsMissing" class="btn btnNav btnLoad btnLg120" @click="fileLoad();resetFileUploader()">Import Defaults</button>
	</div>
    <ul>
		<br />
		<hr style="width:300px;">
		<br />
		<li><router-link to="/SetupMeeting">Setup Meeting</router-link></li>
		<li><router-link to="/CreateAgenda">Create Agenda</router-link></li>
		<li><router-link to="/PrintPreview">Print Preview</router-link></li>
		<li><router-link to="/RecordMinutes">Record Minutes</router-link></li>
		<br />
		<hr style="width:300px;">
		<br />

		<li><router-link to="/ImportRequests">Import Agenda Requests</router-link> (JSON Format)</li>
		<li><router-link to="/ExtractCNC">Import CNC Report</router-link> (Early Notification CSV Format)</li>
		<br />
		<hr style="width:300px;">
		<br />
		<li><router-link to="/ExportAgendaToCSV">Export Agenda Motions to CSV</router-link></li>
		<br />
		<hr style="width:300px;">
		<br />
		<li><router-link to="/Membership">Configuration</router-link></li>
		<br />
		<hr style="width:300px;">
		<br />
		<h3>Tools</h3>
		<router-link class="hyperLink" to="/Countdown" target="_blank">Countdown Time Clock</router-link>
		<!-- <router-link :to="{ name: 'fooRoute',params:{param_var:'id_parameter'},query:{query_var:'query_params'}}" target="_blank"> Link Text </router-link> -->
		<br />		<br />
		<hr style="width:300px;">
		<br />
		<li><router-link to="/About">About</router-link></li>
	</ul>
  </div>
</template>
<script>
	//import userNav from '@/components/userNav'
// added next 2 lines 6/2023
	import {provide, ref, reactive, onMounted } from 'vue'
	import store from "@/store"

	import { toast } from 'vue3-toastify';
	import 'vue3-toastify/dist/index.css';

	export default {
		name:"home",
	 	// setup method added 6/2023
		setup() {
			provide("store", store);
			const hiddenFileElement = ref({})
			console.log(store.state)
			return { store, hiddenFileElement }
		},
		data() {
			let fileInput=""
			let oDummy=ref([])
			let defaultsMissing = true
				return {
					fileInput,
					oDummy,
					defaultsMissing,
				};
		},
		beforeCreate(){
			// console.log(this.store.state.defaults)
		},
		mounted() {
			//console.log('mounted app')
			this.$nextTick(function () {
			// Code that will run only after the
			// entire view has been rendered
			// 6/2023 now testing for NC name
			// console.log(this.store.state.defaults)
			if ((this.store.state.defaults.ncDescription.ncName.length==0 || this.store.state.defaults.ncDescription.ncName=='undefined')){
				// if (this.store.defaults.ncDescription.ncName.length==0){
				this.defaultsMissing = true
				console.log('Cannot proceed without NC defaults.')

				// toast.warn('Must Import NC Defaults Before Continuing!',{autoClose:10000, position: toast.POSITION.TOP_CENTER})

			} else {
				this.defaultsMissing = false
				console.log('page now loaded')
			}
			})
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
			resetFileUploader() {
                this.$refs.oFileHandler.value = '';
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
				try{
					var oData = JSON.parse(this.fileinput);
				} catch (error) {
					toast.error('unknown error: '+error, {autoClose:false})
					console.log(error)
					return
				}
				// var oData = JSON.parse(this.fileinput);
				// oData.ncDescription.ncName='test'
				this.store.state.defaults = oData
				try {
					// if(this.store.defaults.ncDescription.ncName.length>0){
					if(this.store.state.defaults.ncDescription.ncName.length>0){
						this.defaultsMissing = false
						console.log('defaults were loaded')
					}
				} catch (error) {
					this.defaultsMissing = true
					toast.error('Invalid File Import, Error' + error, {autoClose:false})
					console.log('Still... Cannot proceed without NC defaults.')
					console.error(error);
				// Expected output: ReferenceError: nonExistentFunction is not defined
				// (Note: the exact output may be browser-dependent)
				}

				// 	//this.store.state.defaults = oData
				// 	//if (this.store.state.defaults.ncDescription.ncName.length==0){
				// 	if (this.store.defaults.ncDescription.ncName.length==0){
				// 	this.defaultsMissing = true
				// 	console.log('Still... Cannot proceed without NC defaults.')
				// } else {
				// 	this.defaultsMissing = false
				// 	console.log('defaults were loaded')
				// }
				},
				(error) => {
				/* handle an error */
				toast.error('unknown error: '+error, {autoClose:false})
				console.log(error);
				},
			)
			}

		}
	}

</script>
<style scoped>
.home{
	margin-left:15px;
}
li{
	list-style: none;
	padding:5px 0 5px 0;
}
li a{
	font-weight:bold;
	text-decoration: none;
}
li a:hover{
	color:rgb(109, 109, 109);
}
.home .hyperLink{
	text-decoration: none;
}
</style>

