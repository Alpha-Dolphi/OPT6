<template>
  <div class="page-content">
    <h1 class="check">Проведение ТО и мелкий ремонт</h1>
    <AppTable />
  </div>
</template>

<script>
import AppTable from './AppTable.vue'

export default {
  name: 'PageContent',
  components: {
    AppTable,
  },
}
</script>

<style>
.page-content {
  display: grid;
  gap: 25px;
  height: max-content;
}
</style>
