<script>
    
    import { draw } from 'svelte/transition';
    import { fade, fly } from 'svelte/transition';
    import { quintInOut, elasticInOut } from 'svelte/easing';    

    /**
	 * @type {any}
	 */
     export let url;

     /**
	 * @type {any}
	 */
      export let classes;

      /**
	 * @type {boolean}
	 */
       export let animated = true;

</script>

{#key url} 
<div
in:fly={{ 
    easing: quintInOut,
    y: 100, 
    duration: animated ? 500 : 0, 
    opacity: 0 }}
out:fly={{ 
    easing: quintInOut,
    y: -100,
    duration: animated ? 500 : 0, 
    opacity: 0 }} class={classes}>
    <slot />
</div>
{/key}