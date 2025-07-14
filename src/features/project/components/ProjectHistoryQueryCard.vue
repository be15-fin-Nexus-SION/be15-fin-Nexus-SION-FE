<script setup>
import { ref } from "vue";

const props = defineProps({
  history: {
    type: Object,
    required: true,
  },
});

const functionTypeNameMap = {
  EI: "외부 입력 (EI)",
  EO: "외부 출력 (EO)",
  EQ: "조회 (EQ)",
  ILF: "내부 논리 파일 (ILF)",
  EIF: "외부 인터페이스 파일 (EIF)",
};

// 카드 열림 여부 (토글용)
const isExpanded = ref(false);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <div
    :class="['card-container', { 'highlight-shadow': isExpanded }]"
    @click="toggleExpand"
  >
    <!-- 항상 보이는 영역 -->
    <div class="form-group">
      <label class="label-required">프로젝트 기능명</label>
      <span class="input-field">
        {{ history.functionName || "-" }}
      </span>
    </div>

    <!-- 토글 애니메이션 영역 -->
    <div
      class="transition-wrapper"
      :class="isExpanded ? 'expanded-slow' : 'collapsed-fast'"
    >
      <div class="inner-content">
        <div class="form-group">
          <label class="label-required">기능 설명</label>
          <span class="input-field">
            {{ history.functionDescription || "-" }}
          </span>
        </div>

        <div class="form-two">
          <div class="form-group">
            <label class="label-required">연관 필드 개수</label>
            <span class="input-field">
              {{ history.det ?? "-" }}
            </span>
          </div>

          <div class="form-group">
            <label class="label-required">연관 엔티티 개수</label>
            <span class="input-field">
              {{ history.ftr ?? "-" }}
            </span>
          </div>

          <div class="form-group">
            <label class="label-required">기능 유형</label>
            <span class="input-field">
              {{
                functionTypeNameMap[history.functionType] ||
                history.functionType ||
                "-"
              }}
            </span>
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
  box-shadow: 0 4px 15px rgba(101, 116, 246, 0.4); /* primary.DEFAULT (#6574F6) 기반 */
}

.form-group {
  @apply mb-3;
}

.form-two {
  @apply grid grid-cols-3 gap-2;
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
  transition: max-height 0.3s ease;
}

.inner-content {
  @apply w-full flex flex-col space-y-4;
}
</style>
