<template>
  <div class="mt-4 space-y-4">
    <div
      v-for="comment in comments"
      :key="comment.commentId"
      class="border border-gray-200 bg-[#F9F9F9] px-4 py-3 rounded-xl relative"
    >
      <!-- 삭제 버튼 (오른쪽 상단) -->
      <button
        v-if="
          String(comment.employeeIdentificationNumber) === String(currentUserId)
        "
        class="absolute top-3 right-3 text-sm text-red-500 hover:underline"
        @click="$emit('request-delete', comment.commentId)"
      >
        삭제
      </button>

      <!-- 이름과 날짜 -->
      <div class="text-sm text-gray-600 mb-1 flex items-center gap-2">
        <span class="font-semibold text-black">{{ comment.employeeName }}</span>
        <span class="text-gray-400 text-xs">{{
          formatDate(comment.createdAt)
        }}</span>
      </div>

      <!-- 내용 -->
      <p class="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
        {{ comment.content }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  comments: {
    type: Array,
    default: () => [],
  },
  currentUserId: {
    type: String,
    required: true,
  },
});

const formatDate = (isoDateStr) => {
  if (!isoDateStr) return "";
  const date = new Date(isoDateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
};
</script>
