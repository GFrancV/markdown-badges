<script setup lang="ts">
import debounce from "debounce";
import { onMounted, onUnmounted, ref } from "vue";
import badges from "../data/badges.json";
import type { Badge } from "../env";
import CrossIcon from "../icons/CrossIcon.vue";
import { sanitizeText } from "../utils/sanitize-text";
import BadgeCard from "./BadgeCard.vue";
import ToastComponent from "./ToastComponent.vue";

const query = ref("");
const categoryQuery = ref("All");
const categories = ref([
  "All",
  ...new Set(badges.map((badge) => badge.category)),
]);
const searchInput = ref<HTMLInputElement | null>(null);
const toastRef = ref<InstanceType<typeof ToastComponent> | null>(null);
const results = ref<Badge[]>([]);
const resultsAmount = ref(20);

const filterResults = () => {
  let result = badges;
  if (query.value.length > 0) {
    result = result.filter((badge) =>
      sanitizeText(badge.name).includes(sanitizeText(query.value))
    );
  }
  if (categoryQuery.value !== "All") {
    result = result.filter((badge) => badge.category === categoryQuery.value);
  }
  results.value = result.slice(0, resultsAmount.value);
};

const searchBadge = debounce(() => {
  const url = new URL(window.location.href);

  if (query.value.length > 0) {
    url.searchParams.set("query", query.value);
  } else {
    url.searchParams.delete("query");
  }

  if (categoryQuery.value !== "All") {
    url.searchParams.set("category", categoryQuery.value);
  } else {
    url.searchParams.delete("category");
  }

  window.history.replaceState({}, "", url);
  resultsAmount.value = 20;
  filterResults();
}, 600);

const clearSearch = () => {
  query.value = "";
  searchBadge();
};

const loadMoreResults = () => {
  resultsAmount.value += 20;
  filterResults();
};

const copy = async (markdown: string, event: Event) => {
  const element = event.currentTarget as HTMLButtonElement;
  if (event == null || element == null) {
    return;
  }

  await navigator.clipboard.writeText(markdown);
  const clipBoardButton = element.querySelector("button");
  if (!clipBoardButton) return;

  clipBoardButton.innerHTML =
    '<svg  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="inherit" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path d="M9 14l2 2l4 -4" /></svg>';
  setTimeout(() => {
    clipBoardButton.innerHTML =
      '<svg  width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="inherit" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /></svg>';
  }, 700);

  toastRef.value?.addToast("Copied to clipboard");
};

const initializeSearch = () => {
  const url = new URL(window.location.href);
  const queryParam = url.searchParams.get("query");
  const categoryQueryParam = url.searchParams.get("category");
  if (queryParam) {
    query.value = queryParam;
  }
  if (categoryQueryParam) {
    categoryQuery.value = categoryQueryParam;
  }
  filterResults();
};

function handleKeyDown(event: KeyboardEvent) {
  if (event.ctrlKey && event.key === "k") {
    event.preventDefault();
    searchInput.value?.focus();
  }
}

onMounted(() => {
  initializeSearch();
  document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <div class="flex md:flex-row flex-col gap-2 mb-10">
    <div class="relative grow">
      <div
        class="pointer-events-none absolute translate-y-[-50%] left-0 flex items-center pl-3 h-fit inset-y-1/2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="inherit"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="stroke-gray-600"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
          <path d="M21 21l-6 -6"></path>
        </svg>
      </div>

      <input
        type="text"
        name="query"
        v-model="query"
        ref="searchInput"
        class="block ps-12 py-2 pr-3 bg-[#1e1e1e] rounded-sm w-full border-0 text-[#f1f1ef] outline-1 -outline-offset-1 outline-transparent transition duration-200 focus:outline-2 focus:-outline-offset-2 focus:outline-fuchsia-200 leading-6 placeholder:text-neutral-600 shadow-lg"
        @input="searchBadge"
        :placeholder="`Search in ${badges.length} badges`"
      />

      <div
        class="absolute inset-y-1/2 translate-y-[-50%] right-0 flex items-center text-gray-600 pr-3 h-fit"
      >
        <div
          v-if="!query && query.length <= 0"
          class="flex items-center pointer-events-none text-base gap-x-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="stroke-gray-600 size-5"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M7 9a2 2 0 1 1 2 -2v10a2 2 0 1 1 -2 -2h10a2 2 0 1 1 -2 2v-10a2 2 0 1 1 2 2h-10"
            />
          </svg>
          <span>K</span>
        </div>
        <button
          v-show="query.length > 0"
          @click="clearSearch"
          class="text-white"
        >
          <CrossIcon class="size-5" />
        </button>
      </div>
    </div>

    <select
      v-model="categoryQuery"
      @input="searchBadge"
      name="category"
      class="py-2 px-6 bg-[#1e1e1e] rounded-sm border-0 text-[#f1f1ef] focus:ring-3 focus:ring-fuchsia-200 shadow-lg"
      aria-label="Category"
    >
      <option v-for="category of categories" :key="category" :value="category">
        {{ category }}
      </option>
    </select>
  </div>
  <template v-if="results && results.length > 0">
    <div class="grid md:grid-cols-4 grid-cols-2 gap-4">
      <BadgeCard
        v-for="badge in results"
        :key="badge.name"
        :name="badge.name"
        :url="badge.url"
        :category="badge.category"
        @click="copy(badge.markdown, $event)"
      />
    </div>

    <div
      v-if="results.length >= resultsAmount"
      class="flex justify-center items-center gap-4 mt-8"
    >
      <button
        @click="loadMoreResults"
        class="flex gap-1 border border-transparent back rounded-full px-4 py-2 transition text-white bg-[#1e1e1e] hover:bg-fuchsia-300/30 hover:border-fuchsia-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="motion-safe:animate-bounce"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M7 7l5 5l5 -5" />
          <path d="M7 13l5 5l5 -5" />
        </svg>
        All Badges
      </button>
    </div>
  </template>
  <div
    v-else-if="results && results.length == 0 && query.length > 0"
    class="font-semibold text-center mt-12"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="stroke-gray-500 mx-auto mb-4 w-16"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M7 7v10l5 3l5 -3m0 -4v-9l-5 3l-2.496 -1.497" />
      <path d="M3 3l18 18" />
    </svg>

    <p class="text-gray-500 text-lg">Don't exist any badge with this name</p>
    <p class="text-gray-500 text">"{{ query }}"</p>

    <div class="flex justify-center items-center gap-4 mt-4 text-neutral-300">
      <a
        href="https://github.com/gfrancv/markdown-badges/issues/new?labels=request&title=%5BRequest%5D%3A"
        target="_blank"
        class="border border-transparent back rounded-full px-3 py-2 transition bg-[#1e1e1e] hover:bg-fuchsia-300/30 hover:border-fuchsia-200"
      >
        Request Badge
      </a>
      <button
        class="border border-transparent back rounded-full px-3 py-2 transition bg-[#1e1e1e] hover:bg-fuchsia-300/30 hover:border-fuchsia-200"
        @click="clearSearch"
      >
        Clear search
      </button>
    </div>
  </div>

  <ToastComponent ref="toastRef" />
</template>
