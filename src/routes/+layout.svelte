<script>
	import '$style/index.scss';
	import favicon from '$lib/assets/favicon.svg';

	import { SvelteToast } from '@zerodevx/svelte-toast';

	let { children } = $props();
</script>

<SvelteToast options={{}}/>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
