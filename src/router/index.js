import { createRouter, createWebHistory } from 'vue-router'
// import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/setupmeeting',
    name: 'SetupMeeting',
    component: () => import(/* webpackChunkName: "about" */ '../views/SetupMeeting.vue')
  },  
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }  ,
  {
    path: '/createagenda',
    name: 'createAgenda',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/CreateAgenda.vue')
  },
  {
    path: '/recordminutes',
    name: 'RecordMinutes',
    component: () => import(/* webpackChunkName: "about" */ '../views/RecordMinutes.vue')
  }, 
  // {
  //   path: '/printagenda',
  //   name: 'PrintAgenda',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/PrintAgenda.vue')
  // },
  {
    path: '/printpreview',
    name: 'PrintPreview',
    component: () => import(/* webpackChunkName: "about" */ '../views/PrintPreview.vue')
  }, 
  {
    path: '/importrequests',
    name: 'ImportRequests',
    component: () => import(/* webpackChunkName: "about" */ '../views/ImportRequests.vue')
  }, 
  {
    path: '/extractcnc',
    name: 'ExtractCNC',
    component: () => import(/* webpackChunkName: "about" */ '../views/ExtractCNC.vue')
  }, 
  {
    path: '/exportagendatocsv',
    name: 'ExportAgendaToCSV',
    component: () => import(/* webpackChunkName: "about" */ '../views/ExportAgendaToCSV.vue')
  }, 
  {
    path: '/membership',
    name: 'Membership',
    component: () => import(/* webpackChunkName: "about" */ '../views/Membership.vue')
  }, 
    {
    path: '/countdown',
    name: 'Countdown',
    component: () => import(/* webpackChunkName: "about" */ '../views/Countdown.vue')
  }, 
]

    const router = createRouter({
      mode: 'history',
      history: createWebHistory(),
      // history: createWebHashHistory(),
      routes
    })

export default router
