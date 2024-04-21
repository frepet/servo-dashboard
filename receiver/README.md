# Servo Dashboard Receiver
This python receiver should run on the same system that uses the homepage.
However, it is possible the forward the WebSocket traffic to a remote if desired.

There are two receivers. The first one, `ws2serial.py`, will convert the WebSocket data to a format for serial communication
and send it to a specified serial port.

The second receiver, `ws2mqtt.py`,  will connect to a MQTT Broker and update topics at `<root topic>`. E.g: 
`myRobot/servos/0` will hold the integer value for the first servo if the *root topic* is *myRobot*.

## Environment Variables
The MQTT receiver needs a file called `.env` placed at the path `servo-dashboard/receiver/.env`.
The file should have the following environment variables defined:
```sh
MQTT_BROKER='<URL to broker without any protocol prefix>'
MQTT_PORT=1883
MQTT_USERNAME='<mqtt username>'
MQTT_PASSWORD='<mqtt password>'
MQTT_TOPIC_ROOT='<root topic>'
```

## Requirements
Always create a virtual environment for the receiver. E.g:
```sh
python -m venv venv
```

Then activate the virtual environment and install the needed requirements:
```sh
. ./venv/bin/activate
pip install -r requirements.txt
```

