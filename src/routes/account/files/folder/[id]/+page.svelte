<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div
	class="
overflow-hidden
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
			<a
				href={data.folder.parentId ? './' + data.folder.parentId : '../'}
				class="flex items-center"
			>
				<span class="text-lg material-icons"> arrow_back_ios_new </span>
			</a>
			<h1 class="text-2xl">{data.folder.name}</h1>
			<div class="grow"></div>
		</div>

		<div
			class="
	justify-center
	justify-items-center
	md:justify-start
	md:w-fit
	grid md:flex
	gap-5
	grid-cols-2
	flex-row flex-wrap"
		>
			{#each data.folder.folders as folder}
				<a
					href="/account/files/folder/{folder.id}"
					class="
bg-ctp-mantle
rounded-lg
flex justify-center items-center w-32 h-24"
				>
					<span class="material-icons-outlined"> folder </span>
				</a>
			{/each}

			{#each data.folder.files as file}
				<a
					href="{data.folder.id}/inspect/{file.id}"
					class="
bg-ctp-mantle
rounded-lg
flex justify-center items-center w-32 h-24 preview"
					style="background-image: url(/account/files/file/{file.id}/get/preview);"
				>
					<span class="material-icons-outlined">
						{file.fileType.includes('image') ? 'image' : 'description'}
					</span>
				</a>
			{/each}

			<a
				href="{data.folder.id}/upload"
				class="
bg-ctp-mantle
rounded-lg
flex justify-center items-center w-32 h-24"
			>
				<span class="material-icons-outlined"> upload_file </span>
			</a>
			<a
				href="/account/files/group/{data.folder.id}"
				class="
bg-ctp-mantle
rounded-lg
flex justify-center items-center w-32 h-24"
			>
				<span class="material-icons-outlined"> create_new_folder </span>
			</a>
		</div>

		<h2 class="text-lg text-neutral-700 dark:text-neutral-300">
			Created: {data.folder.dateCreated}
		</h2>
		<h2 class="text-lg text-neutral-700 dark:text-neutral-300">
			Last modified: {data.folder.dateLastModified}
		</h2>
		<h2 class="text-lg text-neutral-700 dark:text-neutral-300">
			Last accessed: {data.folder.dateLastAccessed}
		</h2>
		{#if data.folder.size > BigInt(1000 ** 3)}
			<h2 class="text-lg text-neutral-700 dark:text-neutral-300">
				Size: {parseFloat(data.folder.size) / 1000.0 ** 3} GB
			</h2>
		{:else if data.folder.size > BigInt(1000 ** 2)}
			<h2 class="text-lg text-neutral-700 dark:text-neutral-300">
				Size: {parseFloat(data.folder.size) / 1000.0 ** 2} MB
			</h2>
		{:else}
			<h2 class="text-lg text-neutral-700 dark:text-neutral-300">
				Size: {parseFloat(data.folder.size) / 1000.0} kB
			</h2>
		{/if}
		<form
			method="POST"
			action="../?/updatefolder"
			class="
    flex flex-col
    gap-5
    rounded-lg
    "
		>
			<input type="hidden" name="id" id="id" value={data.folder.id} />
			<input
				type="text"
				name="name"
				placeholder="name"
				value={data.folder.name}
				required
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

			<button
				formaction="../?/deletefolder"
				class="
    p-2 px-4
    bg-ctp-pink dark:text-black
    rounded-full">Delete</button
			>
		</form>
	</div>
	<div class="grow"></div>
</div>

<style>
	.preview {
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}
</style>
