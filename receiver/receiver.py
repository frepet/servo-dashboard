import asyncio
import sys
from time import time

import serial
import websockets
import json

com_port = None
com_rate = 19200
socket_port = None
ser = None
SERVOS = 20 # 9


try:
	com_port = sys.argv[1]
	socket_port = sys.argv[2]
except IndexError as ex:
	print(f"USAGE: {sys.argv[0]} COM_PORT SOCKET_PORT", file=sys.stderr)
	exit(1)


async def main():
	with serial.Serial(com_port, com_rate, write_timeout=0, timeout=0) as ser:
		async def read_serial_to_socket(websocket):
			if ser.in_waiting > 0:
				msg = ""
				b = ser.read().decode("ascii")
				while b != "\n":
					msg += b
					b = ser.read().decode("ascii")
				await websocket.send(msg)

		async def socket_handler(websocket):
			last_update = time()
			async for message in websocket:
				print(message)
				if time() < last_update + 0.02:
					continue
				last_update = time()

				message = json.loads(message)
				
				pwms = [0] * SERVOS
				for i, s_pwm in enumerate(message["servos"]):
					pwms[i] = s_pwm

				motors = []
				for m_pwm, m_dir in message["motors"]:
					motors.append(m_pwm)
					motors.append(255 if m_dir else 0)

				custom = 0
				if "custom" in message:
					custom = message["custom"]

				if len(pwms) < 1:
					continue

				data_length = len(pwms)+len(motors)+1
				buff = bytearray(3+data_length)
				buff[0] = 2  # STX
				buff[1] = data_length  # Number bytes
				buff[2: 2+len(pwms)] = bytearray(pwms)  # PWMs
				buff[2+len(pwms): -2] = bytearray(motors)  # Motors
				buff[-2] = custom
				buff[-1] = sum(buff[2:-1]) % 256  # Checksum
				ser.write(buff)

				await read_serial_to_socket(websocket)

		async with websockets.serve(socket_handler, "0.0.0.0", socket_port):
			await asyncio.Future()

try:
	asyncio.run(main())
except KeyboardInterrupt:
	exit(0)
