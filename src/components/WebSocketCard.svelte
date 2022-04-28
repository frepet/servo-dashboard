<Card>
    <Content>
        <h2>WebSocket</h2>
        Port: <input id="port" class="port" type="number" min={1024} max={65535} bind:value={port}/>

        {#if connected}
            <button on:click={() => WS.close()}>Disconnect</button>
        {:else}
            <button on:click={() => WS.open(`ws://localhost:${port}`)}>Connect</button>
        {/if}

        <hr/>
        <div class="messages" id="msgbox" on:mouseenter={() => mouseOver = true} on:mouseleave={() => mouseOver = false}>
            {#each msgs as msg}
                <p>{msg}</p>
            {/each}
        </div>
    </Content>
</Card>

<script lang="ts">
    import WS from "../stores/WebsocketStore";
    import { pwms } from "../stores/PWMStore";
    import Card, { Content } from "@smui/card";

    let msgs: string[] = [];
    let port: number = 22022;
    let connected = false;
    let mouseOver = false;

    $: {
        if ($WS) {
            msgs = [...msgs, $WS];
        }
        connected = WS.isOpen();
    }

    $: {
        let portElement = document.getElementById("port") as HTMLInputElement;
        if (portElement) portElement.disabled = connected;
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

<style>
    h2 {
        margin-top: 0em;
    }

    .port {
        margin-top: 0px;
        background-color: beige;
        border-radius: 0.5em;
        width: 5em;
    }

    .messages {
        overflow-y: auto;
        max-height: 20em;
    }

    .messages p {
        margin: 0em;
    }
</style>