<script lang="ts">
	import { quintInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import type { PageData } from '../../routes/$types';

	let menuOpen = false;

	let searchQuery = '';

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
		}
	];

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
	];
</script>

<div
	class="bg-ctp-crust
grow flex flex-col
justify-center
items-stretch relative container"
>
	<header
		class="h-12 p-2 pb-0 w-full
flex flex-row justify-between
gap-1 md:gap-3"
	>
		<a href="/" class="flex items-center hidden md:block">
			<span class="material-icons-round text-3xl"> language </span>
		</a>
		<div class="md:grow"></div>
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
        border border-neutral-400 dark:border-neutral-600 searchbar"
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
					<!-- svelte-ignore missing-declaration -->
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
		</div>

		<div class="md:grow"></div>

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

	<div class="flex grow"></div>

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
		></div>

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
					class="{'/account' + link.url == '/account' ? 'bg-ctp-red' : ''}
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

	<div class="h-1 bg-ctp-red w-full absolute bottom-0 left-0"></div>
</div>

<style>
	.container {
		color: var(--text-color);
		background: var(--bg-color);
		padding: var(--container-padding);
	}

	.container header {
		height: var(--header-height);
	}

	.container .searchbar {
		height: var(--searchbar-height);
		width: var(--searchbar-width);
		border-radius: var(--searchbar-rounding);
		padding: var(--searchbar-padding);
	}

	/* .container .icon {
		height: var(--icon-size);
		width: var(--icon-size);
		color: var(--icon-color);
		background: var(--icon-bg);
		border-radius: var(--icon-rounding);
	} */
</style>
