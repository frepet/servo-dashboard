<script lang="ts">
    import WS from "./WebsocketStore";
    import { pwms } from "./PWMStore";

    export let url: string;
    let msgs: string[] = [];

    $: {
        if ($WS) {
            msgs = [...msgs, $WS];
        }
    }

    let poll: number;
    const loop = () => {
        if ($WS) {
            $WS = JSON.stringify($pwms.map((pwm) => Math.ceil(pwm)));
        }
        poll = requestAnimationFrame(loop);
    }
    loop();
</script>

<div class="output">
    <h3>WebSocket connector</h3>
    <p class="url">{url}</p>
    <button on:click={() => WS.open(url)}>Open</button>
    {#each msgs as msg}
        <p>{msg}</p>
    {/each}
</div>

<style>
    .output {
        background-color: teal;
        border-radius: 0.5em;
        padding: 0.5em;
    }
    h3 {
        margin-bottom: 0px;
    }
    .url {
        margin-top: 0px;
    }
</style>