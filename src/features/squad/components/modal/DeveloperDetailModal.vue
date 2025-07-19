<script setup>
import { ref, watch, nextTick } from "vue";
import { gsap } from "gsap";
import DeveloperDetailView from "@/features/developer/views/DeveloperDetailView.vue";
import { useDeveloperModal } from "@/composable/useDeveloperModal.js";

const { isDeveloperModalOpen, selectedEmployeeId, closeModal } =
  useDeveloperModal();

const modalRef = ref(null);
const visible = ref(false);
const internalEmployeeId = ref(null);

watch(isDeveloperModalOpen, async (isOpen) => {
  if (isOpen && selectedEmployeeId.value) {
    internalEmployeeId.value = selectedEmployeeId.value;
    visible.value = true;

    await nextTick();
    gsap.fromTo(
      modalRef.value,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power2.out",
      },
    );
  } else {
    if (!modalRef.value) return;

    gsap.to(modalRef.value, {
      opacity: 0,
      y: 20,
      scale: 0.95,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        visible.value = false;
        internalEmployeeId.value = null;
      },
    });
  }
});
</script>

<template>
  <Teleport to="body">
    <div
      v-show="visible"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div
        ref="modalRef"
        class="bg-white rounded-xl shadow-xl w-[900px] max-h-[90vh] overflow-y-auto relative p-6"
      >
        <button
          class="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
          @click="closeModal"
        >
          &times;
        </button>

        <DeveloperDetailView
          v-if="internalEmployeeId"
          :employeeId="internalEmployeeId"
          :readonly="true"
          :userModal="true"
          @close="closeModal"
        />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
