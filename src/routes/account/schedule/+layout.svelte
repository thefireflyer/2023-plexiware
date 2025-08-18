<script lang="ts">
	import Transition from '$lib/components/transition.svelte';

	import { navigating } from '$app/stores';

	let pageUrl = '';

	let animated = true;

	navigating.subscribe((nav) => {
		if (nav) {
			console.log(nav);
			console.log(nav.to?.url.pathname);
			if (nav.to) {
				pageUrl = nav.to.url.pathname.split('/')[3];

				if (nav.from?.url.pathname.split('/')[2] != nav.to.url.pathname.split('/')[2]) {
					animated = false;
				} else {
					animated = true;
				}
			}
		}
	});
</script>

<div
	class="grow p-4 pt-3
flex flex-col gap-3 relative"
>
	<Transition
		url={pageUrl}
		classes="
                absolute top-0 left-0
                w-full h-full
                flex
                overflow-hidden flex-col md:flex-row"
		{animated}
	>
		<slot />
	</Transition>
</div>
