<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	console.log(data);
</script>

<div
	class="grow p-4 pt-3 bg-ctp-crust
flex flex-col gap-3 overflow-y-scroll maincontainer"
>
	<div class="flex gap-2 items-center">
		<h1 class="text-xl">Sessions</h1>
		<div class="h-px bg-neutral-500 grow" />
	</div>

	<div class="flex flex-col gap-1 p-3">
		{#each data.sessions as session}
			<div class="flex gap-1 items-center">
				<div>{session.id} - {session.appName} on {session.deviceOS}</div>
				{#if session.id == data.sessionid}
					<div>(current)</div>
				{/if}
				{#if session.expirationDate <= new Date()}
					<div>(expired)</div>
				{/if}
				<form method="POST" action="?/deletesession">
					<input type="hidden" name="sessionid" id="sessionid" value={session.id} />
					<button class="">
						<span class="material-icons-round text-2xl">delete</span>
					</button>
				</form>
			</div>
		{/each}
	</div>

	<div class="flex gap-2 items-center">
		<h1 class="text-xl">Profile picture</h1>
		<div class="h-px bg-neutral-500 grow" />
	</div>

	<div class="flex gap-3 flex-col">
		<img src="/account/files/file/{data.profilePicture}/get/content" alt="pfp" />

		<form
			method="POST"
			action="?/removepfp"
			class="
    flex flex-col
    gap-5
    rounded-lg
    "
		>
			<button
				class="
        p-2 px-4
        bg-ctp-red dark:text-black
        rounded-full" style="width: 128px;">Remove</button
			>
		</form>
	</div>

	<div class="flex gap-2 items-center">
		<h1 class="text-xl">Themes</h1>
		<div class="h-px bg-neutral-500 grow" />
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
		{#each data.themes as theme}
			<div class="flex gap-1 items-center">
				<div>{theme.id} - {theme.name}</div>
				{#if theme.id == data.currentTheme?.id}
					<div>(current)</div>
				{/if}
				<form method="POST" action="?/deletetheme">
					<input type="hidden" name="themeid" id="themeid" value={theme.id} />
					<button class="">
						<span class="material-icons-round text-2xl">delete</span>
					</button>
				</form>
			</div>
		{/each}

		<a
			href="/theme/new"
			class="
backdrop-option
bg-ctp-mantle
rounded-lg
flex justify-center items-center w-32 h-24"
		>
			<span class="material-icons-outlined"> add </span>
		</a>
	</div>

	<div class="flex gap-2 items-center">
		<h1 class="text-xl">Account management</h1>
		<div class="h-px bg-neutral-500 grow" />
	</div>

	<form method="POST" action="?/edit" class="flex flex-col gap-4 p-3 text-lg">
		<label>
			Email
			<input name="email" type="email" class="w-full dark:bg-black" value={data.email} />
		</label>
		<label>
			Password
			<input name="password" type="password" class="w-full dark:bg-black" />
		</label>
		<label>
			Username
			<input name="name" type="text" class="w-full dark:bg-black" value={data.name} />
		</label>
		<label>
			Address
			<input name="address" type="text" class="w-full dark:bg-black" value={data.address} />
		</label>

		<div class="flex pt-1 gap-3">
			<button class="flex gap-1 items-center border rounded-full border-neutral-500 px-4 text-lg">
				<span class="material-icons-round text-2xl">save</span>
				Save changes
			</button>
			<button
				formaction="?/logout"
				class="flex gap-1 items-center border rounded-full border-neutral-500 px-4 text-lg"
			>
				<span class="material-icons-round text-2xl">logout</span>
				Log out
			</button>
		</div>
	</form>

	<div class="flex gap-2 items-center">
		<h1 class="text-xl text-ctp-red">Danger zone</h1>
		<div class="h-px bg-neutral-500 grow" />
	</div>

	<div class="flex flex-col gap-4">
		<form
			method="POST"
			action="?/delete"
			on:submit={(event) => {
				if (!window.confirm('Do you really want to delete your acocunt?')) {
					event.preventDefault();
				}
			}}
		>
			<button
				class="flex gap-1 items-center border border-ctp-red rounded-full px-4 text-lg text-ctp-red"
			>
				<span class="material-icons-round text-2xl">delete</span>
				Delete account
			</button>
		</form>
	</div>
</div>

<style>
	img {
		width: 128px;
		max-width: 128px;
		min-width: 128px;
		min-height: 128px;
		height: 128px;
		max-height: 128px;
		border-radius: 100%;
	}

	.maincontainer {
/* 
		
		backdrop-filter: blur(16px) saturate(180%);
		-webkit-backdrop-filter: blur(16px) saturate(180%);
		background-color: rgba(17, 25, 40, 0.952);
		border: 1px solid rgba(255, 255, 255, 0.125);
		border-width: 0 0 1px 0; */
	}

</style>
