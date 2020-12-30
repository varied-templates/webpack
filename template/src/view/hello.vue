<template>
  <HelloTemplate></HelloTemplate>
</template>
{{#if_eq useTypescript "Yes"}}
<script lang="ts">
import Vue from 'vue';
import HelloTemplate from '@/components/HelloTemplate';

export default Vue.extend({
  components: {
    HelloTemplate,
  },
});
</script>
{{else}}
<script>
import HelloTemplate from '@/components/HelloTemplate';

export default {
  components: {
    HelloTemplate,
  },
};
</script>
{{/if_eq}}
