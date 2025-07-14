<script setup>
import AdminSearchItem from "@/features/squad/components/modal/AdminSearchItem.vue";

const props = defineProps({
  adminList: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["select"]);
</script>

<template>
  <div class="space-y-4 max-height">
    <AdminSearchItem
      v-for="admin in adminList"
      :key="admin.employeeId"
      :admin="admin"
      @select="emit('select', $event)"
    />
  </div>
</template>

<style scoped></style>
