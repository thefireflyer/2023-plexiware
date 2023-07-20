<script>
	import "../app.css";
</script>

<main class="ctp-latte dark:ctp-mocha
	bg-neutral-100 dark:bg-neutral-900
	dark:text-white
	h-full w-full
	flex flex-col md:flex-row">
	<slot />
</main>

<style>

	:global(html, body) {
		padding: 0;
		margin: 0;
		height: 100%;

		overflow: hidden;

		background: var(--md-sys-color-background);
		color: var(--md-sys-color-on-background);
		font-family: 'Open Sans', sans-serif;
	}

	::-webkit-scrollbar {
		display: none;
	}

</style>
