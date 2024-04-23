#ifndef ServoWrapper_h
#define ServoWrapper_h

#include <Arduino.h>
#include <Servo.h> // From https://github.com/alunit3/ServoESP32/ (Called ServoESP32Fix in Library Manager)

class ServoWrapper {
private:
    Servo servo;
    int servoPin;

public:
    // Constructor to initialize the servo pin
    ServoWrapper(int pin) {
        servoPin = pin;
    }

    // Detach the servo from its pin
    void detach() {
        servo.detach();
    }

    // Update the servo position from -100 to 100
    void update(int position) {
        if (!servo.attached()) servo.attach(servoPin);
        servo.write(map(position, -100, 100, 0, 180));
    }
};

#endif
