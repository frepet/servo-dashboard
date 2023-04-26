<script lang="ts">
	import { axes } from '$lib/stores/AxesStore';
	import { state } from '$lib/stores/StateStore';
	import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
	import { onMount } from 'svelte';
	import { draw } from './draw';
	import { IK } from './IK';
	import { buttons } from '$lib/stores/ButtonsStore';
	import { vec2 } from './vec2';

	let context: CanvasRenderingContext2D;
	let canvas: any;

	onMount(() => {
		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');
	});

	$: $state, addServoToIk();

	function addServoToIk() {
		if ($state.ik == undefined) {
			return;
		}

		for (let i = $state.ik.servos.length; i < 3; i++) {
			let servo = $state.servos.at(i);
			if (servo != undefined) {
				$state.ik.addIKServo(servo);
				$state.ik = $state.ik;
			}
		}
	}

	$: $state, moveTarget();

	function moveTarget() {
		let delta = 10; // TODO fix
		if ($state.ik != undefined) {
			if ($state.ik.targetXAxis != undefined && $axes[$state.ik.targetXAxis]) {
				$state.ik.target.x +=
					deadzone($state.ik.targetXAxis, $axes[$state.ik.targetXAxis]) *
					$state.ik.ikSpeedX/10 *
					delta;
			}
			if ($state.ik.targetYAxis != undefined && $axes[$state.ik.targetYAxis]) {
				$state.ik.target.y +=
					deadzone($state.ik.targetYAxis, $axes[$state.ik.targetYAxis]) *
					$state.ik.ikSpeedY/10 *
					delta;
			}
			update();
		}
	}

	function deadzone(axis: number, val: number) {
		if (Math.abs(val) < $state.deadzones[axis]) {
			return 0;
		}
		const adjusted = (Math.abs(val) - $state.deadzones[axis]) / (1 - $state.deadzones[axis]);
		return val > 0 ? adjusted : -adjusted;
	}

	function update() {
		if ($state.ik == undefined || canvas == undefined || context == undefined) {
			console.log('IK could not update, something is undefined');
			return;
		}

		if (!($state.ik instanceof IK)) {
			console.log('$state.ik not instanceof IK')
			return;
		}

		// TODO add disable
		$state.ik.update();
		draw(
			context,
			vec2(canvas.width, canvas.height),
			$state.ik
		);
	}
</script>

<Accordion multiple>
	<Panel>
		<Header>IK</Header>
		<Content>
			<div id="canvas-card">
				<canvas height="500" id="canvas" width="1300" />
			</div>

			{#if $state.ik != undefined && $state.ik.servos.length >= 2}
				<Panel>
					<Header>Base</Header>
					<Content>
						<div class="content">
							<ul>
								<li class="row">
									X:
									<input type="number" bind:value={$state.ik.base.x}/>
								</li>

								<li class="row">
									Y:
									<input type="number" bind:value={$state.ik.base.y}/>
								</li>
							</ul>
						</div>
					</Content>
				</Panel>

				<Panel>
					<Header>First Limb (Green)</Header>
					<Content>
						<div class="content">
							<ul>
								<li class="row">
									<p class="label">Length (mm):</p>
									<input class="valueInput" type="number" bind:value={$state.ik.limbArm} />
								</li>

								<li class="row">
									<p class="label">Midpoint (&#176;):</p>
									<input class="valueInput" type="number" bind:value={$state.ik.servoMidpointArm} />
								</li>

								<li class="row">
									<p class="label">Range (&#176;):</p>
									<input class="valueInput" type="number" bind:value={$state.ik.servoRangeArm} />
								</li>
							</ul>

							<ul>
								<li class="row">
									Axis:
									<select bind:value={$state.ik.targetXAxis}>
										<option value={-1}>-</option>
										{#each Array($buttons.length) as _, i}
											<option>{i}</option>
										{/each}
									</select>
								</li>
								<li class="row">
									Speed:
									<input class="valueInput" type="number" step={0.1} bind:value={$state.ik.ikSpeedX} />
								</li>
							</ul>
						</div>
					</Content>
				</Panel>

				<Panel>
					<Header>Second Limb (Blue)</Header>
					<Content>
						<div class="content">
							<ul>
								<li class="row">
									<p class="label">Length (mm):</p>
									<input class="valueInput" type="number" bind:value={$state.ik.limbFore} />
								</li>

								<li class="row">
									<p class="label">Midpoint (&#176;):</p>
									<input class="valueInput" type="number" bind:value={$state.ik.servoMidpointForeArm} />
								</li>

								<li class="row">
									<p class="label">Range (&#176;):</p>
									<input class="valueInput" type="number" bind:value={$state.ik.servoRangeForeArm} />
								</li>
							</ul>

							<ul>
								<li class="row">
									Axis:
									<select bind:value={$state.ik.targetYAxis}>
										<option value={-1}>-</option>
										{#each Array($buttons.length) as _, i}
											<option>{i}</option>
										{/each}
									</select>
								</li>
								<li class="row">
									Speed:
									<input class="valueInput" type="number" step={0.1} bind:value={$state.ik.ikSpeedY} />
								</li>
							</ul>
						</div>
					</Content>
				</Panel>

				<Panel>
					<Header>Bounding Box (Orange)</Header>
					<Content>
						<div class="content">
							<ul>
								<li class="row">
									Back:
									<input class="valueInput" type="number" step={1} bind:value={$state.ik.boundingBox[0].x} />
								</li>

								<li class="row">
									Front:
									<input class="valueInput" type="number" step={1} bind:value={$state.ik.boundingBox[1].x} />
								</li>

							</ul>

							<ul>
								<li class="row">
									Ceiling:
									<input class="valueInput" type="number" step={1} bind:value={$state.ik.boundingBox[1].y} />
								</li>

								<li class="row">
									Floor:
									<input class="valueInput" type="number" step={1} bind:value={$state.ik.boundingBox[0].y} />
								</li>
							</ul>
						</div>
					</Content>
				</Panel>
			{/if}
		</Content>
	</Panel>
</Accordion>

<style>
	.content {
		display: flex;
		flex-direction: row;
		width: 100%;
	}

	.content ul {
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

	.row .valueInput {
		width: 3em;
	}
</style>