<script lang="ts">
	import { axes } from '$lib/stores/AxesStore';
	import { state } from '$lib/stores/StateStore';
	import { onDestroy } from 'svelte';

	export let id = 0;
	const mecanumsteer = $state.mecanumsteers[id];

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
			let forward = 0;
			if ($axes[mecanumsteer.forwardAxis] != undefined) {
				forward =
					mecanumsteer.forwardSpeed *
					$axes[mecanumsteer.forwardAxis] *
					(mecanumsteer.forwardAxisReversed ? -1 : 1);
			}

			let strafe = 0;
			if ($axes[mecanumsteer.strafeAxis] != undefined) {
				strafe =
					mecanumsteer.strafeSpeed *
					$axes[mecanumsteer.strafeAxis] *
					(mecanumsteer.strafeAxisReversed ? -1 : 1);
			}

			let rotation = 0;
			if ($axes[mecanumsteer.rotationAxis] != undefined) {
				rotation =
					mecanumsteer.rotationSpeed *
					$axes[mecanumsteer.rotationAxis] *
					(mecanumsteer.rotationAxisReversed ? -1 : 1);
			}

			let result = mecanumSteer(forward, strafe, rotation);

			if (mecanumsteer.frontLeftMotorId >= 0) {
				$state.motors[mecanumsteer.frontLeftMotorId].value = result[0] * 100;
			}
			if (mecanumsteer.frontRightMotorId >= 0) {
				$state.motors[mecanumsteer.frontRightMotorId].value = result[1] * 100;
			}
			if (mecanumsteer.backLeftMotorId >= 0) {
				$state.motors[mecanumsteer.backLeftMotorId].value = result[2] * 100;
			}
			if (mecanumsteer.backRightMotorId >= 0) {
				$state.motors[mecanumsteer.backRightMotorId].value = result[3] * 100;
			}
		}
		poll = requestAnimationFrame(loop);
	};
	loop();

	onDestroy(() => cancelAnimationFrame(poll));
</script>

<div class="servocontents">
	{#if mecanumsteer}
		<ul>
			<li class="row">
				<p class="label">Front Left Motor:</p>
				<select bind:value={mecanumsteer.frontLeftMotorId}>
					<option value={-1}>-</option>
					{#each Array($state.motors.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
				{#if mecanumsteer.frontLeftMotorId >= 0}
					<p class="value">{Math.round($state.motors[mecanumsteer.frontLeftMotorId].value)}</p>
					<input
						class="slider"
						type="range"
						min={-100}
						max={100}
						step={1}
						bind:value={$state.motors[mecanumsteer.frontLeftMotorId].value}
					/>
				{/if}
			</li>

			<li class="row">
				<p class="label">Front Right Motor:</p>
				<select bind:value={mecanumsteer.frontRightMotorId}>
					<option value={-1}>-</option>
					{#each Array($state.motors.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
				{#if mecanumsteer.frontRightMotorId >= 0}
					<p class="value">{Math.round($state.motors[mecanumsteer.frontRightMotorId].value)}</p>
					<input
						class="slider"
						type="range"
						min={-100}
						max={100}
						step={1}
						bind:value={$state.motors[mecanumsteer.frontRightMotorId].value}
					/>
				{/if}
			</li>

			<li class="row">
				<p class="label">Back Left Motor:</p>
				<select bind:value={mecanumsteer.backLeftMotorId}>
					<option value={-1}>-</option>
					{#each Array($state.motors.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
				{#if mecanumsteer.backLeftMotorId >= 0}
					<p class="value">{Math.round($state.motors[mecanumsteer.backLeftMotorId].value)}</p>
					<input
						class="slider"
						type="range"
						min={-100}
						max={100}
						step={1}
						bind:value={$state.motors[mecanumsteer.backLeftMotorId].value}
					/>
				{/if}
			</li>

			<li class="row">
				<p class="label">Back Right Motor:</p>
				<select bind:value={mecanumsteer.backRightMotorId}>
					<option value={-1}>-</option>
					{#each Array($state.motors.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
				{#if mecanumsteer.backRightMotorId >= 0}
					<p class="value">{Math.round($state.motors[mecanumsteer.backRightMotorId].value)}</p>
					<input
						class="slider"
						type="range"
						min={-100}
						max={100}
						step={1}
						bind:value={$state.motors[mecanumsteer.backRightMotorId].value}
					/>
				{/if}
			</li>

			<li class="row">
				<p class="label">Forward Speed</p>
				<p class="value">{mecanumsteer.forwardSpeed}</p>
				<input
					class="slider"
					type="range"
					min={0}
					max={1}
					step={0.01}
					bind:value={mecanumsteer.forwardSpeed}
				/>
			</li>

			<li class="row">
				<p class="label">Strafe Speed</p>
				<p class="value">{mecanumsteer.strafeSpeed}</p>
				<input
					class="slider"
					type="range"
					min={0}
					max={1}
					step={0.01}
					bind:value={mecanumsteer.strafeSpeed}
				/>
			</li>

			<li class="row">
				<p class="label">Rotation Speed</p>
				<p class="value">{mecanumsteer.rotationSpeed}</p>
				<input
					class="slider"
					type="range"
					min={0}
					max={1}
					step={0.01}
					bind:value={mecanumsteer.rotationSpeed}
				/>
			</li>
		</ul>

		<ul>
			<li class="row">
				<p class="label">Forward Axis:</p>
				<select bind:value={mecanumsteer.forwardAxis}>
					<option value={-1}>-</option>
					{#each Array($axes.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
				<p class="label">Reversed:</p>
				<input class="checkbox" type="checkbox" bind:checked={mecanumsteer.forwardAxisReversed} />
			</li>

			<li class="row">
				<p class="label">Strafe Axis:</p>
				<select bind:value={mecanumsteer.strafeAxis}>
					<option value={-1}>-</option>
					{#each Array($axes.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
				<p class="label">Reversed:</p>
				<input class="checkbox" type="checkbox" bind:checked={mecanumsteer.strafeAxisReversed} />
			</li>

			<li class="row">
				<p class="label">Rotation Axis:</p>
				<select bind:value={mecanumsteer.rotationAxis}>
					<option value={-1}>-</option>
					{#each Array($axes.length) as _, i}
						<option>{i}</option>
					{/each}
				</select>
				<p class="label">Reversed:</p>
				<input class="checkbox" type="checkbox" bind:checked={mecanumsteer.rotationAxisReversed} />
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
