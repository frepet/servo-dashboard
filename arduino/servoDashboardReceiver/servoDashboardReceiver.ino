/*
 * Servo Dashboard Receiver for Arduino UNO
 */

typedef enum State {
	BOOT = 'B',
	START = 'S',
	READ_COMMAND = 'R',
	READ_PARAMETER = 'P',
	EXECUTE_COMMAND = 'E'
} State;

enum Commands {
	C_ECHO = 'E'
};

const int BAUD_RATE = 19200;
const int DEBUG_PIN = 13;

uint8_t state = BOOT;
uint8_t command = NULL;
uint16_t parameter = 0;
uint8_t parameter_i = 0;

void setup() {
	pinMode(DEBUG_PIN, OUTPUT);
	digitalWrite(DEBUG_PIN, LOW);

	Serial.begin(BAUD_RATE);
}

State state_boot(void) {
	// Serial.println("STATE: BOOT");
	static bool blink;
	blink = !blink;
	digitalWrite(DEBUG_PIN, blink);

	if (Serial.available()) {
		uint8_t data = Serial.read();
		if (data == START) {
			return START;
		}
	}

	return BOOT;
}

State state_start(void) {
	// Serial.println("STATE: START");
	digitalWrite(DEBUG_PIN, LOW);
	return READ_COMMAND;
}

State state_read_command(void) {
	// Serial.println("STATE: READ COMMAND");
	if (Serial.available()) {
		command = Serial.read();
		switch (command) {
			case C_ECHO:
				Serial.print(char(C_ECHO));
				return READ_PARAMETER;
			default: 
				return READ_COMMAND;
		}
	}
	return READ_COMMAND;
}

State state_read_parameter(void) {
	// Serial.println("STATE: READ PARAMETER");
	digitalWrite(DEBUG_PIN, HIGH);
	if (parameter_i == 0) {
		parameter = 0;
	}

	if (Serial.available()) {
		uint8_t data = Serial.read();
		if (data < 48 || data > 57) {
			return READ_PARAMETER;
		}

		parameter += (data - 48) * ceil(pow(10.0, 2.0 - parameter_i));

		Serial.print(char(data));
		if (parameter_i >= 2) {
			parameter_i = 0;
			Serial.println("");
			return EXECUTE_COMMAND;
		}

		parameter_i++;
	}
	return READ_PARAMETER;
}

State state_execute_command(void) {
	// Serial.println("STATE: EXECUTE COMMAND");
	switch(command) {
		case C_ECHO:
			Serial.print("echo(");
			Serial.print(parameter);
			Serial.println(")");
			break;
	}

	return START;
}

void loop() {
	switch(state) {
		case BOOT:
			state = state_boot();
			delay(100);
			break;
		case START:
			state = state_start();
			break;
		case READ_COMMAND:
			state = state_read_command();
			break;
		case READ_PARAMETER:
			state = state_read_parameter();
			break;
		case EXECUTE_COMMAND:
			state = state_execute_command();
			break;
	}
}
