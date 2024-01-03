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
			<a href="./" class="flex items-center">
				<span class="text-lg material-icons"> arrow_back_ios_new </span>
			</a>
			<h1 class="text-2xl">Create folder</h1>
			<div class="grow" />
		</div>
		<form
		method="POST"
        action=".?/group"
			class="
    flex flex-col
    gap-5
    rounded-lg
    "
		>
			<input
				type="text"
				name="name"
				placeholder="name"
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
        rounded-full"
			>Confirm</button>
		</form>
	</div>
    <div class="grow" />
</div>
