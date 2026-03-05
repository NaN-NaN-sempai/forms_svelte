<script>
    export let origin = {};


    const onClick = (e) => {
        origin.config?.onClick?.(e);
    }

    const whatsapp = origin.config.kind == "whatsapp";
</script>


<div class="container">
    <button
        class:whatsapp
        class:centered={origin.config?.centered}
        on:click={onClick}>

        {#if whatsapp}
           <svg width="23" height="23" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.629883 28.9754L2.62298 21.6971C1.39356 19.5669 0.746885 17.1505 0.747788 14.675C0.75095 6.93056 7.05323 0.629883 14.7975 0.629883C18.5555 0.631464 22.083 2.09421 24.7356 4.74909C27.388 7.40398 28.8483 10.933 28.8469 14.6863C28.8436 22.4305 22.5404 28.7321 14.7975 28.7321C14.7977 28.7321 14.797 28.7321 14.7975 28.7321H14.7914C12.4401 28.7312 10.1298 28.1414 8.07779 27.0222L0.629883 28.9754ZM8.42269 24.4796L8.84936 24.7324C10.6419 25.7962 12.6971 26.3589 14.793 26.36H14.7975C21.2335 26.36 26.4719 21.1225 26.4746 14.6854C26.4757 11.5659 25.2624 8.6325 23.0576 6.42596C20.8527 4.21943 17.9211 3.00356 14.8018 3.00221C8.36058 3.00221 3.12238 8.23903 3.1199 14.6759C3.11899 16.8818 3.73607 19.0298 4.90519 20.8887L5.18301 21.3305L4.00306 25.6383L8.42269 24.4796Z" fill="white"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.286 8.80331C11.0231 8.21875 10.7462 8.207 10.4959 8.19684C10.2913 8.18803 10.0571 8.18848 9.8233 8.18848C9.5893 8.18848 9.20893 8.27657 8.88729 8.6278C8.56542 8.97904 7.65833 9.82832 7.65833 11.5556C7.65833 13.283 8.91643 14.952 9.09193 15.1865C9.26743 15.4207 11.5205 19.0785 15.0886 20.4857C18.054 21.6552 18.6573 21.4226 19.3011 21.3641C19.9448 21.3056 21.378 20.5148 21.6705 19.6951C21.9632 18.8754 21.9632 18.173 21.8753 18.0259C21.7875 17.8798 21.5535 17.7919 21.2025 17.6164C20.8515 17.4409 19.1256 16.5914 18.8037 16.4744C18.4818 16.3572 18.2478 16.2989 18.0138 16.6504C17.7796 17.0014 17.1074 17.7919 16.9026 18.0259C16.6977 18.2606 16.4928 18.29 16.1418 18.1142C15.7908 17.9383 14.6601 17.5678 13.3189 16.3719C12.2754 15.4415 11.5706 14.2922 11.3658 13.9408C11.1611 13.5898 11.3624 13.4163 11.52 13.2245C11.804 12.8792 12.2803 12.2583 12.3973 12.0243C12.5143 11.7898 12.4558 11.5849 12.3682 11.4092C12.2803 11.2337 11.598 9.49764 11.286 8.80331Z" fill="white"></path>
            </svg>
        {/if}

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

    button.whatsapp {
        font-size: 23px;
        box-shadow: 0 0 10px var(--bgColor);
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        padding: 13px;
        border-radius: 20px;
        background: rgb(12, 192, 66);
        border-width: 2px;
        border-style: solid;
        border-color: white;
        border-image: initial;
        gap: 10px;

        &, & * {
            color: white;
        }

        &:hover {
            background: 
        color-mix(in srgb, rgb(12, 192, 66) 80%, black);
        }
    }
</style>