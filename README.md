# Servo Dashboard
This is a project to remotely control servos/motors.
The communication chain consists of three parts and are connected in the following way:

```
Web Page <-Web Socket-> Python Reciever <-Serial-> Arduino Receiver
```

## Wireless over Serial
If wireless control is wanted over serial then the Python Receiver should be running on the same machine as the Web Page is opened in. The Serial interface between the machine and the Arduino should then be wireless.

## Wireless over Internet
If wireless control is wanted over internet then the Python Receiver can be started on a remote machine. This would then need a tunnel from localhost to the remote machine, since the Web Page will always try to connect to localhost due to security reasons.


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
