<template>
  <div class="hello">
    <img src="../assets/varied.png">
    <div class="text">\{{msg}}</div>
    {{#if_eq hasVuex "Yes"}}
    <div>
      <h1>git用户仓库</h1>
    </div>
    <div v-for="repo in repos" :key="repo.id">
      \{{repo.full_name}}
    </div>
    {{/if_eq}}
    {{#if_eq hasComponent "Yes"}}
    {{#if_eq deviceType "Mobile"}}
    <vm-button tag="a" href="https://wuner.gitee.io/varied-mobile-doc/#/intro" block size="lg" class="bg-blue button-item">组件库</vm-button>
    {{/if_eq}}
    {{/if_eq}}
  </div>
</template>

{{#if_eq useTypescript "Yes"}}
<script lang="ts">
import Vue from 'vue';
{{else}}
<script>
{{/if_eq}}
{{#if_eq hasVuex "Yes"}}
import { mapActions, mapGetters } from 'vuex';
{{/if_eq}}
{{#if_eq useTypescript "Yes"}}
export default Vue.extend({
{{else}}
export default {
{{/if_eq}}
  name: 'HelloTemplate',
  data() {
    return {
      msg: 'Welcome to Varied',
    };
  },
  {{#if_eq hasVuex "Yes"}}
  created() {
    this.queryRepos({username:'wuner'});
  },
  methods: {
  ...mapActions('user', [
      'queryRepos', // 获取 git 用户所有仓库
    ]),
  },
  computed: {
  ...mapGetters('user', [
      'repos', // git 用户所有仓库
    ]),
  },
  {{/if_eq}}
{{#if_eq useTypescript "Yes"}}
});
{{else}}
};
{{/if_eq}}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  text-align: center;
}
img {
  width: 200px;
  text-align: center;
  padding-top: 100px;
}
.text {
  margin-top: 100px;
  text-align: center;
  font-size: 32px;
}
{{#if_eq hasComponent "Yes"}}
{{#if_eq deviceType "Mobile"}}
.button-item {
  position: fixed;
  bottom: 0;
}
{{/if_eq}}
{{/if_eq}}
</style>
