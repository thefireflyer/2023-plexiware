<script lang="ts">
	import Window from '$lib/components/window-manager/Window.svelte';
	import WindowManager from '$lib/components/window-manager/WindowManager.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	console.log(data);

	let interval: NodeJS.Timeout | undefined;
	let now = 0;

	onMount(() => {
		interval = setInterval(() => {
			let d = new Date();
			now = ((d.getHours() * 60 + d.getMinutes()) / (24 * 60)) * 100;
			// console.log(now);
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="root">
	<div class="menu-trigger"></div>
	<Window inner={data.state} />
	<div class="timeline">
		<div class="inner"></div>
		<div class="now-ish" style="top: {now}%"></div>
		<div class="now" style="top: {now}%"></div>
		{#each data.events as event}
			<div class="event" style="top: {event}"></div>
		{/each}
	</div>
</div>

<style>
	.root {
		display: flex;
		flex-grow: 1;

		background-color: black;

		max-width: 100%;
		max-height: 100%;

		overflow: hidden;
	}

	.menu-trigger {
		width: 2em;
		border-left: 3pt solid rgb(40, 40, 40);
	}

	.menu-trigger:hover {
		background-color: rgb(30, 30, 30);
	}

	.timeline {
		position: relative;
		width: 5em;
		display: flex;
		/* border-right: 3pt solid rgb(50, 50, 50); */
	}

	.timeline .inner {
		flex-grow: 1;
		border-right: 3pt solid rgb(40, 40, 40);
	}

	.now {
		position: absolute;
		right: 0;
		height: 1.041666666666667%;
		width: 3pt;
		background: rgb(150, 150, 150);
		/* background: rgb(236, 6, 56); */
	}

	.now-ish {
		position: absolute;
		right: 0;
		height: 4.166666666666667%;
		width: 3pt;
		background: rgb(100, 100, 100);
		/* background: rgb(236, 6, 56, 0.3); */
	}
</style>
