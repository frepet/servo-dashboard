#ifndef Motor_h
#define Motor_h

class Motor {
private:
  uint8_t id;

public:
  Motor(uint8_t motorId) {
    id = motorId;
  }

  void update(int speed) {
    // Ensure motorValue is within the expected range.
    int constrainedSpeed = constrain(speed, -100, 100);

    // Format and send the command as a serial message.
    Serial.print("$");
    Serial.print("M");
    Serial.print(id);
    Serial.print(":");
    Serial.print(constrainedSpeed);
    Serial.println(";");
  }
};

#endif