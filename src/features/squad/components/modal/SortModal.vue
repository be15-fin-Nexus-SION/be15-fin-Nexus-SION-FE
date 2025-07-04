<script setup>
defineProps(["selectedFilters"]);
</script>

<template>
  <div
    id="sortModal"
    class="absolute bg-white border border-gray-200 shadow-md rounded p-4 z-10 w-[350px] right-4"
    style="top: 100%"
    @click.stop
  >
    <h4 class="text-lg font-semibold mb-2">정렬</h4>
    <label class="block font-medium mb-1 ml-0">정렬 기준</label>
    <div class="flex gap-2 mb-3">
      <label v-for="opt in ['순번', '이름', '등급']" :key="opt">
        <input type="radio" :value="opt" v-model="selectedFilters.sortBy" />
        {{ opt }}
      </label>
    </div>

    <label class="block font-medium mb-1 ml-0">정렬 방향</label>
    <div class="flex gap-2">
      <label
        ><input
          type="radio"
          value="오름차순"
          v-model="selectedFilters.sortOrder"
        />
        오름차순</label
      >
      <label
        ><input
          type="radio"
          value="내림차순"
          v-model="selectedFilters.sortOrder"
        />
        내림차순</label
      >
    </div>
  </div>
</template>
