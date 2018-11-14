// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import axios from 'axios';
import Vuex from 'vuex';
import store from './store/';
import VueLazyload from 'vue-lazyload';
import infiniteScroll from 'vue-infinite-scroll';
import 'font-awesome/css/font-awesome.css';
import Mixin from './mixins';
import Bus from 'src/vueBus';
import filters from './filters';
import { enums, PcCookie, PcLockr, PcEncrypt } from 'utils/';
import 'element-ui/lib/theme-chalk/index.css';
import './style.less';
import {
  Table,
  tableColumn,
  Row,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Select,
  Option,
  Button,
  Menu,
  Submenu,
  menuItem,
  menuItemGroup,
  Breadcrumb,
  breadcrumbItem,
  Dialog,
  Pagination,
  Form,
  formItem,
  MessageBox,
  Message,
  Loading,
  Checkbox,
  checkboxGroup,
  radio,
  Upload,
  Tree,
  Tabs,
  TabPane,
  Tooltip,
  Transfer,
  Cascader,
  DatePicker
} from 'element-ui';

const components = [
  Table,
  tableColumn,
  Row,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Select,
  Option,
  Button,
  Menu,
  Submenu,
  menuItem,
  menuItemGroup,
  Breadcrumb,
  breadcrumbItem,
  Dialog,
  Pagination,
  Form,
  formItem,
  Checkbox,
  checkboxGroup,
  radio,
  Upload,
  Tree,
  Tabs,
  TabPane,
  Tooltip,
  Transfer,
  Cascader,
  DatePicker
];
Vue.prototype.$ELEMENT = { size: 'small' };
components.map(component => {
  Vue.component(component.name, component);
});
Vue.use(Loading.directive);
Vue.prototype.$pcLoading = Loading.service;
Vue.prototype.$pcMessageBox = MessageBox;
Vue.prototype.$pcMessage = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$pcNProgress = NProgress;
Vue.prototype.$pcBus = Bus;
Vue.prototype.$pcEnum = enums;
Vue.prototype.$pcEncrypt = PcEncrypt;
Vue.prototype.$pcLockr = PcLockr;
Vue.prototype.$pcCookie = PcCookie;
Vue.prototype.$http = axios.create({
  timeout: 60000
});

if (process.env.NODE_ENV === 'production') {
  Vue.prototype.$http.defaults.baseURL = 'http://api.paascloud.net/';
}

function updateUserMenu () {
  let authToken = store.getters.getAuthToken;
  if (authToken && authToken.access_token && !authToken.updateMenuFlag) {
    Vue.prototype.$http({
      method: 'post',
      url: '/uac/user/loginAfter/1',
      data: ''
    })
      .then((res) => {
        console.log(res);
        authToken.updateMenuFlag = true;
        // 通知菜单 因为菜单先加载 而获取菜单耗时较多
        Bus.$emit('logined', res.result.menuList);
        store.dispatch('update_user_info', res.result.loginAuthDto.loginName);
        store.dispatch('update_user_menu', res.result.menuList);
        // store.dispatch('update_auth_token', authToken);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

function jumpLoginPage () {
  if (process.env.NODE_ENV === 'production') {
    window.location.href = 'http://login.paascloud.net/login';
  } else {
    window.location.href = 'http://dev-login.paascloud.net/login';
  }
}

Vue.prototype.$http.interceptors.request.use((config) => {
  if (!config.url.indexOf('/auth') >= 0) {
    store.dispatch('get_access_token', (res) => {
      if (res) {
        config.headers.Authorization = 'Bearer ' + res;
      } else {
        jumpLoginPage();
      }
    });
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

Vue.prototype.$http.interceptors.response.use((res) => {
  if (res.data.code === 200) {
    if (res.data) {
      return res.data;
    }
  }
  if (res.data.code === 10011039 || res.data.code === 10011040 || res.data.code === 10011041) {
    // 验证token失败 || 解析header失败 || 页面已过期,请重新登录
    console.info('登录超时', res.data);
    // store.dispatch('delete_user_info');
    // window.location.href = '/';
    return Promise.reject(res);
  } else {
    store.dispatch('new_notice', {
      autoClose: true,
      content: res.data.message
    });
    return Promise.reject(res);
  }
}, (error) => {
  let options = {
    autoClose: true,
    content: error.response.data.message
  };
  if (error.response) {
    console.error('error: ', error.response);
    if (error.response.status === 500) {
      options.content = error.response.data.message;
    } else if (error.response.status === 401) {
      options.content = '您无访问权限';
    } else {
      console.log('Error', error.message);
      options.content = '接口请求失败或超时！请刷新重试';
    }
  } else {
    options.content = '接口请求失败或超时！请刷新重试';
  }
  store.dispatch('new_notice', options);
});

router.beforeEach((to, from, next) => {
  PcCookie.set({
    key: enums.USER.REDIRECT_URI,
    value: window.location.href
  });
  let authToken = store.getters.getAuthToken;
  if (authToken && authToken.access_token) {
    updateUserMenu();
    NProgress.start();
    next();
  } else {
    jumpLoginPage();
  }
});
router.afterEach(transition => {
  NProgress.done();
});

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(VueLazyload, {
  loading: '/static/loading-svg/loading-bars.svg',
  try: 1 // default 1
});
Vue.use(infiniteScroll);
Vue.mixin(Mixin);

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
