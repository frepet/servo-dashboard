#ifndef Failsafe_h
#define Failsafe_h

#include <Arduino.h>

class Failsafe {
private:
  unsigned long lastResetTimeMillis;
  const unsigned long intervalMillis;
  void (*failsafeCallback)();
  bool activated;

public:
  Failsafe(unsigned long milliseconds, void (*callback)())
      : intervalMillis(milliseconds), failsafeCallback(callback),
        lastResetTimeMillis(0), activated(false) {}

  void reset() { 
    lastResetTimeMillis = millis();
    activated = false;
  }

  bool inFailsafe() {
    return activated;
  }

  void check() {
    if (millis() - lastResetTimeMillis >= intervalMillis) {
      activated = true;
      failsafeCallback();
      lastResetTimeMillis = millis();
    }
  }
};

#endif
