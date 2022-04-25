<script lang="ts">
    import { axes } from "./AxesStore";
    let axis: number[] = [];

    let poll: number;

    const plugIn = () => {
        startController();
    }

    const plugOut = () => {
        cancelAnimationFrame(poll);
    }

    const startController = () => {
        const gamepads = navigator.getGamepads();
        if (!gamepads) {return}
        
        const pad = gamepads[0];

        pad.axes.forEach((val, i) => {
            axis[i] = val;
            $axes[i] = val;
        });

        poll = requestAnimationFrame(startController);
    }

</script>

<svelte:window
    on:gamepadconnected={plugIn}
    on:gamepaddisconnected={plugOut}
/>

<div class='container'>
    <h2>Gamepad</h2>

    {#each axis as value, i}
        <div class='row'>
            <p class="label">{i}</p>
            <input type="range" min={-1} max={1} step={0.01} {value} disabled>
            <p>{value.toFixed(2)}</p>
        </div>
    {/each}
</div>

<style>
    .container {
        background-color: teal;
        border-radius: 0.5em;
        padding: 0.5em;
        width: fit-content;
    }

    .container h2 {
        padding: 0px;
        margin: 0px;
    }

    .row {
        display: flex;
        margin-left: 0.5em;
    }

    .row input {
        margin: 0px;
        padding: 0px;
    }

    .row p {
        margin: auto 0 auto 0;
        width: 3em;
        text-align: right;
    }

    .row .label {
        width: 0.1em;
        text-align: right;
        margin-right: 0.5em;
    }
</style>