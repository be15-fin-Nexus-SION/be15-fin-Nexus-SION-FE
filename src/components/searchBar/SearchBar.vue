<script setup>
import { ref } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: "검색어를 입력하세요",
  }
})

const emit = defineEmits(['search'])
const searchInput = ref("")

function triggerSearch() {
  const keyword = searchInput.value.trim()
  if (keyword) emit('search', keyword)
}
</script>

<template>
  <div class="search-bar-wrapper">
    <div class="search-bar">
      <input
          type="text"
          :placeholder="placeholder"
          v-model="searchInput"
          class="search-input"
          @keyup.enter="triggerSearch"
      />
      <svg
          class="search-icon cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          @click="triggerSearch"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.search-bar-wrapper {
  position: relative;
  width: 100%;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px;
  gap: 10px;
  width: 100%;
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 4px;
}

.search-input {
  width: 100%;
  border: none;
  outline: none;
  font-family: "Inter", sans-serif;
  font-size: 14px;
  color: #000;
  background-color: transparent;
}

.search-icon {
  flex-shrink: 0;
  color: #000;
}
</style>