import { Vec2, vec2 } from "./vec2";
import { clamp } from "../utils";
import type { Servo } from "$lib/types";

export class IK {
    targetXAxis = 3;
    targetYAxis = 1;
    target: Vec2 = vec2(0, 0);
    ikSpeed = [-0.4, -0.4];
    base: Vec2 = vec2(0, 74.5); // mm
    limbs= [280, 185]; // mm
    arm: Vec2[] = [];

    //Abstract away please
    servoRanges : number[] = [];
    servoMidpoints : number[] = [];

    //Abstract away please
    servos : Servo[] = [];

    addIKServo(servo : any) {
        this.servos.push(servo);
        if (servo.address === 1) { // When both IK servos are used, set target to PWM 127, 127 as start position.
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
        if (this.target.length() > this.limbs[0] + this.limbs[1]) {
            this.target = this.target.resize(this.limbs[0] + this.limbs[1]);
        }
        // Back limit
        if (this.target.x < 100) {
            this.target.x = 100;
        }
        // Front limit
        if (this.target.x > 440) {
            this.target.x = 440;
        }
        // Low limit
        if (this.target.y < 100 - this.base.y) {
            this.target.y = 100 - this.base.y;
        }
        // High limit
        if (this.target.y > 350 - this.base.y) {
            this.target.y = 350 - this.base.y;
        }
    }

    /**
     * Move the hand as close as possible to the target using inverse kinematics.
     * @returns {number} The residual distance from hand to target.
     */
    moveToTarget() {
        const r = this.target.length();
        const l0 = this.limbs[0];
        const l1 = this.limbs[1];
        const beta = Math.acos(clamp((l0 * l0 + l1 * l1 - r * r) / (2 * l0 * l1), -0.999999999999, 0.99999999999));
        const alfa0 = Math.atan2(this.target.y, this.target.x);
        const alfa1 = Math.asin(l1 * Math.sin(beta) / r);
        this.servos[0].value = this.RadiansToPWM(alfa0 + alfa1,this.servoRanges[0],this.servoMidpoints[0]);
        this.servos[1].value = this.RadiansToPWM(-Math.PI + beta,this.servoRanges[1],this.servoMidpoints[1]);
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
        let arm = [];
        const l0 = this.limbs[0];
        const l1 = this.limbs[1];
        const alfa = this.PWMToRadians(this.servos[0].value,this.servoRanges[0],this.servoMidpoints[0]);
        const beta = this.PWMToRadians(this.servos[1].value,this.servoRanges[1],this.servoMidpoints[1]);
        const elbow = vec2(l0 * Math.cos(alfa), l0 * Math.sin(alfa));
        const hand = elbow.add(vec2(l1 * Math.cos(alfa + beta), l1 * Math.sin(alfa + beta)));
        arm.push(elbow);
        arm.push(hand);

        this.arm = arm;
    }
    PWMToRadians(pwm: number, range: number, midpoint: number) {
        return (pwm / 255.0 * range) - range / 2 + midpoint;
    }
    RadiansToPWM(radians: number, range: number, midpoint: number) {
        return (255.0 / range) * ((range / 2) - midpoint + radians);
    }
}