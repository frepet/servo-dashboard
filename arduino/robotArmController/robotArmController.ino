/*
 * Robot Arm Controller for Arduino
 */

#include <Servo.h>

typedef struct {
	byte pwm;
	byte dir;
} Motor;

const int SERVO_PINS[9] = {8, 9, 10, 11, 12, 13, A0, A1, A2};
const int SERVOS = 9;
const int BAUD_RATE = 19200;
const byte STX = 2;
const int BAD_CHECKSUM_LED_PIN = 2;
const int CUSTOM_PIN = 3;

const byte MOTOR_1_DIR = 4;
const byte MOTOR_2_DIR = 7;
const byte MOTOR_1_PWM = 5;
const byte MOTOR_2_PWM = 6;

long last_bad_checksum = millis();
byte motors[4] = {0};
byte pwms[SERVOS] = {127};
Servo servo[SERVOS];
byte custom = 0;

void setup() {
	pinMode(BAD_CHECKSUM_LED_PIN, OUTPUT);
	pinMode(CUSTOM_PIN, OUTPUT);
	for (int i = 0; i < SERVOS; i++) {
		servo[i].attach(SERVO_PINS[i]);
	}
	pinMode(MOTOR_2_DIR, OUTPUT);
	pinMode(MOTOR_2_DIR, OUTPUT);
	pinMode(MOTOR_1_PWM, OUTPUT);
	pinMode(MOTOR_2_PWM, OUTPUT);
	Serial.begin(BAUD_RATE);
}

byte nextByte() {
	byte b = Serial.read();
	while (b == -1) {
		b = Serial.read();
		delay(10);
	}
	return b;
}

void clearMessage() {
	memset(pwms, 0, SERVOS);
}

void waitForSTX() {
	byte temp = nextByte();
	while (temp != STX) {
		temp = nextByte();
		delay(10);
	}
}

bool readSerial() {
	byte n = nextByte();

	byte temp[n] = {0};
	byte checksum = 0;
	for (int i = 0; i < n; i++) {
		temp[i] = nextByte();
		checksum += temp[i];
	}

	byte received_checksum = nextByte();
	if (received_checksum != checksum) {
		Serial.print("Bad checksum, received: ");
		Serial.print(received_checksum);
		Serial.print(", calculated: ");
		Serial.println(checksum);
		last_bad_checksum = millis();
		return false;
	}

	memcpy(pwms, temp, SERVOS);
	memcpy(motors, &temp[SERVOS], 4);
	custom = temp[SERVOS + 4];
	return true;
}

void updateServos(byte *pwms) {
	for (int i = 0; i < SERVOS; i++) {
		servo[i].writeMicroseconds(map(pwms[i], 0, 255, 500, 2500));
	}
}

void updateMotors(byte *motors) {
	analogWrite(MOTOR_1_PWM, motors[0]);
	digitalWrite(MOTOR_1_DIR, motors[1]);
	analogWrite(MOTOR_2_PWM, motors[2]);
	digitalWrite(MOTOR_2_DIR, motors[3]);
}

void updateCustom(byte custom) {
	digitalWrite(CUSTOM_PIN, custom > 0);
}

void loop() {
	clearMessage();
	waitForSTX();
	if (readSerial()) {
		updateServos(pwms);
		updateMotors(motors);
		updateCustom(custom);
	}

	digitalWrite(BAD_CHECKSUM_LED_PIN, last_bad_checksum + 100 <= millis() ? LOW : HIGH);
}
