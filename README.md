# Stomble-REST

## Setup:

In the root directory
```
npm install
```
When in development:
```
nodemon index.js
```
Else simply:
```
node index.js
```

By default the server runs on PORT 3000 (can be updated in index.js).\
Open http://localhost:3000/

## Features (TODO list):

- [X] Add spaceships: a spaceship must have an id, name, model, location (made up of a city and a planet) and its status (decommissioned, maintenance or operational).
```
POST localhost:PORT/ships 
{
  "name": 'A',
  "model": modelA,
  "location": ['cityName', 'planetName'],
  "status": "O"
}
```
- [X] Update the spaceship status: to one of the 3 possible states.
```
PUT localhost:PORT/ships 
{
  "status": "M"
}
```
- [X] Add a location: a location must have an id, city name and a planet name; as well as the spaceport capacity (how many spaceships can be stationed at this location simultaneously).
```
POST localhost:PORT/locations 
{
  "cname": 'cloudy',
  "pname": alienation,
  "capacity": 10
}
```
- [X] Remove spaceships: given a spaceship’s id.
```
DELETE localhost:PORT/ships/id
```
- [X] Remove location: given a location’s id.
```
DELETE localhost:PORT/locations/id
```
- [X] Travel functionality: Travel involves changing the location of the spaceship and adjusting the capacity of the source and destination spaceports. Before carrying out the travel transaction, check these two factors:
o	The spaceport capacity of the destination (if not, return an appropriate error).
o	The status of the spaceship (only operational spaceships can travel).
```
PUT localhost:PORT/ships/travel/id
{
  "cname": "destinationCity",
  "pname": "destinationPlanet"
}
```

## Additional routes:

- List all the spaceships with  info
```
GET localhost:PORT/ships/list
```
- List spaceship info for particular id
```
GET localhost:PORT/ships/id
```
- List all the locations with info
```
GET localhost:PORT/locations/list
```
- List location info for particular id
```
GET localhost:PORT/locations/id
```
