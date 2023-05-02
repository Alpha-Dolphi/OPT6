<template>
  <nav class="side-menu">
    <div class="image-container">
      <img :src="logoIcon" alt="my-logo" class="logo" />
    </div>
    <ul class="drop-zone">
      <div v-if="dragging" class="dragging-item" ref="draggingItem"></div>
      <li
        v-for="(category, index) in sideMenuCategories"
        :key="category.id"
        class="draggable-item hover"
        :class="{
          'has-subcategories':
            category.subcategories &&
            category.subcategories.length &&
            category.showSubcategory,
        }"
        @click="
          category.subcategories &&
            (category.showSubcategory = !category.showSubcategory)
        "
        @pointerdown="dragStart($event, index)"
        :data-index="index"
        :data-id="category.id"
      >
        <div class="list-item-category">
          <span>
            <img :src="grabIcon" alt="grab icon" class="grab-icon" />
            {{ category.title }}
          </span>
          <div v-if="category.subcategories && category.subcategories.length">
            <img
              :src="arrowIcon"
              alt="arrow icon"
              class="arrow-icon"
              :class="{ 'arrow-icon-rotated': category.showSubcategory }"
            />
          </div>
        </div>
        <ul
          v-if="
            category.showSubcategory &&
            category.subcategories &&
            category.subcategories.length
          "
        >
          <li
            v-for="(subcategory, subIndex) in category.subcategories"
            :key="subIndex"
            class="list-item-subcategory"
          >
            <span>{{ subcategory }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script>
import logoIcon from '@/assets/SVG/logo.svg'
import arrowIcon from '@/assets/SVG/arrow.svg'
import grabIcon from '@/assets/SVG/burger-menu.svg'
import sideMenuCategories from './data/side-menu/AppSideMenuData.ts'

export default {
  name: 'AppSideMenu',
  data() {
    return {
      logoIcon,
      arrowIcon,
      grabIcon,
      sideMenuCategories,
      dragIndex: null,
      dragging: true,
      offsetX: null,
      offsetY: null,
      prevDraggableItem: null,
      prevId: null,
      dragId: null,
      element: null,
    }
  },
  methods: {
    dragStart(event, index) {
      const target = event.target.closest('.grab-icon')
      if (!target) {
        event.preventDefault()
        return
      }

      const draggableItem = target.closest('.draggable-item')
      const boundingRect = draggableItem.getBoundingClientRect()
      this.offsetX = event.clientX - boundingRect.left
      this.offsetY = event.clientY - boundingRect.top

      this.$refs.draggingItem.innerHTML = draggableItem.innerHTML
      this.$refs.draggingItem.style.left = event.clientX - this.offsetX + 'px'
      this.$refs.draggingItem.style.top = event.clientY - this.offsetY + 'px'
      const id = +draggableItem.getAttribute('data-id')

      this.dragIndex = index
      this.dragId = id

      document.addEventListener('pointermove', this.handleMouseMove)
      document.addEventListener('pointerup', this.handlePointerUp)
    },
    handleMouseMove(event) {
      event.preventDefault()
      this.moveDraggingAt(event)

      this.$refs.draggingItem.hidden = true
      let elemBelow = document.elementFromPoint(event.clientX, event.clientY)
      this.$refs.draggingItem.hidden = false

      const draggableItemBelow = elemBelow?.closest('.draggable-item')
      const sideMenu = elemBelow?.closest('.side-menu')
      if (!sideMenu) {
        return
      }

      if (!draggableItemBelow) {
        this.prevDraggableItem.classList.remove('below-dragging')
        this.$refs.draggingItem.hidden = true
        elemBelow = document.elementFromPoint(event.clientX, event.clientY)
        this.$refs.draggingItem.hidden = false
        this.prevDraggableItem.classList.add('below-dragging')
        this.$refs.draggingItem.hidden = false

        const hiddenItem = elemBelow?.closest('.draggable-item')

        if (!hiddenItem) {
          return
        }

        this.dragId = hiddenItem.getAttribute('data-id')
        this.prevId = this.dragId
        return
      }

      const index = +draggableItemBelow.getAttribute('data-index')
      const id = +draggableItemBelow.getAttribute('data-id')

      if (id === this.prevId) {
        return
      }

      if (index === this.dragIndex) {
        draggableItemBelow.classList.add('below-dragging')
        this.prevDraggableItem = draggableItemBelow
        return
      }

      this.prevDraggableItem.classList.remove('below-dragging')

      const draggedItem = this.sideMenuCategories.splice(this.dragIndex, 1)[0]
      this.sideMenuCategories.splice(index, 0, draggedItem)

      this.element = document.querySelector(`[data-index="${this.dragIndex}"]`)
      this.element.classList.add('below-dragging')

      this.dragIndex = index
      this.prevId = id
    },
    moveDraggingAt(event) {
      this.$refs.draggingItem.style.left = event.clientX - this.offsetX + 'px'
      this.$refs.draggingItem.style.top = event.clientY - this.offsetY + 'px'
    },
    handlePointerUp() {
      this.$refs.draggingItem.innerHTML = null
      this.element.classList.remove('below-dragging')
      document.removeEventListener('pointermove', this.handleMouseMove)
      document.removeEventListener('pointerup', this.handlePointerUp)
    },
  },
}
</script>

<style scoped>
.side-menu {
  width: 229px;
  background-color: var(--dark-blue);
  height: 100vh;
  position: sticky;
  top: 0;
  font-family: Verdana;
}

.image-container {
  display: grid;
  align-items: start;
  justify-content: center;
}

.dragging-item {
  background-color: var(--dark-grey);
  width: 229px;
  position: absolute;
}

.below-dragging {
  visibility: hidden;
}

.dragging-item .grab-icon {
  opacity: 1;
}

.list-item-category {
  width: 229px;
  padding-left: 25px;
  padding-right: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 31px;
  color: var(--white);
  font-size: 14px;
  white-space: nowrap;
}

.hover:hover {
  background-color: var(--dark-grey);
}

.hover:hover .grab-icon {
  opacity: 1;
}

.grab-icon {
  opacity: 0;
  margin-left: -18px;
  padding-right: 3px;
  cursor: grab;
}

.list-item-subcategory {
  height: 31px;
  padding-left: 25px;
  padding-right: 15px;
  font-size: 14px;
  display: flex;
  align-items: center;
  background: var(--dark-blue-grey);
  color: var(--light-grey-blue);
}

.logo {
  padding: 30px;
}

.arrow-icon {
  transform: rotate(90deg);
  transition: transform 0.2s ease;
}

.arrow-icon--rotated {
  transform: rotate(100deg);
}

#iPhone-SE-Copy-32 {
  fill: var(--light-grey-blue);
  stroke: var(--light-grey-blue);
  color: var(--light-grey-blue);
}

.has-subcategories .list-item-category {
  border-left: 2px solid var(--pumpkin-orange);
  background: var(--dark-blue-grey);
  padding-left: 23px;
}

.has-subcategories .arrow-icon {
  transform: rotate(-90deg);
}
.drop-zone {
  min-height: 31px;
  width: 100%;
}
</style>
