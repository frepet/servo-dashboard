import threading
import asyncio
import sys
from time import time, sleep
import random
from paho.mqtt import client as mqtt_client
from paho.mqtt.client import Client
from dotenv import load_dotenv
from os import getenv
import websockets
import json

load_dotenv()

mqtt_broker = getenv("MQTT_BROKER")
mqtt_port = int(getenv("MQTT_PORT"))
mqtt_username = getenv("MQTT_USERNAME")
mqtt_password = getenv("MQTT_PASSWORD")
mqtt_topic_root = getenv("MQTT_TOPIC_ROOT")

socket_port = None
SERVOS = 4
MOTORS = 4

# Generate a random Client ID.
client_id = f'robot-{random.randint(0, 1000)}'
qos = 0

def connect_mqtt():
	"""This function creates a new MQTT client and connects it to the broker.
	"""

	def on_connect(client, userdata, flags, rc, properties):
		"""This function is called when the client connects to the broker."""
		print("on_connect")
		if rc == 0:
			print("Connected to MQTT Broker!")
			client.publish(f"{mqtt_topic_root}/status", payload="connected", qos=2, retain=True)
		else:
			print("Failed to connect, return code %d\n", rc)

	def on_disconnect(client, userdata, disconnect_flags, reason_code, properties):
		print("on_disconnect")

	client = mqtt_client.Client(client_id=client_id, callback_api_version=mqtt_client.CallbackAPIVersion.VERSION2)
	client.username_pw_set(mqtt_username, mqtt_password)
	client.on_connect = on_connect
	client.on_disconnect = on_disconnect
	client.will_set(f"{mqtt_topic_root}/status", payload="disconnected", qos=2, retain=True)
	client.connect(mqtt_broker, mqtt_port)
	return client

try:
	socket_port = sys.argv[1]
except IndexError as ex:
	print(f"USAGE: {sys.argv[0]} SOCKET_PORT", file=sys.stderr)
	exit(1)

def mqtt_write(client, topic, msg):
	result = client.publish(topic, msg, qos, retain=True)
	if result.rc != 0:
		print(f"Failed to send message to topic {topic}")


async def main(client, failsafe_timer):
	async def socket_handler(websocket):
		last_update = time()
		last_msg = ""
		async for message in websocket:
			failsafe_timer.reset()
			if message != last_msg:
				last_msg = message
				print(message)

			if time() < last_update + 0.02:
				continue
			last_update = time()

			message = json.loads(message)
			
			for i, servo in enumerate(message["servos"]):
				mqtt_write(client, f"{mqtt_topic_root}/servos/{i}", servo)

			for i, motor in enumerate(message["motors"]):
				mqtt_write(client, f"{mqtt_topic_root}/motors/{i}", motor)

			client.publish(f"{mqtt_topic_root}/status", payload="alive", qos=2, retain=True)
	try:
		print("Before websocket")
		async with websockets.serve(socket_handler, "0.0.0.0", socket_port):
			await asyncio.Future()
		print("After websocket")
	except KeyboardInterrupt as e:
		print("KeyboardInterrupt in main")
		print(e)


def set_shutdown_state(client):
	client.publish(f"{mqtt_topic_root}/status", payload="shutdown", qos=2, retain=True)
	for i in range(SERVOS):
		client.publish(f"{mqtt_topic_root}/servos/{i}", payload="1", qos=2, retain=True)
	for i in range(MOTORS):
		client.publish(f"{mqtt_topic_root}/motors/{i}", payload="0", qos=2, retain=True)


class ResettableTimer:
    def __init__(self, timeout, callback, *args, **kwargs):
        self.timeout = timeout
        self.callback = callback
        self.args = args
        self.kwargs = kwargs
        self.timer = None
        self.create_timer()

    def create_timer(self):
        """Create a new timer instance that resets itself after executing the callback."""
        self.timer = threading.Timer(self.timeout, self.handle_callback)

    def handle_callback(self):
        """Handle the timer callback and reset the timer."""
        self.callback(*self.args, **self.kwargs)
        self.reset()

    def start(self):
        if not self.timer.is_alive():
            self.timer.start()

    def reset(self):
        """Reset the timer to the initial timeout."""
        if self.timer is not None:
            self.timer.cancel()
        self.create_timer()
        self.timer.start()

    def stop(self):
        """Stop the timer, preventing any further action."""
        if self.timer is not None:
            self.timer.cancel()


def set_failsafe_state(client):
	print("FAILSAFE!")
	client.publish(f"{mqtt_topic_root}/status", payload="failsafe", qos=2, retain=True)
	for i in range(SERVOS):
		client.publish(f"{mqtt_topic_root}/servos/{i}", payload="1", qos=2, retain=True)
	for i in range(MOTORS):
		client.publish(f"{mqtt_topic_root}/motors/{i}", payload="0", qos=2, retain=True)


client = connect_mqtt()
client.loop_start()
failsafe_timer = ResettableTimer(1, set_failsafe_state, client)
failsafe_timer.start()

try:
	asyncio.run(main(client, failsafe_timer))
except KeyboardInterrupt:
	print("KeyboardInterrupt outside main")
	set_shutdown_state(client)
	failsafe_timer.stop()

sleep(2)
client.loop_stop()
