<template>
  <HelloTemplate></HelloTemplate>
</template>
<script>
{{#if_eq deviceType "Mobile"}}
import HelloTemplate from '../components/HelloTemplate';
{{/if_eq}}

export default {
  components: {
    HelloTemplate,
  },
};
</script>
