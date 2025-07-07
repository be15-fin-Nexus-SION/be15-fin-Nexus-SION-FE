<script setup>
import { ref } from "vue";
import SquadMemberRenderer from "@/features/squad/components/presentation/SquadMemberRenderer.vue";

const props = defineProps({
  members: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["update:members"]);

function setLeader(target) {
  const updated = props.members.map((m) => ({
    ...m,
    leader: m === target ? !m.leader : false,
  }));
  emit("update:members", updated);
}
</script>

<template>
  <SquadMemberRenderer
    title="스쿼드 구성"
    :members="members"
    :readonly="true"
    @set-leader="setLeader"
  />
</template>
