<template>
  <div
    class="grid grid-cols-[60px_40px_50px_190px] items-center gap-6 px-6 py-4 bg-white rounded hover:bg-gray-50 cursor-pointer custom-shadow"
    @click="$emit('click')"
  >
    <!-- 사번 (앞 4글자 + *** + 뒤 3글자) -->
    <div class="text-sm text-gray-600 font-medium text-left truncate">
      {{
        freelancer.freelancerId
          ? freelancer.freelancerId.slice(0, 3) +
            freelancer.freelancerId.slice(-3)
          : ""
      }}
    </div>

    <!-- 프로필 -->
    <div>
      <img
        :src="
          freelancer.profileImageUrl ||
          `https://api.dicebear.com/9.x/notionists/svg?seed=${freelancer.freelancerId}`
        "
        class="w-10 h-10 rounded-full object-cover shrink-0"
        alt="프로필"
      />
    </div>

    <!-- 이름 -->
    <div class="text-sm font-medium truncate">
      {{ freelancer.name }}
    </div>

    <!-- 이메일 -->
    <div class="text-sm text-gray-600 text-left truncate">
      {{ freelancer.email }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  freelancer: Object,
});
</script>

<style scoped>
.custom-shadow {
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.25);
}
</style>
