#include <WiFi.h>
#include <ESP32MQTTClient.h>
#include <Servo.h> // From https://github.com/alunit3/ServoESP32/ (Called ServoESP32Fix in Library Manager)

// Wi-Fi Settings.
const String WIFI_SSID = "Fi-Fi name";
const String WIFI_PASSWORD = "password";

// MQTT Broker Settings
const char *BROKER_URL = "mqtt://localhost";
const char *BROKER_USERNAME = "";
const char *BROKER_PASSWORD = "";
const uint8_t KEEP_ALIVE_SECONDS = 5;

// Robot Settings
static const String TOPIC_PREFIX = "robotdags";
const int MAX_SERVOS = 1;
const int MAX_MOTORS = 6;

// Derrived Constants
static const String SERVO_PREFIX = TOPIC_PREFIX + "/servos/";
static const String STATUS_TOPIC = TOPIC_PREFIX + "/statuses/receiver";

// Global Variables
ESP32MQTTClient mqttClient;
Servo servos[MAX_SERVOS];

/*
  Returns -1 if no '/' found, indicating an error.
*/
int extractNumberFromTopic(const String& topic) {
    int lastSlashIndex = topic.lastIndexOf('/');
    if (lastSlashIndex == -1) return -1;
    return topic.substring(lastSlashIndex + 1).toInt();
}

// Assuming topic format is "SERVO_PREFIX/x" where x is an integer.
void updateServos(const String &topic, const String &payload) {
  int position = payload.toInt(); // Convert payload to an integer
  
  if (topic.startsWith(SERVO_PREFIX)) { 
    uint8_t servoNumber = extractNumberFromTopic(topic);
    if (servoNumber >= 0 && servoNumber < MAX_SERVOS) {
      servos[servoNumber].write(map(position, -100, 100, 0, 180));
    } else {
      // Handle error or invalid servo number
      Serial.println("Error: Servo number out of range");
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
 *
 * This function gets called every time an MQTT server/broker is connected to.
 */
void onConnectionEstablishedCallback(esp_mqtt_client_handle_t client) {
  Serial.println("MQTT connection established.");

  mqttClient.subscribe(SERVO_PREFIX + "/#", updateServos
);
}

/* NOTE: This function cannot be renamed. The MQTT library relies on a function
 * with this name existing.
 *
 * I haven't looked into what this does, but it was present in the example from
 * the library so I keep it here as well.
 */
esp_err_t handleMQTT(esp_mqtt_event_handle_t event) {
    mqttClient.onEventCallback(event);
    return ESP_OK;
}

void setup() {
  // Setup Wi-Fi event listeners.
  WiFi.onEvent(onWifiConnected, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_CONNECTED);
  WiFi.onEvent(onWifiIPAssigned, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_GOT_IP);
  WiFi.onEvent(onWifiDisconnect, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);

  // Prevent sleep for lower latency at the cost of higher power consumption.
  WiFi.setSleep(false);

  // Apply MQTT settings.
  mqttClient.setURI(BROKER_URL, BROKER_USERNAME, BROKER_PASSWORD);
  mqttClient.setKeepAlive(KEEP_ALIVE_SECONDS);

  mqttClient.enableLastWillMessage(STATUS_TOPIC.c_str(), "OFFLINE", true);
  
  // Try and connect to the specified Wi-Fi network.
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  // Start the MQTT client.
  mqttClient.loopStart();
}

void loop(){
  delay(1000);
}
