<template>
  <div
    :class="[
      'flex items-center justify-between px-6 py-4 transition-all duration-200 cursor-pointer',
      selected
        ? 'bg-yellow-50 border-yellow-400 border-2 rounded-md'
        : isReplacementMode
          ? 'hover:bg-yellow-50'
          : 'bg-[#F7FAFC]',
    ]"
  >
    <!-- 프로필 + 이름/직무 -->
    <div class="flex items-center gap-4">
      <img
        :src="imageUrl"
        alt="profile"
        class="w-11 h-11 rounded-full object-cover"
      />
      <div>
        <div class="flex items-center gap-1">
          <p class="text-sm font-semibold text-gray-800">{{ name }}</p>
          <svg
            v-if="isLeader === 1"
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 16h14v2H5v-2Zm14-8-4 4-3-3-3 3-4-4-1 6h16l-1-6Z" />
          </svg>
        </div>
        <p class="text-xs text-blue-600">{{ role }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  role: String,
  isLeader: Number,
  imageUrl: String,
  selected: {
    type: Boolean,
    default: false,
  },
  isReplacementMode: {
    type: Boolean,
    default: false,
  },
});
</script>
