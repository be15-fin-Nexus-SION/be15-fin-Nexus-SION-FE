<script setup>
import { ref, nextTick } from "vue";
import BasicModal from "@/components/modal/BasicModal.vue";
import { deleteClient, updateClient } from "@/api/admin.js";
import { showErrorToast, showSuccessToast } from "@/utills/toast.js";
import AdminClientEditModal from "@/features/admin/components/AdminClientEditModal.vue";

const props = defineProps({
  client: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["deleted", "updated"]);

const showMenu = ref(false);
const showEditModal = ref(false);
const selectedClient = ref(null);
const menuRef = ref(null);
const popupStyle = ref({});

const openMenu = async () => {
  showMenu.value = true;

  await nextTick();

  const rect = menuRef.value?.getBoundingClientRect();
  if (rect) {
    const modalWidth = 120;

    popupStyle.value = {
      position: "absolute",
      top: `${rect.top + window.scrollY + rect.height / 2 - 10}px`,
      left: `${rect.left + window.scrollX - modalWidth + 10}px`,
    };
  }
};

const closeMenu = () => {
  showMenu.value = false;
};

const handleEditClick = () => {
  if (!props.client) return;
  selectedClient.value = props.client;
  showEditModal.value = true;
  closeMenu();
};

const handleDelete = async () => {
  try {
    await deleteClient(props.client.clientCode);
    showSuccessToast("고객사 정보를 삭제했습니다.");
    emit("deleted");
  } catch (e) {
    const errorMessage = e.response?.data?.message || "고객사 정보 삭제 실패";
    showErrorToast(errorMessage);
  } finally {
    closeMenu();
  }
};

const formatPhoneNumber = (number) => {
  if (!number) return null;
  const cleaned = number.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
  }
  return number;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const handleUpdate = async (updatedClient) => {
  // contactPerson이 null 또는 빈 문자열일 경우, email, contactNumber도 null로 덮어씀
  const trimmedContactPerson = updatedClient.contactPerson?.trim();
  const isContactPersonEmpty = !trimmedContactPerson;

  const finalPayload = {
    ...updatedClient,
    contactPerson: trimmedContactPerson || null,
    email: isContactPersonEmpty ? null : updatedClient.email?.trim() || null,
    contactNumber: isContactPersonEmpty
      ? null
      : updatedClient.contactNumber?.trim() || null,
  };

  try {
    await updateClient(props.client.clientCode, finalPayload);
    showSuccessToast("고객사 정보가 수정되었습니다.");
    showEditModal.value = false;
    emit("updated");
  } catch (e) {
    const message = e.response?.data?.message || "수정 실패";
    showErrorToast(message);
  }
};
</script>

<template>
  <div class="item-main relative">
    <span class="text">{{ client.companyName }}</span>
    <span class="text2">{{ client.domainName }}</span>
    <span class="text2 text-primary-hover">{{
      client.contactPerson ?? "-"
    }}</span>
    <span class="text text-primary-hover">{{ client.email ?? "-" }}</span>
    <span class="text text-primary-hover">{{
      formatPhoneNumber(client.contactNumber) ?? "-"
    }}</span>
    <span class="menu cursor-pointer" @click="openMenu" ref="menuRef">
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 18.5C11 19.0523 11.4477 19.5 12 19.5C12.5523 19.5 13 19.0523 13 18.5C13 17.9477 12.5523 17.5 12 17.5C11.4477 17.5 11 17.9477 11 18.5Z"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M11 12.5C11 13.0523 11.4477 13.5 12 13.5C12.5523 13.5 13 13.0523 13 12.5C13 11.9477 12.5523 11.5 12 11.5C11.4477 11.5 11 11.9477 11 12.5Z"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M11 6.5C11 7.05228 11.4477 7.5 12 7.5C12.5523 7.5 13 7.05228 13 6.5C13 5.94772 12.5523 5.5 12 5.5C11.4477 5.5 11 5.94772 11 6.5Z"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>

    <Teleport to="body">
      <BasicModal
        v-if="showMenu"
        :style="popupStyle"
        @top="handleEditClick"
        @bottom="handleDelete"
        @close="closeMenu"
      >
        <template #topIcon>
          <svg
            width="15"
            height="17"
            viewBox="0 0 18 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0)">
              <path
                d="M12.7509 0.753906L11.0494 2.64453L15.6197 7.72266L17.3212 5.83203C18.2001 4.85547 18.2001 3.27344 17.3212 2.29687L15.9361 0.753906C15.0572 -0.222656 13.6333 -0.222656 12.7544 0.753906H12.7509ZM10.2548 3.52734L2.05991 12.6367C1.69429 13.043 1.4271 13.5469 1.27944 14.0977L0.0349126 18.7969C-0.052978 19.1289 0.0278813 19.4844 0.24585 19.7266C0.463819 19.9687 0.783741 20.0586 1.07905 19.9648L5.30835 18.582C5.80405 18.418 6.25757 18.1211 6.62319 17.7148L14.8251 8.60547L10.2548 3.52734Z"
                fill="currentColor"
              />
            </g>
            <defs>
              <clipPath id="clip0">
                <rect width="18" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </template>
        <template #bottomIcon>
          <svg
            width="15"
            height="19"
            viewBox="0 0 18 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip1)">
              <path
                d="M1.2 5.4H16.8C16.6 9.9 16.5 11.8 16.2 17.3C16.1 19.2 15.9 20.9 15.4 21.4C14.8 22 13.6 22 13.2 22H4.8C4.3 22 3.3 22 2.6 21.4C2 20.9 1.9 19.2 1.8 17.3C1.5 11.8 1.4 9.9 1.2 5.4Z"
                fill="currentColor"
              />
              <path
                d="M7.35 -0.08H10.65C11.55 -0.08 12.4 0 12.8 1.29H16.2C17 1.29 18 1.5 18 2.3C18 3.1 17 3.3 16.2 3.3H1.8C1 3.3 0 3.1 0 2.3C0 1.5 1 1.29 1.8 1.29H5.2C5.6 0 6.45 -0.08 7.35 -0.08Z"
                fill="currentColor"
              />
              <path
                d="M12.6 9C13.4 9.1 13.7 9.3 13.7 10.2V18C13.7 18.4 13.3 18.8 13.2 18.8C12.8 18.8 12.4 18.7 12.2 18.3V9.3C12.2 9.1 12.3 8.9 12.6 9Z"
                fill="#FFFEFE"
              />
              <path
                d="M8.64 9C9.44 9.1 9.74 9.3 9.74 10.2V18C9.74 18.4 9.34 18.8 9.24 18.8C8.84 18.8 8.44 18.7 8.24 18.3V9.3C8.24 9.1 8.34 8.9 8.64 9Z"
                fill="#FFFEFE"
              />
              <path
                d="M4.68 9C5.48 9.1 5.78 9.3 5.78 10.2V18C5.78 18.4 5.38 18.8 5.28 18.8C4.88 18.8 4.48 18.7 4.28 18.3V9.3C4.28 9.1 4.38 8.9 4.68 9Z"
                fill="#FFFEFE"
              />
            </g>
            <defs>
              <clipPath id="clip1">
                <rect width="18" height="22" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </template>
      </BasicModal>
    </Teleport>

    <AdminClientEditModal
      :show="showEditModal"
      :client="selectedClient"
      :onCancel="closeEditModal"
      :onSubmit="handleUpdate"
    />
  </div>
</template>

<style scoped>
.item-main {
  @apply flex items-center w-full justify-between border-y border-stroke-gray py-[30px] px-[10px] relative;
}

.text {
  @apply w-[140px] text-bodySm break-words text-center;
}

.text2 {
  @apply w-[100px] text-bodySm break-words text-center;
}

.menu {
  @apply w-[30px];
}
</style>
