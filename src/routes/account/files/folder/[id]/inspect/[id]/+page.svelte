<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
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
			<a href="../" class="flex items-center">
				<span class="text-lg material-icons"> arrow_back_ios_new </span>
			</a>
			<h1 class="text-2xl">{data.file.name}</h1>
			<div class="grow" />
		</div>
		<div class="grow flex overflow-y-scroll gap-2 flex-col">
			{#if data.file.fileType.includes("svg")}
			<iframe src="/account/files/file/{data.file.id}/get/content" title="description"></iframe> 
			{:else if data.file.fileType.includes("image")}
			<img src="/account/files/file/{data.file.id}/get/content" alt="img" />
			{:else}
			<iframe src="/account/files/file/{data.file.id}/get/content" title="description"></iframe> 
			{/if}
			<h2 class="text-lg text-neutral-700 dark:text-neutral-300">{data.file.description}</h2>
			<h2 class="text-lg text-neutral-700 dark:text-neutral-300">
				Created: {data.file.dateCreated}
			</h2>
			<h2 class="text-lg text-neutral-700 dark:text-neutral-300">
				Last modified: {data.file.dateLastModified}
			</h2>
			<h2 class="text-lg text-neutral-700 dark:text-neutral-300">
				Last accessed: {data.file.dateLastAccessed}
			</h2>
			{#if data.file.size>BigInt(1000**3)}
			<h2 class="text-lg text-neutral-700 dark:text-neutral-300">Size: {parseFloat(data.file.size)/1000.0**3} GB</h2>
			{:else if data.file.size>BigInt(1000**2)}
			<h2 class="text-lg text-neutral-700 dark:text-neutral-300">Size: {parseFloat(data.file.size)/1000.0**2} MB</h2>
			{:else}
			<h2 class="text-lg text-neutral-700 dark:text-neutral-300">Size: {parseFloat(data.file.size)/1000.0} kB</h2>
			{/if}

			<form
				method="POST"
				action="../?/update"
				enctype="multipart/form-data"
				class="
flex flex-col
gap-5
rounded-lg
"
			>
				<input type="hidden" name="id" id="id" value={data.file.id} />
				<input
					type="text"
					name="name"
					placeholder="name"
					value={data.file.name}
					required
					class="
    p-2 px-4 rounded-full
    bg-ctp-mantle
    "
				/>
				<input
					type="text"
					name="desc"
					placeholder="desc"
					value={data.file.description}
					class="
    p-2 px-4 rounded-full
    bg-ctp-mantle
    "
				/>

				<button
					class="
    p-2 px-4
    bg-ctp-red dark:text-black
    rounded-full">Update</button
				>
				<a href="/account/files/file/{data.file.id}/get/content" download="{data.file.name}"
					class="
    p-2 px-4
    bg-ctp-mauve dark:text-black
    rounded-full text-center">Download</a
				>
                <button
                    formaction="../?/delete"
                    class="
            p-2 px-4
            bg-ctp-pink dark:text-black
            rounded-full">Delete</button
                >
			</form>
		</div>
	</div>
</div>

<style>
	img {
		width: fit-content;
		height: fit-content;
	}
</style>
