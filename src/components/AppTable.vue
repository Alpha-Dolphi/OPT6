<template>
  <div class="add-line">
    <button @click="addItemToTable">
      <span class="plus">+</span> <span>Добавить строку</span>
    </button>
  </div>

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
          :table-headers="this.tableHeaders"
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
        :data-index="index"
      >
        <span>{{ header.title }}</span>
      </div>
    </div>

    <div v-if="dragging" class="dragging-item" ref="draggingItem"></div>
    <div
      v-for="(row, index, key) in filteredTableContent"
      class="table-body__row draggable-item"
      :key="this.tableContent[index].id"
      :data-index="index"
      :data-id="this.tableContent[index].id"
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
          alt="grab-icon"
          class="grab-icon"
          @pointerdown="dragStart($event, key, row, index)"
        />
        <img
          v-if="getCellKey(row, key) === 'action'"
          :src="moreOptionsIcon"
          alt="grab-icon"
          class="grab-icon"
        />
        <!-- <span v-if="
            getCellKey(row, key) !== 'action' &&
            getCellKey(row, key) !== 'index'
          "
          :class="{ 'add-border': getCellKey(row, key) === 'unit_name' }"
        >
          {{ cell }}
        </span> -->
        <input
          v-if="
            getCellKey(row, key) !== 'action' &&
            getCellKey(row, key) !== 'index' &&
            getCellKey(row, key) !== 'total'
          "
          :class="{ 'add-border': getCellKey(row, key) === 'unit_name' }"
          class="input-value"
          v-model="tableContent[index][getCellKey(row, key)]"
        />
        <!-- :type="this.initTableHaders[key].inputType" -->
        <div v-if="getCellKey(row, key) === 'index'" class="item-index">
          {{ index + 1 }}
        </div>
        <div v-if="getCellKey(row, key) === 'total'" class="input-value">
          {{ !(row.price * row.amount) ? row.total : row.price * row.amount }}
        </div>
      </div>
    </div>

    <div class="total-results">
      <div class="total-results__inner-wrapper">
        <div class="total-stats">
          <div>
            <span class="total-stats__name">Сумма:</span
            ><span class="total-stats__value"> 152 212 руб</span>
          </div>
          <div>
            <span class="total-stats__name">Кол-во:</span
            ><span class="total-stats__value"> 24 шт</span>
          </div>
          <div>
            <span class="total-stats__name">Общий вес</span
            ><span class="total-stats__value"> 2 322 кг</span>
          </div>
        </div>
        <div class="total-sum">
          <span>Общая сумма:</span><span>152 212 руб</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppTableOptions from './AppTableOptions.vue'
import tableContent from './data/table/tableContent'
import optionsIcon from '@/assets/SVG/options-cog.svg'
import burgerMenuIcon from '@/assets/SVG/burger-menu.svg'
import moreOptionsIcon from '@/assets/SVG/more-options.svg'

export default {
  name: 'AppTable',
  props: {
    tableHeads: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tableHeaders: this.tableHeads,
      initTableHaders: this.tableHeaders,
      tableContent,
      optionsIcon,
      burgerMenuIcon,
      moreOptionsIcon,
      headerWidths: [],
      resizeIndex: null,
      resizeStartX: null,
      lastHoveredCell: null,
      draggingTableHeaderCell: null,
      initialMouseX: null,
      initialWidth: null,
      showTableOptions: false,
      showSaveChanges: false,

      dragIndex: null,
      dragging: true,
      offsetX: null,
      offsetY: null,
      prevDraggableItem: null,
      prevId: null,
      dragId: null,
      element: null,
      showdraggableBelowContent: true,
    }
  },
  components: {
    AppTableOptions,
  },
  mounted() {
    console.log('TABLE RERENDER')
    this.setInitialHeaderWidths()
    this.getDataFromLocalStorage()
  },
  methods: {
    dragStart(event, key, row, index) {
      const target = event.target.closest('.grab-icon')
      if (!target) {
        event.preventDefault()
        return
      }

      const draggableItem = target.closest('.draggable-item')
      const boundingRect = draggableItem.getBoundingClientRect()
      this.offsetX = event.clientX - boundingRect.left
      this.offsetY = event.clientY - boundingRect.top

      const draggingElement = this.$refs.draggingItem
      draggingElement.innerHTML = draggableItem.innerHTML

      const inputs = draggableItem.querySelectorAll('.input-value')
      const inputsOfDragging = draggingElement.querySelectorAll('.input-value')
      inputsOfDragging.forEach((input, index) => {
        input.setAttribute('value', inputs[index].value)
      })

      draggingElement.style.left = event.clientX - this.offsetX + 'px'
      draggingElement.style.top =
        event.clientY - this.offsetY + window.scrollY + 'px'

      draggingElement.style['z-index'] = 1000
      const id = +draggableItem.getAttribute('data-id')

      this.dragIndex = index
      this.dragId = id

      document.addEventListener('pointermove', this.handleMouseMove)
      document.addEventListener('pointerup', this.handlePointerUp)
    },
    handleMouseMove(event) {
      event.preventDefault()
      this.moveDraggingAt(event)

      this.$refs.draggingItem.style.visibility = 'hidden'
      let elemBelow = document.elementFromPoint(event.clientX, event.clientY)
      this.$refs.draggingItem.style.visibility = 'visible'

      const draggableItemBelow = elemBelow?.closest('.draggable-item')
      const tableBelow = elemBelow.closest('.table')

      if (!draggableItemBelow || !tableBelow) {
        return
      }

      const index = +draggableItemBelow.getAttribute('data-index')
      const id = +draggableItemBelow.getAttribute('data-id')

      if (index === this.dragIndex) {
        draggableItemBelow.classList.add('below-dragging')
        this.innerHTML = draggableItemBelow.innerHTML
        this.showdraggableBelowContent = false
        this.prevDraggableItem = draggableItemBelow
        return
      }

      this.prevDraggableItem.classList.remove('below-dragging')
      const draggedItem = this.tableContent.splice(this.dragIndex, 1)[0]
      this.tableContent.splice(index, 0, draggedItem)
      this.$refs.draggingItem.querySelector('.item-index').innerHTML = index + 1
      this.dragIndex = index
      this.prevId = id
    },
    moveDraggingAt(event) {
      this.$refs.draggingItem.style.left = event.clientX - this.offsetX + 'px'
      this.$refs.draggingItem.style.top =
        event.clientY - this.offsetY + window.scrollY + 'px'
    },
    handlePointerUp() {
      this.$refs.draggingItem.innerHTML = null
      this.prevDraggableItem.classList.remove('below-dragging')
      document.removeEventListener('pointermove', this.handleMouseMove)
      document.removeEventListener('pointerup', this.handlePointerUp)
    },
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
        this.headerWidths[i] = 175
      }
    },
    checkIfMouseOverBorder(event) {
      let target = event.target.closest('.table-header__cell')
      if (!target) return false

      const headerCellRight = target.getBoundingClientRect().right
      const x = event.clientX
      const isOnRightBorder = x >= headerCellRight - 5 && x <= headerCellRight

      this.index = +target.getAttribute('data-index')
      this.bodyCells = document.querySelectorAll(
        '.table-body__cell:nth-child(' + (this.index + 1) + ')',
      )

      if (isOnRightBorder) {
        target.classList.add('hover-right-border')

        this.bodyCells.forEach((cell) => {
          cell.classList.add('hover-right-border')
        })
        this.lastHoveredCell = target

        return true
      } else {
        this.bodyCells.forEach((cell) => {
          cell.classList.remove('hover-right-border')
        })
        target.classList.remove('hover-right-border')
        return false
      }
    },
    handleHeaderMouseMove(event) {
      this.checkIfMouseOverBorder(event)
    },
    handleHeaderMouseOut() {
      if (
        this.lastHoveredCell &&
        this.bodyCells.length &&
        !this.draggingTableHeaderCell
      ) {
        this.hideBorderRightOutline()
      }
    },
    hideBorderRightOutline() {
      this.lastHoveredCell.classList.remove('hover-right-border')
      this.bodyCells.forEach((cell) => {
        cell.classList.remove('hover-right-border')
      })
      this.bodyCells = null
      this.lastHoveredCell = null
    },
    handleHeaderCellMouseDown(event, index) {
      let target = event.target.closest('.table-header__cell')
      if (!target) {
        return
      }
      document.querySelector('body').classList.add('cursor-col-resize')

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
      this.draggingTableHeaderCell = null
      document.querySelector('body').classList.remove('changing-width')
      document.querySelector('body').classList.remove('cursor-col-resize')
      this.hideBorderRightOutline()
      document.removeEventListener('mousemove', this.handleColumnResize)
      document.removeEventListener('mouseup', this.handleMouseUp)
    },
    getCellKey(row, index) {
      const keys = Object.keys(row)
      return keys[index]
    },
    addItemToTable() {
      this.tableContent.push({
        index: this.tableContent.length,
        action: '',
        unit_name: '',
        price: 0,
        amount: 0,
        product_name: '',
        total: 0,
        id: Math.floor(Math.random() * 100000) + 1,
      })
    },
  },
  computed: {
    filteredHeaders() {
      const tableHeaders = this.tableHeaders
      return tableHeaders.filter((header) => header.showTitle)
    },
    filteredTableContent() {
      console.log(this.tableHeaders[0])
      const tableHeaders = this.tableHeaders
      return this.tableContent.map(({ id, ...rest }) => {
        id
        const showedColumns = Object.keys(rest).filter(
          (prop, key) => tableHeaders[key].showTitle,
        )
        const filteredData = showedColumns.reduce((obj, key) => {
          obj[key] = rest[key]
          return obj
        }, {})
        return filteredData
      })
    },
  },
  //   watch: {
  //   tableHeads(newValue, oldValue) {
  //     if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
  //       this.getDataFromLocalStorage();
  //     }
  //   },
  // },
}
</script>

<style scoped>
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

.below-dragging {
  position: relative;
}
.below-dragging::after {
  border-radius: 5px;
  outline: 5px dashed var(--light-grey-blue);
  border-spacing: 3px;
  outline-offset: -3px;
  background-color: #fbfcfd;
  position: absolute;
  content: '';
  /* background: red; */
  width: 100%;
  height: 100%;
}

.grab-icon {
  cursor: grab;
}

.table-header__cell:last-child {
  border-right: none;
}

.table-header__cell {
  border: 1px solid var(--pale-grey-two);
  border-left: none;
  white-space: nowrap;
  overflow: hidden;
  min-width: 30px;
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
  /* width: 120px; */
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

.input-value {
  height: 100%;
  border-radius: 5px;
  /* box-shadow: 0 5px 20px 0 var(--black-7); */
  border: solid 1px var(--pinkish-grey);
  background-color: var(--white);
  display: flex;
  align-items: center;
  padding: 0px 15px 0px;
  width: 100%;
  font-size: 16px;
  /* min-width: max-content; */
}

.input-value:focus {
  border: solid 1px var(--pinkish-grey);
  outline: none;
}

.hover-right-border {
  cursor: col-resize;
  border-right: 1px solid #bcbcbc;
}

.cursor-col-resize * {
  cursor: col-resize;
}

.changing-width * {
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

.dragging-item {
  position: absolute;
  background: var(--white);
  /* border: 3px solid var(--light-grey-blue); */
  display: flex;
  height: 45px;
  white-space: nowrap;
  overflow: hidden;
}

.total-results {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 15px;
}

.total-results__inner-wrapper {
  display: grid;
  height: max-content;
  align-items: column;
  gap: 5px;
  margin-top: -2.5px;
}

.table * {
  /* border: 1px solid black; */
}

.total-stats {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 304px;
  height: 105px;
  padding: 15px;
  border-radius: 5px;
  border: solid 1px var(--pale-grey-two);
  background-color: #fbfcfd;
  font-size: 14px;
}

.total-stats > div {
  height: max-content;
  display: flex;
  justify-content: space-between;
}

.total-stats__name {
  color: var(--warm-grey);
}

.total-stats__value {
  color: var(--black);
}

.total-sum {
  /* margin-top: -42px; */
  width: 304px;
  height: 45px;
  padding: 15px;
  border-radius: 5px;
  border: solid 1px var(--pale-grey-two);
  background-color: #fbfcfd;
  font-size: 14px;
  color: var(--black);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.add-line {
  width: 100%;
  height: 75px;
  padding: 20px 25px;
  border-radius: 10px;
  box-shadow: 0 5px 20px 0 var(--black-7);
  border: solid 1px var(--pale-grey-two);
  background-color: var(--white);
}

.add-line button {
  height: 35px;
  padding: 10px 15px 10px 10px;
  border-radius: 5px;
  background-color: var(--dodger-blue);
  outline: none;
  border: none;
  font-size: 14px;
  display: flex;
  gap: 7px;
  align-items: center;
  color: var(--white);
  cursor: pointer;
}

.plus {
  font-size: 20px;
  color: var(--light-navy);
  /* margin-bottom: -1px; */
}
</style>
