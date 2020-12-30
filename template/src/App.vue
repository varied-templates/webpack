<template>
	<div class="view-frame">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive == true"></router-view>
    </keep-alive>
      <router-view v-if="$route.meta.keepAlive != true"></router-view>
	</div>
</template>
{{#if_eq useTypescript "Yes"}}
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'App',
});
</script>
{{else}}
<script>
export default {
  name: 'App',
};
</script>
{{/if_eq}}
