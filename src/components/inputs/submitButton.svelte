<script>
    export let origin = {};
    

    const onClick = (e) => {
        origin.config?.onClick?.(e);
    }
</script>


<div class="container">
    <button
        class:centered={origin.config?.centered}
        on:click={onClick}>
        <slot></slot>
    </button>
</div>


<style lang="scss">
    @use '$style/_palette.scss' as palette;

    .container {
        width: 100%;
    }

    button {
        background: palette.$bgColor;
        border: 3px solid palette.$secondColor;
        border-top: 10px solid palette.$secondColor;
        border-radius: 10px;
        padding: 10px;
        padding-inline: 40px;
        color: palette.$mainDark;
        cursor: pointer;
        font-size: 1.5rem;
        font-weight: bold;

        &.centered {
            margin-inline: auto;
            display: block;
        }
    }
</style>