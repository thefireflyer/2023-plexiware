<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	console.log(data);
</script>

<div
	class="grow p-4 pt-3
flex flex-col gap-3"
>
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
		{#each data.folders as folder}
			<a
				href="files/folder/{folder.id}"
				class="
bg-ctp-mantle
rounded-lg
flex justify-center items-center w-32 h-24"
			>
				<span class="material-icons-outlined"> folder </span>
			</a>
		{/each}

		{#each data.files as file}
			<a
			href="files/inspect/{file.id}"
			class="
bg-ctp-mantle
rounded-lg
flex justify-center items-center w-32 h-24 preview"
			style="background-image: url(files/file/{file.id}/get/preview);"
		>
			<span class="material-icons-outlined"> {file.fileType.includes("image") ? "image" : "description"} </span>
		</a>
		{/each}

		<a
			href="files/upload"
			class="
bg-ctp-mantle
rounded-lg
flex justify-center items-center w-32 h-24"
		>
			<span class="material-icons-outlined"> upload_file </span>
		</a>
		<a
			href="files/group"
			class="
bg-ctp-mantle
rounded-lg
flex justify-center items-center w-32 h-24"
		>
			<span class="material-icons-outlined"> create_new_folder </span>
		</a>
	</div>
</div>

<style>
	.preview {
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}
</style>
