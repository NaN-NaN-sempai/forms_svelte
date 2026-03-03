<script>
    import { nameThatColor } from "$lib/nameThatColor";
    import { onMount } from "svelte";

    export let origin = {
        value: "#ffffff",
        name: "Branco",
    };
    let outputName = "Branco";

    let outputDisplay;

    const onInput = (e) => {
        const color = nameThatColor(origin.value);
        
        origin.onInput?.(e, color);

        origin.name = color?.name;

        outputName = color?.name;

        outputDisplay.style.setProperty("--color", origin.value);
    }

    onMount(() => {
        onInput();
    })
</script>


<div class="inputColor">
    <label>
        {#if !origin.unchangeable}
            <input
            class:unchangeable={origin.unchangeable}
            type="color"
            bind:value={origin.value} on:input={onInput} >
        {/if}

        <div class="color" bind:this={outputDisplay}></div>
        
        <div class="info">
            <h1 class="name">{outputName}</h1>
            <hr>
            <h2 class="outputColor">{origin.value}</h2>
        </div>
    </label>
</div>

<style lang="scss">
	@use '$style/_palette.scss' as palette;

    .inputColor{
        background: palette.$bgColor;
        border: solid 3px palette.$secondColor;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        box-shadow: 0 0 0 palette.$secondColor;
        transition: box-shadow .2s;
        width: fit-content;

        hr {
            border: none;
            margin-inline: 2px;
            border-bottom: 3px solid palette.$secondColor;
            border-radius: 20px;
        }
    }

    .inputColor:hover {
        box-shadow: 0 0 10px 2px palette.$secondColor;
    }

    .inputColor .info {
        cursor: pointer;
        user-select: none;
        color: palette.$mainDark;

        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 5px;

        .name, .outputColor {
            border-radius: 3px;
            cursor: text;
            &:hover {
                background: #4c4c4c36;
            }
        }
        
    }

    .inputColor .name {
        font-size: 15px;
        max-width: 110px;
        text-transform: uppercase;
        user-select: all;
        overflow-wrap: break-word;
        -webkit-hyphens: auto;
        -moz-hyphens: auto;
        -ms-hyphens: auto;
        hyphens: auto;
    }

    .inputColor h2 {
        font-weight: normal;
        font-size: 17px;
    }

    .inputColor .outputColor {
        user-select: all;
        text-transform: uppercase;
    }

    .inputColor .color {
        --color: #ffffff;
        background: var(--color);
        border: none;
        cursor: pointer;
        height: 85px;
        width: 120px;
        padding: 0;
        border-bottom: 3px solid palette.$secondColor;
    }

    .inputColor input[type="color"] {
        opacity: 0;
        position: absolute;
        bottom: 0;
        height: 0;
        width: 0;
        margin: 0;
        cursor: pointer;
    }

    ::-webkit-color-swatch-wrapper {
        padding: 0;
    }

    ::-webkit-color-swatch{
        border-radius: 0;
    }

    ::-moz-color-swatch,
    ::-moz-focus-inner{
        border: none;
    }

    ::-moz-focus-inner{
        padding: 0;
    }
</style>