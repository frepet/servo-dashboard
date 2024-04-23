#ifndef Failsafe_h
#define Failsafe_h

#include <Arduino.h>

class Failsafe {
private:
    unsigned long lastResetTimeMillis;
    const unsigned long intervalMillis;
    void (*failsafeCallback)();

public:
    Failsafe(unsigned long milliseconds, void (*callback)()) :
            intervalMillis(milliseconds),
            failsafeCallback(callback),
            lastResetTimeMillis(0) {}

    // Reset the failsafe timer
    void reset() {
        lastResetTimeMillis = millis();
    }

    // Check if the failsafe condition is met and call the external failsafe function
    void check() {
        if (millis() - lastResetTimeMillis >= intervalMillis) {
            failsafeCallback();
            reset();
        }
    }
};

#endif
