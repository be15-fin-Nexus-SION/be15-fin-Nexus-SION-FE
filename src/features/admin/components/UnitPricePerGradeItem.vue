<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update"]);

const editing = ref(false);
const tempItem = ref({ ...props.item });

const rowRef = ref(null);

watch(
  () => props.item,
  (newVal) => {
    tempItem.value = { ...newVal };
  },
  { deep: true },
);

function startEditing() {
  editing.value = true;
}

function stopEditing() {
  if (
    tempItem.value.productivity !== props.item.productivity ||
    tempItem.value.monthlyUnitPrice !== props.item.monthlyUnitPrice
  ) {
    emit("update", { ...tempItem.value, edited: true });
  }
  editing.value = false;
}

function handleClickOutside(e) {
  if (editing.value && rowRef.value && !rowRef.value.contains(e.target)) {
    stopEditing();
  }
}

function formatPrice(value) {
  if (value === null || value === undefined) return "-";
  return Number(value).toLocaleString();
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <tr class="border-t cursor-pointer" @click="startEditing" ref="rowRef">
    <td class="content">{{ props.item.gradeCode }}</td>
    <td class="content">{{ props.item.ratio }}</td>
    <td class="content">
      <template v-if="editing">
        <input
          type="text"
          v-model="tempItem.productivity"
          class="border rounded px-2 py-1 w-full text-center"
          placeholder="생산성"
          :disabled="tempItem.gradeCode === 'D'"
          @keyup.enter="stopEditing"
        />
      </template>
      <template v-else>
        {{ props.item.productivity ?? "-" }}
      </template>
    </td>
    <td class="content">
      <template v-if="editing">
        <input
          type="text"
          v-model="tempItem.monthlyUnitPrice"
          class="border rounded px-2 py-1 w-full text-center"
          placeholder="단가"
          @keyup.enter="stopEditing"
        />
      </template>
      <template v-else>
        {{ formatPrice(props.item.monthlyUnitPrice) }}
        <span v-if="props.item.edited" class="text-red-500">*</span>
      </template>
    </td>
  </tr>
</template>

<style scoped>
.content {
  @apply items-center text-center h-16 px-4;
}
</style>
