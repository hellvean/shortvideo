import Vue from 'vue'
import Router from 'vue-router'
import login from '@/page/login'
import home from '@/page/home'
import welcome from '@/page/welcome'
import userManage from '@/page/userManage'
import userList from '@/page/userList'
import role from '@/page/role'
import error from '@/page/error'
import company from '@/page/company'
import saveApproval from '@/page/saveApproval'
import levelOneApproval from '@/page/levelOneApproval'
import levelTwoApproval from '@/page/levelTwoApproval'
import revenueReport from '@/page/revenueReport'
Vue.use(Router)
export default new Router({
  // mode: 'history',
  routes: [
    {path: '/',name: 'login',component: login},
    {path: '/login',name: 'login',component: login},
    {path: '/home',name: 'home',component: home,
      children:[
        { path: '/',name:'welcome',component:welcome},
        { path: '/role',name: 'role',component: role},
        { path: '/userManage',name: 'userManage',component: userManage},
        { path: '/userList',name: 'userList',component: userList},
        { path: '/company',name: 'company',component: company},
        { path: '/saveApproval',name: 'saveApproval',component: saveApproval},
        { path: '/levelOneApproval',name: 'levelOneApproval',component: levelOneApproval},
        { path: '/levelTwoApproval',name: 'levelTwoApproval',component: levelTwoApproval},
        { path: '/revenueReport',name: 'revenueReport',component: revenueReport},
      ]
    },
    { path: '*',name: 'error',component: error},
  ]
})
