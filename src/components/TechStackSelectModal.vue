<template>
  <div class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg w-full max-w-xl p-6 space-y-4">
      <h2 class="text-xl font-semibold">기술</h2>

      <!-- 검색창 -->
      <input
          v-model="search"
          type="text"
          placeholder="기술 검색"
          class="w-full border rounded-md p-2"
      />

      <!-- 선택된 기술 -->
      <div class="flex flex-wrap gap-2">
        <span
            v-for="(tech, idx) in selected"
            :key="idx"
            class="bg-gray-100 rounded-full px-3 py-1 text-xs flex items-center gap-1"
        >
          {{ tech }}
          <button @click="toggleTech(tech)" class="ml-1 text-gray-800">×</button>
        </span>
      </div>

      <!-- 기술 목록 -->
      <div class="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
        <button
            v-for="tech in filteredList"
            :key="tech"
            @click="toggleTech(tech)"
            :class="[
            'px-3 py-1 rounded-full text-xs',
            selected.includes(tech) ? 'bg-primary text-white border border-gray-300' : 'bg-white text-gray-700 border border-gray-300'
          ]"
        >
          {{ tech }}
        </button>
      </div>

      <!-- 하단 버튼 -->
      <div class="flex justify-between items-center mt-4">
        <button
            class="flex flex-col justify-center border border-gray-300 items-center px-[20px] py-[11px] rounded-md transition-colors duration-200"
            @click="reset"
        >
            <span class="text-gray-500 text-bodySm font-bold leading-[17px]">
              초기화
            </span>
        </button>
        <div class="flex space-x-2">
          <button
              class="flex flex-col justify-center border border-gray-300 items-center px-[20px] py-[11px] rounded-md transition-colors duration-200"
              @click="$emit('close')"
          >
            <span class="text-gray-500 text-bodySm font-bold leading-[17px]">
              닫기
            </span>
          </button>
          <PrimaryButton label="적용" @click="apply"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import PrimaryButton from "@/components/button/PrimaryButton.vue";

const props = defineProps({
  allTechStacks: Array,           // 전체 기술 스택 리스트 (문자열 배열)
  initialSelected: Array          // 초기 선택된 스택 (문자열 배열)
});
const emit = defineEmits(['apply', 'close']);

const selected = ref([...props.initialSelected]);
const search = ref('');

const filteredList = computed(() => {
  const keyword = search.value.trim().toLowerCase();
  return props.allTechStacks.filter(tech =>
      tech.toLowerCase().includes(keyword)
  );
});

function toggleTech(tech) {
  const idx = selected.value.indexOf(tech);
  if (idx >= 0) selected.value.splice(idx, 1);
  else selected.value.push(tech);
}

function reset() {
  selected.value = [];
}

function apply() {
  emit('apply', selected.value); // 선택된 기술 전달
  emit('close');
}
</script>