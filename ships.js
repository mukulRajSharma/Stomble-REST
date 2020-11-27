const { json } = require('body-parser');
const express = require('express');
const fs = require('fs');

const router = express.Router();

// handling json post requests
router.use(express.json());

// get ships root page
router.get('/', (req, res) => {
    res.send('Ships page');
})

// dedicated page for travel functionality
router.get('/travel', (req, res) => {
    res.send('Travel page');
});

router.put('/travel/:id', (req, res) => {
    // read the ships file
    let rawShip = fs.readFileSync('./data/ships.json');
    let jShip = JSON.parse(rawShip);
    
    // check status of the ship
    const ship = jShip.find(c => c.id === parseInt(req.params.id));
    if (!ship) return res.status(400).send('Ship with given id does not exist!');
    if (ship.status != "O") return res.status(400).send('Ship with given id is not operational!');

    // read the locations file
    let rawLoc = fs.readFileSync('./data/locations.json');
    let jLoc = JSON.parse(rawLoc);

    // find location with requested city and planet
    const loc = jLoc.find(c => c.cname === req.body.cname && c.pname === req.body.pname);
    // location not found error
    if (!loc) return res.status(400).send('Location with given name does not exist!');

    // destination same as origin
    if (req.body.cname === ship.location[0] && req.body.pname === ship.location[1]) return res.status(400).send('Present location is the destination!');

    // location found, check destination capacity
    if (loc.capacity < 1) return res.status(400).send('Location has reached max capacity!');

    // update the capacity of the old location
    const loc_old = jLoc.find(c => c.cname === ship.location[0] && c.pname === ship.location[1]);
    loc_old.capacity = loc_old.capacity + 1;

    // change location
    ship.location[0] = req.body.cname;
    ship.location[1] = req.body.pname;

    // decrease location capacity
    loc.capacity = loc.capacity-1;

    // write the changes back to the data files
    fs.writeFileSync('./data/ships.json', JSON.stringify(jShip));
    fs.writeFileSync('./data/locations.json', JSON.stringify(jLoc));
    
    // send modified ship object as response    
    res.end(ship);

});

// get ship by id
router.get('/:id', (req, res) => {
    // read the ships file
    let rawShip = fs.readFileSync('./data/ships.json');
    let jShip = JSON.parse(rawShip);

    // to list all ships
    if (req.params.id == 'list'){
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(jShip, null, 3));
        return;
    }
    // to list ship by id
    const ship = jShip.find(c => c.id === parseInt(req.params.id));
    if(!ship) {
        res.status(404).end('Ship with the given id does not exist');
        return;
    }
    res.end(JSON.stringify(ship, null, 3));
});

// post ship to ships list
router.post('/', (req, res) => {
    // minimal input validation
    if (!req.body.name || !req.body.model || !req.body.location || !req.body.status){
        res.status(400).send('name, model, location, capacity are required, cannot be blank!');
        return;
    }

    // read the ships file
    let rawShip = fs.readFileSync('./data/ships.json');
    let jShip = JSON.parse(rawShip);
    
    // read the locations file
    let rawLoc = fs.readFileSync('./data/locations.json');
    let jLoc = JSON.parse(rawLoc);

    // validate city name
    const checkCity = jLoc.find(c => c.cname === req.body.location[0]);
    if (!checkCity) return res.status(400).send('City name does not exist in locations list!');
    // validate planet name
    const checkPlanet = jLoc.find(c => c.pname === req.body.location[1]);
    if (!checkPlanet) return res.status(400).send('Planet name does not exist in locations list!');

    // location found, check destination capacity
    const loc = jLoc.find(c => c.cname === req.body.location[0] && c.pname === req.body.location[1]);
    if (loc.capacity < 1) return res.status(400).send('Location has reached max capacity!');

    // validate status 
    validStatus = ["D", "O", "M"];
    if(!validStatus.includes(req.body.status)) {
        res.status(400).send('Invalid status value!');
        return;
    }
    
    // decrease location capacity count
    loc.capacity = loc.capacity - 1;

    const ship = {
        id: jShip.length+1,
        name: req.body.name,
        model: req.body.model,
        location: req.body.location,
        status: req.body.status
    };

    // write changes to the ships file
    jShip.push(ship);
    fs.writeFileSync('./data/ships.json', JSON.stringify(jShip));
    fs.writeFileSync('./data/locations.json', JSON.stringify(jLoc));

    res.send(ship);
});

// update ship status
router.put('/:id', (req, res) => {
    // read the ships file
    let rawShip = fs.readFileSync('./data/ships.json');
    let jShip = JSON.parse(rawShip);

    const ship = jShip.find(c => c.id === parseInt(req.params.id));
    if (!ship) {
        res.status(404).send('Ship with given id not found!');
        return;
    }
    // decomisioned, operational, maintenance
    validStatus = ["D", "O", "M"];
    if(!validStatus.includes(req.body.status)) {
        res.status(400).send('Invalid status value!');
        return;
    }

    // write the updated status back to the file
    ship.status = req.body.status;
    fs.writeFileSync('./data/ships.json', JSON.stringify(jShip));

    res.send(ship);
});

// delete ship with given id
router.delete('/:id', (req, res) => {
    // read the ships file
    let rawShip = fs.readFileSync('./data/ships.json');
    let jShip = JSON.parse(rawShip);

    const ship = jShip.find(c => c.id === parseInt(req.params.id));
    if (!ship) {
        res.status(404).send('Ship with given id does not exist');
        return;
    }
    const index = jShip.indexOf(ship);
    jShip.splice(index, 1);

    fs.writeFileSync('./data/ships.json', JSON.stringify(jShip));
    res.send(ship);
});


module.exports = router;
