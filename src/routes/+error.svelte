<script>
	import { page } from '$app/stores';
</script>

<div
	class="bg-ctp-crust
grow flex flex-col
justify-center
items-center
p-3 gap-6
relative"
>
	<h1 class="text-4xl text-ctp-red font-bold">{$page.status}: {$page.error?.message}</h1>
	<div
		class="flex items-center
		border-2 border-ctp-mantle
		rounded-xl
		p-2 gap-3"
	>
		<button
			class="flex items-center justify-center w-12 h-12 hover:bg-ctp-base rounded-full"
			on:click={() => {
				history.back();
			}}
		>
			<span class="material-icons text-3xl text-ctp-pink"> arrow_back </span>
		</button>
		<a href="/" class="flex items-center justify-center w-12 h-12 hover:bg-ctp-base rounded-full">
			<span class="material-icons text-3xl text-ctp-pink"> home </span>
		</a>
		<a
			href="/account"
			class="flex items-center justify-center w-12 h-12 hover:bg-ctp-base rounded-full"
		>
			<span class="material-icons text-3xl text-ctp-pink"> face </span>
		</a>
		<button
			class="flex items-center justify-center w-12 h-12 hover:bg-ctp-base rounded-full"
			on:click={() => {
				history.forward();
			}}
		>
			<span class="material-icons text-3xl text-ctp-pink"> arrow_forward </span>
		</button>
	</div>
	<div class="basis-3/12 md:basis-0"></div>

	<div class="h-1 bg-ctp-red w-full absolute bottom-0 left-0"></div>
</div>
