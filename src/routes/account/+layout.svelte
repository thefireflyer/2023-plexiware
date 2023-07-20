<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';

	export let data: LayoutData;

	import { quintInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import Transition from '$lib/transition.svelte';
	import { navigating } from '$app/stores';
	import { goto } from '$app/navigation';

	let menuOpen = false;

	let searchQuery = data.url.searchParams.get('q') ?? '';
	


	navigating.subscribe((nav) => {
		// console.log(data.url)
		console.log('navigating to:', data.url.searchParams);

	});

	let os = 'unknown';

	const links = [
		{
			url: '/dashboard',
			name: 'Dashboard',
			icon: 'dashboard'
		},
		{
			url: '/schedule',
			name: 'Schedule',
			icon: 'calendar_today'
		},
		{
			url: '/photos',
			name: 'Photos',
			icon: 'photo'
		},
		{
			url: '/notes',
			name: 'Notes',
			icon: 'article'
		},
		{
			url: '/files',
			name: 'Files',
			icon: 'folder'
		},
		{
			url: '/contacts',
			name: 'Contacts',
			icon: 'contacts'
		},
		{
			url: '/apps',
			name: 'Connections',
			icon: 'app_registration'
		},
		{
			url: '',
			name: 'Account',
			icon: 'account_circle'
		},
	]

    const linksAbout = [

		{
			url: '/docs',
			name: 'Documentation',
			icon: 'description'
		},
		{
			url: '/source',
			name: 'Source Code',
			icon: 'code'
		},
		{
			url: 'http://thefireflyer.me/homeportal/',
			name: 'Other apps',
			icon: 'apps'
		}
    ]


</script>

{#if $page.data.sessionid}
	<div
		class="bg-ctp-crust
grow flex flex-col
justify-center
items-stretch
relative"
	>
		<header
			class="h-12 p-2 pb-0 w-full
    flex flex-row justify-between
    gap-1 md:gap-3"
		>
			<!-- <button
				class="flex items-center"
				on:click={() => {
					menuOpen = !menuOpen;
				}}
			>
				<span class="material-icons-round text-3xl"> {menuOpen ? `clear` : `menu`} </span>
			</button> -->
			<a href="/" class="flex items-center hidden md:block">
				<span class="material-icons-round text-3xl"> language </span>
			</a>
			<div class="md:grow" />
			<div class="grow flex relative">
				<form
					action=""
					aria-label="search"
					class="grow p-1 pl-2 z-30
                    flex
                    rounded-full
                    min-w-0
                    justify-stretch
                    gap-1
                    overflow-hidden
                    border border-neutral-400 dark:border-neutral-600"
				>
					<div class="flex items-center">
						<span class="material-icons-round text-2xl text-neutral-500"> search </span>
					</div>

					<input
						type="search"
						name="q"
						aria-label="search"
						bind:value={searchQuery}
						placeholder="Search for anything"
						class="bg-transparent
                        overflow-x-scroll
                        grow
                        align-top text-xl"
					/>
					{#if searchQuery != ''}
						<button
							type="submit"
							in:fly={{
								easing: quintInOut,
								x: 100,
								duration: 200,
								opacity: 0
							}}
							out:fly={{
								easing: quintInOut,
								x: 100,
								duration: 200,
								opacity: 0
							}}
							class="flex items-center bg-neutral-600 dark:bg-neutral-400 text-white dark:text-black rounded-full"
						>
							<span class="material-icons-round text-3xl"> navigate_next </span>
						</button>
					{/if}
				</form>
				{#if searchQuery != '' && data.searchResults}
					<div
						class="absolute top-0 left-0 w-full h-fit
                    z-10 bg-ctp-mantle rounded-2xl
                    flex flex-col overflow-hidden"
					>
						<div class="w-full h-10" />
						{#each data.searchResults as item}
							<a
								href={item.slug}
								class="w-full h-10 flex px-3 hover:bg-neutral-300 dark:hover:bg-neutral-700 items-center"
							>
								<span class="text-lg">{item.name}</span>
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<div class="md:grow" />

			<!-- <a href="/account" class="flex items-center hidden md:block">
				<span class="material-icons-round text-3xl"> account_circle </span>
			</a> -->
			<button
				class="flex items-center"
				on:click={() => {
					menuOpen = !menuOpen;
				}}
			>
				<span class="material-icons-round text-3xl"> {menuOpen ? `clear` : `menu`} </span>
			</button>
		</header>

		<slot />

		{#if menuOpen}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				transition:fade={{
					easing: quintInOut,
					duration: 200
				}}
				on:click={() => {
					menuOpen = false;
				}}
				class="absolute w-full h-full top-0 left-0 rounded z-40"
				style="background-color: rgba(0,0,0,0.5);"
			/>

			<div
				in:fly={{
					easing: quintInOut,
					x: 100,
					duration: 200,
					opacity: 0
				}}
				out:fly={{
					easing: quintInOut,
					x: 100,
					duration: 200,
					opacity: 0
				}}
				class="w-4/5 md:w-96 h-full
        absolute top-0 right-0
        flex bg-ctp-crust
        rounded-l-3xl z-50
        flex flex-col p-3 gap-2"
			>
				{#each links as link}
					<a
						href="/account{link.url}"
						class="{("/account"+link.url) == data.url.pathname ? "bg-ctp-red" : ""}
    borde rounded-full border-neutral-500 hover:bg-neutral-200 hover:dark:bg-neutral-800
    p-1 px-2 flex items-stretch gap-2"
					>
						<span class="material-icons-round text-3xl">{link.icon}</span>
						<span class="text-2xl">{link.name}</span>
					</a>
				{/each}
                <div class="px-3 p-1">
                    <div class="h-px bg-neutral-500"></div>
                </div>
				{#each linksAbout as link}
					<a
						href={link.url}
						class="
    borde rounded-full border-neutral-500 hover:bg-neutral-200 hover:dark:bg-neutral-800
    p-1 px-2 flex items-stretch gap-2"
					>
						<span class="material-icons-round text-3xl">{link.icon}</span>
						<span class="text-2xl">{link.name}</span>
					</a>
				{/each}
			</div>
		{/if}

		<div class="h-1 bg-ctp-red w-full absolute bottom-0 left-0" />
	</div>
{:else}
	<div
		class="grow p-3
flex flex-col
items-center gap-3"
	>
		<div class="flex items-center w-full gap-1">
			<span class="items-center material-icons-round text-2xl"> account_circle </span>

			<div class="grow" />

			<h1 class="text-2xl">Account</h1>

			<div class="grow" />

			<a href="/" class="items-center material-icons-round text-2xl"> close </a>

			<!-- <div class="w-4 h-4"></div> -->
		</div>
		<form
			method="POST"
			action="?/login"
			class="text-lg
    md:border border-neutral-500 p-3 rounded-lg
    flex flex-col gap-3 items-stretch w-full md:w-56"
			on:submit={() => {
				os = window.navigator.platform || 'unknown';

				console.log(os);
			}}
		>
			<label>
				Email
				<input name="email" type="email" class="w-full dark:bg-black" />
			</label>
			<label>
				Password
				<input name="password" type="password" class="w-full dark:bg-black" />
			</label>
			<label>
				Address
				<input name="address" type="text" class="w-full dark:bg-black" />
			</label>
			<input type="hidden" name="os" id="os" value={os} />
			<button class="border border-neutral-500 rounded-lg">Log in</button>
			<button class="border border-neutral-500 rounded-lg" formaction="?/register">Register</button>
		</form>
	</div>
{/if}
