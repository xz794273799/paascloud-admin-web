import user from './user/';
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import global from './global/';
import formTable from './formtable/';
import browser from './browser/';

Vue.use(Vuex);
Vue.prototype.$http = axios.create({
  timeout: 60000
});

export default new Vuex.Store({
  modules: {
    user,
    global,
    formTable,
    browser
  }
});
