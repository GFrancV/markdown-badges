<script setup lang="ts">
	import { onMounted, onUnmounted, ref, type Ref } from "vue"
	import Mousetrap from "mousetrap"
	import badges from "../consts/badges.json"
	import type { Badge } from "../env"

	const query = ref("")
	const results: Ref<Badge[] | null> = ref(null)

	const sanitizeText = (text: string) => {
		return text
			.replace(/[^a-zA-Z0-9\s]/g, " ")
			.replace(/\s+/g, " ")
			.trim()
			.toLowerCase()
	}

	const searchBadget = () => {
		setTimeout(() => {
			if (query.value.length > 0) {
				const result = badges.filter(badge => sanitizeText(badge.name).includes(sanitizeText(query.value)))
				results.value = result
			} else {
				results.value = null
			}
		}, 800)
	}

	const copy = (markdown: string, event: Event) => {
		if (event == null) {
			return
		}

		navigator.clipboard.writeText(markdown)

		const button = (event.target as HTMLElement).querySelector("svg")
		if (button == null) {
			return
		}

		button.innerHTML =
			'<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="inherit"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path d="M9 14l2 2l4 -4" /></svg>'
		setTimeout(() => {
			button.innerHTML =
				'<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="inherit"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /></svg>'
		}, 1000)
	}

	onMounted(() => {
		Mousetrap.bind("ctrl+k", (e: Event) => {
			if (e.preventDefault) {
				e.preventDefault()
			}

			const searchInput = document.querySelector('input[name="query"]') as HTMLInputElement
			if (searchInput) {
				searchInput.focus()
			}
		})
	})

	onUnmounted(() => {
		Mousetrap.unbind("ctrl+k")
	})
</script>

<template>
	<div class="relative">
		<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
			class="block ps-12 bg-[#1e1e1e] rounded w-full border-0 text-[#f1f1ef] focus:ring focus:ring-fuchsia-200 placeholder:text-neutral-600 mb-10 shadow-lg"
			@input="searchBadget"
			:placeholder="`Search in ${badges.length} badges`"
		/>

		<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600">
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
		</div>
	</div>
	<div v-if="results" class="grid md:grid-cols-4 grid-cols-2 gap-4">
		<div
			v-for="badge in results"
			:key="badge.name"
			class="relative group bg-[#1e1e1e] cursor-pointer text-white rounded border border-transparent transition p-6 text-center flex flex-col hover:bg-fuchsia-300/30 hover:border-fuchsia-200"
			@click="copy(badge.markdown, $event)"
		>
			<h2 class="text-xl font-semibold text-[#f1f1ef] mb-3">{{ badge.name }}</h2>
			<img
				:src="badge.url"
				:alt="badge.name"
				class="mt-auto aspect-[4/1] w-3/4 mx-auto mb-4"
				loading="lazy"
			/>
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
				class="absolute top-0 right-0 m-2 stroke-gray-600 transition duration-300 group-hover:stroke-fuchsia-300"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
				<path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
			</svg>
		</div>
	</div>
</template>
