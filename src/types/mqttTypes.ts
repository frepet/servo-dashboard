export interface IMqttSettings {
	url: string;
	port: number;
	username: string;
	password: string;
}

export interface IMqttConnection {
	isConnected: boolean;
	client: any;
}
