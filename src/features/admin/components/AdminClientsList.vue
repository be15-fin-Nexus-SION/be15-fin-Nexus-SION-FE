<script setup>
import AdminClientItem from "./AdminClientItem.vue";

const props = defineProps({
  clients: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="main">
    <div class="header">
      <span class="header-text">고객사명</span>
      <span class="header-text2">도메인</span>
      <span class="header-text2">담당자</span>
      <span class="header-text">담당자 이메일</span>
      <span class="header-text">담당자 전화번호</span>
      <div class="header-menu"></div>
    </div>

    <template v-if="clients.length > 0">
      <AdminClientItem
        v-for="client in clients"
        :key="client.clientCode"
        :client="client"
        @deleted="$emit('deleted')"
        @updated="$emit('updated')"
      />
    </template>
    <div v-else class="empty-message">고객사 정보가 없습니다.</div>
  </div>
</template>

<style scoped>
.main {
  @apply box-border flex flex-col bg-[#F7FAFC]
  border border-stroke-gray rounded-lg pt-[20px];
}

.header {
  @apply flex items-center w-full justify-between px-[10px] pb-[16px];
}

.header-text {
  @apply w-[140px] flex items-center justify-center text-bodySm;
}

.header-text2 {
  @apply w-[100px] flex items-center justify-center text-bodySm;
}

.header-menu {
  @apply w-[30px];
}

.empty-message {
  @apply w-full text-center text-bodySm text-gray-500 py-[20px];
}
</style>
