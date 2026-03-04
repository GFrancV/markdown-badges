<script setup lang="ts">
import { ref } from "vue";

import ToastComponent from "./ToastComponent.vue";

interface Props {
  name: string;
  url: string;
  category: string;
}

const { name, url, category } = defineProps<Props>();

const isCopied = ref(false);
const toastRef = ref<InstanceType<typeof ToastComponent> | null>(null);

const copy = async () => {
  await navigator.clipboard.writeText(`![${name}](${url})`);
  isCopied.value = true;

  setTimeout(() => {
    isCopied.value = false;
  }, 700);

  toastRef.value?.addToast("Copied to clipboard");
};
</script>

<template>
  <div
    @click="copy"
    class="relative group bg-[#1e1e1e] cursor-pointer text-white rounded-sm border border-transparent transition p-6 text-center flex flex-col hover:bg-fuchsia-300/30 hover:border-fuchsia-200 badget-element h-full"
  >
    <h2 class="text-[#f1f1ef] text-lg font-semibold mt-1 mb-3">
      {{ name }}
    </h2>
    <img
      :src="url"
      :alt="`${name} badge`"
      width="100"
      height="28"
      class="mt-auto h-7 w-auto mx-auto mb-4"
      loading="lazy"
    />
    <div class="mt-2">
      <div
        class="rounded-full border border-neutral-300 px-2 py-1 text-sm text-neutral-300 group-hover:border-fuchsia-300 group-hover:text-fuchsia-300 transition duration-300 w-auto"
      >
        {{ category }}
      </div>
    </div>
    <button
      class="absolute top-0 right-0 m-2 stroke-gray-600 transition duration-300 group-hover:stroke-fuchsia-300"
    >
      <svg
        v-if="!isCopied"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="inherit"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        role="img"
        aria-label="Clipboard badge"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
          d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"
        />
        <path
          d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"
        />
      </svg>
      <svg
        v-else
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="inherit"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
          d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"
        />
        <path
          d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"
        />
        <path d="M9 14l2 2l4 -4" />
      </svg>
    </button>
    <ToastComponent ref="toastRef" />
  </div>
</template>
