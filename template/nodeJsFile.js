/**
 * @author Wuner
 * @date 2020/12/8 12:08
 * @description
 */
const fs = require('fs')
const path = require('path')

// 是否使用ts
let useTypescript = false
// 是否安装组件
let hasComponent = false
// 是否安装vuex
let hasVuex = false
// 路由模式
let routerMode = 'hash'

const delNodeJsFile = () => {
  fs.unlinkSync(path.join(__dirname, "nodeJsFile.js"));
}

const createStore = () => {
  const storeContent = `/**
 * @author Wuner
 * @date 2020/12/9 17:58
 * @description store 配置文件
 */
import Vuex${useTypescript?', { Store }':''} from 'vuex';
import Vue from 'vue';
import Session from '@/utils/session';
import user from './modules/user';
${useTypescript?"import { RootState } from '@/types';":""}

Vue.use(Vuex);

const myPlugin = (store${useTypescript?': Store<RootState>':''}) => {
  store.subscribe((mutation, state) => {
    // 缓存状态
    Session.set('storeState', state);
  });
};

const storeState = Session.get('storeState');
const state = {
  data: (storeState && storeState.data) || {},
};

const getters = {
  /**
   * data数据
   * @param state
   * @returns {*}
   */
  data(state${useTypescript?': RootState':''}) {
    return state.data;
  },
};

const mutations = {
  /**
   * 设置data数据
   * @param state
   * @param data
   */
  setData${useTypescript?'(state: RootState, data: object)':'(state, data)'} {
    state.data = data;
  },
};

const actions = {};

const store = new Vuex.Store({
  // 非生产环境添加严格模式
  strict: process.env.NODE_ENV !== 'production',
  state,
  getters,
  mutations,
  actions,
  // 模块
  modules: {
    user,
  },
  // 插件
  plugins: [myPlugin],
});

export default store;
`
  const moduleContent = `/**
 * @author Wuner
 * @date 2020/12/9 18:00
 * @description 用户模块
 */
import Session from '@/utils/session';
import { queryRepos } from '@/api/modules/user';
${useTypescript?"import { UserState } from '@/types';":''}

const storeState = Session.get('storeState');

const state = (storeState && storeState.user) || {
  data: {
    repos: [], // git 用户所有仓库
  },
};

const getters = {
  /**
   * git 用户所有仓库
   * @param state
   * @returns {array}
   */
  repos(state${useTypescript?': UserState':''}) {
    return state.data.repos;
  },
};

const mutations = {
  /**
   * 设置 git 用户所有仓库
   * @param state
   * @param data
   */
  setRepos${useTypescript?'(state: UserState, data: object)':'(state, data)'} {
    state.data.repos = data;
  },
};

const actions = {
  /**
   * 查询 git 用户所有仓库
   * @param commit
   * @param username
   * @returns {Promise<void>}
   */
  async queryRepos(
    { commit }${useTypescript?': { commit: Function }':''},
    { username }${useTypescript?': { username: string }':''},
  ) {
    try {
      const data = await queryRepos({ username });
      commit('setRepos', data);
    } catch (e) {
      console.log(e);
    }
  },
};

export default { namespaced: true, state, getters, mutations, actions };
`

  if (!fs.existsSync("src/store")){
    fs.mkdirSync(path.join(__dirname, "src/store"));
  }
  if (!fs.existsSync("src/store/modules")){
    fs.mkdirSync(path.join(__dirname, "src/store/modules"));
  }
  fs.writeFileSync(path.join(__dirname, `src/store/index.${useTypescript?'ts':'js'}`), storeContent);
  fs.writeFileSync(path.join(__dirname, `src/store/modules/user.${useTypescript?'ts':'js'}`), moduleContent);
}

const createApi = () => {
  const content = `/**
 * @author Wuner
 * @date 2020/12/9 8:08
 * @description user 模块的接口
 */
import { get } from '@/utils/http';

// 样例，可删除
/**
 * 获取 git 用户所有仓库
 * @param data
 * @param data.username => git 用户 username
 * @returns
 */
export const queryRepos = ({ username }${useTypescript?': { username: string }':''}) => {
  return get(\`https://api.github.com/users/\${username}/repos\`, {});
};
`
  if (!fs.existsSync("src/api")){
    fs.mkdirSync(path.join(__dirname, "src/api"));
  }
  if (!fs.existsSync("src/api/modules")){
    fs.mkdirSync(path.join(__dirname, "src/api/modules"));
  }
  fs.writeFileSync(path.join(__dirname, `src/api/modules/user.${useTypescript?'ts':'js'}`), content);
}

const createMain = () => {
  let content = `// webpack 打包入口文件
/**
 * !!! 如果你在生成应用时选择了组件，模板已经按照按需引入模式进行配置，您无需再次全局引入，否则会冲突
 * import { Button } from '@varied/mobile'; 在需要的地方 import 需要的组件就好了
 * 具体请参考 https://wuner.gitee.io/varied-mobile-doc/#/quickstart 按需引入章节
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import http from './utils/http';
${hasVuex?"import store from './store';":""}
${hasComponent?"import { Button } from '@varied/mobile';":""}
${hasComponent?"Vue.use(Button);":""}
Vue.prototype.$http = http; // 引入前后端交互工具

// 开始创建Vue实例
new Vue({
  el: '#app',
  components: { App },
  router, // 注入路由
  ${hasVuex?"store,":""}
  template: '<App />',
  data: {
    addList: null,
    editAdd: null,
    selectedAdd: null,
    deliverType: 'inStore',
  },
});
`
  fs.writeFileSync(path.join(__dirname, `src/main.${useTypescript?'ts':'js'}`), content);
}

const createCommon = () => {
  let content = `/**
 * @author Wuner
 * @date 2020/12/8 9:56
 * @description
 */
const isIos = function()${useTypescript?': boolean':''} {
  let isIos = navigator.userAgent.match(/(iPhone|iPad|iOS)/i) != null;
  return isIos ? isIos : false;
};

const isAndroid = function()${useTypescript?': boolean':''} {
  let isAndroid = false;
  isAndroid = navigator.userAgent.match(/(Android)/i) != null;
  return isAndroid;
};
export default { isAndroid, isIos };
`
  if (!fs.existsSync("src/utils")){
    fs.mkdirSync(path.join(__dirname, "src/utils"));
  }
  fs.writeFileSync(path.join(__dirname, `src/utils/common-utils.${useTypescript?'ts':'js'}`), content);
}

const createHttp = () => {
  let content = `import axios from 'axios';
// axios.defaults.baseURL = '';
axios.defaults.responseType = 'json';
axios.defaults.timeout = 100000;

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    let resData = response.data;
    // 这里写接口返回数据处理
    if (!resData) {
      return Promise.reject(response);
    }
    return resData;
  },
  function(error) {
    if (
      error.code === 'ECONNABORTED' &&
      error.message.indexOf('timeout') >= 0
    ) {
      return Promise.reject('请求超时');
    } else {
      return Promise.reject(error.message);
    }
  },
);

const get = ${useTypescript?'(url: string, params: object)':'(url, params)'} => {
  return axios({
    method: 'get',
    url,
    params,
    data: undefined,
  });
};

const post = ${useTypescript?'(url: string, data: object)':'(url, data)'} => {
  return axios({
    method: 'post',
    url,
    data,
  });
};
export { get, post };
export default { get, post };
`
  fs.writeFileSync(path.join(__dirname, `src/utils/http.${useTypescript?'ts':'js'}`), content);
}

const createSession = () => {
  let content = `const get = function(key${useTypescript?': string':''}) {
  let value = sessionStorage.getItem(key);
  let data;

  if (typeof value === 'string') {
    try {
      data = JSON.parse(value);
    } catch (e) {
      data = value;
    }
  } else {
    data = value;
  }

  return data;
};

const set = function${useTypescript?'(key: string, value: any)':'(key, value)'} {
  if (typeof value === 'object') {
    sessionStorage.setItem(key, JSON.stringify(value));
  } else {
    sessionStorage.setItem(key, value);
  }
};

const remove = function(key${useTypescript?': string':''}) {
  sessionStorage.removeItem(key);
};

export default { get, set, remove };
`
  fs.writeFileSync(path.join(__dirname, `src/utils/session.${useTypescript?'ts':'js'}`), content);
}

const createRouter = () => {
  let content = `import Vue from 'vue';
import Router from 'vue-router';
import hello from '@/view/hello.vue';

Vue.use(Router); // 启用router插件

// 以下是路由配置
let router = new Router({
  mode: '${routerMode}',
  routes: [
    {
      path: '/',
      name: 'index',
      component: hello,
    },
  ],
});

export default router;
`
  if (!fs.existsSync("src/router")){
    fs.mkdirSync(path.join(__dirname, "src/router"));
  }
  fs.writeFileSync(path.join(__dirname, `src/router/index.${useTypescript?'ts':'js'}`), content);
}

const createTs = () => {
  let content = `import Vue, { VNode } from "vue";

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
`
  let contentVue = `declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
`
  let contentConfig = `{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "strict": true,
    "jsx": "preserve",
    "importHelpers": true,
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "baseUrl": ".",
    "types": [
      "webpack-env"
    ],
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
    "lib": [
      "esnext",
      "dom",
      "dom.iterable",
      "scripthost"
    ]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}
`
  let contentTypes = `export interface RootState {
  data: object;
}

export interface UserState {
  data: Repos;
}
export interface Repos {
  repos: object;
}
`
  fs.writeFileSync(path.join(__dirname, `src/shims-tsx.d.ts`), content);
  fs.writeFileSync(path.join(__dirname, `src/shims-vue.d.ts`), contentVue);
  fs.writeFileSync(path.join(__dirname, `tsconfig.json`), contentConfig);
  if (!fs.existsSync("src/types")){
    fs.mkdirSync(path.join(__dirname, "src/types"));
  }
  fs.writeFileSync(path.join(__dirname, "src/types/index.d.ts"), contentTypes);
}

const createBase = () => {
  createMain()
  createCommon()
  createHttp()
  createRouter()
  createSession()
  if (hasVuex){
    createApi()
    createStore()
  }
  if (useTypescript){
    createTs()
  }
  delNodeJsFile()
}

process.argv.forEach(function (val, index, array) {
  if (val === 'hasComponent'){
    hasComponent = true
  }
  if (val === 'useTypescript'){
    useTypescript = true
  }

  if (val === 'hasVuex') {
    hasVuex = true
  }

  if (val === 'hash') {
    routerMode = 'hash'
  }

  if (val === 'history') {
    routerMode = 'history'
  }
});

createBase()
