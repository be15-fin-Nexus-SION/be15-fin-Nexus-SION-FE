<template>
  <button
    class="flex flex-col justify-center items-center px-[20px] py-[11px] rounded-md transition-colors duration-200"
    :class="[bgColorClass, hoverColorClass, customClass]"
    @click="handleClick"
  >
    <span :class="[textColorClass, 'text-bodySm font-bold leading-[17px]']">
      {{ label }}
    </span>
  </button>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  bgColorClass: {
    type: String,
    default: "bg-primary",
  },
  hoverColorClass: {
    type: String,
    default: "hover:bg-primary-hover",
  },
  textColorClass: {
    type: String,
    default: "text-white",
  },
  customClass: {
    type: String,
    default: "",
  },
  onClick: {
    type: Function,
    default: null,
  },
});

function handleClick(event) {
  if (props.onClick) {
    props.onClick(event);
  }
}
</script>
