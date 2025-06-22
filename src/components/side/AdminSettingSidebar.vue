<template>
  <aside
    class="min-w-[230px] min-h-screen bg-white border-r border-[#EEEEEE] flex flex-col justify-between items-start p-4"
  >
    <div class="flex flex-col gap-4 w-full">
      <SidebarItem
        v-for="(item, index) in items"
        :key="index"
        :label="item.label"
        :highlighted="item.highlighted"
      />
    </div>
  </aside>
</template>

<script setup>
import SidebarItem from "./SidebarItem.vue";
defineProps({ items: Array });
</script>
