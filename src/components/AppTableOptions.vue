<template>
  <ul class="table-options">
    <li
      @click="showColumns = !showColumns"
      :class="showColumns ? 'swap-places' : 'hover-effect'"
    >
      <span>Отображение столбцов</span>
      <img :src="arrowIcon" alt="arrow icon" class="arrow-icon" />
    </li>
    <!-- <li
      v-if="!showColumns"
      :class="showColumns ? 'swap-places' : 'hover-effect'"
    >
      <span>Порядок столбцов</span>
      <img :src="arrowIcon" alt="arrow icon" class="arrow-icon" />
    </li> -->
    <ul class="display-columns" v-if="showColumns">
      <li v-for="column in tableHeaders" :key="column.id">
        <label class="display-columns__content">
          <input type="checkbox" v-model="column.showTitle" />
          {{ column.title }}
        </label>
      </li>
    </ul>
  </ul>
</template>

<script>
import arrowIcon from '@/assets/SVG/arrow-black.svg'

export default {
  name: 'AppTableOptions',
  props: {
    tableHeaders: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      arrowIcon: arrowIcon,
      showColumns: false,
    }
  },
  watch: {
    tableHeaders: {
      handler(newHeaders) {
        this.$emit('headers-updated', newHeaders)
      },
      deep: true,
    },
  },
}
</script>

<style scoped>
.table-options {
  position: absolute;
  right: 15px;
  top: 28px;
  height: 20px;
  height: max-content;
  border-radius: 5px;
  box-shadow: 0 0 3px 0 var(--black), inset 0 1px 2px 0 var(--white-50);
  background-color: var(--white);
}

.table-options > li {
  font-size: 14px;
  /* gap: 3px; */
  height: 24px;
  width: 185px;
  display: flex;
  align-items: center;
  padding: 0px 10px;
  color: var(--black);
  border-radius: 5px;
  justify-content: space-between;
  cursor: pointer;
}

.table-options > li:hover {
  /* background: var(--pale-grey); */
}

.hover-effect:hover {
  background: var(--pale-grey);
}

.display-columns {
  height: max-content;
  font-size: 14px;
  width: 179px;
  /* display: flex; */
  align-items: center;
  padding: 0px 10px;
  color: var(--black);
  /* cursor: pointer; */
  border-radius: 5px;
  justify-content: space-between;
}

.display-columns li {
  padding: 2px 0px;
}

.display-columns__content {
  display: flex;
  gap: 5px;
  cursor: pointer;
}

.arrow-icon {
  width: 5.3px;
  height: 9px;
  /* background: var(--black); */
}

.swap-places {
  display: flex;
  flex-direction: row-reverse;
}

.swap-places img {
  transform: rotate(180deg);
}
</style>
