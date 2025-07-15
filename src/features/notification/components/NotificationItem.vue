<script setup>
import { goToRelatedPage, timeAgo } from "@/composable/useNotification.js";

const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);
</script>

<template>
  <div
    class="flex items-center h-[44px] p-2 border border-stroke-gray rounded-md gap-2 cursor-pointer"
    @click="goToRelatedPage(props.notification)"
  >
    <div class="text-start text-bodySm leading-snug flex-1">
      <span v-if="!props.notification.isRead" class="text-red-500">* </span>
      <span>{{ props.notification.message }}</span>
      <span class="text-gray-300 pl-1">{{ timeAgo }}</span>
    </div>
  </div>
</template>

<style scoped></style>
