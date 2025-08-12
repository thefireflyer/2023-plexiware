<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	function eventDates(event: any) {
		console.log(event);
		const date = new Date(event);
		const dateTimeLocalValue = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
			.toISOString()
			.slice(0, -1);
		console.log(dateTimeLocalValue);
		return dateTimeLocalValue;
		//new Date(event.year, event.month, event.date, event.hours, event.minutes)
	}
	let start = eventDates(data.event.start);
	let end = eventDates(data.event.end);
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
			<a href="../" class="flex items-center">
				<span class="text-lg material-icons"> arrow_back_ios_new </span>
			</a>
			<h1 class="text-2xl">{data.event.title}</h1>
			<div class="grow"></div>
		</div>
		<form
			method="POST"
			action="?/update"
			class="
    flex flex-col
    gap-5
    rounded-lg
    "
		>
			<input type="hidden" name="id" id="id" value={data.event.id} />
			<input
				type="text"
				name="name"
				placeholder="name"
				value={data.event.title}
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
				value={data.event.description}
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
					value={start}
					class="
            p-2 px-4 rounded-full
            bg-ctp-mantle
            "
				/>
				<input
					type="datetime-local"
					name="end"
					required
					value={end}
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
        rounded-full">Save changes</button
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
	<div class="grow"></div>
</div>
