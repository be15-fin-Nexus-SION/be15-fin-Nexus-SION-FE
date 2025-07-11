import { ref } from "vue";

const isDeveloperModalOpen = ref(false);
const selectedEmployeeId = ref(null);

export function useDeveloperModal() {
  function openModal(employeeId) {
    selectedEmployeeId.value = employeeId;
    isDeveloperModalOpen.value = true;
  }

  function closeModal() {
    selectedEmployeeId.value = null;
    isDeveloperModalOpen.value = false;
  }

  return {
    isDeveloperModalOpen,
    selectedEmployeeId,
    openModal,
    closeModal,
  };
}
