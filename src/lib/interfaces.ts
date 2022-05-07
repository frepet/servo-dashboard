export interface Servo {
	id: number;
	axis: number;
	min: number;
	max: number;
	startValue: number;
	speed: number;
}

export interface State {
	name: string;
	pwms: Array<number>;
	servos: Array<Servo>;
}
