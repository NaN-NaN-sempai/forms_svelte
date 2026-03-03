<script>
    import formatNumber from '$lib/formatNumber';
    import CheckBox from './checkBox.svelte';

    export let type = "text";

    export let origin = {};

    const onInput = (...args) => {
        if(type == "tel")
            inputFormatTel(...args);
        
        if(origin.onInput)
            origin.onInput(...args);

        if(origin.minified)
            textResizeWidth(...args);
        
        if(type == "textarea")
            textAreaResize(...args);
    }

    let input;
    
    const textAreaResize = (e) => {
        input.style.height = "auto";
        input.style.height = input.scrollHeight + 3 + "px";
    }

    const textResizeWidth = (e) => {
        const { value } = input;

        const lineBreaks = value.split("\n");

        const longest = lineBreaks.reduce((a, b) => a.length > b.length ? a : b);

        input.style.setProperty("--char-count", longest.length);        
    }
    

    let ignoredFormat = false;
    const inputFormatTel = (e) => {
        const { value } = input;

        const format = formatNumber(value, ignoredFormat);
        
        input.value = format;
    }
</script>

{#if type == "textarea"}
    <textarea
        class:minified={origin.minified}
        class="input"name={origin.name}
        style="--maxWidth: {origin.maxWidth || "100%"}"
        bind:value={origin.value}
        placeholder={origin.placeholder}
        bind:this={input}
        on:input={onInput}></textarea>
{:else}
    <input {type}
        class:minified={origin.minified}
        class="input"
        style="--maxWidth: {origin.maxWidth || "100%"}"
        name={origin.name}
        pattern={origin.pattern}
        bind:value={origin.value}
        placeholder={origin.placeholder}
        bind:this={input}
        on:input={onInput} />

    {#if type == "tel"}
        <label>
            <CheckBox bind:checked={ignoredFormat} origin={{
                onInput() { inputFormatTel(input); },
            }}>
                <small>Ignorar formatação</small>
            </CheckBox>
            
        </label>
    {/if}
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

    --maxWidth: 100%;

    width: 100%;
    max-width: var(--maxWidth);
    min-width: 50px;
    box-sizing: border-box;

    border-bottom: 4px solid palette.$secondColor;
    box-shadow: inset 0 0 0 2px palette.$secondColor;

    :global(:has(#darkModeSwitch:checked)) & {
        background: palette.$bgColor;
    }

    &.minified {
        --char-count: 1;

        width: calc(((var(--char-count) + 2) * .59em) + 20px);
        min-width: calc(7 * .65em);
    }
}

textarea {
    --line-count: 1;
    resize: none;
    min-height: 3rem;
}

</style>