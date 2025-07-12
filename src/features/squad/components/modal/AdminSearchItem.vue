<script setup>
const props = defineProps({
  admin: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["select"]);

function handleSelect() {
  emit("select", props.admin);
}
</script>

<template>
  <div
    class="flex items-center h-[44px] p-2 rounded-md gap-2 cursor-pointer"
    @click="handleSelect"
  >
    <img
      :src="props.admin.profileImageUrl"
      alt="프로필사진"
      class="w-[56px] h-[56px] rounded-full object-cover"
    />
    <div class="text-start text-bodySm leading-snug flex-1">
      <span>{{ props.admin.name }}</span>
    </div>
  </div>
</template>

<style scoped></style>
