<template>
  <div class="hello">
    <img src="../assets/varied.png">
    <div class="text">\{{msg}}</div>
    {{#if_eq hasComponent "Yes"}}
    {{#if_eq deviceType "Mobile"}}
    <vm-button tag="a" href="http://huangwanneng.cn/#/intro" block size="lg" class="bg-blue button-item">组件库</vm-button>
    {{/if_eq}}
    {{/if_eq}}
  </div>
</template>

<script>
{{#if_eq hasComponent "Yes"}}
{{#if_eq deviceType "Mobile"}}
import { Button } from '@varied/mobile';
{{/if_eq}}
{{/if_eq}}
export default {
  name: 'HelloMobileTemplate',
  {{#if_eq hasComponent "Yes"}}
  {{#if_eq deviceType "Mobile"}}
  components: {
    [Button.name]: Button,
  },
  {{/if_eq}}
  {{/if_eq}}
  data() {
    return {
      msg: 'Welcome to Varied',
    };
  },
};
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
