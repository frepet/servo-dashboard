/*
 * Servo Dashboard Receiver for Arduino UNO
 */

#include <ESP32Servo.h>

#include "ESP32_NOW_Serial.h"
#include "MacAddress.h"
#include "WiFi.h"
#include "esp_wifi.h"

#define FAILSAFE_MS 50

const int SERVO_PINS[2] = {A0, A1};
const int SERVOS = 2;
const int BAUD_RATE = 19200;
const byte STX = 2;
const int BAD_CHECKSUM_LED_PIN = 2;
const int FAILSAFE_LED_PIN = 3;
const int CUSTOM_PIN = 4;

const byte MOTORS = 3;
const byte MOTOR_1_DIR = A2;
const byte MOTOR_1_PWM = A3;
const byte MOTOR_2_DIR = A4;
const byte MOTOR_2_PWM = A5;
const byte MOTOR_3_DIR = A6;
const byte MOTOR_3_PWM = A7;

const MacAddress peer_mac_address({0xDC, 0xDA, 0x0C, 0x20, 0xD7, 0x58});
const int wifi_channel = 1;
ESP_NOW_Serial_Class wireless(peer_mac_address, wifi_channel, WIFI_IF_STA);

long last_bad_checksum = millis();
long failsafe_timer = 0L;
byte motors[MOTORS*2] = {0};
byte pwms[SERVOS] = {127};
Servo servo[SERVOS];
byte custom = 0;

void setup() {
  delay(2000);
  Serial.begin(19200);
	pinMode(BAD_CHECKSUM_LED_PIN, OUTPUT);
	pinMode(CUSTOM_PIN, OUTPUT);
	pinMode(FAILSAFE_LED_PIN, OUTPUT);
	digitalWrite(FAILSAFE_LED_PIN, HIGH);

  pinMode(MOTOR_1_DIR, OUTPUT);
  pinMode(MOTOR_2_DIR, OUTPUT);
  pinMode(MOTOR_3_DIR, OUTPUT);

  const int FREQ = 5000, RES = 8;
  ledcAttach(MOTOR_1_PWM, FREQ, RES);
  ledcAttach(MOTOR_2_PWM, FREQ, RES);
  ledcAttach(MOTOR_3_PWM, FREQ, RES);

  // Initialize Wi-Fi.
  WiFi.mode(WIFI_STA);
  WiFi.setChannel(wifi_channel, WIFI_SECOND_CHAN_NONE);

  while (!WiFi.STA.started()) {
    // Blink fast while waiting on Wi-Fi.
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
    delay(100);
  }
  wireless.begin(BAUD_RATE);
}

byte nextByte() {
	byte b = wireless.read();
	while (b == -1) {
		failsafe();
		b = wireless.read();
		delay(10);
	}
	return b;
}

void failsafe() {
	if (failsafe_timer + FAILSAFE_MS < millis()) {
		digitalWrite(FAILSAFE_LED_PIN, HIGH);
    digitalWrite(MOTOR_1_DIR, LOW);
    digitalWrite(MOTOR_1_PWM, LOW);
    digitalWrite(MOTOR_2_DIR, LOW);
    digitalWrite(MOTOR_2_PWM, LOW);
    digitalWrite(MOTOR_3_DIR, LOW);
    digitalWrite(MOTOR_3_PWM, LOW);
	} else {
		digitalWrite(FAILSAFE_LED_PIN, LOW);
	}
}

void clearMessage() {
	memset(pwms, 0, SERVOS);
}

void waitForSTX() {
	byte temp = nextByte();
	while (temp != STX) {
		failsafe();
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
		wireless.print("Bad checksum, received: ");
		wireless.print(received_checksum);
		wireless.print(", calculated: ");
		wireless.println(checksum);
		last_bad_checksum = millis();
		return false;
	}

	failsafe_timer = millis();

	memcpy(pwms, temp, SERVOS);
	memcpy(motors, &temp[SERVOS], MOTORS * 2);
	custom = temp[SERVOS + 4];
	return true;
}

void updateServos(byte *pwms) {
	for (int i = 0; i < SERVOS; i++) {
		servo[i].writeMicroseconds(map(pwms[i], 0, 255, 500, 2500));
		if (!servo[i].attached()) {
			servo[i].attach(SERVO_PINS[i]);
		}
	}
}

void updateMotors(byte *motors) {
  ledcWrite(MOTOR_1_PWM, motors[0]);
  digitalWrite(MOTOR_1_DIR, motors[1]);
  ledcWrite(MOTOR_2_PWM, motors[2]);
  digitalWrite(MOTOR_2_DIR, motors[3]);
  ledcWrite(MOTOR_3_PWM, motors[4]);
  digitalWrite(MOTOR_3_DIR, motors[5]);
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
  delay(1);
}
