<script lang="ts">
    import { axes } from "./AxesStore";
    import { pwms } from "./PWMStore";
    import { clamp } from "./utils";

    export let id: number = 0;

    let axis: number = -1;
    let min: number = 0;
    let max: number = 255;
    let startValue = 127;
    let speed = 1.0;

    $pwms[id] = startValue;

    $: min = clamp(min, 0, max);

    let poll: number;
    const loop = () => {
        if (axis > -1) {
            $pwms[id] = clamp($pwms[id] + ($axes[axis] ?? 0) * speed, min, max);
        } else {
            $pwms[id] = clamp($pwms[id], min, max);
        }
        poll = requestAnimationFrame(loop);
    }
    loop();
</script>

<div class="servocontents">
    <ul>
        <li class="row">
            <p class="label">PWM</p>
            <p class="value">{Math.round($pwms[id])}</p>
            <input class="slider" type="range" min=0 max=255 step={1} bind:value={$pwms[id]}>
        </li>

        <li class="row">
            <p class="label">Min</p>
            <p class="value">{min}</p>
            <input class="slider" type="range" min={0} max={255} step={1} bind:value={min}>
        </li>

        <li class="row">
            <p class="label">Max</p>
            <p class="value">{max}</p>
            <input class="slider" type="range" min={0} max={255} step={1} bind:value={max}>
        </li>
    </ul>

    <ul>
        <li class="row">
            <p class="label">Gamepad Axis:</p>
            <select bind:value={axis}>
                <option value={-1}>-</option>
                {#each Array($axes.length) as _, i}
                    <option>{i}</option>
                {/each}
            </select>
        </li>

        <li class="row">
                <p class="label">Axis speed:</p>
                <input class="valueInput" type="number" step={0.1} bind:value={speed}/>
        </li>
    </ul>
</div>

<style>
    .servocontents {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    .row {
        display: flex;
        justify-content: space-between;
        height: 2em;
    }

    .row p {
        margin: auto 0 auto 0;
    }

    .row .value {
        text-align: right;
        width: 3em;
    }

    .row .valueInput {
        width: 3em;
    }
</style>