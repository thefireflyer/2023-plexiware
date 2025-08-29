<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div
	class="grow p-4 pt-3 bg-ctp-crust
flex flex-col gap-3 overflow-y-scroll maincontainer"
>
	<div class="flex gap-2 items-center">
		<h1 class="text-xl">Sessions</h1>
		<div class="h-px bg-neutral-500 grow"></div>
	</div>

	<div class="flex flex-col gap-1 p-3">
		{#each data.sessions as session}
			<div class="flex gap-1 items-center">
				<div>{session.id}</div>
				{#if parseInt(session.id.toString()) == data.sessionid}
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
		<h1 class="text-xl">Account management</h1>
		<div class="h-px bg-neutral-500 grow"></div>
	</div>

	<form method="POST" action="?/logout" class="flex flex-col gap-4 p-3 text-lg">
		<div class="flex pt-1 gap-3">
			<button class="flex gap-1 items-center border rounded-full border-neutral-500 px-4 text-lg">
				<span class="material-icons-round text-2xl">logout</span>
				Log out
			</button>
		</div>
	</form>
</div>
