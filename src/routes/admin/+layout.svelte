<script lang="ts">
	import { quintInOut } from 'svelte/easing';
	import { fly, fade } from 'svelte/transition';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	const links = [
		[
			{
				url: '',
				name: 'Overview',
				icon: 'dashboard'
			},
			{
				url: '/compute',
				name: 'Compute Usage',
				icon: 'memory'
			},
			{
				url: '/storage',
				name: 'Storage Usage',
				icon: 'storage'
			},
			{
				url: '/errors',
				name: 'Logs',
				icon: 'error'
			}
		],
		[
			{
				url: '/users',
				name: 'Users',
				icon: 'account_circle'
			},
			{
				url: '/reqister-requests',
				name: 'Registeration Requests',
				icon: 'person_add'
			}
		],
		[
			{
				url: '/events',
				name: 'Events',
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
				url: '/apps',
				name: 'Connections',
				icon: 'app_registration'
			}
        ],
        [
			{
				url: '/sessions',
				name: 'Admin Sessions',
				icon: 'settings'
			}
		]
	];

	const linksAbout = [
		{
			url: '/account',
			name: 'User Account',
			icon: 'account_circle'
		},
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
			url: 'http://thefireflyer.vercel.app/',
			name: 'Other apps',
			icon: 'apps'
		}
	];

	let menuOpen = $state(false);
	let searchQuery = $state('');
</script>

<div
	class="bg-ctp-crust
grow flex flex-col
justify-center
items-stretch relative maincontainer"
>
	<header
		class="h-14 p-2 w-full
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
                    flex flex-col overflow-hidden search-results"
				>
					<div class="w-full h-10"></div>
					{#each data.searchResults as item}
						<a
							href={item.slug}
							class="w-full h-10 flex px-3 hover:bg-neutral-300 dark:hover:bg-neutral-700 items-center gap-2"
						>
							<span class="material-icons-outlined text-xl"> {item.icon} </span>
							<span class="text-lg">{item.name}</span>
						</a>
					{/each}
				</div>
			{/if}
		</div>

		<div class="md:grow"></div>

		<!-- <a href="/account" class="flex items-center hidden md:block">
				<span class="material-icons-round text-3xl"> account_circle </span>
			</a> -->
		<button
			class="flex items-center"
			onclick={() => {
				menuOpen = !menuOpen;
			}}
		>
			<span class="material-icons-round text-3xl"> {menuOpen ? `clear` : `menu`} </span>
		</button>
	</header>

	{@render children()}

	{#if menuOpen}
		<div
			role="presentation"
			tabindex="-1"
			transition:fade={{
				easing: quintInOut,
				duration: 200
			}}
			onclick={() => {
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
        flex flex-col p-3 gap-2 menu overflow-y-scroll"
		>
			{#each links as group}
				{#each group as link}
					<a
						href="/admin{link.url}"
						class="{'/admin' + link.url == data.url.pathname ? 'bg-ctp-red' : ''}
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
			{/each}
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
