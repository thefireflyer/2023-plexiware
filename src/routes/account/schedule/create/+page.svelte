<script lang="ts">
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
			<h1 class="text-2xl">Create event</h1>
			<div class="grow"></div>
		</div>
		<form
			method="POST"
			action=".?/create"
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

			<input
				type="text"
				name="desc"
				placeholder="desc"
				class="
        p-2 px-4 rounded-full
        bg-ctp-mantle
        "
			/>

			<div class="flex gap-3">
				<input
					type="datetime-local"
					name="start"
					required
					class="
            p-2 px-4 rounded-full
            bg-ctp-mantle
            "
				/>

				<input
					type="datetime-local"
					name="end"
					required
					class="
            p-2 px-4 rounded-full
            bg-ctp-mantle
            "
				/>
			</div>

			<button
				class="
        p-2 px-4
        bg-ctp-red dark:text-black
        rounded-full">Confirm</button
			>
		</form>
	</div>
	<div class="grow"></div>
</div>
