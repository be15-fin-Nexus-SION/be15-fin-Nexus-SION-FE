<script setup>
import SquadMemberRenderer from "@/features/squad/components/presentation/SquadMemberRenderer.vue";
import { computed } from "vue";

const props = defineProps({
  members: {
    type: Array,
    required: true,
  },
  readonly: {
    type: Boolean,
  },
});

const mappedMembers = computed(() =>
  props.members.map(({ memberId, ...rest }) => ({
    ...rest,
    id: memberId,
  })),
);

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
    :members="mappedMembers"
    :readonly="readonly"
    @set-leader="setLeader"
  />
</template>
