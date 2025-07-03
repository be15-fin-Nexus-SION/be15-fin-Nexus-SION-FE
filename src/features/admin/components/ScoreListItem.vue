<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  index: Number,
});

const emit = defineEmits(["update", "delete"]);

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
    tempItem.value.minYears !== props.item.minYears ||
    tempItem.value.maxYears !== props.item.maxYears ||
    tempItem.value.score !== props.item.score
  ) {
    const updatedItem = { ...tempItem.value, edited: true };
    emit("update:item", updatedItem);
    emit("update", updatedItem);
  }
  editing.value = false;
}

function handleClickOutside(e) {
  if (editing.value && rowRef.value && !rowRef.value.contains(e.target)) {
    stopEditing();
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <tr class="border-t" @click="startEditing" ref="rowRef">
    <td class="content">
      <template v-if="editing">
        <div class="flex items-center justify-center gap-1">
          <input
            type="text"
            v-model.number="tempItem.minYears"
            class="border rounded px-2 py-1 w-full text-center"
            placeholder="min"
          />
          <span>-</span>
          <input
            type="text"
            v-model.number="tempItem.maxYears"
            class="border rounded px-2 py-1 w-full text-center"
            placeholder="max"
          />
        </div>
      </template>
      <template v-else>
        {{ props.item.minYears }} - {{ props.item.maxYears ?? "이상" }}
      </template>
    </td>
    <td class="content">
      <template v-if="editing">
        <input
          type="text"
          v-model.number="tempItem.score"
          class="border rounded px-2 py-1 w-full text-center"
          placeholder="score"
          @keyup.enter="stopEditing"
        />
      </template>
      <template v-else>
        {{ props.item.score }}
        <span v-if="props.item.edited" class="text-red-500">*</span>
      </template>
    </td>
    <td class="text-center">
      <button
        @click.stop="emit('delete', props.item)"
        class="text-red-500 hover:text-red-700"
      >
        삭제
      </button>
    </td>
  </tr>
</template>

<style scoped>
.content {
  @apply py-4 px-4 text-center;
  cursor: pointer;
}
</style>
