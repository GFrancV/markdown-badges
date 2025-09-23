<script setup lang="ts">
import { computed, ref } from "vue";
import { getIcons } from "../api/simpleIcons";
import ToastComponent from "./ToastComponent.vue";

const simpleIcons = [
  ...new Set((await getIcons()).map((icon) => icon.title)),
].flat();

const toastRef = ref<InstanceType<typeof ToastComponent> | null>(null);

const name = ref<string>("GitHub");
const logo = ref<string>("github");
const logocolor = ref<string>("#ffffff");
const labelColor = ref<string>("#000000");
const rightcolor = ref<string>("#000000");
const showResults = ref<boolean>(false);

const searchResults = computed(() =>
  simpleIcons.filter((icon) =>
    icon.toLowerCase().includes(logo.value.toLowerCase())
  )
);

const copyToClipboard = async (value: string, event: Event) => {
  navigator.clipboard.writeText(value);
  toggleIcon(event.currentTarget as HTMLButtonElement);
  toastRef.value?.addToast("Copied to clipboard");
};

const toggleIcon = (buttonElement: HTMLButtonElement, delay: number = 1000) => {
  buttonElement.innerHTML =
    '<svg  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="inherit" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path d="M9 14l2 2l4 -4" /></svg>';
  setTimeout(() => {
    buttonElement.innerHTML =
      '<svg  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="inherit" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /></svg>';
  }, delay);
};

const badgeUrl = computed(
  () =>
    `https://img.shields.io/badge/${name.value}-1000?style=for-the-badge&logo=${logo.value}&logoColor=${logocolor.value.substring(1)}&labelColor=${labelColor.value.substring(1)}&color=${rightcolor.value.substring(1)}`
);

const markdownCode = computed(() => {
  return `[![${name.value}](${badgeUrl.value})`;
});
const imgCode = computed(() => {
  return `<img src="${badgeUrl.value}" alt="${name.value} badge">`;
});
</script>

<template>
  <section class="grid md:grid-cols-2 gap-12">
    <div>
      <div class="mb-6">
        <label
          class="text-2xl font-semibold mb-2 inline-block w-full text-[#f1f1ef]"
          for="badgeName"
        >
          Badge name
        </label>
        <input
          v-model="name"
          id="badgeName"
          class="block bg-[#1e1e1e] rounded-sm border-0 text-[#f1f1ef] focus:ring focus:ring-fuchsia-200 placeholder:text-neutral-600 shadow-lg py-2 px-3 w-full"
          type="text"
          placeholder="Enter badge name"
          autocomplete="off"
          aria-label="Badge name"
        />
      </div>
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label
            class="text-2xl font-semibold text-[#f1f1ef] mb-2 inline-block w-full"
            for="logoColor"
          >
            Logo color
          </label>
          <input
            v-model="logocolor"
            id="logoColor"
            class="block bg-[#1e1e1e] rounded-sm border-0 text-[#f1f1ef] focus:ring focus:ring-fuchsia-200 placeholder:text-neutral-600 shadow-lg px-1"
            type="color"
          />
        </div>
        <div>
          <label
            class="text-2xl font-semibold text-[#f1f1ef] mb-2 inline-block w-full"
            for="leftColor"
          >
            Left color
          </label>
          <input
            v-model="labelColor"
            id="leftColor"
            class="block bg-[#1e1e1e] rounded-sm border-0 text-[#f1f1ef] focus:ring focus:ring-fuchsia-200 placeholder:text-neutral-600 shadow-lg px-1"
            type="color"
          />
        </div>
        <div>
          <label
            class="text-2xl font-semibold text-[#f1f1ef] mb-2 inline-block w-full"
            for="rightColor"
          >
            Right color
          </label>
          <input
            v-model="rightcolor"
            class="block bg-[#1e1e1e] rounded-sm border-0 text-[#f1f1ef] focus:ring focus:ring-fuchsia-200 placeholder:text-neutral-600 shadow-lg px-1"
            id="rightColor"
            type="color"
          />
        </div>
      </div>
      <div class="mb-6">
        <label
          class="text-2xl font-semibold text-[#f1f1ef] mb-2 inline-block w-full"
          for="badgeLogoValue"
        >
          Badge logo
        </label>
        <div id="badgeLogo" class="relative">
          <div class="relative">
            <input
              @focusin="showResults = true"
              @focusout="showResults = false"
              v-model="logo"
              id="badgeLogoValue"
              class="block bg-[#1e1e1e] rounded-sm border-0 text-[#f1f1ef] focus:ring focus:ring-fuchsia-200 placeholder:text-neutral-600 shadow-lg py-2 px-3 w-full"
              type="text"
              @keydown.esc="showResults = false"
              placeholder="Enter badge logo"
              autocomplete="off"
            />
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="absolute right-2 top-2 cursor-pointer stroke-neutral-300"
              role="img"
              aria-label="Chevron icon"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M6 9l6 6l6 -6"></path>
            </svg>
          </div>

          <ul
            v-show="showResults"
            id="logoResults"
            class="absolute w-full text-sm max-h-64 overflow-y-auto mt-2 py-2 bg-[#1e1e1e] rounded-sm border-0 text-[#f1f1ef] shadow-lg"
          >
            <template v-if="searchResults.length > 0">
              <li v-for="icon in searchResults" :key="icon">
                <button
                  @mousedown="logo = icon.toLowerCase()"
                  class="inline-flex w-full cursor-pointer px-4 py-2 hover:bg-fuchsia-300 hover:text-black"
                >
                  {{ icon }}
                </button>
              </li>
            </template>
            <li v-else class="px-4 py-2 text-neutral-500">No results found</li>
          </ul>
        </div>
      </div>
    </div>
    <div>
      <h2 class="text-2xl font-semibold text-[#f1f1ef] mb-2">Badge</h2>
      <div class="flex flex-col gap-4 items-center justify-center">
        <img
          :src="badgeUrl"
          :alt="`${name} badge`"
          class="w-auto"
          loading="lazy"
          width="128"
          height="32"
        />

        <pre
          class="relative group block bg-[#1e1e1e] rounded-sm text-sm text-[#f1f1ef] shadow-lg mb-4 w-full pr-8"
        ><code class="overflow-x-auto block w-auto py-6 px-4 ">{{ markdownCode }}</code><button @click="copyToClipboard(markdownCode, $event)" class="absolute right-2 top-2 transition stroke-neutral-300 opacity-0 cursor-pointer group-hover:opacity-100 hover:stroke-fuchsia-300" aria-label="Copy to clipboard"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="inherit" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path></svg></button></pre>

        <pre
          class="relative group block bg-[#1e1e1e] rounded-sm text-sm text-[#f1f1ef] shadow-lg mb-4 w-full pr-8"
        ><code class="overflow-x-auto block w-auto py-6 px-4 ">{{ imgCode }}</code><button @click="copyToClipboard(imgCode, $event)" class="absolute right-2 top-2 transition stroke-neutral-300 opacity-0 cursor-pointer group-hover:opacity-100 hover:stroke-fuchsia-300" aria-label="Copy to clipboard"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="inherit" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path></svg></button></pre>
      </div>
    </div>
    <ToastComponent ref="toastRef" />
  </section>
</template>
