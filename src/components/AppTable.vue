<template>
  <div class="table">
    <div class="table-panel">
      <span
        class="table-panel-text"
        v-if="showSaveChanges"
        @click="handleSaveChangesToLocalStorage"
      >
        Сохранить изменения
      </span>
      <span
        class="table-panel-text"
        v-if="!showSaveChanges"
        @click="showTableOptions = !showTableOptions"
      >
        Изменить
      </span>

      <img
        :src="optionsIcon"
        alt="options"
        class="options"
        @click="showTableOptions = !showTableOptions"
      />

      <template v-if="showTableOptions">
        <AppTableOptions
          :table-headers="tableHeaders"
          @headers-updated="showSaveChanges = true"
        />
      </template>
    </div>

    <div class="table-header" @mousemove="handleHeaderMouseMove">
      <div
        class="table-header__cell"
        :class="{ 'hide-text': headerWidths[index] <= 38 }"
        v-for="(header, index) in filteredHeaders"
        :key="header.id"
        :index="header.id"
        :style="{ width: `${headerWidths[index]}px` }"
        @mousedown="handleHeaderCellMouseDown($event, index)"
        @mouseleave="handleHeaderMouseOut"
      >
        <span>{{ header.title }}</span>
      </div>
    </div>

    <div
      v-for="row in filteredTableContent"
      class="table-body__row"
      :key="row.id"
    >
      <div
        class="table-body__cell"
        :class="{ 'font-family': getCellKey(row, key) === 'index' }"
        v-for="(cell, idx, key) in row"
        :key="cell.id"
        :style="{ width: `${headerWidths[key]}px` }"
      >
        <img
          v-if="getCellKey(row, key) === 'index'"
          :src="burgerMenuIcon"
          alt="burger-menu-icon"
          class="burger-menu-icon"
        />
        <img
          v-if="getCellKey(row, key) === 'action'"
          :src="moreOptionsIcon"
          alt="burger-menu-icon"
          class="burger-menu-icon"
        />
        <span
          v-if="
            getCellKey(row, key) !== 'action' &&
            getCellKey(row, key) !== 'index'
          "
          :class="{ 'add-border': getCellKey(row, key) === 'unit_name' }"
        >
          {{ cell }}
        </span>
        <div v-if="getCellKey(row, key) === 'index'">
          {{ cell }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppTableOptions from './AppTableOptions.vue'
import tableHeaders from './data/table/tableHeaders'
import tableContent from './data/table/tableContent'
import optionsIcon from '@/assets/SVG/options-cog.svg'
import burgerMenuIcon from '@/assets/SVG/burger-menu.svg'
import moreOptionsIcon from '@/assets/SVG/more-options.svg'

export default {
  name: 'AppTable',
  data() {
    return {
      tableHeaders: tableHeaders,
      tableContent: tableContent,
      optionsIcon: optionsIcon,
      burgerMenuIcon: burgerMenuIcon,
      moreOptionsIcon: moreOptionsIcon,
      headerWidths: [],
      resizeIndex: null,
      resizeStartX: null,
      lastHoveredCell: null,
      draggingTableHeaderCell: null,
      initialMouseX: null,
      initialWidth: null,
      showTableOptions: false,
      showSaveChanges: false,
    }
  },
  components: {
    AppTableOptions,
  },
  mounted() {
    this.setInitialHeaderWidths()
    this.getDataFromLocalStorage()
  },
  methods: {
    getDataFromLocalStorage() {
      const headers = localStorage.getItem('tableHeaders')
      const headerWidths = localStorage.getItem('headerWidths')
      if (headers) {
        const array = JSON.parse(headers)
        this.tableHeaders = array
      }
      if (headerWidths) {
        const array = JSON.parse(headerWidths)
        this.headerWidths = array
      }
    },
    handleSaveChangesToLocalStorage() {
      localStorage.setItem('tableHeaders', JSON.stringify(this.tableHeaders))
      localStorage.setItem('headerWidths', JSON.stringify(this.headerWidths))
      this.showSaveChanges = false
    },
    setInitialHeaderWidths() {
      for (let i = 0; i < Object.keys(this.tableHeaders).length; i++) {
        this.headerWidths[i] = 150
      }
    },
    checkIfMouseOverBorder(event) {
      let target = event.target.closest('.table-header__cell')
      if (!target) return false

      const headerCellRight = target.getBoundingClientRect().right
      // const headerCellLeft = target.getBoundingClientRect().left;
      const x = event.clientX
      const isOnRightBorder = x >= headerCellRight - 5 && x <= headerCellRight
      // const isOnLeftBorder = x >= headerCellLeft && x <= headerCellLeft + 6;
      // if (isOnLeftBorder && target.previousElementSibling) {
      //   target = target.previousElementSibling;
      // }

      // if (isOnRightBorder || isOnLeftBorder) {
      if (isOnRightBorder) {
        target.classList.add('hover-right-border')
        this.lastHoveredCell = target
        return true
      } else {
        target.classList.remove('hover-right-border')
        return false
      }
    },
    handleHeaderMouseMove(event) {
      this.checkIfMouseOverBorder(event)
    },
    handleHeaderMouseOut() {
      if (this.lastHoveredCell) {
        this.lastHoveredCell.classList.remove('hover-right-border')
        this.lastHoveredCell = null
      }
    },
    handleHeaderCellMouseDown(event, index) {
      let target = event.target.closest('.table-header__cell')
      if (!target) {
        return
      }
      this.draggingTableHeaderCell = target

      const headerCellRight = target.getBoundingClientRect().right
      const x = event.clientX
      const isOnRightBorder = x >= headerCellRight - 5 && x <= headerCellRight

      if (isOnRightBorder) {
        this.resizing = true
        this.resizeIndex = +index
        this.initialMouseX = event.clientX
        this.initialWidth =
          this.draggingTableHeaderCell.getBoundingClientRect().width
        document.querySelector('body').classList.add('changing-width')
        document.addEventListener('mousemove', this.handleColumnResize)
        document.addEventListener('mouseup', this.handleMouseUp)
      }
    },
    handleColumnResize(event) {
      const newWidth = this.initialWidth - (this.initialMouseX - event.clientX)
      this.headerWidths[this.resizeIndex] = newWidth
    },
    handleMouseUp() {
      this.showSaveChanges = true
      document.querySelector('body').classList.remove('changing-width')
      document.removeEventListener('mousemove', this.handleColumnResize)
      document.removeEventListener('mouseup', this.handleMouseUp)
    },
    getCellKey(row, index) {
      const keys = Object.keys(row)
      return keys[index]
    },
  },
  computed: {
    filteredHeaders() {
      return this.tableHeaders.filter((header) => header.showTitle)
    },
    filteredTableContent() {
      return tableContent.map(({ id, ...rest }) => {
        id
        const showedColumns = Object.keys(rest).filter(
          (prop, key) => this.tableHeaders[key].showTitle,
        )
        const filteredData = showedColumns.reduce((obj, key) => {
          obj[key] = rest[key]
          return obj
        }, {})
        return filteredData
      })
    },
  },
}
</script>

<style>
.table {
  width: max-content;
  border-radius: 10px;
  box-shadow: 0 5px 20px 0 var(--black-7);
  border: solid 1px var(--pale-grey-two);
  background-color: var(--white);
}

.table-panel {
  height: 32px;
  padding: 9px 15px 8px;
  gap: 20px;
  display: grid;
  justify-content: flex-end;
  grid-auto-flow: column;
  align-items: center;
  position: relative;
}

.table-header {
  display: flex;
  height: 44px;
}

.table-header__cell:last-child {
  border-right: none;
}

.table-header__cell {
  border: 1px solid var(--pale-grey-two);
  border-left: none;
  white-space: nowrap;
  overflow: hidden;
  width: 150px;
  font-family: 'MyriadPro bold';
  font-size: 16px;
  font-weight: 600;
  color: var(--black);
  display: flex;
  align-items: center;
  padding: 10px;
}

.table-body__row {
  display: flex;
  height: 45px;
  white-space: nowrap;
  overflow: hidden;
}

.table-body__cell {
  width: 150px;
  height: 45px;
  white-space: nowrap;
  overflow: hidden;
  font-size: 16px;
  color: var(--black);
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 15px;
}

.options {
  cursor: pointer;
}

.table-body__cell span {
  height: 100%;
  border-radius: 5px;
  box-shadow: 0 5px 20px 0 var(--black-7);
  border: solid 1px var(--pinkish-grey);
  background-color: var(--white);
  display: flex;
  align-items: center;
  padding: 0px 15px 0px;
  width: 100%;
  min-width: max-content;
}

.hover-right-border {
  cursor: col-resize;
  border-right-color: #bcbcbc;
}

.changing-width {
  cursor: col-resize;
  user-select: none;
}

.hide-text {
  text-indent: -9999px;
}

.font-family {
  font-family: 'MyriadPro semibold';
}

.table-panel-text {
  cursor: pointer;
  font-size: 12px;
  color: var(--light-grey-blue);
}
</style>


