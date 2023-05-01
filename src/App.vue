<template>
  <AppLayout>
    <PageContent />
  </AppLayout>
</template>

<script lang="ts">
import AppLayout from './components/AppLayout.vue'
import PageContent from './components/PageContent.vue'
import '@/styles.css'

export default {
  name: 'App',
  components: {
    AppLayout,
    PageContent,
  },
}
</script>

<style>
#app {
  font-family: MyriadPro, Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}

/* span {
  font-family: MyriadPro, Avenir, Helvetica, Arial, sans-serif;
} */

* {
  /* border: 1px solid blueviolet; */
}
</style>
