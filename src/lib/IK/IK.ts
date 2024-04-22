import { Vec2, vec2 } from './vec2';
import { clamp } from '../utils';
import type { Servo } from '$lib/types';
import { deg2rad } from './utils';

export class IK {
	target: Vec2 = vec2(100, 100);
	arm: Vec2[] = [];

	base: Vec2 = vec2(0, 74.5); // mm

	targetXAxis = 0;
	targetYAxis = 1;

	// TODO fix start value
	ikSpeedX = -4;
	ikSpeedY = -4;

	limbArm = 200; // mm
	servoRangeArm = 0;
	servoMidpointArm = 0;

	limbFore = 200; // mm
	servoRangeForeArm = 0;
	servoMidpointForeArm = 0;

	boundingBox = [vec2(0, 0), vec2(400, 350)];

	//Abstract away please
	servos: Servo[] = [];

	addIKServo(servo: Servo) {
		this.servos.push(servo);
		servo.value = 127;

		if (this.servos.length == 2) {
			// When both IK servos are used, set target to PWM 127, 127 as start position.
			this.updateArm();
			this.target = this.arm[1];
		}
	}

	update() {
		this.constrainTarget();

		if (this.servos.length >= 2) {
			const residual = this.moveToTarget();
			if (residual > 0.1) {
				this.target = this.arm[1];
			}
		}
	}

	constrainTarget() {
		// Keep target within reach
		if (this.target.length() > this.limbArm + this.limbFore) {
			this.target = this.target.resize(this.limbArm + this.limbFore);
		}

		// Back limit
		if (this.target.x < this.boundingBox[0].x - this.base.x) {
			this.target.x = this.boundingBox[0].x - this.base.x;
		}

		// Low limit
		if (this.target.y < this.boundingBox[0].y - this.base.y) {
			this.target.y = this.boundingBox[0].y - this.base.y;
		}

		// Front limit
		if (this.target.x > this.boundingBox[1].x - this.base.x) {
			this.target.x = this.boundingBox[1].x - this.base.x;
		}

		// High limit
		if (this.target.y > this.boundingBox[1].y - this.base.y) {
			this.target.y = this.boundingBox[1].y - this.base.y;
		}
	}

	/**
	 * Move the hand as close as possible to the target using inverse kinematics.
	 * @returns {number} The residual distance from hand to target.
	 */
	moveToTarget() {
		const r = this.target.length();
		const l0 = this.limbArm;
		const l1 = this.limbFore;
		const beta = Math.acos(
			clamp((l0 * l0 + l1 * l1 - r * r) / (2 * l0 * l1), -0.999999999999, 0.99999999999)
		);
		const alfa0 = Math.atan2(this.target.y, this.target.x);
		const alfa1 = Math.asin((l1 * Math.sin(beta)) / r);
		this.servos[0].value = clamp(
			this.RadiansToPWM(alfa0 + alfa1, deg2rad(this.servoRangeArm), deg2rad(this.servoMidpointArm)),
			this.servos[0].min,
			this.servos[0].max
		);
		this.servos[1].value = clamp(
			this.RadiansToPWM(
				-Math.PI + beta,
				deg2rad(this.servoRangeForeArm),
				deg2rad(this.servoMidpointForeArm)
			),
			this.servos[1].min,
			this.servos[1].max
		);
		this.updateArm();
		return this.target.add(this.arm[1].invert()).length();
	}

	/**
	 * Claculate the elbow and hand position from the servo PWM values using forward kinematics.
	 * @returns List with elbow and hand positions as vec2 elements.
	 * @private
	 */
	updateArm() {
		if (this.servos.length < 2) {
			return;
		}

		const arm = [];
		const l0 = this.limbArm;
		const l1 = this.limbFore;
		const alfa = this.PWMToRadians(
			this.servos[0].value,
			deg2rad(this.servoRangeArm),
			deg2rad(this.servoMidpointArm)
		);
		const beta = this.PWMToRadians(
			this.servos[1].value,
			deg2rad(this.servoRangeForeArm),
			deg2rad(this.servoMidpointForeArm)
		);
		const elbow = vec2(l0 * Math.cos(alfa), l0 * Math.sin(alfa));
		const hand = elbow.add(vec2(l1 * Math.cos(alfa + beta), l1 * Math.sin(alfa + beta)));
		arm.push(elbow);
		arm.push(hand);

		this.arm = arm;
	}

	PWMToRadians(pwm: number, range: number, midpoint: number) {
		return (pwm / 255.0) * range - range / 2 + midpoint;
	}

	RadiansToPWM(radians: number, range: number, midpoint: number) {
		return (255.0 / range) * (range / 2 - midpoint + radians);
	}

	radiansOfRotation(): number {
		return this.PWMToRadians(this.servos[2].value, deg2rad(180), deg2rad(0));
	}
}
