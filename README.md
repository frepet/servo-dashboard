# Servo Dashboard

This is a project to remotely control servos robots from a web frontend using Svelte and MQTT.

## Communication

The Servo Dashboard communicated to the robot using MQTT.
Due to security reasons only locally hosted MQTT Brokers are supported.
However, the locally hosted broker can be set up to proxy all traffic to a remote broker.

This is an example config for Mosquitto:

```conf
# Bridge settings
connection my-bridge
address <REMOTE_BROKER_URL>:<REMOTE_BROKER_PORT>
topic # in 0
topic # out 0
try_private false
bridge_protocol_version mqttv311
cleansession true

# If your remote broker requires authentication
remote_username <REMOTE_USERNAME>
remote_password <REMOTE_PASSWORD>

# MQTT listener
# Used to proxy other MQTT traffic such as from `mqttui`
listener 1883
protocol mqtt
allow_anonymous true

# WebSocket listener
# Used by the Servo Dashboard
listener 9001 # Change port if there are conflicts, must be same as selected in Servo Dashboard.
protocol websockets

```

# Developing the Sveltekit component

## Starting the application

The application can run directly using node and an external postgres database or using docker-compose to run both the application and a local database.

### External Database (Node)

Install dependencies:

```bash
npm install
```

Start server:

```bash
DATABASE_URL="POSTGRES CONNECTION STRING" npm run dev
```

### Local Database (Docker)

Start the local database:

```bash
docker-compose up -d db
```

Init theme and create database table (just needed once):

```bash
npm run smui-theme-dark

docker exec servo-dashboard_db_1  psql -U servodashboard -c 'CREATE TABLE states (
  uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state JSON
);'
```

Set environment variables and start dev server:

```bash
export DATABASE_URL=postgres://servodashboard:somelongsecret@localhost:5432
export NO_SSL="true"
npm run dev -- --open
```

Create new save state:

```bash
curl -X POST localhost:8080/api/states -H 'Content-Type: application/json' -d '{"name": "","deadzones": [],"servos": [],"skidsteers": [],"macros": [],"swapButton": -1}'
```

## Building

To create a production version of the app:

```bash
npm run build
```
