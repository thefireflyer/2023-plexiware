<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div
	class="grow p-3
flex flex-col
items-center gap-3"
>
	<div class="md:grow"></div>
	<div class="login rounded-2xl p-3">
		<div class="card p-3">
			<div class="flex items-center w-full gap-1">
				<span class="items-center material-icons-round text-2xl"> account_circle </span>

				<div class="grow"></div>

				<h1 class="text-2xl">Admin</h1>

				<div class="grow"></div>

				<a href="/" class="items-center material-icons-round text-2xl"> close </a>
			</div>
			<form
				method="POST"
				class="text-lg
    flex flex-col gap-3 items-stretch w-full md:w-56"
			>
				<label>
					Password
					<input name="password" type="password" class="w-full dark:bg-black" />
				</label>
				<button class="border border-neutral-500 rounded-lg">Log in</button>
			</form>
		</div>
	</div>
	<div class="md:grow"></div>
	<div class="md:grow"></div>
</div>

<style>
	.login {
		background-image: url('https://4.bp.blogspot.com/-HatqCYL4tsw/UIY_MhXK3mI/AAAAAAAAL-M/8YjrYY29i34/s1600/Abstract+Purple+Wallpapers+2.jpg');
		background-position: center;
		background-size: cover;
	}

	/* Glassmorphism card effect */
	.login .card {
		backdrop-filter: blur(16px) saturate(180%);
		-webkit-backdrop-filter: blur(16px) saturate(180%);
		background-color: rgba(17, 25, 40, 0.82);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.125);
	}
</style>
