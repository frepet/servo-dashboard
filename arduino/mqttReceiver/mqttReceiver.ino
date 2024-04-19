#include <WiFi.h>
#include <ESP32MQTTClient.h>
#include <Servo.h> // From https://github.com/alunit3/ServoESP32/ (Called ServoESP32Fix in Library Manager)

static const char servos_topic[] = "robotdags/servos/#";

ESP32MQTTClient mqttClient;

const int MAX_SERVOS = 4; // Define the maximum number of servos
Servo servos[MAX_SERVOS]; // Array to hold servo objects

void update_servos(const String &topic, const String &payload) {
  int position = payload.toInt(); // Convert payload to an integer
  
  if (topic.startsWith("robotdats/servos/")) { // Assuming topic format is "robotdats/servos/X"
    String servoId = topic.substring(17); // Extract the servo number from the topic
    int servoNumber = servoId.toInt(); // Convert to integer

    if (servoNumber >= 0 && servoNumber < MAX_SERVOS) {
      // Map the position from 0-255 (input range) to 0-180 (servo range)
      servos[servoNumber].write(map(position, 0, 255, 0, 180));
    } else {
      // Handle error or invalid servo number
      Serial.println("Error: Servo number out of range");
    }
  }
}


/* This function gets called every time a wi-fi connection is established.
 *
 * I don't think this function is very useful compared to the next function
 * where an IP address has also been established.
 */
void wifi_connected(const WiFiEvent_t event, const WiFiEventInfo_t info) {
  Serial.println("Connected to Wi-Fi!");
}

/* This function gets called every time a IP address is assigned.
 *
 * Here you can put code that need to run with an established internet
 * connection.
 */
void wifi_got_ip(const WiFiEvent_t event, const WiFiEventInfo_t info) {
  Serial.print("Wi-Fi connected at IP address: ");
  Serial.println(WiFi.localIP());
}

/* This function gets called every time Wi-Fi is lost.
 *
 * The most important role of this function is to try and reconnect to Wi-Fi.
 */
void wifi_disconnected(const WiFiEvent_t event, const WiFiEventInfo_t info) {
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

  // Subscribe to a topic and specify which function should be called when a
  // message is received from that topic.
  // Note: The signature of the specified function must be one of the following:
  // * void function_name(const String &message)
  // * void function_name(const String &topic, const String &message)
  mqttClient.subscribe("servos_topic", update_servos);
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

void setup(){
  // Servo setup
  const int servo_frequency = 200;
  servos[0].attach(13, Servo::CHANNEL_NOT_ATTACHED, servo_frequency); // IO3
  servos[1].attach(31, Servo::CHANNEL_NOT_ATTACHED, servo_frequency); // IO38
  servos[2].attach(33, Servo::CHANNEL_NOT_ATTACHED, servo_frequency); // IO40
  servos[3].attach(34, Servo::CHANNEL_NOT_ATTACHED, servo_frequency); // IO41

  // Wi-Fi settings.
  const char ssid[] = "Fi-Fi name";
  const char wifi_password[] = "password";

  // MQTT broker settings.
  const int keep_alive_time = 5; // seconds.
  // https://www.hivemq.com/blog/mqtt-essentials-part-9-last-will-and-testament/
  const bool should_retain_lwt = true;

  // TFE Broker settings.
  const char broker_uri[] = "mqtt://tfe.iotwan.se";
  const char mqtt_username[] = "intro23";
  const char mqtt_password[] = "outro";

  // Setup Wi-Fi event listeners.
  WiFi.onEvent(wifi_connected, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_CONNECTED);
  WiFi.onEvent(wifi_got_ip, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_GOT_IP);
  WiFi.onEvent(wifi_disconnected, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);

  // Prevent sleep for lower latency at the cost of higher power consumption.
  WiFi.setSleep(false);

  // Apply MQTT settings.
  mqttClient.setURI(broker_uri, mqtt_username, mqtt_password);
  mqttClient.setKeepAlive(keep_alive_time);

  // NOTE: This function has to be called or else the Romeo will crash due to a
  // quirk with the MQTT library.
  // Enable signaling that the Romeo has disconnected from MQTT. If you don't
  // want to set a LWT message, just pass in the parameters ("", "", false).
  mqttClient.enableLastWillMessage("", "", false);
  
  // Try and connect to the specified Wi-Fi network.
  WiFi.begin(ssid, wifi_password);

  // Start the MQTT client.
  mqttClient.loopStart();
}

void loop(){
  delay(1000);
}
