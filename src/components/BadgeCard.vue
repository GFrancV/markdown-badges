<script setup lang="ts">
import { ClipboardCheckIcon, ClipboardIcon } from "lucide-vue-next";
import { ref } from "vue";

import ToastComponent from "./ToastComponent.vue";

interface Props {
  badge: Badge;
}

const { badge } = defineProps<Props>();
const { name, url, category } = badge;

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
      class="absolute top-0 right-0 m-2 text-gray-600 transition duration-300 group-hover:text-fuchsia-300 text-xl"
    >
      <ClipboardIcon v-if="!isCopied" :size="22" />
      <ClipboardCheckIcon v-else :size="22" />
    </button>
  </div>
  <ToastComponent ref="toastRef" />
</template>
