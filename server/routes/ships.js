const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const methodOverride = require('method-override');

const path = require('path');

const router = express.Router();
// handling put and delete requests
router.use(methodOverride('_method'));

// handling json post requests
router.use(express.json());
// form-urlencoded requests
router.use(bodyParser.urlencoded({ extended: true }));

// get ships root page
router.get('/', (req, res) => {
    //res.send('Ship Page');
    //res.sendFile('/_programming/Stomble/Stomble-REST/server/views/ships.html');
    res.sendFile(path.join(__dirname, '../')+'views/ships.html');
})

// dedicated page for travel functionality
router.get('/travel', (req, res) => {
    //res.send('Travel page');
    res.sendFile(path.join(__dirname, '../')+'views/travel.html');
});

router.put('/travel/', (req, res) => {
    // read the ships file
    let rawShip = fs.readFileSync('./data/ships.json');
    let jShip = JSON.parse(rawShip);
    
    // check status of the ship
    const ship = jShip.find(c => c.id === parseInt(req.body.id));
    if (!ship) return res.status(404).send('Ship with given id does not exist!');
    if (ship.status != "O") return res.status(400).send('Ship with given id is not operational!');

    // read the locations file
    let rawLoc = fs.readFileSync('./data/locations.json');
    let jLoc = JSON.parse(rawLoc);

    // find location with requested city and planet
    const loc = jLoc.find(c => c.cname === req.body.cname && c.pname === req.body.pname);
    // location not found error
    if (!loc) return res.status(400).send('Location with given name does not exist!');

    // destination same as origin
    const location_string='['+req.body.cname+','+req.body.pname+']';
    if (location_string===ship.location) return res.status(400).send('Present location is the destination!');

    // location found, check destination capacity
    if (parseInt(loc.capacity) < 1) return res.status(400).send('Location has reached max capacity!');
    
    // update the capacity of the old location
    let loc_old = jLoc.find(c => '['+c.cname+','+c.pname+']' === ship.location);//.toString() && c.pname === ship.location[1].toString());
    loc_old.capacity = parseInt(loc_old.capacity) + 1;

    // change location
    ship.location = location_string;
    // ship.location[0] = req.body.cname;
    // ship.location[1] = req.body.pname;

    // decrease location capacity
    loc.capacity = parseInt(loc.capacity)-1;

    // write the changes back to the data files
    fs.writeFileSync('./data/ships.json', JSON.stringify(jShip));
    fs.writeFileSync('./data/locations.json', JSON.stringify(jLoc));
    
    // send modified ship object as response    
    res.end(JSON.stringify(ship, null, 3));

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
    if (!req.body.name || !req.body.model || !req.body.cname || !req.body.pname || !req.body.status){
        res.status(400).send('name, model, location, status are required, cannot be blank!');
        return;
    }

    // read the ships file
    let rawShip = fs.readFileSync('./data/ships.json');
    let jShip = JSON.parse(rawShip);
    
    // read the locations file
    let rawLoc = fs.readFileSync('./data/locations.json');
    let jLoc = JSON.parse(rawLoc);

    // validate city name
    const checkCity = jLoc.find(c => c.cname === req.body.cname);
    if (!checkCity) return res.status(400).send('City name does not exist in locations list!');
    // validate planet name
    const checkPlanet = jLoc.find(c => c.pname === req.body.pname);
    if (!checkPlanet) return res.status(400).send('Planet name does not exist in locations list!');

    // location found, check destination capacity
    const loc = jLoc.find(c => c.cname === req.body.cname && c.pname === req.body.pname);
    if (loc.capacity < 1) return res.status(400).send('Location has reached max capacity!');

    // validate status 
    validStatus = ["D", "O", "M"];
    if(!validStatus.includes(req.body.status)) {
        res.status(400).send('Invalid status value!');
        return;
    }
    //
    const jsonLocation = "["+req.body.cname+","+req.body.pname+"]";
    // decrease location capacity count
    loc.capacity = loc.capacity - 1;

    const ship = {
        id: jShip.length+1,
        name: req.body.name,
        model: req.body.model,
        location: jsonLocation,
        status: req.body.status
    };

    // write changes to the ships file
    jShip.push(ship);
    fs.writeFileSync('./data/ships.json', JSON.stringify(jShip));
    fs.writeFileSync('./data/locations.json', JSON.stringify(jLoc));

    res.send(ship);
});

// update ship status
router.put('/', (req, res) => {
    // read the ships file
    let rawShip = fs.readFileSync('./data/ships.json');
    let jShip = JSON.parse(rawShip);

    const ship = jShip.find(c => c.id === parseInt(req.body.id));
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
router.delete('/', (req, res) => {
    // read the ships file
    let rawShip = fs.readFileSync('./data/ships.json');
    let jShip = JSON.parse(rawShip);

    const ship = jShip.find(c => c.id === parseInt(req.body.id));
    if (!ship) {
        res.status(404).send('Ship with given id does not exist');
        return;
    }

    // update location count (increase by one)
    let rawLoc = fs.readFileSync('./data/locations.json');
    let jLoc = JSON.parse(rawLoc);

    const loc = jLoc.find(c => '['+c.cname+','+c.pname+']'===ship.location);
    loc.capacity = parseInt(loc.capacity) + 1;
    
    // delete ship with this id
    const index = jShip.indexOf(ship);
    jShip.splice(index, 1);

    // update the data in the files
    fs.writeFileSync('./data/ships.json', JSON.stringify(jShip));
    fs.writeFileSync('./data/locations.json', JSON.stringify(jLoc));
    res.send(ship);
});


module.exports = router;
