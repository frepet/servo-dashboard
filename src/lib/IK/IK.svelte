<script lang="ts">
	import { axes } from '$lib/stores/AxesStore';
	import Slider from '@smui/slider';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import { onMount } from 'svelte';
	import { draw } from './draw';
	import { Vec2 } from './vec2';
	import { IK } from './IK';

	let context : any;


	onMount(() => {
		let canvas : any = document.getElementById("canvas");
		console.log(canvas);
		context = canvas.getContext("2d");
		console.log(context);
		
		let IKobject = new IK();

		draw(context,IKobject.servos,IKobject.base,IKobject.arm,IKobject.target,canvas.width,canvas.height);

	});

	function update(){
		
		
	}



</script>

<Accordion multiple>
	<Panel>
		<Header>IK</Header>
		<Content>
			<div id="canvas-card">
				<canvas height="500" id="canvas" width="1300" />
			</div>
			<Panel>
				<Header>IK settings</Header>
				<Content>
					<h2>Base plate</h2>
					<p class="label">Base Position (mm)</p>
					<p class="value" />
					<input class="slider" type="range" min="0" max="1000" step={1} />
					<p class="label">Base Position (mm)</p>
					<p class="value" />
					<input class="slider" type="range" min="0" max="1000" step={1} />

					<h2>Limb lenghts</h2>
					<p class="label">Limb Lengths (mm)</p>
					<p class="value" />
					<input class="slider" type="range" min="0" max="1000" step={1} />
					<p class="label">Limb Lengths (mm)</p>
					<p class="value" />
					<input class="slider" type="range" min="0" max="1000" step={1} />

					<h2>Target Speeds</h2>
					<p class="label">Limb Lengths (mm)</p>
					<p class="value" />
					<input class="slider" type="range" min="-100" max="100" step={1} />
					<p class="label">Limb Lengths (mm)</p>
					<p class="value" />
					<input class="slider" type="range" min="-100" max="100" step={1} />

					<h2>Gamepad</h2>
					<p class="label">X Axis:</p>
					<select>
						<option value={-1}>-</option>
						{#each Array($axes.length) as _, i}
							<option>{i}</option>
						{/each}
					</select>
					<p class="label">Y Axis:</p>
					<select>
						<option value={-1}>-</option>
						{#each Array($axes.length) as _, i}
							<option>{i}</option>
						{/each}
					</select>
				</Content>
			</Panel>
		</Content>
	</Panel>
</Accordion>

<style>
	.row {
		display: flex;
		height: 2em;
	}

	.row p {
		margin: auto 0 auto 0;
	}

	.row .value {
		min-width: 4em;
	}

	.button {
		border-radius: 0.5em;
		border: solid #676778 1px;
		width: 2em;
		text-align: center;
		padding: 0.3em 0 0.5em 0;
	}

	.pressed {
		background-color: #ff3e00;
	}

	.label {
		min-width: 1.5em;
		text-align: right;
	}
</style>
