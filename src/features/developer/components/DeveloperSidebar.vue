<template>
  <aside
    class="min-w-[230px] max-w-[230px] min-h-screen bg-white border-r border-[#EEEEEE] flex flex-col justify-between items-start p-4"
  >
    <div class="flex flex-col gap-4 w-full">
      <SidebarItem
        v-for="item in items"
        :key="item.to"
        :label="item.label"
        :highlighted="item.highlighted"
        :to="item.to"
      />
    </div>
  </aside>
</template>

<script setup>
import SidebarItem from "@/components/side/SidebarItem.vue";
defineProps({ items: Array });
</script>
