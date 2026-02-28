<script>
    export let type = "text";

    export let origin = {};


    console.log("TYPE", type, origin);

    const onInput = (...args) => {
        if(origin.onInput)
            origin.onInput(...args);
        
        if(type == "textarea")
            textAreaResize(...args);
    }
    
    const textAreaResize = (e) => {
        const textarea = e.target;
        const { value } = textarea;

        const lineBreaks = value.split("\n").length;
        
        textarea.style.setProperty("--line-count", lineBreaks);
    }
    
</script>

{#if type == "textarea"}
    <textarea class="input"name={origin.name} bind:value={origin.value} placeholder={origin.placeholder} on:input={onInput}></textarea>
{:else}
    <input {type} name={origin.name} class="input" bind:value={origin.value} placeholder={origin.placeholder} on:input={onInput} />
{/if}


<style lang="scss">
@use '$style/_palette.scss' as palette;

$mainLighter: color-mix(in srgb, #{palette.$mainColor}, white 5%);
$mainDarker: color-mix(in srgb, #{palette.$mainColor}, #ffa638 15%);

.input {
    background: $mainLighter;
    border: none;
    border-radius: 5px;
    padding: 5px;
    padding-inline: 10px;
    color: color-mix(in srgb, #{palette.$mainDark}, rgb(0, 0, 0) 20%);

    width: 100%;

    border-bottom: 4px solid palette.$secondColor;
    box-shadow: inset 0 0 0 2px palette.$secondColor;

    :global(:has(#darkModeSwitch:checked)) & {
        background: palette.$bgColor;
    }
}

textarea {
    --line-count: 1;
    resize: none;
    min-height: 2rem;
    height: calc(var(--line-count, 1) * .95rem);
}
</style>