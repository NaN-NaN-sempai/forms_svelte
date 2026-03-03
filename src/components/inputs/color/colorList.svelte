<script>
    import InputColor from "./inputColor.svelte";

    const defauletConfig = {
        list: [],
        data: [],
    };

    export let origin = {};

    origin = {
        ...defauletConfig,
        ...origin
    }

    const add = () => {
        origin.list.push({
            value: "#ffffff",
            removable: true,
        });
        origin.list = origin.list;
        
    }

    const remove = (index) => {
        origin.list.splice(index, 1);
        origin.list = origin.list;
    }

    const isMandatory = origin.data?.includes("mandatory");
    const addable = origin.data?.includes("addable");

</script>


<div class="container" name={origin.name}>
    
{#each origin.list as color, index}
    <div class="item">
        <InputColor origin={color} />
        {#if addable && 
            (origin.list.length > 1 || !isMandatory) &&
            (origin.min == null || origin.list.length > origin.min) &&
            (color.removable == null || color.removable) }
            <button class="remove" on:click={() => remove(index)} title="Remover"></button>
        {/if}
    </div>
{/each}

{#if addable &&
    (origin.max == null || origin.list.length < origin.max)}
    <button class="add" on:click={add}>
        <span class="text">
            Adicionar +
        </span>
    </button>
{/if}

</div>

<style lang="scss">
    @use '$style/_palette.scss' as palette;

    .container {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 5px;
        
        border: solid 3px palette.$secondColor;
        box-sizing: border-box;
        border-radius: 10px;
        padding: 10px;
        background: palette.$mainColor;
        box-shadow: 0 0 3px 3px palette.$bgColor inset;

        .item {
            display: flex;
            gap: 10px;

            .remove {
                cursor: pointer;
                border: none;
                background: palette.$bgColor;
                color: palette.$secondColor;
                border: solid 3px palette.$secondColor;
                border-radius: 100px;
                height: 24px;
                width: 24px;
                margin-top: 5px;
                font-weight: bold;

                &:hover {
                    box-shadow: 0 0 10px 2px palette.$secondColor;
                }

                &::after {
                    content: "\f00d";
                    font-family: "Font Awesome 6 Free";
                }
            }
        }

        .add {
            border: solid 3px palette.$secondColor;
            background: palette.$bgColor;
            border-radius: 10px;
            width: 120px;
            height: 154px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            .text {
                background: palette.$mainColor;
                padding: 5px;
                padding-inline: 10px;
                color: palette.$mainDark;
                border: solid 3px palette.$secondColor;
                border-radius: 100px;
            }    

            &:hover {
                box-shadow: 0 0 10px 2px palette.$secondColor;
            }                    
        }
    }
</style>

