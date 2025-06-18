<template>
  <div
    class="w-full h-[51px] px-3 py-2 flex items-center gap-3 rounded-full transition-all duration-200"
    :class="
      highlighted
        ? 'bg-secondary-blue'
        : 'bg-white hover:bg-secondary-blue-hover cursor-pointer'
    "
    @click="goToRoute"
  >
    <span class="text-bodySm font-medium text-[#121217]">{{ label }}</span>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const props = defineProps({
  label: String,
  highlighted: Boolean,
  to: String,
});

const goToRoute = () => {
  if (props.to) {
    router.push(props.to);
  }
};
</script>
