// notes to include in terminal
// npm run serve
// npm run build
// firebase deploy --only hosting

// Hosting URL: https://meeting-manager-2a57a.web.app

import { createApp, reactive, computed, VueElement } from 'vue'

import App from './App.vue'
import router from './router'

import defaults from './store/defaults.json'

import 'remixicon/fonts/remixicon.css'
import './assets/styles.css'

import moment from 'moment'
import VuePapaParse from 'vue-papa-parse'

// added 6-10-2023
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// import VueHtmlToPaper from './composables/VueHtmlToPaper'


const app = createApp(App)
app.use(router)
app.use(VuePapaParse)

// added 6-10-2023
app.use(Vue3Toastify, { autoClose: 3000 } );


//import print from 'vue3-print-nb'
//app.use(print)


// let oDefaults = JSON.parse(JSON.stringify( defaults ))
// //console.log(defaults)
// app.config.globalProperties.$defaults = reactive(oDefaults)
//console.log(oDefaults)

 let oData = JSON.parse(JSON.stringify( defaults ))
 app.config.globalProperties.oData = reactive(oData)

app.config.globalProperties.window = window

app.config.globalProperties.$moment=moment;
// this.$moment().format('MMMM Do YYYY, h:mm:ss a')

// app.config.globalProperties.oData = reactive(defaults)

// in components... this.$root.agendaDefaults is exposed
// but better solution is adding to config.globalProperties
//app.provide('agendaDefaults', defaults)

//app.provide('defaults',defaults)

app.mount('#app')


// // var globalVariable = {'test':123}
// app.config.globalProperties.xVar = 123
// console.log(app.config)


// run the development server
// npm run serve

// App running at:
// - Local:   http://localhost:8080/
// - Network: http://192.168.1.28:8080/

// npm run build
// firebase deploy --only hosting

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyASaWXSBR6myVInm3O90Ayvp9b5xrn2eeU",
//   authDomain: "meeting-manager-2a57a.firebaseapp.com",
//   projectId: "meeting-manager-2a57a",
//   storageBucket: "meeting-manager-2a57a.appspot.com",
//   messagingSenderId: "102764738798",
//   appId: "1:102764738798:web:3fb837e14d79e546f65bff"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

const gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git').exports;
const git = gitExtension.getAPI(1);