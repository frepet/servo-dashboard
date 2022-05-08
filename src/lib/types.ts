export type Servo = {
	id: number;
	axis: number;
	min: number;
	max: number;
	startValue: number;
	speed: number;
};

export type State = {
	name: string;
	pwms: Array<number>;
	servos: Array<Servo>;
};
