<script>
    import { read } from '$app/server';
    import { toast } from '@zerodevx/svelte-toast';
    import SimpleInput from '../simpleInput.svelte';

    export let origin = {};

    export let name = "";
    export let type = "";

    export let items = [];

    export let other;

    if(other != undefined && !items.find(({type}) => type == "other")) {
        items.push({
            ignore: true,
            type: "other",
            selected: false,
            sendValue: "other"
        });
        console.log(items);
        
    }

    let listDOM = [];

    let animatingIndex = -1;
    const playAnimation = (i, evt) => {
        evt?.preventDefault();        
        
        toast.pop();
        toast.push(`
        <div style="display: flex; align-items: center; gap: 0.5rem">
            <span>🚫</span>
            <span><strong>Campo obrigatório</strong><br>${isSingle? "Uma opção deve estar selecionada": "Ao menos uma opção deve ser selecionada"}</span>
        </div>`,
            {
                theme: {
                    '--toastBorderRadius': '0 0 10px 10px',
                    '--toastBackground': 'var(--bgColor)',
                    '--toastBarBackground': 'var(--secondColor)'
                }
            }
        );

        animatingIndex = -1;
        requestAnimationFrame(() => {
            animatingIndex = i;
        });
    }
    const stopAnimation = (i) => {
        if(animatingIndex == i) {
            animatingIndex = -1;
        }
    }

    const singleSelection = (i, evt) => {
        const selected = items.find(item => item.selected);

        if(items[i] == selected) {
            if(isMandatory) return playAnimation(i, evt);

            items[i].selected = false;
            items[i].onDeselect?.();

        } else {
            items.forEach((item, index) => {
                item.selected = index === i            
            });
            
            items[i].onSelect?.();
            selected?.onDeselect?.();
        }

        items = items;
    }

    const multipleSelection = (i, evt) => {
        const target = items[i];
        const selectedAmount = items.filter(item => item.selected).length;        
        
        if(target.selected && isMandatory && selectedAmount == 1) return playAnimation(i, evt);
        target.selected = !target.selected;

        if(target.selected) {
            target.onSelect?.();
        }
        if(!target.selected) {
            target.onDeselect?.();
        }

        isAllSelected = items.every(item => item.selected);

        items = items;
    }

    let isAllSelected = false;
    const selectAll = () => {        
        isAllSelected = items.every(item => item.selected);

        if(isAllSelected) {
            items.forEach((e,i) => {
                multipleSelection(items.length - 1 - i)
            });
        } else {
            items.forEach((e,i) => {
                if(!e.selected) multipleSelection(i)
            });
        }
    }

    const isBlock = type.includes("block");
    const isSingle = type.includes("single");
    const isAdditional = type.includes("additional");

    const isMandatory = type.includes("mandatory");

    const isIcon = type.includes("icon"); // TODO
</script>


{#if !isSingle && !(origin.readonly || origin.disabled)}
    <label>
        <button class="selectAll" on:click={selectAll}>
            {isAllSelected? "Desmarcar todos": "Marcar todos"}
        </button>
    </label>
{/if}

<div 
    class:imageCheckBoxWrapper={isBlock}
    class:simpleWrapper={!isBlock}

    class:readonly={origin.readonly}
    class:disabled={origin.disabled}
    class:selectOnlyOne={isSingle}
    class:additionals={isAdditional}
>
    {#each items as item, i }
    {#if !item.ignore}
    <label 
        class:imageCheckBoxContainer={isBlock}
        class:simpleContainer={!isBlock}

        class:selected={item.selected}
        class:refuseCheck={animatingIndex == i}
        on:on:animationend={() => stopAnimation(i)}>

        <input type="checkbox" {name} id="{name}-{i}" checked={item.selected}
            class:simpleInput={!isBlock}
            on:click={(e) => 
                isSingle?
                    singleSelection(i, e):
                    multipleSelection(i, e)
                }
            >
        <div class="labelSelector">
            {#if item.img}
                <img src="{item.img}" alt="{item.name}">
            {/if}
            
            <p>
                {#if item.favorite}
                    <span class="favorite"></span>
                {/if}
                {@html item.name}
            </p>
            <hr hidden={!isBlock}>
            <p>{@html item.desc}</p>
        </div>
    </label>
    {/if}
    {/each}

    {#if other != undefined}
    <label 
        class:imageCheckBoxContainer={isBlock}
        class:simpleContainer={!isBlock}

        class:selected={items.at(-1).selected}
        class:refuseCheck={animatingIndex == items.length - 1}
        on:on:animationend={() => stopAnimation(items.length - 1)}>

        <input type="checkbox" {name} id="{name}-{items.length - 1}" checked={items.at(-1).selected}
            class:simpleInput={!isBlock}
            on:click={(e) => 
                isSingle?
                    singleSelection(items.length - 1, e):
                    multipleSelection(items.length - 1, e)
                }
            >
        <div class="labelSelector">            
            <p>
                {other.text}
            </p>
            {#if other.input == "text"}
                <SimpleInput type="text" origin={{
                    placeholder: other.placeholder,
                    onInput: (e) => {
                        items.at(-1).sendValue = e.target.value;
                    }
                }} />
            {/if}
        </div>
    </label>
    {/if}
</div>



<style lang="scss">

@use '$style/_palette.scss' as palette;

$mainLighter: color-mix(in srgb, #{palette.$mainColor}, white 5%);
$mainDarker: color-mix(in srgb, #{palette.$mainColor}, #ffa638 15%);

.simpleWrapper {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    gap: 10px;
    margin-top: 20px;
    user-select: none;

    &.readonly, &.disabled {
        cursor: not-allowed;
        filter: blur(.3px) opacity(.7);

        .imageCheckBoxContainer {
            pointer-events: none;
        }

        &.disabled {
            filter: blur(.7px) opacity(.7) grayscale(100%);
        }
    }

    .simpleContainer {
        display: flex;
        align-items: center;
        gap: 5px;
        padding-inline: 40px;
        padding-block: 5px;
        border-radius: 5px;
        width: 100%;
        max-width: 300px;

        background: $mainLighter;

        box-shadow: 0 2px 2px 1px rgba(0, 0, 0, 0.25);
        
        transition: box-shadow 1s;

        &.selected {
            box-shadow: 0 0 8px 2px palette.$secondColor;
        }

        :global(:has(#darkModeSwitch:checked)) & {
            background: palette.$bgColor;

            & input[type="checkbox"]:not(:checked)::after {
                color: color-mix(in srgb, #{palette.$mainColor}, #{palette.$secondColor} 40%);
            }
        }

        
    }
    
}


.refuseCheck {
    --amt: 3;
    --Pdeg: calc(var(--amt) * 1deg);
    --Ndeg: calc(var(--amt) * -1deg);
    animation: refuseCheck .15s linear 2;
}
@keyframes refuseCheck {
    0%   { transform: rotate(0deg); }
    25%  { transform: rotate(var(--Pdeg)); }
    50%  { transform: rotate(0deg); }
    75%  { transform: rotate(var(--Ndeg)); }
    100% { transform: rotate(0deg); }
}


.selectAll {
    width: 100%;
    background: palette.$secondColor;
    border: none;
    margin-top: 25px;
    width: auto;
    display: block;
    margin-inline: auto;
    padding: 5px;
    padding-inline: 10px;
    color: palette.$bgColor;
    border-radius: 5px;
    cursor: pointer;
}



/* isBlock */

.imageCheckBoxWrapper {
    width: 100%;
    display: grid;
    place-items: center;
    gap: 20px;
    margin-top: 30px;
    user-select: none;

    &.readonly, &.disabled {
        cursor: not-allowed;
        filter: blur(.3px) opacity(.7);

        .imageCheckBoxContainer {
            pointer-events: none;
        }

        &.disabled {
            filter: blur(.7px) opacity(.7) grayscale(100%);
        }
    }
}

.imageCheckBoxContainer {
    height: 200px;
    width: 200px;
    --_lighterMainColor: #{$mainLighter};
    background: var(--_lighterMainColor);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    transition: box-shadow 1s;
}
:global(:has(#darkModeSwitch:checked)) .imageCheckBoxContainer {
    --_lighterMainColor: #{$mainDarker};
}
.imageCheckBoxWrapper.minified .imageCheckBoxContainer  {
    height: 200px;
    width: 120px; 
}

.imageCheckBoxContainer.selected {
    box-shadow: 0 0 20px palette.$secondColor;
}

input[type="checkbox"] {
    -webkit-appearance: none;
    appearance: none;
    margin-top: 13px;
    position: relative;
    width: 100%;
    cursor: pointer;
    z-index: 10;
    pointer-events: none;

    &.simpleInput {
        margin: 0;
        width: auto;
        pointer-events: all;
        margin-bottom: 8px;
    }
}
input[type="checkbox"]:after {
    position: absolute;
    font-family: "Font Awesome 5 Free";
    font-weight: 400;
    content: "\f0c8";
    font-size: 18px;
    color: palette.$bgColor;
    right: 10px;
    top: -5px;
    transition: color .2s;
}
input[type="checkbox"]:checked:after {
    font-weight: 900;
    content: "\f14a";
    color: palette.$secondColor;
}

/* only one */
.selectOnlyOne
input[type="checkbox"]:after {
    background: var(--_lighterMainColor);
    padding: 4px;
    border-radius: 50%;
    content: "\f111";
}
.selectOnlyOne
input[type="checkbox"].simpleInput:after {
    padding: 0;
}
.selectOnlyOne
input[type="checkbox"]:checked:after {
    content: "\f058";
}

/* aditionals */
.additionals
input[type="checkbox"]:after {
    content: "\f0c8";
}
.additionals
input[type="checkbox"]:checked:after {
    content: "\f0fe";
}

/* only one and aditionals */
.additionals.selectOnlyOne
input[type="checkbox"]:after {
    content: "\f111";
}
.additionals.selectOnlyOne
input[type="checkbox"]:checked:after {
    content: "\f055";
}



.imageCheckBoxContainer .labelSelector {
    height: 100%;
    width: 100%;
    position: absolute;
}

.imageCheckBoxContainer img {
    height: 60%;
    max-width: 100%;
    margin: auto;
    pointer-events: none;
    position: relative;
    margin-top: 5px;
    margin-bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 5px;
}

.imageCheckBoxContainer p {
    overflow-wrap: break-word;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    text-align: center;
    padding-top: 5px;
    padding-bottom: 3px;
}


.imageCheckBoxContainer hr {
    border: none;
    border-bottom: 7px solid palette.$secondColor;
    border-radius: 20px;
    border-color: palette.$bgColor;
    border-width: 5px;
    margin-left: 10px;
    margin-right: 10px;
    transition: border-color .2s;
}

.imageCheckBoxContainer.selected hr {
    border-color: palette.$secondColor;
}

.imageCheckBoxContainer label {
    cursor: pointer;
}


@media screen and (min-width: 950px) {
    .imageCheckBoxWrapper {
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
    }
    .imageCheckBoxWrapper.minified {
        grid-template-columns: repeat(6, 1fr);
        gap: 10px;
    }
    .imageCheckBoxContainer {
        height: 300px;
        width: 300px;
    }
    input[type="checkbox"]:after {
        font-size: 22px;
    }
}

@media screen and (max-width: 1240px) {
    .imageCheckBoxWrapper {
        grid-template-columns: repeat(2, 1fr);
        gap: 50px;
    }
    .imageCheckBoxWrapper.minified {
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
    }
    .imageCheckBoxContainer img {
        height: 50%;
    }
    
    .imageCheckBoxContainer {
        height: 250px;
        width: 250px;
    }

    .imageCheckBoxContainer .name {
        margin-top: 0;
    }
    .imageCheckBoxContainer .price {
        margin-top: 0;
    }
}
@media screen and (max-width: 700px) {
    .imageCheckBoxWrapper {
        grid-template-columns: repeat(1, 1fr);
        gap: 50px;
    }
    .imageCheckBoxWrapper.minified {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }
    
    .imageCheckBoxContainer {
        height: 300px;
        width: 300px;
    }
    .imageCheckBoxContainer img {
        height: 65%;
    }
}
</style>