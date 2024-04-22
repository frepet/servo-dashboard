export interface IMqttSettings {
	url: string;
	port: number;
	username: string;
	password: string;
}

export interface IMqttConnection {
	url: string;
	port: number;
	username: string;
	password: string;
	isConnected: boolean;
	client: any; // We can be more specific depending on the MQTT library's type definitions
}
