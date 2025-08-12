<script lang="ts">
	///////////////////////////////////////////////////////////////////////////

	import Cols from '$lib/components/base/Cols.svelte';
	import Rows from '$lib/components/base/Rows.svelte';

	///////////////////////////////////////////////////////////////////////////

	export let inner;

	console.log(inner);

	///////////////////////////////////////////////////////////////////////////

	class Note {
		title!: String;

		nodes!: Node[];

		to!: Note[];
		from!: Note[];
	}

	class Node {
		type!: NodeType;

		children!: Node[];
		collapsed!: Boolean;
	}

	enum NodeType {}

	///////////////////////////////////////////////////////////////////////////

	let demo = `

-------------------------------------------------------------------------------
-- ///////////////////////////////////////////////////////////////////////// --
-------------------------------------------------------------------------------
Journal                                                              1 Jan 2024
...............................................................................


- Morning .....................................................................
| 
| [ ] task 1
| [ ] task 2 
| [ ] task 3
| 
+ Main ........................................................................
|
| [ ] task 1
| [ ] task 2 
|  |
|  |  [ ] task 2.1
|  |
| [ ] task 3
|  |
| [ ] task 4
| [ ] task 5
|
- Night .......................................................................
|
| [ ] task 1
| [ ] task 2 
| [ ] task 3
|
...............................................................................



- Notes .......................................................................
|
|
|
...............................................................................


-------------------------------------------------------------------------------
-- ///////////////////////////////////////////////////////////////////////// --
-------------------------------------------------------------------------------
    
    `;

	///////////////////////////////////////////////////////////////////////////

	let title = 'ID ' + inner.children[1].type;
	let html = `
	<p>
		<b>Abstract.</b> There are tests to be done on non-negative numbers for
		proper testing results and items. Core and sources should be referenced.
	</p>
	<br>
	<p>
		There are tests to be done on non-negative numbers for proper testing
		results and items. Core and sources should be referenced. 
		<b>Abstract.</b> 
	</p>
	`;

	let keystrokes = [];

	///////////////////////////////////////////////////////////////////////////
</script>

{#if inner.children[0]?.type === 'h'}
	<div class="tile flex-row">
		{#each inner.children as child}
			<svelte:self inner={child} />
		{/each}
	</div>
{:else if inner.children[0]?.type === 'v'}
	<div class="tile flex-col">
		{#each inner.children as child}
			<svelte:self inner={child} />
		{/each}
	</div>
{:else if inner.children[0]?.type === 'note'}
	<div class="window">
		<div class="inner">
			<h1 contenteditable="true" bind:textContent={title}></h1>
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				contenteditable="true"
				bind:innerHTML={html}
				class="inner-html"
				on:keydown={(ex) => {
					// console.log(ex);
					if (ex.key === 'b' && ex.ctrlKey) {
						ex.preventDefault();
						let sel = window.getSelection();
						console.log(sel);
						if (sel?.anchorNode?.nodeType === 3) {
						}
					}
				}}
				on:focusin={(ex) => {
					console.log('in');
				}}
				on:focusout={(ex) => {
					console.log('out');
				}}
			></div>
			<!-- <div class="block">
				<div class="block-toggle" />
				<div class="block-text" contenteditable="true" bind:innerHTML={html}>Test</div>
			</div> -->
		</div>

		<div class="minimap">
			<div class="cursor" style="top: 0"></div>
		</div>
	</div>
{:else}<div></div>{/if}

<style>
	.tile {
		display: flex;
		flex-grow: 1;

		max-width: 100%;
		max-height: 100%;

		overflow: hidden;
	}

	.window {
		position: relative;
		flex-grow: 1;
		/* border: 1pt solid rgb(50, 50, 50); */
		padding: 0.25in 1in 0.25in 1in;

		overflow-y: scroll;
		overflow-x: hidden;

		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.window .inner {
		font-family: serif;
		font-size: 14pt;
		display: block;
		min-width: 15ch;
		width: 80ch;
		max-width: 80ch;
		outline: none;
	}

	.window .inner * {
		list-style-type: disc;
	}

	/* p {
		margin-top: 0.4em;
		margin-bottom: 0.4em;
	} */

	h1 {
		color: rgb(150, 150, 150);
		font-family: 'Linux Biolinum';
	}

	h1 {
		text-align: center;
		font-size: 2em;
		margin: 1em 0 1em 0;
	}

	/* h2 {
		font-size: 1.5em;
		margin: 0.75em 0 0.75em 0;
	} */

	.minimap {
		position: absolute;
		right: 0;
		top: 15em;
		width: calc(21cm * 0.1);
		overflow: hidden;
		/* border: 1px solid rgb(100, 100, 100); */
		font-size: 2pt;
		padding: calc(1in * 0.1);
		padding-top: calc(0.5in * 0.1);

		pointer-events: none;
	}

	.minimap .cursor {
		position: absolute;
		left: 0;

		background: rgb(250, 250, 250, 0.1);

		height: 1.5cm;
		width: 100%;

		border-right: 2pt solid rgb(40, 40, 40);
	}
</style>
