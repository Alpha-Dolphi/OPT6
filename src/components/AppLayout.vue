<template>
  <div class="app-layout">
    <AppSideMenu />
    <main class="main-content">
      <slot></slot>
    </main>
  </div>
</template>

<script>
import myLogoSrc from '@/assets/SVG/logo.svg'
import AppSideMenu from './AppSideMenu.vue'

export default {
  name: 'AppLayout',
  data() {
    return {
      myLogoSrc: myLogoSrc,
    }
  },
  components: {
    AppSideMenu,
  },
}
</script>

<style scoped>
.app-layout {
  display: flex;
}

.main-content {
  flex: 1;
  padding: 25px;
}
</style>
