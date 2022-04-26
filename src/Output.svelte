<script lang="ts">
    import WS from "./WebsocketStore";
    import { pwms } from "./PWMStore";

    let msgs: string[] = [];
    export let url: string = "ws://localhost:22022";
    let connected = false;
    let mouseOver = false;

    $: {
        if ($WS) {
            msgs = [...msgs, $WS];
        }
        connected = WS.isOpen();
    }

    let poll: number;
    const loop = () => {
        if (connected) {
            $WS = JSON.stringify({"servos": $pwms.map((pwm) => Math.ceil(pwm))});
        }

        if (!mouseOver) {
            const msgbox = document.getElementById("msgbox");
            if (msgbox) {
                msgbox.scrollTo(0, msgbox.clientHeight);
            }
        }

        poll = requestAnimationFrame(loop);
    }
    loop();
</script>

<div class="output">
    <h2>WebSocket</h2>
    <input class="url" bind:value={url}/>

    {#if connected}
        <button on:click={() => WS.close()}>Disconnect</button>
    {:else}
        <button on:click={() => WS.open(url)}>Connect</button>
    {/if}

    <hr/>
    <div class="messages" id="msgbox" on:mouseenter={() => mouseOver = true} on:mouseleave={() => mouseOver = false}>
        {#each msgs as msg}
            <p>{msg}</p>
        {/each}
    </div>
</div>

<style>
    .output {
        background-color: teal;
        border-radius: 0.5em;
        padding: 0.5em;
    }

    h2 {
        margin: 0px;
    }

    .url {
        margin-top: 0px;
        background-color: beige;
        border-radius: 0.5em;
    }

    .messages {
        overflow-y: auto;
        max-height: 20em;
    }

    .messages p {
        margin: 0em;
    }
</style>