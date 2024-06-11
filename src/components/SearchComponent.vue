<script setup lang="ts">
	import { computed, onMounted, onUnmounted, ref } from "vue"
	import Mousetrap from "mousetrap"
	import badges from "../consts/badges.json"
	import debounce from "debounce"
	import { sanitizeText } from "../utils/sanitize-text"
	import type { Badge } from "../env"

	const query = ref("")
	const categoryQuery = ref("All")
	const categories = ref(["All", ...new Set(badges.map(badge => badge.category))])
	const searchInput = ref<HTMLInputElement | null>(null)
	const clipBoardButtons = ref<HTMLButtonElement[] | null>(null)
	const results = ref<Badge[]>([])
	const resultsAmount = ref(20)

	const filterResults = () => {
		let result = badges
		if (query.value.length > 0) {
			result = result.filter(badge => sanitizeText(badge.name).includes(sanitizeText(query.value)))
		}
		if (categoryQuery.value !== "All") {
			result = result.filter(badge => badge.category === categoryQuery.value)
		}
		results.value = result.slice(0, resultsAmount.value)
	}

	const searchBadget = debounce(() => {
		const url = new URL(window.location.href)

		if (query.value.length > 0) {
			url.searchParams.set("query", query.value)
		} else {
			url.searchParams.delete("query")
		}

		if (categoryQuery.value !== "All") {
			url.searchParams.set("category", categoryQuery.value)
		} else {
			url.searchParams.delete("category")
		}

		window.history.replaceState({}, "", url)
		resultsAmount.value = 20
		filterResults()
	}, 600)

	const clearSearch = () => {
		query.value = ""
		searchBadget()
	}

	const loadMoreResults = () => {
		resultsAmount.value += 20
		filterResults()
	}

	const copy = (markdown: string, badgeIndex: number, event: Event) => {
		if (event == null || clipBoardButtons.value == null) {
			return
		}

		navigator.clipboard.writeText(markdown)

		clipBoardButtons.value[badgeIndex].innerHTML =
			'<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="inherit"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path d="M9 14l2 2l4 -4" /></svg>'
		setTimeout(() => {
			if (clipBoardButtons.value == null) {
				return
			}

			clipBoardButtons.value[badgeIndex].innerHTML =
				'<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="inherit"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /></svg>'
		}, 1500)
	}

	const initializeSearch = () => {
		const url = new URL(window.location.href)
		const queryParam = url.searchParams.get("query")
		const categoryQueryParam = url.searchParams.get("category")
		if (queryParam) {
			query.value = queryParam
		}
		if (categoryQueryParam) {
			categoryQuery.value = categoryQueryParam
		}
		filterResults()
	}

	onMounted(() => {
		initializeSearch()
		Mousetrap.bind("ctrl+k", (e: Event) => {
			if (e.preventDefault) {
				e.preventDefault()
			}
			if (searchInput.value) {
				searchInput.value.focus()
			}
		})

		if (searchInput.value) {
			searchInput.value.focus()
		}
	})

	onUnmounted(() => {
		Mousetrap.unbind("ctrl+k")
	})
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
				class="block ps-12 bg-[#1e1e1e] rounded w-full border-0 text-[#f1f1ef] focus:ring focus:ring-fuchsia-200 placeholder:text-neutral-600 shadow-lg"
				@input="searchBadget"
				:placeholder="`Search in ${badges.length} badges`"
			/>

			<div class="absolute inset-y-1/2 translate-y-[-50%] right-0 flex items-center pr-3 h-fit">
				<span v-if="!query && query.length <= 0" class="flex items-center pointer-events-none text-gray-600">
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
						class="stroke-gray-600"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M7 9a2 2 0 1 1 2 -2v10a2 2 0 1 1 -2 -2h10a2 2 0 1 1 -2 2v-10a2 2 0 1 1 2 2h-10" />
					</svg>
					<span class="text-[17px]"> K </span>
				</span>
				<button v-show="query.length > 0" @click="clearSearch" class="text-white">x</button>
			</div>
		</div>

		<select
			v-model="categoryQuery"
			@input="searchBadget"
			name="category"
			class="py-2 px-6 bg-[#1e1e1e] rounded border-0 text-[#f1f1ef] focus:ring focus:ring-fuchsia-200 shadow-lg"
		>
			<option v-for="category of categories" :value="category">
				{{ category }}
			</option>
		</select>
	</div>
	<template v-if="results && results.length > 0">
		<div class="grid md:grid-cols-4 grid-cols-2 gap-4">
			<div
				v-for="(badge, badgeIndex) in results"
				:key="badge.name"
				class="relative group bg-[#1e1e1e] cursor-pointer text-white rounded border border-transparent transition p-6 text-center flex flex-col hover:bg-fuchsia-300/30 hover:border-fuchsia-200"
				@click="copy(badge.markdown, badgeIndex, $event)"
			>
				<h2 class="text-xl font-semibold text-[#f1f1ef] mb-3">{{ badge.name }}</h2>
				<img :src="badge.url" :alt="badge.name" class="mt-auto h-8 mx-auto mb-4" loading="lazy" />
				<div class="mt-2">
					<span
						class="rounded-full border border-neutral-300 px-2 py-1 text-sm text-neutral-300 group-hover:border-fuchsia-300 group-hover:text-fuchsia-300 transition duration-300 w-auto"
					>
						{{ badge.category }}
					</span>
				</div>
				<button
					ref="clipBoardButtons"
					class="absolute top-0 right-0 m-2 stroke-gray-600 transition duration-300 group-hover:stroke-fuchsia-300"
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
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
						<path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
					</svg>
				</button>
			</div>
		</div>

		<div v-if="results.length >= resultsAmount" class="flex justify-center items-center gap-4 mt-8">
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
	<div v-else-if="results && results.length == 0 && query.length > 0" class="font-semibold text-center mt-12">
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
</template>
