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

export type Action = {
	servo: number;
	pwm: number;
}

export type Step = {
	actions: Action[];
};

export type Macro = {
	name: string;
	id: number;
	steps: Step[];
};

export type SkidSteer = {
	id: number;
	forwardAxis: number;
	reverseAxis: number;
	turnAxis: number;
	reversed: boolean;
	forwardAxis2: number;
	reverseAxis2: number;
	turnAxis2: number;
	reversed2: boolean;
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
	macros: Macro[];
	swapButton: number;
};
