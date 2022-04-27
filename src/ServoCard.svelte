<script lang="ts">
    import { axes } from "./AxesStore";
    import { pwms } from "./PWMStore";
    import { clamp } from "./utils";

    export let id: number = 0;

    let name = `Servo ${id}`;
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

<div class="card">
    <h2>{name}</h2>

    <div class="row">
        <p class="label">PWM</p>
        <p>{Math.round($pwms[id])}</p>
        <input class="slider" type="range" min=0 max=255 step={1} bind:value={$pwms[id]}>
    </div>

    <div class="row">
        <p class="label">Min</p>
        <p>{min}</p>
        <input class="slider" type="range" min={0} max={255} step={1} bind:value={min}>
    </div>

    <div class="row">
        <p class="label">Max</p>
        <p>{max}</p>
        <input class="slider" type="range" min={0} max={255} step={1} bind:value={max}>
    </div>

    <div class="row">
        <p class="label">Gamepad Axis:</p>
        <select bind:value={axis}>
            <option value={-1}>-</option>
            {#each Array($axes.length) as _, i}
                <option>{i}</option>
            {/each}
        </select>
    </div>

</div>

<style>
    .row .label {
        text-align: left;
        min-width: 3em;
    }
</style>