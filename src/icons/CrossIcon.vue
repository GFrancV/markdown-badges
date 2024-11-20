<script lang="ts" setup>
interface Props {
  class?: string;
}

const props = defineProps<Props>();
const className = props.class || "";
</script>

<template>
  <svg
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    :class="className"
    role="img"
    aria-label="Cross icon"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
</template>
