<script setup>
import { ref, defineExpose } from "vue";

const props = defineProps({
  expanded: Boolean,
  rejectedReason: String,
  toggleInput: Function, // 부모에서 전달한 toggleInput을 받음
});

const rejectReason = ref("");
const showReasonInput = ref(false);
const rootEl = ref(null);
const textareaRef = ref(null);

const toggleInput = props.toggleInput;

// 카드 클릭 시 내부 상태 토글 (외부 expanded에는 영향 X)
const toggle = () => {
  toggleInput(); // 부모에서 전달받은 toggleInput 메서드 실행
};

// 부모 접근용 메서드
const getReason = () => rejectReason.value;
const openReasonInput = () => {
  showReasonInput.value = true;
};

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
  () => rejectReason,
  500, // 500자 제한
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
    </div>

    <div
      class="transition-wrapper"
      :class="expanded || showReasonInput ? 'expanded-slow' : 'collapsed-fast'"
    >
      <div class="inner-content">
        <div v-show="expanded || showReasonInput" class="form-group">
          <!-- 거부 사유 입력 -->
          <textarea
            v-if="!rejectedReason"
            v-model="rejectReason"
            ref="textareaRef"
            class="input-field"
            placeholder="거부 사유를 입력해주세요. 후에 수정할 수 없으니 신중히 입력하세요."
            @click.stop
            @keydown="onDescriptionKeydown"
            maxlength="500"
          />
          <span v-else class="input-field">{{ rejectedReason }}</span>
          <div class="input-counter" v-if="!rejectedReason">
            {{ rejectReason.length }}/500자
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  @apply bg-white px-6 py-5 rounded-xl shadow-base w-full max-w-3xl space-y-4 transition-shadow duration-300 cursor-pointer;
}

.highlight-shadow {
  box-shadow: 0 4px 15px rgba(236, 77, 77, 0.4);
}

.form-group {
  @apply mb-3;
}

.label-required {
  @apply text-sm text-gray-600 block mb-2;
}

.input-field {
  @apply flex w-full border rounded-md p-2 text-sm;
}

.transition-wrapper {
  @apply w-full overflow-hidden;
}

.expanded-slow {
  max-height: 500px;
  transition: max-height 0.4s ease;
}

.collapsed-fast {
  max-height: 0;
  transition: max-height 1.6s ease;
}

.inner-content {
  @apply w-full flex flex-col space-y-4;
}

.input-counter {
  @apply text-right text-xs text-gray-400 mt-1;
}

/* SHAKE 애니메이션 추가 */
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
