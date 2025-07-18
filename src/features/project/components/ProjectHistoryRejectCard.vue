<script setup>
import { ref, defineExpose } from "vue";

const props = defineProps({
  expanded: Boolean,
  rejectedReason: String,
  toggleInput: Function,
});

const rejectReason = ref("");
const showReasonInput = ref(false);
const rootEl = ref(null);
const textareaRef = ref(null);

const toggleInput = props.toggleInput;

const toggle = () => {
  toggleInput();
};

const getReason = () => rejectReason.value;
const openReasonInput = () => {
  showReasonInput.value = true;
};

// 동일한 구조의 keydown 핸들러
const createKeydownHandler = (targetRef, getValue, maxLength) => {
  return (e) => {
    const value = getValue();
    const isControlKey =
      e.ctrlKey ||
      e.metaKey ||
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key);

    if (value.length >= maxLength && !isControlKey) {
      e.preventDefault();
      const el = targetRef.value;
      if (el) {
        el.classList.remove("shake");
        void el.offsetWidth;
        el.classList.add("shake");
      }
    }
  };
};

const onDescriptionKeydown = createKeydownHandler(
  textareaRef,
  () => rejectReason.value,
  500,
);

defineExpose({
  getReason,
  openReasonInput,
  $el: rootEl,
});
</script>

<template>
  <div
    ref="rootEl"
    :class="[
      'card-container',
      { 'highlight-shadow': expanded || showReasonInput },
    ]"
    @click="toggle"
  >
    <div class="form-group">
      <label class="label-required">거부 사유</label>

      <div
        class="transition-wrapper"
        :class="
          expanded || showReasonInput ? 'expanded-slow' : 'collapsed-fast'
        "
      >
        <div class="inner-content">
          <div>
            <textarea
              v-if="!rejectedReason"
              v-model="rejectReason"
              ref="textareaRef"
              class="input-field"
              placeholder="거부 사유를 입력해주세요. 후에 수정할 수 없으니 신중히 입력하세요."
              @click.stop
              @keydown="onDescriptionKeydown"
              maxlength="500"
              rows="4"
            />
            <span v-else class="input-field block">{{ rejectedReason }}</span>

            <div class="input-counter" v-if="!rejectedReason">
              {{ rejectReason.length }}/500자
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  @apply px-6 py-5 rounded-xl shadow-base w-full max-w-3xl space-y-4 transition-shadow duration-300 cursor-pointer;
}

.highlight-shadow {
  box-shadow: 0 4px 15px rgba(236, 77, 77, 0.4);
}

.form-group {
  @apply flex flex-col gap-[10px];
}

.label-required {
  @apply text-sm text-gray-600 block mb-2;
}

.label-required span {
  @apply text-red-500 ml-1;
}

.input-field {
  @apply w-full border rounded-md p-2 text-sm;
}

.input-counter {
  @apply text-right text-xs text-gray-400 mt-1;
}

.transition-wrapper {
  @apply w-full;
  overflow-x: visible;
  transition:
    max-height 0.4s ease,
    opacity 0.4s ease,
    transform 0.4s ease;
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
}

.expanded-slow {
  opacity: 1;
  transition: max-height 0.4s ease;
  max-height: 500px;
}

.collapsed-fast {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
  overflow: hidden;
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease 0.1s,
    transform 0.3s ease 0.1s;
}

.inner-content {
  @apply w-full flex flex-col space-y-4;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-4px);
  }
  40% {
    transform: translateX(4px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
  100% {
    transform: translateX(0);
  }
}

.shake {
  animation: shake 0.3s ease-in-out;
}
</style>
