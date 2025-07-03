<script setup>
import UnitPricePerGradeItem from "@/features/admin/components/UnitPricePerGradeItem.vue";

const props = defineProps({
  grades: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update"]);

function handleUpdate(updatedItem) {
  emit("update", updatedItem);
}
</script>

<template>
  <div class="space-y-8 justify-center">
    <table
      class="w-full border-neutral-400 rounded-lg overflow-hidden shadow-md"
    >
      <thead class="bg-gray-200">
        <tr>
          <th class="w-[120px]"><div class="content">등급</div></th>
          <th class="w-[120px]"><div class="content">비율(%)</div></th>
          <th class="w-[120px]"><div class="content">생산성</div></th>
          <th class="w-[120px]"><div class="content">단가(만원)</div></th>
        </tr>
      </thead>
      <tbody>
        <UnitPricePerGradeItem
          v-for="(item, index) in props.grades"
          :key="item.gradeCode || index"
          :item="item"
          @update="handleUpdate"
        />
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.content {
  @apply py-4 px-4 text-center items-center;
}
</style>
