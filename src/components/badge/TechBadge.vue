<template>
  <div class="tech-badge">
    <span class="tech-text">{{ label }}</span>
  </div>
</template>

<script setup>
// const props = defineProps({
//   label: {
//     type: String,
//     required: true
//   }
// })
</script>

<style scoped>
.tech-badge {
  @apply flex items-center justify-center px-[10px] py-[5px] h-[27px] rounded-full bg-[#555555];
}

.tech-text {
  @apply text-white text-[14px] leading-[17px] font-bold;
}
</style>
