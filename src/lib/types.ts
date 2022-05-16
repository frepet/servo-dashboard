export type Servo = {
	name: string;
	id: number;
	axis: number;
	min: number;
	max: number;
	startValue: number;
	speed: number;
	buttonPlus: number;
	buttonMinus: number;
	buttonSpeed: number;
	centering: boolean;
	centerTrim: number;
};

export type SkidSteer = {
	id: number;
	forwardAxis: number;
	reverseAxis: number;
	turnAxis: number;
	speed: number;
	turnSpeed: number;
	reversed: boolean;
};

export type State = {
	version: number;
	name: string;
	deadzones: number[];
	pwms: number[];
	servos: Servo[];
	skidsteers: SkidSteer[];
	swapButton: number;
};
