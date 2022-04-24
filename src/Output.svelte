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

<h3>OUTPUT({url}):</h3>
<button on:click={() => WS.open(url)}>Open</button>
{#each msgs as msg}
    <p>{msg}</p>
{/each}