<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	console.log(data);

	let filelist: FileList | null | undefined
	$: file = filelist?.item(0)
</script>

<div
	class="
overflow-y-scroll
grow flex flex-col
p-3"
>
	<div
		class="
flex flex-col
p-3 pb-5 gap-3
rounded-lg
p-1 px-2
border-2 border-neutral-800"
	>
		<div class="flex gap-2 items-center">
			<a href="./" class="flex items-center">
				<span class="text-lg material-icons"> arrow_back_ios_new </span>
			</a>
			<h1 class="text-2xl">Upload file</h1>
			<div class="grow" />
		</div>
		<form
			method="POST"
			action=".?/create"
            enctype="multipart/form-data"
			class="
    flex flex-col
    gap-5
    rounded-lg
    "
		>
		{#if file}
		<!-- <img src={URL.createObjectURL(file)} alt="preview"> -->
		<iframe src={URL.createObjectURL(file)} title="preview"></iframe>
		{/if}
			<input
				type="text"
				name="desc"
				placeholder="desc"
				class="
        p-2 px-4 rounded-full
        bg-ctp-mantle
        "
			/>
            
            <input type="file" id="file" name="file" bind:files={filelist} on:change={() => {
				console.log(filelist)
			}}>

			<button
				class="
        p-2 px-4
        bg-ctp-red dark:text-black
        rounded-full">Confirm</button
			>
		</form>
	</div>
	<div class="grow" />
</div>

<style>
	img {
		width: fit-content;
		height: fit-content;
	}
</style>
