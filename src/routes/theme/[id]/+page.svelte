<script lang="ts">
	import ThemeDemo from '$lib/themeDemo.svelte';
	import type { PageData } from './$types';

	let drawerWidth = 600;

	let moving = false;

	function onMouseDown() {
		moving = true;
	}

	function onMouseMove(e: { movementX: number }) {
		if (moving) {
			drawerWidth -= e.movementX;
			drawerWidth = Math.min(drawerWidth, window.innerWidth - 100);
		}
	}

	function onMouseUp() {
		moving = false;
	}

	$: css = '';
</script>

<div
	class="
grow relative overflow-hidden

bg-neutral-200 dark:bg-neutral-800
flex"
>
	<form
		method="POST"
		action="?/update"
		class="
grow
flex flex-col
gap-5
max-h-screen overflow-scroll
"
	>
		<div class="grow flex flex-col bg-neutral-100 dark:bg-neutral-900">
			<input type="hidden" name="id" id="id" value={'new'} />
			<input type="hidden" name="css" id="css" value={css} />

			<div class="bg-neutral-200 dark:bg-neutral-800 h-18 p-3 flex items-center">
				<button
					class="
    p-2 px-4
    bg-ctp-red dark:text-black
    rounded-full">Confirm</button
				>
			</div>
			<div class="grow max-h- overflow-scroll flex">
				<div contenteditable="true" class="grow" bind:textContent={css}>
					<h1>test</h1>
					<p>test2</p>
				</div>
			</div>
		</div>
	</form>

	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="p-2 flex" on:mousedown={onMouseDown}>
		<div class="bg-gray-300 dark:bg-gray-700 w-1 rounded-full draggable"></div>
	</div>
</div>

{#if drawerWidth > 100}
	<div class="files flex flex-col overflow-y-scroll relative" style="width: {drawerWidth}px;">
		<div class="grow flex" style={css}>
			<ThemeDemo></ThemeDemo>
		</div>
	</div>
{/if}

<div class="flex"></div>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<style>
	.files {
		min-height: fit-content;
	}

	/* .dragable {
		user-select: none;
		cursor: w-resize;
	} */

	@media screen and (max-width: 768px) {
		.files {
			min-width: 100%;
		}
	}
</style>
