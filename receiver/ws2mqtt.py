import asyncio
import sys
from time import time
import random
from paho.mqtt import client as mqtt_client
from paho.mqtt.client import Client
import websockets
import json

socket_port = None
SERVOS = 4

broker = ''
port = 1883
username = ''
password = ''
topic_prefix = ''

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
		for i in range(10):
			client.publish(f"{topic_prefix}/servos/{i}", payload="1", qos=2, retain=True)

	client = mqtt_client.Client(client_id=client_id, callback_api_version=mqtt_client.CallbackAPIVersion.VERSION2)
	client.username_pw_set(username, password)
	client.on_connect = on_connect
	client.on_disconnect = on_disconnect
	for i in range(10):
		client.will_set(f"{topic_prefix}/servos/{i}", payload="2", qos=2, retain=True)
	client.connect(broker, port)
	return client

try:
	socket_port = sys.argv[1]
except IndexError as ex:
	print(f"USAGE: {sys.argv[0]} SOCKET_PORT", file=sys.stderr)
	exit(1)

def mqtt_write(client, topic, msg):
	result = client.publish(topic, msg, qos)
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
				mqtt_write(client, f"{topic_prefix}/servos/{i}", servo)

			for i, motor in enumerate(message["motors"]):
				mqtt_write(client, f"{topic_prefix}/motors/{i}", f"{motor[0],motor[1]}")

	async with websockets.serve(socket_handler, "0.0.0.0", socket_port):
		await asyncio.Future()

	client.loop_stop()

try:
	asyncio.run(main())
except KeyboardInterrupt:
	exit(0)
