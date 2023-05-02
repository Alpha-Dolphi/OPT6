<template>
  <div class="page-content">
    <h1 class="check">Проведение ТО и мелкий ремонт</h1>
    <div class="menu">
      <div class="sections">
        <a href=""><span class="blue">Общее</span></a>
        <a href=""><span>Товар Списания</span></a>
        <a href=""><span class="blue">Расходы</span></a>
      </div>
      <!-- <img
        :src="optionsIcon"
        alt="options"
        class="options"
        @click="showTableOptions = !showTableOptions"
      />

      <template v-if="showTableOptions">
        <AppTableOptions
          :table-headers="tableHeaders"
          @headers-updated="updateTableHeaders"
        />
      </template> -->
    </div>
    <AppTable @save-changes="handleSaveChangesToLocalStorage" :table-heads="tableHeads"/>
  </div>
</template>

<script>


import AppTable from './AppTable.vue'
import AppTableOptions from './AppTableOptions.vue'
import tableHeads from './data/table/tableHeaders'
import optionsIcon from '@/assets/SVG/options-cog.svg'

export default {
  name: 'PageContent',
  components: {
    AppTable,
    AppTableOptions,
  },
  data() {
    return {
      tableHeads,
      tableHeaders: tableHeads,
      optionsIcon: optionsIcon,
      showTableOptions: false,
    }
  },
  methods: {
    updateTableHeaders(newHeaders) {
      this.tableHeaders = newHeaders
      this.tableHeads = newHeaders
    },
}
}
</script>

<style>
.page-content {
  display: grid;
  gap: 25px;
  height: max-content;
}

.menu {
  display: flex;
  justify-content: space-between;
}

.sections {
  font-size: 16px;
  display: flex;
  gap: 20px;
  color: var(--black);
  font-family: "MyriadPro semibold";
}

.blue {
  color: var(--light-navy);
}
</style>
