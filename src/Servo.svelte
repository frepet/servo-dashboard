<script lang="ts">
    import { axes } from "./AxesStore";
    import { pwms } from "./PWMStore";
    import { clamp } from "./utils";

    export let axis: number = -1;
    export let startValue = 127;
    export let speed = 1.0;
    export let id: number = 0;

    let name = `Servo ${id}`;

    $pwms[id] = startValue;

    let poll: number;
    const loop = () => {
        if (axis > -1) {
            $pwms[id] = clamp($pwms[id] + ($axes[axis] ?? 0) * speed, 0, 255);
        }
        poll = requestAnimationFrame(loop);
    }
    loop();
</script>

<div class="container">
    <h2>{name}</h2>
    <div class="row">
        <input type="range" min={0} max={255} step={1} bind:value={$pwms[id]}>
        <p>{Math.round($pwms[id])}</p>
        <button on:click={() => $pwms[id]--}>-</button>
        <button on:click={() => $pwms[id]++}>+</button>
    </div>
    <div class="row">
        <p>Gamepad Axis:</p>
        <select bind:value={axis}>
            <option value={-1}>-</option>
            {#each Array($axes.length) as _, i}
                <option>{i}</option>
            {/each}
        </select>
    </div>
</div>

<style>
    .container {
        background-color: teal;
        border-radius: 0.5em;
        padding: 0.5em;
    }

    h2  {
        padding: 0px;
        margin: 0px;
    }

    .row {
        display: flex;
        justify-content: space-between;
    }

    .row p {
        margin: auto 0 auto 0;
        min-width: 3em;
        text-align: center;
    }
</style>