<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data);

	import { onMount } from 'svelte';

	let time = new Date();

	$: formatted = time.toLocaleTimeString();
	$: hours = time.getHours();
	$: minutes = time.getMinutes();
	$: seconds = time.getSeconds();

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

	let recentNotes = [
		{
			url: 'test',
			name: 'testing'
		}
	];

	$: currentTaskProgression = () => {
		if (data.nextOrCurrentEvent) {
			const start = new Date(data.nextOrCurrentEvent.start);
			const end = new Date(data.nextOrCurrentEvent.end);
			const output_end = 100;
			const output_start = 0;
			const input_end = end.getTime();
			const input_start = start.getTime();
			const input = time.getTime();
			const progression =
				output_start +
				((output_end - output_start) / (input_end - input_start)) * (input - input_start);
			console.log(progression);
			return progression;
		} else {
			return 0;
		}
	};
</script>

<div
	class="
    grow p-4 pt-3
    flex flex-col gap-3"
>
	<div
		class="flex
    gap-3"
	>
		<a
			href="https://forecast.weather.gov/MapClick.php?lat=48.121200000000044&lon=-122.77262999999999"
			class="grow
        flex flex-row gap-3
        items-center
        p-3 rounded-lg
        border-2 border-neutral-800
        hover:bg-neutral-200 hover:dark:bg-neutral-800"
		>
			<span class="text-xl flex items-center gap-1">
				<span class="material-icons-round text-3xl"> terrain </span>
				Rainy, 50°
			</span>
		</a>
		<div
			class="
        hidden
        md:flex flex-row gap-3
        items-center
        p-3 rounded-lg
        border-2 border-neutral-800
        text-4xl"
		>
			<span class="text-2xl">
				{formatted}
			</span>
		</div>
	</div>

	<!-- <div class="px-3">
		<div class="h-px bg-black dark:bg-neutral-600" />
	</div> -->
	{#if data.nextOrCurrentEvent}
		<a
			href="/account/schedule/events/{data.nextOrCurrentEvent.id}"
			class="flex flex-col p-3
    gap-3 rounded-lg
    border-2 border-neutral-800
    hover:bg-neutral-200 hover:dark:bg-neutral-800"
		>
			<div
				class="flex
        items-center
        gap-3 rounded-lg"
			>
				<span
					class="material-icons-outlined
            text-2xl text-neutral-600 dark:text-neutral-300">schedule</span
				>
				<span class="text-xl text-neutral-600 dark:text-neutral-300"
					>{new Date(data.nextOrCurrentEvent.start).toLocaleTimeString()}</span
				>
				<span class="text-xl text-center grow">{data.nextOrCurrentEvent.title}</span>
				<span class="text-xl text-neutral-600 dark:text-neutral-300"
					>{new Date(data.nextOrCurrentEvent.end).toLocaleTimeString()}</span
				>
			</div>
			<div
				class="grow flex flex-row
        h-1 bg-gray-300 dark:bg-gray-700 rounded-full"
			>
				<div
					class="
            h-1 bg-slate-400 dark:bg-slate-500 rounded-full"
					style="width: {currentTaskProgression() + '%'};"
				></div>
			</div>
			<div
				class="flex
        justify-center
        items-center
        gap-3 rounded-lg"
			>
				<span
					class="material-icons-outlined
            text-2xl text-neutral-600 dark:text-neutral-300">check_circle</span
				>
				<div
					class="grow flex flex-row
            h-1 bg-gray-300 dark:bg-gray-700 rounded-full"
				>
					<div
						class="basis-1/12
                h-1 bg-pink-700 rounded-full"
					></div>
				</div>
			</div>
		</a>
	{/if}

	<div
		class="flex flex-col
    grow
    gap-3
    p-3 rounded-lg
    border-2 border-neutral-800
    overflow-y-scroll"
	>
		{#each recentNotes as note}
			<a
				href="/account/notes/{note.url}"
				class="
            flex flex-row gap-3
            items-center
            hover:bg-neutral-200 hover:dark:bg-neutral-800
            rounded-lg
            px-1"
			>
				<span
					class="material-icons-outlined
                text-2xl">article</span
				>
				<span class="text-lg">{note.name}</span>
			</a>
		{/each}
	</div>
</div>

<style>
	/* .icon {
		width: 64px;
	} */
</style>
