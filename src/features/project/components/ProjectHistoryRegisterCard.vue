<script setup>
import { reactive, watch, computed, ref, onMounted } from "vue";
import TechBadge from "@/components/badge/TechBadge.vue";
import { fetchFunctionTypes } from "@/api/project";

const props = defineProps({
  modelValue: Object,
  errorMessages: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(["update:modelValue", "remove", "open-tech-modal"]);

const form = reactive({
  functionName: "",
  functionDescription: "",
  functionType: "",
  det: 0,
  ftr: 0,
  techStackNames: [],
});

const functionTypeOptions = ref([]);

// 영어 → 한글 라벨 매핑
const functionTypeNameMap = {
  EI: "외부 입력 (EI)",
  EO: "외부 출력 (EO)",
  EQ: "조회 (EQ)",
  ILF: "내부 논리 파일 (ILF)",
  EIF: "외부 인터페이스 파일 (EIF)",
};

const loadFunctionTypes = async () => {
  try {
    const res = await fetchFunctionTypes();
    functionTypeOptions.value = res.data.data.map((item) => ({
      code: item.code,
      name: functionTypeNameMap[item.code] || item.code,
    }));
  } catch (e) {
    console.error("기능 유형 목록 조회 실패:", e);
  }
};

onMounted(() => {
  loadFunctionTypes();
});

watch(
  () => props.modelValue,
  (newVal) => Object.assign(form, newVal),
  { immediate: true, deep: true },
);

watch(form, () => emit("update:modelValue", form), { deep: true });

const inputRef = ref(null);
const textareaRef = ref(null);

const emitRemove = () => emit("remove");
const removeTechStack = (index) => form.techStackNames.splice(index, 1);

const firstErrorMessage = computed(() => {
  const messages = Object.values(props.errorMessages);
  return messages.length > 0 ? messages[0] : null;
});

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

const onFunctionNameKeydown = createKeydownHandler(
  inputRef,
  () => form.functionName,
  50,
);
const onDescriptionKeydown = createKeydownHandler(
  textareaRef,
  () => form.functionDescription,
  500,
);
</script>

<template>
  <div class="card-container">
    <div class="form-group">
      <label class="label-required">기능명<span>*</span></label>
      <input
        ref="inputRef"
        v-model="form.functionName"
        @keydown="onFunctionNameKeydown"
        type="text"
        placeholder="기능명을 입력하세요"
        maxlength="50"
        class="input-field"
        required
      />
      <div class="input-counter">{{ form.functionName.length }}/50자</div>
    </div>

    <div class="form-group">
      <label class="label-required">기능 설명<span>*</span></label>
      <textarea
        ref="textareaRef"
        v-model="form.functionDescription"
        @keydown="onDescriptionKeydown"
        placeholder="개발한 기능 구현을 자세히 설명하세요. 등록 후에는 수정이 불가하니 등록 전에 다시 한 번 확인하세요."
        class="input-field"
        rows="4"
        maxlength="500"
      />
      <div class="input-counter">
        {{ form.functionDescription.length }}/500자
      </div>
    </div>

    <div class="form-two">
      <div class="form-group">
        <label class="label-required">연관 필드 개수</label>
        <input
          v-model.number="form.det"
          type="number"
          min="0"
          class="w-full border rounded-md p-2 text-sm"
          required
        />
      </div>

      <div class="form-group">
        <label class="label-required">연관 엔티티 개수</label>
        <input
          v-model.number="form.ftr"
          type="number"
          min="0"
          class="w-full border rounded-md p-2 text-sm"
          required
        />
      </div>

      <div class="form-group">
        <label class="label-required">기능 유형<span>*</span></label>
        <select
          v-model="form.functionType"
          class="w-full border rounded-md p-2 text-sm"
          required
        >
          <option value="">선택</option>
          <option
            v-for="option in functionTypeOptions"
            :key="option.code"
            :value="option.code"
          >
            {{ option.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label class="label-required">기술 스택<span>*</span></label>
      <div class="badge-container">
        <TechBadge
          v-for="(tech, idx) in form.techStackNames"
          :key="tech"
          :label="tech"
          :showClose="true"
          @remove="removeTechStack(idx)"
        />
      </div>
      <button
        @click="emit('open-tech-modal', form.techStackNames)"
        type="button"
        class="tech-button"
      >
        + 기술 추가
      </button>
    </div>

    <div class="flex justify-end">
      <button @click="emitRemove" type="button" class="delete-button">
        삭제
      </button>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  @apply bg-white p-8 rounded-xl shadow-base w-full max-w-3xl space-y-6;
}

.form-group {
  @apply mb-4;
}

.form-two {
  @apply grid grid-cols-3 gap-2;
}

.label-required {
  @apply text-sm text-gray-600 block mb-3;
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

.badge-container {
  @apply flex flex-wrap gap-2 mb-2;
}

.error-message {
  @apply text-sm text-red-500;
}

.delete-button {
  @apply text-sm text-red-500 hover:underline;
}

.tech-button {
  @apply border px-3 py-1 rounded-md text-sm text-gray-600 hover:bg-gray-50;
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
