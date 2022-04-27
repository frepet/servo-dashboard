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

<div class='card'>
    <h2>Gamepad</h2>

    {#each axis as value, i}
        <div class='row'>
            <p class="label">{i}</p>
            <p>{value.toFixed(2)}</p>
            <input class="slider" type="range" min={-1} max={1} step={0.01} {value} disabled>
        </div>
    {/each}
</div>