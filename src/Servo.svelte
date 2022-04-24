<script lang="ts">
    let name = "Servo 0";
    let value = 127;
</script>

<div class="container">
    <h2>{name}</h2>
    <div class="row">
        <input type="range" min={0} max={255} step={1} bind:value={value}>
        <p>{value}</p>
        <button on:click={() => value++}>+</button>
    </div>
</div>

<style>
    .container {
        background-color: teal;
        border-radius: 0.5em;
        padding: 0.5em;
    }
    .row {
        display: flex;
    }
</style>