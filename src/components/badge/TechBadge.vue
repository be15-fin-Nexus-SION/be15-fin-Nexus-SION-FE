<template>
  <div class="tech-badge">
    <span class="tech-text">{{ label }}</span>

    <div
      v-if="showClose"
      class="flex flex-col justify-center items-center p-[3px] gap-[10px] w-[12px] h-[12px] bg-white/70 rounded-[6px] order-1 grow-0 cursor-pointer"
      @click="$emit('remove')"
    >
      <svg
        width="6"
        height="7"
        viewBox="0 0 6 7"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.53794 1.14199C5.69331 0.955006 5.66856 0.677279 5.48157 0.521915C5.29459 0.366552 5.01686 0.391302 4.8615 0.578287L2.9999 2.81248L1.1383 0.578287C0.98294 0.391302 0.705211 0.366553 0.518227 0.521917C0.331244 0.67728 0.306494 0.955006 0.461857 1.14199L2.42657 3.49992L0.461857 5.85785C0.306494 6.04484 0.331242 6.32257 0.518227 6.47793C0.705213 6.63329 0.98294 6.60854 1.1383 6.42156L2.9999 4.18737L4.8615 6.42156C5.01686 6.60854 5.29459 6.63329 5.48157 6.47793C5.66856 6.32257 5.69331 6.04484 5.53794 5.85785L3.57323 3.49992L5.53794 1.14199Z"
          fill="#505050"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  showClose: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["remove"]);
</script>

<style scoped>
.tech-badge {
  @apply flex items-center justify-center px-[10px] py-[5px] rounded-full bg-[#555555] gap-1.5;
}

.tech-text {
  @apply text-white text-bodySm leading-[17px] font-bold;
}
</style>
