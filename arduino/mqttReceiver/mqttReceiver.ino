#include "Failsafe.h"
#include "Motor.h"
#include "ServoWrapper.h"
#include <ESP32MQTTClient.h>
#include <WiFi.h>

// Global Variables
ESP32MQTTClient mqttClient;

// Wi-Fi Settings.
const String WIFI_SSID = "Wi-Fi";
const String WIFI_PASSWORD = "password";

// MQTT Broker Settings
const char *BROKER_URL = "";
const char *BROKER_USERNAME = "";
const char *BROKER_PASSWORD = "";
const uint8_t KEEP_ALIVE_SECONDS = 5;

// START of Robot Settings
static const String TOPIC_PREFIX = "robot";
const int MAX_SERVOS = 1;
const int MAX_MOTORS = 4;
Motor motors[MAX_MOTORS] = {Motor(12, 13), Motor(14, 21), Motor(9, 10),
                            Motor(47, 11)};
ServoWrapper servos[MAX_SERVOS]{ServoWrapper(3)};
const unsigned long FAILSAFE_MILLIS = 1000;
// END of Robot Settings

// Derrived Constants
static const String STATUS_TOPIC = TOPIC_PREFIX + "/statuses/receiver";
static const String SERVOS_PREFIX = TOPIC_PREFIX + "/servos";
static const String MOTORS_PREFIX = TOPIC_PREFIX + "/motors";

// Failsafe Handler, update to your likings
void failsafeHandler() {
  for (uint8_t i = 0; i < MAX_SERVOS; ++i) {
    servos[i].detach();
  }
  for (uint8_t i = 0; i < MAX_MOTORS; ++i) {
    motors[i].update(0);
  }
  mqttClient.publish(STATUS_TOPIC, "FAILSAFE", 2, true);
}
//Failsafe failsafe = Failsafe(FAILSAFE_MILLIS, failsafeHandler);

/*
  Returns -1 if no '/' found, indicating an error.
*/
int extractNumberFromTopic(const String &topic) {
  int lastSlashIndex = topic.lastIndexOf('/');
  if (lastSlashIndex == -1)
    return -1;
  return topic.substring(lastSlashIndex + 1).toInt();
}

// Assuming topic format is "SERVOS_PREFIX/x" where x is an integer.
void updateServos(const String &topic, const String &payload) {
  if (topic.startsWith(SERVOS_PREFIX)) {
    uint8_t servoNumber = extractNumberFromTopic(topic);
    if (servoNumber >= 0 && servoNumber < MAX_SERVOS) {
      servos[servoNumber].update(map(payload.toInt(), -100, 100, 0, 180));
    } else {
      // Handle error or invalid servo number
      Serial.println("Error: Servo number out of range");
    }
  }
}

// Assuming topic format is "MOTORS_PREFIX/x" where x is an integer.
void updateMotors(const String &topic, const String &payload) {
  if (topic.startsWith(MOTORS_PREFIX)) {
    uint8_t motorNumber = extractNumberFromTopic(topic);
    if (motorNumber >= 0 && motorNumber < MAX_MOTORS) {
      motors[motorNumber].update(payload.toInt());
    } else {
      // Handle error or invalid motor number
      Serial.println("Error: Motor number out of range");
    }
  }
}

void onWifiConnected(const WiFiEvent_t event, const WiFiEventInfo_t info) {
  Serial.println("Connected to Wi-Fi!");
}

void onWifiIPAssigned(const WiFiEvent_t event, const WiFiEventInfo_t info) {
  Serial.print("Wi-Fi connected at IP address: ");
  Serial.println(WiFi.localIP());
}

void onWifiDisconnect(const WiFiEvent_t event, const WiFiEventInfo_t info) {
  Serial.print("Wi-Fi lost connection. Reason: ");
  Serial.println(info.wifi_sta_disconnected.reason);
  Serial.println("Trying to reconnect...");

  // It is vital to try and reconnect if Wi-Fi is lost.
  WiFi.reconnect();
}

/* NOTE: This function cannot be renamed. The MQTT library relies on a function
 * with this name existing.
 */
void onConnectionEstablishedCallback(esp_mqtt_client_handle_t client) {
  Serial.println("MQTT connection established.");
  mqttClient.subscribe(SERVOS_PREFIX + "/#", updateServos, 0);
  mqttClient.subscribe(MOTORS_PREFIX + "/#", updateMotors, 0);
//  failsafe.reset();
}

/* NOTE: This function cannot be renamed. The MQTT library relies on a function
 * with this name existing.
 */
esp_err_t handleMQTT(esp_mqtt_event_handle_t event) {
  if (event->event_id == MQTT_EVENT_DATA) {
    if (event->topic_len > TOPIC_PREFIX.length()) {
      if (strncmp(event->topic, TOPIC_PREFIX.c_str(), TOPIC_PREFIX.length())) {
//        failsafe.reset();
      }
    }
  }
  mqttClient.onEventCallback(event);
  return ESP_OK;
}

void setupWifi() {
  WiFi.onEvent(onWifiConnected, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_CONNECTED);
  WiFi.onEvent(onWifiIPAssigned, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_GOT_IP);
  WiFi.onEvent(onWifiDisconnect,
               WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
  WiFi.setSleep(false);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

String randomClientName() {
  randomSeed(analogRead(35));
  int randomSuffixNumber = random(1000, 10000);
  return TOPIC_PREFIX + "-receiver-" + String(randomSuffixNumber);
}

void setupMQTT(String clientName) {
  mqttClient.setURI(BROKER_URL, BROKER_USERNAME, BROKER_PASSWORD);
  mqttClient.setKeepAlive(KEEP_ALIVE_SECONDS);
  mqttClient.setMqttClientName(clientName.c_str());
  mqttClient.enableLastWillMessage(STATUS_TOPIC.c_str(), "OFFLINE", true);
  mqttClient.loopStart();
}

void setup() {
  Serial.begin(115200);
  setupWifi();
  setupMQTT(randomClientName());
}

void loop() {
  mqttClient.publish(STATUS_TOPIC, "OK", 0, true);
  delay(FAILSAFE_MILLIS - 10);
}
