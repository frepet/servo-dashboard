<script lang="ts">
	import { axes } from '$lib/stores/AxesStore';
	import { motors } from '$lib/stores/MotorsStore';
	import { state } from '$lib/stores/StateStore';
	import { onDestroy } from 'svelte';

	export let id = 0;

	const frontLeftMotor = id * 4;
	const frontRightMotor = id * 4 + 1;
	const backLeftMotor = id * 4 + 2;
	const backRightMotor = id * 4 + 3;

	$motors[frontLeftMotor] = 0;
	$motors[frontRightMotor] = 0;
	$motors[backLeftMotor] = 0;
	$motors[backRightMotor] = 0;

	const mecanumSteer: (
		forward: number,
		strafe: number,
		rotation: number
	) => [number, number, number, number] = (forward, strafe, rotation) => {
		// Calculate the raw speeds based on joystick inputs and rotation
		let frontLeftSpeed = forward + strafe - rotation;
		let frontRightSpeed = forward - strafe + rotation;
		let backLeftSpeed = forward - strafe - rotation;
		let backRightSpeed = forward + strafe + rotation;

		// Normalize the speeds to avoid exceeding the maximum motor speed
		let maxRawSpeed = Math.max(
			Math.abs(frontLeftSpeed),
			Math.abs(frontRightSpeed),
			Math.abs(backLeftSpeed),
			Math.abs(backRightSpeed)
		);
		if (maxRawSpeed > 1.0) {
			frontLeftSpeed /= maxRawSpeed;
			frontRightSpeed /= maxRawSpeed;
			backLeftSpeed /= maxRawSpeed;
			backRightSpeed /= maxRawSpeed;
		}

		return [frontLeftSpeed, frontRightSpeed, backLeftSpeed, backRightSpeed];
	};

	let poll: number;
	const loop = () => {
		if ($state.mecanumsteers) {
			const mecanumState = $state.mecanumsteers[id];

			let forward = 0;
			if ($axes[mecanumState.forwardAxis] != undefined) {
				forward =
					mecanumState.forwardSpeed *
					$axes[mecanumState.forwardAxis] *
					(mecanumState.forwardAxisReversed ? -1 : 1);
			}

			let strafe = 0;
			if ($axes[mecanumState.strafeAxis] != undefined) {
				strafe =
					mecanumState.strafeSpeed *
					$axes[mecanumState.strafeAxis] *
					(mecanumState.strafeAxisReversed ? -1 : 1);
			}

			let rotation = 0;
			if ($axes[mecanumState.rotationAxis] != undefined) {
				rotation =
					mecanumState.rotationSpeed *
					$axes[mecanumState.rotationAxis] *
					(mecanumState.rotationAxisReversed ? -1 : 1);
			}

			let result = mecanumSteer(forward, strafe, rotation);

			$motors[frontLeftMotor] = result[0];
			$motors[frontRightMotor] = result[1];
			$motors[backLeftMotor] = result[2];
			$motors[backRightMotor] = result[3];
		}
		poll = requestAnimationFrame(loop);
	};
	loop();

	onDestroy(() => cancelAnimationFrame(poll));
</script>

<div class="servocontents">
	{#if $state.mecanumsteers[id]}
		<ul>
			<li class="row">
				<p class="label">Front Left</p>
				<p class="value">{$motors[frontLeftMotor].toFixed(2)}</p>
				<input
					class="slider"
					type="range"
					min={-1}
					max={1}
					step={0.01}
					bind:value={$motors[frontLeftMotor]}
				/>
			</li>

			<li class="row">
				<p class="label">Front Right</p>
				<p class="value">{$motors[frontRightMotor].toFixed(2)}</p>
				<input
					class="slider"
					type="range"
					min={-1}
					max={1}
					step={0.01}
					bind:value={$motors[frontRightMotor]}
				/>
			</li>

			<li class="row">
				<p class="label">Back Left</p>
				<p class="value">{$motors[backLeftMotor].toFixed(2)}</p>
				<input
					class="slider"
					type="range"
					min={-1}
					max={1}
					step={0.01}
					bind:value={$motors[backLeftMotor]}
				/>
			</li>

			<li class="row">
				<p class="label">Back Right</p>
				<p class="value">{$motors[backRightMotor].toFixed(2)}</p>
				<input
					class="slider"
					type="range"
					min={-1}
					max={1}
					step={0.01}
					bind:value={$motors[backRightMotor]}
				/>
			</li>

			<li class="row">
				<p class="label">Forward Speed</p>
				<p class="value">{$state.mecanumsteers[id].forwardSpeed}</p>
				<input
					class="slider"
					type="range"
					min={0}
					max={1}
					step={0.01}
					bind:value={$state.mecanumsteers[id].forwardSpeed}
				/>
			</li>

			<li class="row">
				<p class="label">Strafe Speed</p>
				<p class="value">{$state.mecanumsteers[id].strafeSpeed}</p>
				<input
					class="slider"
					type="range"
					min={0}
					max={1}
					step={0.01}
					bind:value={$state.mecanumsteers[id].strafeSpeed}
				/>
			</li>

			<li class="row">
				<p class="label">Rotation Speed</p>
				<p class="value">{$state.mecanumsteers[id].rotationSpeed}</p>
				<input
					class="slider"
					type="range"
					min={0}
					max={1}
					step={0.01}
					bind:value={$state.mecanumsteers[id].rotationSpeed}
				/>
			</li>
		</ul>

		<ul>
			<li class="row">
				<p class="label">Forward Axis:</p>
				<select bind:value={$state.mecanumsteers[id].forwardAxis}>
					<option value={-1}>-</option>
					{#each Array($axes.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
				<p class="label">Reversed:</p>
				<input
					class="checkbox"
					type="checkbox"
					bind:checked={$state.mecanumsteers[id].forwardAxisReversed}
				/>
			</li>

			<li class="row">
				<p class="label">Strafe Axis:</p>
				<select bind:value={$state.mecanumsteers[id].strafeAxis}>
					<option value={-1}>-</option>
					{#each Array($axes.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
				<p class="label">Reversed:</p>
				<input
					class="checkbox"
					type="checkbox"
					bind:checked={$state.mecanumsteers[id].strafeAxisReversed}
				/>
			</li>

			<li class="row">
				<p class="label">Rotation Axis:</p>
				<select bind:value={$state.mecanumsteers[id].rotationAxis}>
					<option value={-1}>-</option>
					{#each Array($axes.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
				<p class="label">Reversed:</p>
				<input
					class="checkbox"
					type="checkbox"
					bind:checked={$state.mecanumsteers[id].rotationAxisReversed}
				/>
			</li>
		</ul>
	{/if}
</div>

<style>
	.servocontents {
		display: flex;
		flex-direction: row;
		width: 100%;
	}

	.servocontents ul {
		padding: 0 0 0 0.5em;
	}

	.row {
		display: flex;
		justify-content: end;
		height: 2em;
	}

	.row p {
		margin: auto 0 auto 0;
		text-align: left;
	}

	.row .value {
		text-align: right;
		width: 3em;
	}

	.checkbox {
		min-width: 2.8em;
		margin: 0.5em;
	}
</style>
