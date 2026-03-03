<script>
    import MainContainer from "./form/mainContainer.svelte";


    export let formContent = [];    

    let form;

</script>

<form on:submit|preventDefault bind:this={form}>

    {#each formContent as section}
        <MainContainer content={section} />
    {:else}
        EMPTY
    {/each}
    
</form>

<style lang="scss">

</style>