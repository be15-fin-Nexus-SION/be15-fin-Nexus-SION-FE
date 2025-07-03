<script setup>
import ScoreListItem from "./ScoreListItem.vue";
import { computed } from "vue";

const props = defineProps({
  scores: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["add", "update", "delete"]);

const localScores = computed(() => props.scores); // 단순히 바인딩만

function addNewRow() {
  const lastItem = props.scores[props.scores.length - 1];
  const newMinYears =
    lastItem?.maxYears != null ? lastItem.maxYears + 1 : lastItem.minYears + 1;

  if (lastItem.maxYears == null) {
    lastItem.maxYears = lastItem.minYears;
    emit("update", lastItem);
  }

  const newItem = {
    id: Date.now(), // id 없으면 고유 식별용
    minYears: newMinYears,
    maxYears: null,
    score: 0,
    edited: false,
  };
  emit("add", newItem);
}

function updateItem(updatedItem) {
  emit("update", updatedItem);
}

function deleteItem(deletedItem) {
  emit("delete", deletedItem); // 전체 리스트를 업데이트
}
</script>

<template>
  <div class="space-y-8 justify-center">
    <table
      class="w-full border-neutral-400 rounded-lg overflow-hidden shadow-md"
    >
      <thead class="bg-gray-200">
        <tr>
          <th class="w-[120px]"><div class="content">년차</div></th>
          <th class="w-[120px]"><div class="content">초기점수</div></th>
          <th class="w-[80px]"><div class="text-center">비고</div></th>
        </tr>
      </thead>
      <tbody>
        <ScoreListItem
          v-for="(item, index) in localScores"
          :key="item.id || index"
          v-model:item="localScores[index]"
          :index="index"
          @update="updateItem"
          @delete="deleteItem"
        />
      </tbody>
    </table>

    <div class="flex justify-center">
      <button
        @click="addNewRow"
        class="w-14 h-14 flex items-center justify-center bg-primary text-white text-2xl rounded-full shadow-md"
      >
        +
      </button>
    </div>
  </div>
</template>

<style scoped>
.content {
  @apply py-4 px-4 text-center items-center;
}
</style>
