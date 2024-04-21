import asyncio
import sys
from time import time
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
		if rc == 0:
			print("Connected to MQTT Broker!")
		else:
			print("Failed to connect, return code %d\n", rc)

	def on_disconnect(client, userdata, rc):
		if rc != 0:
			print("Connection lost, sending Last Will")
		for i in range(SERVOS):
			client.publish(f"{mqtt_topic_root}/servos/{i}", payload="1", qos=2, retain=True)
		for i in range(MOTORS):
			client.publish(f"{mqtt_topic_root}/motors/{i}", payload=[0, false], qos=2, retain=True)

	client = mqtt_client.Client(client_id=client_id, callback_api_version=mqtt_client.CallbackAPIVersion.VERSION2)
	client.username_pw_set(mqtt_username, mqtt_password)
	client.on_connect = on_connect
	client.on_disconnect = on_disconnect
	for i in range(SERVOS):
		client.will_set(f"{mqtt_topic_root}/servos/{i}", payload="2", qos=2, retain=True)
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


async def main():
	client = connect_mqtt()
	client.loop_start()

	async def socket_handler(websocket):
		last_update = time()
		last_msg = ""
		async for message in websocket:
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
				mqtt_write(client, f"{mqtt_topic_root}/motors/{i}", f"{motor[0],motor[1]}")

	async with websockets.serve(socket_handler, "0.0.0.0", socket_port):
		await asyncio.Future()

	client.loop_stop()

try:
	asyncio.run(main())
except KeyboardInterrupt:
	exit(0)
