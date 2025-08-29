<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let time = new Date();

	let current = new Date();
	$: formatted = current.toLocaleDateString();
	$: morning = () => {
		const res = new Date(current);
		res.setHours(0);
		res.setMinutes(0);
		return res;
	};
	$: night = () => {
		const res = new Date(current);
		res.setHours(23);
		res.setMinutes(59);
		return res;
	};

	let datePicker = new Date();
	let datePickerOpen = false;

	function daysInMonth(month: number, year: number) {
		return new Date(year, month + 1, 0).getDate();
	}

	function range(start: number, end: number) {
		return Array(end - start + 1)
			.fill(0)
			.map((_, idx) => start + idx);
	}

	/**
	 * @type {any[]}
	 */
	$: monthDates = range(1, daysInMonth(datePicker.getMonth(), datePicker.getFullYear()));

	/**
	 * @type {any[]}
	 */
	const hours = Array(24)
		.fill(0)
		.map((_, idx) => {
			let hour = new Date().setHours(idx, 0, 0, 0);
			return Array(4)
				.fill(0)
				.map((_, idx) => {
					let segment = new Date(hour);
					segment.setMinutes(idx * 15);
					return segment.getHours() + `:` + segment.getMinutes();
				});
		});

	function getPositionStyle(minutes: number, hours: number) {
		let segment = minutes / 15;
		return (hours * 4 + segment) * 3 + 1.5;
	}

	$: rightNowLine = getPositionStyle(time.getMinutes(), time.getHours()) + 'em';

	function getEvents(_date: Date) {
		return data.events.map(
			(event: {
				id: number;
				title: string;
				description: string | null;
				start: Date;
				end: Date;
				public: boolean;
				authorId: number;
			}) => {
				return {
					...event,
					startPosition:
						getPositionStyle(
							event.start < morning() ? 0 : event.start.getMinutes(),
							event.start < morning() ? 0 : event.start.getHours()
						) + 'em',
					height:
						getPositionStyle(
							event.end > night() ? 59 : event.end.getMinutes(),
							event.end > night() ? 23 : event.end.getHours()
						) -
						getPositionStyle(
							event.start < morning() ? 0 : event.start.getMinutes(),
							event.start < morning() ? 0 : event.start.getHours()
						) +
						'em'
				};
			}
		);
		// return [
		// 	{
		// 		id: 0,
		// 		name: 'test',
		// 		start: {
		// 			hours: 12,
		// 			minutes: 15
		// 		},
		// 		end: {
		// 			hours: 13,
		// 			minutes: 15
		// 		},
		// 	},
		// 	{
		// 		id: 2,
		// 		name: 'test2',
		// 		start: {
		// 			hours: 21,
		// 			minutes: 20
		// 		},
		// 		end: {
		// 			hours: 21,
		// 			minutes: 45
		// 		},
		// 	},
		// 	{
		// 		id: 3,
		// 		name: 'test3',
		// 		start: {
		// 			hours: 10,
		// 			minutes: 30
		// 		},
		// 		end: {
		// 			hours: 10,
		// 			minutes: 45
		// 		},
		// 	},
		// 	{
		// 		id: 4,
		// 		name: 'test3',
		// 		start: {
		// 			hours: 23,
		// 			minutes: 25
		// 		},
		// 		end: {
		// 			hours: 24,
		// 			minutes: 0
		// 		},
		// 	}
		// ].map((event) => {
		// 	return {
		// 		...event,
		// 		startPosition: getPositionStyle(event.start.minutes, event.start.hours)+"em",
		// 		height:
		// 			getPositionStyle(event.end.minutes, event.end.hours)-getPositionStyle(event.start.minutes, event.start.hours)+"em",
		// 	};
		// })
	}

	$: calendarEvents = getEvents(current);

	let rightNowLineRef: HTMLDivElement;

	onMount(() => {
		// slog('src/routes/account/schedule/+page.svelte', 'on mount', data);
		const delay = setTimeout(() => {
			clearTimeout(delay);
			rightNowLineRef.scrollIntoView();
		}, 500);

		const interval = setInterval(() => {
			time = new Date();
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div
	class="
relative
grow p-3
flex flex-col gap-3
overflow-y-scroll"
>
	<div
		class="
    flex flex-row p-3
    gap-3 rounded-lg
    items-center
    border-2 border-neutral-800"
	>
		<button
			on:click={() => {
				datePickerOpen = !datePickerOpen;
			}}
			class="
        flex gap-3
        justify-center items-center
        h-full px-3
        rounded-full
        bg-ctp-mantle"
		>
			<span
				class="material-icons-outlined
            text-2xl text-neutral-600 dark:text-neutral-300">event</span
			>
			<span
				class="
            text-md">{formatted}</span
			>
		</button>

		<div class="grow"></div>

		<a
			href="schedule/create"
			class="
        rounded-full
        bg-ctp-red
        flex
        justify-center items-center
        h-12 w-12"
		>
			<span class="text-3xl material-icons"> add </span>
		</a>
	</div>

	{#if datePickerOpen}
		<div
			class="
    md:w-fit
    p-3
    grid grid-cols-7
    justify-start
    gap-3 rounded-lg
    border-2 border-neutral-800"
			transition:slide
		>
			<button
				on:click={() => {
					let newDate = new Date(datePicker.toLocaleDateString());
					newDate.setMonth(datePicker.getMonth() - 1);
					datePicker = newDate;
				}}
				class="flex
        h-10 w-10
        rounded-full
        justify-center items-center
        hover:bg-neutral-200 hover:dark:bg-neutral-800"
			>
				<span class="material-icons text-sm"> arrow_back_ios_new </span>
			</button>

			{#each monthDates as date}
				<button
					on:click={() => {
						let newDate = new Date(datePicker.toLocaleDateString());
						newDate.setDate(date);
						current = newDate;
					}}
					class="
            h-10 w-10
            rounded-full text-md
            hover:bg-neutral-200 hover:dark:bg-neutral-800
            {time.getMonth() == datePicker.getMonth() && time.getDate() == date
						? 'bg-ctp-pink dark:text-black'
						: current.getMonth() == datePicker.getMonth() && current.getDate() == date
							? 'bg-neutral-200 dark:bg-neutral-800'
							: ''}"
				>
					{date}
				</button>
			{/each}

			<button
				on:click={() => {
					let newDate = new Date(datePicker.toLocaleDateString());
					newDate.setMonth(datePicker.getMonth() + 1);
					datePicker = newDate;
				}}
				class="flex
        h-10 w-10
        rounded-full
        justify-center items-center
        hover:bg-neutral-200 hover:dark:bg-neutral-800"
			>
				<span class="material-icons text-sm"> arrow_forward_ios </span>
			</button>
		</div>
	{/if}

	<div
		class="grow
    flex p-3
    rounded-lg
    border-2 border-neutral-800 overflow-y-scroll
	relative"
	>
		<div>
			{#each hours as hour}
				{#each hour as segment}
					<div
						class="
        h-12
        flex px-3 items-center
        gap-3"
					>
						{segment}
					</div>
				{/each}
			{/each}
		</div>
		<div class="grow grid relative">
			<div
				class="
        grow
        flex flex-col h-6
        gap-3"
			></div>
			{#each hours as hour}
				{#each hour as _segment}
					<div
						class="
                grow
                flex flex-col h-12
                gap-3
                px-3
				overflow-hidden"
					>
						<div
							class="
                    border-b border-neutral-800"
						></div>
					</div>
				{/each}
			{/each}
			<div
				class="
        grow
        flex flex-col h-6
        gap-3"
			></div>
			{#each calendarEvents as event}
				{#if event.start < night() && event.end > morning()}
					<a
						href="schedule/events/{event.id}"
						class="
					p-1 px-2
					absolute left-0
					w-full
					rounded-md
					bg-ctp-crust
					hover:bg-neutral-200 hover:dark:bg-neutral-800
					border-2 border-neutral-800"
						style="top:{event.startPosition}; height:{event.height};"
					>
						{event.title}
					</a>
				{/if}
			{/each}
		</div>
		{#if time.toDateString() == current.toDateString()}
			<div
				bind:this={rightNowLineRef}
				class="
	w-full
	absolute left-0"
				style="top:{rightNowLine}"
			>
				<div
					class="
	h-px
	bg-ctp-pink"
				></div>
			</div>
		{/if}
	</div>
</div>
