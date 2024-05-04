#include <Zumo32U4.h>
#include <Wire.h>

Zumo32U4Motors motors;
Zumo32U4Encoders encoders;

int leftSpeed = 0;
int rightSpeed = 0;

void setup() {
  Serial.begin(9600);
  Serial1.begin(115200);
}

void readSerialCommand() {
  if (Serial1.available() > 0) {
    if (Serial1.read() != '$') return;

    String command = Serial1.readStringUntil(';'); // Read until the ';' delimiter
    if (command.startsWith("M")) { // Check if the command starts with "M"
      int motorIdStart = command.indexOf('M') + 1; // Find the start index of the motor index
      int motorIdEnd = command.indexOf(':'); // Find the end index of the motor index
      int motorId = command.substring(motorIdStart, motorIdEnd).toInt(); // Extract and convert the motor index

      int valueStart = command.indexOf(':') + 1; // Find the start index of the value
      int valueEnd = command.indexOf(';'); // Find the end index of the value
      String valueString = command.substring(valueStart, valueEnd); // Extract the value string
      int value = valueString.toInt(); // Convert the value string to an integer

      if (motorId == 0) leftSpeed = map(value, -100, 100, -400, 400);
      if (motorId == 1) rightSpeed = map(value, -100, 100, -400, 400);

      Serial.print("Command Type: M, Motor Index: "); // Print the command type and motor index
      Serial.print(motorId);
      Serial.print(", Value: "); // Print the extracted value
      Serial.println(value);
    }
  }
}


void loop() {
  int16_t countsLeft = encoders.getCountsLeft();
  int16_t countsRight = encoders.getCountsRight();

  readSerialCommand();

  motors.setSpeeds(leftSpeed, rightSpeed);
  //Serial.print(countsLeft);
  //Serial.print("\t");
  //Serial.println(countsRight);
}
