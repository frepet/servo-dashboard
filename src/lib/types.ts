import type { IK } from './IK/IK';

export type Mixin = {
	servo: number;
	offset: number;
	multiplier: number;
};

export type Servo = {
	name: string;
	id: number;
	axis: number;
	min: number;
	max: number;
	value: number;
	speed: number;
	exp: number;
	buttonPlus: number;
	buttonMinus: number;
	buttonSpeed: number;
	centering: boolean;
	centerTrim: number;
	mixins: Mixin[];
};

export type Motor = {
	name: string;
	id: number;
	axis: number;
	reverseAxis: boolean;
	min: number;
	max: number;
	value: number;
	exp: number;
	buttonPlus: number;
	buttonMinus: number;
	mixins: Mixin[];
};

export type Action = {
	servo: number;
	pwm: number;
};

export type Step = {
	actions: Action[];
	delaySeconds: number;
};

export type Macro = {
	name: string;
	id: number;
	steps: Step[];
	button: number;
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

export type MecanumSteer = {
	id: number;
	frontLeftMotorId: number;
	frontRightMotorId: number;
	backLeftMotorId: number;
	backRightMotorId: number;
	forwardAxis: number;
	strafeAxis: number;
	rotationAxis: number;
	forwardAxisReversed: boolean;
	strafeAxisReversed: boolean;
	rotationAxisReversed: boolean;
	forwardSpeed: number;
	strafeSpeed: number;
	rotationSpeed: number;
};

export type Settings = {
	IKEnabled: boolean;
	IFrameEnabled: boolean;
};

export type IFrameSettings = {
	src: string;
	height: number;
};

export type MqttSettings = {
	topic_prefix: string;
	port: number;
};

export type State = {
	version: number;
	name: string;
	settings: Settings;
	deadzones: number[];
	servos: Servo[];
	motors: Motor[];
	skidsteers: SkidSteer[];
	mecanumsteers: MecanumSteer[];
	macros: Macro[];
	swapButton: number;
	ik: IK;
	iframeSettings: IFrameSettings;
	mqttSettings: MqttSettings;
};
