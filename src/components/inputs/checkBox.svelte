<script>
    export let origin = {};

    export let checked = false;

</script>

<label>
    <input type="checkbox"
        class="input"
        name={origin.name}
        bind:checked={checked}
        on:change={origin.onInput}/>

    <slot></slot>
</label>

<style lang="scss">
    @use '$style/_palette.scss' as palette;

    .input {
        width: 0;

        &::before {
            content: "\f111";
            font-family: "Font Awesome 6 Free";
            position: relative;
            left: -7px;
            top: -1px;
            cursor: pointer;
        }

        &:checked::before {
            content: "\f058";
        }
    }
    
    label {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        margin-left: 13px;
        margin-top: 3px;
    }
</style>