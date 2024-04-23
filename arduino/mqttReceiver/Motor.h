#ifndef Motor_h
#define Motor_h

class Motor {
private:
  int pwmPin;
  int dirPin;

public:
    Motor(int dirPin, int pwmPin) {
        this->pwmPin = pwmPin;
        this->dirPin = dirPin;
        pinMode(pwmPin, OUTPUT);
        pinMode(dirPin, OUTPUT);
    }

    void update(int speed) {
        if (speed >= 0) {
            digitalWrite(dirPin, HIGH);
            analogWrite(pwmPin, map(speed, 0, 100, 0, 255));
        } else {
            digitalWrite(dirPin, LOW);
            analogWrite(pwmPin, map(-speed, 0, 100, 0, 255));
        }
    }
};

#endif