
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

  const state = {
    num: 102,
  }  

const mutations = {
    add(state){
        state.num+=1;
     axios.get('https://pq.hzcanf.com/user/userCouponCount.wckj', {
      'userId':'10245593',
      'uuid':'a181e878-ba93-49f1-8242-609ea7173b64',
      't':'1539681512000',
      'v':'A1.0.0',
      'h':'1b3b37804887db20c390413a21ee7808',
      'c':'B0000',
      'token':'0536ca6ec68145e090f5120342bd548f',
    },{emulateJSON: true})
    .then(response => {
      console.log(response.data)
   
    }, response => {
      console.log('error')
    })
    }
  }

  const actions = {
  
  }
  
  const A = {
    /**
     * 定义命名空间，防止多个模块同名共享
     */
    namespaced: true,
  
    state: state,
    mutations: mutations,
    actions: actions
  }
  export default A;
  
  