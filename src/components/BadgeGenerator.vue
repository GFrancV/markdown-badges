<script setup lang="ts">
import { computed, ref } from "vue";
import { getIcons } from "../api/simpleIcons";

const name = ref<string>("GitHub");
const logo = ref<string>("github");
const logocolor = ref<string>("#ffffff");
const labelColor = ref<string>("#000000");
const rightcolor = ref<string>("#000000");
const showResults = ref<boolean>(false);

const simpleIcons = (await getIcons()).map((icon) => icon.title);

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
  <h1 class="text-6xl font-bold text-[#f1f1ef] mb-8">Badges generator</h1>
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
              @focus="showResults = true"
              @blur="showResults = false"
              v-model="logo"
              id="badgeLogoValue"
              class="block bg-[#1e1e1e] rounded-sm border-0 text-[#f1f1ef] focus:ring focus:ring-fuchsia-200 placeholder:text-neutral-600 shadow-lg py-2 px-3 w-full"
              type="text"
              placeholder="Enter badge logo"
              autocomplete="off"
            />
            <!-- <ChevronIcon
              class="absolute right-2 top-2 cursor-pointer stroke-neutral-300"
            /> -->
          </div>
          <ul
            v-show="showResults"
            id="logoResults"
            style="display: none"
            class="absulte text-sm max-h-64 overflow-y-auto mt-2 py-2 bg-[#1e1e1e] rounded-sm border-0 text-[#f1f1ef] shadow-lg"
          >
            <li v-for="icon in simpleIcons">
              <button
                @click="logo = icon.toLowerCase()"
                class="inline-flex w-full cursor-pointer px-4 py-2 hover:bg-fuchsia-300 hover:text-black"
              >
                {{ icon }}
              </button>
            </li>
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
          width="100"
          height="28"
        />

        <pre
          class="relative group block bg-[#1e1e1e] rounded-sm p-3 pt-9 text-sm text-[#f1f1ef] shadow-lg mb-4 overflow-x-auto w-full"
        >
		      <code>
            {{ markdownCode }}
          </code>
	      </pre>
        <pre
          class="relative group block bg-[#1e1e1e] rounded-sm p-3 pt-9 text-sm text-[#f1f1ef] shadow-lg mb-4 overflow-x-auto w-full"
        >
          <code >
            {{ imgCode }}
          </code>
	      </pre>
      </div>
    </div>
  </section>
</template>
