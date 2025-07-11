<script setup>
import NotificationItem from "@/features/notification/components/NotificationItem.vue";

const { notifications } = defineProps({
  notifications: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["close"]);
</script>

<template>
  <div class="space-y-4 max-height overflow-y-auto">
    <NotificationItem
      @close="emit('close')"
      v-for="notification in notifications"
      :key="notification.notificationId"
      :notification="notification"
    />
  </div>
</template>

<style scoped></style>
