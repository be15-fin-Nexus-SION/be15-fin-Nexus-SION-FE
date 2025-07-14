<template>
  <button
    class="flex flex-col justify-center items-center px-[20px] py-[11px] rounded-md transition-colors duration-200"
    :class="[
      bgColorClass,
      hoverColorClass,
      customClass,
      disabled ? 'cursor-not-allowed opacity-50' : '',
    ]"
    :disabled="disabled"
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
  disabled: {
    type: Boolean,
    default: false,
  },
});

function handleClick(event) {
  if (props.disabled) return; // 비활성화 상태에서는 click 무시
  if (props.onClick) {
    props.onClick(event);
  }
}
</script>
