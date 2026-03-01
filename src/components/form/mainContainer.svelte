<script>
    import ListSelect from "$components/inputs/selection/listSelect.svelte";
    import SimpleInput from "$components/inputs/simpleInput.svelte";

    export let content = {
        mainSection: true,
        children: []
    };    
</script>

<div class="mainContainer" class:noHeaderLine={!content.mainSection}>
    {#if content.title}
        <h2 class="title">{@html content.title}</h2>
    {/if}

    {#each content.children as item}
        {#if !item.ignore}
        
        {#if item.type == "section title"}
            <h2 class="title">{@html item.text}</h2>

        {:else if item.type == "input title"}
            <h3 class="title">{@html item.text}</h3>
        
        {:else if item.type == "text"}
            <p
                class:centered={(item.textConfig || []).includes("center")}
                class:strong={(item.textConfig || []).includes("strong")}
            >{@html item.text}</p>

        {:else if item.type == "hr"}
            <hr style="margin{item.marginType? "-" + item.marginType : ""}: {item.marginSize};">

        {:else if item.type == "br"}
            <div class="spacer" style="--size: {item.marginSize};"></div>

        {:else if item.type == "darkModeSwitch"}
            <label>
                temp DM
                <input type="checkbox" id="darkModeSwitch" checked />
            </label>

        {:else if item.type == "input"}
            {#if item.readonly}
            <p class="message">Apenas leitura</p>
            {/if}

            {#if item.disabled}
            <p class="message">Campo desabilitado</p>
            {/if}

            {#if item.inputType == "select"}
                <ListSelect name={item.name} type={item.data} items={item.items} origin={item} other={item.other} />

            {:else if ["text", "number", "password", "email", "textarea", "tel"].includes(item.inputType)}
                <SimpleInput type={item.inputType} origin={item} />            
            {/if}
        {:else if item.type == "mandatory"}
            <p class="mandatory"></p>
        {/if}

        {/if}
    {/each}
</div>

<style lang="scss">
	@use '$style/_palette.scss' as palette;

    .message {
        text-align: center;
        font-weight: bold;
        border: 2px solid palette.$secondColor;
        width: fit-content; 
        margin-inline: auto;
        padding: .3rem;
        padding-inline: .6rem;
        border-radius: 10px;
        margin-top: 15px;
    }

    
    
    .mainContainer {
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        background: palette.$mainColor;
        width: 80%;
        border-top: 15px solid palette.$secondColor;
        border-radius: 10px;
        padding: 30px;
        margin-block: 20px;

        :global(:has(#darkModeSwitch:checked)) & {
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.25);
        }

        &.noHeaderLine {
            border-top: none;
        }
        
        .title {
            text-align: center;
            margin-bottom: 20px;
        }

        p {
            &.centered {
                text-align: center;
            }
            &.strong {
                font-weight: bold;
            }
        }
        
        .sideNote {
            color: palette.$secondDark;
            font-size: 12px;
            text-align: right;
            position: relative;
            bottom: -35px;
            a {
                color: palette.$secondDark;
                
                &:hover { color: palette.$secondDark }
            }
        }

        h3 {
            text-align: center;
        }

        hr {
            border: none;
            border-bottom: 7px solid palette.$secondColor;
            border-radius: 20px;
        }

        .spacer {
            height: var(--size);
        }
        

        .mandatory {
            margin-bottom: 2px;
        }
        .mandatory::after {
            content: "Obrigatório";
            font-size: .87em;
        }
        .mandatory {
            color: palette.$mandatory;
        }
    }
</style>