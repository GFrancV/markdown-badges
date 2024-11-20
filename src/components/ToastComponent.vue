<script lang="ts" setup>
import { reactive } from "vue";
import CrossIcon from "../icons/CrossIcon.vue";

const toasts = reactive<{ id: number; message: string }[]>([]);

function addToast(message: string) {
  const id = Date.now();
  toasts.push({ id, message });

  setTimeout(() => {
    removeToast(id);
  }, 5000);
}

function removeToast(id: number) {
  const index = toasts.findIndex((toast) => toast.id === id);
  if (index !== -1) toasts.splice(index, 1);
}

defineExpose({
  addToast,
});
</script>

<template>
  <div class="fixed bottom-4 right-4 flex z-50">
    <transition-group name="fade" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="transition flex items-center w-full max-w-xs p-4 rounded shadow text-[#f1f1ef] bg-[#121212] border border-white/15 mb-4"
        role="alert"
      >
        <div
          class="inline-flex items-center justify-center flex-shrink-0 w-7 h-7 text-fuchsia-300 rounded-full border border-fuchsia-300 p-1.5"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>

          <span class="sr-only">Check icon</span>
        </div>
        <div class="ms-3 text-sm font-normal">
          {{ toast.message }}
        </div>
        <button
          @click="removeToast(toast.id)"
          type="button"
          class="transition ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex items-center justify-center h-8 w-8 text-neutral-300 hover:text-fuchsia-300 bg-[#121212] hover:bg-fuchsia-300/30"
          data-dismiss-target="#toast-default"
          aria-label="Close"
        >
          <span class="sr-only">Close</span>
          <CrossIcon class="size-3" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style>
.toast {
  transition: opacity 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
