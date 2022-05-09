<script lang="ts">
	import { axes } from '$lib/stores/AxesStore';
	import { state } from '$lib/stores/StateStore';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	let axis: number[] = [];
	let deadzone: number[] = [];

	for (let i = 0; i < 100; i++) {
		deadzone[i] = 0;
	}

	let poll: number;

	const plugIn = () => {
		startController();
		state.update((state) => state);
	};

	const plugOut = () => {
		cancelAnimationFrame(poll);
		state.update((state) => state);
	};

	const applyDeadzone: (val: number, i: number) => number = (val, i) => {
		if (Math.abs(val) > deadzone[i]) {
			return (val - (Math.abs(val) / val) * deadzone[i]) / (1 - deadzone[i]);
		} else {
			return 0;
		}
	};

	const startController = () => {
		const gamepads = navigator.getGamepads();
		if (!gamepads) {
			return;
		}

		const pad = gamepads[0];

		if (pad) {
			pad.axes.forEach((val, i) => {
				axis[i] = applyDeadzone(val, i);
				$axes[i] = axis[i];
			});
		}

		poll = requestAnimationFrame(startController);
	};
</script>

<svelte:window on:gamepadconnected={plugIn} on:gamepaddisconnected={plugOut} />

<Accordion multiple>
	<Panel>
		{#if axis.length > 0}
			<Header>Gamepad 0</Header>
			<Content>
				<div class="card">
					<ul>
						{#each axis as value, i}
							<li class="row">
								<p class="label">{i}</p>
								<input class="slider" type="range" min={-1} max={1} step={0.01} {value} disabled />
								<p class="value">{value.toFixed(2)}</p>
								<input type="number" min={0} max={1} step={0.05} bind:value={deadzone[i]} />
							</li>
						{/each}
					</ul>
				</div>
			</Content>
		{/if}
	</Panel>
</Accordion>

<style>
	.card {
		width: 15em;
	}

	.card ul {
		padding: 0 0 0 0.5em;
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
		min-width: 4em;
	}
</style>
