<script setup>
  import { ref } from "vue";
  import badgets from "../consts/badgets.json";

  const query = ref("");
  const results = ref(null);

  const sanitizeText = text => {
    return text
      .replace(/[^a-zA-Z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  };

  const searchBadget = () => {
    if (query.value.length > 0) {
      const result = badgets.filter(badget => sanitizeText(badget.name).includes(sanitizeText(query.value)));
      results.value = result;
    } else {
      results.value = null;
    }
  };

  const copy = (markdown, event) => {
    navigator.clipboard.writeText(markdown);

    const button = event.currentTarget;
    button.innerHTML =
      '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="inherit"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path d="M9 14l2 2l4 -4" /></svg>';
    setTimeout(() => {
      button.innerHTML =
        '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="inherit"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /></svg>';
    }, 1000);
  };
</script>

<template>
  <input type="search" v-model="query" class="border border-gray-600" @input="searchBadget" />
  <template v-if="results">
    <div v-for="badget in results" :key="badget" class="border border-gray-600 relative">
      <h2>{{ badget.name }}</h2>
      <img :src="badget.url" :alt="badget.name" loading="lazy" />
      <button @click="copy(badget.markdown, $event)" class="stroke-gray-600">
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
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
          <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
        </svg>
      </button>
    </div>
  </template>
</template>
