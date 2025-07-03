<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { showErrorToast } from "@/utills/toast";
import { getAllDomains } from "@/api/admin.js";
import InputSearchBar from "@/components/searchBar/InputSearchBar.vue";
import { isKoreanChar } from "@/utills/hangul";
import PrimaryButton from "@/components/button/PrimaryButton.vue";

const props = defineProps({
  show: Boolean,
  onSubmit: Function,
  onCancel: Function,
});

const form = ref({
  companyName: "",
  domainName: "",
  contactPerson: "",
  email: "",
  contactNumber: "",
});

const isContactEntered = computed(() => form.value.contactPerson.trim() !== "");

const domainOptions = ref([]);
const searchInput = ref("");

// 도메인 목록 API
onMounted(async () => {
  try {
    const res = await getAllDomains();
    const domains = res.data.data.domains;

    const koreanDomains = domains
      .filter((d) => isKoreanChar(d[0]))
      .sort((a, b) => a.localeCompare(b, "ko"));
    const englishDomains = domains
      .filter((d) => !isKoreanChar(d[0]))
      .sort((a, b) => a.localeCompare(b, "en"));

    domainOptions.value = [...koreanDomains, ...englishDomains];
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "도메인 목록을 불러오지 못했습니다.";
    showErrorToast(errorMessage);
  }
});

// TechStackSearchBar의 선택된 값 → form.domainName 반영
function handleDomainSelected(domain) {
  form.value.domainName = domain;
  searchInput.value = domain;
}

// 직접 입력도 반영
watch(searchInput, (val) => {
  form.value.domainName = val;
});

watch(
  () => props.show,
  (val) => {
    if (!val) {
      form.value = {
        companyName: "",
        domainName: "",
        contactPerson: "",
        email: "",
        contactNumber: "",
      };
      searchInput.value = "";
    }
  },
);

const submit = () => {
  const { companyName, domainName, contactPerson, email, contactNumber } =
    form.value;

  if (!companyName.trim() || !domainName.trim()) {
    showErrorToast("고객사명과 도메인은 필수입니다.");
    return;
  }

  if (contactPerson.trim() && !email.trim() && !contactNumber.trim()) {
    showErrorToast(
      "담당자 이름을 입력한 경우 이메일 또는 전화번호 중 하나는 필수입니다.",
    );
    return;
  }

  const payload = {
    companyName: companyName.trim(),
    domainName: domainName.trim(),
    contactPerson: contactPerson.trim() || null,
    email: email.trim() || null,
    contactNumber: contactNumber.trim() || null,
  };

  props.onSubmit?.(payload);
};
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay">
      <div class="client-modal">
        <div class="modal-title">고객사 정보 등록</div>

        <input
          v-model="form.companyName"
          placeholder="고객사 명 *"
          class="modal-input"
        />

        <!-- ▼ 자동완성 기반 도메인 입력 -->
        <InputSearchBar
          v-model="searchInput"
          :options="domainOptions"
          placeholder="해당 도메인 *"
          @search="handleDomainSelected"
        />

        <input
          v-model="form.contactPerson"
          placeholder="담당자 이름 (선택)"
          class="modal-input"
        />

        <div
          class="transition-wrapper"
          :class="isContactEntered ? 'expanded-slow' : 'collapsed-fast'"
        >
          <div class="inner-content">
            <div
              class="warning-wrapper"
              :class="
                form.contactPerson.trim() &&
                !form.email.trim() &&
                !form.contactNumber.trim()
                  ? 'expanded-warning'
                  : 'collapsed-warning'
              "
            >
              <p class="text-warning text-bodySm">
                담당자 입력 시 이메일 또는 전화번호는 필수 입력입니다.
              </p>
            </div>
            <div class="email-phone">
              <input
                v-model="form.email"
                placeholder="이메일"
                class="modal-input"
              />
              <input
                v-model="form.contactNumber"
                placeholder="전화번호 ('-' 없이 숫자만 입력)"
                class="modal-input"
              />
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <PrimaryButton
            label="취소"
            bg-color-class="bg-natural-gray"
            hover-color-class="hover:bg-natural-gray-hover"
            text-color-class="text-black"
            @click="props.onCancel"
          />
          <PrimaryButton label="저장" @click="submit" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center;
}

.client-modal {
  @apply flex flex-col w-[500px] items-start p-5 gap-[10px] bg-white shadow-elevated rounded-md relative;
  overflow: hidden;
}

.modal-title {
  @apply text-[20px] text-black;
}

.modal-input {
  @apply w-full px-[15px] py-[18px] border border-natural-gray-hover rounded-md text-bodyMd text-primary-hover;
}

.modal-actions {
  @apply flex flex-row justify-end items-start gap-[10px] w-full;
}

.text-warning {
  @apply px-[5px] text-semantic-warning;
  margin: 0;
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
  @apply w-full flex flex-col;
}

.warning-wrapper {
  overflow: hidden;
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease,
    margin 0.3s ease,
    padding 0.3s ease;
}

.expanded-warning {
  max-height: 22px;
  opacity: 1;
  margin-bottom: 6px;
  padding-top: 0;
  padding-bottom: 0;
}

.collapsed-warning {
  max-height: 0;
  opacity: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.email-phone {
  @apply w-full flex flex-col gap-[10px];
}
</style>
