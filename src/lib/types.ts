export type Servo = {
	id: number;
	axis: number;
	min: number;
	max: number;
	startValue: number;
	speed: number;
};

export type SkidSteer = {
	id: number;
	forwardAxis: number;
	reverseAxis: number;
	turnAxis: number;
	speed: number;
	turnSpeed: number;
};

export type State = {
	version: number;
	name: string;
	deadzones: number[];
	pwms: number[];
	servos: Servo[];
	skidsteers: SkidSteer[];
};
