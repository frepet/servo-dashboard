export interface Servo {
	id: number;
	axis: number;
	min: number;
	max: number;
	startValue: number;
	speed: number;
}

export interface State {
	uuid: string;
	name: string;
	pwms: Array<number>;
	servos: Array<Servo>;
}
