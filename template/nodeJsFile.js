/**
 * @author Wuner
 * @date 2020/12/8 12:08
 * @description
 */
const fs = require('fs')
const path = require('path')

const delNodeJsFile = () => {
  fs.unlinkSync(path.join(__dirname, "nodeJsFile.js"));
}

const createStore = () => {
  const storeContent = `/**
 * @author Wuner
 * @date 2020/12/9 17:58
 * @description store 配置文件
 */
import Vuex from 'vuex';
import Vue from 'vue';
import Session from '../utils/session'
import user from './modules/user';

Vue.use(Vuex);

const myPlugin = (store) => {
  store.subscribe((mutation, state) => {
    // 缓存状态
    Session.set('storeState', state);
  });
};

const storeState = Session.get('storeState');
const state = {
  data: (storeState && storeState.data) || {
  }
};

const getters = {
  /**
   * data数据
   * @param store
   * @returns {*}
   */
  data(store) {
    return store.data;
  },
};

const mutations = {
  /**
   * 设置data数据
   * @param store
   * @param data
   */
  setData(store, data) {
    store.data = data;
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
import Session from '../../utils/session'
import {queryRepos} from '../../api/module/user'

const storeState = Session.get('storeState');

const state = (storeState && storeState.user) || {
  data: {
    repos: [], // git 用户所有仓库
  }
};

const getters = {
  /**
   * git 用户所有仓库
   * @param store
   * @returns {array}
   */
  repos(store){
    return store.repos;
  }
};

const mutations = {
  /**
   * 设置 git 用户所有仓库
   * @param store
   * @param data
   */
  setRepos(store, data){
    store.data.repos = data;
  }
};

const actions = {
  /**
   * 查询 git 用户所有仓库
   * @param commit
   * @param username
   * @returns {Promise<void>}
   */
  async queryRepos({commit}, {username}) {
    try {
      const data = await queryRepos({username});
      commit('setRepos', data)
    }catch (e) {
      console.log(e);
    }
  }
};

export default { namespaced: true, state, getters, mutations, actions };
`
  fs.mkdirSync(path.join(__dirname, "src/store"));
  fs.mkdirSync(path.join(__dirname, "src/store/module"));
  fs.writeFileSync(path.join(__dirname, "src/store/index.js"), storeContent);
  fs.writeFileSync(path.join(__dirname, "src/store/module/user.js"), moduleContent);
}

const createApi = () => {
  const content = '/**\n' +
    ' * @author Wuner\n' +
    ' * @date 2020/12/9 8:08\n' +
    ' * @description user 模块的接口\n' +
    ' */\n' +
    'import { post, get } from \'../utils/http\';\n' +
    '\n' +
    '// 样例，可删除\n' +
    '/**\n' +
    ' * 获取 git 用户所有仓库\n' +
    ' * @param data\n' +
    ' * @param data.username => git 用户 username\n' +
    ' * @returns\n' +
    ' */\n' +
    'export const queryRepos = ({username}) => {\n' +
    '  return get(`https://api.github.com/users/${username}/repos`);\n' +
    '};\n'
  fs.mkdirSync(path.join(__dirname, "src/api"));
  fs.mkdirSync(path.join(__dirname, "src/api/module"));
  fs.writeFileSync(path.join(__dirname, "src/api/module/user.js"), content);
}

process.argv.forEach(function (val, index, array) {

  if (val === 'delNodeJsFile') {
    delNodeJsFile()
  }

  if (val === 'createVuex') {
    createStore()
    createApi()
  }
});
